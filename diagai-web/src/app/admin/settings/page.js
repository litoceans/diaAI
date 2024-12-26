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
  Divider,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Save,
  Shield,
  Bell,
  Mail,
  Database,
  Server,
  HardDrive,
} from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    // Security Settings
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    
    // Notification Settings
    emailNotifications: true,
    systemAlerts: true,
    userSignups: true,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: 100,
    
    // Storage Settings
    maxUploadSize: 10,
    storageProvider: 'AWS',
    backupFrequency: 'daily',
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
          Admin Settings
        </Typography>

        <Grid container spacing={4}>
          {/* Security Settings */}
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
                    Security Settings
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Require 2FA for all admin accounts"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={(e) =>
                          handleSettingChange('twoFactorAuth', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Password Expiry (days)"
                      secondary="Force password reset after specified days"
                    />
                    <ListItemSecondaryAction>
                      <TextField
                        type="number"
                        size="small"
                        value={settings.passwordExpiry}
                        onChange={(e) =>
                          handleSettingChange('passwordExpiry', e.target.value)
                        }
                        sx={{ width: 100 }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Session Timeout (minutes)"
                      secondary="Automatically logout after inactivity"
                    />
                    <ListItemSecondaryAction>
                      <TextField
                        type="number"
                        size="small"
                        value={settings.sessionTimeout}
                        onChange={(e) =>
                          handleSettingChange('sessionTimeout', e.target.value)
                        }
                        sx={{ width: 100 }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

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
                      primary="System Alerts"
                      secondary="Get notified about system events"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.systemAlerts}
                        onChange={(e) =>
                          handleSettingChange('systemAlerts', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="User Signups"
                      secondary="Notifications for new user registrations"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.userSignups}
                        onChange={(e) =>
                          handleSettingChange('userSignups', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* System Settings */}
          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              variants={itemVariants}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Server size={24} />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    System Settings
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Maintenance Mode"
                      secondary="Take the system offline for maintenance"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.maintenanceMode}
                        onChange={(e) =>
                          handleSettingChange('maintenanceMode', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Debug Mode"
                      secondary="Enable detailed error logging"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.debugMode}
                        onChange={(e) =>
                          handleSettingChange('debugMode', e.target.checked)
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="API Rate Limit"
                      secondary="Requests per minute per user"
                    />
                    <ListItemSecondaryAction>
                      <TextField
                        type="number"
                        size="small"
                        value={settings.apiRateLimit}
                        onChange={(e) =>
                          handleSettingChange('apiRateLimit', e.target.value)
                        }
                        sx={{ width: 100 }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Storage Settings */}
          <Grid item xs={12} md={6}>
            <Card
              component={motion.div}
              variants={itemVariants}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <HardDrive size={24} />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Storage Settings
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Max Upload Size (MB)"
                      secondary="Maximum file size for uploads"
                    />
                    <ListItemSecondaryAction>
                      <TextField
                        type="number"
                        size="small"
                        value={settings.maxUploadSize}
                        onChange={(e) =>
                          handleSettingChange('maxUploadSize', e.target.value)
                        }
                        sx={{ width: 100 }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Storage Provider"
                      secondary="Cloud storage service provider"
                    />
                    <ListItemSecondaryAction>
                      <TextField
                        select
                        size="small"
                        value={settings.storageProvider}
                        onChange={(e) =>
                          handleSettingChange('storageProvider', e.target.value)
                        }
                        sx={{ width: 100 }}
                      >
                        <option value="AWS">AWS</option>
                        <option value="GCP">GCP</option>
                        <option value="Azure">Azure</option>
                      </TextField>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Backup Frequency"
                      secondary="How often to backup data"
                    />
                    <ListItemSecondaryAction>
                      <TextField
                        select
                        size="small"
                        value={settings.backupFrequency}
                        onChange={(e) =>
                          handleSettingChange('backupFrequency', e.target.value)
                        }
                        sx={{ width: 100 }}
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </TextField>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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
