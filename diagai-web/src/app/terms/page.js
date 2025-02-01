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

export default function TermsAndConditions() {
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
          <Typography color="text.primary">Terms and Conditions</Typography>
        </Breadcrumbs>

        <Paper
          component={motion.div}
          variants={itemVariants}
          sx={{ p: 4 }}
        >
          <Typography variant="h4" gutterBottom>
            Terms and Conditions
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Last updated: December 23, 2023
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              1. Agreement to Terms
            </Typography>
            <Typography paragraph>
              By accessing or using DiaAI, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of the terms, then you may not access our service.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              2. Use License
            </Typography>
            <Typography paragraph>
              Permission is granted to temporarily use DiaAI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </Typography>
            <ul>
              <Typography component="li" paragraph>
                Modify or copy the materials
              </Typography>
              <Typography component="li" paragraph>
                Use the materials for any commercial purpose
              </Typography>
              <Typography component="li" paragraph>
                Attempt to decompile or reverse engineer any software contained in DiaAI
              </Typography>
              <Typography component="li" paragraph>
                Remove any copyright or other proprietary notations from the materials
              </Typography>
            </ul>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              3. User Accounts
            </Typography>
            <Typography paragraph>
              When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </Typography>
            <Typography paragraph>
              You are responsible for safeguarding the password and for all activities that occur under your account.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              4. Subscription and Payments
            </Typography>
            <Typography paragraph>
              Some parts of the service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (monthly/annually). Billing cycles are set on a monthly/annual basis.
            </Typography>
            <Typography paragraph>
              At the end of each billing period, your subscription will automatically renew under the exact same conditions unless you cancel it or we cancel it.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              5. Content and Services
            </Typography>
            <Typography paragraph>
              Our service allows you to create, post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content you generate using our service.
            </Typography>
            <Typography paragraph>
              We reserve the right to monitor and review all content generated through our service and to remove any content that violates these terms.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              6. Intellectual Property
            </Typography>
            <Typography paragraph>
              The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of DiaAI and its licensors.
            </Typography>
            <Typography paragraph>
              Our service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              7. Limitation of Liability
            </Typography>
            <Typography paragraph>
              In no event shall DiaAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              8. Termination
            </Typography>
            <Typography paragraph>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </Typography>
            <Typography paragraph>
              Upon termination, your right to use the service will immediately cease. If you wish to terminate your account, you may simply discontinue using the service.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              9. Changes
            </Typography>
            <Typography paragraph>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              10. Governing Law
            </Typography>
            <Typography paragraph>
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              11. Contact Us
            </Typography>
            <Typography paragraph>
              If you have any questions about these Terms, please contact us:
            </Typography>
            <ul>
              <Typography component="li" paragraph>
                By email: legal@diagai.com
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
