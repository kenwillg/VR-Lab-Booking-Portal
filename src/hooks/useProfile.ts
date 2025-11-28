import { useState, useEffect } from 'react';
import { profileApi, UserProfile, UpdateProfileRequest } from '../services/api';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    const response = await profileApi.get();
    
    if (response.success && response.data) {
      setProfile(response.data);
    } else {
      setError(response.error || 'Failed to load profile');
    }
    
    setLoading(false);
  };

  const updateProfile = async (updates: UpdateProfileRequest) => {
    setLoading(true);
    setError(null);
    
    const response = await profileApi.update(updates);
    
    if (response.success && response.data) {
      setProfile(response.data);
      setLoading(false);
      return { success: true };
    } else {
      const errorMsg = response.error || 'Failed to update profile';
      setError(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
};

