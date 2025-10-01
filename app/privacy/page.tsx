'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
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
          
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <h2>1. Introduction</h2>
            <p>
              At Cloudfinch, we respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>
            
            <h2>2. Information We Collect</h2>
            <p>
              We may collect several types of information from and about users of our website, including:
            </p>
            <ul>
              <li>Personal identifiers such as name, email address, and phone number</li>
              <li>Company information</li>
              <li>Usage data and analytics</li>
              <li>Device and browser information</li>
            </ul>
            
            <h2>3. How We Collect Information</h2>
            <p>
              We collect information directly from you when you:
            </p>
            <ul>
              <li>Register for an account</li>
              <li>Use our services</li>
              <li>Fill out forms on our website</li>
              <li>Correspond with us</li>
            </ul>
            <p>
              We also collect information automatically as you navigate through our website using cookies and similar technologies.
            </p>
            
            <h2>4. How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including:
            </p>
            <ul>
              <li>Providing and maintaining our services</li>
              <li>Personalizing your experience</li>
              <li>Improving our website and services</li>
              <li>Communicating with you</li>
              <li>Protecting our rights and interests</li>
            </ul>
            
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information.
              However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2>6. Data Retention</h2>
            <p>
              We will retain your personal information only for as long as necessary to fulfill the purposes for which we collected it, including to satisfy any legal, regulatory, accounting, or reporting requirements.
            </p>
            
            <h2>7. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
            </ul>
            
            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@cloudfinch.com.
            </p>
            
            <p className="mt-6">Last Updated: October 1, 2025</p>
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
