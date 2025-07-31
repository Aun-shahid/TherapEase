import React, { createContext, useContext, useState, ReactNode } from 'react';
import { themeStyles } from '../constants/theme';

export type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  themeStyle: typeof themeStyles.light;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeStyle = themeStyles[theme];

  return (
    <ThemeContext.Provider value={{ theme, themeStyle, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
