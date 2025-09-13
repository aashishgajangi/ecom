import { Theme } from '@/types/theme';

export function generateThemeCSS(theme: Theme): string {
  const colorScheme = theme.colorScheme;
  
  let css = `
    /* Theme: ${theme.name} */
    :root {
  `;

  // Primary colors
  if (colorScheme.primary) {
    Object.entries(colorScheme.primary).forEach(([key, value]) => {
      css += `      --color-primary-${key}: ${value};\n`;
    });
  }

  // Secondary colors
  if (colorScheme.secondary) {
    Object.entries(colorScheme.secondary).forEach(([key, value]) => {
      css += `      --color-secondary-${key}: ${value};\n`;
    });
  }

  // Neutral colors
  if (colorScheme.neutral) {
    Object.entries(colorScheme.neutral).forEach(([key, value]) => {
      css += `      --color-neutral-${key}: ${value};\n`;
    });
  }

  // Semantic colors
  ['success', 'error', 'warning', 'info'].forEach(color => {
    const colorPalette = (colorScheme as any)[color];
    if (colorPalette) {
      Object.entries(colorPalette).forEach(([key, value]) => {
        css += `      --color-${color}-${key}: ${value};\n`;
      });
    }
  });

  // Background colors
  if (colorScheme.background) {
    Object.entries(colorScheme.background).forEach(([key, value]) => {
      css += `      --color-bg-${key}: ${value};\n`;
    });
  }

  // Text colors
  if (colorScheme.text) {
    Object.entries(colorScheme.text).forEach(([key, value]) => {
      css += `      --color-text-${key}: ${value};\n`;
    });
  }

  // Border colors
  if (colorScheme.border) {
    Object.entries(colorScheme.border).forEach(([key, value]) => {
      css += `      --color-border-${key}: ${value};\n`;
    });
  }

  // Gradients
  if (colorScheme.gradients) {
    Object.entries(colorScheme.gradients).forEach(([key, value]) => {
      css += `      --gradient-${key}: ${value};\n`;
    });
  }

  // UI Component Colors
  if (colorScheme.ui) {
    // Badge colors
    if (colorScheme.ui.badge) {
      Object.entries(colorScheme.ui.badge).forEach(([key, value]) => {
        css += `      --ui-badge-${key}: ${value};\n`;
      });
    }
    
    // Rating colors
    if (colorScheme.ui.rating) {
      Object.entries(colorScheme.ui.rating).forEach(([key, value]) => {
        css += `      --ui-rating-${key}: ${value};\n`;
      });
    }
    
    // Status colors
    if (colorScheme.ui.status) {
      Object.entries(colorScheme.ui.status).forEach(([key, value]) => {
        css += `      --ui-status-${key}: ${value};\n`;
      });
    }
    
    // Interactive colors
    if (colorScheme.ui.interactive) {
      Object.entries(colorScheme.ui.interactive).forEach(([key, value]) => {
        css += `      --ui-interactive-${key}: ${value};\n`;
      });
    }
    
    // Card colors
    if (colorScheme.ui.card) {
      Object.entries(colorScheme.ui.card).forEach(([key, value]) => {
        css += `      --ui-card-${key}: ${value};\n`;
      });
    }
    
    // Form colors
    if (colorScheme.ui.form) {
      Object.entries(colorScheme.ui.form).forEach(([key, value]) => {
        css += `      --ui-form-${key}: ${value};\n`;
      });
    }
    
    // Navigation colors
    if (colorScheme.ui.nav) {
      Object.entries(colorScheme.ui.nav).forEach(([key, value]) => {
        css += `      --ui-nav-${key}: ${value};\n`;
      });
    }
    
    // Footer colors
    if (colorScheme.ui.footer) {
      Object.entries(colorScheme.ui.footer).forEach(([key, value]) => {
        css += `      --ui-footer-${key}: ${value};\n`;
      });
    }
    
    // Hero colors
    if (colorScheme.ui.hero) {
      Object.entries(colorScheme.ui.hero).forEach(([key, value]) => {
        css += `      --ui-hero-${key}: ${value};\n`;
      });
    }
    
    // Pagination colors
    if (colorScheme.ui.pagination) {
      Object.entries(colorScheme.ui.pagination).forEach(([key, value]) => {
        css += `      --ui-pagination-${key}: ${value};\n`;
      });
    }
    
    // Loading colors
    if (colorScheme.ui.loading) {
      Object.entries(colorScheme.ui.loading).forEach(([key, value]) => {
        css += `      --ui-loading-${key}: ${value};\n`;
      });
    }
    
    // Alert colors
    if (colorScheme.ui.alert) {
      Object.entries(colorScheme.ui.alert).forEach(([key, value]) => {
        css += `      --ui-alert-${key}: ${value};\n`;
      });
    }
  }

  // Typography
  if (theme.typography) {
    const typography = theme.typography;
    
    if (typography.fontFamily) {
      css += `      --font-sans: ${typography.fontFamily.sans.join(', ')};\n`;
      css += `      --font-serif: ${typography.fontFamily.serif.join(', ')};\n`;
      css += `      --font-mono: ${typography.fontFamily.mono.join(', ')};\n`;
    }

    if (typography.fontSize) {
      Object.entries(typography.fontSize).forEach(([key, value]) => {
        css += `      --text-${key}: ${value};\n`;
      });
    }

    if (typography.fontWeight) {
      Object.entries(typography.fontWeight).forEach(([key, value]) => {
        css += `      --font-${key}: ${value};\n`;
      });
    }
  }

  // Spacing
  if (theme.spacing) {
    Object.entries(theme.spacing.scale).forEach(([key, value]) => {
      css += `      --spacing-${key}: ${value};\n`;
    });

    if (theme.spacing.container) {
      Object.entries(theme.spacing.container).forEach(([key, value]) => {
        css += `      --container-${key}: ${value};\n`;
      });
    }
  }

  // Borders
  if (theme.borders) {
    // Border radius
    Object.entries(theme.borders.radius).forEach(([key, value]) => {
      css += `      --radius-${key}: ${value};\n`;
    });

    // Border width
    Object.entries(theme.borders.width).forEach(([key, value]) => {
      css += `      --border-${key}: ${value};\n`;
    });

    // Shadows
    Object.entries(theme.borders.shadows).forEach(([key, value]) => {
      css += `      --shadow-${key}: ${value};\n`;
    });
  }

  css += `    }\n`;

  // Add utility classes
  css += `
    /* Theme utility classes */
    .theme-bg-primary { background-color: var(--color-bg-primary); }
    .theme-bg-secondary { background-color: var(--color-bg-secondary); }
    .theme-bg-tertiary { background-color: var(--color-bg-tertiary); }
    
    .theme-text-primary { color: var(--color-text-primary); }
    .theme-text-secondary { color: var(--color-text-secondary); }
    .theme-text-tertiary { color: var(--color-text-tertiary); }
    .theme-text-link { color: var(--color-text-link); }
    
    .theme-border-primary { border-color: var(--color-border-primary); }
    .theme-border-secondary { border-color: var(--color-border-secondary); }
    .theme-border-focus { border-color: var(--color-border-focus); }
    
    .theme-gradient-primary { background: var(--gradient-primary); }
    .theme-gradient-secondary { background: var(--gradient-secondary); }
    .theme-gradient-hero { background: var(--gradient-hero); }
    .theme-gradient-button { background: var(--gradient-button); }
    
    /* Component classes that use theme variables */
    .gradient-bg {
      background: var(--gradient-primary);
    }
    
    .gradient-text {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .btn-primary {
      background: var(--gradient-button);
      color: var(--color-text-inverse);
      border: 1px solid var(--color-primary-600);
    }
    
    .btn-primary:hover {
      background: var(--gradient-accent);
      border-color: var(--color-primary-700);
    }
    
    .btn-secondary {
      background: transparent;
      color: var(--color-primary-600);
      border: 2px solid var(--color-primary-600);
    }
    
    .btn-secondary:hover {
      background: var(--color-primary-50);
      color: var(--color-primary-700);
    }
    
    .container-custom {
      max-width: var(--container-xl, 1280px);
      margin-left: auto;
      margin-right: auto;
      padding-left: var(--spacing-4, 1rem);
      padding-right: var(--spacing-4, 1rem);
    }
    
    .card-theme {
      background: var(--gradient-card);
      border: 1px solid var(--color-border-primary);
      border-radius: var(--radius-lg, 0.5rem);
      box-shadow: var(--shadow-md);
    }
    
    .input-theme {
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border-primary);
      border-radius: var(--radius-base, 0.25rem);
      color: var(--color-text-primary);
    }
    
    .input-theme:focus {
      border-color: var(--color-border-focus);
      box-shadow: 0 0 0 3px var(--color-primary-100);
    }
  `;

  return css;
}

