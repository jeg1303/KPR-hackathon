'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GitPullRequest, 
  FileText, 
  Upload, 
  Loader2, 
  AlertCircle,
  Sparkles,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { DEMO_PRS } from '@/lib/demo-data';

type Tab = 'github' | 'paste' | 'upload' | 'demo';

export default function AnalyzePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('demo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [githubUrl, setGithubUrl] = useState('');
  const [diffText, setDiffText] = useState('');
  const [selectedDemo, setSelectedDemo] = useState('');

  const handleAnalyze = async (analysisType: 'github' | 'paste' | 'upload' | 'demo', data: any) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = analysisType === 'github' 
        ? '/api/analyze/github'
        : analysisType === 'demo'
        ? '/api/analyze/demo'
        : '/api/analyze/diff';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      
      // Navigate to results page
      router.push(`/review/${result.reviewId}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
      setLoading(false);
    }
  };

  const handleGithubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub PR URL');
      return;
    }
    handleAnalyze('github', { url: githubUrl });
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diffText.trim()) {
      setError('Please paste a diff');
      return;
    }
    handleAnalyze('paste', { diff: diffText });
  };

  const handleDemoSubmit = (demoId: string) => {
    if (!demoId) {
      setError('Please select a demo PR');
      return;
    }
    setSelectedDemo(demoId);
    handleAnalyze('demo', { demoId });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.diff') && !file.name.endsWith('.patch') && !file.name.endsWith('.txt')) {
      setError('Please upload a .diff, .patch, or .txt file');
      return;
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    try {
      const text = await file.text();
      handleAnalyze('paste', { diff: text });
    } catch (err) {
      setError('Failed to read file');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-sm">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Analyze Pull Request
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload a PR, paste a diff, or try our demo scenarios to see ReleaseGuard AI in action
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-2 mb-8">
          <Button
            variant={activeTab === 'demo' ? 'default' : 'outline'}
            onClick={() => setActiveTab('demo')}
            className="flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Demo PRs</span>
          </Button>
          <Button
            variant={activeTab === 'github' ? 'default' : 'outline'}
            onClick={() => setActiveTab('github')}
            className="flex items-center space-x-2"
          >
            <GitPullRequest className="h-4 w-4" />
            <span>GitHub URL</span>
          </Button>
          <Button
            variant={activeTab === 'paste' ? 'default' : 'outline'}
            onClick={() => setActiveTab('paste')}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Paste Diff</span>
          </Button>
          <Button
            variant={activeTab === 'upload' ? 'default' : 'outline'}
            onClick={() => setActiveTab('upload')}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload File</span>
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <Card className="glass">
          <CardContent className="pt-6">
            {/* Demo Tab */}
            {activeTab === 'demo' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Try Demo Scenarios</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Experience ReleaseGuard with pre-configured scenarios showing different types of issues
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {DEMO_PRS.map((demo) => {
                    const criticalCount = demo.findings.filter(f => f.severity === 'critical').length;
                    const highCount = demo.findings.filter(f => f.severity === 'high').length;
                    
                    return (
                      <div
                        key={demo.id}
                        className="p-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium text-white">
                                PR #{demo.number}: {demo.title}
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                {demo.repository}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              {criticalCount > 0 && (
                                <span className="flex items-center space-x-1">
                                  <Shield className="h-4 w-4 text-red-500" />
                                  <span>{criticalCount} Critical</span>
                                </span>
                              )}
                              {highCount > 0 && (
                                <span className="flex items-center space-x-1">
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                  <span>{highCount} High</span>
                                </span>
                              )}
                              <span>{demo.findings.length} total findings</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                              {demo.findings[0]?.title || 'Multiple issues'}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleDemoSubmit(demo.id)}
                            disabled={loading && selectedDemo === demo.id}
                            className="ml-4"
                          >
                            {loading && selectedDemo === demo.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              'Analyze'
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GitHub Tab */}
            {activeTab === 'github' && (
              <form onSubmit={handleGithubSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">GitHub Pull Request</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Analyze a pull request directly from GitHub
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub PR URL
                  </label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo/pull/123"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Example: https://github.com/facebook/react/pull/12345
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-400">
                    <strong>Note:</strong> GitHub authentication may be required for private repositories. 
                    Set GITHUB_TOKEN in your environment variables.
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing PR...
                    </>
                  ) : (
                    <>
                      <GitPullRequest className="h-5 w-5 mr-2" />
                      Analyze Pull Request
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Paste Diff Tab */}
            {activeTab === 'paste' && (
              <form onSubmit={handlePasteSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Paste Code Diff</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Paste a Git diff, patch file, or code changes
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Diff Content
                  </label>
                  <textarea
                    value={diffText}
                    onChange={(e) => setDiffText(e.target.value)}
                    placeholder="diff --git a/file.js b/file.js&#10;index 1234567..89abcdef 100644&#10;--- a/file.js&#10;+++ b/file.js&#10;@@ -1,3 +1,4 @@&#10;+const newLine = 'added';"
                    rows={12}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Supports unified diff format from git diff, git show, or GitHub PR diffs
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing Diff...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      Analyze Diff
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upload Diff File</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload a .diff, .patch, or .txt file containing code changes
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-gray-600 transition">
                  <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports .diff, .patch, and .txt files (max 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".diff,.patch,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={loading}
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </label>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            New to ReleaseGuard?{' '}
            <a href="/demo" className="text-blue-400 hover:text-blue-300">
              Watch the demo
            </a>{' '}
            or{' '}
            <a href="/architecture" className="text-blue-400 hover:text-blue-300">
              learn how it works
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
