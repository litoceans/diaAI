'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
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
  Breadcrumbs,
  Menu,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  DialogContentText,
  Link as MuiLink,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Plus,
  Trash2,
  ChevronRight,
  Download,
  Share2,
  Pencil,
  Image as ImageIcon,
  Film,
  Copy,
  RefreshCw,
  ArrowLeft,
  MoreVertical,
  Network,
  CircuitBoard,
  Database,
  GitBranch,
  Workflow
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { projectApi } from '../../../services/projectApi';
import { diagramApi } from '../../../services/diagramApi';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function ProjectDetails() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [project, setProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDiagramType, setSelectedDiagramType] = useState('');
  const [diagramType, setDiagramType] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [diagrams, setDiagrams] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDiagram, setSelectedDiagram] = useState(null);

  useEffect(() => {
    fetchProjectData();
  }, [params.id]);

  const fetchProjectData = async () => {
    try {
      const projectData = await projectApi.getProject(params.id);
      setProject(projectData);
      setDiagrams(projectData.diagrams || []);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMenu = (event, diagram) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedDiagram(diagram);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedDiagram(null);
  };

  const handleCreateDiagram = async () => {
    if (!prompt.trim() || !diagramType) return;

    setGenerating(true);
    setError('');

    try {
      const newDiagram = await diagramApi.generateDiagram({
        project_id: params.id,
        prompt: prompt.trim(),
        type: diagramType,
      });

      setDiagrams([...diagrams, newDiagram]);
      setPrompt('');
      setDiagramType('');
      setOpen(false);
      // Start polling for diagram status
      pollDiagramStatus(newDiagram._id);
    } catch (err) {
      console.error('Error generating diagram:', err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const pollDiagramStatus = async (diagramId) => {
    const interval = setInterval(async () => {
      try {
        const diagram = await diagramApi.getDiagram(diagramId);
        if (diagram.status !== 'processing') {
          clearInterval(interval);
          // Update diagram in the list
          setDiagrams(prev => prev.map(d => 
            d._id === diagramId ? diagram : d
          ));
        }
      } catch (error) {
        console.error('Error polling diagram status:', error);
        clearInterval(interval);
      }
    }, 2000); // Poll every 2 seconds

    // Clear interval after 5 minutes to prevent infinite polling
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
  };

  const handleDeleteDiagram = async (diagramId) => {
    if (!window.confirm('Are you sure you want to delete this diagram?')) return;

    try {
      await diagramApi.deleteDiagram(diagramId);
      setDiagrams(diagrams.filter(d => d._id !== diagramId));
      handleCloseMenu();
    } catch (err) {
      console.error('Error deleting diagram:', err);
      setError(err.message);
    }
  };

  const handleDiagramClick = (diagram) => {
    router.push(`/projects/${params.id}/diagrams/${diagram._id}`);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setSelectedDiagramType('');
    setDiagramType('');
    setPrompt('');
    setError('');
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  const diagramExamples = [
    {
      type: 'flowchart',
      title: 'Flowcharts',
      icon: <Workflow size={24} />,
      description: 'Visualize processes and workflows'
    },
    {
      type: 'sequence',
      title: 'Sequence Diagrams',
      icon: <GitBranch size={24} />,
      description: 'Show interactions between components'
    },
    {
      type: 'architecture',
      title: 'Architecture Diagrams',
      icon: <Network size={24} />,
      description: 'Illustrate system architecture'
    },
    {
      type: 'mindmap',
      title: 'Mind Maps',
      icon: <CircuitBoard size={24} />,
      description: 'Organize ideas and concepts'
    },
    {
      type: 'erd',
      title: 'ERD',
      icon: <Database size={24} />,
      description: 'Design database relationships'
    }
  ];

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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Breadcrumbs */}
            <Breadcrumbs
              separator={<ChevronRight size={16} />}
              sx={{ mb: 3 }}
            >
              <MuiLink
                component={Link}
                href="/projects"
                color="inherit"
                underline="hover"
              >
                Projects
              </MuiLink>
              <Typography color="text.primary">{project?.name}</Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {project?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {project?.description}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={() => setOpen(true)}
              >
                New Diagram
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Diagrams Grid */}
            <Grid container spacing={3}>
              {diagrams.map((diagram) => (
                <Grid item xs={12} sm={6} md={4} key={diagram._id}>
                  <Card
                    component={motion.div}
                    variants={itemVariants}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        pt: '56.25%',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDiagramClick(diagram)}
                    >
                      {diagram.status === 'processing' ? (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'background.paper',
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : diagram.url ? (
                        <Box
                          component="img"
                          src={diagram.url}
                          alt={diagram.prompt}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'background.paper',
                          }}
                        >
                          <ImageIcon size={48} color="disabled" />
                        </Box>
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {new Date(diagram.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {diagram.prompt}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Type: {diagram.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {diagram.status}
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, diagram)}
                      >
                        <MoreVertical size={20} />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Diagram Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              {selectedDiagram?.status === 'completed' && (
                <MenuItem onClick={() => handleDownload(selectedDiagram.url)}>
                  <Download size={16} style={{ marginRight: 8 }} />
                  Download
                </MenuItem>
              )}
              <MenuItem onClick={() => handleDeleteDiagram(selectedDiagram?._id)}>
                <Trash2 size={16} style={{ marginRight: 8 }} />
                Delete
              </MenuItem>
            </Menu>

            {/* Create Dialog */}
            <Dialog
              open={open}
              onClose={() => !generating && handleClose()}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>
                Create New Diagram
              </DialogTitle>
              <DialogContent>
                <Stepper activeStep={activeStep} sx={{ py: 4 }}>
                  <Step>
                    <StepLabel>Select Type</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Enter Details</StepLabel>
                  </Step>
                </Stepper>

                {activeStep === 0 ? (
                  <Grid container spacing={2}>
                    {diagramExamples.map((example) => (
                      <Grid item xs={12} sm={6} key={example.type}>
                        <Card
                          onClick={() => {
                            setSelectedDiagramType(example.type);
                            handleNext();
                          }}
                          sx={{
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.02)',
                            },
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              {example.icon}
                              <Typography variant="h6" sx={{ ml: 1 }}>
                                {example.title}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {example.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ pt: 2 }}>
                    <TextField
                      label="Prompt"
                      multiline
                      rows={4}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      fullWidth
                      disabled={generating}
                      sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={diagramType}
                        onChange={(e) => setDiagramType(e.target.value)}
                        disabled={generating}
                      >
                        <MenuItem value="image">Static Image</MenuItem>
                        <MenuItem value="gif">Animated GIF</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} disabled={generating}>
                  Cancel
                </Button>
                {activeStep === 1 && (
                  <Button onClick={handleBack} disabled={generating}>
                    Back
                  </Button>
                )}
                {activeStep === 1 && (
                  <Button
                    onClick={handleCreateDiagram}
                    variant="contained"
                    disabled={!prompt.trim() || !diagramType || generating}
                    startIcon={generating ? <CircularProgress size={20} /> : null}
                  >
                    {generating ? 'Generating...' : 'Generate'}
                  </Button>
                )}
              </DialogActions>
            </Dialog>
          </motion.div>
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
