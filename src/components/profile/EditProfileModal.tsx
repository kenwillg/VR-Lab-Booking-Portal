import React, { useState, useEffect } from 'react';
import { UserProfile, UpdateProfileRequest } from '../../services/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface EditProfileModalProps {
  profile: UserProfile;
  onSave: (updates: UpdateProfileRequest) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: profile.name || '',
    nim: profile.nim || '',
    nidn: profile.nidn || '',
    programStudi: profile.programStudi || '',
    fakultas: profile.fakultas || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const result = await onSave(formData);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to update profile');
    }
    
    setSaving(false);
  };

  const handleChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-text-primary mb-2">Edit Profile</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-secondary hover:text-text-primary text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 bg-bg-main border border-slate-600 rounded-lg text-text-primary focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              NIM / NIDN
            </label>
            <input
              type="text"
              value={formData.nim || formData.nidn || ''}
              onChange={(e) => {
                // Determine if it's NIM or NIDN based on length or let user choose
                if (e.target.value.length <= 10) {
                  handleChange('nim', e.target.value);
                } else {
                  handleChange('nidn', e.target.value);
                }
              }}
              className="w-full px-4 py-2 bg-bg-main border border-slate-600 rounded-lg text-text-primary focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Program Studi
            </label>
            <input
              type="text"
              value={formData.programStudi || ''}
              onChange={(e) => handleChange('programStudi', e.target.value)}
              className="w-full px-4 py-2 bg-bg-main border border-slate-600 rounded-lg text-text-primary focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Fakultas
            </label>
            <input
              type="text"
              value={formData.fakultas || ''}
              onChange={(e) => handleChange('fakultas', e.target.value)}
              className="w-full px-4 py-2 bg-bg-main border border-slate-600 rounded-lg text-text-primary focus:outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="bg-status-booked/20 border border-status-booked/50 rounded-lg p-3">
              <p className="text-status-booked text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

