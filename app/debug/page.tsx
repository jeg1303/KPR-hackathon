'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  FileSearch,
  ArrowRight,
  Copy,
  CheckCircle2,
} from 'lucide-react';

export default function DebugPage() {
  const [errorLog, setErrorLog] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const exampleErrors = [
    {
      name: 'TypeError Example',
      log: `TypeError: Cannot read properties of undefined (reading 'email')
    at processPayment (payment.js:42:18)
    at async handleCheckout (checkout.js:156:5)
    at async POST (route.ts:23:3)`,
    },
    {
      name: 'ReferenceError Example',
      log: `ReferenceError: userId is not defined
    at deleteAccount (account.js:89:32)
    at async DELETE (route.ts:15:5)`,
    },
    {
      name: 'Network Error Example',
      log: `Error: ECONNREFUSED connect ECONNREFUSED 127.0.0.1:5432
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1555:16)
    at queryDatabase (db.js:234:12)
    at getUserData (users.js:67:8)`,
    },
  ];

  const parseErrorLog = (log: string) => {
    setLoading(true);
    
    // Simple parser for demo
    const lines = log.split('\n');
    const errorLine = lines[0];
    const stackLines = lines.slice(1).filter(l => l.trim().startsWith('at'));
    
    // Extract error type and message
    const errorMatch = errorLine.match(/^(\w+Error):\s*(.+)$/);
    const errorType = errorMatch ? errorMatch[1] : 'Error';
    const errorMessage = errorMatch ? errorMatch[2] : errorLine;
    
    // Parse stack trace
    const stack = stackLines.map(line => {
      const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
      if (match) {
        return {
          function: match[1],
          file: match[2],
          line: parseInt(match[3]),
          column: parseInt(match[4]),
        };
      }
      return null;
    }).filter(Boolean);
    
    setTimeout(() => {
      setAnalysis({
        errorType,
        errorMessage,
        stack,
        likelyCause: getLikelyCause(errorType, errorMessage),
        suggestedFix: getSuggestedFix(errorType, errorMessage),
        confidence: 0.85,
      });
      setLoading(false);
    }, 1000);
  };

  const getLikelyCause = (errorType: string, message: string) => {
    if (errorType === 'TypeError' && message.includes('Cannot read properties')) {
      return 'The variable or object is null or undefined when attempting to access a property. This often happens when data is not validated before use.';
    }
    if (errorType === 'ReferenceError') {
      return 'The variable is being used before it is declared, or it is out of scope. Check variable declarations and function parameters.';
    }
    if (message.includes('ECONNREFUSED')) {
      return 'Cannot connect to the service. The service may be down, not running, or the connection details (host/port) are incorrect.';
    }
    return 'Analyze the error message and stack trace to identify the root cause.';
  };

  const getSuggestedFix = (errorType: string, message: string) => {
    if (errorType === 'TypeError' && message.includes('Cannot read properties')) {
      return `// Add null/undefined check before accessing properties
if (!account || !account.email) {
  throw new Error('Account not found');
}
const email = account.email;`;
    }
    if (errorType === 'ReferenceError') {
      return `// Ensure variable is properly declared and in scope
const userId = req.params.userId;
if (!userId) {
  throw new Error('User ID is required');
}`;
    }
    if (message.includes('ECONNREFUSED')) {
      return `// Check connection configuration and service health
// Verify DATABASE_URL or connection settings
// Ensure the service is running
if (process.env.DATABASE_URL) {
  // Use connection with retry logic
}`;
    }
    return '// Review the code at the indicated line and fix the issue';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-red-400 text-sm">Error Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🔗 Stack Trace Linker
          </h1>
          <p className="text-xl text-gray-400">
            Parse error logs, find the exact code line, and get AI-powered root cause analysis
          </p>
        </div>

        {/* Input Card */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Paste Error Log or Stack Trace</CardTitle>
            <CardDescription>
              Paste a runtime error, stack trace, or exception log to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              placeholder="TypeError: Cannot read properties of undefined&#10;    at processPayment (payment.js:42:18)&#10;    at async handleCheckout (checkout.js:156:5)"
              rows={8}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-wrap gap-2">
                {exampleErrors.map((example) => (
                  <Button
                    key={example.name}
                    variant="outline"
                    size="sm"
                    onClick={() => setErrorLog(example.log)}
                  >
                    {example.name}
                  </Button>
                ))}
              </div>
              <Button 
                onClick={() => parseErrorLog(errorLog)}
                disabled={!errorLog.trim() || loading}
              >
                {loading ? 'Analyzing...' : 'Analyze Error'}
                <FileSearch className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6 animate-fade-in">
            {/* Error Summary */}
            <Card className="glass border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  Error Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Error Type</p>
                    <Badge variant="destructive" className="text-base">
                      {analysis.errorType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Message</p>
                    <p className="text-white font-mono text-sm">{analysis.errorMessage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Confidence</p>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 bg-gray-800 rounded-full flex-1 max-w-xs">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${analysis.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold">{Math.round(analysis.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stack Trace */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Stack Trace</CardTitle>
                <CardDescription>Click to jump to code location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.stack.map((frame: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition"
                    >
                      <div className="flex-1">
                        <p className="text-white font-mono text-sm mb-1">
                          <span className="text-blue-400">{frame.function}</span>
                        </p>
                        <p className="text-gray-400 text-xs">
                          {frame.file}:<span className="text-yellow-400">{frame.line}</span>:{frame.column}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Likely Cause */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Likely Cause</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{analysis.likelyCause}</p>
              </CardContent>
            </Card>

            {/* Suggested Fix */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Suggested Fix</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(analysis.suggestedFix)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-950 p-4 rounded-lg overflow-x-auto">
                  <code className="text-gray-300">{analysis.suggestedFix}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Generate Test */}
            <Card className="glass border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="text-white font-semibold">Generate Test for This Error</p>
                      <p className="text-sm text-gray-400">
                        Create a test case to prevent this error from happening again
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">
                    Generate Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* How It Works */}
        {!analysis && (
          <Card className="glass">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <p className="text-gray-300">
                    Paste your error log or stack trace from any runtime exception
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <p className="text-gray-300">
                    ReleaseGuard parses the stack trace to extract file names and line numbers
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <p className="text-gray-300">
                    AI analyzes the error type and context to identify the likely root cause
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0">
                    4
                  </div>
                  <p className="text-gray-300">
                    Get a suggested fix and optionally generate a test to prevent regression
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
