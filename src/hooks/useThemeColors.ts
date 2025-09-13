import { useTheme } from '@/providers/ThemeProvider';

export function useThemeColors() {
  const { getThemeColor, getThemeGradient, currentTheme } = useTheme();

  return {
    // Primary colors
    primary: {
      50: getThemeColor('primary.50'),
      100: getThemeColor('primary.100'),
      200: getThemeColor('primary.200'),
      300: getThemeColor('primary.300'),
      400: getThemeColor('primary.400'),
      500: getThemeColor('primary.500'),
      600: getThemeColor('primary.600'),
      700: getThemeColor('primary.700'),
      800: getThemeColor('primary.800'),
      900: getThemeColor('primary.900'),
      950: getThemeColor('primary.950'),
    },

    // Secondary colors
    secondary: {
      50: getThemeColor('secondary.50'),
      100: getThemeColor('secondary.100'),
      200: getThemeColor('secondary.200'),
      300: getThemeColor('secondary.300'),
      400: getThemeColor('secondary.400'),
      500: getThemeColor('secondary.500'),
      600: getThemeColor('secondary.600'),
      700: getThemeColor('secondary.700'),
      800: getThemeColor('secondary.800'),
      900: getThemeColor('secondary.900'),
      950: getThemeColor('secondary.950'),
    },

    // Semantic colors
    success: {
      50: getThemeColor('success.50'),
      500: getThemeColor('success.500'),
      600: getThemeColor('success.600'),
      700: getThemeColor('success.700'),
    },

    error: {
      50: getThemeColor('error.50'),
      500: getThemeColor('error.500'),
      600: getThemeColor('error.600'),
      700: getThemeColor('error.700'),
    },

    warning: {
      50: getThemeColor('warning.50'),
      500: getThemeColor('warning.500'),
      600: getThemeColor('warning.600'),
      700: getThemeColor('warning.700'),
    },

    info: {
      50: getThemeColor('info.50'),
      500: getThemeColor('info.500'),
      600: getThemeColor('info.600'),
      700: getThemeColor('info.700'),
    },

    // Background colors
    background: {
      primary: getThemeColor('background.primary'),
      secondary: getThemeColor('background.secondary'),
      tertiary: getThemeColor('background.tertiary'),
      inverse: getThemeColor('background.inverse'),
    },

    // Text colors
    text: {
      primary: getThemeColor('text.primary'),
      secondary: getThemeColor('text.secondary'),
      tertiary: getThemeColor('text.tertiary'),
      inverse: getThemeColor('text.inverse'),
      link: getThemeColor('text.link'),
      linkHover: getThemeColor('text.linkHover'),
    },

    // Border colors
    border: {
      primary: getThemeColor('border.primary'),
      secondary: getThemeColor('border.secondary'),
      focus: getThemeColor('border.focus'),
      error: getThemeColor('border.error'),
      success: getThemeColor('border.success'),
    },

    // Gradients
    gradients: {
      primary: getThemeGradient('primary'),
      secondary: getThemeGradient('secondary'),
      hero: getThemeGradient('hero'),
      card: getThemeGradient('card'),
      button: getThemeGradient('button'),
      accent: getThemeGradient('accent'),
    },

    // Helper functions
    getColor: getThemeColor,
    getGradient: getThemeGradient,
    currentTheme,
  };
}
