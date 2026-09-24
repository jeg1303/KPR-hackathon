export interface StaticFinding {
  pattern: string
  category: 'security' | 'bug' | 'performance' | 'maintainability' | 'style'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  file: string
  line: number
  code: string
}

interface AnalysisPattern {
  regex: RegExp
  category: 'security' | 'bug' | 'performance' | 'maintainability' | 'style'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
}

const SECURITY_PATTERNS: AnalysisPattern[] = [
  {
    regex: /["'`]SELECT\s+.*FROM\s+.*\+\s*[\w.[\]]+|[\w.[\]]+\s*\+\s*["'`].*SELECT/gi,
    category: 'security',
    severity: 'critical',
    title: 'SQL Injection - String Concatenation',
    description: 'SQL query built with string concatenation'
  },
  {
    regex: /\$\{[^}]*\}.*SELECT|SELECT.*\$\{[^}]*\}/gi,
    category: 'security',
    severity: 'critical',
    title: 'SQL Injection - Template Literal',
    description: 'SQL query uses template literals with variables'
  },
  {
    regex: /sk_live_[a-zA-Z0-9]{24,}|sk_test_[a-zA-Z0-9]{24,}/g,
    category: 'security',
    severity: 'critical',
    title: 'Hardcoded Stripe API Key',
    description: 'Stripe API key hardcoded in source'
  },
  {
    regex: /whsec_[a-zA-Z0-9]{24,}/g,
    category: 'security',
    severity: 'high',
    title: 'Hardcoded Webhook Secret',
    description: 'Webhook secret hardcoded in source'
  },
  {
    regex: /AKIA[0-9A-Z]{16}/g,
    category: 'security',
    severity: 'critical',
    title: 'Hardcoded AWS Access Key',
    description: 'AWS access key found in source code'
  },
  {
    regex: /AIza[0-9A-Za-z\\-_]{35}/g,
    category: 'security',
    severity: 'critical',
    title: 'Hardcoded Google API Key',
    description: 'Google API key found in source code'
  },
  {
    regex: /ghp_[a-zA-Z0-9]{36}|gho_[a-zA-Z0-9]{36}/g,
    category: 'security',
    severity: 'critical',
    title: 'Hardcoded GitHub Token',
    description: 'GitHub personal access token in source'
  },
  {
    regex: /password\s*[:=]\s*["'][^"']{3,}["']/gi,
    category: 'security',
    severity: 'high',
    title: 'Hardcoded Password',
    description: 'Password hardcoded in source code'
  },
  {
    regex: /exec\(|eval\(|Function\(/gi,
    category: 'security',
    severity: 'high',
    title: 'Dangerous Code Execution',
    description: 'Use of eval() or exec() can execute arbitrary code'
  },
  {
    regex: /jwt\.verify\([^,]+,\s*["'][^"']+["']/gi,
    category: 'security',
    severity: 'critical',
    title: 'Hardcoded JWT Secret',
    description: 'JWT secret key is hardcoded'
  },
  {
    regex: /md5\(|MD5\(/gi,
    category: 'security',
    severity: 'medium',
    title: 'Weak Cryptography - MD5',
    description: 'MD5 is cryptographically broken'
  },
  {
    regex: /\.innerHTML\s*=\s*[^;]+(?:req\.|request\.|params\.|query\.)/gi,
    category: 'security',
    severity: 'high',
    title: 'XSS Vulnerability - innerHTML',
    description: 'User input assigned to innerHTML'
  },
];

const BUG_PATTERNS: AnalysisPattern[] = [
  {
    regex: /\.\w+\s*\(/gm,
    category: 'bug',
    severity: 'medium',
    title: 'Potential Null Reference',
    description: 'Method call without null check (requires context)'
  },
  {
    regex: /catch\s*\([^)]*\)\s*\{\s*\}/gm,
    category: 'bug',
    severity: 'medium',
    title: 'Empty Catch Block',
    description: 'Error silently ignored'
  },
  {
    regex: /==\s*null|null\s*==/g,
    category: 'bug',
    severity: 'low',
    title: 'Loose Null Comparison',
    description: 'Use strict equality (===) for null checks'
  },
  {
    regex: /console\.(log|error|warn|info)\(/g,
    category: 'maintainability',
    severity: 'low',
    title: 'Console Statement',
    description: 'Debug console statement in code'
  },
];

const PERFORMANCE_PATTERNS: AnalysisPattern[] = [
  {
    regex: /for\s*\([^)]*\)\s*\{[^}]*await\s+fetch\(/gm,
    category: 'performance',
    severity: 'high',
    title: 'N+1 API Calls in Loop',
    description: 'Sequential API calls in loop'
  },
  {
    regex: /for\s*\([^)]*\)\s*\{[^}]*await\s+.*\.query\(/gm,
    category: 'performance',
    severity: 'high',
    title: 'N+1 Database Queries',
    description: 'Sequential database queries in loop'
  },
  {
    regex: /\.map\([^)]*\)\.map\(/g,
    category: 'performance',
    severity: 'low',
    title: 'Multiple Array Iterations',
    description: 'Chained map() calls iterate multiple times'
  },
];

export function runStaticAnalysis(diff: string): StaticFinding[] {
  const findings: StaticFinding[] = [];
  const allPatterns = [...SECURITY_PATTERNS, ...BUG_PATTERNS, ...PERFORMANCE_PATTERNS];
  
  // Parse diff to extract added lines
  const lines = diff.split('\n');
  let currentFile = '';
  let lineNumber = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track current file
    if (line.startsWith('diff --git')) {
      const match = line.match(/b\/(.*?)$/);
      if (match) {
        currentFile = match[1];
      }
    }
    
    // Track line numbers
    if (line.startsWith('@@')) {
      const match = line.match(/\+(\d+)/);
      if (match) {
        lineNumber = parseInt(match[1]);
      }
      continue;
    }
    
    // Only analyze added lines
    if (!line.startsWith('+') || line.startsWith('+++')) {
      if (!line.startsWith('-')) {
        lineNumber++;
      }
      continue;
    }
    
    const code = line.substring(1); // Remove leading +
    
    // Check against all patterns
    for (const pattern of allPatterns) {
      // Reset regex lastIndex for global flags
      pattern.regex.lastIndex = 0;
      
      if (pattern.regex.test(code)) {
        findings.push({
          pattern: pattern.title,
          category: pattern.category,
          severity: pattern.severity,
          title: pattern.title,
          file: currentFile,
          line: lineNumber,
          code: code.trim()
        });
      }
    }
    
    lineNumber++;
  }
  
  return findings;
}

export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'go': 'go',
    'rb': 'ruby',
    'php': 'php',
    'cs': 'csharp',
    'cpp': 'cpp',
    'c': 'c',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
  };
  
  return languageMap[ext || ''] || 'text';
}

export function extractFilesFromDiff(diff: string): string[] {
  const files: string[] = [];
  const lines = diff.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      const match = line.match(/b\/(.*?)$/);
      if (match) {
        files.push(match[1]);
      }
    }
  }
  
  return files;
}

export function countChanges(diff: string): { added: number; deleted: number; modified: number } {
  const lines = diff.split('\n');
  let added = 0;
  let deleted = 0;
  
  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      added++;
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      deleted++;
    }
  }
  
  return {
    added,
    deleted,
    modified: Math.min(added, deleted)
  };
}
