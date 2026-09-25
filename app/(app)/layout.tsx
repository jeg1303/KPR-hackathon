'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useTheme } from '@/lib/theme/theme-context';
import { ThemePickerModal } from '@/components/theme/theme-picker-modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Shield,
  GitPullRequest,
  FileText,
  AlertTriangle,
  Activity,
  Zap,
  TestTube2,
  BarChart3,
  DollarSign,
  Settings,
  Home,
  LogOut,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Pull Requests', href: '/reviews', icon: GitPullRequest },
  { name: 'Code Reviews', href: '/analyze', icon: FileText },
  { name: 'Risk Dashboard', href: '/control-tower', icon: AlertTriangle },
  { name: 'Control Tower', href: '/control-tower', icon: Shield },
  { name: 'Security', href: '/control-tower', icon: Shield },
  { name: 'Performance', href: '/control-tower', icon: Zap },
  { name: 'Generated Tests', href: '/control-tower', icon: TestTube2 },
  { name: 'Evaluation', href: '/evaluation', icon: BarChart3 },
  { name: 'Savings Calculator', href: '/savings', icon: DollarSign },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Check if user has selected theme before
  useEffect(() => {
    const themeSelected = localStorage.getItem('themeSelected');
    if (!themeSelected) {
      setShowThemePicker(true);
    }
  }, []);

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black dark:from-gray-950 dark:via-gray-900 dark:to-black light:from-white light:via-gray-50 light:to-gray-100">
      {/* Theme Picker Modal */}
      {showThemePicker && (
        <ThemePickerModal onComplete={() => setShowThemePicker(false)} />
      )}

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 dark:bg-gray-900 light:bg-white border-r border-gray-800 dark:border-gray-800 light:border-gray-200 transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800 dark:border-gray-800 light:border-gray-200">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold text-white dark:text-white light:text-gray-900">ReleaseGuard AI</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-b border-gray-800 dark:border-gray-800 light:border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-full">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white dark:text-white light:text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-gray-100'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle & Sign Out */}
          <div className="px-3 py-4 border-t border-gray-800 dark:border-gray-800 light:border-gray-200 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start dark:border-gray-700 dark:hover:bg-gray-800 light:border-gray-300 light:hover:bg-gray-100"
              onClick={cycleTheme}
            >
              <ThemeIcon className="h-4 w-4 mr-2" />
              {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'Auto'}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start dark:border-gray-700 dark:hover:bg-gray-800 light:border-gray-300 light:hover:bg-gray-100"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-gray-900/80 dark:bg-gray-900/80 light:bg-white/80 backdrop-blur-sm border-b border-gray-800 dark:border-gray-800 light:border-gray-200">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
