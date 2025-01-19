'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 5,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 700,
            mb: 2,
            background: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            color: 'text.secondary',
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: 'text.secondary',
            maxWidth: 'sm',
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/')}
          sx={{
            borderRadius: 2,
            py: 1.5,
            px: 4,
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
