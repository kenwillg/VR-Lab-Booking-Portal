import React, { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { useProfile } from '../hooks/useProfile';
import { authApi } from '../services/auth';

export const ProfileScreen: React.FC = () => {
  const { profile, loading, error, updateProfile, refetch } = useProfile();
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSave = async (updates: Parameters<typeof updateProfile>[0]) => {
    const result = await updateProfile(updates);
    if (result.success) {
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(null), 3000);
      refetch();
    }
    return result;
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      authApi.logout();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <AppShell topBarTitle="Profile">
        <div className="pt-8 text-center">
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !profile) {
    return (
      <AppShell topBarTitle="Profile">
        <div className="pt-8 text-center">
          <p className="text-status-booked">{error || 'Failed to load profile'}</p>
          <Button variant="outline" onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell topBarTitle="Profile">
      <div className="pt-6 pb-6">
        {/* Success Message */}
        {message && (
          <div className="mb-4 p-4 rounded-card bg-status-available/20 border border-status-available/50 text-status-available">
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            {getInitials(profile.name)}
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">
            {profile.name}
          </h2>
          <p className="text-text-secondary">{profile.email}</p>
        </div>

        {/* Profile Info */}
        <div className="space-y-4 mb-6">
          <Card>
            <div className="space-y-3">
              {(profile.nim || profile.nidn) && (
                <div>
                  <p className="text-sm text-text-secondary mb-1">NIM / NIDN</p>
                  <p className="text-text-primary font-medium">
                    {profile.nim || profile.nidn}
                  </p>
                </div>
              )}
              {profile.programStudi && (
                <div>
                  <p className="text-sm text-text-secondary mb-1">Program Studi</p>
                  <p className="text-text-primary font-medium">
                    {profile.programStudi}
                  </p>
                </div>
              )}
              {profile.fakultas && (
                <div>
                  <p className="text-sm text-text-secondary mb-1">Fakultas</p>
                  <p className="text-text-primary font-medium">
                    {profile.fakultas}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="secondary" fullWidth onClick={handleEdit}>
            Edit Profile
          </Button>
          <Button variant="outline" fullWidth onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <EditProfileModal
            profile={profile}
            onSave={handleSave}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </div>
    </AppShell>
  );
};

