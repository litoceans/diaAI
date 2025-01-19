'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  useTheme,
  useMediaQuery,
  Chip,
  LinearProgress,
  Divider,
  Button,
  Tab,
  Tabs
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Image, 
  Clock, 
  Zap,
  Crown,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/services/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const statsCards = [
  { 
    title: 'Total Diagrams', 
    key: 'totalDiagrams',
    icon: Image, 
    color: '#2196F3',
    format: (value) => value.toString()
  },
  { 
    title: 'Active Projects', 
    key: 'activeProjects',
    icon: Activity, 
    color: '#4CAF50',
    format: (value) => value.toString()
  },
  { 
    title: 'Credits Used', 
    key: 'creditsUsed',
    icon: Zap, 
    color: '#FF9800',
    format: (value) => value.toString()
  },
  { 
    title: 'Time Saved', 
    key: 'timeSaved',
    icon: Clock, 
    color: '#9C27B0',
    format: (value) => `${value}h`
  }
];

export default function Dashboard() {
  const theme = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [stats, setStats] = useState({
    totalDiagrams: 0,
    activeProjects: 0,
    creditsUsed: 0,
    timeSaved: 0,
    totalCredits:0,
    avlCredits:0
  });
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usageStats, setUsageStats] = useState({ daily: [], monthly: [] });
  const [chartTab, setChartTab] = useState(0);

  const handleChartTabChange = (event, newValue) => {
    setChartTab(newValue);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, diagramsData, usageData] = await Promise.all([
          userApi.getDashboardStats(),
          userApi.getUserDiagrams(5),
          userApi.getCreditsUsage()
        ]);
        
        if (statsData.stats) {
          const timeSaved = Math.round((statsData.stats.totalDiagrams * 30) / 60);
          
          setStats({
            totalDiagrams: statsData.stats.totalDiagrams || 0,
            activeProjects: statsData.stats.totalProjects || 0,
            creditsUsed: statsData.stats.creditsUsed || 0,
            timeSaved: timeSaved,
            totalCredits: statsData.stats.fullCredits || 0,
            avlCredits: statsData.stats.avlCredits || 0
          });
        }
        setDiagrams(diagramsData || []);
        setUsageStats(usageData || { daily: [], monthly: [] });
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
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      </PageLayout>
    );
  }

  const creditUsagePercentage = (stats.creditsUsed / stats.totalCredits) * 100;

  return (
    <PageLayout>
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography 
            variant="h4" 
            component={motion.h1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome back, {user?.name || 'User'}!
          </Typography>
          {user?.plan === 'pro' && (
            <Chip 
              icon={<Crown size={16} />} 
              label="PRO" 
              color="primary" 
              size="small"
            />
          )}
        </Box>

        <Grid container spacing={3}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  elevation={0}
                  sx={{ 
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    height: '100%',
                    '&:hover': {
                      borderColor: card.color,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease-in-out'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <card.icon 
                        size={20} 
                        style={{ 
                          color: card.color,
                          marginRight: '8px'
                        }} 
                      />
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary"
                      >
                        {card.title}
                      </Typography>
                    </Box>
                    <Typography variant="h4">
                      {card.format(stats[card.key])}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Credits Usage Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Credits Usage
          </Typography>
          <Card 
            elevation={0}
            sx={{ 
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider'
            }}
          >
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stats.creditsUsed} of {stats.totalCredits} credits remaining
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={creditUsagePercentage}
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: creditUsagePercentage > 80 ? 'error.main' : 'primary.main'
                    }
                  }}
                />
              </Box>
              {creditUsagePercentage > 80 && (
                <Typography variant="body2" color="error">
                  Your credits are running low. Consider upgrading your plan.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Credits Usage Charts */}
        <Box sx={{ mt: 4 }}>
          <Card 
            elevation={0}
            sx={{ 
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider'
            }}
          >
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                  value={chartTab} 
                  onChange={handleChartTabChange}
                  sx={{
                    '& .MuiTab-root': {
                      minWidth: 120
                    }
                  }}
                >
                  <Tab 
                    icon={<TrendingUp size={16} />} 
                    iconPosition="start" 
                    label="Daily Usage" 
                  />
                  <Tab 
                    icon={<Activity size={16} />} 
                    iconPosition="start" 
                    label="Monthly Usage" 
                  />
                </Tabs>
              </Box>
              
              <Box sx={{ height: 300, width: '100%' }}>
                {chartTab === 0 ? (
                  <ResponsiveContainer>
                    <AreaChart
                      data={usageStats.daily}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return d.toLocaleDateString('en-US', { weekday: 'short' });
                        }}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} credits`, 'Usage']}
                        labelFormatter={(date) => {
                          const d = new Date(date);
                          return d.toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke={theme.palette.primary.main}
                        fill={theme.palette.primary.main + '20'}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer>
                    <AreaChart
                      data={usageStats.monthly}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tickFormatter={(month) => {
                          const date = new Date(month);
                          return date.toLocaleDateString('en-US', { month: 'short' });
                        }}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} credits`, 'Usage']}
                        labelFormatter={(month) => {
                          const date = new Date(month);
                          return date.toLocaleDateString('en-US', { 
                            year: 'numeric',
                            month: 'long'
                          });
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke={theme.palette.primary.main}
                        fill={theme.palette.primary.main + '20'}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Diagrams Section */}
        {diagrams.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recent Diagrams
            </Typography>
            <Grid container spacing={2}>
              {diagrams.map((diagram, index) => (
                <Grid item xs={12} sm={6} md={4} key={diagram._id}>
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      elevation={0}
                      sx={{ 
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease-in-out'
                        }
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" noWrap>
                          {diagram.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          Created: {new Date(diagram.created_at).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </PageLayout>
  );
}
