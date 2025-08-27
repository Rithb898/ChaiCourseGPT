// ChaiCourseGPT Design System
// Centralized design tokens and utilities for consistent styling

export const designTokens = {
  // Color Palette
  colors: {
    // Primary Brand Colors
    primary: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316", // Main orange
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
    },

    // Neutral Grays
    gray: {
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
      950: "#09090b",
    },

    // Semantic Colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // Typography Scale
  typography: {
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },

    fontWeights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },

    lineHeights: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },

  // Spacing Scale
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
    "4xl": "4rem",
  },

  // Border Radius
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  // Animation Durations
  animations: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
  },

  // Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
};

// Component Variants
export const componentVariants = {
  // Button Variants
  button: {
    primary:
      "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    ghost: "bg-transparent text-gray-300 hover:bg-gray-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
  },

  // Message Bubble Variants
  messageBubble: {
    user: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    assistant:
      "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-gray-700",
  },

  // Card Variants
  card: {
    default:
      "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm",
    elevated:
      "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl",
    interactive:
      "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-200",
  },

  // Status Indicators
  status: {
    online: "bg-green-500",
    offline: "bg-gray-500",
    busy: "bg-yellow-500",
    error: "bg-red-500",
  },
};

// Utility Functions
export const utils = {
  // Generate consistent class names
  cn: (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(" ");
  },

  // Get responsive class
  responsive: (base: string, sm?: string, md?: string, lg?: string): string => {
    const classes = [base];
    if (sm) classes.push(`sm:${sm}`);
    if (md) classes.push(`md:${md}`);
    if (lg) classes.push(`lg:${lg}`);
    return classes.join(" ");
  },

  // Generate gradient background
  gradient: (from: string, to: string): string => {
    return `bg-gradient-to-r from-${from} to-${to}`;
  },

  // Generate hover effects
  hover: (effect: string): string => {
    return `hover:${effect} transition-all duration-200`;
  },

  // Generate focus styles
  focus: (ring: string = "orange-400"): string => {
    return `focus:outline-none focus:ring-2 focus:ring-${ring} focus:ring-offset-2 focus:ring-offset-gray-900`;
  },
};

// Common Component Styles
export const commonStyles = {
  // Container styles
  container: "mx-auto max-w-4xl px-4 sm:px-6",

  // Flex utilities
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexCol: "flex flex-col",

  // Text utilities
  textGradient:
    "bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent",
  textMuted: "text-gray-400",
  textSecondary: "text-gray-300",

  // Interactive elements
  interactive: "transition-all duration-200 hover:scale-105 active:scale-95",
  clickable: "cursor-pointer transition-colors duration-200",

  // Layout
  fullHeight: "h-screen",
  fullWidth: "w-full",

  // Scrolling
  scrollable:
    "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900",
};

// Animation Presets
export const animations = {
  fadeIn: "animate-in fade-in duration-300",
  slideUp: "animate-in slide-in-from-bottom-4 duration-300",
  slideDown: "animate-in slide-in-from-top-4 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-200",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  spin: "animate-spin",
};

export default designTokens;
