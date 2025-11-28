import React from 'react';
import { Facility } from '../../services/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';

interface FacilityCardProps {
  facility: Facility;
  onBook: (facility: Facility) => void;
  availabilityStatus?: 'available' | 'booked' | 'full';
  availabilityText?: string;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  onBook,
  availabilityStatus = 'available',
  availabilityText,
}) => {
  const getButtonText = () => {
    switch (facility.type) {
      case 'soldering':
        return 'Book Schedule';
      case 'development-pc':
        return 'Book a PC';
      case 'vr-headset':
        return 'Book VR Session';
      default:
        return 'Book Now';
    }
  };

  const defaultAvailabilityText = {
    available: 'Available Now',
    booked: 'Full Booked saat ini',
    full: 'Full Booked saat ini',
  };

  return (
    <Card className="mb-4">
      <div className="flex flex-col gap-4">
        {/* Header with icon and title */}
        <div className="flex items-start gap-4">
          <div className="text-4xl">{facility.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-text-primary mb-1">
              {facility.name}
            </h3>
            <p className="text-sm text-text-secondary mb-2">
              {facility.description}
            </p>
            {facility.note && (
              <p className="text-xs text-text-secondary italic">
                {facility.note}
              </p>
            )}
          </div>
        </div>

        {/* Status badge */}
        <div>
          <StatusBadge
            status={availabilityStatus}
            text={availabilityText || defaultAvailabilityText[availabilityStatus]}
          />
        </div>

        {/* Book button */}
        <Button
          variant="primary"
          fullWidth
          onClick={() => onBook(facility)}
        >
          {getButtonText()}
        </Button>
      </div>
    </Card>
  );
};

