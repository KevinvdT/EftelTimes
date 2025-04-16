import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import App from './App';
import './index.css';

const theme = {
  // Base colors (matching Tailwind)
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  // Spacing (matching Tailwind)
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  // Additional theme values for styled-components
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  // Component-specific themes
  components: {
    card: {
      padding: '1rem',
      background: '#ffffff',
      borderRadius: '0.5rem',
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
    },
  },
};

const ThemedApp = () => {
  const { theme } = useTheme();
  return (
    <StyledThemeProvider theme={theme}>
      <App />
    </StyledThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </React.StrictMode>
);
