'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  Bell,
  Mail,
  Shield,
  Trash2,
  AlertTriangle,
  Download,
} from 'lucide-react';
import PageLayout from '@/components/PageLayout';

export default function Settings() {
  const theme = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [settings, setSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
    twoFactorAuth: false,
    dataSharing: true,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleSettingChange = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));

    setSnackbar({
      open: true,
      message: 'Settings updated successfully!',
      severity: 'success',
    });
  };

  const handleDeleteAccount = () => {
    setDeleteDialog(false);
    setSnackbar({
      open: true,
      message: 'Account deletion request submitted.',
      severity: 'info',
    });
  };

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
          Account Settings
        </Typography>

        <Grid container spacing={3}>
          {/* Notifications Settings */}
          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{ height: '100%', borderRadius: 2 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Bell
                    size={24}
                    style={{ marginRight: 8, color: theme.palette.primary.main }}
                  />
                  <Typography variant="h6">Notifications</Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive email updates about your account"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.emailNotifications}
                        onChange={() => handleSettingChange('emailNotifications')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Project Updates"
                      secondary="Get notified about your project activities"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.projectUpdates}
                        onChange={() => handleSettingChange('projectUpdates')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Marketing Emails"
                      secondary="Receive promotional content and updates"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.marketingEmails}
                        onChange={() => handleSettingChange('marketingEmails')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Security Settings */}
          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{ height: '100%', borderRadius: 2 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Shield
                    size={24}
                    style={{ marginRight: 8, color: theme.palette.primary.main }}
                  />
                  <Typography variant="h6">Security</Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Add an extra layer of security"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.twoFactorAuth}
                        onChange={() => handleSettingChange('twoFactorAuth')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Security Alerts"
                      secondary="Get notified about suspicious activities"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.securityAlerts}
                        onChange={() => handleSettingChange('securityAlerts')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Data Sharing"
                      secondary="Allow data sharing for better experience"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.dataSharing}
                        onChange={() => handleSettingChange('dataSharing')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Data Management */}
          <Grid item xs={12}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{ borderRadius: 2 }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Download
                    size={24}
                    style={{ marginRight: 8, color: theme.palette.primary.main }}
                  />
                  <Typography variant="h6">Data Management</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={() =>
                        setSnackbar({
                          open: true,
                          message: 'Data export started. You will be notified when ready.',
                          severity: 'info',
                        })
                      }
                    >
                      Export Data
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<Trash2 />}
                      onClick={() => setDeleteDialog(true)}
                    >
                      Delete Account
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertTriangle color={theme.palette.error.main} />
            Delete Account
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
