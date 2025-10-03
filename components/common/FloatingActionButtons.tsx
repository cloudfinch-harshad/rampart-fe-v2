'use client';

import React, { useState } from 'react';
import { MessageSquare, Download, X, Send } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

interface FloatingActionButtonsProps {
  payload: Record<string, any>;
}

export function FloatingActionButtons({ payload }: FloatingActionButtonsProps) {
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [question, setQuestion] = useState('');

  // Function to handle file download
  const handleDownload = async (format: 'XBRL' | 'Excel' | 'Word' | 'PDF') => {
    try {
      // Only call the API for Excel format
      if (format === 'Excel') {
        toast.loading(`Preparing ${format} download...`);
        
        // Call the API with the same payload used for fetching the listing
        // Include format in the payload
        
        // Make API request expecting a JSON response with a download link
        const response = await apiService.request<{ success: boolean; message: string }>({
          url: 'download-brsr-report',
          method: 'POST',
          data:  payload
        });
        
        // Check if the response contains a download link
        if (response.success && response.message) {
          // The message contains the S3 download link
          const downloadLink = response.message;
          
          // Open the download link in a new tab or trigger download
          window.open(downloadLink, '_blank');
          
          toast.dismiss();
          toast.success(`${format} download initiated`);
        } else {
          // Handle error case
          toast.dismiss();
          toast.error(`Failed to generate ${format} download: ${response.message || 'Unknown error'}`);
        }
      } else {
        // For other formats, just show a toast notification
        toast.info(`${format} download feature coming soon`);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(`Failed to download ${format}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Download error:', error);
    }
  };

  return (
    <>
      {/* Floating action buttons at the bottom right */}
      <div className="fixed bottom-10 right-0 flex flex-col gap-4 z-50">
        {/* Download Button with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-l-full w-16 h-14 shadow-lg transition-all duration-200 flex items-center justify-center"
              aria-label="Download Report"
            >
              <div className="flex flex-col items-center">
                <Download className="h-5 w-5" />
                <div className="h-px w-6 bg-white mt-1"></div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white rounded-md shadow-md mt-2 p-0">

            <div className="py-2">
              <DropdownMenuItem className="px-6 py-2" onClick={() => handleDownload('XBRL')}>
                XBRL
              </DropdownMenuItem>
              <DropdownMenuItem className="px-6 py-2" onClick={() => handleDownload('Excel')}>
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem className="px-6 py-2" onClick={() => handleDownload('Word')}>
                Word
              </DropdownMenuItem>
              <DropdownMenuItem className="px-6 py-2" onClick={() => handleDownload('PDF')}>
                PDF
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* AI Compliance Assistant Button */}
        <button
          onClick={() => setAiDialogOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-l-full w-16 h-14 shadow-lg transition-all duration-200 flex items-center justify-center"
          aria-label="AI Compliance Assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>
      
      {/* AI Compliance Assistant Dialog - Custom positioned */}
      <div 
        className={`fixed bottom-14 right-20 z-50 bg-white rounded-lg shadow-lg w-[400px] overflow-hidden transition-all duration-300 transform ${aiDialogOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}`}
      >
          {/* Custom dialog content without using DialogContent */}
          {/* Custom Dialog Header */}
          <div className="bg-blue-500 text-white p-4 relative">
            <h2 className="text-xl font-semibold">AI Compliance Assistant</h2>
            <button 
              onClick={() => setAiDialogOpen(false)} 
              className="absolute right-4 top-4 text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          
          <div className="flex flex-col gap-4 p-4">
            {/* AI Message */}
            <div className="flex gap-3">
              <div className="bg-blue-500 rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div className="bg-gray-100 p-4 rounded-lg max-w-[80%]">
                <p>How can I help you with your BRSR compliance report today?</p>
              </div>
            </div>
            
            {/* AI Response */}
            <div className="flex gap-3">
              <div className="bg-blue-500 rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div className="bg-gray-100 p-4 rounded-lg max-w-[80%]">
                <p>I can help you understand BRSR requirements, suggest responses, and provide guidance on ESG reporting best practices.</p>
              </div>
            </div>
            
            {/* User Input */}
            <div className="flex gap-2 mt-4">
              <textarea
                className="flex-1 p-3 border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Type your question here..."
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 self-end flex items-center justify-center"
                disabled={!question.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
    </>
  
  );
}
