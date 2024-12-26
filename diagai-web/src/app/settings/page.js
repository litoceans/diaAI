'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Stack,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Bell,
  Mail,
  Shield,
  Moon,
  Globe,
  Save,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    projectUpdates: true,
    marketingEmails: false,
    
    // Privacy Settings
    publicProfile: true,
    showActivity: true,
    
    // Theme Settings
    darkMode: false,
    highContrast: false,
    
    // Language Settings
    language: 'en',
    timezone: 'UTC',
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Implement settings save logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    
    try {
      // Simulate API call to delete account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add your actual account deletion logic here
      // 1. Delete user data
      // 2. Remove authentication
      // 3. Clear local storage/cookies
      // 4. Redirect to home page
      
      window.location.href = '/';
    } catch (error) {
      setDeleteError('Failed to delete account. Please try again later.');
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteError('');
  };

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
        sx={{ py: 4 }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          Settings
        </Typography>

        <Grid container spacing={4}>
          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              variants={itemVariants}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Bell size={24} />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Notification Settings
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive important updates via email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          handleSettingChange('emailNotifications', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Project Updates"
                      secondary="Get notified about your project activities"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.projectUpdates}
                        onChange={(e) =>
                          handleSettingChange('projectUpdates', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Marketing Emails"
                      secondary="Receive news and special offers"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.marketingEmails}
                        onChange={(e) =>
                          handleSettingChange('marketingEmails', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Privacy Settings */}
          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              variants={itemVariants}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Shield size={24} />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Privacy Settings
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Public Profile"
                      secondary="Make your profile visible to others"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.publicProfile}
                        onChange={(e) =>
                          handleSettingChange('publicProfile', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Activity Visibility"
                      secondary="Show your activity in public feeds"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.showActivity}
                        onChange={(e) =>
                          handleSettingChange('showActivity', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Theme Settings */}
          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              variants={itemVariants}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Moon size={24} />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Theme Settings
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Dark Mode"
                      secondary="Switch between light and dark themes"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.darkMode}
                        onChange={(e) =>
                          handleSettingChange('darkMode', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="High Contrast"
                      secondary="Increase contrast for better visibility"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.highContrast}
                        onChange={(e) =>
                          handleSettingChange('highContrast', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Language Settings */}
          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              variants={itemVariants}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Globe size={24} />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Language & Region
                  </Typography>
                </Box>
                <Stack spacing={3}>
                  <TextField
                    select
                    label="Language"
                    value={settings.language}
                    onChange={(e) =>
                      handleSettingChange('language', e.target.value)
                    }
                    fullWidth
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </TextField>
                  <TextField
                    select
                    label="Timezone"
                    value={settings.timezone}
                    onChange={(e) =>
                      handleSettingChange('timezone', e.target.value)
                    }
                    fullWidth
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                    <option value="IST">IST</option>
                  </TextField>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Danger Zone */}
        <Card
          component={motion.div}
          variants={itemVariants}
          sx={{
            mt: 4,
            background: 'linear-gradient(to right, #ffebee, #ffcdd2)',
            border: '1px solid',
            borderColor: 'error.main',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              bgcolor: 'error.main',
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  bgcolor: 'error.main',
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle size={24} color="white" />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  ml: 2,
                  color: 'error.main',
                  fontWeight: 600,
                }}
              >
                Danger Zone
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 1,
              }}
            >
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'error.main',
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  Delete Account
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    maxWidth: '600px',
                  }}
                >
                  Once you delete your account, there is no going back. Please be certain.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Trash2 size={20} />}
                onClick={handleDeleteAccount}
                sx={{
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                    bgcolor: 'error.light',
                  },
                }}
              >
                Delete Account
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Delete Account Confirmation Dialog */}
        <Dialog 
          open={deleteDialogOpen} 
          onClose={handleCancelDelete}
          PaperProps={{
            sx: {
              borderRadius: 2,
              width: '100%',
              maxWidth: '450px',
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  bgcolor: 'error.main',
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle size={24} color="white" />
              </Box>
              <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                Delete Account
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete your account? This action cannot be undone and will:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Permanently delete all your projects and diagrams
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Remove all your personal data and settings
              </Typography>
              <Typography component="li" variant="body1">
                Cancel any active subscriptions
              </Typography>
            </Box>
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
              Please type "DELETE" to confirm:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type DELETE"
              sx={{ mt: 1 }}
              onChange={(e) => setDeleteConfirm(e.target.value)}
            />
            {deleteError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {deleteError}
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleCancelDelete}
              sx={{
                borderRadius: 2,
                px: 3,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              disabled={deleteConfirm !== 'DELETE' || deleteLoading}
              sx={{
                borderRadius: 2,
                px: 3,
                position: 'relative',
              }}
            >
              {deleteLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Delete Account'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            startIcon={loading ? null : <Save size={20} />}
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
