import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GitPullRequest,
  AlertTriangle,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Activity,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  // Mock data - in real app, this would come from database
  const stats = {
    totalPRs: 47,
    criticalIssues: 3,
    highRiskPRs: 8,
    avgRiskScore: 42,
    issuesPrevented: 127,
  };

  const recentReviews = [
    {
      id: '1',
      prNumber: 142,
      repository: 'payment-service',
      title: 'Add user search endpoint',
      riskScore: 82,
      status: 'critical',
      criticalFindings: 1,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      prNumber: 156,
      repository: 'payment-service',
      title: 'Add Stripe integration',
      riskScore: 78,
      status: 'high',
      criticalFindings: 2,
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      prNumber: 178,
      repository: 'ecommerce-frontend',
      title: 'Optimize product listing',
      riskScore: 45,
      status: 'moderate',
      criticalFindings: 0,
      timestamp: '1 day ago',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Overview</h1>
          <p className="text-gray-400 mt-1">
            Monitor code quality and release risks across your projects
          </p>
        </div>
        <Button asChild>
          <Link href="/analyze">
            <GitPullRequest className="h-4 w-4 mr-2" />
            Analyze New PR
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total PRs Reviewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold text-white">{stats.totalPRs}</p>
              <GitPullRequest className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-green-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% this week
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Critical Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold text-red-500">{stats.criticalIssues}</p>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              High Risk PRs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold text-orange-500">{stats.highRiskPRs}</p>
              <Shield className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Score ≥ 70
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Average Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold text-yellow-500">{stats.avgRiskScore}</p>
              <Activity className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Moderate risk level
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Issues Prevented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold text-green-500">{stats.issuesPrevented}</p>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Before production
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Latest pull request analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-medium text-white">
                        #{review.prNumber} {review.title}
                      </h4>
                      <Badge
                        variant={
                          review.status === 'critical'
                            ? 'destructive'
                            : review.status === 'high'
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {review.riskScore}/100
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">
                      {review.repository} • {review.criticalFindings} critical findings
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Clock className="h-4 w-4 text-gray-400 inline mr-1" />
                      <span className="text-sm text-gray-400">{review.timestamp}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/review/${review.id}`}>
                        View
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/reviews">View All Reviews</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/analyze">
                <GitPullRequest className="h-4 w-4 mr-2" />
                Analyze New PR
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/demo">
                <Activity className="h-4 w-4 mr-2" />
                Run Demo
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/control-tower">
                <Shield className="h-4 w-4 mr-2" />
                Control Tower
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/evaluation">
                <Activity className="h-4 w-4 mr-2" />
                View Evaluation
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/debug">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Debug Error Log
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Analysis pipeline health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div>
                <p className="text-sm text-gray-400">Static Analysis</p>
                <p className="text-lg font-semibold text-green-500">Operational</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div>
                <p className="text-sm text-gray-400">AI Service</p>
                <p className="text-lg font-semibold text-green-500">Operational</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div>
                <p className="text-sm text-gray-400">Risk Engine</p>
                <p className="text-lg font-semibold text-green-500">Operational</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div>
                <p className="text-sm text-gray-400">Test Generator</p>
                <p className="text-lg font-semibold text-green-500">Operational</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
