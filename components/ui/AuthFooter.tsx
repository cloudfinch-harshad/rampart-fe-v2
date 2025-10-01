'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Footer component for authentication pages with terms and privacy links
 */
export function AuthFooter() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
      <div className="flex justify-center space-x-4">
        <Link href="/terms" className="hover:text-black hover:underline">
          Terms of Service
        </Link>
        <span>•</span>
        <Link href="/privacy" className="hover:text-black hover:underline">
          Privacy Policy
        </Link>
      </div>
      <div className="mt-2">
        © {new Date().getFullYear()} Cloudfinch. All rights reserved.
      </div>
    </div>
  );
}
