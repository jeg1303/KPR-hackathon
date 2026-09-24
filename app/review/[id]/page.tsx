'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeXRayModal } from '@/components/code-xray/code-xray-modal';
import { BlastRadiusViz } from '@/components/blast-radius/blast-radius-viz';
import {
  Shield,
  Bug,
  Zap,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  ArrowLeft,
  Loader2,
  ChevronDown,
  ChevronRight,
  Code,
  TestTube,
  GitBranch,
} from 'lucide-react';

interface Review {
  id: string;
  prNumber?: number;
  repository?: string;
  title?: string;
  diff?: string;
  findings: any[];
  riskScore: any;
  analysisType: string;
  createdAt: string;
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params.id as string;

  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [xrayModalOpen, setXrayModalOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<any>(null);
  const [blastRadiusModalOpen, setBlastRadiusModalOpen] = useState(false);
  const [blastRadiusFinding, setBlastRadiusFinding] = useState<any>(null);

  useEffect(() => {
    fetchReview();
  }, [reviewId]);

  const fetchReview = async () => {
    try {
      const response = await fetch(`/api/review/${reviewId}`);
      
      if (!response.ok) {
        throw new Error('Review not found');
      }

      const data = await response.json();
      setReview(data.review);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'moderate': return 'text-yellow-500';
      case 'safe': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskBgColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'high': return 'bg-orange-500/10 border-orange-500/20';
      case 'moderate': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'safe': return 'bg-green-500/10 border-green-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getCertaintyBadge = (certainty: string) => {
    switch (certainty) {
      case 'certain':
        return <Badge variant="destructive" className="ml-2">🔴 CERTAIN</Badge>;
      case 'likely':
        return <Badge variant="warning" className="ml-2">🟠 LIKELY</Badge>;
      case 'suggestion':
        return <Badge variant="secondary" className="ml-2">🔵 SUGGESTION</Badge>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-5 w-5 text-red-500" />;
      case 'bug': return <Bug className="h-5 w-5 text-orange-500" />;
      case 'performance': return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'maintainability': return <FileCode className="h-5 w-5 text-blue-500" />;
      default: return <FileCode className="h-5 w-5 text-gray-500" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openXRay = (finding: any) => {
    setSelectedFinding(finding);
    setXrayModalOpen(true);
  };

  const openBlastRadius = (finding: any) => {
    setBlastRadiusFinding(finding);
    setBlastRadiusModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Analyzing code...</p>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-xl font-semibold mb-2">Review Not Found</p>
            <p className="text-gray-400 mb-4">{error || 'This review does not exist'}</p>
            <Button onClick={() => router.push('/analyze')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Analyze
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredFindings = selectedCategory === 'all' 
    ? review.findings 
    : review.findings.filter(f => f.category === selectedCategory);

  const categoryCounts = {
    security: review.findings.filter(f => f.category === 'security').length,
    bug: review.findings.filter(f => f.category === 'bug').length,
    performance: review.findings.filter(f => f.category === 'performance').length,
    maintainability: review.findings.filter(f => f.category === 'maintainability').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {review.title || 'Code Review'}
              </h1>
              {review.repository && (
                <p className="text-gray-400">
                  {review.repository} {review.prNumber && `• PR #${review.prNumber}`}
                </p>
              )}
              {review.analysisType === 'demo' && (
                <Badge variant="secondary" className="mt-2">Demo Analysis</Badge>
              )}
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                window.open(`/api/review/${reviewId}/pdf`, '_blank');
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF Report
            </Button>
          </div>
        </div>

        {/* Risk Score Card */}
        <Card className={`glass border-2 mb-8 ${getRiskBgColor(review.riskScore.releaseStatus)}`}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center md:border-r border-gray-700">
                <p className="text-gray-400 text-sm mb-2">RELEASE RISK</p>
                <p className={`text-6xl font-bold ${getRiskColor(review.riskScore.releaseStatus)}`}>
                  {review.riskScore.totalScore}
                </p>
                <p className="text-2xl font-semibold mt-2 text-gray-300">/ 100</p>
                <div className="mt-4">
                  <Badge 
                    variant={review.riskScore.releaseStatus === 'critical' ? 'destructive' : 'warning'}
                    className="text-sm px-4 py-1"
                  >
                    {review.riskScore.releaseStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-400 text-sm mb-4">CATEGORY BREAKDOWN</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">Security</span>
                      <span className="text-sm text-gray-400">{review.riskScore.categoryScores.security}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 transition-all"
                        style={{ width: `${review.riskScore.categoryScores.security}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">Bug</span>
                      <span className="text-sm text-gray-400">{review.riskScore.categoryScores.bug}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 transition-all"
                        style={{ width: `${review.riskScore.categoryScores.bug}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">Performance</span>
                      <span className="text-sm text-gray-400">{review.riskScore.categoryScores.performance}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 transition-all"
                        style={{ width: `${review.riskScore.categoryScores.performance}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">Maintainability</span>
                      <span className="text-sm text-gray-400">{review.riskScore.categoryScores.maintainability}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${review.riskScore.categoryScores.maintainability}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Must-Fix */}
        {review.riskScore.topIssues && review.riskScore.topIssues.length > 0 && (
          <Card className="glass mb-8 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                🚨 Top 3 Must-Fix Issues
              </CardTitle>
              <CardDescription>
                Critical and high-priority issues that should be addressed before release
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {review.riskScore.topIssues.map((issue: any, index: number) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
                          <h4 className="text-lg font-semibold text-white">{issue.title}</h4>
                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity.toUpperCase()}
                          </Badge>
                          {getCertaintyBadge(issue.certainty)}
                        </div>
                        <p className="text-sm text-gray-400">
                          {issue.file}:{issue.line} • Confidence: {Math.round(issue.confidence * 100)}%
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openXRay(issue);
                          }}
                        >
                          <Code className="h-4 w-4 mr-1" />
                          View Code
                        </Button>
                        <Button variant="outline" size="sm">View Fix</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blast Radius Overview - Show for high/critical findings */}
        {review.findings.some((f: any) => f.severity === 'critical' || f.severity === 'high') && (
          <Card className="glass mb-8 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <GitBranch className="h-6 w-6 text-purple-500 mr-2" />
                🌐 Blast Radius Analysis
              </CardTitle>
              <CardDescription>
                Understanding the ripple effects of critical issues across your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Show blast radius for the highest severity finding */}
              <BlastRadiusViz 
                finding={review.findings.find((f: any) => f.severity === 'critical') || review.findings.find((f: any) => f.severity === 'high')} 
              />
              
              <div className="mt-4 p-4 rounded-lg bg-purple-900/10 border border-purple-500/20">
                <p className="text-sm text-gray-300">
                  💡 <strong>Pro Tip:</strong> Click on individual findings below to view their specific blast radius and understand cascading impacts.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All ({review.findings.length})
          </Button>
          {categoryCounts.security > 0 && (
            <Button
              variant={selectedCategory === 'security' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('security')}
            >
              <Shield className="h-4 w-4 mr-1" />
              Security ({categoryCounts.security})
            </Button>
          )}
          {categoryCounts.bug > 0 && (
            <Button
              variant={selectedCategory === 'bug' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('bug')}
            >
              <Bug className="h-4 w-4 mr-1" />
              Bugs ({categoryCounts.bug})
            </Button>
          )}
          {categoryCounts.performance > 0 && (
            <Button
              variant={selectedCategory === 'performance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('performance')}
            >
              <Zap className="h-4 w-4 mr-1" />
              Performance ({categoryCounts.performance})
            </Button>
          )}
          {categoryCounts.maintainability > 0 && (
            <Button
              variant={selectedCategory === 'maintainability' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('maintainability')}
            >
              <FileCode className="h-4 w-4 mr-1" />
              Maintainability ({categoryCounts.maintainability})
            </Button>
          )}
        </div>

        {/* Findings List */}
        <div className="space-y-4">
          {filteredFindings.map((finding, index) => {
            const findingId = `finding-${index}`;
            const isExpanded = expandedFinding === findingId;

            return (
              <Card key={findingId} className="glass">
                <CardContent className="pt-6">
                  <div 
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedFinding(isExpanded ? null : findingId)}
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      {getCategoryIcon(finding.category)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{finding.title}</h3>
                          <Badge className={getSeverityColor(finding.severity)}>
                            {finding.severity}
                          </Badge>
                          {getCertaintyBadge(finding.certainty)}
                          <Badge variant="outline" className="text-xs">
                            {Math.round(finding.confidence * 100)}% confident
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">
                          {finding.file}:{finding.lineStart}-{finding.lineEnd}
                        </p>
                        {!isExpanded && (
                          <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                            {finding.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pl-9 space-y-6 border-l-2 border-blue-500 ml-2">
                      {/* Explanation */}
                      <div>
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">WHY IS THIS A PROBLEM?</h4>
                        <p className="text-gray-300">{finding.explanation}</p>
                      </div>

                      {/* Evidence */}
                      <div>
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">EVIDENCE</h4>
                        <p className="text-gray-300">{finding.evidence}</p>
                      </div>

                      {/* Impact */}
                      {finding.impact && (
                        <div>
                          <h4 className="text-sm font-semibold text-blue-400 mb-2">POTENTIAL IMPACT</h4>
                          <p className="text-gray-300 whitespace-pre-line">{finding.impact}</p>
                        </div>
                      )}

                      {/* Suggested Fix */}
                      {finding.suggestedFix && (
                        <div>
                          <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center justify-between">
                            <span>SUGGESTED FIX</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(finding.suggestedFix);
                              }}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                          </h4>
                          <pre className="text-sm bg-gray-950 p-4 rounded-lg overflow-x-auto">
                            <code className="text-gray-300">{finding.suggestedFix}</code>
                          </pre>
                        </div>
                      )}

                      {/* Test Case */}
                      {finding.testCase && (
                        <div>
                          <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center justify-between">
                            <span className="flex items-center">
                              <TestTube className="h-4 w-4 mr-1" />
                              GENERATED TEST
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(finding.testCase);
                              }}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                          </h4>
                          <pre className="text-sm bg-gray-950 p-4 rounded-lg overflow-x-auto">
                            <code className="text-gray-300">{finding.testCase}</code>
                          </pre>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            openXRay(finding);
                          }}
                        >
                          <Code className="h-4 w-4 mr-1" />
                          View in Code X-Ray
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            openBlastRadius(finding);
                          }}
                        >
                          <GitBranch className="h-4 w-4 mr-1" />
                          View Blast Radius
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredFindings.length === 0 && (
          <Card className="glass">
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-semibold mb-2">No {selectedCategory} issues found</p>
              <p className="text-gray-400">
                {selectedCategory === 'all' 
                  ? 'This code looks good!' 
                  : `Try viewing other categories`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Code X-Ray Modal */}
      <CodeXRayModal
        isOpen={xrayModalOpen}
        onClose={() => setXrayModalOpen(false)}
        finding={selectedFinding}
        fileContent={review.diff || ''}
      />

      {/* Blast Radius Modal */}
      {blastRadiusModalOpen && blastRadiusFinding && (
        <BlastRadiusViz
          finding={blastRadiusFinding}
          isModal={true}
          onClose={() => setBlastRadiusModalOpen(false)}
        />
      )}
    </div>
  );
}
