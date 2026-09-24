'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  GitBranch,
  FileCode,
  Database,
  Globe,
  Server,
  Shield,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface BlastRadiusNode {
  id: string;
  label: string;
  type: 'file' | 'module' | 'service' | 'database' | 'api' | 'affected';
  risk: 'critical' | 'high' | 'medium' | 'low';
  impactScore: number;
}

interface BlastRadiusEdge {
  from: string;
  to: string;
  label?: string;
}

interface BlastRadiusData {
  epicenter: BlastRadiusNode;
  directImpact: BlastRadiusNode[];
  secondaryImpact: BlastRadiusNode[];
  edges: BlastRadiusEdge[];
  metrics: {
    totalAffectedFiles: number;
    totalAffectedModules: number;
    criticalPaths: number;
    estimatedImpactScore: number;
  };
}

interface BlastRadiusVizProps {
  finding: any;
  isModal?: boolean;
  onClose?: () => void;
}

export function BlastRadiusViz({ finding, isModal = false, onClose }: BlastRadiusVizProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Generate blast radius data from finding
  const generateBlastRadius = (finding: any): BlastRadiusData => {
    const epicenter: BlastRadiusNode = {
      id: 'epicenter',
      label: finding.file || 'Unknown File',
      type: 'file',
      risk: finding.severity as any,
      impactScore: Math.round(finding.confidence * 100),
    };

    // Generate direct impact based on finding category
    const directImpact: BlastRadiusNode[] = [];
    const secondaryImpact: BlastRadiusNode[] = [];
    const edges: BlastRadiusEdge[] = [];

    if (finding.category === 'security') {
      // Security issues affect authentication, database, and API layers
      directImpact.push(
        { id: 'auth', label: 'Authentication Module', type: 'module', risk: 'high', impactScore: 85 },
        { id: 'db', label: 'Database Layer', type: 'database', risk: 'critical', impactScore: 95 },
        { id: 'api', label: 'API Gateway', type: 'api', risk: 'high', impactScore: 80 }
      );
      
      secondaryImpact.push(
        { id: 'user-service', label: 'User Service', type: 'service', risk: 'medium', impactScore: 60 },
        { id: 'session-mgmt', label: 'Session Management', type: 'module', risk: 'high', impactScore: 75 },
        { id: 'audit-log', label: 'Audit Logging', type: 'module', risk: 'medium', impactScore: 55 }
      );

      edges.push(
        { from: 'epicenter', to: 'auth', label: 'exposes' },
        { from: 'epicenter', to: 'db', label: 'vulnerable' },
        { from: 'epicenter', to: 'api', label: 'bypasses' },
        { from: 'auth', to: 'user-service', label: 'cascades' },
        { from: 'auth', to: 'session-mgmt', label: 'affects' },
        { from: 'db', to: 'audit-log', label: 'compromises' }
      );
    } else if (finding.category === 'performance') {
      // Performance issues affect services and databases
      directImpact.push(
        { id: 'app-server', label: 'Application Server', type: 'service', risk: 'high', impactScore: 80 },
        { id: 'db', label: 'Database', type: 'database', risk: 'critical', impactScore: 90 },
        { id: 'cache', label: 'Cache Layer', type: 'service', risk: 'medium', impactScore: 65 }
      );
      
      secondaryImpact.push(
        { id: 'user-exp', label: 'User Experience', type: 'affected', risk: 'high', impactScore: 75 },
        { id: 'api-latency', label: 'API Response Time', type: 'api', risk: 'medium', impactScore: 60 },
        { id: 'costs', label: 'Infrastructure Costs', type: 'affected', risk: 'medium', impactScore: 50 }
      );

      edges.push(
        { from: 'epicenter', to: 'app-server', label: 'overloads' },
        { from: 'epicenter', to: 'db', label: 'N+1 queries' },
        { from: 'epicenter', to: 'cache', label: 'bypasses' },
        { from: 'app-server', to: 'user-exp', label: 'degrades' },
        { from: 'db', to: 'api-latency', label: 'increases' },
        { from: 'app-server', to: 'costs', label: 'raises' }
      );
    } else if (finding.category === 'bug') {
      // Bugs affect modules and services
      directImpact.push(
        { id: 'feature', label: `${finding.file.split('/').pop()} Feature`, type: 'module', risk: 'high', impactScore: 85 },
        { id: 'deps', label: 'Dependent Modules', type: 'module', risk: 'medium', impactScore: 70 }
      );
      
      secondaryImpact.push(
        { id: 'ui', label: 'User Interface', type: 'affected', risk: 'medium', impactScore: 60 },
        { id: 'workflow', label: 'Business Workflow', type: 'affected', risk: 'high', impactScore: 75 },
        { id: 'data-integrity', label: 'Data Integrity', type: 'database', risk: 'high', impactScore: 80 }
      );

      edges.push(
        { from: 'epicenter', to: 'feature', label: 'breaks' },
        { from: 'epicenter', to: 'deps', label: 'propagates' },
        { from: 'feature', to: 'ui', label: 'crashes' },
        { from: 'feature', to: 'workflow', label: 'disrupts' },
        { from: 'deps', to: 'data-integrity', label: 'corrupts' }
      );
    } else {
      // Maintainability issues
      directImpact.push(
        { id: 'codebase', label: 'Codebase Quality', type: 'affected', risk: 'medium', impactScore: 60 },
        { id: 'team', label: 'Team Velocity', type: 'affected', risk: 'low', impactScore: 40 }
      );
      
      secondaryImpact.push(
        { id: 'tech-debt', label: 'Technical Debt', type: 'affected', risk: 'medium', impactScore: 55 },
        { id: 'onboarding', label: 'Developer Onboarding', type: 'affected', risk: 'low', impactScore: 35 }
      );

      edges.push(
        { from: 'epicenter', to: 'codebase', label: 'degrades' },
        { from: 'epicenter', to: 'team', label: 'slows' },
        { from: 'codebase', to: 'tech-debt', label: 'increases' },
        { from: 'team', to: 'onboarding', label: 'complicates' }
      );
    }

    return {
      epicenter,
      directImpact,
      secondaryImpact,
      edges,
      metrics: {
        totalAffectedFiles: directImpact.length + secondaryImpact.length + 1,
        totalAffectedModules: [...directImpact, ...secondaryImpact].filter(n => n.type === 'module').length,
        criticalPaths: edges.length,
        estimatedImpactScore: Math.round(
          (epicenter.impactScore + 
           directImpact.reduce((sum, n) => sum + n.impactScore, 0) / directImpact.length +
           secondaryImpact.reduce((sum, n) => sum + n.impactScore, 0) / secondaryImpact.length) / 3
        ),
      },
    };
  };

  const blastRadius = generateBlastRadius(finding);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Draw edges first
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 2;

    blastRadius.edges.forEach(edge => {
      const fromNode = [blastRadius.epicenter, ...blastRadius.directImpact, ...blastRadius.secondaryImpact]
        .find(n => n.id === edge.from);
      const toNode = [blastRadius.epicenter, ...blastRadius.directImpact, ...blastRadius.secondaryImpact]
        .find(n => n.id === edge.to);

      if (!fromNode || !toNode) return;

      // Calculate positions
      let fromX = centerX, fromY = centerY;
      let toX = centerX, toY = centerY;

      if (edge.from === 'epicenter') {
        fromX = centerX;
        fromY = centerY;
      } else {
        const directIndex = blastRadius.directImpact.findIndex(n => n.id === edge.from);
        if (directIndex !== -1) {
          const angle = (directIndex / blastRadius.directImpact.length) * Math.PI * 2;
          fromX = centerX + Math.cos(angle) * 120;
          fromY = centerY + Math.sin(angle) * 120;
        }
      }

      const directIndex = blastRadius.directImpact.findIndex(n => n.id === edge.to);
      if (directIndex !== -1) {
        const angle = (directIndex / blastRadius.directImpact.length) * Math.PI * 2;
        toX = centerX + Math.cos(angle) * 120;
        toY = centerY + Math.sin(angle) * 120;
      } else {
        const secondaryIndex = blastRadius.secondaryImpact.findIndex(n => n.id === edge.to);
        if (secondaryIndex !== -1) {
          const directParentIndex = blastRadius.directImpact.findIndex(n => 
            blastRadius.edges.some(e => e.from === n.id && e.to === edge.to)
          );
          if (directParentIndex !== -1) {
            const baseAngle = (directParentIndex / blastRadius.directImpact.length) * Math.PI * 2;
            const offset = (secondaryIndex - blastRadius.secondaryImpact.length / 2) * 0.5;
            const angle = baseAngle + offset;
            toX = centerX + Math.cos(angle) * 220;
            toY = centerY + Math.sin(angle) * 220;
          }
        }
      }

      // Draw line
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      // Draw arrow
      const angle = Math.atan2(toY - fromY, toX - fromX);
      const arrowLength = 10;
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(
        toX - arrowLength * Math.cos(angle - Math.PI / 6),
        toY - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(toX, toY);
      ctx.lineTo(
        toX - arrowLength * Math.cos(angle + Math.PI / 6),
        toY - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    });

    // Draw nodes
    const drawNode = (node: BlastRadiusNode, x: number, y: number, radius: number) => {
      // Get color based on risk
      let color = 'rgba(59, 130, 246, 0.8)'; // blue
      if (node.risk === 'critical') color = 'rgba(239, 68, 68, 0.8)'; // red
      else if (node.risk === 'high') color = 'rgba(249, 115, 22, 0.8)'; // orange
      else if (node.risk === 'medium') color = 'rgba(234, 179, 8, 0.8)'; // yellow

      // Glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Main circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = hoveredNode === node.id ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = hoveredNode === node.id ? 3 : 2;
      ctx.stroke();
    };

    // Draw epicenter (center)
    drawNode(blastRadius.epicenter, centerX, centerY, 30);

    // Draw direct impact (inner ring)
    blastRadius.directImpact.forEach((node, index) => {
      const angle = (index / blastRadius.directImpact.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * 120;
      const y = centerY + Math.sin(angle) * 120;
      drawNode(node, x, y, 25);
    });

    // Draw secondary impact (outer ring)
    blastRadius.secondaryImpact.forEach((node, index) => {
      const directParentIndex = Math.floor(index / (blastRadius.secondaryImpact.length / blastRadius.directImpact.length));
      const baseAngle = (directParentIndex / blastRadius.directImpact.length) * Math.PI * 2;
      const offset = (index - blastRadius.secondaryImpact.length / 2) * 0.5;
      const angle = baseAngle + offset;
      const x = centerX + Math.cos(angle) * 220;
      const y = centerY + Math.sin(angle) * 220;
      drawNode(node, x, y, 20);
    });

  }, [blastRadius, hoveredNode, isFullscreen]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'file': return <FileCode className="h-4 w-4" />;
      case 'module': return <GitBranch className="h-4 w-4" />;
      case 'service': return <Server className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'api': return <Globe className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const content = (
    <div className={isModal ? '' : 'space-y-6'}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2 flex items-center">
            <GitBranch className="h-6 w-6 mr-2 text-blue-500" />
            Blast Radius Analysis
          </h3>
          <p className="text-sm text-gray-400">
            Visualizing the potential impact of this issue across your system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isModal && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="glass">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-400 mb-1">Affected Components</p>
            <p className="text-2xl font-bold text-blue-400">{blastRadius.metrics.totalAffectedFiles}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-400 mb-1">Critical Paths</p>
            <p className="text-2xl font-bold text-orange-400">{blastRadius.metrics.criticalPaths}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-400 mb-1">Affected Modules</p>
            <p className="text-2xl font-bold text-yellow-400">{blastRadius.metrics.totalAffectedModules}</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="pt-4">
            <p className="text-xs text-gray-400 mb-1">Impact Score</p>
            <p className="text-2xl font-bold text-red-400">{blastRadius.metrics.estimatedImpactScore}</p>
          </CardContent>
        </Card>
      </div>

      {/* Visualization */}
      <Card className="glass">
        <CardContent className="pt-6">
          <canvas
            ref={canvasRef}
            className={`w-full ${isFullscreen ? 'h-[600px]' : 'h-[400px]'} rounded-lg`}
            style={{ background: 'rgba(0, 0, 0, 0.2)' }}
          />
        </CardContent>
      </Card>

      {/* Legend and Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Epicenter */}
        <Card className="glass border-red-500/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Shield className="h-4 w-4 mr-2 text-red-500" />
              Epicenter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div 
              className="p-3 rounded-lg bg-gray-900/50 border border-gray-800 cursor-pointer hover:border-blue-500 transition-colors"
              onMouseEnter={() => setHoveredNode(blastRadius.epicenter.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getNodeIcon(blastRadius.epicenter.type)}
                  <span className="text-sm font-medium">{blastRadius.epicenter.label}</span>
                </div>
                <Badge className={getRiskBadgeColor(blastRadius.epicenter.risk)} variant="default">
                  {blastRadius.epicenter.risk}
                </Badge>
              </div>
              <p className="text-xs text-gray-400">Impact: {blastRadius.epicenter.impactScore}%</p>
            </div>
          </CardContent>
        </Card>

        {/* Direct Impact */}
        <Card className="glass border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
              Direct Impact ({blastRadius.directImpact.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[200px] overflow-y-auto">
            {blastRadius.directImpact.map((node) => (
              <div
                key={node.id}
                className="p-2 rounded bg-gray-900/50 border border-gray-800 cursor-pointer hover:border-blue-500 transition-colors"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {getNodeIcon(node.type)}
                    <span className="text-xs font-medium truncate">{node.label}</span>
                  </div>
                  <Badge className={`${getRiskBadgeColor(node.risk)} text-xs`} variant="default">
                    {node.risk}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">{node.impactScore}%</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Secondary Impact */}
        <Card className="glass border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <GitBranch className="h-4 w-4 mr-2 text-yellow-500" />
              Secondary Impact ({blastRadius.secondaryImpact.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[200px] overflow-y-auto">
            {blastRadius.secondaryImpact.map((node) => (
              <div
                key={node.id}
                className="p-2 rounded bg-gray-900/50 border border-gray-800 cursor-pointer hover:border-blue-500 transition-colors"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {getNodeIcon(node.type)}
                    <span className="text-xs font-medium truncate">{node.label}</span>
                  </div>
                  <Badge className={`${getRiskBadgeColor(node.risk)} text-xs`} variant="default">
                    {node.risk}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">{node.impactScore}%</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="glass w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <CardContent className="pt-6">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  return content;
}
