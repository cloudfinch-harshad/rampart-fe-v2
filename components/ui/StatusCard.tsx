'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface StatusCardProps {
  count: number;
  label: string;
  color: 'red' | 'yellow' | 'blue' | 'green' | 'purple';
  className?: string;
}

const colorMap = {
  red: {
    bg: 'bg-red-50',
    border: 'border-red-100',
    text: 'text-red-600',
    dot: 'bg-red-500'
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
    text: 'text-yellow-600',
    dot: 'bg-yellow-500'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-600',
    dot: 'bg-blue-500'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-100',
    text: 'text-green-600',
    dot: 'bg-green-500'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    text: 'text-purple-600',
    dot: 'bg-purple-500'
  }
};

export function StatusCard({ count, label, color, className }: StatusCardProps) {
  const colors = colorMap[color];
  
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-2 rounded-md',
      colors.bg,
      className
    )}>
      <div className="flex items-center justify-center">
        <span className={cn('text-2xl font-bold', colors.text)}>{count}</span>
      </div>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

interface StatusGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function StatusGroup({ title, children, className }: StatusGroupProps) {
  return (
    <div className={cn('mb-8', className)}>
      <h2 className="text-sm font-medium text-gray-700 mb-3">{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {children}
      </div>
    </div>
  );
}
