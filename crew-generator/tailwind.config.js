/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Stack component spacing classes
    'space-y-2',
    'space-y-4', 
    'space-y-6',
    'space-y-8',
    'space-y-12',
    'space-y-16',
    'space-x-2',
    'space-x-4',
    'space-x-6', 
    'space-x-8',
    'space-x-12',
    'space-x-16',
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      // Design Token Integration
      colors: {
        // Brand colors mapped to CSS custom properties
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "var(--brand-primary-50)",
          100: "var(--brand-primary-100)",
          200: "var(--brand-primary-200)",
          300: "var(--brand-primary-300)",
          400: "var(--brand-primary-400)",
          500: "var(--brand-primary-500)",
          600: "var(--brand-primary-600)",
          700: "var(--brand-primary-700)",
          800: "var(--brand-primary-800)",
          900: "var(--brand-primary-900)",
          950: "var(--brand-primary-950)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "var(--brand-secondary-50)",
          100: "var(--brand-secondary-100)",
          200: "var(--brand-secondary-200)",
          300: "var(--brand-secondary-300)",
          400: "var(--brand-secondary-400)",
          500: "var(--brand-secondary-500)",
          600: "var(--brand-secondary-600)",
          700: "var(--brand-secondary-700)",
          800: "var(--brand-secondary-800)",
          900: "var(--brand-secondary-900)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Semantic colors from design tokens
        success: {
          50: "var(--color-success-50)",
          100: "var(--color-success-100)",
          200: "var(--color-success-200)",
          300: "var(--color-success-300)",
          400: "var(--color-success-400)",
          500: "var(--color-success-500)",
          600: "var(--color-success-600)",
          700: "var(--color-success-700)",
          800: "var(--color-success-800)",
          900: "var(--color-success-900)",
        },
        warning: {
          50: "var(--color-warning-50)",
          100: "var(--color-warning-100)",
          200: "var(--color-warning-200)",
          300: "var(--color-warning-300)",
          400: "var(--color-warning-400)",
          500: "var(--color-warning-500)",
          600: "var(--color-warning-600)",
          700: "var(--color-warning-700)",
          800: "var(--color-warning-800)",
          900: "var(--color-warning-900)",
        },
        error: {
          50: "var(--color-error-50)",
          100: "var(--color-error-100)",
          200: "var(--color-error-200)",
          300: "var(--color-error-300)",
          400: "var(--color-error-400)",
          500: "var(--color-error-500)",
          600: "var(--color-error-600)",
          700: "var(--color-error-700)",
          800: "var(--color-error-800)",
          900: "var(--color-error-900)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "var(--radius-sm)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        heading: "var(--font-heading)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)", 
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)",
        "6xl": "var(--text-6xl)",
      },
      spacing: {
        0: "var(--space-0)",
        px: "var(--space-px)",
        0.5: "var(--space-0-5)",
        1: "var(--space-1)",
        1.5: "var(--space-1-5)",
        2: "var(--space-2)",
        2.5: "var(--space-2-5)",
        3: "var(--space-3)",
        3.5: "var(--space-3-5)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        9: "var(--space-9)",
        10: "var(--space-10)",
        11: "var(--space-11)",
        12: "var(--space-12)",
        14: "var(--space-14)",
        16: "var(--space-16)",
        20: "var(--space-20)",
        24: "var(--space-24)",
        28: "var(--space-28)",
        32: "var(--space-32)",
        
        // Content spacing utilities
        "content-sm": "var(--content-padding-sm)",
        "content-md": "var(--content-padding-md)", 
        "content-lg": "var(--content-padding-lg)",
        
        // Card spacing utilities
        "card-sm": "var(--card-padding-sm)",
        "card-md": "var(--card-padding-md)",
        "card-lg": "var(--card-padding-lg)",
        
        // Form spacing utilities
        "form": "var(--form-padding)",
        "form-field": "var(--form-field-spacing)",
        
        // Section spacing utilities
        "section-sm": "var(--section-spacing-sm)",
        "section-md": "var(--section-spacing-md)",
        "section-lg": "var(--section-spacing-lg)",
        
        // Safe scroll utilities
        "scroll-safe": "var(--page-bottom-spacing)",
        "nav-height": "var(--bottom-nav-height)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)", 
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        inner: "var(--shadow-inner)",
      },
      // Mobile-specific extensions
      minHeight: {
        touch: "44px", // Minimum touch target
        "touch-lg": "56px", // Large touch target
      },
      minWidth: {
        touch: "44px",
        "touch-lg": "56px", 
      },
      transitionDuration: {
        75: "var(--duration-75)",
        100: "var(--duration-100)",
        150: "var(--duration-150)",
        200: "var(--duration-200)",
        300: "var(--duration-300)",
        500: "var(--duration-500)",
        700: "var(--duration-700)",
        1000: "var(--duration-1000)",
      },
      transitionTimingFunction: {
        DEFAULT: "var(--ease-in-out)",
        linear: "var(--ease-linear)",
        in: "var(--ease-in)",
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },
    },
  },
  plugins: [
    // Add mobile-first responsive utilities
    function({ addUtilities }) {
      addUtilities({
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px',
          'touch-action': 'manipulation',
        },
        '.touch-target-lg': {
          'min-height': '56px', 
          'min-width': '56px',
          'touch-action': 'manipulation',
        },
        '.safe-area-inset': {
          'padding-top': 'env(safe-area-inset-top)',
          'padding-bottom': 'env(safe-area-inset-bottom)',
          'padding-left': 'env(safe-area-inset-left)', 
          'padding-right': 'env(safe-area-inset-right)',
        },
        // Stack component spacing utilities for Tailwind v4
        '.space-y-2 > * + *': {
          'margin-top': 'var(--space-2)',
        },
        '.space-y-4 > * + *': {
          'margin-top': 'var(--space-4)',
        },
        '.space-y-6 > * + *': {
          'margin-top': 'var(--space-6)',
        },
        '.space-y-8 > * + *': {
          'margin-top': 'var(--space-8)',
        },
        '.space-y-12 > * + *': {
          'margin-top': 'var(--space-12)',
        },
        '.space-y-16 > * + *': {
          'margin-top': 'var(--space-16)',
        },
        '.space-x-2 > * + *': {
          'margin-left': 'var(--space-2)',
        },
        '.space-x-4 > * + *': {
          'margin-left': 'var(--space-4)',
        },
        '.space-x-6 > * + *': {
          'margin-left': 'var(--space-6)',
        },
        '.space-x-8 > * + *': {
          'margin-left': 'var(--space-8)',
        },
        '.space-x-12 > * + *': {
          'margin-left': 'var(--space-12)',
        },
        '.space-x-16 > * + *': {
          'margin-left': 'var(--space-16)',
        },
      })
    }
  ],
}

