'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeSettings } from '@/types/theme';

interface ThemeContextType {
  currentTheme: Theme | null;
  availableThemes: Theme[];
  themeSettings: ThemeSettings | null;
  isLoading: boolean;
  switchTheme: (themeId: string) => Promise<void>;
  refreshThemes: () => Promise<void>;
  getThemeColor: (path: string) => string;
  getThemeGradient: (name: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch themes and settings
  const refreshThemes = async () => {
    if (!mounted) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/themes');
      if (response.ok) {
        const data = await response.json();
        setAvailableThemes(data.themes || []);
        setCurrentTheme(data.activeTheme || null);
        setThemeSettings(data.settings || null);
        
        // Theme application is now handled by the script in layout.tsx
        // to prevent hydration mismatches
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load themes on mount
  useEffect(() => {
    if (mounted) {
      refreshThemes();
    }
  }, [mounted]);

  // Apply theme whenever currentTheme changes
  // Note: Theme application is now handled by the script in layout.tsx
  // to prevent hydration mismatches

  // Switch to a different theme
  const switchTheme = async (themeId: string) => {
    if (!mounted) return;
    
    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeId }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentTheme(data.activeTheme);
        
        // Theme application is now handled by the script in layout.tsx
        // to prevent hydration mismatches
      }
    } catch (error) {
      console.error('Error switching theme:', error);
    }
  };

