'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useTheme, ACCENT_COLORS } from '@/lib/theme/theme-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Key, 
  Camera, 
  Save,
  Mail,
  MapPin,
  Briefcase,
  Globe,
  Check,
  Copy,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Monitor,
  AlertCircle,
  Palette,
  Sparkles,
  Zap,
  Layout,
  Command,
  Hash,
  Link as LinkIcon,
  Code,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { accentColor, setAccentColor } = useTheme();
  const [saved, setSaved] = useState(false);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [enableParticles, setEnableParticles] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Production API Key',
      key: 'rg_live_••••••••••••••••••••••••••••1a2b',
      created: '2026-09-01',
      lastUsed: '2 hours ago',
      scopes: ['read', 'write'],
    },
    {
      id: '2',
      name: 'CI/CD Pipeline',
      key: 'rg_live_••••••••••••••••••••••••••••3c4d',
      created: '2026-08-15',
      lastUsed: '1 day ago',
      scopes: ['read'],
    },
  ]);

  const accentOptions = [
    { name: 'Blue', color: ACCENT_COLORS.blue },
    { name: 'Purple', color: ACCENT_COLORS.purple },
    { name: 'Pink', color: ACCENT_COLORS.pink },
    { name: 'Green', color: ACCENT_COLORS.green },
    { name: 'Orange', color: ACCENT_COLORS.orange },
    { name: 'Red', color: ACCENT_COLORS.red },
    { name: 'Cyan', color: ACCENT_COLORS.cyan },
    { name: 'Yellow', color: ACCENT_COLORS.yellow },
  ];

  const keyboardShortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Open command palette' },
    { keys: ['Ctrl', 'B'], description: 'Toggle sidebar' },
    { keys: ['Ctrl', 'N'], description: 'New review' },
    { keys: ['Ctrl', ','], description: 'Open settings' },
    { keys: ['Ctrl', 'Shift', 'T'], description: 'Toggle theme' },
    { keys: ['Ctrl', '/'], description: 'Search' },
  ];

  // Profile state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    jobTitle: '',
    company: '',
    timezone: 'UTC-5 (Eastern)',
    language: 'English',
    github: '',
    twitter: '',
    linkedin: '',
  });

  const handleSaveProfile = () => {
    // Save to localStorage for demo
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCreateApiKey = () => {
    const newKey = `rg_live_${Math.random().toString(36).substring(2, 34)}`;
    setGeneratedKey(newKey);
    const newApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKey,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      scopes: ['read', 'write'],
    };
    setApiKeys([...apiKeys, newApiKey]);
    setNewKeyName('');
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('userAvatar', reader.result as string);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const timezones = [
    'UTC-12 (Baker Island)',
    'UTC-11 (American Samoa)',
    'UTC-10 (Hawaii)',
    'UTC-9 (Alaska)',
    'UTC-8 (Pacific)',
    'UTC-7 (Mountain)',
    'UTC-6 (Central)',
    'UTC-5 (Eastern)',
    'UTC-4 (Atlantic)',
    'UTC-3 (Brazil)',
    'UTC-2 (Mid-Atlantic)',
    'UTC-1 (Azores)',
    'UTC+0 (London)',
    'UTC+1 (Paris)',
    'UTC+2 (Cairo)',
    'UTC+3 (Moscow)',
    'UTC+4 (Dubai)',
    'UTC+5 (Pakistan)',
    'UTC+5:30 (India)',
    'UTC+6 (Bangladesh)',
    'UTC+7 (Bangkok)',
    'UTC+8 (Singapore)',
    'UTC+9 (Tokyo)',
    'UTC+10 (Sydney)',
    'UTC+11 (Solomon Islands)',
    'UTC+12 (New Zealand)',
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900">Settings</h1>
        <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100">
          <TabsTrigger value="profile" className="data-[state=active]:bg-blue-500/20">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="personalization" className="data-[state=active]:bg-blue-500/20">
            <Settings className="h-4 w-4 mr-2" />
            Personalization
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-500/20">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-blue-500/20">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-blue-500/20">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {profile.name.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition">
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="font-medium text-white dark:text-white light:text-gray-900">Profile Photo</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      className="pl-10 bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="jobTitle"
                      value={profile.jobTitle}
                      onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                      placeholder="e.g., Senior Developer"
                      className="pl-10 bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    placeholder="e.g., Acme Corp"
                    className="bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="e.g., San Francisco, CA"
                      className="pl-10 bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                    <select
                      id="timezone"
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded-md text-white dark:text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {timezones.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded-md text-white dark:text-white light:text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-800 dark:border-gray-800 light:border-gray-200">
                <h4 className="font-medium text-white dark:text-white light:text-gray-900 mb-4">Social Links</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <div className="relative">
                      <Code className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="github"
                        value={profile.github}
                        onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                        placeholder="username"
                        className="pl-10 bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">X / Twitter</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="twitter"
                        value={profile.twitter}
                        onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                        placeholder="@username"
                        className="pl-10 bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="linkedin"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                        placeholder="username"
                        className="pl-10 bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                {saved && (
                  <div className="flex items-center text-green-500 animate-fade-in">
                    <Check className="h-4 w-4 mr-2" />
                    <span className="text-sm">Changes saved successfully!</span>
                  </div>
                )}
                <div className="ml-auto">
                  <Button onClick={handleSaveProfile} className="bg-blue-500 hover:bg-blue-600">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personalization Tab */}
        <TabsContent value="personalization" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2 text-purple-500" />
                Accent Color
              </CardTitle>
              <CardDescription>
                Choose your preferred accent color for the interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {accentOptions.map((accent) => {
                  const isSelected = accentColor === accent.color;
                  return (
                    <button
                      key={accent.name}
                      onClick={() => setAccentColor(accent.color)}
                      className={`relative aspect-square rounded-lg transition-all hover:scale-110 ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                      }`}
                      style={{ backgroundColor: accent.color }}
                      title={accent.name}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-6 w-6 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mt-4">
                Selected color: <span className="font-medium" style={{ color: accentColor }}>
                  {accentOptions.find(a => a.color === accentColor)?.name || 'Custom'}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                Visual Effects
              </CardTitle>
              <CardDescription>
                Customize animations and visual enhancements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white dark:text-white light:text-gray-900">Smooth Animations</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                    Enable smooth transitions and animations
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={enableAnimations}
                    onChange={(e) => setEnableAnimations(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white dark:text-white light:text-gray-900">Particle Effects</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                    Show decorative particle effects (may impact performance)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={enableParticles}
                    onChange={(e) => setEnableParticles(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white dark:text-white light:text-gray-900">Compact Mode</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                    Reduce spacing and padding for more content density
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="h-5 w-5 mr-2 text-green-500" />
                Dashboard Layout
              </CardTitle>
              <CardDescription>
                Customize your dashboard widgets and layout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Risk Score', 'Recent Reviews', 'Critical Issues', 'Activity Feed', 'Quick Stats', 'Team Activity'].map((widget) => (
                  <label key={widget} className="relative flex items-center p-3 border-2 border-gray-700 dark:border-gray-700 light:border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input type="checkbox" defaultChecked className="mr-3 rounded" />
                    <span className="text-sm font-medium text-white dark:text-white light:text-gray-900">{widget}</span>
                  </label>
                ))}
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600">
                <Save className="h-4 w-4 mr-2" />
                Save Layout
              </Button>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Command className="h-5 w-5 mr-2 text-blue-500" />
                Keyboard Shortcuts
              </CardTitle>
              <CardDescription>
                Learn keyboard shortcuts to navigate faster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {keyboardShortcuts.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, j) => (
                        <kbd key={j} className="px-2 py-1 text-xs font-semibold bg-gray-800 dark:bg-gray-800 light:bg-gray-200 border border-gray-700 dark:border-gray-700 light:border-gray-300 rounded text-gray-300 dark:text-gray-300 light:text-gray-700">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-200">
                    <p className="font-medium mb-1">Pro Tip</p>
                    <p>Press <kbd className="px-2 py-0.5 text-xs bg-blue-900/50 rounded">Ctrl+K</kbd> to open the command palette and access any feature quickly!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-yellow-500" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Choose what emails you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white dark:text-white light:text-gray-900">Code Review Alerts</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                    Notify me when a new code review is ready
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white dark:text-white light:text-gray-900">Critical Issues</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                    Notify me immediately for critical security findings
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white dark:text-white light:text-gray-900">Weekly Summary</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                    Receive weekly reports of all reviews
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white dark:text-white light:text-gray-900">Product Updates</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                    News about ReleaseGuard AI features
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-800 dark:border-gray-800 light:border-gray-200">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>In-App Notifications</CardTitle>
              <CardDescription>
                Manage notifications within the app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white dark:text-white light:text-gray-900">Desktop Notifications</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                    Show browser notifications for important events
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white dark:text-white light:text-gray-900">Sound</p>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                    Play sound for notifications
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                Password & Authentication
              </CardTitle>
              <CardDescription>
                Manage your password and authentication methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                  />
                </div>

                <Button className="bg-blue-500 hover:bg-blue-600">
                  Update Password
                </Button>
              </div>

              <div className="pt-6 border-t border-gray-800 dark:border-gray-800 light:border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-white dark:text-white light:text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                    <div className="flex items-center space-x-2 pt-2">
                      <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
                        Not Enabled
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="dark:border-gray-700 light:border-gray-300">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage devices where you're currently signed in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between p-4 bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Monitor className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-white dark:text-white light:text-gray-900">Current Device</p>
                    <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                      Windows • Chrome • San Francisco, CA
                    </p>
                    <p className="text-xs text-green-500 mt-1">Active now</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-white dark:text-white light:text-gray-900">iPhone 15</p>
                    <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                      iOS • Safari • San Francisco, CA
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Last active 2 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 dark:border-gray-700 light:border-gray-300">
                  Revoke
                </Button>
              </div>

              <Button variant="outline" className="w-full dark:border-gray-700 light:border-gray-300">
                Sign Out All Other Sessions
              </Button>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>
                Recent login activity on your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { time: '2 hours ago', location: 'San Francisco, CA', device: 'iPhone 15', success: true },
                { time: '1 day ago', location: 'San Francisco, CA', device: 'Windows • Chrome', success: true },
                { time: '3 days ago', location: 'New York, NY', device: 'MacBook Pro', success: true },
                { time: '1 week ago', location: 'London, UK', device: 'Unknown Device', success: false },
              ].map((login, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 dark:border-gray-800 light:border-gray-200 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${login.success ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-sm text-white dark:text-white light:text-gray-900">{login.device}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600">
                        {login.location} • {login.time}
                      </p>
                    </div>
                  </div>
                  <div className={`text-xs ${login.success ? 'text-green-500' : 'text-red-500'}`}>
                    {login.success ? 'Success' : 'Failed'}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-purple-500" />
                    API Keys
                  </CardTitle>
                  <CardDescription>
                    Manage API keys for integrating with ReleaseGuard AI
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setShowNewKeyDialog(true)}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="p-4 bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-50 rounded-lg border border-gray-700 dark:border-gray-700 light:border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-white dark:text-white light:text-gray-900">
                        {apiKey.name}
                      </h4>
                      <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mt-1">
                        Created {apiKey.created} • Last used {apiKey.lastUsed}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:text-red-300 dark:border-gray-700 light:border-gray-300"
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <code className="flex-1 px-3 py-2 bg-gray-900 dark:bg-gray-900 light:bg-white rounded border border-gray-700 dark:border-gray-700 light:border-gray-300 text-sm font-mono text-gray-300 dark:text-gray-300 light:text-gray-900">
                      {apiKey.key}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyKey(apiKey.key)}
                      className="dark:border-gray-700 light:border-gray-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Scopes:</span>
                    {apiKey.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {apiKeys.length === 0 && (
                <div className="text-center py-12">
                  <Key className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                    No API keys yet. Create one to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create New Key Dialog */}
          {showNewKeyDialog && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <Card className="max-w-md w-full glass">
                <CardHeader>
                  <CardTitle>Create New API Key</CardTitle>
                  <CardDescription>
                    Generate a new API key for your integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!generatedKey ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="key-name">Key Name</Label>
                        <Input
                          id="key-name"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          placeholder="e.g., Production API Key"
                          className="bg-gray-800/50 dark:bg-gray-800/50 light:bg-white border-gray-700 dark:border-gray-700 light:border-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">
                              Read access
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-700">
                              Write access
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowNewKeyDialog(false)}
                          className="flex-1 dark:border-gray-700 light:border-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateApiKey}
                          disabled={!newKeyName}
                          className="flex-1 bg-purple-500 hover:bg-purple-600"
                        >
                          Generate Key
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-yellow-200">
                            <p className="font-medium mb-1">Save this key now!</p>
                            <p>You won't be able to see it again after closing this dialog.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Your New API Key</Label>
                        <div className="flex items-center space-x-2">
                          <code className="flex-1 px-3 py-2 bg-gray-900 dark:bg-gray-900 light:bg-white rounded border border-gray-700 dark:border-gray-700 light:border-gray-300 text-sm font-mono text-green-400 break-all">
                            {generatedKey}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyKey(generatedKey)}
                            className="dark:border-gray-700 light:border-gray-300"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setShowNewKeyDialog(false);
                          setGeneratedKey('');
                        }}
                        className="w-full bg-purple-500 hover:bg-purple-600"
                      >
                        Done
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="glass">
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>
                Monitor your API usage and rate limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Requests Today</p>
                  <p className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mt-1">1,247</p>
                  <p className="text-xs text-gray-500 mt-1">of 10,000 limit</p>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mt-1">99.8%</p>
                  <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Avg Response</p>
                  <p className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mt-1">234ms</p>
                  <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
