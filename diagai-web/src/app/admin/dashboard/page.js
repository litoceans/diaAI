'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Users,
  Image,
  Film,
  TrendingUp,
  MoreVertical,
  Download,
  ChevronUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// Sample data for charts
const userActivityData = [
  { name: 'Mon', users: 120, images: 450, gifs: 200 },
  { name: 'Tue', users: 150, images: 480, gifs: 220 },
  { name: 'Wed', users: 180, images: 520, gifs: 240 },
  { name: 'Thu', users: 170, images: 490, gifs: 210 },
  { name: 'Fri', users: 160, images: 500, gifs: 230 },
  { name: 'Sat', users: 190, images: 550, gifs: 260 },
  { name: 'Sun', users: 200, images: 600, gifs: 280 },
];

const recentUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'Pro',
    status: 'Active',
    lastActive: '2 hours ago',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    plan: 'Basic',
    status: 'Active',
    lastActive: '5 hours ago',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    plan: 'Pro',
    status: 'Inactive',
    lastActive: '1 day ago',
  },
];

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
              {entry.name}: {entry.value}
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
  const [stats] = useState({
    totalUsers: 1234,
    totalImages: 5678,
    totalGifs: 910,
    activeUsers: 456,
  });

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

  const StatCard = ({ icon: Icon, title, value, growth }) => (
    <Card
      component={motion.div}
      variants={itemVariants}
      sx={{
        height: '100%',
        borderRadius: 2,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
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
              bgcolor: 'primary.lighter',
              color: 'primary.main',
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
          <ChevronUp size={20} color={theme.palette.success.main} />
          <Typography
            variant="body2"
            sx={{ color: 'success.main', fontWeight: 600 }}
          >
            {growth}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            from last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ py: 4 }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={Users}
              title="Total Users"
              value={stats.totalUsers}
              growth="+12%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={Image}
              title="Total Images"
              value={stats.totalImages}
              growth="+8%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={Film}
              title="Total GIFs"
              value={stats.totalGifs}
              growth="+15%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={TrendingUp}
              title="Active Users"
              value={stats.activeUsers}
              growth="+5%"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Paper
              component={motion.div}
              variants={itemVariants}
              sx={{
                p: 3,
                height: '400px',
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  User Activity
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download size={18} />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Export
                </Button>
              </Box>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivityData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.palette.divider}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={theme.palette.text.secondary}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="users"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                    name="Users"
                  />
                  <Bar
                    dataKey="images"
                    fill={theme.palette.success.main}
                    radius={[4, 4, 0, 0]}
                    name="Images"
                  />
                  <Bar
                    dataKey="gifs"
                    fill={theme.palette.warning.main}
                    radius={[4, 4, 0, 0]}
                    name="GIFs"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper
              component={motion.div}
              variants={itemVariants}
              sx={{
                p: 3,
                height: '400px',
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Generation Trends
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userActivityData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.palette.divider}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={theme.palette.text.secondary}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="images"
                    stroke={theme.palette.success.main}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Images"
                  />
                  <Line
                    type="monotone"
                    dataKey="gifs"
                    stroke={theme.palette.warning.main}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="GIFs"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        <Paper
          component={motion.div}
          variants={itemVariants}
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Box
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Users
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Download size={18} />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Download Report
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            user.plan === 'Pro'
                              ? 'primary.lighter'
                              : 'warning.lighter',
                          color:
                            user.plan === 'Pro'
                              ? 'primary.main'
                              : 'warning.main',
                          typography: 'body2',
                          fontWeight: 600,
                        }}
                      >
                        {user.plan}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            user.status === 'Active'
                              ? 'success.lighter'
                              : 'error.lighter',
                          color:
                            user.status === 'Active'
                              ? 'success.main'
                              : 'error.main',
                          typography: 'body2',
                          fontWeight: 600,
                        }}
                      >
                        {user.status}
                      </Box>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <MoreVertical size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
}
