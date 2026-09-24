import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Clock,
  GitPullRequest,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export default function ReviewsPage() {
  // Mock data - in real app would fetch from database
  const reviews = [
    {
      id: '1',
      prNumber: 142,
      repository: 'payment-service',
      title: 'Add user search endpoint',
      riskScore: 82,
      status: 'high',
      releaseStatus: 'blocked',
      criticalFindings: 1,
      highFindings: 0,
      totalFindings: 1,
      analysisType: 'demo',
      timestamp: '2 hours ago',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      prNumber: 156,
      repository: 'payment-service',
      title: 'Add Stripe integration',
      riskScore: 78,
      status: 'high',
      releaseStatus: 'high-risk',
      criticalFindings: 2,
      highFindings: 1,
      totalFindings: 3,
      analysisType: 'demo',
      timestamp: '5 hours ago',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: '3',
      prNumber: 178,
      repository: 'ecommerce-frontend',
      title: 'Optimize product listing page',
      riskScore: 45,
      status: 'moderate',
      releaseStatus: 'review',
      criticalFindings: 0,
      highFindings: 1,
      totalFindings: 1,
      analysisType: 'demo',
      timestamp: '1 day ago',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      prNumber: 203,
      repository: 'user-service',
      title: 'Add account deletion feature',
      riskScore: 58,
      status: 'moderate',
      releaseStatus: 'review',
      criticalFindings: 0,
      highFindings: 1,
      totalFindings: 2,
      analysisType: 'demo',
      timestamp: '2 days ago',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '5',
      prNumber: 215,
      repository: 'api-gateway',
      title: 'Refactor authentication middleware',
      riskScore: 72,
      status: 'high',
      releaseStatus: 'high-risk',
      criticalFindings: 1,
      highFindings: 1,
      totalFindings: 5,
      analysisType: 'demo',
      timestamp: '3 days ago',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-green-500';
  };

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'warning';
    return 'success';
  };

  const getStatusIcon = (releaseStatus: string) => {
    switch (releaseStatus) {
      case 'blocked':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high-risk':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'review':
        return <Shield className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Code Reviews</h1>
            <p className="text-gray-400">
              All analyzed pull requests and their security assessments
            </p>
          </div>
          <Button asChild>
            <Link href="/analyze">
              <GitPullRequest className="h-4 w-4 mr-2" />
              Analyze New PR
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="glass mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm">All</Button>
                <Button variant="outline" size="sm">Critical</Button>
                <Button variant="outline" size="sm">High Risk</Button>
                <Button variant="outline" size="sm">Moderate</Button>
                <Button variant="outline" size="sm">Low Risk</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="glass hover:border-blue-500/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {getStatusIcon(review.releaseStatus)}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          #{review.prNumber} {review.title}
                        </h3>
                        <Badge
                          variant={getRiskBadgeVariant(review.riskScore)}
                          className="font-mono"
                        >
                          {review.riskScore}/100
                        </Badge>
                        {review.analysisType === 'demo' && (
                          <Badge variant="secondary" className="text-xs">Demo</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-2">
                        {review.repository}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        {review.criticalFindings > 0 && (
                          <span className="flex items-center space-x-1 text-red-400">
                            <Shield className="h-4 w-4" />
                            <span>{review.criticalFindings} Critical</span>
                          </span>
                        )}
                        {review.highFindings > 0 && (
                          <span className="flex items-center space-x-1 text-orange-400">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{review.highFindings} High</span>
                          </span>
                        )}
                        <span className="text-gray-500">
                          {review.totalFindings} total findings
                        </span>
                        <span className="flex items-center space-x-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{review.timestamp}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" asChild>
                    <Link href={`/review/${review.id}`}>
                      View Report
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="glass">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-white mb-1">{reviews.length}</p>
              <p className="text-sm text-gray-400">Total Reviews</p>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-red-500 mb-1">
                {reviews.filter(r => r.criticalFindings > 0).length}
              </p>
              <p className="text-sm text-gray-400">With Critical Issues</p>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-orange-500 mb-1">
                {reviews.filter(r => r.riskScore >= 70).length}
              </p>
              <p className="text-sm text-gray-400">High Risk</p>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-500 mb-1">
                {reviews.filter(r => r.riskScore < 40).length}
              </p>
              <p className="text-sm text-gray-400">Low Risk</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
