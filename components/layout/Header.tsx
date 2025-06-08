import React from 'react';
import Icons from '../common/Icons';
import { UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile | null;
  notificationsCount: number;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user,
  notificationsCount,
  onNotificationsClick, 
  onSettingsClick
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-2xl no-print">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
              <Icons.Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                VaktAI
                <span className="ml-2 text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">v3.0</span>
              </h1>
              <p className="text-sm opacity-90">Snjall vaktastjórnun með AI</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <button
              onClick={onNotificationsClick}
              className="relative p-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all"
            >
              <Icons.Bell className="w-6 h-6" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            <button
              onClick={onSettingsClick}
              className="p-3 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all"
            >
              <Icons.Settings className="w-6 h-6" />
            </button>

            {user && (
              <div className="flex items-center space-x-3 ml-6">
                <div className="text-right">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs opacity-90">{user.role}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center font-bold text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
