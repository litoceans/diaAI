'use client';

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { motion, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <AppBar
      component={motion.nav}
      position="fixed"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        background: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        boxShadow: isScrolled ? 1 : 'none',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" passHref>
              <Box
                component="span"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  color: 'primary.main',
                }}
              >
                DiaAI
              </Box>
            </Link>
          </motion.div>

          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ display: 'flex', gap: 2 }}
          >
            <Button
              component={Link}
              href="#features"
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              Features
            </Button>
            <Button
              component={Link}
              href="#how-it-works"
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              How it Works
            </Button>
            <Button
              component={Link}
              href="/pricing"
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              Pricing
            </Button>
            <Button
              component={Link}
              href="/faq"
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              FAQ
            </Button>
            {user ? (
              <Button
                component={Link}
                href="/dashboard"
                variant="contained"
                sx={{ textTransform: 'none' }}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                component={Link}
                href="/auth/login"
                variant="contained"
                sx={{ textTransform: 'none' }}
              >
                Get Started
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
