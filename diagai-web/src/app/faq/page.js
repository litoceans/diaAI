'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Grid,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  Search,
  Image,
  Film,
  CreditCard,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react';

// FAQ categories and questions
const faqData = [
  {
    category: 'Getting Started',
    icon: <HelpCircle size={20} />,
    color: '#2196F3',
    questions: [
      {
        question: 'What is DiaAI?',
        answer: 'DiaAI is an AI-powered diagram generation tool that helps you create professional diagrams and flowcharts from text descriptions. Simply describe what you want, and our AI will generate it for you.',
      },
      {
        question: 'How do I get started with DiaAI?',
        answer: 'Getting started is easy! Just sign up for an account, choose your subscription plan, and start generating diagrams. You can begin with our free tier to explore the basic features.',
      },
      {
        question: 'Do I need any technical knowledge to use DiaAI?',
        answer: 'No technical knowledge is required! Our AI understands natural language, so you can describe your diagrams in plain English. We handle all the technical aspects of diagram creation.',
      },
    ],
  },
  {
    category: 'Images & GIFs',
    icon: <Image size={20} />,
    color: '#34C759',
    questions: [
      {
        question: 'What types of diagrams can I create?',
        answer: 'You can create flowcharts, sequence diagrams, architecture diagrams, mind maps, organizational charts, and more. Our AI adapts to your needs and can generate various diagram styles.',
      },
      {
        question: 'Can I edit the generated diagrams?',
        answer: 'Yes! All generated diagrams are fully editable. You can modify colors, layouts, text, and other elements using our intuitive editor.',
      },
      {
        question: 'What file formats are supported for export?',
        answer: 'We support exports in PNG, SVG, and PDF formats for static diagrams. For animated diagrams, you can export as GIF or MP4.',
      },
    ],
  },
  {
    category: 'Subscription & Billing',
    icon: <CreditCard size={20} />,
    color: '#03A9F4',
    questions: [
      {
        question: 'What subscription plans are available?',
        answer: 'We offer Free, Pro, and Enterprise plans. Each plan comes with different features and generation credits. Check our pricing page for detailed information.',
      },
      {
        question: 'How do credits work?',
        answer: 'Credits are used for generating diagrams. Each diagram generation costs a certain number of credits depending on complexity. Credits are refreshed monthly on paid plans.',
      },
      {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.',
      },
    ],
  },
  {
    category: 'Collaboration',
    icon: <Users size={20} />,
    color: '#FFC107',
    questions: [
      {
        question: 'Can I share my diagrams with others?',
        answer: 'Yes! You can share diagrams by generating a public link or inviting team members directly. You can also control viewing and editing permissions.',
      },
      {
        question: 'How does team collaboration work?',
        answer: 'Team members can collaborate in real-time on diagrams. Changes are synced instantly, and you can track revision history to see who made what changes.',
      },
      {
        question: 'Is there a limit to team size?',
        answer: 'Team size limits depend on your subscription plan. Free plans support up to 3 members, Pro plans up to 10, and Enterprise plans have unlimited team members.',
      },
    ],
  },
  {
    category: 'Technical',
    icon: <Settings size={20} />,
    color: '#FF9800',
    questions: [
      {
        question: 'What browsers are supported?',
        answer: 'DiaAI works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.',
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes! We use industry-standard encryption and security practices. Your data is stored securely and backed up regularly. We never share your data with third parties.',
      },
      {
        question: 'Can I integrate DiaAI with other tools?',
        answer: 'Yes, we offer API access for Pro and Enterprise plans. You can integrate DiaAI with your existing tools and workflows using our REST API.',
      },
    ],
  },
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
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

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter(category => 
    selectedCategory === 'all' || category.category.toLowerCase() === selectedCategory.toLowerCase()
  ).map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ py: 8 }}
      >
        {/* Breadcrumbs */}
        <motion.div variants={fadeInUp}>
          <Breadcrumbs
            separator={<ChevronRight size={16} />}
            sx={{ mb: 4 }}
          >
            <Link href="/" color="inherit" sx={{ textDecoration: 'none' }}>
              Home
            </Link>
            <Typography color="text.primary">FAQ</Typography>
          </Breadcrumbs>
        </motion.div>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div variants={fadeInUp}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{ 
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
              color="text.secondary"
              sx={{ 
                maxWidth: 'sm', 
                mx: 'auto',
                opacity: 0.9,
                lineHeight: 1.6,
              }}
            >
              Find answers to common questions about DiaAI
            </Typography>
          </motion.div>
        </Box>

        {/* Search */}
        <motion.div variants={fadeInUp}>
          <Paper
            elevation={0}
            sx={{ 
              p: 2, 
              mb: 4,
              background: 'rgba(33, 150, 243, 0.05)',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                }
              }}
            />
          </Paper>
        </motion.div>

        {/* Categories */}
        <motion.div variants={fadeInUp}>
          <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              onClick={() => setSelectedCategory('all')}
              sx={{
                backgroundColor: selectedCategory === 'all' ? 'primary.main' : 'transparent',
                color: selectedCategory === 'all' ? 'white' : 'text.primary',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: selectedCategory === 'all' ? 'primary.dark' : 'rgba(33, 150, 243, 0.05)',
                },
              }}
              variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
            />
            {faqData.map((category) => (
              <Chip
                key={category.category}
                label={category.category}
                icon={category.icon}
                onClick={() => setSelectedCategory(category.category.toLowerCase())}
                sx={{
                  backgroundColor: selectedCategory === category.category.toLowerCase() ? 'primary.main' : 'transparent',
                  color: selectedCategory === category.category.toLowerCase() ? 'white' : 'text.primary',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: selectedCategory === category.category.toLowerCase() 
                      ? 'primary.dark' 
                      : 'rgba(33, 150, 243, 0.05)',
                  },
                }}
                variant={selectedCategory === category.category.toLowerCase() ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </motion.div>

        {/* FAQ Accordions */}
        <AnimatePresence>
          {filteredFAQs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Paper
                sx={{ 
                  mb: 4,
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
                elevation={0}
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
                    {category.category}
                  </Typography>
                </Box>
                {category.questions.map((faq, index) => (
                  <Accordion
                    key={index}
                    expanded={expandedAccordion === `${categoryIndex}-${index}`}
                    onChange={() => setExpandedAccordion(expandedAccordion === `${categoryIndex}-${index}` ? false : `${categoryIndex}-${index}`)}
                    elevation={0}
                    sx={{
                      '&:before': { display: 'none' },
                      borderBottom: index < category.questions.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ChevronDown />}
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.05)' },
                      }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Container>
  );
}