export function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return;

  // Remove existing theme styles
  const existingStyle = document.getElementById('dynamic-theme-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style element
  const style = document.createElement('style');
  style.id = 'dynamic-theme-styles';
  style.textContent = generateThemeCSS(theme);
  
  // Append to head
  document.head.appendChild(style);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function generateColorPalette(baseColor: string): Record<string, string> {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return {};

  const palette: Record<string, string> = {};
  
  // Generate lighter shades (50-400)
  for (let i = 50; i <= 400; i += 50) {
    const factor = 1 - (i / 500);
    palette[i.toString()] = rgbToHex(
      Math.round(rgb.r + (255 - rgb.r) * (1 - factor)),
      Math.round(rgb.g + (255 - rgb.g) * (1 - factor)),
      Math.round(rgb.b + (255 - rgb.b) * (1 - factor))
    );
  }

  // Base color (500)
  palette['500'] = baseColor;

  // Generate darker shades (600-950)
  for (let i = 600; i <= 950; i += 50) {
    const factor = (i - 500) / 450;
    palette[i.toString()] = rgbToHex(
      Math.round(rgb.r * (1 - factor * 0.8)),
      Math.round(rgb.g * (1 - factor * 0.8)),
      Math.round(rgb.b * (1 - factor * 0.8))
    );
  }

  return palette;
}

export function validateTheme(theme: any): string[] {
  const errors: string[] = [];

  if (!theme.name) errors.push('Theme name is required');
  if (!theme.slug) errors.push('Theme slug is required');
  if (!theme.colorScheme) errors.push('Color scheme is required');

  if (theme.colorScheme) {
    const requiredColorSections = ['primary', 'secondary', 'neutral', 'background', 'text', 'border'];
    
    for (const section of requiredColorSections) {
      if (!theme.colorScheme[section]) {
        errors.push(`Color scheme section '${section}' is required`);
      }
    }

    // Validate primary colors have required shades
    if (theme.colorScheme.primary) {
      const requiredShades = ['500']; // At minimum need the base color
      for (const shade of requiredShades) {
        if (!theme.colorScheme.primary[shade]) {
          errors.push(`Primary color shade '${shade}' is required`);
        }
      }
    }
  }

  return errors;
}
