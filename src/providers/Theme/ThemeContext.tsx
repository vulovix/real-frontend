import React, { createContext, ReactNode, useContext } from 'react';
import { MantineColorScheme, useMantineColorScheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: MantineColorScheme;
  setColorScheme: (colorScheme: MantineColorScheme) => void;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { colorScheme, setColorScheme, toggleColorScheme } = useMantineColorScheme();
  const [theme, setThemeValue] = useLocalStorage<Theme>({
    key: 'theme',
    defaultValue: 'auto',
  });

  const setTheme = (newTheme: Theme) => {
    setThemeValue(newTheme);
    if (newTheme === 'auto') {
      setColorScheme('auto');
    } else {
      setColorScheme(newTheme);
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    toggleColorScheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
