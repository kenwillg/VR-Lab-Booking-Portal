import React from 'react';

export interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlots: string[];
  onSlotToggle: (time: string) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  slots,
  selectedSlots,
  onSlotToggle,
}) => {
  const isSelected = (time: string) => selectedSlots.includes(time);
  const isConsecutive = (time: string) => {
    if (selectedSlots.length === 0) return true;
    const sorted = [...selectedSlots, time].sort();
    const index = sorted.indexOf(time);
    if (index === 0) {
      // Check if next slot exists and is selected
      const nextTime = getNextTime(time);
      return !nextTime || sorted.includes(nextTime);
    }
    if (index === sorted.length - 1) {
      // Check if previous slot is selected
      const prevTime = getPrevTime(time);
      return !prevTime || sorted.includes(prevTime);
    }
    // Check both neighbors
    const prevTime = getPrevTime(time);
    const nextTime = getNextTime(time);
    return (
      (prevTime && sorted.includes(prevTime)) ||
      (nextTime && sorted.includes(nextTime))
    );
  };

  const getNextTime = (time: string): string | null => {
    const [hours, minutes] = time.split(':').map(Number);
    const nextHour = hours + 1;
    if (nextHour >= 24) return null;
    return `${String(nextHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const getPrevTime = (time: string): string | null => {
    const [hours, minutes] = time.split(':').map(Number);
    const prevHour = hours - 1;
    if (prevHour < 0) return null;
    return `${String(prevHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available) return;
    if (isSelected(slot.time)) {
      onSlotToggle(slot.time);
    } else {
      // Only allow selecting consecutive slots
      if (isConsecutive(slot.time)) {
        onSlotToggle(slot.time);
      }
    }
  };

  const getSelectedRange = (): string => {
    if (selectedSlots.length === 0) return '';
    const sorted = selectedSlots.sort();
    return `${sorted[0]} - ${sorted[sorted.length - 1]}`;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Pilih Waktu
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {slots.map((slot) => {
          const selected = isSelected(slot.time);
          const disabled = !slot.available;

          return (
            <button
              key={slot.time}
              onClick={() => handleSlotClick(slot)}
              disabled={disabled}
              className={`
                py-3 px-4 rounded-lg text-sm font-medium transition-all
                ${disabled
                  ? 'bg-status-full/20 text-status-full line-through cursor-not-allowed'
                  : selected
                  ? 'gradient-primary text-white'
                  : 'bg-bg-card border-2 border-indigo-500/50 text-text-primary hover:border-indigo-400 hover:bg-indigo-500/10'
                }
              `}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
      {selectedSlots.length > 0 && (
        <div className="mt-4 text-sm text-text-secondary">
          <span className="font-medium text-text-primary">
            {selectedSlots.length} Slot Dipilih ({getSelectedRange()})
          </span>
        </div>
      )}
    </div>
  );
};

