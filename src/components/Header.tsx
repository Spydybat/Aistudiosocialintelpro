/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
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
  Moon,
  Play,
  Music,
  Image as FileImageIcon,
  FileText,
  ChevronRight,
  LogOut
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

const getFriendlyFilename = (item: DownloadItem) => {
  if (item.filename) return item.filename;
  
  let extension = 'mp4';
  if (item.type === 'audio') extension = 'mp3';
  else if (item.type === 'image' || item.type === 'thumbnail') extension = 'jpg';
  else if (item.type === 'profile_pic') extension = 'png';
  else if (item.type === 'caption') extension = 'txt';
  else if (item.type === 'bundle') extension = 'zip';
  else if (item.title.toLowerCase().endsWith('.json') || item.type === 'all') extension = 'json';
  
  let baseName = item.title
    .toLowerCase()
    .replace(/^instagram\s+|^twitter\s+|^youtube\s+|^threads\s+|^tiktok\s+|^snapchat\s+/g, '')
    .replace(/all-downloader:\s*/g, '')
    .replace(/[^a-z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .substring(0, 25);
  
  if (!baseName) {
    baseName = `${item.platform}_media`;
  }
  
  return `${baseName}.${extension}`;
};

const getFileTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
    case 'reel':
    case 'all':
      return <Play className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    case 'audio':
      return <Music className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
    case 'image':
    case 'profile_pic':
    case 'thumbnail':
      return <FileImageIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    case 'caption':
      return <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    default:
      return <Download className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
  }
};

const formatDownloadTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    const diffMs = Date.now() - date.getTime();
    if (diffMs < 30000) return 'Just now';
    if (diffMs < 60000) return 'Under a minute ago';
    if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`;
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch (e) {
    return 'Recently';
  }
};

export default function Header({
  currentView,
  setCurrentView,
  activePlatform,
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
  downloads
}: HeaderProps) {

  const getPlatformLabel = (id: PlatformType) => {
    switch (id) {
      case 'instagram': return 'Instagram Core';
      case 'twitter': return 'Twitter / X Engine';
      case 'youtube': return 'YouTube Studio';
      case 'snapchat': return 'Snapchat Lens';
      case 'threads': return 'Threads Core';
      case 'tiktok': return 'TikTok Viral';
      default: return 'Core';
    }
  };

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

        {user ? (
          <div id="header-auth-user" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center font-bold text-white text-xs shrink-0 overflow-hidden">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                user.displayName
                  ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : 'U'
              )}
            </div>
            <span className="hidden sm:block text-xs text-zinc-600 dark:text-zinc-300 font-medium max-w-[160px] truncate">
              {user.email}
            </span>
            <button
              id="header-logout-btn"
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        ) : (
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
