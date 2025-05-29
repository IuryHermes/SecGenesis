import { createTheme } from '@mui/material/styles';

// Tema personalizado com as cores preto e verde do SecGenesis
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00A651', // Verde
      light: '#4CD07D',
      dark: '#007E3E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#000000', // Preto
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    error: {
      main: '#FF3B30',
    },
    warning: {
      main: '#FF9500',
    },
    info: {
      main: '#0A84FF',
    },
    success: {
      main: '#00A651',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#00A651',
          '&:hover': {
            backgroundColor: '#007E3E',
          },
        },
        outlinedPrimary: {
          borderColor: '#00A651',
          color: '#00A651',
          '&:hover': {
            borderColor: '#007E3E',
            backgroundColor: 'rgba(0, 166, 81, 0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          borderRight: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#333333',
            },
            '&:hover fieldset': {
              borderColor: '#00A651',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00A651',
            },
          },
        },
      },
    },
  },
});

export default theme;
