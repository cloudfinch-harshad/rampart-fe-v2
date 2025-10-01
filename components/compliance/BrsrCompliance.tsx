'use client';

import { BrsrComplianceSection } from './BrsrComplianceSection';

interface BrsrItem {
  brsrMasterId: string;
  sequenceNumber: number;
  requirement: string;
  brsrItemId: string | null;
  response: string;
  notes: string;
  vendorId: string | null;
}

interface BrsrSection {
  sectionId: string;
  sectionName: string | null;
  description: string | null;
  getBrsrItemResponseList: BrsrItem[];
}

interface BrsrComplianceProps {
  data: {
    success: boolean;
    message: string;
    vendorId: string | null;
    vendorName: string;
    accessCode: string;
    deadlineDate: string | null;
    completionStatus: string;
    submittedDate: string | null;
    vendorEmail: string;
    organizationName: string;
    getBrsrSectionResponseList: BrsrSection[];
  };
}

export function BrsrCompliance({ data }: BrsrComplianceProps) {
  // Calculate overall completion percentage
  const totalItems = data.getBrsrSectionResponseList.reduce(
    (acc, section) => acc + section.getBrsrItemResponseList.length, 
    0
  );
  
  const completedItems = data.getBrsrSectionResponseList.reduce(
    (acc, section) => acc + section.getBrsrItemResponseList.filter(
      item => item.response && item.response.trim() !== ''
    ).length, 
    0
  );
  
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6 h-full overflow-y-auto pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">BRSR Compliance</h1>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Compliance Mode
        </div>
      </div>
      
      {/* Overall Progress */}
      <div className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{completionPercentage}%</span>
          </div>
          <svg className="h-20 w-20" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray={`${completionPercentage}, 100`}
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Section A: General Disclosures</h2>
          <p className="text-sm text-gray-500">Complete all sections to finish your compliance report</p>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mt-8 uppercase">Compliance Sections</h2>
      
      {/* Sections */}
      {data.getBrsrSectionResponseList.map((section, index) => (
        <BrsrComplianceSection
          key={section.sectionId}
          sectionId={section.sectionId}
          sectionName={section.sectionName}
          sectionNumber={index + 1}
          description={section.description}
          items={section.getBrsrItemResponseList}
        />
      ))}
    </div>
  );
}
