'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Shield,
  LayoutDashboard,
  GitPullRequest,
  FileSearch,
  Target,
  AlertTriangle,
  Zap,
  FlaskConical,
  BarChart3,
  Settings,
  TowerControl,
  Calculator,
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pull Requests', href: '/dashboard/pull-requests', icon: GitPullRequest },
  { name: 'Code Reviews', href: '/reviews', icon: FileSearch },
  { name: 'Risk Dashboard', href: '/dashboard/risk', icon: Target },
  { name: 'Control Tower', href: '/control-tower', icon: TowerControl },
  { name: 'Security', href: '/dashboard/security', icon: Shield },
  { name: 'Performance', href: '/dashboard/performance', icon: Zap },
  { name: 'Generated Tests', href: '/dashboard/tests', icon: FlaskConical },
  { name: 'Evaluation', href: '/evaluation', icon: BarChart3 },
  { name: 'Savings Calculator', href: '/savings', icon: Calculator },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-800 bg-gray-950/50 backdrop-blur-sm flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            ReleaseGuard
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="glass rounded-lg p-3 text-sm">
          <p className="text-gray-400 mb-1">AI Provider</p>
          <p className="text-white font-medium">OpenAI GPT-4</p>
        </div>
      </div>
    </aside>
  );
}
