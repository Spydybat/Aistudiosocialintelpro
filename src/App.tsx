/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { mapSupabaseUserToAppUser } from './lib/auth';
import { 
  AppView, 
  PlatformType, 
  User, 
  DownloadItem, 
  HistoryItem, 
  SessionDevice, 
  BillingInvoice, 
  UserSettings 
} from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import DownloadCenter from './components/DownloadCenter';
import PricingSection from './components/PricingSection';
import SettingsModal from './components/SettingsModal';
import PlatformTools from './components/PlatformTools';
import AccountExplorerView from './components/AccountExplorerView';
import HomeView from './components/HomeView';
import HelpCenterView from './components/HelpCenterView';
import Profile from './pages/Profile';
import DownloadHistory from './pages/DownloadHistory';
import SavedExports from './pages/SavedExports';
import { Compass, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { addDownloadHistory } from './lib/downloadHistory';
import { addSavedExport } from './lib/savedExports';

const LOCAL_STORAGE_KEY = 'socialintel_pro_state_v2';

interface AppProps {
  initialView?: AppView;
}

export default function App({ initialView = 'home' }: AppProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, signOut: authSignOut } = useAuth();
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  // Authenticated user state synced from Supabase Auth
  const [user, setUser] = useState<User | null>(null);

  const [authOpen, setAuthOpen] = useState(false);

  const openAuth = () => navigate('/login');

  useEffect(() => {
    if (authUser) {
      const mappedUser = mapSupabaseUserToAppUser(authUser);
      setUser(mappedUser);
      setSettings(prev => ({
        ...prev,
        account: {
          displayName: mappedUser.displayName,
          email: mappedUser.email
        }
      }));
    } else {
      setUser(null);
    }
  }, [authUser]);

  // History system - pre-seeded ChatGPT-like histories
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 'h1', type: 'explorer', platform: 'instagram', query: 'travel_explorers', timestamp: '2026-06-18T07:12:00Z', details: 'Completed ZIP' },
    { id: 'h2', type: 'all_downloader', platform: 'twitter', query: 'https://twitter.com/tech_guru/status/102', timestamp: '2026-06-18T06:45:00Z', details: 'XLSX Export' },
    { id: 'h3', type: 'explorer', platform: 'youtube', query: 'science_simplified', timestamp: '2026-06-17T18:15:00Z', details: 'All Video' },
    { id: 'h4', type: 'all_downloader', platform: 'tiktok', query: 'https://tiktok.com/@dance_beats/reel/101', timestamp: '2026-06-15T12:30:00Z', details: '320kbps MP3' }
  ]);

  // Devices session logs
  const [devices, setDevices] = useState<SessionDevice[]>([
    { id: 'dev_1', browser: 'Chrome Desktop', os: 'macOS Monterey', ip: '66.102.6.12', location: 'Mountain View, CA', isCurrent: true, lastActive: 'Active Now' },
    { id: 'dev_2', browser: 'Safari Mobile', os: 'iOS 17.4', ip: '192.168.1.144', location: 'San Jose, CA', isCurrent: false, lastActive: '2 hours ago' },
    { id: 'dev_3', browser: 'Firefox Quantum', os: 'Windows 11', ip: '82.204.1.92', location: 'London, UK', isCurrent: false, lastActive: 'Yesterday' }
  ]);

  // Billing Receipts Ledger
  const [invoices, setInvoices] = useState<BillingInvoice[]>([
    { id: 'INV-2026-0041', date: '2026-06-15', amount: '$29.00', status: 'Paid', pdfUrl: '#receipt-1' },
    { id: 'INV-2026-0028', date: '2026-05-15', amount: '$29.00', status: 'Paid', pdfUrl: '#receipt-2' }
  ]);

  // Standalone and All downloads queue
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    { id: 'd1', platform: 'instagram', title: '@travel_explorers core profile graphics backup', type: 'profile_pic', url: 'https://instagram.com/travel_explorers', status: 'completed', progress: 100, size: '4.2 MB', addedAt: '2026-06-18T07:15:00Z' },
    { id: 'd2', platform: 'youtube', title: 'Why Quantum Computers Aren\'t Just "Super Fast" PC', type: 'video', url: 'https://youtube.com/watch?v=yt_post_101', status: 'failed', progress: 42, size: '48.9 MB', addedAt: '2026-06-17T18:18:00Z', error: 'Chunk stream disconnected' }
  ]);

  // Export records
  const [exports, setExports] = useState<HistoryItem[]>([
    { id: 'e1', type: 'export', platform: 'instagram', query: 'travel_explorers_instagram_history.xlsx', timestamp: '2026-06-18T07:20:00Z', details: 'All Contents row values' },
    { id: 'e2', type: 'export', platform: 'twitter', query: 'tech_guru_twitter_history.csv', timestamp: '2026-06-18T06:50:00Z', details: 'Twt parameters mapping' }
  ]);

  // User configurated settings
  const [settings, setSettings] = useState<UserSettings>({
    account: { displayName: 'Kalaiyarasan K', email: 'kalai23078@gmail.com' },
    appearance: 'dark',
    downloads: { autoResume: true, askSaveLocation: false, concurrentLimit: 3, defaultFormat: 'mp4' },
    exports: { includeMetadata: true, minifyJson: false, csvSeparator: ',' },
    notifications: { downloadFinished: true, downloadFailed: true, newsletters: false, securityAlerts: true },
    security: { twoFactorEnabled: false, loginNotify: true },
    privacy: { saveSearchHistory: true, anonymousLogs: false },
    billing: { plan: 'Free', renewalDate: 'Next charging: 2026-07-18', cardLast4: '4242' },
    aiSettings: { autoCaptionTranslate: true, captionSummarizer: false, language: 'en' }
  });

  // Helper to generate friendly filenames consistently for the popup
  const getFriendlyFilename = (item: Omit<DownloadItem, 'id' | 'progress' | 'status' | 'addedAt'>) => {
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

  // Temporary download file popup states
  const [activeDownloadPopupFile, setActiveDownloadPopupFile] = useState<string | null>(null);
  const downloadPopupTimeoutRef = useRef<number | null>(null);

  // Active Routing views
  const [currentView, setCurrentView] = useState<AppView>(initialView);
  const [activePlatform, setActivePlatform] = useState<PlatformType>('instagram');
  const [presetUsername, setPresetUsername] = useState<string>('');
  const [explorerTabActive, setExplorerTabActive] = useState(false);
  const [selectedToolType, setSelectedToolType] = useState<string | null>(null);

  // Navigation memory for returning from Download Center
  const [lastNonDownloadCenterState, setLastNonDownloadCenterState] = useState<{
    view: AppView;
    activePlatform: PlatformType;
    explorerTabActive: boolean;
    presetUsername: string;
    selectedToolType: string | null;
    scrollTop?: number;
  } | null>(null);

  // Browser-like navigation stack
  const [historyStack, setHistoryStack] = useState<AppView[]>([initialView]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const navigateTo = (view: AppView) => {
    if (view === currentView) return;

    if (view === 'download-center' && currentView !== 'download-center') {
      const scrollContainer = document.getElementById('view-content-canvas');
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
      setLastNonDownloadCenterState({
        view: currentView,
        activePlatform,
        explorerTabActive,
        presetUsername,
        selectedToolType,
        scrollTop,
      });
    }

    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(view);
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);
    setCurrentView(view);
    
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({ view, index: newStack.length - 1 }, '', '');
    }
  };

  const handleBack = () => {
    if (currentView === 'download-center') {
      if (lastNonDownloadCenterState) {
        setCurrentView(lastNonDownloadCenterState.view);
        setActivePlatform(lastNonDownloadCenterState.activePlatform);
        setExplorerTabActive(lastNonDownloadCenterState.explorerTabActive);
        setPresetUsername(lastNonDownloadCenterState.presetUsername);
        setSelectedToolType(lastNonDownloadCenterState.selectedToolType);
        
        // Restore scroll position after React updates the rendering tree
        const targetScroll = lastNonDownloadCenterState.scrollTop;
        if (typeof targetScroll === 'number' && targetScroll > 0) {
          setTimeout(() => {
            const scrollContainer = document.getElementById('view-content-canvas');
            if (scrollContainer) {
              scrollContainer.scrollTop = targetScroll;
            }
          }, 60);
        }

        if (historyIndex > 0) {
          setHistoryIndex(historyIndex - 1);
        }
        if (typeof window !== 'undefined' && window.history) {
          window.history.back();
        }
        return;
      } else {
        navigateTo('home');
        return;
      }
    }

    if (historyIndex > 0) {
      if (typeof window !== 'undefined' && window.history) {
        window.history.back();
      }
    } else {
      navigateTo('home');
    }
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state.view !== 'undefined') {
        const { view, index } = event.state;
        setCurrentView(view);
        setHistoryIndex(index);
      } else {
        setCurrentView('home');
        setHistoryIndex(0);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    if (typeof window !== 'undefined' && window.history && !window.history.state) {
      window.history.replaceState({ view: 'home', index: 0 }, '', '');
    }
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [historyStack, historyIndex]);

  useEffect(() => {
    if (location.pathname === '/profile' && currentView !== 'profile') {
      setCurrentView('profile');
      setHistoryStack(prev => (prev[prev.length - 1] === 'profile' ? prev : [...prev, 'profile']));
      setHistoryIndex(prev => prev + 1);
    }
  }, [location.pathname, currentView]);

  // Controlled sidebar state with responsive default and local storage persistence
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const isMobileScreen = window.innerWidth < 1024;
      if (isMobileScreen) return false;
      const cached = localStorage.getItem('socialintel_sidebar_open');
      return cached !== null ? cached === 'true' : true;
    }
    return true;
  });

  // Track screen size on resize to handle responsiveness
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle auto-syncing of sidebar state on transition between responsive modes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      const cached = localStorage.getItem('socialintel_sidebar_open');
      setSidebarOpen(cached !== null ? cached === 'true' : true);
    }
  }, [isMobile]);

  // Persist sidebar state when customized on desktop screens
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('socialintel_sidebar_open', String(sidebarOpen));
    }
  }, [sidebarOpen, isMobile]);

  // Swipe Gestures for Mobile Sidebar
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Filter for horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (Math.abs(deltaX) > 60) {
          if (deltaX > 0) {
            // Swipe right: open sidebar if swiped from left edge
            if (!sidebarOpen && touchStartX < 50) {
              setSidebarOpen(true);
            }
          } else {
            // Swipe left: close sidebar
            if (sidebarOpen) {
              setSidebarOpen(false);
            }
          }
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sidebarOpen]);

  // Load from local Storage on boot
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.history) setHistory(parsed.history);
        if (parsed.downloads) setDownloads(parsed.downloads);
        if (parsed.exports) setExports(parsed.exports);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.devices) setDevices(parsed.devices);
      } catch (e) {
        console.error('Failed to parse persistent Socialintel state.', e);
      }
    }
  }, []);

  // Save to local Storage when parameters change
  useEffect(() => {
    const blobToSave = {
      user,
      history,
      downloads,
      exports,
      settings,
      invoices,
      devices
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blobToSave));
  }, [user, history, downloads, exports, settings, invoices, devices]);

  // VITE THEME SWITCHING ENGINE
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (t: 'light' | 'dark' | 'system') => {
      root.classList.remove('dark', 'light');
      if (t === 'dark' || (t === 'system' && mediaQuery.matches)) {
        root.classList.add('dark');
        setTheme('dark');
      } else {
        root.classList.add('light');
        setTheme('light');
      }
    };

    applyTheme(settings.appearance);

    if (settings.appearance === 'system') {
      const listener = (e: MediaQueryListEvent) => {
        root.classList.remove('dark', 'light');
        if (e.matches) {
          root.classList.add('dark');
          setTheme('dark');
        } else {
          root.classList.add('light');
          setTheme('light');
        }
      };
      
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.appearance]);

  // BACKGROUND DOWNLOADING STREAMER LOOP
  // Simulates actual packet downloads! Increments active downloads every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads((prevDownloads) => {
        const hasQueuedOrDownloading = prevDownloads.some(
          d => d.status === 'downloading' || d.status === 'queued'
        );
        if (!hasQueuedOrDownloading) return prevDownloads;

        const nextDownloads = prevDownloads.map((item) => {
          if (item.status === 'queued') {
            return { ...item, status: 'downloading', progress: 5 };
          }
          if (item.status === 'downloading') {
            const nextProgress = item.progress + Math.floor(Math.random() * 20) + 12;
            if (nextProgress >= 100) {
              // Notification sound can go here
              return { ...item, status: 'completed', progress: 100 };
            }
            return { ...item, progress: nextProgress };
          }
          return item;
        });

        nextDownloads.forEach((item) => {
          const previousItem = prevDownloads.find((download) => download.id === item.id);
          const isNewlyCompleted = item.status === 'completed' && previousItem?.status !== 'completed';

          if (isNewlyCompleted && user?.id) {
            void addDownloadHistory({
              user_id: user.id,
              platform: item.platform,
              url: item.url,
              file_name: item.filename ?? getFriendlyFilename(item),
              file_size: item.size,
              status: 'completed',
            }).then(({ error }) => {
              if (!error) {
                window.dispatchEvent(new Event('download-history:updated'));
              }
            });
          }
        });

        return nextDownloads;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user?.id]);

  // Derived Values
  const activeDownloadsCount = downloads.filter(
    (d) => d.status === 'downloading' || d.status === 'queued'
  ).length;

  // Actions
  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setSettings(prev => ({
      ...prev,
      account: {
        displayName: authenticatedUser.displayName,
        email: authenticatedUser.email
      }
    }));
  };

  const handleLogout = async () => {
    await authSignOut();
    setUser(null);
    setCurrentView('tools');
    setExplorerTabActive(false);
    navigate('/login');
  };

  const handleAddDownload = (item: Omit<DownloadItem, 'id' | 'progress' | 'status' | 'addedAt'>) => {
    const newId = `dl_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newDownload: DownloadItem = {
      ...item,
      id: newId,
      progress: 0,
      status: 'queued',
      addedAt: new Date().toISOString()
    };
    setDownloads(prev => [newDownload, ...prev]);

    // Show temporary 1-second popup for tool download trigger
    if (downloadPopupTimeoutRef.current) {
      clearTimeout(downloadPopupTimeoutRef.current);
    }
    const filename = getFriendlyFilename(newDownload);
    setActiveDownloadPopupFile(filename);
    downloadPopupTimeoutRef.current = setTimeout(() => {
      setActiveDownloadPopupFile(null);
    }, 1000);

    // Register into ChatGPT-style history if settings allow
    if (settings.privacy.saveSearchHistory) {
      const historyQuery = item.title.includes(':') ? item.title.split(':').pop()?.trim() || item.url : item.url;
      const cleanHistoryQuery = historyQuery.length > 25 ? historyQuery.substring(0, 25) + '...' : historyQuery;
      
      const newHistoryItem: HistoryItem = {
        id: `h_${Date.now()}`,
        type: item.type === 'all' ? 'all_downloader' : 'download',
        platform: item.platform,
        query: cleanHistoryQuery,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    }
  };

  const handleAddExportLog = async (filename: string, details: string) => {
    const newLog: HistoryItem = {
      id: `exp_${Date.now()}`,
      type: 'export',
      platform: activePlatform,
      query: filename,
      timestamp: new Date().toISOString(),
      details: details
    };
    setExports(prev => [newLog, ...prev]);

    const extension = filename.split('.').pop()?.toLowerCase();
    if (user?.id && (extension === 'csv' || extension === 'json')) {
      const exportType = details.includes('All Downloader') ? 'All Downloader' : 'Account Explorer';
      const fileFormat = extension?.toUpperCase() ?? 'CSV';
      const fileSize = extension === 'json' ? '18 KB' : '12 KB';

      await addSavedExport({
        user_id: user.id,
        file_name: filename,
        export_type: exportType,
        file_format: fileFormat,
        file_size: fileSize,
      });

      window.dispatchEvent(new Event('saved-exports:updated'));
    }
  };

  // Manage Active Queue actions
  const handlePauseDownload = (id: string) => {
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, status: 'paused' as const } : d));
  };

  const handleResumeDownload = (id: string) => {
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, status: 'downloading' as const } : d));
  };

  const handleCancelDownload = (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const handleRetryDownload = (id: string) => {
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, status: 'queued' as const, progress: 0, error: undefined } : d));
  };

  const handleDeleteDownload = (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const handleDownloadAgain = (item: DownloadItem) => {
    handleAddDownload({
      platform: item.platform,
      title: `${item.title} (re-download)`,
      type: item.type,
      url: item.url,
      size: item.size
    });
  };

  // Upgrades plan from Payment Desk
  const handleUpgradePlan = (planName: 'Free' | 'Pro' | 'Team', interval: 'monthly' | 'yearly') => {
    if (!user) return;
    const updatedUser = { ...user, plan: planName, billingInterval: interval };
    setUser(updatedUser);
    setSettings(prev => ({
      ...prev,
      billing: {
        ...prev.billing,
        plan: planName,
        renewalDate: `Renew cycles: ${new Date(Date.now() + 30 * 86400 * 1000).toLocaleDateString()}`
      }
    }));

    // Add receipt copy
    const fee = planName === 'Pro' ? (interval === 'monthly' ? '$29.00' : '$19.00') : (interval === 'monthly' ? '$89.00' : '$59.00');
    const newInvoice: BillingInvoice = {
      id: `INV-2026-${Math.floor(Math.random() * 8000) + 1000}`,
      date: new Date().toLocaleDateString(),
      amount: fee,
      status: 'Paid',
      pdfUrl: '#receipt-new'
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  // Clear Sidebar list
  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  // Recalls profile or url when clicking on history log
  const handleSelectHistoryAction = (type: 'search' | 'explorer' | 'all_downloader', queryText: string, platformId?: PlatformType) => {
    if (platformId) setActivePlatform(platformId);
    
    if (type === 'explorer') {
      setPresetUsername(queryText);
      setExplorerTabActive(true);
    } else {
      setPresetUsername('');
      setExplorerTabActive(false);
    }
    navigateTo('tools');
  };

  return (
    <div id="socialintel-app-root" className={`min-h-screen flex ${theme === 'dark' ? 'dark bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'} font-sans antialiased transition-colors duration-200`}>
      
      {/* 1. COLLAPSIBLE CHATGPT SIDEBAR */}
      <Sidebar 
        currentView={currentView}
        setCurrentView={navigateTo}
        activePlatform={activePlatform}
        setActivePlatform={(p) => {
          setActivePlatform(p);
          setPresetUsername('');
          setExplorerTabActive(false);
        }}
        history={history}
        clearHistory={handleClearHistory}
        deleteHistoryItem={handleDeleteHistoryItem}
        onSelectAction={handleSelectHistoryAction}
        user={user}
        openAuth={openAuth}
        activeDownloadsCount={activeDownloadsCount}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        logout={handleLogout}
      />

      {/* 2. CHROME ROOT WORKSPACE CONTAINER */}
      <div id="main-workspace-container" className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Header toolbar */}
        <Header 
          currentView={currentView}
          setCurrentView={navigateTo}
          activePlatform={activePlatform}
          user={user}
          openAuth={openAuth}
          logout={handleLogout}
          activeDownloadsCount={activeDownloadsCount}
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          currentIndex={historyIndex}
          onBack={handleBack}
          activeTheme={theme === 'dark' ? 'dark' : 'light'}
          onToggleTheme={() => {
            setSettings(prev => ({
              ...prev,
              appearance: theme === 'dark' ? 'light' : 'dark'
            }));
          }}
          downloads={downloads}
        />

        {/* View switcher area */}
        <div id="view-content-canvas" className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950/40 relative">
          <AnimatePresence mode="wait">
            
            {/* VIEW 0: HOME LANDING DASHBOARD */}
            {(currentView === 'home' || (currentView === 'download-center' && lastNonDownloadCenterState?.view === 'home')) && (
              <motion.div
                key="home-canvas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={currentView === 'download-center' ? 'hidden' : ''}
              >
                <HomeView 
                  setCurrentView={navigateTo}
                  setActivePlatform={(p) => {
                    setActivePlatform(p);
                    setPresetUsername('');
                    setExplorerTabActive(false);
                  }}
                  downloads={downloads}
                  exports={exports}
                  history={history}
                  onSelectAction={handleSelectHistoryAction}
                />
              </motion.div>
            )}

            {/* VIEW 1: TOOLS (CAPTURER AND EXPLORER PANEL) */}
            {(currentView === 'tools' || (currentView === 'download-center' && lastNonDownloadCenterState?.view === 'tools')) && (
              <motion.div
                key="tools-canvas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={currentView === 'download-center' ? 'hidden' : 'space-y-4'}
              >
                {/* TOOL SEGMENTED SELECTOR: EXCLUSIVE DOWNLOAD TOOLS vs ACCOUNT EXPLORER */}
                <div className="h-14 border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-6 sm:px-8 flex items-center justify-between shadow-sm shrink-0">
                  <div className="flex gap-4">
                    <button
                      id="tools-tab-exclusive"
                      onClick={() => setExplorerTabActive(false)}
                      className={`text-xs font-extrabold pb-3 pt-4 border-b-2 transition ${
                        !explorerTabActive 
                          ? 'border-orange-500 text-orange-500' 
                          : 'border-transparent text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }`}
                    >
                      Standalone & All Downloader
                    </button>
                    <button
                      id="tools-tab-explorer"
                      onClick={() => setExplorerTabActive(true)}
                      className={`text-xs font-extrabold pb-3 pt-4 border-b-2 transition flex items-center gap-1.5 ${
                        explorerTabActive 
                          ? 'border-orange-500 text-orange-500' 
                          : 'border-transparent text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" />
                      Account Profile Explorer
                    </button>
                  </div>
                </div>

                {!explorerTabActive ? (
                  <PlatformTools 
                    platform={activePlatform}
                    user={user}
                    onAddDownload={handleAddDownload}
                    onAddExportLog={handleAddExportLog}
                    openAuth={openAuth}
                    setExplorerActiveUsername={(usr) => setPresetUsername(usr)}
                    setExplorerActiveTab={() => setExplorerTabActive(true)}
                    selectedToolType={selectedToolType}
                    setSelectedToolType={setSelectedToolType}
                  />
                ) : (
                  <AccountExplorerView 
                    platform={activePlatform}
                    user={user}
                    onAddDownload={handleAddDownload}
                    onAddExportLog={handleAddExportLog}
                    openAuth={openAuth}
                    presetUsername={presetUsername}
                  />
                )}
              </motion.div>
            )}

            {/* VIEW 2: DOWNLOAD CENTER (GLOBAL SYSTEM STATUS) */}
            {currentView === 'download-center' && (
              <motion.div
                key="download-center-canvas"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <DownloadCenter 
                  downloads={downloads}
                  exports={exports}
                  onPause={handlePauseDownload}
                  onResume={handleResumeDownload}
                  onCancel={handleCancelDownload}
                  onRetry={handleRetryDownload}
                  onDelete={handleDeleteDownload}
                  onDownloadAgain={handleDownloadAgain}
                  onClearExports={() => setExports([])}
                  onDeleteExport={(id) => setExports(prev => prev.filter(e => e.id !== id))}
                />
              </motion.div>
            )}

            {/* VIEW 3: PRICING (STRIPE TRIAL & BILLING MANAGER) */}
            {(currentView === 'pricing' || (currentView === 'download-center' && lastNonDownloadCenterState?.view === 'pricing')) && (
              <motion.div
                key="pricing-canvas"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={currentView === 'download-center' ? 'hidden' : ''}
              >
                <PricingSection 
                  user={user}
                  onUpgradePlan={handleUpgradePlan}
                  openAuth={openAuth}
                  invoices={invoices}
                />
              </motion.div>
            )}

            {/* VIEW 4: SETTINGS (CHATGPT-LIKE MODULATOR) */}
            {(currentView === 'settings' || (currentView === 'download-center' && lastNonDownloadCenterState?.view === 'settings')) && (
              <motion.div
                key="settings-canvas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={currentView === 'download-center' ? 'hidden' : ''}
              >
                <SettingsModal 
                  user={user}
                  settings={settings}
                  onUpdateSettings={(updated) => setSettings(updated)}
                  onUpdateTheme={(themeId) => {
                    setSettings(prev => ({ ...prev, appearance: themeId }));
                  }}
                  openBilling={() => navigateTo('pricing')}
                  onOpenProfile={() => navigateTo('profile')}
                />
              </motion.div>
            )}

            {/* VIEW 5: PROFILE */}
            {(currentView === 'profile' || (currentView === 'download-center' && lastNonDownloadCenterState?.view === 'profile')) && (
              <motion.div
                key="profile-canvas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={currentView === 'download-center' ? 'hidden' : ''}
              >
                <Profile />
              </motion.div>
            )}

            {/* VIEW 6: DOWNLOAD HISTORY */}
            {(currentView === 'download-history' || (currentView === 'download-center' && lastNonDownloadCenterState?.view === 'download-history')) && (
              <motion.div
                key="download-history-canvas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={currentView === 'download-center' ? 'hidden' : ''}
              >
                <DownloadHistory />
              </motion.div>
            )}

            {/* VIEW 7: SAVED EXPORTS */}
            {(currentView === 'saved-exports' || (currentView === 'download-center' && lastNonDownloadCenterState?.view === 'saved-exports')) && (
              <motion.div
                key="saved-exports-canvas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={currentView === 'download-center' ? 'hidden' : ''}
              >
                <SavedExports />
              </motion.div>
            )}

            {/* VIEW 8: HELP CENTER */}
            {(currentView === 'help' || (currentView === 'download-center' && lastNonDownloadCenterState?.view === 'help')) && (
              <motion.div
                key="help-canvas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={currentView === 'download-center' ? 'hidden' : ''}
              >
                <HelpCenterView />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* 3. SECURITY GATE AUTH MODAL */}
      <AuthModal 
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        devices={devices}
        setDevices={setDevices}
      />

      {/* 4. TEMPORARY FILE DOWNLOAD POPUP (AUTO HIDES IN 1S, NO PERCENTAGE/HISTORY) */}
      <AnimatePresence>
        {activeDownloadPopupFile && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[70px] right-[20px] bg-zinc-900/95 border border-zinc-800 text-white dark:bg-zinc-100 dark:border-zinc-200 dark:text-zinc-900 px-5 py-3 rounded-xl shadow-2xl z-[9999] flex items-center gap-3 w-72 backdrop-blur-md font-sans"
          >
            <Download className="w-4 h-4 text-orange-500 shrink-0 animate-pulse" />
            <span className="text-xs font-mono font-bold truncate flex-1 block">
              {activeDownloadPopupFile}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

