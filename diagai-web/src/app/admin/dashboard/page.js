'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  useTheme,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Users,
  Image as ImageIcon,
  FileText,
  CreditCard,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { adminApi } from '@/services/adminApi';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        sx={{
          p: 2,
          boxShadow: 2,
          borderRadius: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: index === payload.length - 1 ? 0 : 0.5,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: entry.color,
              }}
            />
            <Typography variant="body2">
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
      <Box sx={{ mt: 2, p: 2 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users?.total || 0,
      icon: Users,
      color: 'primary.main',
      growth: stats?.users?.new || 0,
      growthLabel: 'new in 30 days'
    },
    {
      title: 'Active Users',
      value: stats?.users?.active || 0,
      icon: UserCheck,
      color: 'success.main',
      growth: ((stats?.users?.active || 0) / (stats?.users?.total || 1) * 100).toFixed(1),
      growthLabel: '% of total users'
    },
    {
      title: 'Total Diagrams',
      value: stats?.diagrams?.total || 0,
      icon: ImageIcon,
      color: 'warning.main',
      growth: stats?.diagrams?.new || 0,
      growthLabel: 'new in 30 days'
    },
    {
      title: 'Total Credits',
      value: stats?.credits?.total || 0,
      icon: CreditCard,
      color: 'info.main',
      growth: 0,
      growthLabel: 'credits used'
    }
  ];

  const DIAGRAM_STATUS_COLORS = {
    completed: theme.palette.success.main,
    pending: theme.palette.warning.main,
    failed: theme.palette.error.main,
    draft: theme.palette.grey[500],
  };

  const diagramStatusData = Object.entries(stats?.diagrams?.by_status || {}).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: DIAGRAM_STATUS_COLORS[status] || theme.palette.grey[500]
  }));

  const StatCard = ({ icon: Icon, title, value, color, growth, growthLabel }) => (
    <Card
      sx={{
        height: '100%',
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: `${color}15`,
              color: color,
              display: 'flex',
            }}
          >
            <Icon size={24} />
          </Box>
          <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          {value.toLocaleString()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {growth > 0 ? (
            <ChevronUp size={20} color={theme.palette.success.main} />
          ) : growth < 0 ? (
            <ChevronDown size={20} color={theme.palette.error.main} />
          ) : null}
          <Typography
            variant="body2"
            sx={{
              color: growth > 0 ? 'success.main' : growth < 0 ? 'error.main' : 'text.secondary',
              fontWeight: 600
            }}
          >
            {growth.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {growthLabel}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Diagram Status Distribution
            </Typography>
            <Box sx={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diagramStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={100}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {diagramStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Stats
            </Typography>
            <Box sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  User Engagement Rate
                </Typography>
                <Typography variant="h6">
                  {((stats?.users?.active || 0) / (stats?.users?.total || 1) * 100).toFixed(1)}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Average Credits per User
                </Typography>
                <Typography variant="h6">
                  {((stats?.credits?.total || 0) / (stats?.users?.total || 1)).toFixed(1)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Diagrams per User
                </Typography>
                <Typography variant="h6">
                  {((stats?.diagrams?.total || 0) / (stats?.users?.total || 1)).toFixed(1)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
