import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GitPullRequest,
  Activity,
  Brain,
  Target,
  Shield,
  FileSearch,
  TestTube,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How ReleaseGuard Works
          </h1>
          <p className="text-xl text-gray-400">
            AI + Static Analysis + Explainable Risk = Better Code Quality
          </p>
        </div>

        {/* Pipeline Visualization */}
        <Card className="glass mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Analysis Pipeline</CardTitle>
            <CardDescription>
              Every pull request flows through our multi-stage intelligent analysis system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <GitPullRequest className="h-6 w-6 text-blue-500" />
                    <h3 className="text-xl font-semibold text-white">Input</h3>
                  </div>
                  <p className="text-gray-400 mb-3">
                    Pull request from GitHub, pasted diff, or uploaded file. System parses the diff to extract 
                    added/modified lines, changed files, and programming languages.
                  </p>
                  <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                    <code className="text-sm text-gray-300">
                      Files changed: 3 • Lines added: 42 • Lines deleted: 15
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-600 transform rotate-90" />
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 text-white font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Activity className="h-6 w-6 text-green-500" />
                    <h3 className="text-xl font-semibold text-white">Static Analysis</h3>
                    <Badge variant="success">Deterministic</Badge>
                  </div>
                  <p className="text-gray-400 mb-3">
                    Pattern-based analysis scans for known vulnerabilities using regex and code patterns. 
                    Detects SQL injection, hardcoded secrets, N+1 queries, null references, and more.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400">
                      <Shield className="h-4 w-4 inline mr-1" />
                      Security Patterns
                    </div>
                    <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded text-sm text-orange-400">
                      <FileSearch className="h-4 w-4 inline mr-1" />
                      Bug Patterns
                    </div>
                    <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-sm text-yellow-400">
                      Performance Patterns
                    </div>
                    <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-400">
                      Code Quality
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-600 transform rotate-90" />
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-600 text-white font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Brain className="h-6 w-6 text-purple-500" />
                    <h3 className="text-xl font-semibold text-white">AI Reasoning</h3>
                    <Badge variant="default">Contextual</Badge>
                  </div>
                  <p className="text-gray-400 mb-3">
                    LLM analyzes code with static analysis evidence as input. Provides contextual understanding, 
                    distinguishes certain bugs from suggestions, and generates explanations, fixes, and tests.
                  </p>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <p className="text-sm text-purple-300 mb-2">
                      <strong>Certainty Engine:</strong>
                    </p>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>🔴 <strong className="text-red-400">CERTAIN</strong> — Definite bug with clear evidence</div>
                      <div>🟠 <strong className="text-orange-400">LIKELY</strong> — Probable issue, common pattern</div>
                      <div>🔵 <strong className="text-blue-400">SUGGESTION</strong> — Style/minor improvement</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-600 transform rotate-90" />
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Target className="h-6 w-6 text-red-500" />
                    <h3 className="text-xl font-semibold text-white">Risk Engine</h3>
                    <Badge variant="destructive">Explainable</Badge>
                  </div>
                  <p className="text-gray-400 mb-3">
                    Deterministic scoring algorithm calculates release risk (0-100) based on severity, certainty, 
                    confidence, and category weights. Formula is transparent and auditable.
                  </p>
                  <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                    <code className="text-xs text-gray-300">
                      Risk = Σ(severity × certainty × confidence × category_weight) / max × 100
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-600 transform rotate-90" />
              </div>

              {/* Step 5 */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-600 text-white font-bold flex-shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <TestTube className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-xl font-semibold text-white">Test Generation</h3>
                  </div>
                  <p className="text-gray-400 mb-3">
                    For each security/bug finding, automatically generate test cases that verify the exact failure 
                    condition. Helps prevent regressions.
                  </p>
                  <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                    <code className="text-xs text-gray-300">
                      test('prevents SQL injection', async () =&gt; &#123; ... &#125;)
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-gray-600 transform rotate-90" />
              </div>

              {/* Step 6 */}
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600 text-white font-bold flex-shrink-0">
                  6
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <h3 className="text-xl font-semibold text-white">Release Decision</h3>
                  </div>
                  <p className="text-gray-400 mb-3">
                    Final release recommendation based on risk score: Safe (0-39), Moderate (40-69), 
                    High (70-89), Critical (90-100). Includes top 3 must-fix issues and action items.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-green-500/10 border border-green-500/20 rounded text-sm text-green-400 text-center">
                      🟢 Safe to Proceed
                    </div>
                    <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400 text-center">
                      🔴 Release Blocked
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Differentiators */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">What Makes ReleaseGuard Different</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Static + AI</h3>
                <p className="text-sm text-gray-400">
                  Combines deterministic pattern matching with AI contextual understanding
                </p>
              </div>

              <div className="text-center p-4">
                <div className="h-16 w-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Certainty-Aware</h3>
                <p className="text-sm text-gray-400">
                  Distinguishes definite bugs from likely issues and style suggestions
                </p>
              </div>

              <div className="text-center p-4">
                <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Explainable</h3>
                <p className="text-sm text-gray-400">
                  Transparent scoring, evidence-based findings, confidence scores
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-center">
                <p className="text-sm font-semibold text-blue-400 mb-1">Frontend</p>
                <p className="text-xs text-gray-400">Next.js 16, TypeScript, Tailwind CSS</p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-center">
                <p className="text-sm font-semibold text-green-400 mb-1">Backend</p>
                <p className="text-xs text-gray-400">Next.js API Routes, Server Actions</p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-center">
                <p className="text-sm font-semibold text-purple-400 mb-1">AI</p>
                <p className="text-xs text-gray-400">OpenAI GPT-4, Anthropic Claude</p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-center">
                <p className="text-sm font-semibold text-yellow-400 mb-1">Database</p>
                <p className="text-xs text-gray-400">PostgreSQL, Prisma ORM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-6">
            Ready to see it in action?
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" asChild>
              <Link href="/analyze">
                Analyze a PR
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
