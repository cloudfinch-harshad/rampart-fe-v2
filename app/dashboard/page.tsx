'use client';

import React, { useState } from 'react';
import { StatusCard } from '@/components/ui/StatusCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Question {
  id: string;
  title: string;
  observation: string;
  recommendation: string;
  riskLevel: 'High' | 'Moderate' | 'Low';
}

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data for the dashboard
  const auditStatusData = [
    { count: 0, label: 'Evaluation', color: 'red' },
    { count: 0, label: 'Not Complied', color: 'red' },
    { count: 0, label: 'Not Applicable', color: 'yellow' },
    { count: 0, label: 'For Review', color: 'yellow' },
    { count: 2, label: 'Completed', color: 'green' },
  ];

  const riskStatusData = [
    { count: 0, label: 'High', color: 'red' },
    { count: 0, label: 'Moderate', color: 'yellow' },
    { count: 2, label: 'Low', color: 'green' },
  ];
  
  const userName = "James Mayert";

  // Sample data for the table
  const questions: Question[] = [
    {
      id: '1',
      title: 'Question 1',
      observation: 'Yes',
      recommendation: 'N/A',
      riskLevel: 'Low',
    },
    {
      id: '2',
      title: 'Question 2',
      observation: 'Yes',
      recommendation: 'N/A',
      riskLevel: 'Low',
    },
  ];

  // Define columns for the DataTable
  const columns = [
    {
      header: 'Title',
      accessorKey: 'title' as keyof Question,
    },
    {
      header: 'Observation',
      accessorKey: 'observation' as keyof Question,
    },
    {
      header: 'Recommendation',
      accessorKey: 'recommendation' as keyof Question,
    },
    {
      header: 'Risk Level',
      accessorKey: 'riskLevel' as keyof Question,
      cell: (item: Question) => {
        const color = item.riskLevel === 'High' ? 'red' : 
                     item.riskLevel === 'Moderate' ? 'yellow' : 'green';
        return (
          <div className="flex items-center justify-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
              {item.riskLevel}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex justify-end">
          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200">
            View
          </button>
        </div>
      ),
    },
  ] as any;
  
  return (
    <>
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-1">Welcome back, {userName} 👋</h1>
        <h2 className="text-base text-gray-600">My CAPAs</h2>
      </div>
      
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search" 
            className="w-full pl-9 h-8 bg-white border-gray-200 rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white p-3 rounded-md shadow-sm mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Audit Status</h3>
        <div className="grid grid-cols-5 gap-2">
          {auditStatusData.map((item, index) => (
            <StatusCard 
              key={index}
              count={item.count}
              label={item.label}
              color={item.color as any}
            />
          ))}
        </div>
      </div>
      
      <div className="bg-white p-3 rounded-md shadow-sm mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Risk Status</h3>
        <div className="grid grid-cols-3 gap-2">
          {riskStatusData.map((item, index) => (
            <StatusCard 
              key={index}
              count={item.count}
              label={item.label}
              color={item.color as any}
            />
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observation</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
              <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={question.id} className={index !== questions.length - 1 ? "border-b border-gray-200" : ""} >
                <td className="py-2 px-4 text-sm text-gray-900">{question.title}</td>
                <td className="py-2 px-4 text-sm text-gray-900">{question.observation}</td>
                <td className="py-2 px-4 text-sm text-gray-900">{question.recommendation}</td>
                <td className="py-2 px-4 text-sm">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${
                    question.riskLevel === 'High' ? 'text-red-600' : 
                    question.riskLevel === 'Moderate' ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {question.riskLevel}
                  </span>
                </td>
                <td className="py-2 px-4 text-sm text-right">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs hover:bg-blue-200">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex items-center justify-between p-3 text-xs border-t border-gray-200">
          <div className="text-gray-500">Total Count: {questions.length}</div>
          <div className="flex items-center gap-2">
            <div className="text-gray-500">10/page</div>
            <div className="flex">
              <button className="w-6 h-6 flex items-center justify-center rounded-md bg-blue-600 text-white text-xs">
                1
              </button>
              <button className="w-6 h-6 flex items-center justify-center text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
