'use client';

import { Box } from '@mui/material';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        overflow: 'hidden' // Prevent outer scrollbar
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto', // Allow scrolling in main content
          height: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
