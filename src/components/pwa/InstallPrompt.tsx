import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { isInstalled, isInstallable, promptInstall, registerPWAInstall } from '../../utils/pwa-install';

export const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Register PWA install handlers
    registerPWAInstall();
    
    // Check if already installed
    setInstalled(isInstalled());
    
    // Check if installable (only show if not installed)
    if (!isInstalled()) {
      // Delay showing prompt a bit
      const timer = setTimeout(() => {
        if (isInstallable()) {
          setShowPrompt(true);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setShowPrompt(false);
      setInstalled(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (installed || !showPrompt || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4 max-w-[430px] mx-auto">
      <div className="bg-bg-card border border-indigo-500/50 rounded-card p-4 shadow-card">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📱</div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Install VR Lab App
            </h3>
            <p className="text-xs text-text-secondary mb-3">
              Install untuk akses lebih cepat dan bisa digunakan offline
            </p>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleInstall}
                className="flex-1 text-sm py-2"
              >
                Install
              </Button>
              <Button
                variant="secondary"
                onClick={handleDismiss}
                className="text-sm py-2 px-4"
              >
                Nanti
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

