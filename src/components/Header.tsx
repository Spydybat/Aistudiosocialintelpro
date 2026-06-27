/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  AppView, 
  PlatformType, 
  User,
  DownloadItem
} from '../types';
import { 
  Download, 
  Menu, 
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import LogoIcon from './LogoIcon';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activePlatform: PlatformType;
  user: User | null;
  openAuth: () => void;
  logout: () => void;
  activeDownloadsCount: number;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentIndex?: number;
  onBack?: () => void;
  activeTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  downloads: DownloadItem[];
}


export default function Header({
  currentView,
  setCurrentView,
  user,
  openAuth,
  logout,
  activeDownloadsCount,
  sidebarOpen,
  toggleSidebar,
  currentIndex = 0,
  onBack,
  activeTheme,
  onToggleTheme,
}: HeaderProps) {

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header id="main-header" className="h-16 border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-6 flex items-center justify-between shrink-0 select-none">
      
      {/* LEFT: TITLE & NAVIGATION TRIGGER */}
      <div id="header-breadcrumb" className="flex items-center gap-2">
        <button
          id="sidebar-toggle-btn-header"
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-zinc-550 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition mr-1"
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <Menu className="w-4.5 h-4.5" />
        </button>
        {(currentIndex > 0 || currentView === 'download-center') && onBack && (
          <button
            id="header-back-btn"
            onClick={onBack}
            className="p-1.5 rounded-lg text-zinc-550 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition mr-1 flex items-center justify-center"
            title="Go Back"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-orange-500 hover:scale-105 active:scale-95 transition-all duration-150" />
          </button>
        )}
        <button
          id="header-home-navigator"
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2.5 hover:opacity-90 active:scale-98 transition text-left"
        >
          <LogoIcon className="w-7 h-7" />
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
            Socialintel
          </span>
        </button>
      </div>

      {/* RIGHT: ACCOUNT ENGINE */}
      <div id="header-right" className="flex items-center gap-4">
        {!user && (
          <button
            id="header-login-btn"
            type="button"
            onClick={openAuth}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-orange-500 hover:text-orange-600 hover:bg-orange-500/10 transition"
          >
            Login
          </button>
        )}
        
        {/* THEME TOGGLE ICON */}
        <button
          id="hdr-theme-toggle-btn"
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition"
          title={activeTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {activeTheme === 'dark' ? (
            <Moon className="w-4.5 h-4.5" />
          ) : (
            <Sun className="w-4.5 h-4.5" />
          )}
        </button>

        {/* DOWNLOAD CENTER QUICK BAR ICON */}
        <div className="relative">
          <button
            id="hdr-download-center-btn"
            onClick={() => setCurrentView('download-center')}
            className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition"
            title="Download Center Status"
          >
            <Download className="w-4.5 h-4.5" />
            {activeDownloadsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-orange-500 text-[9px] font-extrabold text-white shadow-md">
                {activeDownloadsCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
