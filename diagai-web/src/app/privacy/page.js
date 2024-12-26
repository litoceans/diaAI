'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function PrivacyPolicy() {
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
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ py: 4 }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<ChevronRight size={16} />}
          sx={{ mb: 4 }}
        >
          <Link href="/" color="inherit">
            Home
          </Link>
          <Typography color="text.primary">Privacy Policy</Typography>
        </Breadcrumbs>

        <Paper
          component={motion.div}
          variants={itemVariants}
          sx={{ p: 4 }}
        >
          <Typography variant="h4" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Last updated: December 23, 2023
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              1. Introduction
            </Typography>
            <Typography paragraph>
              Welcome to DiaAI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              2. Data We Collect
            </Typography>
            <Typography paragraph>
              We collect several different types of information for various purposes:
            </Typography>
            <ul>
              <Typography component="li" paragraph>
                Personal identification information (Name, email address, phone number)
              </Typography>
              <Typography component="li" paragraph>
                Usage data (How you use our website and services)
              </Typography>
              <Typography component="li" paragraph>
                Generated content (Diagrams and images you create)
              </Typography>
              <Typography component="li" paragraph>
                Technical data (IP address, browser type, device information)
              </Typography>
            </ul>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              3. How We Use Your Data
            </Typography>
            <Typography paragraph>
              We use your data for the following purposes:
            </Typography>
            <ul>
              <Typography component="li" paragraph>
                To provide and maintain our service
              </Typography>
              <Typography component="li" paragraph>
                To notify you about changes to our service
              </Typography>
              <Typography component="li" paragraph>
                To provide customer support
              </Typography>
              <Typography component="li" paragraph>
                To gather analysis or valuable information to improve our service
              </Typography>
            </ul>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              4. Data Storage and Security
            </Typography>
            <Typography paragraph>
              We implement appropriate technical and organizational measures to maintain the security of your personal information, including but not limited to encryption, firewalls, and secure socket layer technology.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              5. Your Rights
            </Typography>
            <Typography paragraph>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data:
            </Typography>
            <ul>
              <Typography component="li" paragraph>
                The right to access your personal data
              </Typography>
              <Typography component="li" paragraph>
                The right to rectification of your personal data
              </Typography>
              <Typography component="li" paragraph>
                The right to erasure of your personal data
              </Typography>
              <Typography component="li" paragraph>
                The right to restrict processing of your personal data
              </Typography>
              <Typography component="li" paragraph>
                The right to data portability
              </Typography>
            </ul>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              6. Cookies
            </Typography>
            <Typography paragraph>
              We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              7. Third-Party Services
            </Typography>
            <Typography paragraph>
              We may employ third party companies and individuals to facilitate our service, provide service on our behalf, perform service-related services, or assist us in analyzing how our service is used.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              8. Changes to This Policy
            </Typography>
            <Typography paragraph>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              9. Contact Us
            </Typography>
            <Typography paragraph>
              If you have any questions about this Privacy Policy, please contact us:
            </Typography>
            <ul>
              <Typography component="li" paragraph>
                By email: privacy@diagai.com
              </Typography>
              <Typography component="li" paragraph>
                By visiting our website: www.diagai.com/contact
              </Typography>
            </ul>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
