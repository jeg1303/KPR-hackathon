import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Bug, 
  Zap, 
  FileCode, 
  ArrowRight, 
  CheckCircle2,
  AlertTriangle,
  GitPullRequest,
  Activity,
  Brain,
  Target
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              ReleaseGuard AI
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/demo" className="text-gray-300 hover:text-white transition">
              Demo
            </Link>
            <Link href="/architecture" className="text-gray-300 hover:text-white transition">
              How It Works
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
              Dashboard
            </Link>
            <Button asChild>
              <Link href="/analyze">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-400 text-sm">
            <Brain className="h-4 w-4" />
            <span>AI-Powered DevSecOps Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Know the risk{' '}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              before you ship
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            AI-powered code review that detects bugs, security risks, performance problems, 
            and maintainability issues before they reach production.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/analyze">
                Analyze a Pull Request
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/demo">
                Try Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Visual Pipeline */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How ReleaseGuard Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            <Card className="md:col-span-1">
              <CardContent className="pt-6 text-center">
                <GitPullRequest className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Pull Request</p>
              </CardContent>
            </Card>
            
            <div className="hidden md:flex justify-center">
              <ArrowRight className="h-6 w-6 text-gray-600" />
            </div>
            
            <Card className="md:col-span-1">
              <CardContent className="pt-6 text-center">
                <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Static Analysis</p>
              </CardContent>
            </Card>
            
            <div className="hidden md:flex justify-center">
              <ArrowRight className="h-6 w-6 text-gray-600" />
            </div>
            
            <Card className="md:col-span-1">
              <CardContent className="pt-6 text-center">
                <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium">AI Review</p>
              </CardContent>
            </Card>
            
            <div className="hidden md:flex justify-center">
              <ArrowRight className="h-6 w-6 text-gray-600" />
            </div>
            
            <Card className="md:col-span-1">
              <CardContent className="pt-6 text-center">
                <Target className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Risk Score</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-lg">
              <span className="text-blue-400 font-semibold">Static Analysis</span> + 
              <span className="text-purple-400 font-semibold"> AI Reasoning</span> + 
              <span className="text-green-400 font-semibold"> Explainable Risk</span>
            </p>
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass">
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-500 mb-2" />
                <CardTitle className="text-lg">Security Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Detects SQL injection, XSS, hardcoded secrets, and more
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardHeader>
                <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                <CardTitle className="text-lg">Explainable AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Every finding includes evidence, impact, and confidence score
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardHeader>
                <AlertTriangle className="h-10 w-10 text-yellow-500 mb-2" />
                <CardTitle className="text-lg">Confidence-Aware</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Distinguishes certain bugs from likely issues and suggestions
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardHeader>
                <FileCode className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle className="text-lg">Auto Test Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Generates test cases for detected vulnerabilities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Comprehensive Code Intelligence</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-500" />
                <h3 className="text-xl font-semibold">Security</h3>
              </div>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  SQL Injection
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Hardcoded Secrets
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  XSS Vulnerabilities
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Weak Cryptography
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Bug className="h-5 w-5 text-orange-500" />
                <h3 className="text-xl font-semibold">Bugs</h3>
              </div>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Null References
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Error Handling
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Logic Errors
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Resource Leaks
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h3 className="text-xl font-semibold">Performance</h3>
              </div>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  N+1 Queries
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Inefficient Algorithms
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Blocking Operations
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  Memory Issues
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto glass border-blue-500/20">
          <CardContent className="pt-12 pb-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to improve your code quality?</h2>
            <p className="text-gray-400 text-lg">
              Start analyzing pull requests in seconds. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/analyze">
                  Analyze Your First PR
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">
                  Watch Demo
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold">ReleaseGuard AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2026 ReleaseGuard AI. Built for Hackathon.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
