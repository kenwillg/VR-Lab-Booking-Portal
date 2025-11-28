import React from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
  topBarTitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showBottomNav?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  topBarTitle,
  showBack = false,
  onBack,
  showBottomNav = true,
}) => {
  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <TopBar title={topBarTitle} showBack={showBack} onBack={onBack} />
      <main className="flex-1 max-w-[430px] mx-auto w-full px-4 pb-20">
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

