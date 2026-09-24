'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Loader2, 
  CheckCircle2,
  Shield,
  Sparkles,
} from 'lucide-react';

export default function DemoPage() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    { title: 'Loading PR', description: 'Payment Service PR #142', icon: '📥' },
    { title: 'Scanning Files', description: '3 files changed, 15 lines added', icon: '🔍' },
    { title: 'Security Analysis', description: 'Checking for vulnerabilities...', icon: '🛡️' },
    { title: 'AI Review', description: 'Analyzing with GPT-4...', icon: '🤖' },
    { title: 'Risk Calculation', description: 'Computing release risk score...', icon: '📊' },
    { title: 'Complete', description: 'Analysis finished', icon: '✅' },
  ];

  const runDemo = async () => {
    setRunning(true);
    setStep(0);

    // Simulate pipeline steps
    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise(resolve => setTimeout(resolve, i === steps.length - 1 ? 500 : 1500));
    }

    // Navigate to demo result
    try {
      const response = await fetch('/api/analyze/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoId: 'demo-1' }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/review/${result.reviewId}`);
      }
    } catch (error) {
      console.error('Demo failed:', error);
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-sm">Interactive Demo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            See ReleaseGuard in Action
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the complete analysis pipeline with a sample pull request containing a critical SQL injection vulnerability
          </p>
        </div>

        {/* Demo Card */}
        <Card className="glass mb-8">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Payment Service PR #142</h2>
              <p className="text-gray-400 mb-4">Add user search endpoint</p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <Badge variant="destructive">
                  <Shield className="h-3 w-3 mr-1" />
                  1 Critical Issue
                </Badge>
                <Badge variant="secondary">3 Files Changed</Badge>
                <Badge variant="secondary">15 Lines Added</Badge>
              </div>
            </div>

            {!running && step === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-6">
                  This demo will analyze a real code change that contains a SQL injection vulnerability.
                  Watch as ReleaseGuard detects the issue, explains the risk, and provides a fix.
                </p>
                <Button size="lg" onClick={runDemo} className="px-12">
                  <Play className="h-5 w-5 mr-2" />
                  Start Demo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((s, index) => {
                  const isActive = index === step;
                  const isComplete = index < step;
                  const isPending = index > step;

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-blue-500/10 border-blue-500/20'
                          : isComplete
                          ? 'bg-green-500/10 border-green-500/20'
                          : 'bg-gray-900/50 border-gray-800'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isComplete ? (
                          <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-white" />
                          </div>
                        ) : isActive ? (
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-2xl">
                            {s.icon}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${isActive || isComplete ? 'text-white' : 'text-gray-500'}`}>
                          {s.title}
                        </p>
                        <p className={`text-sm ${isActive || isComplete ? 'text-gray-400' : 'text-gray-600'}`}>
                          {s.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* What You'll See */}
        {!running && (
          <Card className="glass">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">What You'll See</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">
                    <strong>SQL Injection Detection:</strong> ReleaseGuard identifies the exact line where user input is concatenated into a SQL query
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">
                    <strong>Risk Assessment:</strong> 82/100 risk score with "High Risk" release status
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">
                    <strong>Explainable Findings:</strong> Evidence, impact explanation, and production consequences
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">
                    <strong>Suggested Fix:</strong> Parameterized query implementation to prevent injection
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">
                    <strong>Generated Test:</strong> Automated test case to verify the vulnerability is fixed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
