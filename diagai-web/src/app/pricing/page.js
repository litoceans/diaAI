'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Divider,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Zap,
  Crown,
  Rocket,
  Mail,
  Building2,
  Phone,
  User,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const plans = [
  {
    name: 'Free',
    price: { monthly: '$0', annual: '$0' },
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '50 diagrams per month',
      'Basic templates',
      'Community support',
      'Standard export formats',
      'Single user'
    ],
    icon: Zap,
    color: '#2196F3'
  },
  {
    name: 'Pro',
    price: { monthly: '$19', annual: '$190' },
    period: { monthly: 'per month', annual: 'per year' },
    description: 'Best for professionals',
    features: [
      'Unlimited diagrams',
      'Premium templates',
      'Priority support',
      'Advanced export options',
      'Team collaboration',
      'API access',
      'Custom branding'
    ],
    icon: Crown,
    color: '#9C27B0',
    popular: true,
    savings: '20%'
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom', annual: 'Custom' },
    period: 'per organization',
    description: 'For large teams & organizations',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom integrations',
      'Advanced security',
      'Usage analytics',
      'SLA guarantee',
      'Training sessions'
    ],
    icon: Rocket,
    color: '#FF9800'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function Pricing() {
  const theme = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  const handleUpgrade = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/upgrade`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          user_id: user?.id,
          plan: selectedPlan,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          company: formData.company || undefined,
          phone: formData.phone || undefined
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to submit upgrade request');
      }
      
      setUpgradeModal(false);
      setFormData({ firstName: '', lastName: '', email: '', company: '', phone: '', message: '' });
      setSnackbar({
        open: true,
        message: 'Upgrade request submitted successfully! We\'ll contact you soon.',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error submitting upgrade request:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to submit upgrade request. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleContact = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/contact`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          company: formData.company || undefined,
          phone: formData.phone || undefined,
          message: formData.message
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to submit contact request');
      }
      
      setContactModal(false);
      setFormData({ firstName: '', lastName: '', email: '', company: '', phone: '', message: '' });
      setSnackbar({
        open: true,
        message: 'Message sent successfully! We\'ll get back to you soon.',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error submitting contact request:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to send message. Please try again.',
        severity: 'error'
      });
    }
  };

  return (
    <PageLayout>
      <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Typography 
          variant="h3" 
          component={motion.h1}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          align="center"
          sx={{ 
            mb: 2,
            fontSize: {
              xs: '2rem',
              sm: '2.5rem',
              md: '3rem'
            }
          }}
        >
          Choose Your Plan
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          align="center"
          sx={{ 
            mb: 3,
            fontSize: {
              xs: '1rem',
              sm: '1.25rem'
            }
          }}
        >
          Get the perfect plan for your needs
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 4,
            mt: 2
          }}
        >
          <ToggleButtonGroup
            value={billingCycle}
            exclusive
            onChange={(e, newValue) => newValue && setBillingCycle(newValue)}
            sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[1],
              borderRadius: 2,
              '& .MuiToggleButton-root': {
                border: 'none',
                mx: 0.5,
                px: 3,
                py: 1,
                textTransform: 'none',
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }
              }
            }}
          >
            <ToggleButton value="monthly">
              Monthly
            </ToggleButton>
            <ToggleButton value="annual">
              Annual
              {billingCycle === 'annual' && (
                <Chip
                  label="Save 20%"
                  size="small"
                  color="success"
                  sx={{ 
                    ml: 1,
                    height: 20,
                    '& .MuiChip-label': {
                      px: 1,
                      fontSize: '0.75rem'
                    }
                  }}
                />
              )}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={3} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={plan.name}>
              <Card
                component={motion.div}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  borderRadius: 3,
                  boxShadow: plan.popular ? theme.shadows[10] : theme.shadows[1],
                  border: plan.popular ? `2px solid ${theme.palette.primary.main}` : 'none',
                  mt: 0,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    transition: 'transform 0.3s ease',
                    boxShadow: theme.shadows[10]
                  }
                }}
              >
                {plan.popular && (
                  <Chip
                    label="Most Popular"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: -16,
                      left: '50%',
                      marginTop: '10px',
                      transform: 'translateX(-50%)',
                      height: 32,
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      zIndex: 1,
                      px: 2
                    }}
                  />
                )}
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Box sx={{ 
                    mb: 3, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    flexWrap: 'wrap'
                  }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: `${plan.color}20`,
                        color: plan.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <plan.icon size={24} />
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="div"
                      sx={{
                        fontSize: {
                          xs: '1.25rem',
                          sm: '1.5rem'
                        },
                        wordBreak: 'break-word'
                      }}
                    >
                      {plan.name}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="h3" 
                      component="div" 
                      gutterBottom
                      sx={{
                        fontSize: {
                          xs: '2rem',
                          sm: '2.5rem',
                          md: '3rem'
                        },
                        wordBreak: 'break-word'
                      }}
                    >
                      {typeof plan.price === 'object' ? plan.price[billingCycle] : plan.price}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        fontSize: {
                          xs: '0.875rem',
                          sm: '1rem'
                        }
                      }}
                    >
                      {typeof plan.period === 'object' ? plan.period[billingCycle] : plan.period}
                    </Typography>
                  </Box>

                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{
                      fontSize: {
                        xs: '0.875rem',
                        sm: '1rem'
                      },
                      minHeight: { xs: 'auto', sm: '48px' }
                    }}
                  >
                    {plan.description}
                  </Typography>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mb: 4 }}>
                    {plan.features.map((feature) => (
                      <Box
                        key={feature}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                          mb: 1.5,
                          pr: 1
                        }}
                      >
                        <Check 
                          size={20} 
                          color={theme.palette.success.main}
                          style={{ marginTop: 4, flexShrink: 0 }}
                        />
                        <Typography 
                          variant="body2"
                          sx={{
                            fontSize: {
                              xs: '0.875rem',
                              sm: '1rem'
                            },
                            wordBreak: 'break-word',
                            lineHeight: 1.4
                          }}
                        >
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant={plan.popular ? "contained" : "outlined"}
                    fullWidth
                    size="large"
                    onClick={() => {
                      if (plan.name === 'Enterprise') {
                        setContactModal(true);
                      } else if (plan.name === 'Pro') {
                        setSelectedPlan('pro');
                        setUpgradeModal(true);
                      }
                    }}
                    sx={{ 
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: {
                        xs: '0.875rem',
                        sm: '1rem'
                      },
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {plan.name === 'Free' ? 'Current Plan' : 
                     plan.name === 'Enterprise' ? 'Contact Sales' : 
                     'Upgrade Now'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Upgrade Modal */}
      <Dialog 
        open={upgradeModal} 
        onClose={() => setUpgradeModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Upgrade to Pro Plan
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                InputProps={{
                  startAdornment: <User size={20} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                InputProps={{
                  startAdornment: <User size={20} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{
                  startAdornment: <Mail size={20} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company"
                fullWidth
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                InputProps={{
                  startAdornment: <Building2 size={20} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                InputProps={{
                  startAdornment: <Phone size={20} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setUpgradeModal(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpgrade}
            disabled={!formData.firstName || !formData.lastName || !formData.email}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contact Sales Modal */}
      <Dialog 
        open={contactModal} 
        onClose={() => setContactModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Contact Sales Team
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                InputProps={{
                  startAdornment: <User size={20} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                InputProps={{
                  startAdornment: <User size={20} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{
                  startAdornment: <Mail size={20} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company"
                fullWidth
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                InputProps={{
                  startAdornment: <Building2 size={20} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                InputProps={{
                  startAdornment: <Phone size={20} style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Message"
                fullWidth
                multiline
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                InputProps={{
                  startAdornment: <MessageSquare size={20} style={{ marginRight: 8, marginTop: 8, color: theme.palette.text.secondary }} />
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setContactModal(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleContact}
            disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.message}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageLayout>
  );
}
