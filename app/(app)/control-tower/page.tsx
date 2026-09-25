'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Bug,
  Zap,
  FileCode,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TowerControl,
} from 'lucide-react';
import Link from 'next/link';

export default function ControlTowerPage() {
  // Mock data - in real app would come from the latest analysis
  const [prData] = useState({
    number: 142,
    repository: 'payment-service',
    title: 'Add user search endpoint',
    riskScore: 82,
    status: 'high',
    criticalCount: 1,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    categoryCounts: {
      bugs: 0,
      security: 1,
      performance: 0,
      code: 0,
    },
    topIssues: [
      { title: 'SQL Injection Vulnerability', severity: 'critical', file: 'api/users.js', line: 45 },
    ],
  });

  const getReleaseStatus = () => {
    if (prData.riskScore >= 70) {
      return {
        icon: <XCircle className="h-16 w-16" />,
        text: 'RELEASE BLOCKED',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
      };
    } else if (prData.riskScore >= 40) {
      return {
        icon: <AlertTriangle className="h-16 w-16" />,
        text: 'HIGH RISK',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
      };
    } else {
      return {
        icon: <CheckCircle2 className="h-16 w-16" />,
        text: 'SAFE TO PROCEED',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
      };
    }
  };

  const releaseStatus = getReleaseStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
            <TowerControl className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-sm">Mission Control</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            🚦 Release Control Tower
          </h1>
          <p className="text-xl text-gray-400">
            Real-time release decision intelligence
          </p>
        </div>

        {/* PR Info */}
        <Card className="glass mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-400 mb-2">ANALYZING</p>
            <h2 className="text-2xl font-bold mb-2">
              {prData.repository} • PR #{prData.number}
            </h2>
            <p className="text-gray-400">{prData.title}</p>
          </CardContent>
        </Card>

        {/* Risk Score - Large Display */}
        <Card className={`glass border-2 mb-8 ${releaseStatus.borderColor} ${releaseStatus.bgColor}`}>
          <CardContent className="py-12 text-center">
            <p className="text-gray-400 text-sm mb-4">RISK ASSESSMENT</p>
            <div className={`text-9xl font-bold mb-6 ${releaseStatus.color}`}>
              {prData.riskScore}
            </div>
            <p className="text-3xl font-semibold text-gray-300 mb-8">/ 100</p>
            <div className={`inline-flex items-center justify-center space-x-4 px-8 py-4 rounded-lg ${releaseStatus.bgColor} border ${releaseStatus.borderColor}`}>
              <div className={releaseStatus.color}>
                {releaseStatus.icon}
              </div>
              <p className={`text-3xl font-bold ${releaseStatus.color}`}>
                {releaseStatus.text}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Issue Breakdown Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="glass border-red-500/20">
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-1">Bugs</p>
              <p className="text-4xl font-bold text-white">{prData.categoryCounts.bugs}</p>
            </CardContent>
          </Card>

          <Card className="glass border-orange-500/20">
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-1">Security</p>
              <p className="text-4xl font-bold text-white">{prData.categoryCounts.security}</p>
            </CardContent>
          </Card>

          <Card className="glass border-yellow-500/20">
            <CardContent className="pt-6 text-center">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-1">Performance</p>
              <p className="text-4xl font-bold text-white">{prData.categoryCounts.performance}</p>
            </CardContent>
          </Card>

          <Card className="glass border-blue-500/20">
            <CardContent className="pt-6 text-center">
              <FileCode className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-1">Code Quality</p>
              <p className="text-4xl font-bold text-white">{prData.categoryCounts.code}</p>
            </CardContent>
          </Card>
        </div>

        {/* Why Blocked/Approved */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Why?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prData.criticalCount > 0 && (
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-white">
                    <strong>{prData.criticalCount}</strong> critical security issue detected
                  </p>
                </div>
              )}
              {prData.highCount > 0 && (
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-white">
                    <strong>{prData.highCount}</strong> high severity issues found
                  </p>
                </div>
              )}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-white">
                  Insufficient evidence for safe release
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What to Do */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">What To Do?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {prData.topIssues.map((issue, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">{issue.title}</p>
                    <p className="text-sm text-gray-400">{issue.file}:{issue.line}</p>
                  </div>
                  <Button size="sm" variant="outline">Fix</Button>
                </li>
              ))}
              <li className="flex items-start space-x-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                  {prData.topIssues.length + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Re-run analysis</p>
                  <p className="text-sm text-gray-400">After applying fixes</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button size="lg" variant="outline" asChild>
            <Link href="/analyze">
              Re-analyze PR
            </Link>
          </Button>
          <Button size="lg" asChild>
            <Link href="/dashboard">
              View Full Report
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
