'use client';

import { useState } from 'react';
import { useTheme, ACCENT_COLORS } from '@/lib/theme/theme-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Check,
  Palette,
} from 'lucide-react';

interface ThemePickerModalProps {
  onComplete: () => void;
}

export function ThemePickerModal({ onComplete }: ThemePickerModalProps) {
  const { setTheme, setAccentColor, theme, accentColor } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>(
    theme
  );
  const [selectedAccent, setSelectedAccent] = useState<string>(accentColor);

  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: Sun,
      description: 'Clean and bright',
      preview: 'from-white to-gray-50',
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes',
      preview: 'from-gray-950 to-gray-900',
    },
    {
      value: 'auto' as const,
      label: 'Auto',
      icon: Monitor,
      description: 'Matches system',
      preview: 'from-blue-950 to-purple-950',
    },
  ];

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

  const handleComplete = () => {
    setTheme(selectedTheme);
    setAccentColor(selectedAccent);
    localStorage.setItem('themeSelected', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="max-w-2xl w-full bg-gray-900 border-gray-800 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Welcome to ReleaseGuard AI
            </h2>
            <p className="text-gray-400 text-lg">
              Choose your preferred theme to get started
            </p>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">
              Choose Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = selectedTheme === themeOption.value;

                return (
                  <button
                    key={themeOption.value}
                    onClick={() => setSelectedTheme(themeOption.value)}
                    className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div
                      className={`h-16 rounded-lg bg-gradient-to-br ${themeOption.preview} mb-3`}
                    />
                    <Icon
                      className={`h-5 w-5 mx-auto mb-2 ${
                        isSelected ? 'text-blue-400' : 'text-gray-400'
                      }`}
                    />
                    <p
                      className={`font-medium text-sm ${
                        isSelected ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {themeOption.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {themeOption.description}
                    </p>
                    {isSelected && (
                      <div className="absolute top-2 right-2 p-1 bg-blue-500 rounded-full">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Selection */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Accent Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {accentOptions.map((accent) => {
                const isSelected = selectedAccent === accent.color;
                return (
                  <button
                    key={accent.name}
                    onClick={() => setSelectedAccent(accent.color)}
                    className={`relative aspect-square rounded-lg transition-all hover:scale-110 ${
                      isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                    }`}
                    style={{ backgroundColor: accent.color }}
                    title={accent.name}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleComplete}
              className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
