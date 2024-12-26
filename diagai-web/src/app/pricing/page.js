'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    features: [
      '10 credits per day',
      'Basic diagram generation',
      'Standard support',
      'Community access',
    ],
    buttonText: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: { monthly: 19, annual: 190 },
    features: [
      '100 credits per day',
      'Advanced diagram generation',
      'Priority support',
      'No watermark',
      'Custom styling options',
      'API access',
    ],
    buttonText: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 49, annual: 490 },
    features: [
      'Unlimited credits',
      'Custom AI model training',
      'Dedicated support',
      'Team collaboration',
      'Advanced analytics',
      'Custom integrations',
    ],
    buttonText: 'Contact Sales',
    highlighted: false,
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ py: 8 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            component={motion.h1}
            variants={itemVariants}
            variant="h3"
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Simple, Transparent Pricing
          </Typography>
          <Typography
            component={motion.p}
            variants={itemVariants}
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Choose the plan that best fits your needs
          </Typography>
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Typography
              color={!isAnnual ? 'primary' : 'text.secondary'}
              variant="subtitle1"
            >
              Monthly
            </Typography>
            <Switch
              checked={isAnnual}
              onChange={() => setIsAnnual(!isAnnual)}
              color="primary"
            />
            <Typography
              color={isAnnual ? 'primary' : 'text.secondary'}
              variant="subtitle1"
            >
              Annual
              <Box
                component="span"
                sx={{
                  ml: 1,
                  px: 1,
                  py: 0.5,
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                }}
              >
                Save 20%
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} alignItems="stretch">
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.name}>
              <Paper
                component={motion.div}
                variants={itemVariants}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  ...(plan.highlighted && {
                    border: '2px solid',
                    borderColor: 'primary.main',
                  }),
                }}
              >
                {plan.highlighted && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: -30,
                      transform: 'rotate(45deg)',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      px: 4,
                      py: 0.5,
                      fontSize: '0.75rem',
                    }}
                  >
                    POPULAR
                  </Box>
                )}

                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {plan.name}
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3" component="span" sx={{ fontWeight: 'bold' }}>
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </Typography>
                  <Typography variant="subtitle1" component="span" color="text.secondary">
                    /{isAnnual ? 'year' : 'month'}
                  </Typography>
                </Box>

                <List sx={{ mb: 4, flex: 1 }}>
                  {plan.features.map((feature) => (
                    <ListItem key={feature} disableGutters>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Check size={20} color="#4CAF50" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant={plan.highlighted ? 'contained' : 'outlined'}
                  size="large"
                  fullWidth
                  href={user ? '/dashboard' : '/auth/login'}
                >
                  {plan.buttonText}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* FAQ Section */}
        <Box
          component={motion.div}
          variants={itemVariants}
          sx={{ mt: 8, textAlign: 'center' }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Have questions? Check out our FAQ or contact our support team.
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            href="/support"
          >
            View FAQ
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
