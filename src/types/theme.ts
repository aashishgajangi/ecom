// Theme system types
export interface ColorScheme {
  // Primary colors
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string; // Main color
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  
  // Secondary colors
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  
  // Neutral colors (grays)
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  
  // Semantic colors
  success: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  
  error: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  
  warning: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  
  info: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  
  // Background colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    link: string;
    linkHover: string;
  };
  
  // Border colors
  border: {
    primary: string;
    secondary: string;
    focus: string;
    error: string;
    success: string;
  };
  
  // Gradients
  gradients: {
    primary: string;
    secondary: string;
    hero: string;
    card: string;
    button: string;
    accent: string;
  };

  // UI Component Colors
  ui: {
    // Badge colors
    badge: {
      sale: string;
      featured: string;
      new: string;
      stock: string;
      outOfStock: string;
    };
    
    // Rating colors
    rating: {
      filled: string;
      empty: string;
    };
    
    // Status colors
    status: {
      inStock: string;
      outOfStock: string;
      lowStock: string;
      processing: string;
      shipped: string;
      delivered: string;
      cancelled: string;
    };
    
    // Interactive element colors
    interactive: {
      hover: string;
      active: string;
      disabled: string;
      focus: string;
      selected: string;
    };
    
    // Card colors
    card: {
      background: string;
      border: string;
      shadow: string;
      hoverShadow: string;
    };
    
    // Form colors
    form: {
      inputBackground: string;
      inputBorder: string;
      inputFocus: string;
      label: string;
      placeholder: string;
      error: string;
      success: string;
    };
    
    // Navigation colors
    nav: {
      background: string;
      text: string;
      hover: string;
      active: string;
      border: string;
    };
    
    // Footer colors
    footer: {
      background: string;
      text: string;
      link: string;
      linkHover: string;
      border: string;
    };
    
    // Hero section colors
    hero: {
      background: string;
      text: string;
      overlay: string;
    };
    
    // Pagination colors
    pagination: {
      background: string;
      text: string;
      hover: string;
      active: string;
      border: string;
    };
    
    // Loading colors
    loading: {
      spinner: string;
      background: string;
      text: string;
    };
    
    // Alert colors
    alert: {
      info: string;
      warning: string;
      error: string;
      success: string;
    };
  };
}

export interface Typography {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  
  fontWeight: {
    thin: string;
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
  };
  
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface Spacing {
  scale: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
    40: string;
    48: string;
    56: string;
    64: string;
  };
  
  container: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

export interface Borders {
  radius: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  
  width: {
    0: string;
    1: string;
    2: string;
    4: string;
    8: string;
  };
  
  shadows: {
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
    none: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  isSystem: boolean;
  colorScheme: ColorScheme;
  typography?: Typography;
  spacing?: Spacing;
  borders?: Borders;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  version: string;
  tags: string[];
  preview?: string;
}

export interface ThemeSettings {
  id: string;
  activeThemeId?: string;
  allowUserThemes: boolean;
  enableDarkMode: boolean;
  updatedAt: string;
  activeTheme?: Theme;
}

// Default theme configurations
export const DEFAULT_COLOR_SCHEME: ColorScheme = {
  primary: {
    50: '#f0f9f0',
    100: '#dcf2dc',
    200: '#bce5bc',
    300: '#8dd18d',
    400: '#70843d', // Current primary
    500: '#5a9f53', // Current medium
    600: '#4a8543',
    700: '#3d6b36',
    800: '#345530',
    900: '#2c462a',
    950: '#162512'
  },
  
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#7bd63c', // Current light green
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  },
  
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },
  
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    inverse: '#111827'
  },
  
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    tertiary: '#6b7280',
    inverse: '#ffffff',
    link: '#70843d',
    linkHover: '#5a9f53'
  },
  
  border: {
    primary: '#e5e7eb',
    secondary: '#d1d5db',
    focus: '#70843d',
    error: '#ef4444',
    success: '#22c55e'
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #70843d 0%, #5a9f53 50%, #7bd63c 100%)',
    secondary: 'linear-gradient(135deg, #7bd63c 0%, #5a9f53 100%)',
    hero: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 50%, #f0f9f0 100%)',
    card: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
    button: 'linear-gradient(135deg, #70843d 0%, #7bd63c 100%)',
    accent: 'linear-gradient(135deg, #7bd63c 0%, #70843d 100%)'
  },

  // UI Component Colors
  ui: {
    // Badge colors
    badge: {
      sale: '#ef4444',
      featured: '#f59e0b',
      new: '#22c55e',
      stock: '#22c55e',
      outOfStock: '#6b7280'
    },
    
    // Rating colors
    rating: {
      filled: '#fbbf24',
      empty: '#d1d5db'
    },
    
    // Status colors
    status: {
      inStock: '#22c55e',
      outOfStock: '#ef4444',
      lowStock: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#22c55e',
      cancelled: '#6b7280'
    },
    
    // Interactive element colors
    interactive: {
      hover: '#70843d',
      active: '#5a6b34',
      disabled: '#9ca3af',
      focus: '#70843d',
      selected: '#70843d'
    },
    
    // Card colors
    card: {
      background: '#ffffff',
      border: '#e5e7eb',
      shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
      hoverShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)'
    },
    
    // Form colors
    form: {
      inputBackground: '#ffffff',
      inputBorder: '#d1d5db',
      inputFocus: '#70843d',
      label: '#374151',
      placeholder: '#9ca3af',
      error: '#ef4444',
      success: '#22c55e'
    },
    
    // Navigation colors
    nav: {
      background: '#ffffff',
      text: '#374151',
      hover: '#70843d',
      active: '#70843d',
      border: '#e5e7eb'
    },
    
    // Footer colors
    footer: {
      background: '#f9fafb',
      text: '#6b7280',
      link: '#70843d',
      linkHover: '#5a6b34',
      border: '#e5e7eb'
    },
    
    // Hero section colors
    hero: {
      background: 'linear-gradient(135deg, #70843d 0%, #7bd63c 100%)',
      text: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.1)'
    },
    
    // Pagination colors
    pagination: {
      background: '#ffffff',
      text: '#374151',
      hover: '#f3f4f6',
      active: '#70843d',
      border: '#d1d5db'
    },
    
    // Loading colors
    loading: {
      spinner: '#70843d',
      background: '#f9fafb',
      text: '#6b7280'
    },
    
    // Alert colors
    alert: {
      info: '#3b82f6',
      warning: '#f59e0b',
      error: '#ef4444',
      success: '#22c55e'
    }
  }
};

export const DEFAULT_TYPOGRAPHY: Typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['Menlo', 'Monaco', 'monospace']
  },
  
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem'
  },
  
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em'
  }
};

export const DEFAULT_SPACING: Spacing = {
  scale: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem'
  },
  
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

export const DEFAULT_BORDERS: Borders = {
  radius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  width: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000'
  }
};
