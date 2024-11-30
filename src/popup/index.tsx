import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import { theme } from '../theme';
import Popup from './Popup';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <ThemeProvider theme={theme}>
    <Popup />
  </ThemeProvider>
); 