import '@mantine/core/styles.css';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ThemeProvider } from './providers/Theme/ThemeContext';
import AppRoutes from './routes';
import { store } from './store';
import { theme } from './theme';

export default function App() {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <ThemeProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </MantineProvider>
    </Provider>
  );
}
