import React from 'react';

interface SegmentControlProps {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const SegmentControl: React.FC<SegmentControlProps> = ({
  options,
  selectedIndex,
  onSelect,
}) => {
  return (
    <div className="flex gap-2 bg-bg-card p-1 rounded-lg">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`
            flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
            ${selectedIndex === index
              ? 'gradient-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
            }
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

