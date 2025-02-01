'use client';

import { Box } from '@mui/material';
import Sidebar from '@/components/Sidebar';

export default function ProfileLayout({ children }) {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          height: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
