import React, { createContext, useContext, useState } from 'react';

const baseThemes = {
  light: {
    colors: {
      // Brand colors
      brand: {
        primary: '#6C4839', // Brown from logo
        accent: '#B08A76',  // Lighter brown for accents
      },
      // Status colors
      status: {
        open: '#22A847',    // Green for open/available
        closed: '#C7342D',  // Red for closed/storing
        neutral: '#6C4839', // Brown for neutral states
      },
      // UI colors
      background: {
        DEFAULT: '#FEF7EE',
        card: '#E6DED5',    // Slightly darker than background for cards
        hover: '#F7EEE5',   // Slightly darker than default for hover states
        statusBar: '#22A847' // Green status bar background
      },
      text: {
        DEFAULT: '#6C4839',
        muted: '#8B6B5E',
        inverted: '#FFFFFF',
        accent: '#B08A76'
      },
      border: {
        DEFAULT: '#E6DED5',
        hover: '#D4C8BE',
      },
    },
    // Typography
    typography: {
      fonts: {
        display: '"Pirata One", cursive', // For gothic headings
        body: 'Nunito, sans-serif'
      },
      weights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
    },
    // Component-specific
    components: {
      statusBar: {
        height: '3rem',
        background: '#22A847',
        color: '#FFFFFF'
      },
      card: {
        background: '#E6DED5',
        borderRadius: '0.5rem',
        padding: '1rem'
      },
      waitTime: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#22A847'
      }
    },
    // Other theme values
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
  },
  dark: {
    // We'll define this after perfecting the light theme
  },
};

// Winter variants will inherit from base themes and override specific values
const winterThemes = {
  light: {
    ...baseThemes.light,
    colors: {
      ...baseThemes.light.colors,
      // Winter-specific overrides will go here
    },
  },
  dark: {
    // We'll define this after the dark theme
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isWinter, setIsWinter] = useState(false);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getCurrentTheme = () => {
    const baseTheme = baseThemes[currentTheme];
    return isWinter ? winterThemes[currentTheme] : baseTheme;
  };

  const value = {
    theme: getCurrentTheme(),
    currentTheme,
    isWinter,
    toggleTheme,
    setIsWinter
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 