'use client';

import React from 'react';
import Image from 'next/image';
import image from '@/public/grc-platform.jpg';

/**
 * Banner component for authentication pages with blue background and company tagline
 */
export function AuthBanner() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-blue-600 flex-col justify-center text-white p-12 relative overflow-hidden">
      {/* Background Image with opacity */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image 
          src={image} 
          alt="GRC Platform" 
          fill 
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
      </div>
      
      {/* Blue overlay */}
      <div className="absolute inset-0 bg-blue-600/70 z-5"></div>
      
      {/* Background pattern (subtle grid) */}
      <div className="absolute inset-0 opacity-10 z-10">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '30px 30px'
        }} />
      </div>
      
      {/* Content - Left aligned as shown in the image */}
      <div className="z-20 relative">
        <h1 className="text-5xl font-bold mb-4">
          Drive Business Performance<br />and Resilience
        </h1>
        <p className="text-xl">
          Unified EHS, ESG and Audit Management Platform
        </p>
      </div>
    </div>
  );
}
