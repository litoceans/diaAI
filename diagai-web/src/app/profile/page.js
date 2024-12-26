'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Camera, Save, CreditCard, Key, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { profileApi } from '@/services/profileApi';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Profile() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    bio: '',
    photo_url: '',
  });
  const [credits, setCredits] = useState({
    credits: 0,
    plan: 'free',
    daily_usage: 0,
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileData, creditsData] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getCredits(),
      ]);

      setProfile({
        name: profileData.name || '',
        email: profileData.email || '',
        company: profileData.company || '',
        role: profileData.role || '',
        bio: profileData.bio || '',
        photo_url: profileData.photo_url || '',
      });
      setCredits(creditsData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
      if (err.message === 'Authentication failed') {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const updatedProfile = await profileApi.updateProfile({
        name: profile.name,
        company: profile.company,
        role: profile.role,
        bio: profile.bio,
      });

      setProfile(prev => ({
        ...prev,
        ...updatedProfile,
      }));
      setSuccess(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Animation variants
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{ py: 4 }}
        >
          {/* Header */}
          <Typography variant="h4" sx={{ mb: 4 }}>
            Profile Settings
          </Typography>

          <Grid container spacing={4}>
            {/* Profile Information */}
            <Grid item xs={12} md={8}>
              <Paper
                component={motion.form}
                variants={itemVariants}
                onSubmit={handleProfileUpdate}
                sx={{ p: 4 }}
              >
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Profile updated successfully
                  </Alert>
                )}

                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={profile.photo_url}
                      alt={profile.name}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<Camera />}
                      disabled
                    >
                      Change Photo
                    </Button>
                  </Box>

                  <TextField
                    label="Name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    fullWidth
                  />

                  <TextField
                    label="Email"
                    name="email"
                    value={profile.email}
                    disabled
                    fullWidth
                  />

                  <TextField
                    label="Company"
                    name="company"
                    value={profile.company}
                    onChange={handleInputChange}
                    fullWidth
                  />

                  <TextField
                    label="Role"
                    name="role"
                    value={profile.role}
                    onChange={handleInputChange}
                    fullWidth
                  />

                  <TextField
                    label="Bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    fullWidth
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={saving}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Subscription Info */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card component={motion.div} variants={itemVariants}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CreditCard />
                        <Typography variant="h6">Subscription</Typography>
                      </Box>
                      <Divider />
                      <Typography variant="body2" color="text.secondary">
                        Current Plan
                      </Typography>
                      <Typography variant="h5" color="primary">
                        {credits.plan.toUpperCase()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Credits Remaining
                      </Typography>
                      <Typography variant="h5">
                        {credits.credits}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Daily Usage
                      </Typography>
                      <Typography variant="h5">
                        {credits.daily_usage}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => router.push('/pricing')}
                      >
                        Upgrade Plan
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                <Card component={motion.div} variants={itemVariants}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Key />
                        <Typography variant="h6">Account Security</Typography>
                      </Box>
                      <Divider />
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography>
                        {new Date().toLocaleDateString()}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={logout}
                      >
                        Sign Out
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
