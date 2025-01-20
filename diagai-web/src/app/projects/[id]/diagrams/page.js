'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Paper,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  Radio,
  FormControlLabel,
  Input,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  Download, 
  Image as ImageIcon, 
  Film,
  Share2,
  GitMerge,
  Network,
  CircuitBoard,
  Database,
  Calendar,
  Boxes,
  Upload,
  Maximize2,
  GitBranch,
  Workflow,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { projectApi } from '@/services/projectApi';
import { diagramApi } from '@/services/diagramApi';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmptyState from '@/components/EmptyState';

export default function ProjectDiagrams() {
  const theme = useTheme();
  const { id: projectId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [project, setProject] = useState(null);
  const [diagrams, setDiagrams] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [diagramType, setDiagramType] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDiagram, setSelectedDiagram] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generationType, setGenerationType] = useState('image');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const diagramTypes = [
    {
      type: 'flowchart (Process Visualization)',
      title: 'Flowcharts',
      icon: <Share2 size={24} />,
      description: 'Visualize processes and workflows',
      examples: [
        'Simple process flow',
        'Decision tree',
        'System workflow'
      ]
    },
    {
      type: 'sequence (Interaction Diagram)',
      title: 'Sequence Diagrams',
      icon: <GitMerge size={24} />,
      description: 'Show interactions between components',
      examples: [
        'API request flow',
        'User authentication process',
        'Service communication'
      ]
    },
    {
      type: 'architecture (System Design)',
      title: 'Architecture Diagrams',
      icon: <Network size={24} />,
      description: 'Illustrate system architecture',
      examples: [
        'System components',
        'Microservices layout',
        'Cloud infrastructure'
      ]
    },
    {
      type: 'mindmap (Idea Organization)',
      title: 'Mind Maps',
      icon: <CircuitBoard size={24} />,
      description: 'Organize ideas and concepts',
      examples: [
        'Project brainstorming',
        'Feature planning',
        'Knowledge organization'
      ]
    },
    {
      type: 'erd (Database Design)',
      title: 'ERD',
      icon: <Database size={24} />,
      description: 'Design database relationships',
      examples: [
        'Database schema',
        'Entity relationships',
        'Data model'
      ]
    },
    {
      type: 'gantt (Project Schedule)',
      title: 'Gantt Charts',
      icon: <Calendar size={24} />,
      description: 'Project timelines and schedules',
      examples: [
        'Project timeline',
        'Task dependencies',
        'Resource allocation'
      ]
    },
    {
      type: 'class (Object-Oriented Design)',
      title: 'Class Diagrams',
      icon: <Boxes size={24} />,
      description: 'Object-oriented structures',
      examples: [
        'Class hierarchy',
        'Object relationships',
        'System design'
      ]
    },
    {
      type:'git (Git Verison Flow)',
      title: 'Git Diagrams',
      icon: <GitMerge size={24} />,
      description: 'Show How Git Works',
      examples: [
        'Git workflow',
        'Merge conflicts',
        'Commit history'
      ]
    }
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setDiagramType('');
    setPrompt('');
    setGenerationType('image');
    setUploadedImage(null);
    setUploadedImageUrl('');
  };

  const handleGenerateDiagram = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    setError('');

    try {
      const newDiagram = await diagramApi.generateDiagram({
        project_id: projectId,
        prompt: prompt.trim(),
        type: generationType,
        generation_type: diagramType,
        image: uploadedImage,
      });

      setDiagrams([...diagrams, newDiagram]);
      setOpenDialog(false);
      handleReset();
      // Start polling for diagram status
      pollDiagramStatus(newDiagram._id);
    } catch (err) {
      console.error('Error generating diagram:', err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const fetchProjectData = async (status = 'all', type = 'all') => {
    try {
      setLoading(true);
      const [projectData, diagramsData] = await Promise.all([
        projectApi.getProject(projectId),
        projectApi.getDiagrams(projectId, status, type)
      ]);
      
      setProject(projectData);
      setDiagrams(diagramsData || []);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
    } catch (err) {
      console.error('Error deleting diagram:', err);
      setError(err.message);
    }
  };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  const handleViewDetails = (diagram) => {
    router.push(`/projects/${projectId}/diagrams/${diagram._id}`);
  };

  const handlePreview = (diagram) => {
    setSelectedDiagram(diagram);
    setPreviewOpen(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      setUploadedImageUrl(URL.createObjectURL(file));
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Choose Generation Type
            </Typography>
            <RadioGroup
              value={generationType}
              onChange={(e) => setGenerationType(e.target.value)}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: generationType === 'image' ? '2px solid' : '1px solid',
                      borderColor: generationType === 'image' ? 'primary.main' : 'divider',
                      '&:hover': { borderColor: 'primary.main' },
                      height: '100%', // Make card fill grid item height
                    }}
                    onClick={() => setGenerationType('image')}
                  >
                    <CardContent sx={{ 
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      p: 2
                    }}>
                      <FormControlLabel
                        value="image"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ImageIcon size={24} />
                            <Box>
                              <Typography variant="subtitle1">Static Image</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Generate a single diagram image
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: generationType === 'gif' ? '2px solid' : '1px solid',
                      borderColor: generationType === 'gif' ? 'primary.main' : 'divider',
                      '&:hover': { borderColor: 'primary.main' },
                      height: '100%', // Make card fill grid item height
                    }}
                    onClick={() => setGenerationType('gif')}
                  >
                    <CardContent sx={{ 
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      p: 2
                    }}>
                      <FormControlLabel
                        value="gif"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Film size={24} />
                            <Box>
                              <Typography variant="subtitle1">Animated GIF</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Generate an animated diagram sequence
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </RadioGroup>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Select Diagram Type
            </Typography>
            <Grid container spacing={2}>
              {diagramTypes.map((type) => (
                <Grid item xs={12} sm={6} key={type.type}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      height: '100%',
                      position: 'relative',
                      transition: 'all 0.2s ease-in-out',
                      transform: diagramType === type.type ? 'scale(1.02)' : 'scale(1)',
                      border: diagramType === type.type ? '2px solid' : '1px solid',
                      borderColor: diagramType === type.type ? 'primary.main' : 'divider',
                      boxShadow: diagramType === type.type ? 4 : 1,
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: 3,
                        ...(diagramType !== type.type && {
                          transform: 'scale(1.01)',
                          '& .icon-box': {
                            color: 'common.white',
                            transform: 'scale(1.05)',
                          }
                        })
                      }
                    }}
                    onClick={() => setDiagramType(type.type)}
                  >
                    <CardContent sx={{ height: '100%' }}>
                      <Box 
                        className="icon-wrapper"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1.5,
                          mb: 2,
                          transition: 'all 0.2s ease-in-out',
                          color: diagramType === type.type ? 'primary.main' : 'text.secondary'
                        }}
                      >
                        <Box 
                          className="icon-box"
                          sx={{ 
                            backgroundColor: diagramType === type.type ? 'primary.main' : 'action.hover',
                            borderRadius: '50%',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease-in-out',
                            color: diagramType === type.type ? 'common.white' : 'inherit',
                            '.MuiCard-root:hover &': {
                              backgroundColor: 'primary.main',
                              color: 'common.white'
                            }
                          }}
                        >
                          {type.icon}
                        </Box>
                        <Typography 
                          variant="h6"
                          sx={{ 
                            color: diagramType === type.type ? 'primary.main' : 'text.primary',
                            fontWeight: diagramType === type.type ? 600 : 500,
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          {type.title}
                        </Typography>
                      </Box>
                      <Typography 
                        color={diagramType === type.type ? 'text.primary' : 'text.secondary'} 
                        mb={2}
                        sx={{ transition: 'color 0.2s ease-in-out' }}
                      >
                        {type.description}
                      </Typography>
                      <Typography 
                        variant="subtitle2" 
                        color="primary" 
                        gutterBottom
                        sx={{ 
                          opacity: diagramType === type.type ? 1 : 0.7,
                          transition: 'opacity 0.2s ease-in-out'
                        }}
                      >
                        Example prompts:
                      </Typography>
                      <Box 
                        component="ul" 
                        sx={{ 
                          pl: 2, 
                          m: 0,
                          '& li': {
                            color: diagramType === type.type ? 'text.primary' : 'text.secondary',
                            transition: 'color 0.2s ease-in-out',
                            mb: 0.5,
                            '&:last-child': {
                              mb: 0
                            }
                          }
                        }}
                      >
                        {type.examples.map((example, i) => (
                          <Typography 
                            component="li" 
                            key={i} 
                            variant="body2"
                          >
                            {example}
                          </Typography>
                        ))}
                      </Box>
                      {diagramType === type.type && (
                        <Box
                          component={motion.div}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          sx={{ 
                            mt: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'primary.main'
                          }}
                        >
                          <Chip 
                            label="Selected" 
                            color="primary" 
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Describe Your Diagram
            </Typography>
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              label="Prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe what you want in your ${diagramType} diagram...`}
              helperText="Be as specific as possible for better results"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle1" gutterBottom>
              Reference Image (Optional)
            </Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main' },
              }}
              onClick={() => document.getElementById('image-upload').click()}
            >
              {uploadedImageUrl ? (
                <Box>
                  <img
                    src={uploadedImageUrl}
                    alt="Reference"
                    style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Click to change image
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ color: 'text.secondary' }}>
                  <Upload size={32} />
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Click to upload a reference image
                  </Typography>
                  <Typography variant="body2">
                    Supports: JPG, PNG, GIF
                  </Typography>
                </Box>
              )}
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                sx={{ display: 'none' }}
              />
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  const handleStatusFilterChange = async (event, newStatus) => {
    if (newStatus !== null) {
      setStatusFilter(newStatus);
      await fetchProjectData(newStatus, typeFilter);
    }
  };

  const handleTypeFilterChange = async (event, newType) => {
    if (newType !== null) {
      setTypeFilter(newType);
      await fetchProjectData(statusFilter, newType);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const handleMenuClick = (event, diagram) => {
    // setAnchorEl(event.currentTarget);
    // setSelectedDiagram(diagram);
  };

  const handleMenuClose = () => {
    // setAnchorEl(null);
    // setSelectedDiagram(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (diagrams.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Project Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              {project.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {project.description}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 8px 16px -4px ${theme.palette.primary.main}40`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                boxShadow: `0 12px 20px -4px ${theme.palette.primary.main}60`,
              }
            }}
          >
            Create Diagram
          </Button>
        </Box>

        {/* Empty State */}
        <Paper sx={{ p: 4 }}>
          <EmptyState
            type="diagrams"
            title="No Diagrams Yet"
            description="Get started by creating your first diagram. Simply describe what you want,
                       and our AI will generate beautiful visualizations for you in seconds."
            buttonText="Create Your First Diagram"
            onAction={() => setOpenDialog(true)}
          />
        </Paper>
                  {/* Updated Dialog with new steps */}
                  <Dialog
            open={openDialog}
            onClose={() => {
              setOpenDialog(false);
              handleReset();
            }}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Create New Diagram
              <Typography variant="body2" color="text.secondary">
                Follow these steps to create your diagram
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Stepper activeStep={activeStep} orientation="vertical">
                <Step>
                  <StepLabel>Choose Generation Type</StepLabel>
                  <StepContent>{getStepContent(0)}</StepContent>
                </Step>
                <Step>
                  <StepLabel>Select Diagram Type</StepLabel>
                  <StepContent>{getStepContent(1)}</StepContent>
                </Step>
                <Step>
                  <StepLabel>Enter Details</StepLabel>
                  <StepContent>{getStepContent(2)}</StepContent>
                </Step>
              </Stepper>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              {activeStep === 2 ? (
                <Button
                  variant="contained"
                  onClick={handleGenerateDiagram}
                  disabled={!prompt.trim() || generating}
                  startIcon={generating ? <CircularProgress size={20} /> : null}
                >
                  {generating ? 'Generating...' : 'Generate Diagram'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && !generationType) ||
                    (activeStep === 1 && !diagramType)
                  }
                >
                  Continue
                </Button>
              )}
            </DialogActions>
          </Dialog>

          {/* Preview Dialog */}
          <Dialog
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Preview</Typography>
                <IconButton onClick={() => setPreviewOpen(false)} size="small">
                  <Trash2 size={18} />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedDiagram && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                  <Box
                    component="img"
                    src={selectedDiagram.url}
                    alt={selectedDiagram.prompt}
                    sx={{
                      width: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                      bgcolor: 'background.paper',
                    }}
                  />
                  <Typography variant="body1">{selectedDiagram.prompt}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={`Type: ${selectedDiagram.type}`} variant="outlined" />
                    <Chip label={`Status: ${selectedDiagram.status}`} color="success" />
                    <Chip 
                      label={new Date(selectedDiagram.created_at).toLocaleDateString()} 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleDownload(selectedDiagram?.url)}
                startIcon={<Download />}
                variant="contained"
              >
                Download
              </Button>
            </DialogActions>
          </Dialog>
      </Container>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          component={motion.div}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="visible"
          sx={{ py: 4 }}
        >
          {/* Header */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {project?.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Diagrams ({diagrams.length})
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={() => setOpenDialog(true)}
                sx={{ 
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
              >
                Generate Diagram
              </Button>
            </Box>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Filter size={20} />
            <ToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={handleStatusFilterChange}
              size="small"
            >
              <ToggleButton value="all">
                All
              </ToggleButton>
              <ToggleButton 
                value="completed"
                sx={{ 
                  '&.Mui-selected': { 
                    color: 'success.main',
                    borderColor: 'success.main',
                    '&:hover': { borderColor: 'success.main' }
                  }
                }}
              >
                <CheckCircle size={16} style={{ marginRight: 4 }} />
                Success
              </ToggleButton>
              <ToggleButton 
                value="failed"
                sx={{ 
                  '&.Mui-selected': { 
                    color: 'error.main',
                    borderColor: 'error.main',
                    '&:hover': { borderColor: 'error.main' }
                  }
                }}
              >
                <XCircle size={16} style={{ marginRight: 4 }} />
                Failed
              </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              value={typeFilter}
              exclusive
              onChange={handleTypeFilterChange}
              size="small"
            >
              <ToggleButton value="all">
                All Types
              </ToggleButton>
              <ToggleButton value="image">
                <ImageIcon size={16} style={{ marginRight: 4 }} />
                Image
              </ToggleButton>
              <ToggleButton value="gif">
                <Film size={16} style={{ marginRight: 4 }} />
                GIF
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Diagrams Grid */}
          <Grid container spacing={3}>
            {diagrams.map((diagram) => (
              <Grid item xs={12} sm={6} md={4} key={diagram._id}>
                <Card
                  component={motion.div}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'relative',
                      paddingTop: '75%', // 4:3 aspect ratio
                      backgroundColor: 'grey.100',
                      cursor: diagram.url ? 'pointer' : 'default',
                    }}
                    onClick={() => diagram.url && handleViewDetails(diagram)}
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
                      <>
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
                            objectFit: 'contain',
                            padding: 1,
                            bgcolor: 'background.paper',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            '.MuiCard-root:hover &': {
                              opacity: 1,
                            },
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(diagram);
                            }}
                            sx={{ 
                              bgcolor: 'background.paper',
                              '&:hover': { bgcolor: 'background.default' },
                            }}
                          >
                            <Maximize2 size={16} />
                          </IconButton>
                        </Box>
                      </>
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
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        size="small"
                        label={diagram.status}
                        color={diagram.status === 'completed' ? 'success' : 'default'}
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        size="small"
                        label={diagram.type}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(diagram.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {diagram.prompt}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                    {diagram.status === 'completed' && (
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(diagram.url);
                          }}
                        >
                          <Download size={18} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {diagram.status === 'processing' && (
                      <Tooltip title="Processing">
                        <IconButton size="small" disabled>
                          <RefreshCw size={18} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDiagram(diagram._id);
                        }}
                        color="error"
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Updated Dialog with new steps */}
          <Dialog
            open={openDialog}
            onClose={() => {
              setOpenDialog(false);
              handleReset();
            }}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Create New Diagram
              <Typography variant="body2" color="text.secondary">
                Follow these steps to create your diagram
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Stepper activeStep={activeStep} orientation="vertical">
                <Step>
                  <StepLabel>Choose Generation Type</StepLabel>
                  <StepContent>{getStepContent(0)}</StepContent>
                </Step>
                <Step>
                  <StepLabel>Select Diagram Type</StepLabel>
                  <StepContent>{getStepContent(1)}</StepContent>
                </Step>
                <Step>
                  <StepLabel>Enter Details</StepLabel>
                  <StepContent>{getStepContent(2)}</StepContent>
                </Step>
              </Stepper>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              {activeStep === 2 ? (
                <Button
                  variant="contained"
                  onClick={handleGenerateDiagram}
                  disabled={!prompt.trim() || generating}
                  startIcon={generating ? <CircularProgress size={20} /> : null}
                >
                  {generating ? 'Generating...' : 'Generate Diagram'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && !generationType) ||
                    (activeStep === 1 && !diagramType)
                  }
                >
                  Continue
                </Button>
              )}
            </DialogActions>
          </Dialog>

          {/* Preview Dialog */}
          <Dialog
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Preview</Typography>
                <IconButton onClick={() => setPreviewOpen(false)} size="small">
                  <Trash2 size={18} />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedDiagram && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                  <Box
                    component="img"
                    src={selectedDiagram.url}
                    alt={selectedDiagram.prompt}
                    sx={{
                      width: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                      bgcolor: 'background.paper',
                    }}
                  />
                  <Typography variant="body1">{selectedDiagram.prompt}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={`Type: ${selectedDiagram.type}`} variant="outlined" />
                    <Chip label={`Status: ${selectedDiagram.status}`} color="success" />
                    <Chip 
                      label={new Date(selectedDiagram.created_at).toLocaleDateString()} 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleDownload(selectedDiagram?.url)}
                startIcon={<Download />}
                variant="contained"
              >
                Download
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
