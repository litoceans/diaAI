'use client';

import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Twitter, Github, Linkedin } from 'lucide-react';

const footerSections = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '/#features' },
      { name: 'How it Works', href: '/#how-it-works' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Examples', href: '/examples' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
      { name: 'Blog', href: '/blog' },
      { name: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  },
];

const socialLinks = [
  { icon: <Twitter size={20} />, href: 'https://twitter.com' },
  { icon: <Github size={20} />, href: 'https://github.com' },
  { icon: <Linkedin size={20} />, href: 'https://linkedin.com' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h6"
                sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
              >
                DiaAI
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Transform your ideas into beautiful diagrams with the power of AI.
                Create, customize, and share professional diagrams in minutes.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component={MuiLink}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={2} key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="subtitle1"
                  color="text.primary"
                  sx={{ fontWeight: 'bold', mb: 2 }}
                >
                  {section.title}
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    p: 0,
                    m: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  {section.links.map((link) => (
                    <Box component="li" key={link.name}>
                      <MuiLink
                        component={Link}
                        href={link.href}
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {link.name}
                      </MuiLink>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} DiaAI. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
            }}
          >
            <MuiLink
              component={Link}
              href="/privacy"
              variant="body2"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              component={Link}
              href="/terms"
              variant="body2"
              color="text.secondary"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              Terms of Service
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
