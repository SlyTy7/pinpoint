import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // light blue
    },
    secondary: {
      main: '#f48fb1', // pinkish
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

export default darkTheme;
