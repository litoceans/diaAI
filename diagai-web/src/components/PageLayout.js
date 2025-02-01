'use client';

import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const PageLayout = ({ children, maxWidth = 'lg', sx = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        p: {
          xs: 2,
          sm: 3,
          md: 4
        },
        ...sx
      }}
    >
      <Container 
        maxWidth={maxWidth}
        sx={{
          pt: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 4, sm: 5, md: 6 }
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default PageLayout;
