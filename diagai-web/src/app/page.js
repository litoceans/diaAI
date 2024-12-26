'use client';

import { Button, Container, Typography, Box, Paper, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Wand2, Sparkles, Zap, Code2, GitPullRequest, Workflow, ChevronRight, ChevronDown, HelpCircle, Settings, Users, Download } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6,
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
      ease: "easeOut"
    }
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export default function Home() {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ flex: 1 }}>
        {/* Hero Section */}
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: 4,
            py: 8,
          }}
        >
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <Typography
              variant="h1"
              sx={{ 
                mb: 2, 
                fontWeight: 'bold', 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: 'text.primary'
              }}
            >
              Transform Text into
              <Box 
                component="span" 
                sx={{ 
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '2px',
                    bottom: 0,
                    left: 0,
                    backgroundColor: '#2196F3',
                    transform: 'scaleX(0)',
                    transformOrigin: 'bottom right',
                    transition: 'transform 0.6s ease-out',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                    transformOrigin: 'bottom left',
                  },
                }}
              > Beautiful Diagrams</Box>
            </Typography>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ 
                mb: 4, 
                maxWidth: 'sm', 
                mx: 'auto',
                opacity: 0.9,
                lineHeight: 1.6,
              }}
            >
              Create stunning diagrams and animated GIFs from text descriptions using AI.
              Perfect for documentation, presentations, and technical communication.
            </Typography>
          </motion.div>

          <motion.div 
            variants={scaleUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                component={Link}
                href={user ? '/dashboard' : '/auth/login'}
                variant="contained"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              <Button
                component={Link}
                href="#how-it-works"
                variant="outlined"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    background: 'rgba(33, 150, 243, 0.05)',
                  }
                }}
              >
                Learn More
              </Button>
            </Box>
          </motion.div>
        </Box>

        {/* Features Section */}
        <Box
          id="features"
          component={motion.div}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          sx={{ py: 8 }}
        >
          <motion.div variants={fadeInUp}>
            <Typography
              variant="h2"
              align="center"
              sx={{ 
                mb: 6, 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Powerful Features
            </Typography>
          </motion.div>

          <Grid container spacing={4} alignItems="stretch">
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={feature.title} sx={{ display: 'flex' }}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                  style={{ display: 'flex', width: '100%' }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        transform: 'translateY(-4px)',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'rotate(360deg)',
                        }
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2,
                        fontWeight: 600,
                        color: 'primary.main'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ flex: 1 }}
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* How It Works Section */}
        <Box
          id="how-it-works"
          component={motion.div}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          sx={{ py: 8 }}
        >
          <motion.div variants={fadeInUp}>
            <Typography
              variant="h2"
              align="center"
              sx={{ 
                mb: 6, 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              How It Works
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                    gap: 4,
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography
                      variant="overline"
                      sx={{ 
                        color: 'primary.main', 
                        fontWeight: 'bold',
                        letterSpacing: 2,
                      }}
                    >
                      Step {index + 1}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 2,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.7,
                        opacity: 0.9
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {step.image}
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* FAQ Section */}
        <Box
          id="faq"
          component={motion.div}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          sx={{ py: 8 }}
        >
          <motion.div variants={fadeInUp}>
            <Typography
              variant="h2"
              align="center"
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Frequently Asked Questions
            </Typography>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              sx={{ 
                mb: 6,
                maxWidth: 'sm',
                mx: 'auto',
                opacity: 0.9,
                lineHeight: 1.6,
              }}
            >
              Get quick answers to common questions about DiaAI
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {commonQuestions.map((category, categoryIndex) => (
              <Grid item xs={12} md={6} key={category.title}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <Paper
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      overflow: 'hidden',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        background: 'rgba(33, 150, 243, 0.05)',
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          color: 'white',
                          display: 'flex',
                        }}
                      >
                        {category.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {category.title}
                      </Typography>
                    </Box>
                    {category.questions.map((faq, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 3,
                          borderBottom: index < category.questions.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.05)',
                          }
                        }}
                      >
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            mb: 1,
                            fontWeight: 500,
                            color: 'text.primary'
                          }}
                        >
                          {faq.question}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            lineHeight: 1.7,
                            opacity: 0.9
                          }}
                        >
                          {faq.answer}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <motion.div 
            variants={scaleUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box 
              sx={{ 
                mt: 6, 
                textAlign: 'center' 
              }}
            >
              <Button
                component={Link}
                href="/faq"
                variant="outlined"
                size="large"
                endIcon={<ChevronRight />}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    background: 'rgba(33, 150, 243, 0.05)',
                  }
                }}
              >
                View All FAQs
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}

const features = [
  {
    title: 'AI-Powered Generation',
    description: 'Advanced AI understands your text descriptions and generates accurate, professional diagrams.',
    icon: <Wand2 size={32} />,
  },
  {
    title: 'Animated GIFs',
    description: 'Create step-by-step animated diagrams perfect for tutorials and presentations.',
    icon: <Sparkles size={32} />,
  },
  {
    title: 'Instant Results',
    description: 'Get your diagrams in seconds, with options to customize and refine the output.',
    icon: <Zap size={32} />,
  },
];

const steps = [
  {
    title: 'Write Your Description',
    description: 'Simply describe what you want to visualize in plain text. Our AI understands natural language and technical terms.',
    image: <Code2 size={64} color="#2563eb" />,
  },
  {
    title: 'AI Generates Diagram',
    description: 'Our advanced AI processes your description and generates a professional, clear diagram that matches your needs.',
    image: <GitPullRequest size={64} color="#2563eb" />,
  },
  {
    title: 'Customize & Export',
    description: 'Fine-tune your diagram, add animations if needed, and export in various formats including GIF and static images.',
    image: <Workflow size={64} color="#2563eb" />,
  },
];

const commonQuestions = [
  {
    title: 'Getting Started',
    icon: <HelpCircle size={20} />,
    questions: [
      {
        question: 'What is DiaAI?',
        answer: 'DiaAI is an AI-powered diagram generation tool that helps you create professional diagrams from text descriptions.',
      },
      {
        question: 'How do I get started?',
        answer: 'Simply sign up for an account, choose your plan, and start generating diagrams with natural language descriptions.',
      },
    ],
  },
  {
    title: 'Features & Usage',
    icon: <Settings size={20} />,
    questions: [
      {
        question: 'What types of diagrams can I create?',
        answer: 'Create flowcharts, sequence diagrams, architecture diagrams, mind maps, ERDs, and more using simple text descriptions.',
      },
      {
        question: 'Can I customize the generated diagrams?',
        answer: 'Yes! Edit colors, layouts, text, and other elements using our intuitive editor after generation.',
      },
    ],
  },
  {
    title: 'Collaboration',
    icon: <Users size={20} />,
    questions: [
      {
        question: 'Can I share diagrams with my team?',
        answer: 'Yes, easily share diagrams via public links or invite team members with specific viewing/editing permissions.',
      },
      {
        question: 'How does team collaboration work?',
        answer: 'Collaborate in real-time with team members, track changes, and maintain version history.',
      },
    ],
  },
  {
    title: 'Export & Integration',
    icon: <Download size={20} />,
    questions: [
      {
        question: 'What export formats are supported?',
        answer: 'Export diagrams as PNG, SVG, or PDF for static images, and GIF or MP4 for animated sequences.',
      },
      {
        question: 'Can I integrate DiaAI with other tools?',
        answer: 'Yes, use our REST API (available on Pro/Enterprise plans) to integrate with your existing tools.',
      },
    ],
  },
];
