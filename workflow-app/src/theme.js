import { createTheme } from '@mui/material';

// Aqui é possível criar um tema padrão para o MUI
const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    mode: 'light',
  },
});

export default theme;
