'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { Box } from '@mui/material';

export default function PricingLayout({ children }) {
  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 2 }}>
          {children}
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
