import React from 'react';
import { MOCK_SCHOOLS } from '../constants';

interface SchoolSelectorProps {
  selectedSchoolId: string;
  onSchoolChange: (schoolId: string) => void;
  showAll?: boolean;
  disabled?: boolean;
}

const SchoolSelector: React.FC<SchoolSelectorProps> = ({ selectedSchoolId, onSchoolChange, showAll = true, disabled = false }) => {
  return (
    <div className="relative">
      <select
        value={selectedSchoolId}
        onChange={(e) => onSchoolChange(e.target.value)}
        disabled={disabled}
        className="appearance-none bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 pr-12 text-sm font-bold text-brand-dark focus:outline-none focus:border-brand-yellow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      >
        {showAll && <option value="all">🏫 Todas as Escolas</option>}
        {MOCK_SCHOOLS.map((school) => (
          <option key={school.id} value={school.id}>
            {school.name}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-gray">
        ▼
      </div>
    </div>
  );
};

export default SchoolSelector;
