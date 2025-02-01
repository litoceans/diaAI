'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Slider,
  TextField,
  Tooltip,
  Divider,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Download,
  Share2,
  RefreshCw,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ImageEditor() {
  const params = useParams();
  const router = useRouter();
  const [frames, setFrames] = useState([
    { id: 1, imageUrl: '/placeholder-frame-1.png' },
    { id: 2, imageUrl: '/placeholder-frame-2.png' },
    { id: 3, imageUrl: '/placeholder-frame-3.png' },
  ]);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frameDelay, setFrameDelay] = useState(500);
  const [suggestions, setSuggestions] = useState([
    'Add more contrast to the diagram',
    'Simplify the connections',
    'Use a different color scheme',
  ]);
  const playbackRef = useRef(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFrameDelayChange = (event, newValue) => {
    setFrameDelay(newValue);
  };

  const handleAddFrame = () => {
    const newFrame = {
      id: Date.now(),
      imageUrl: '/placeholder-frame-new.png',
    };
    setFrames([...frames, newFrame]);
  };

  const handleDeleteFrame = (frameId) => {
    setFrames(frames.filter((frame) => frame.id !== frameId));
  };

  const handleRegenerate = () => {
    // Implement regeneration logic
    console.log('Regenerating diagram...');
  };

  const handleApplySuggestion = (suggestion) => {
    // Implement suggestion application logic
    console.log('Applying suggestion:', suggestion);
  };

  // Animation variants
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
    <ProtectedRoute>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant="h4">Image Editor</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Download size={20} />}
                onClick={() => console.log('Downloading...')}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share2 size={20} />}
                onClick={() => console.log('Sharing...')}
              >
                Share
              </Button>
              <Button
                variant="contained"
                startIcon={<RefreshCw size={20} />}
                onClick={handleRegenerate}
              >
                Regenerate
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Main Editor Area */}
            <Grid item xs={12} md={8}>
              <Paper
                component={motion.div}
                variants={itemVariants}
                sx={{ p: 3, height: '100%' }}
              >
                {/* Preview Area */}
                <Box
                  sx={{
                    height: 400,
                    bgcolor: 'grey.100',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {frames[selectedFrame]?.imageUrl ? (
                    <img
                      src={frames[selectedFrame].imageUrl}
                      alt={`Frame ${selectedFrame + 1}`}
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No frame selected
                    </Typography>
                  )}
                </Box>

                {/* Frame Controls */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Frame Delay (ms)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                      onClick={handlePlayPause}
                      color={isPlaying ? 'primary' : 'default'}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </IconButton>
                    <Slider
                      value={frameDelay}
                      onChange={handleFrameDelayChange}
                      min={100}
                      max={2000}
                      step={100}
                      valueLabelDisplay="auto"
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </Box>

                {/* Frames Timeline */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    pb: 2,
                  }}
                >
                  {frames.map((frame, index) => (
                    <Paper
                      key={frame.id}
                      sx={{
                        width: 100,
                        height: 100,
                        flexShrink: 0,
                        position: 'relative',
                        cursor: 'pointer',
                        border: index === selectedFrame ? '2px solid' : 'none',
                        borderColor: 'primary.main',
                      }}
                      onClick={() => setSelectedFrame(index)}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          borderRadius: '50%',
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFrame(frame.id);
                          }}
                          sx={{ color: 'white' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                      <img
                        src={frame.imageUrl}
                        alt={`Frame ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Paper>
                  ))}
                  <Paper
                    sx={{
                      width: 100,
                      height: 100,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={handleAddFrame}
                  >
                    <Plus size={24} />
                  </Paper>
                </Box>
              </Paper>
            </Grid>

            {/* Suggestions Panel */}
            <Grid item xs={12} md={4}>
              <Paper
                component={motion.div}
                variants={itemVariants}
                sx={{ p: 3, height: '100%' }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  AI Suggestions
                </Typography>
                <Stack spacing={2}>
                  {suggestions.map((suggestion, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => handleApplySuggestion(suggestion)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Wand2 size={16} />
                        <Typography variant="body2">{suggestion}</Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
