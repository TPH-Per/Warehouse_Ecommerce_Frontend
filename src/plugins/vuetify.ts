/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// Neon Theme Colors
const neonLight = {
  dark: false,
  colors: {
    background: '#f8fafc',
    surface: '#ffffff',
    'surface-bright': '#ffffff',
    'surface-light': '#f1f5f9',
    'surface-variant': '#e2e8f0',
    'on-surface-variant': '#334155',
    primary: '#00d4ff',           // Cyan neon
    'primary-darken-1': '#00b8db',
    secondary: '#ff00ff',          // Magenta neon  
    'secondary-darken-1': '#cc00cc',
    accent: '#a855f7',             // Purple neon
    error: '#ff4757',
    info: '#00d4ff',
    success: '#00ff88',            // Green neon
    warning: '#ffdd00',            // Yellow neon
    'on-primary': '#000000',
    'on-secondary': '#ffffff',
  },
  variables: {
    'border-color': '#e2e8f0',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#000000',
  },
}

const neonDark = {
  dark: true,
  colors: {
    background: '#0a0a0f',
    surface: '#12121a',
    'surface-bright': '#1a1a25',
    'surface-light': '#1e1e2d',
    'surface-variant': '#2a2a3d',
    'on-surface-variant': '#94a3b8',
    primary: '#00d4ff',           // Cyan neon
    'primary-darken-1': '#00b8db',
    secondary: '#ff00ff',          // Magenta neon
    'secondary-darken-1': '#cc00cc',
    accent: '#a855f7',             // Purple neon
    error: '#ff4757',
    info: '#00d4ff',
    success: '#00ff88',            // Green neon
    warning: '#ffdd00',            // Yellow neon
    'on-primary': '#000000',
    'on-secondary': '#ffffff',
  },
  variables: {
    'border-color': '#2a2a3d',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.10,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#343434',
    'theme-on-code': '#CCCCCC',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'neonDark',
    themes: {
      neonLight,
      neonDark,
    },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none;',
    },
    VCard: {
      rounded: 'lg',
    },
  },
})
