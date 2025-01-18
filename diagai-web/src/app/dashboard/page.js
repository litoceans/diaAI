'use client';

import { useState ,useEffect} from 'react';
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
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Image, 
  Clock, 
  Zap,
  Crown,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/context/CreditsContext';
import { userApi } from '@/services/api';


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
  { title: 'Total Diagrams', value: '24', icon: Image, color: '#2196F3' },
  { title: 'Active Projects', value: '3', icon: Activity, color: '#4CAF50' },
  { title: 'Credits Used', value: '120', icon: Zap, color: '#FF9800' },
  { title: 'Time Saved', value: '8h', icon: Clock, color: '#9C27B0' }
];

export default function Dashboard() {
  const theme = useTheme();
  const { user } = useAuth();
  const { credits, maxCredits } = useCredits();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [stats, setStats] = useState({});
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const logout = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

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
  }, []);

  const creditUsagePercentage = (credits / maxCredits) * 100;

  return (
    <PageLayout>
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography 
            variant="h4" 
            component={motion.h1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ 
              fontSize: {
                xs: '1.5rem',
                sm: '2rem',
                md: '2.5rem'
              }
            }}
          >
            Welcome back, {user?.displayName || 'User'}!
          </Typography>
          <Chip 
            icon={<Crown size={16} />}
            label="Pro Plan"
            color="primary"
            sx={{ 
              height: 'auto',
              py: 0.5,
              backgroundColor: theme.palette.primary.main + '20',
              color: theme.palette.primary.main,
              borderRadius: 2
            }}
          />
        </Box>
        <Typography 
          color="text.secondary"
          sx={{ 
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            }
          }}
        >
          Here's what's happening with your projects
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              component={motion.div}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              sx={{ 
                height: '100%',
                borderRadius: 2,
                boxShadow: theme.shadows[2],
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease',
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              <CardContent sx={{ 
                p: { xs: 2, sm: 3 },
                '&:last-child': { pb: { xs: 2, sm: 3 } }
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  mb: { xs: 1, sm: 2 }
                }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: `${card.color}20`,
                      color: card.color,
                      mr: 1
                    }}
                  >
                    <card.icon size={isMobile ? 16 : 20} />
                  </Box>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: {
                        xs: '0.75rem',
                        sm: '0.875rem'
                      }
                    }}
                  >
                    {card.title}
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: {
                      xs: '1.5rem',
                      sm: '2rem',
                      md: '2.5rem'
                    }
                  }}
                >
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Plan Details */}
        <Grid item xs={12} md={8}>
          <Card
            component={motion.div}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            sx={{ 
              borderRadius: 2,
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Plan Details</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  endIcon={<ArrowUpRight size={16} />}
                  sx={{ borderRadius: 2 }}
                >
                  Upgrade Plan
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Credits Usage
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={creditUsagePercentage}
                      sx={{ 
                        height: 8,
                        borderRadius: 4,
                        mb: 1,
                        backgroundColor: theme.palette.primary.main + '20'
                      }} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      {credits} of {maxCredits} credits used
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Plan Features
                  </Typography>
                  <Grid container spacing={1}>
                    {['Unlimited Projects', 'Priority Support', 'Advanced Analytics', 'Custom Export'].map((feature) => (
                      <Grid item xs={12} sm={6} key={feature}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Crown size={16} color={theme.palette.primary.main} />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card
            component={motion.div}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            sx={{ 
              borderRadius: 2,
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
              {['Created new diagram', 'Updated project settings', 'Added team member'].map((activity, index) => (
                <Box 
                  key={activity}
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2,
                    '&:last-child': { mb: 0 }
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main
                    }}
                  />
                  <Box>
                    <Typography variant="body2">{activity}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {index === 0 ? '2 hours ago' : index === 1 ? 'Yesterday' : '3 days ago'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
}
