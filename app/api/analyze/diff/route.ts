import { NextRequest, NextResponse } from 'next/server';
import { parseDiff } from '@/lib/diff-parser';
import { runStaticAnalysis, extractFilesFromDiff } from '@/lib/static-analysis';
import { analyzeWithAI, validateAIFindings } from '@/lib/ai-analysis';
import { calculateRiskScore } from '@/lib/risk-engine';
import { generateId } from '@/lib/utils';

const MAX_DIFF_SIZE = 10 * 1024 * 1024; // 10MB
const ANALYSIS_TIMEOUT = 120000; // 2 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diff } = body;

    if (!diff || typeof diff !== 'string') {
      return NextResponse.json(
        { error: 'Diff content is required' },
        { status: 400 }
      );
    }

    // Validate diff size
    if (diff.length > MAX_DIFF_SIZE) {
      return NextResponse.json(
        { error: 'Diff size exceeds maximum limit of 10MB' },
        { status: 413 }
      );
    }

    // Parse diff
    const parsedDiff = parseDiff(diff);
    
    if (parsedDiff.files.length === 0) {
      return NextResponse.json(
        { error: 'No valid diff content found' },
        { status: 400 }
      );
    }

    // Extract file list
    const files = extractFilesFromDiff(diff);

    // Run static analysis
    const staticFindings = runStaticAnalysis(diff);

    // Try AI analysis with fallback
    let aiFindings: any[] = [];
    let useAI = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    
    if (useAI) {
      try {
        const analysisResult = await Promise.race([
          analyzeWithAI({
            diff,
            parsedDiff,
            staticFindings,
            files,
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Analysis timeout')), ANALYSIS_TIMEOUT)
          ),
        ]) as any;

        aiFindings = validateAIFindings(analysisResult.findings || []);
      } catch (aiError: any) {
        console.error('AI analysis failed, using static analysis only:', aiError);
        // Continue with static analysis only
      }
    }

    // Combine findings (prioritize AI findings, but include static findings not covered by AI)
    const allFindings = aiFindings.length > 0 ? aiFindings : 
      staticFindings.map(f => ({
        title: f.title,
        category: f.category,
        severity: f.severity,
        certainty: 'likely' as const,
        confidence: 0.75,
        file: f.file,
        lineStart: f.line,
        lineEnd: f.line,
        evidence: f.code,
        explanation: `Static analysis detected: ${f.pattern}`,
        impact: 'This pattern may indicate a potential issue that should be reviewed.',
        suggestedFix: 'Review the code and apply appropriate fixes based on the issue type.',
      }));

    // Calculate risk score
    const riskScore = calculateRiskScore(allFindings);

    // Create review ID
    const reviewId = generateId();

    // Store review (in-memory for demo)
    if (typeof global !== 'undefined') {
      if (!global.demoReviews) {
        global.demoReviews = new Map();
      }
      global.demoReviews.set(reviewId, {
        id: reviewId,
        diff,
        findings: allFindings,
        riskScore,
        analysisType: 'standard',
        filesChanged: parsedDiff.files.length,
        linesAdded: parsedDiff.summary.additions,
        linesDeleted: parsedDiff.summary.deletions,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      reviewId,
      message: 'Analysis completed',
      summary: {
        filesChanged: parsedDiff.files.length,
        linesAdded: parsedDiff.summary.additions,
        linesDeleted: parsedDiff.summary.deletions,
        findingsCount: allFindings.length,
        riskScore: riskScore.totalScore,
      },
    });
  } catch (error: any) {
    console.error('Diff analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