  // Get color value by path (e.g., 'primary.500' or 'text.primary')
  const getThemeColor = (path: string): string => {
    if (!currentTheme?.colorScheme) {
      return '#70843d'; // Fallback color
    }

    const keys = path.split('.');
    let value: any = currentTheme.colorScheme;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return '#70843d'; // Fallback color
      }
    }

    return typeof value === 'string' ? value : '#70843d';
  };

  // Get gradient by name
  const getThemeGradient = (name: string): string => {
    if (!currentTheme?.colorScheme?.gradients) {
      return 'linear-gradient(135deg, #70843d 0%, #7bd63c 100%)'; // Fallback gradient
    }

    const gradient = (currentTheme.colorScheme.gradients as any)[name];
    return gradient || 'linear-gradient(135deg, #70843d 0%, #7bd63c 100%)';
  };

  // Apply theme colors to CSS variables
  const applyThemeToDocument = (theme: Theme) => {
    if (typeof document === 'undefined' || !mounted) return;

    const root = document.documentElement;
    const colorScheme = theme.colorScheme;

    // Apply primary colors
    if (colorScheme.primary) {
      Object.entries(colorScheme.primary).forEach(([key, value]) => {
        root.style.setProperty(`--color-primary-${key}`, value);
      });
    }

    // Apply secondary colors
    if (colorScheme.secondary) {
      Object.entries(colorScheme.secondary).forEach(([key, value]) => {
        root.style.setProperty(`--color-secondary-${key}`, value);
      });
    }

    // Apply neutral colors
    if (colorScheme.neutral) {
      Object.entries(colorScheme.neutral).forEach(([key, value]) => {
        root.style.setProperty(`--color-neutral-${key}`, value);
      });
    }

    // Apply semantic colors
    ['success', 'error', 'warning', 'info'].forEach(color => {
      const colorPalette = (colorScheme as any)[color];
      if (colorPalette) {
        Object.entries(colorPalette).forEach(([key, value]) => {
          root.style.setProperty(`--color-${color}-${key}`, value as string);
        });
      }
    });

    // Apply background colors
    if (colorScheme.background) {
      Object.entries(colorScheme.background).forEach(([key, value]) => {
        root.style.setProperty(`--color-bg-${key}`, value);
      });
    }

    // Apply text colors
    if (colorScheme.text) {
      Object.entries(colorScheme.text).forEach(([key, value]) => {
        root.style.setProperty(`--color-text-${key}`, value);
      });
    }

    // Apply border colors
    if (colorScheme.border) {
      Object.entries(colorScheme.border).forEach(([key, value]) => {
        root.style.setProperty(`--color-border-${key}`, value);
      });
    }

    // Apply gradients
    if (colorScheme.gradients) {
      Object.entries(colorScheme.gradients).forEach(([key, value]) => {
        root.style.setProperty(`--gradient-${key}`, value);
      });
    }

    // Apply UI component colors
    if (colorScheme.ui) {
      // Badge colors
      if (colorScheme.ui.badge) {
        Object.entries(colorScheme.ui.badge).forEach(([key, value]) => {
          root.style.setProperty(`--ui-badge-${key}`, value);
        });
      }
      
      // Rating colors
      if (colorScheme.ui.rating) {
        Object.entries(colorScheme.ui.rating).forEach(([key, value]) => {
          root.style.setProperty(`--ui-rating-${key}`, value);
        });
      }
      
      // Status colors
      if (colorScheme.ui.status) {
        Object.entries(colorScheme.ui.status).forEach(([key, value]) => {
          root.style.setProperty(`--ui-status-${key}`, value);
        });
      }
      
      // Interactive colors
      if (colorScheme.ui.interactive) {
        Object.entries(colorScheme.ui.interactive).forEach(([key, value]) => {
          root.style.setProperty(`--ui-interactive-${key}`, value);
        });
      }
      
      // Card colors
      if (colorScheme.ui.card) {
        Object.entries(colorScheme.ui.card).forEach(([key, value]) => {
          root.style.setProperty(`--ui-card-${key}`, value);
        });
      }
      
      // Form colors
      if (colorScheme.ui.form) {
        Object.entries(colorScheme.ui.form).forEach(([key, value]) => {
          root.style.setProperty(`--ui-form-${key}`, value);
        });
      }
      
      // Navigation colors
      if (colorScheme.ui.nav) {
        Object.entries(colorScheme.ui.nav).forEach(([key, value]) => {
          root.style.setProperty(`--ui-nav-${key}`, value);
        });
      }
      
      // Footer colors
      if (colorScheme.ui.footer) {
        Object.entries(colorScheme.ui.footer).forEach(([key, value]) => {
          root.style.setProperty(`--ui-footer-${key}`, value);
        });
      }
      
      // Hero colors
      if (colorScheme.ui.hero) {
        Object.entries(colorScheme.ui.hero).forEach(([key, value]) => {
          root.style.setProperty(`--ui-hero-${key}`, value);
        });
      }
      
      // Pagination colors
      if (colorScheme.ui.pagination) {
        Object.entries(colorScheme.ui.pagination).forEach(([key, value]) => {
          root.style.setProperty(`--ui-pagination-${key}`, value);
        });
      }
      
      // Loading colors
      if (colorScheme.ui.loading) {
        Object.entries(colorScheme.ui.loading).forEach(([key, value]) => {
          root.style.setProperty(`--ui-loading-${key}`, value);
        });
      }
      
      // Alert colors
      if (colorScheme.ui.alert) {
        Object.entries(colorScheme.ui.alert).forEach(([key, value]) => {
          root.style.setProperty(`--ui-alert-${key}`, value);
        });
      }
    }

    // Apply typography if available
    if (theme.typography) {
      const typography = theme.typography;
      
      // Font families
      if (typography.fontFamily) {
        root.style.setProperty('--font-sans', typography.fontFamily.sans.join(', '));
        root.style.setProperty('--font-serif', typography.fontFamily.serif.join(', '));
        root.style.setProperty('--font-mono', typography.fontFamily.mono.join(', '));
      }
    }

    // Apply spacing if available
    if (theme.spacing) {
      Object.entries(theme.spacing.scale).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });
    }

    // Apply borders if available
    if (theme.borders) {
      // Border radius
      Object.entries(theme.borders.radius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value);
      });

      // Shadows
      Object.entries(theme.borders.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });
    }
  };

  const value: ThemeContextType = {
    currentTheme,
    availableThemes,
    themeSettings,
    isLoading,
    switchTheme,
    refreshThemes,
    getThemeColor,
    getThemeGradient,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
