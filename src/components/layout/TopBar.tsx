import React from 'react';

interface TopBarProps {
  title?: string;
  onAvatarClick?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  onAvatarClick,
  showBack = false,
  onBack,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-bg-main/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-[430px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-bg-card rounded-lg transition-colors"
              aria-label="Back"
            >
              <svg
                className="w-6 h-6 text-text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <h1 className="text-lg font-bold text-text-primary">
            {title || 'VR Lab'}
          </h1>
        </div>
        {!showBack && (
          <button
            onClick={onAvatarClick}
            className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold hover:opacity-90 transition-opacity"
            aria-label="Profile"
          >
            U
          </button>
        )}
      </div>
    </div>
  );
};

