'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, ArrowRight, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { projectApi } from '@/services/projectApi';

export default function Projects() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
    if (projectName.trim()) {
      try {
        setLoading(true);
        const newProject = await projectApi.createProject({
          name: projectName,
          description: projectDescription,
        });
        setProjects([...projects, newProject]);
        setProjectName('');
        setProjectDescription('');
        setOpen(false);
        showSnackbar('Project created successfully', 'success');
      } catch (error) {
        showSnackbar(error.message, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteProject = async (projectId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setLoading(true);
        await projectApi.deleteProject(projectId);
        setProjects(projects.filter(project => project._id !== projectId));
        showSnackbar('Project deleted successfully', 'success');
      } catch (error) {
        showSnackbar(error.message, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProjectClick = (projectId) => {
    router.push(`/projects/${projectId}/diagrams`);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && projects.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h4">My Projects</Typography>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => setOpen(true)}
          >
            New Project
          </Button>
        </Box>

        <Grid container spacing={3}>
          {projects.length === 0 ? (
            <Grid item xs={12}>
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <FolderOpen size={48} color="#9CA3AF" />
                <Typography variant="h6" color="text.secondary">
                  No projects yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create your first project to start generating diagrams
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Plus />}
                  onClick={() => setOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Create Project
                </Button>
              </Paper>
            </Grid>
          ) : (
            projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project._id}>
                <Paper
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleProjectClick(project._id)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" noWrap sx={{ flex: 1 }}>
                      {project.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteProject(project._id, e)}
                      sx={{ ml: 1 }}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                  {project.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(project.created_at).toLocaleDateString()}
                    </Typography>
                    <ArrowRight size={20} />
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Create Project Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            fullWidth
            multiline
            rows={3}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateProject}
            variant="contained"
            disabled={!projectName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
