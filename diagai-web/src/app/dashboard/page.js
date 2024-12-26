'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    creditsUsed: 0,
    totalCredits: 0,
    totalDiagrams: 0,
    user: { plan: 'free' }
  });
  const [diagrams, setDiagrams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, diagramsData] = await Promise.all([
          userApi.getDashboardStats(),
          userApi.getUserDiagrams(5), // Get 5 most recent diagrams
        ]);
        
        if (statsData.stats) {
          setStats(statsData.stats);
        }
        setDiagrams(diagramsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
        if (error.message === 'Authentication failed') {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [logout]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  const creditUsagePercentage = stats.totalCredits > 0 
    ? (stats.creditsUsed / stats.totalCredits) * 100 
    : 0;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography
          component={motion.h1}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          variant="h4"
          sx={{ mb: 4 }}
        >
          Welcome back, {user?.displayName || 'User'}
        </Typography>

        <Grid container spacing={3}>
          {/* Credits Usage */}
          <Grid item xs={12}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              sx={{ p: 3 }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Credits Usage
              </Typography>
              <Box sx={{ width: '100%', mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={creditUsagePercentage}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {stats.creditsUsed} of {stats.totalCredits} credits used
              </Typography>
            </Paper>
          </Grid>

          {/* Statistics */}
          <Grid item xs={12} sm={6}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              sx={{ p: 3 }}
            >
              <Typography variant="h6" gutterBottom>
                Total Diagrams
              </Typography>
              <Typography variant="h3">{stats.totalDiagrams}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              sx={{ p: 3 }}
            >
              <Typography variant="h6" gutterBottom>
                Subscription Plan
              </Typography>
              <Typography variant="h6" color="primary">
                {stats.user?.plan?.toUpperCase() || 'FREE'}
              </Typography>
            </Paper>
          </Grid>

          {/* Recent Diagrams */}
          <Grid item xs={12}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              sx={{ p: 3 }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Diagrams
              </Typography>
              {diagrams.length > 0 ? (
                <Box component="ul" sx={{ pl: 2 }}>
                  {diagrams.map((diagram) => (
                    <Typography key={diagram._id} component="li" sx={{ mb: 1 }}>
                      {diagram.title || 'Untitled Diagram'} - {new Date(diagram.created_at).toLocaleDateString()}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No diagrams created yet</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
