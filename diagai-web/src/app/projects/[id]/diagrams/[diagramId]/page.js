'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Skeleton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Download,
  Share2,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Film,
  Copy,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../../context/AuthContext';
import { diagramApi } from '../../../../../services/diagramApi';
import ProtectedRoute from '../../../../../components/ProtectedRoute';

export default function DiagramDetails() {
  const params = useParams();
  const router = useRouter();
  const [diagram, setDiagram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [regenerating, setRegenerating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDiagram();
  }, [params.diagramId]);

  const fetchDiagram = async () => {
    try {
      setLoading(true);
      const diagram = await diagramApi.getDiagram(params.diagramId);
      setDiagram(diagram);
      setPrompt(diagram.prompt);
    } catch (err) {
      console.error('Error fetching diagram:', err);
      setError(err.message);
      setSnackbar({
        open: true,
        message: 'Failed to fetch diagram details',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDiagram = async () => {
    try {
      setUpdating(true);
      await diagramApi.updateDiagram(params.diagramId, { prompt });
      setEditOpen(false);
      setSnackbar({
        open: true,
        message: 'Diagram updated successfully',
        severity: 'success'
      });
      await fetchDiagram();
    } catch (err) {
      console.error('Error updating diagram:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update diagram',
        severity: 'error'
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteDiagram = async () => {
    try {
      await diagramApi.deleteDiagram(params.diagramId);
      setSnackbar({
        open: true,
        message: 'Diagram deleted successfully',
        severity: 'success'
      });
      router.push(`/projects/${params.id}`);
    } catch (err) {
      console.error('Error deleting diagram:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete diagram',
        severity: 'error'
      });
    }
  };

  const handleRegenerateDiagram = async () => {
    try {
      setRegenerating(true);
      const newDiagram = await diagramApi.generateDiagram({
        project_id: params.id,
        prompt: prompt,
        type: diagram.type
      });
      setSnackbar({
        open: true,
        message: 'Diagram regeneration started',
        severity: 'success'
      });
      pollDiagramStatus(newDiagram._id);
    } catch (err) {
      console.error('Error regenerating diagram:', err);
      setSnackbar({
        open: true,
        message: 'Failed to regenerate diagram',
        severity: 'error'
      });
    } finally {
      setRegenerating(false);
    }
  };

  const pollDiagramStatus = async (diagramId) => {
    const interval = setInterval(async () => {
      try {
        const updatedDiagram = await diagramApi.getDiagram(diagramId);
        if (updatedDiagram.status !== 'processing') {
          clearInterval(interval);
          setDiagram(updatedDiagram);
          setSnackbar({
            open: true,
            message: 'Diagram regenerated successfully',
            severity: 'success'
          });
        }
      } catch (error) {
        console.error('Error polling diagram status:', error);
        clearInterval(interval);
      }
    }, 2000);

    // Clear interval after 5 minutes to prevent infinite polling
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(diagram?.prompt);
    setSnackbar({
      open: true,
      message: 'Prompt copied to clipboard',
      severity: 'success',
    });
  };

  const handleDownload = () => {
    window.open(diagram.url, '_blank');
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumbs */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs separator={<ChevronRight size={16} />}>
              <Link href="/projects" passHref legacyBehavior>
                <MuiLink sx={{ display: 'flex', alignItems: 'center' }}>
                  Projects
                </MuiLink>
              </Link>
              <Link href={`/projects/${params.id}`} passHref legacyBehavior>
                <MuiLink sx={{ display: 'flex', alignItems: 'center' }}>
                  Project Details
                </MuiLink>
              </Link>
              <Link href={`/projects/${params.id}/diagrams`} passHref legacyBehavior>
                <MuiLink sx={{ display: 'flex', alignItems: 'center' }}>
                  Diagrams
                </MuiLink>
              </Link>
              <Typography color="text.primary">Diagram Details</Typography>
            </Breadcrumbs>
          </Box>

          {/* Back Button */}
          <Button
            component={Link}
            href={`/projects/${params.id}/diagrams`}
            startIcon={<ArrowLeft />}
            sx={{ mb: 3 }}
          >
            Back to Diagrams
          </Button>

          {loading ? (
            <Box>
              <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={400} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="40%" height={24} />
            </Box>
          ) : diagram && (
            <>
              {/* Header */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  mb: 4, 
                  borderRadius: 2,
                  background: 'linear-gradient(to right, #f8f9fa, #e9ecef)'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      {new Date(diagram.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      Diagram Details
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={diagram.type} 
                        icon={diagram.type === 'image' ? <ImageIcon size={16} /> : <Film size={16} />}
                        variant="outlined"
                      />
                      <Chip 
                        label={diagram.status}
                        color={diagram.status === 'completed' ? 'success' : 'default'}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Download">
                      <IconButton onClick={handleDownload} disabled={!diagram.url}>
                        <Download size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy Prompt">
                      <IconButton onClick={handleCopyPrompt}>
                        <Copy size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => setEditOpen(true)}>
                        <Pencil size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Regenerate">
                      <IconButton 
                        onClick={handleRegenerateDiagram} 
                        disabled={regenerating}
                        sx={{ 
                          animation: regenerating ? 'spin 1s linear infinite' : 'none',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      >
                        <RefreshCw size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={handleDeleteDiagram} color="error">
                        <Trash2 size={20} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>

              {/* Image */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  mb: 4, 
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: 400,
                }}
              >
                <AnimatePresence>
                  {!imageLoaded && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f8f9fa',
                      }}
                    >
                      <CircularProgress />
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.img
                  src={diagram.url}
                  alt={diagram.prompt}
                  onLoad={() => setImageLoaded(true)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: imageLoaded ? 1 : 0,
                    scale: imageLoaded ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </Paper>

              {/* Prompt */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom>
                  Prompt
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {diagram.prompt}
                </Typography>
              </Paper>
            </>
          )}

          {/* Edit Dialog */}
          <Dialog 
            open={editOpen} 
            onClose={() => setEditOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Edit Diagram Prompt</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                multiline
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
                placeholder="Enter your prompt here..."
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateDiagram} variant="contained" disabled={updating}>
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={() => setSnackbar({ ...snackbar, open: false })} 
              severity={snackbar.severity}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </motion.div>
      </Container>
    </ProtectedRoute>
  );
}
