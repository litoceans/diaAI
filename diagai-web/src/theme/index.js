'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      lighter: '#E3F2FD',
      light: '#64B5F6',
      main: '#1976D2',
      dark: '#1565C0',
      darker: '#0D47A1',
      contrastText: '#fff',
    },
    secondary: {
      lighter: '#EDE7F6',
      light: '#B39DDB',
      main: '#673AB7',
      dark: '#5E35B1',
      darker: '#4527A0',
      contrastText: '#fff',
    },
    error: {
      lighter: '#FBE9E7',
      light: '#FFAB91',
      main: '#F44336',
      dark: '#E53935',
      darker: '#C62828',
      contrastText: '#fff',
    },
    warning: {
      lighter: '#FFF3E0',
      light: '#FFB74D',
      main: '#FF9800',
      dark: '#F57C00',
      darker: '#E65100',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      lighter: '#E1F5FE',
      light: '#4FC3F7',
      main: '#03A9F4',
      dark: '#0288D1',
      darker: '#01579B',
      contrastText: '#fff',
    },
    success: {
      lighter: '#E8F5E9',
      light: '#81C784',
      main: '#4CAF50',
      dark: '#388E3C',
      darker: '#1B5E20',
      contrastText: '#fff',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9E9E9E',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.05)',
    '0px 8px 16px rgba(0, 0, 0, 0.05)',
    '0px 12px 24px rgba(0, 0, 0, 0.05)',
    '0px 16px 32px rgba(0, 0, 0, 0.05)',
    '0px 20px 40px rgba(0, 0, 0, 0.05)',
    '0px 24px 48px rgba(0, 0, 0, 0.05)',
    '0px 28px 56px rgba(0, 0, 0, 0.05)',
    '0px 32px 64px rgba(0, 0, 0, 0.05)',
    '0px 36px 72px rgba(0, 0, 0, 0.05)',
    '0px 40px 80px rgba(0, 0, 0, 0.05)',
    '0px 44px 88px rgba(0, 0, 0, 0.05)',
    '0px 48px 96px rgba(0, 0, 0, 0.05)',
    '0px 52px 104px rgba(0, 0, 0, 0.05)',
    '0px 56px 112px rgba(0, 0, 0, 0.05)',
    '0px 60px 120px rgba(0, 0, 0, 0.05)',
    '0px 64px 128px rgba(0, 0, 0, 0.05)',
    '0px 68px 136px rgba(0, 0, 0, 0.05)',
    '0px 72px 144px rgba(0, 0, 0, 0.05)',
    '0px 76px 152px rgba(0, 0, 0, 0.05)',
    '0px 80px 160px rgba(0, 0, 0, 0.05)',
    '0px 84px 168px rgba(0, 0, 0, 0.05)',
    '0px 88px 176px rgba(0, 0, 0, 0.05)',
    '0px 92px 184px rgba(0, 0, 0, 0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});
