'use client';

import { useState } from 'react';
import { Pencil, Check } from 'lucide-react';

interface BrsrItemProps {
  sequenceNumber: number;
  requirement: string;
  response: string;
  notes: string;
}

export function BrsrComplianceItem({ sequenceNumber, requirement, response, notes }: BrsrItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 text-center">{sequenceNumber}</td>
      <td className="py-3 px-4">{requirement}</td>
      <td className="py-3 px-4">
        {response || (
          <span className="text-gray-400 text-sm">
            {isEditing ? 'Editing...' : 'Click to add data...'}
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        {notes || (
          <span className="text-gray-400 text-sm">
            {isEditing ? 'Editing...' : 'Click to add notes...'}
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 rounded-full hover:bg-blue-50 text-blue-500 mr-2"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button 
          className="p-1 rounded-full hover:bg-red-50 text-red-500"
        >
          <Check className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
