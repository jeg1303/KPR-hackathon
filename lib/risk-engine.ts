import { DemoFinding } from './demo-data';

export interface RiskScore {
  totalScore: number; // 0-100
  releaseStatus: 'safe' | 'moderate' | 'high' | 'critical';
  categoryScores: {
    security: number;
    bug: number;
    performance: number;
    maintainability: number;
  };
  topIssues: Array<{
    title: string;
    severity: string;
    certainty: string;
    confidence: number;
    file: string;
    line: number;
  }>;
  calculation: {
    formula: string;
    weights: Record<string, number>;
    breakdown: Array<{
      finding: string;
      contribution: number;
    }>;
  };
}

const SEVERITY_WEIGHTS = {
  critical: 40,
  high: 25,
  medium: 12,
  low: 5,
};

const CERTAINTY_MULTIPLIERS = {
  certain: 1.0,
  likely: 0.7,
  suggestion: 0.3,
};

const CATEGORY_WEIGHTS = {
  security: 1.5,   // Security issues are more critical
  bug: 1.2,        // Bugs are significant
  performance: 0.8, // Performance is important but not critical
  maintainability: 0.5, // Style/maintainability least critical
  style: 0.3,
};

export function calculateRiskScore(findings: DemoFinding[]): RiskScore {
  const breakdown: Array<{ finding: string; contribution: number }> = [];
  let totalRisk = 0;
  
  const categoryScores = {
    security: 0,
    bug: 0,
    performance: 0,
    maintainability: 0,
  };
  
  // Calculate individual finding risk contributions
  for (const finding of findings) {
    const severityWeight = SEVERITY_WEIGHTS[finding.severity];
    const certaintyMultiplier = CERTAINTY_MULTIPLIERS[finding.certainty];
    const categoryWeight = CATEGORY_WEIGHTS[finding.category] || 0.5;
    const confidenceMultiplier = finding.confidence;
    
    // Base risk = severity * certainty * confidence * category_weight
    const findingRisk = 
      severityWeight * 
      certaintyMultiplier * 
      confidenceMultiplier * 
      categoryWeight;
    
    totalRisk += findingRisk;
    
    // Add to category score
    if (finding.category in categoryScores) {
      categoryScores[finding.category as keyof typeof categoryScores] += findingRisk;
    }
    
    breakdown.push({
      finding: `${finding.title} (${finding.severity}, ${finding.certainty})`,
      contribution: Math.round(findingRisk * 100) / 100,
    });
  }
  
  // Normalize to 0-100 scale
  // With typical PRs having 1-10 findings, we'll normalize based on expected max
  // Max expected: 5 critical certain bugs = 5 * 40 * 1.0 * 1.0 * 1.2 = 240
  const maxExpected = 240;
  let normalizedScore = (totalRisk / maxExpected) * 100;
  
  // Cap at 100
  normalizedScore = Math.min(100, normalizedScore);
  
  // Ensure minimum score if there are critical findings
  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  if (criticalCount > 0 && normalizedScore < 60) {
    normalizedScore = Math.max(normalizedScore, 60);
  }
  
  // Round to integer
  const finalScore = Math.round(normalizedScore);
  
  // Determine release status
  let releaseStatus: 'safe' | 'moderate' | 'high' | 'critical';
  const criticalCertainCount = findings.filter(
    f => f.severity === 'critical' && f.certainty === 'certain'
  ).length;
  
  if (criticalCertainCount > 0) {
    releaseStatus = 'critical';
  } else if (finalScore >= 70) {
    releaseStatus = 'high';
  } else if (finalScore >= 40) {
    releaseStatus = 'moderate';
  } else {
    releaseStatus = 'safe';
  }
  
  // Normalize category scores to 0-100
  const maxCategoryScore = Math.max(...Object.values(categoryScores), 1);
  const normalizedCategoryScores = {
    security: Math.round((categoryScores.security / maxCategoryScore) * 100),
    bug: Math.round((categoryScores.bug / maxCategoryScore) * 100),
    performance: Math.round((categoryScores.performance / maxCategoryScore) * 100),
    maintainability: Math.round((categoryScores.maintainability / maxCategoryScore) * 100),
  };
  
  // Get top 3 must-fix issues
  const topIssues = findings
    .filter(f => f.certainty === 'certain' || f.severity === 'critical' || f.severity === 'high')
    .sort((a, b) => {
      // Sort by severity first, then certainty, then confidence
      const aSeverity = SEVERITY_WEIGHTS[a.severity];
      const bSeverity = SEVERITY_WEIGHTS[b.severity];
      if (aSeverity !== bSeverity) return bSeverity - aSeverity;
      
      const aCertainty = CERTAINTY_MULTIPLIERS[a.certainty];
      const bCertainty = CERTAINTY_MULTIPLIERS[b.certainty];
      if (aCertainty !== bCertainty) return bCertainty - aCertainty;
      
      return b.confidence - a.confidence;
    })
    .slice(0, 3)
    .map(f => ({
      title: f.title,
      severity: f.severity,
      certainty: f.certainty,
      confidence: f.confidence,
      file: f.file,
      line: f.lineStart,
    }));
  
  return {
    totalScore: finalScore,
    releaseStatus,
    categoryScores: normalizedCategoryScores,
    topIssues,
    calculation: {
      formula: 'Risk = Σ(severity_weight × certainty_multiplier × confidence × category_weight) / max_expected × 100',
      weights: {
        critical: SEVERITY_WEIGHTS.critical,
        high: SEVERITY_WEIGHTS.high,
        medium: SEVERITY_WEIGHTS.medium,
        low: SEVERITY_WEIGHTS.low,
        certain: CERTAINTY_MULTIPLIERS.certain,
        likely: CERTAINTY_MULTIPLIERS.likely,
        suggestion: CERTAINTY_MULTIPLIERS.suggestion,
        security: CATEGORY_WEIGHTS.security,
        bug: CATEGORY_WEIGHTS.bug,
        performance: CATEGORY_WEIGHTS.performance,
        maintainability: CATEGORY_WEIGHTS.maintainability,
      },
      breakdown,
    },
  };
}

export function getReleaseRecommendation(riskScore: RiskScore): {
  icon: string;
  status: string;
  message: string;
  actions: string[];
} {
  switch (riskScore.releaseStatus) {
    case 'critical':
      return {
        icon: '🚫',
        status: 'RELEASE BLOCKED',
        message: 'Critical security or reliability issues detected. Release must be blocked until these are resolved.',
        actions: [
          'Fix all critical severity findings',
          'Address high-certainty issues',
          'Re-run analysis after fixes',
          'Consider security review',
        ],
      };
    case 'high':
      return {
        icon: '🟠',
        status: 'HIGH RISK',
        message: 'Significant issues detected. Strongly recommend fixing before release.',
        actions: [
          'Review and fix high-severity issues',
          'Address certain findings',
          'Consider additional testing',
          'Re-analyze after changes',
        ],
      };
    case 'moderate':
      return {
        icon: '🟡',
        status: 'MODERATE RISK',
        message: 'Some issues detected. Review recommended but release may proceed with caution.',
        actions: [
          'Review findings with team',
          'Address critical and high severity items',
          'Plan fixes for medium severity',
          'Monitor in production',
        ],
      };
    case 'safe':
      return {
        icon: '🟢',
        status: 'LOW RISK',
        message: 'No critical issues detected. Safe to proceed with release.',
        actions: [
          'Review any suggestions',
          'Consider addressing style improvements',
          'Proceed with standard release process',
          'Continue monitoring',
        ],
      };
  }
}
