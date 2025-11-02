import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';

import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ThemeProvider } from './providers/Theme/ThemeContext';
import { router } from './routes';
import { store } from './store';
import { theme } from './theme';

export default function App() {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <Notifications />
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </MantineProvider>
    </Provider>
  );
}
