'use client';

import {
  Box,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Plus,
  FileImage,
  Wand2,
  FolderPlus,
} from 'lucide-react';

const EmptyState = ({ 
  title = 'No Items Yet',
  description = 'Get started by creating your first item.',
  buttonText = 'Create New',
  type = 'default', // 'default', 'projects', 'diagrams'
  onAction,
}) => {
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

  const iconAnimation = {
    hidden: { scale: 0.8, rotate: -10 },
    visible: { 
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: {
        duration: 0.3
      }
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'projects':
        return (
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
        );
      case 'diagrams':
        return (
          <Box
            sx={{
              width: 280,
              height: 280,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              position: 'relative'
            }}
          >
            {/* Main Icon */}
            <Box
              sx={{
                width: 200,
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(25, 118, 210, 0.08)' 
                  : 'rgba(25, 118, 210, 0.04)',
                borderRadius: 4,
                position: 'relative',
                zIndex: 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  borderRadius: 5,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  opacity: 0.2,
                }
              }}
            >
              <motion.div variants={iconAnimation}>
                <FileImage 
                  size={100}
                  style={{
                    strokeWidth: 1.5,
                    opacity: 0.9,
                    color: theme.palette.primary.main
                  }}
                />
              </motion.div>
            </Box>
            
            {/* Magic Wand Icon */}
            <Box
              component={motion.div}
              variants={iconAnimation}
              sx={{
                position: 'absolute',
                top: 40,
                right: 40,
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.palette.background.paper,
                borderRadius: '50%',
                boxShadow: theme.shadows[4],
                zIndex: 3
              }}
            >
              <Wand2 
                size={40}
                style={{
                  strokeWidth: 1.5,
                  color: theme.palette.secondary.main
                }}
              />
            </Box>
          </Box>
        );
      default:
        return null;
    }
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
      <motion.div 
        variants={itemVariants}
        whileHover="hover"
      >
        {getIcon()}
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
          {title}
        </Typography>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 4, 
            maxWidth: 500,
            lineHeight: 1.6
          }}
        >
          {description}
        </Typography>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Plus />}
          onClick={onAction}
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
          {buttonText}
        </Button>
      </motion.div>
    </Box>
  );
};

export default EmptyState;
