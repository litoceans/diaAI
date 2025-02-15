'use client';

import { Inter } from 'next/font/google';
import ThemeRegistry from '../components/ThemeRegistry';
import { AuthProvider } from '../context/AuthContext';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import { CreditsProvider } from '../context/CreditsContext';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

function RootLayoutContent({ children }) {
  return children;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <AdminAuthProvider>
            <CreditsProvider>
              <ThemeRegistry>
                <RootLayoutContent>{children}</RootLayoutContent>
              </ThemeRegistry>
            </CreditsProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
