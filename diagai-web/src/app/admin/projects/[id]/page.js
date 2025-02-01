'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Calendar,
  BarChart2,
  Trash2,
  Download,
  Eye,
  MoreVertical,
  Image as ImageIcon,
  Film,
  FileText,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/services/adminApi';
import Image from 'next/image';

const DiagramCard = ({ diagram, onView, onDownload }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    handleMenuClose();
    onView(diagram);
  };

  const handleDownload = () => {
    handleMenuClose();
    onDownload(diagram);
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'image':
        return <ImageIcon size={20} />;
      case 'gif':
        return <Film size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  return (
    <Card 
      component={motion.div}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ position: 'relative', pt: '56.25%' }}>
        <CardMedia
          component="div"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {diagram.image_url ? (
            <Image
              src={diagram.image_url}
              alt={diagram.name}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            getTypeIcon(diagram.type)
          )}
        </CardMedia>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" noWrap sx={{ mb: 1 }}>
            {diagram.name}
          </Typography>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertical size={20} />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {getTypeIcon(diagram.type)}
          <Typography variant="body2" color="text.secondary">
            {diagram.type}
          </Typography>
        </Box>
        <Chip
          label={diagram.status}
          color={diagram.status === 'completed' ? 'success' : 'default'}
          size="small"
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" display="block" color="text.secondary">
          Created: {new Date(diagram.created_at).toLocaleDateString()}
        </Typography>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <Eye size={20} style={{ marginRight: 8 }} />
          View
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <Download size={20} style={{ marginRight: 8 }} />
          Download
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default function ProjectDetails({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getProject(params.id);
      setProject(data);
    } catch (err) {
      setError('Failed to fetch project details');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteProject(params.id);
      router.push('/admin/projects');
    } catch (err) {
      setError('Failed to delete project');
      console.error('Error deleting project:', err);
    }
  };

  const handleViewDiagram = (diagram) => {
    router.push(`/diagrams/${diagram.id}`);
  };

  const handleDownloadDiagram = (diagram) => {
    // Implement download logic
    console.log('Downloading diagram:', diagram.id);
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Project not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ py: 4 }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => router.push('/admin/projects')}
            sx={{ mb: 2 }}
          >
            Back to Projects
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {project.name}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {project.description}
              </Typography>
              <Chip
                label={project.status}
                color={project.status === 'active' ? 'success' : 'default'}
                size="small"
              />
            </Box>
            <Button
              variant="contained"
              color="error"
              startIcon={<Trash2 size={20} />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Project
            </Button>
          </Box>
        </Box>

        {/* Project Info */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper
              component={motion.div}
              variants={itemVariants}
              sx={{ p: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <User size={20} style={{ marginRight: 8 }} />
                <Typography variant="h6">User Info</Typography>
              </Box>
              <Typography variant="body1">{project.user.name}</Typography>
              <Typography color="text.secondary">{project.user.email}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              component={motion.div}
              variants={itemVariants}
              sx={{ p: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Calendar size={20} style={{ marginRight: 8 }} />
                <Typography variant="h6">Dates</Typography>
              </Box>
              <Typography variant="body2" gutterBottom>
                Created: {new Date(project.created_at).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Updated: {new Date(project.updated_at).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              component={motion.div}
              variants={itemVariants}
              sx={{ p: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart2 size={20} style={{ marginRight: 8 }} />
                <Typography variant="h6">Statistics</Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {project.diagrams.length}
              </Typography>
              <Typography color="text.secondary">Total Diagrams</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Diagrams Grid */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          sx={{ p: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Diagrams
          </Typography>
          <Grid container spacing={3}>
            {project.diagrams.map((diagram) => (
              <Grid item xs={12} sm={6} md={4} key={diagram.id}>
                <DiagramCard
                  diagram={diagram}
                  onView={handleViewDiagram}
                  onDownload={handleDownloadDiagram}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this project? This will also delete all
            associated diagrams. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
