'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
  Skeleton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Paper,
  Container
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreVertical,
  Plus,
  Search,
  FolderOpen,
  Calendar,
  Users,
  Edit3,
  Trash2,
  Share2,
  Star,
  Filter,
  FolderPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { projectApi } from '@/services/projectApi';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

const EmptyState = ({ onCreateProject }) => {
  const theme = useTheme();
  
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
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center'
      }}
    >
      <motion.div variants={itemVariants}>
        <Box
          sx={{
            width: 240,
            height: 240,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            color: 'primary.main',
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(25, 118, 210, 0.08)' 
              : 'rgba(25, 118, 210, 0.04)',
            borderRadius: '50%',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -4,
              left: -4,
              right: -4,
              bottom: -4,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              opacity: 0.2,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: '50%',
              background: theme.palette.background.paper,
              zIndex: 0,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <FolderPlus 
              size={100}
              style={{
                strokeWidth: 1.5,
                opacity: 0.9
              }}
            />
          </Box>
        </Box>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          No Projects Yet
        </Typography>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 4, 
            maxWidth: 450,
            lineHeight: 1.6
          }}
        >
          Start your journey by creating your first project. 
          Our AI will help you transform your ideas into beautiful diagrams in seconds.
        </Typography>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Plus />}
          onClick={onCreateProject}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: `0 8px 16px -4px ${theme.palette.primary.main}40`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              boxShadow: `0 12px 20px -4px ${theme.palette.primary.main}60`,
            }
          }}
        >
          Create Your First Project
        </Button>
      </motion.div>
    </Box>
  );
};

export default function Projects() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectApi.getProjects();
      setProjects(data);
    } catch (error) {
      setError(error.message);
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title.trim()) return;
    
    setCreating(true);
    try {
      const createdProject = await projectApi.createProject({
        name: newProject.title,
        description: newProject.description,
      });
      
      setProjects([createdProject, ...projects]);
      setModalOpen(false);
      setNewProject({ title: '', description: '' });
      showSnackbar('Project created successfully!', 'success');
    } catch (error) {
      console.error('Error creating project:', error);
      showSnackbar('Failed to create project', 'error');
    } finally {
      setCreating(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    try {
      await projectApi.deleteProject(selectedProject._id);
      setProjects(projects.filter(p => p._id !== selectedProject._id));
      showSnackbar('Project deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
    handleMenuClose();
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'starred') return project.starred && matchesSearch;
    if (filterType === 'shared') return project.shared && matchesSearch;
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return theme.palette.success.main;
      case 'completed': return theme.palette.info.main;
      case 'archived': return theme.palette.grey[500];
      default: return theme.palette.primary.main;
    }
  };

  if (projects.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <EmptyState
            onCreateProject={() => setModalOpen(true)}
          />
        </Paper>
      </Container>
    );
  }

  return (
    <PageLayout>
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3
        }}>
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
            Projects
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            <TextField
              placeholder="Search projects..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                minWidth: { xs: '100%', sm: '200px' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
            {
              projects?.length > 0 && (
                <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => setModalOpen(true)}
                sx={{ 
                  borderRadius: 2,
                  whiteSpace: 'nowrap',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                New Project
              </Button>
              )
            }

          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          mb: 3,
          overflowX: 'auto',
          pb: 1
        }}>
          {/* {['all', 'starred', 'shared'].map((type) => ( */}
              {['all'].map((type) => (
            <Chip
              key={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              onClick={() => setFilterType(type)}
              color={filterType === type ? 'primary' : 'default'}
              icon={type === 'starred' ? <Star size={16} /> : 
                    type === 'shared' ? <Share2 size={16} /> :
                    <Filter size={16} />}
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: filterType === type ? 
                    theme.palette.primary.main : 
                    theme.palette.action.hover
                }
              }}
            />
          ))}
        </Box>

        <AnimatePresence>
          <Grid container spacing={2}>
            {loading ? (
              Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Skeleton variant="text" width="60%" height={32} />
                      <Skeleton variant="text" width="40%" height={24} />
                      <Skeleton variant="rectangular" height={60} sx={{ mt: 2, borderRadius: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : filteredProjects.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 4 }}>
                  <EmptyState onCreateProject={() => setModalOpen(true)} />
                </Paper>
              </Grid>
            ) : filteredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project._id}>
                <Card
                  component={motion.div}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  sx={{ 
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                  onClick={() => router.push(`/projects/${project._id}/diagrams`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {project.name}
                        </Typography>
                        <Chip 
                          label={project.status || 'Active'} 
                          size="small"
                          sx={{ 
                            backgroundColor: getStatusColor(project.status) + '20',
                            color: getStatusColor(project.status),
                            borderRadius: 1
                          }} 
                        />
                      </Box>
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, project);
                        }}
                      >
                        <MoreVertical size={20} />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FolderOpen size={16} color={theme.palette.text.secondary} />
                        <Typography variant="body2" color="text.secondary">
                          {project.diagrams?.length || 0} diagrams
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar size={16} color={theme.palette.text.secondary} />
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(project.created_at), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                      {project.shared && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Users size={16} color={theme.palette.text.secondary} />
                          <Typography variant="body2" color="text.secondary">
                            Shared with team
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* <MenuItem onClick={handleMenuClose}>
          <Edit3 size={16} style={{ marginRight: 8 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share2 size={16} style={{ marginRight: 8 }} />
          Share
        </MenuItem> */}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* New Project Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={() => !creating && setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Plus size={24} />
          Create New Project
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            autoFocus
            label="Project Name"
            fullWidth
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            sx={{ mb: 3, mt: 1 }}
            placeholder="Enter project name"
            InputProps={{
              sx: { borderRadius: 1 }
            }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            placeholder="Enter project description (optional)"
            InputProps={{
              sx: { borderRadius: 1 }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setModalOpen(false)}
            disabled={creating}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateProject}
            disabled={!newProject.title.trim() || creating}
            sx={{ borderRadius: 2 }}
          >
            {creating ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            borderRadius: 2,
            alignItems: 'center'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </PageLayout>
  );
}
