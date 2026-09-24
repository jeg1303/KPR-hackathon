'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface CodeXRayModalProps {
  isOpen: boolean;
  onClose: () => void;
  finding: {
    title: string;
    category: string;
    severity: string;
    certainty: string;
    confidence: number;
    file: string;
    lineStart: number;
    lineEnd: number;
    evidence: string;
    explanation: string;
    impact: string;
    suggestedFix?: string;
  } | null;
  fileContent: string;
}

export function CodeXRayModal({ isOpen, finding, onClose, fileContent }: CodeXRayModalProps) {
  const [copied, setCopied] = useState(false);

  // Don't render if modal is not open or finding is null
  if (!isOpen || !finding) {
    return null;
  }

  // Generate sample code context around the vulnerable line
  const generateCodeContext = () => {
    const lines: string[] = [];
    const startLine = Math.max(1, finding.lineStart - 5);
    const endLine = finding.lineEnd + 5;

    // Generate context lines (in real app, this would come from actual file)
    for (let i = startLine; i <= endLine; i++) {
      if (i < finding.lineStart) {
        lines.push(`  // Context before`);
      } else if (i >= finding.lineStart && i <= finding.lineEnd) {
        // The vulnerable line
        if (finding.title.includes('SQL Injection')) {
          lines.push(`  const sql = "SELECT * FROM users WHERE name LIKE '%" + query + "%'";`);
        } else if (finding.title.includes('Hardcoded')) {
          lines.push(`  const apiKey = 'sk_test_51HqJ4xYqGP0KxYqGP0KxYqGP0KxYqGP0KxYqGP';`);
        } else if (finding.title.includes('N+1')) {
          lines.push(`    const category = await fetch(\`/api/categories/\${product.categoryId}\`);`);
        } else if (finding.title.includes('Null')) {
          lines.push(`  console.log(\`Account \${account.email} deleted\`);`);
        } else {
          lines.push(`  // Vulnerable code line`);
        }
      } else {
        lines.push(`  // Context after`);
      }
    }

    return lines.join('\n');
  };

  const code = generateCodeContext();

  // Calculate decorations for highlighting
  const decorations = [
    {
      range: {
        startLineNumber: finding.lineStart - Math.max(1, finding.lineStart - 5) + 1,
        startColumn: 1,
        endLineNumber: finding.lineEnd - Math.max(1, finding.lineStart - 5) + 1,
        endColumn: 1000,
      },
      options: {
        isWholeLine: true,
        className: 'bg-red-500/20 border-l-4 border-l-red-500',
        glyphMarginClassName: 'bg-red-500',
      },
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden glass border-2 border-blue-500/20">
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <CardTitle className="text-2xl">🔬 AI Code X-Ray</CardTitle>
                <Badge className={getSeverityColor(finding.severity)}>
                  {finding.severity.toUpperCase()}
                </Badge>
                <Badge variant={finding.certainty === 'certain' ? 'destructive' : 'warning'}>
                  {finding.certainty === 'certain' ? '🔴 CERTAIN' : '🟠 LIKELY'}
                </Badge>
              </div>
              <p className="text-gray-400 text-sm">
                {finding.file}:{finding.lineStart}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-x divide-gray-800">
            {/* Left: Code Editor */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Vulnerable Code</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-white"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <Editor
                  height="400px"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={code}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    lineNumbers: 'on',
                    glyphMargin: true,
                    folding: false,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                  }}
                  onMount={(editor) => {
                    // Highlight the vulnerable line
                    const model = editor.getModel();
                    if (model) {
                      editor.createDecorationsCollection([
                        {
                          range: {
                            startLineNumber: finding.lineStart - Math.max(1, finding.lineStart - 5) + 1,
                            startColumn: 1,
                            endLineNumber: finding.lineEnd - Math.max(1, finding.lineStart - 5) + 1,
                            endColumn: model.getLineMaxColumn(finding.lineStart - Math.max(1, finding.lineStart - 5) + 1),
                          },
                          options: {
                            isWholeLine: true,
                            className: 'monaco-highlight-line',
                            glyphMarginClassName: 'monaco-highlight-glyph',
                            linesDecorationsClassName: 'monaco-highlight-decoration',
                          },
                        },
                      ]);
                    }
                  }}
                />
              </div>

              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-400">Line {finding.lineStart}</p>
                    <p className="text-sm text-gray-300 mt-1">{finding.evidence}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Analysis Panel */}
            <div className="p-6 overflow-y-auto max-h-[600px]">
              <h3 className="text-lg font-semibold text-white mb-4">Analysis</h3>

              <div className="space-y-6">
                {/* Issue Title */}
                <div>
                  <p className="text-sm text-gray-400 mb-1">ISSUE</p>
                  <p className="text-xl font-semibold text-white">{finding.title}</p>
                </div>

                {/* Confidence */}
                <div>
                  <p className="text-sm text-gray-400 mb-2">CONFIDENCE</p>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${finding.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold">
                      {Math.round(finding.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <p className="text-sm text-blue-400 font-semibold mb-2">WHY IS THIS A PROBLEM?</p>
                  <p className="text-gray-300 leading-relaxed">{finding.explanation}</p>
                </div>

                {/* Impact */}
                <div>
                  <p className="text-sm text-blue-400 font-semibold mb-2">POTENTIAL IMPACT</p>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{finding.impact}</p>
                </div>

                {/* Suggested Fix */}
                {finding.suggestedFix && (
                  <div>
                    <p className="text-sm text-blue-400 font-semibold mb-2">SUGGESTED FIX</p>
                    <pre className="text-sm bg-gray-950 p-4 rounded-lg overflow-x-auto border border-gray-800">
                      <code className="text-gray-300">{finding.suggestedFix}</code>
                    </pre>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-gray-800">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Full Context
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Generate Test
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        .monaco-highlight-line {
          background: rgba(239, 68, 68, 0.1) !important;
          border-left: 4px solid rgb(239, 68, 68) !important;
        }
        .monaco-highlight-glyph {
          background: rgb(239, 68, 68) !important;
          width: 4px !important;
        }
        .monaco-highlight-decoration {
          background: rgb(239, 68, 68) !important;
          width: 4px !important;
        }
      `}</style>
    </div>
  );
}
