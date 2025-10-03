'use client';

import { BrsrCompliance } from '@/components/views/gri/compliance-hub/brsr/BrsrCompliance';
import { VendorManagement } from '@/components/views/gri/compliance-hub/vendors/VendorManagement';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ClipboardCheck, Users } from 'lucide-react';

export default function ComplianceHubPage() {
  const [mode, setMode] = useState<'compliance' | 'vendor'>('compliance');
  
  const handleModeChange = (value: string) => {
    setMode(value as 'compliance' | 'vendor');
  };
  
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{mode === 'compliance' ? 'SEBI BRSR Compliance' : 'Vendor Management'}</h1>
        <ToggleGroup 
          type="single" 
          value={mode} 
          onValueChange={handleModeChange}
          className="border border-input bg-background"
        >
          <ToggleGroupItem value="compliance" aria-label="Compliance Mode">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Compliance
          </ToggleGroupItem>
          <ToggleGroupItem value="vendor" aria-label="Vendor Mode">
            <Users className="h-4 w-4 mr-2" />
            Vendor
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {mode === 'compliance' ? (
        <BrsrCompliance isComplianceMode={true} />
      ) : (
        <VendorManagement />
      )}
    </div>
  );
}
