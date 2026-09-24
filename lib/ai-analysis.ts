import { StaticFinding } from './static-analysis';
import { ParsedDiff } from './diff-parser';

export interface AIFinding {
  title: string;
  category: 'security' | 'bug' | 'performance' | 'maintainability' | 'style';
  severity: 'critical' | 'high' | 'medium' | 'low';
  certainty: 'certain' | 'likely' | 'suggestion';
  confidence: number;
  file: string;
  lineStart: number;
  lineEnd: number;
  evidence: string;
  explanation: string;
  impact: string;
  suggestedFix: string;
  fixPatch?: string;
  testCase?: string;
}

export interface AIAnalysisRequest {
  diff: string;
  parsedDiff: ParsedDiff;
  staticFindings: StaticFinding[];
  files: string[];
}

export interface AIAnalysisResponse {
  findings: AIFinding[];
  summary?: string;
  analysisTime?: number;
}

const SYSTEM_PROMPT = `You are an expert software security and reliability reviewer specializing in code analysis.

Your task is to analyze code changes and identify:
- Security vulnerabilities (SQL injection, XSS, hardcoded secrets, etc.)
- Bugs (null references, error handling, logic errors)
- Performance issues (N+1 queries, inefficient algorithms)
- Maintainability problems (code smells, complexity)

CRITICAL REQUIREMENTS:

1. CERTAINTY LEVELS:
   - "certain": Definite bug or vulnerability with clear evidence
   - "likely": Probable issue based on common patterns
   - "suggestion": Stylistic or minor improvement

2. EVIDENCE-BASED ANALYSIS:
   - Base findings only on the supplied diff and static analysis evidence
   - Do NOT invent vulnerabilities without evidence
   - If evidence is insufficient, mark as "likely" or "suggestion"

3. CONFIDENCE SCORES:
   - 0.95-1.0: Absolute certainty with clear evidence
   - 0.85-0.94: High confidence, clear pattern match
   - 0.70-0.84: Moderate confidence, probable issue
   - 0.50-0.69: Lower confidence, suggestion

4. PRIORITIZATION:
   - Focus on high-confidence, actionable findings
   - Avoid reporting minor style issues as bugs
   - Critical/High severity should be reserved for real security/reliability issues

5. OUTPUT FORMAT:
Return valid JSON only, no markdown:
{
  "findings": [
    {
      "title": "Descriptive title",
      "category": "security|bug|performance|maintainability|style",
      "severity": "critical|high|medium|low",
      "certainty": "certain|likely|suggestion",
      "confidence": 0.95,
      "file": "path/to/file.js",
      "lineStart": 42,
      "lineEnd": 45,
      "evidence": "Specific code pattern or evidence",
      "explanation": "Why this is a problem",
      "impact": "What could happen in production",
      "suggestedFix": "How to fix it with code example",
      "testCase": "Test case that would catch this"
    }
  ]
}

For each finding provide:
- Exact location (file, line numbers)
- Clear evidence from the diff
- Explanation of the issue
- Production impact
- Concrete fix with code
- Test case to prevent regression

Do not hallucinate issues. Be precise and actionable.`;

async function callOpenAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');
  
  const model = process.env.AI_MODEL || 'gpt-4-turbo-preview';
  
  const userPrompt = buildUserPrompt(request);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(content);
    
    return {
      findings: result.findings || [],
      summary: result.summary,
    };
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

async function callAnthropic(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');
  
  const model = process.env.AI_MODEL || 'claude-3-sonnet-20240229';
  
  const userPrompt = buildUserPrompt(request);
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} ${error}`);
    }
    
    const data = await response.json();
    const content = data.content[0].text;
    
    // Extract JSON from potential markdown code blocks
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    
    const result = JSON.parse(jsonMatch[0]);
    
    return {
      findings: result.findings || [],
      summary: result.summary,
    };
  } catch (error) {
    console.error('Anthropic API call failed:', error);
    throw error;
  }
}

function buildUserPrompt(request: AIAnalysisRequest): string {
  const { diff, parsedDiff, staticFindings, files } = request;
  
  let prompt = `Analyze the following code changes for security vulnerabilities, bugs, performance issues, and maintainability problems.\n\n`;
  
  prompt += `FILES CHANGED (${files.length}):\n`;
  prompt += files.map(f => `- ${f}`).join('\n');
  prompt += `\n\n`;
  
  prompt += `DIFF SUMMARY:\n`;
  prompt += `- Files changed: ${parsedDiff.summary.filesChanged}\n`;
  prompt += `- Lines added: ${parsedDiff.summary.additions}\n`;
  prompt += `- Lines deleted: ${parsedDiff.summary.deletions}\n`;
  prompt += `\n`;
  
  if (staticFindings.length > 0) {
    prompt += `STATIC ANALYSIS EVIDENCE:\n`;
    prompt += `Found ${staticFindings.length} potential issues:\n\n`;
    
    for (const finding of staticFindings) {
      prompt += `- ${finding.title} (${finding.severity})\n`;
      prompt += `  File: ${finding.file}:${finding.line}\n`;
      prompt += `  Code: ${finding.code}\n`;
      prompt += `\n`;
    }
  }
  
  prompt += `\nCODE DIFF:\n\`\`\`diff\n${diff}\n\`\`\`\n\n`;
  
  prompt += `Provide your analysis as structured JSON with high-confidence, actionable findings only.`;
  
  return prompt;
}

export async function analyzeWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  const provider = process.env.AI_PROVIDER || 'openai';
  const startTime = Date.now();
  
  try {
    let response: AIAnalysisResponse;
    
    switch (provider.toLowerCase()) {
      case 'anthropic':
      case 'claude':
        response = await callAnthropic(request);
        break;
      case 'openai':
      default:
        response = await callOpenAI(request);
        break;
    }
    
    response.analysisTime = Date.now() - startTime;
    return response;
    
  } catch (error) {
    console.error('AI analysis failed:', error);
    throw error;
  }
}

export function validateAIFindings(findings: any[]): AIFinding[] {
  const validated: AIFinding[] = [];
  
  for (const finding of findings) {
    // Validate required fields
    if (!finding.title || !finding.category || !finding.severity || 
        !finding.certainty || !finding.file) {
      console.warn('Invalid finding skipped:', finding);
      continue;
    }
    
    // Validate enums
    if (!['security', 'bug', 'performance', 'maintainability', 'style'].includes(finding.category)) {
      console.warn('Invalid category:', finding.category);
      continue;
    }
    
    if (!['critical', 'high', 'medium', 'low'].includes(finding.severity)) {
      console.warn('Invalid severity:', finding.severity);
      continue;
    }
    
    if (!['certain', 'likely', 'suggestion'].includes(finding.certainty)) {
      console.warn('Invalid certainty:', finding.certainty);
      continue;
    }
    
    // Ensure confidence is between 0 and 1
    const confidence = Math.max(0, Math.min(1, finding.confidence || 0.5));
    
    validated.push({
      title: finding.title,
      category: finding.category,
      severity: finding.severity,
      certainty: finding.certainty,
      confidence,
      file: finding.file,
      lineStart: finding.lineStart || 1,
      lineEnd: finding.lineEnd || finding.lineStart || 1,
      evidence: finding.evidence || '',
      explanation: finding.explanation || '',
      impact: finding.impact || '',
      suggestedFix: finding.suggestedFix || '',
      fixPatch: finding.fixPatch,
      testCase: finding.testCase,
    });
  }
  
  return validated;
}
