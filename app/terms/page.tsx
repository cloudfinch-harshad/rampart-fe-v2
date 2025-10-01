'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/login" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Cloudfinch. These Terms of Service govern your use of our website and services.
              By accessing or using our services, you agree to be bound by these Terms.
            </p>
            
            <h2>2. Definitions</h2>
            <p>
              "Service" refers to the website, application, and services provided by Cloudfinch.
              "User" refers to any individual or entity that uses our Service.
              "Content" refers to any information, data, text, or other materials that appear on or are uploaded to the Service.
            </p>
            
            <h2>3. Account Registration</h2>
            <p>
              To use certain features of the Service, you may be required to register for an account.
              You agree to provide accurate, current, and complete information during the registration process.
              You are responsible for safeguarding your account credentials and for all activities that occur under your account.
            </p>
            
            <h2>4. User Conduct</h2>
            <p>
              You agree not to use the Service for any illegal or unauthorized purpose.
              You agree not to violate any laws in your jurisdiction.
              You agree not to post or transmit any content that is harmful, offensive, or otherwise objectionable.
            </p>
            
            <h2>5. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by Cloudfinch and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            
            <h2>6. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            
            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall Cloudfinch, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
            
            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@cloudfinch.com.
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
