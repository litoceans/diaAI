'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Paper,
} from '@mui/material';
import { 
  Users as UsersIcon,
  Image as ImageIcon,
  FolderKanban,
  CreditCard
} from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const { admin, loading } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!admin) {
        router.push('/admin/login');
      }
    }
  }, [admin, loading, router]);

  const fetchStats = async () => {
    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const intervalId = setInterval(fetchStats, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: <UsersIcon size={24} />,
      color: 'primary.main'
    },
    {
      title: 'Total Diagrams',
      value: stats?.total_diagrams || 0,
      icon: <ImageIcon size={24} />,
      color: 'success.main'
    },
    {
      title: 'Total Projects',
      value: stats?.total_projects || 0,
      icon: <FolderKanban size={24} />,
      color: 'warning.main'
    },
    {
      title: 'Total Credits Used',
      value: stats?.total_credits_used || 0,
      icon: <CreditCard size={24} />,
      color: 'info.main'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1,
                      borderRadius: 1,
                      bgcolor: `${card.color}15`,
                      color: card.color,
                      mr: 2
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {card.value.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Daily Activity (Last 30 Days)
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats?.daily_stats || []}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="new_users" 
                    stackId="1"
                    stroke="#2196f3" 
                    fill="#2196f3" 
                    name="New Users"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="credits_used" 
                    stackId="2"
                    stroke="#4caf50" 
                    fill="#4caf50" 
                    name="Credits Used"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
