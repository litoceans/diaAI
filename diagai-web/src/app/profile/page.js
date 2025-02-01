'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  Camera,
  Mail,
  Building2,
  Phone,
  MapPin,
  Globe,
  Twitter,
  Linkedin,
  Github,
} from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { profileApi } from '@/services/profileApi';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function Profile() {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState({
    credits: 0,
    plan: 'free',
    daily_usage: 0,
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
    location: user?.location || '',
    website: user?.website || '',
    twitter: user?.twitter || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    bio: user?.bio || '',
    role: user?.role || '',
    photo_url: user?.photo_url || '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchProfileData = async () => {
    try {
      const [profileData, creditsData] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getCredits(),
      ]);

      setFormData((prev) => ({
        ...prev,
        name: profileData.name || '',
        email: profileData.email || '',
        company: profileData.company || '',
        role: profileData.role || '',
        bio: profileData.bio || '',
        photo_url: profileData.photo_url || '',
      }));

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

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await fetchProfileData(); // Refresh the data after update

      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update profile. Please try again.',
        severity: 'error',
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageLayout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h4"
          component={motion.h1}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            mb: 4,
            fontSize: {
              xs: '1.5rem',
              sm: '2rem',
              md: '2.5rem',
            },
          }}
        >
          Profile Settings
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{ height: '100%', borderRadius: 2 }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <Avatar
                    src={user?.avatar}
                    alt={user?.name}
                    sx={{
                      width: { xs: 100, sm: 120 },
                      height: { xs: 100, sm: 120 },
                      fontSize: '2.5rem',
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': { backgroundColor: 'background.default' },
                    }}
                  >
                    <Camera size={20} />
                  </IconButton>
                </Box>

                <Typography variant="h5" gutterBottom>
                  {user?.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {user?.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Form */}
          <Grid item xs={12} md={8}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{ borderRadius: 2 }}
            >
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Personal Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <Mail
                            size={20}
                            style={{
                              marginRight: 8,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <Building2
                            size={20}
                            style={{
                              marginRight: 8,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <Phone
                            size={20}
                            style={{
                              marginRight: 8,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <MapPin
                            size={20}
                            style={{
                              marginRight: 8,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <Globe
                            size={20}
                            style={{
                              marginRight: 8,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Social Profiles
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Twitter"
                      value={formData.twitter}
                      onChange={(e) =>
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <Twitter
                            size={20}
                            style={{
                              marginRight: 8,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="LinkedIn"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <Linkedin
                            size={20}
                            style={{
                              marginRight: 8,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GitHub"
                      value={formData.github}
                      onChange={(e) =>
                        setFormData({ ...formData, github: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <Github
                            size={20}
                            style={{
                              marginRight: 8,
                              color: theme.palette.text.secondary,
                            }}
                          />
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Bio
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleUpdateProfile}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1,
                          fontSize: '1rem',
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

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
