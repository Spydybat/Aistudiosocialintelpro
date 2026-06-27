/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  HistoryItem, 
  PlatformType, 
  AppView, 
  User 
} from '../types';
import LogoIcon from './LogoIcon';
import {
  Download, 
  Settings, 
  CreditCard, 
  X,
  Share2,
  Instagram,
  Twitter,
  Youtube,
  Tv,
  Layers,
  ChevronUp,
  LogOut,
  HelpCircle,
  Sparkles,
  History,
  FileArchive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activePlatform: PlatformType;
  setActivePlatform: (platform: PlatformType) => void;
  history: HistoryItem[];
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  onSelectAction: (type: 'search' | 'explorer' | 'all_downloader', text: string, platform?: PlatformType) => void;
  user: User | null;
  openAuth: () => void;
  activeDownloadsCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  logout: () => void;
}

export default function Sidebar({
  currentView,
  setCurrentView,
  activePlatform,
  setActivePlatform,
  history: _history,
  clearHistory: _clearHistory,
  deleteHistoryItem: _deleteHistoryItem,
  onSelectAction: _onSelectAction,
  user,
  openAuth,
  activeDownloadsCount,
  isOpen,
  setIsOpen,
  logout
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll on mobile if sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  // Dropdown click outside and ESC keydown handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  // Global keydown triggers to close sidebar overlay on ESC
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, setIsOpen]);

  const platformsList: { id: PlatformType; label: string; icon: any; color: string }[] = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/20' },
    { id: 'twitter', label: 'Twitter / X', icon: Twitter, color: 'text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20' },
    { id: 'snapchat', label: 'Snapchat', icon: Tv, color: 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20' },
    { id: 'threads', label: 'Threads', icon: Layers, color: 'text-[#111827] dark:text-[#FFFFFF]' },
    { id: 'tiktok', label: 'TikTok', icon: Share2, color: 'text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/20' },
  ];

  const getDropdownItemClass = (isActive: boolean) => {
    return `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] font-[500] transition-colors w-full text-left opacity-100 ` +
      (isActive 
        ? `bg-[#2563EB] text-[#FFFFFF] dark:bg-[#2563EB] dark:text-[#FFFFFF]` 
        : `bg-transparent text-[#111827] dark:text-[#FFFFFF] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] hover:text-[#111827] dark:hover:text-[#FFFFFF]`
      );
  };

  const getIconClass = (isActive: boolean) => {
    return `w-4 h-4 shrink-0 transition-colors ` +
      (isActive 
        ? `text-[#FFFFFF]` 
        : `text-[#111827] dark:text-[#D1D5DB]`
      );
  };

  return (
    <>
      {/* ChatGPT-like Dark transparent backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Container */}
      <motion.aside
        id="sidebar-container"
        animate={{ 
          width: '280px',
          opacity: isOpen ? 1 : 0,
          x: isOpen ? '0%' : '-100%'
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white flex flex-col border-r border-zinc-200 dark:border-zinc-900 overflow-hidden ${
          isOpen ? 'w-[280px]' : 'pointer-events-none'
        }`}
      >
        <div className="w-[280px] h-full flex flex-col min-h-0 overflow-hidden">
          {/* LOGO */}
          <div id="sidebar-logo-container" className="h-16 flex items-center justify-between px-5 border-b border-zinc-200 dark:border-zinc-900 shrink-0">
            <button
               id="sidebar-logo-button-link"
               onClick={() => {
                 setCurrentView('home');
                 setIsOpen(false);
               }}
               className="flex items-center gap-2.5 hover:opacity-95 text-left active:scale-98 transition"
             >
               <LogoIcon className="w-8 h-8" />
               <div>
                 <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-white flex items-center gap-1">
                   Socialintel
                 </span>
               </div>
             </button>
            <button 
              id="sidebar-close-btn"
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded text-zinc-500 dark:text-zinc-400"
              onClick={() => setIsOpen(false)}
              title="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* MIDDLE: DETAILED SOCIAL PLATFORMS LIST */}
          <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
            <div className="text-[10px] font-extrabold text-zinc-500 tracking-widest uppercase mb-4 px-2">
              Platforms
            </div>
            <div id="sidebar-platforms-list" className="space-y-1.5">
              {platformsList.map((p) => {
                const Icon = p.icon;
                const isSelected = currentView === 'tools' && activePlatform === p.id;
                return (
                  <button
                    id={`sidemenu-plat-${p.id}`}
                    key={p.id}
                    onClick={() => {
                      setCurrentView('tools');
                      setActivePlatform(p.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-tight transition duration-150 ${
                      isSelected 
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white border-l-2 border-orange-500 font-bold shadow-inner' 
                        : 'text-zinc-550 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${p.color}`} />
                      <span>{p.label}</span>
                    </div>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM PROFILE WRAPPER */}
          <div 
            id="sidebar-profile-section" 
            ref={profileRef}
            className="shrink-0 p-4 border-t border-zinc-200 dark:border-zinc-900 relative"
          >
            {/* PROFILE DROPDOWN MENU */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 12 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute bottom-[72px] left-4 right-4 bg-[#FFFFFF] dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] rounded-xl p-1.5 shadow-2xl z-50 flex flex-col space-y-0.5"
                >
                  <button
                    onClick={() => {
                      setCurrentView('pricing');
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className={getDropdownItemClass(currentView === 'pricing')}
                  >
                    <CreditCard className={getIconClass(currentView === 'pricing')} />
                    <span>Subscription & Pricing</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('download-center');
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className={getDropdownItemClass(currentView === 'download-center')}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Download className={getIconClass(currentView === 'download-center')} />
                      <span>Download Center</span>
                    </div>
                    {activeDownloadsCount > 0 && (
                      <span className="bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {activeDownloadsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('download-history');
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className={getDropdownItemClass(currentView === 'download-history')}
                  >
                    <History className={getIconClass(currentView === 'download-history')} />
                    <span>Download History</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('saved-exports');
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className={getDropdownItemClass(currentView === 'saved-exports')}
                  >
                    <FileArchive className={getIconClass(currentView === 'saved-exports')} />
                    <span>Saved Exports</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('settings');
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className={getDropdownItemClass(currentView === 'settings')}
                  >
                    <Settings className={getIconClass(currentView === 'settings')} />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('help');
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className={getDropdownItemClass(currentView === 'help')}
                  >
                    <HelpCircle className={getIconClass(currentView === 'help')} />
                    <span>Help</span>
                  </button>

                  <div className="h-px bg-[#E5E7EB] dark:bg-[#374151] my-1 shrink-0" />

                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] font-[500] transition-colors w-full text-left opacity-100 bg-transparent text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-350"
                  >
                    <LogOut className="w-4 h-4 shrink-0 text-red-650 dark:text-red-400" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile trigger */}
            {user ? (
              <div 
                id="sidebar-profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/40 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-left select-none animate-fade-in"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Profile Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {user.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </div>
                  {/* User Name */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-[#111827] dark:text-[#FFFFFF] font-[500] dark:font-[600] truncate opacity-100">{user.displayName}</span>
                    <span className="text-[10px] text-[#374151] dark:text-[#D1D5DB] font-[500] font-mono truncate opacity-100">{user.email}</span>
                  </div>
                </div>
                {/* Plan Badge & chevron */}
                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 dark:text-orange-400 border border-orange-500/20 uppercase">
                    {user.plan}
                  </span>
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-450" />
                </div>
              </div>
            ) : (
              <button 
                id="sidebar-sign-in-prompt"
                onClick={openAuth}
                className="w-full py-3 px-3 border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 rounded-xl text-center text-xs text-orange-650 dark:text-orange-400 font-medium hover:text-orange-700 dark:hover:text-orange-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/30 transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                Sign in to Socialintel
              </button>
            )}
          </div>

        </div>
      </motion.aside>
    </>
  );
}
