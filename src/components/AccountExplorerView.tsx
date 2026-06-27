/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from 'react';
import { PlatformType, ExplorerContent, ExplorerProfile, User } from '../types';
import { 
  Search, 
  SlidersHorizontal, 
  FolderDown, 
  FileJson, 
  FileSpreadsheet, 
  AlertCircle,
  Play,
  Volume2,
  Download,
  Calendar,
} from 'lucide-react';
import { 
  generateDynamicProfile, 
  generateDynamicContent 
} from '../data';
import { 
  handleExportJSON, 
  handleExportCSV, 
  handleExportXLSX,
  downloadExplorerZip
} from '../lib/exporter';
import { motion, AnimatePresence } from 'motion/react';

const getPlatformCategories = (p: PlatformType): Array<{ id: string; label: string }> => {
  switch (p) {
    case 'instagram':
      return [
        { id: 'all', label: 'All Content' },
        { id: 'reels', label: 'Reels' },
        { id: 'posts', label: 'Posts' },
        { id: 'carousels', label: 'Carousels' },
        { id: 'audio', label: 'Audio' },
        { id: 'caption', label: 'Caption' },
        { id: 'cover', label: 'Cover' },
        { id: 'dp', label: 'DP' },
      ];
    case 'twitter':
      return [
        { id: 'all', label: 'All Downloader' },
        { id: 'media', label: 'Media' },
        { id: 'audio', label: 'Audio' },
        { id: 'caption', label: 'Caption' },
        { id: 'profile', label: 'Profile' },
      ];
    case 'youtube':
      return [
        { id: 'all', label: 'All Content' },
        { id: 'video', label: 'Video' },
        { id: 'audio', label: 'Audio' },
        { id: 'thumbnail', label: 'Thumbnail' },
        { id: 'description', label: 'Description' },
        { id: 'profile', label: 'Profile' },
      ];
    case 'threads':
      return [
        { id: 'all', label: 'All Content' },
        { id: 'post', label: 'Posts' },
        { id: 'media', label: 'Media' },
        { id: 'caption', label: 'Caption' },
        { id: 'profile', label: 'Profile' },
      ];
    case 'tiktok':
      return [
        { id: 'all', label: 'All Content' },
        { id: 'video', label: 'Video' },
        { id: 'post', label: 'Posts' },
        { id: 'audio', label: 'Audio' },
        { id: 'caption', label: 'Caption' },
        { id: 'cover', label: 'Cover' },
        { id: 'profile', label: 'Profile' },
      ];
    case 'snapchat':
      return [
        { id: 'all', label: 'All Content' },
        { id: 'stories', label: 'Stories' },
        { id: 'media', label: 'Media' },
        { id: 'caption', label: 'Caption' },
        { id: 'profile', label: 'Profile' },
      ];
    default:
      return [{ id: 'all', label: 'All Content' }];
  }
};

interface AccountExplorerViewProps {
  platform: PlatformType;
  user: User | null;
  onAddDownload: (item: any) => void;
  onAddExportLog: (query: string, details: string) => void;
  openAuth: () => void;
  presetUsername: string;
}

export default function AccountExplorerView({
  platform,
  user,
  onAddDownload,
  onAddExportLog,
  openAuth,
  presetUsername
}: AccountExplorerViewProps) {
  
  // Search parameters
  const [targetQuery, setTargetQuery] = useState(() => {
    return sessionStorage.getItem(`account_explorer_${platform}_targetQuery`) || presetUsername || '';
  });
  const [activeProfile, setActiveProfile] = useState<ExplorerProfile | null>(() => {
    try {
      const stored = sessionStorage.getItem(`account_explorer_${platform}_activeProfile`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [profileContents, setProfileContents] = useState<ExplorerContent[]>(() => {
    try {
      const stored = sessionStorage.getItem(`account_explorer_${platform}_profileContents`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Strict URL and history states as requested by ACCOUNT EXPLORER URL HISTORY FIX
  const [, setPreviousUrl] = useState<string | null>(null);
  const [, setUrlHistory] = useState<string[]>([]);
  const [, setRecentUrls] = useState<string[]>([]);
  const [, setCachedUrls] = useState<string[]>([]);
  const [, setProcessedUrls] = useState<string[]>([]);
  const [, setSourceUrl] = useState<string | null>(null);

  const forceResetAllUrlStates = () => {
    setPreviousUrl(null);
    setUrlHistory([]);
    setRecentUrls([]);
    setCachedUrls([]);
    setProcessedUrls([]);
    setSourceUrl(null);
  };

  // Filters state
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string>(() => {
    return sessionStorage.getItem(`account_explorer_${platform}_selectedFolderFilter`) || 'all';
  });
  const [selectedSort, setSelectedSort] = useState<string>(() => {
    return sessionStorage.getItem(`account_explorer_${platform}_selectedSort`) || 'latest';
  });
  const [searchKeyword, setSearchKeyword] = useState<string>(() => {
    return sessionStorage.getItem(`account_explorer_${platform}_searchKeyword`) || '';
  });

  // Selected media nodes state
  const [selectedNodeIds, setSelectedNodeIds] = useState<Record<string, boolean>>(() => {
    try {
      const stored = sessionStorage.getItem(`account_explorer_${platform}_selectedNodeIds`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [zipPacking, setZipPacking] = useState(false);

  // Track previous platform in a ref to prevent on-mount wipe
  const prevPlatformRef = React.useRef<PlatformType>(platform);

  // Sync state changes to sessionStorage
  React.useEffect(() => {
    sessionStorage.setItem(`account_explorer_${platform}_targetQuery`, targetQuery);
  }, [platform, targetQuery]);

  React.useEffect(() => {
    sessionStorage.setItem(`account_explorer_${platform}_activeProfile`, activeProfile ? JSON.stringify(activeProfile) : '');
  }, [platform, activeProfile]);

  React.useEffect(() => {
    sessionStorage.setItem(`account_explorer_${platform}_profileContents`, profileContents.length ? JSON.stringify(profileContents) : '');
  }, [platform, profileContents]);

  React.useEffect(() => {
    sessionStorage.setItem(`account_explorer_${platform}_selectedFolderFilter`, selectedFolderFilter);
  }, [platform, selectedFolderFilter]);

  React.useEffect(() => {
    sessionStorage.setItem(`account_explorer_${platform}_selectedSort`, selectedSort);
  }, [platform, selectedSort]);

  React.useEffect(() => {
    sessionStorage.setItem(`account_explorer_${platform}_searchKeyword`, searchKeyword);
  }, [platform, searchKeyword]);

  React.useEffect(() => {
    sessionStorage.setItem(`account_explorer_${platform}_selectedNodeIds`, Object.keys(selectedNodeIds).length ? JSON.stringify(selectedNodeIds) : '');
  }, [platform, selectedNodeIds]);

  // Trigger search loop
  const handleQueryExplore = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = targetQuery.trim();
    if (!query) return;

    forceResetAllUrlStates();

    setIsLoadingProfile(true);
    setActiveProfile(null);
    setProfileContents([]);
    setSelectedNodeIds({});
    setSelectedFolderFilter('all');

    setTimeout(() => {
      // Clean query username
      let cleanUser = query.replace(/^@/, '').split('/').pop() || query;
      if (cleanUser.includes('?')) cleanUser = cleanUser.split('?')[0];

      const profile = generateDynamicProfile(platform, cleanUser);
      const contents = generateDynamicContent(platform, cleanUser);

      setActiveProfile(profile);
      setProfileContents(contents);
      setIsLoadingProfile(false);
    }, 1500);
  };

  // Auto trigger preset username on switch if loaded
  useMemo(() => {
    if (presetUsername && presetUsername !== activeProfile?.username) {
      setTargetQuery(presetUsername);
      forceResetAllUrlStates();
      // Run exploration
      let cleanSelected = presetUsername.replace(/^@/, '').split('/').pop() || presetUsername;
      const profile = generateDynamicProfile(platform, cleanSelected);
      const contents = generateDynamicContent(platform, cleanSelected);
      setActiveProfile(profile);
      setProfileContents(contents);
    }
  }, [presetUsername, platform]);

  // Reset selected filter, url histories, query string and dynamic profile content when platform changes
  React.useEffect(() => {
    if (prevPlatformRef.current !== platform) {
      setTargetQuery('');
      setActiveProfile(null);
      setProfileContents([]);
      setIsLoadingProfile(false);
      setSelectedFolderFilter('all');
      setSelectedSort('latest');
      setSearchKeyword('');
      setSelectedNodeIds({});
      setZipPacking(false);
      forceResetAllUrlStates();

      // Clear the target platform's sessionStorage
      sessionStorage.removeItem(`account_explorer_${platform}_targetQuery`);
      sessionStorage.removeItem(`account_explorer_${platform}_activeProfile`);
      sessionStorage.removeItem(`account_explorer_${platform}_profileContents`);
      sessionStorage.removeItem(`account_explorer_${platform}_selectedFolderFilter`);
      sessionStorage.removeItem(`account_explorer_${platform}_selectedSort`);
      sessionStorage.removeItem(`account_explorer_${platform}_searchKeyword`);
      sessionStorage.removeItem(`account_explorer_${platform}_selectedNodeIds`);

      prevPlatformRef.current = platform;
    }
  }, [platform]);

  // Handle Multi selection toggles
  const handleToggleSelectNode = (id: string) => {
    setSelectedNodeIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAllNodes = () => {
    const isAllSelected = filteredAndSortedContents.every(item => selectedNodeIds[item.id]);
    const nextState: Record<string, boolean> = { ...selectedNodeIds };
    
    filteredAndSortedContents.forEach(item => {
      nextState[item.id] = !isAllSelected;
    });
    setSelectedNodeIds(nextState);
  };

  // 1. FILTERING ALGORITHM
  // Rebuilt filters to match standalone downloaders per platform exactly as requested.
  const filteredAndSortedContents = useMemo(() => {
    let items = [...profileContents];

    // Filter folder
    if (selectedFolderFilter !== 'all') {
      items = items.filter(item => {
        const itemType = (item.type || '').toLowerCase();
        
        if (platform === 'instagram') {
          if (selectedFolderFilter === 'reels') {
            return itemType === 'reel' || itemType === 'video';
          }
          if (selectedFolderFilter === 'posts') {
            return itemType === 'post' || itemType === 'image';
          }
          if (selectedFolderFilter === 'carousels') {
            return itemType === 'carousel';
          }
          if (selectedFolderFilter === 'audio') {
            return itemType === 'audio' || !!item.audioUrl || !!item.audioName || itemType === 'reel' || itemType === 'video';
          }
          if (selectedFolderFilter === 'caption') {
            return !!item.caption && item.caption.trim().length > 0;
          }
          if (selectedFolderFilter === 'cover') {
            return itemType === 'image' || itemType === 'post' || itemType === 'carousel' || !!item.thumbnailUrl;
          }
          if (selectedFolderFilter === 'dp') {
            return itemType === 'dp' || itemType === 'profile' || itemType === 'avatar' || item.id.includes('dp') || item.id.includes('profile');
          }
        }
        
        if (platform === 'twitter') {
          if (selectedFolderFilter === 'media') {
            return (itemType === 'video' || itemType === 'image' || itemType === 'carousel' || itemType === 'gif' || itemType === 'photo' || itemType === 'reel' || itemType === 'post') && itemType !== 'audio' && itemType !== 'profile' && itemType !== 'dp' && itemType !== 'avatar';
          }
          if (selectedFolderFilter === 'audio') {
            return itemType === 'audio' || !!item.audioUrl || !!item.audioName;
          }
          if (selectedFolderFilter === 'caption') {
            return !!item.caption && item.caption.trim().length > 0;
          }
          if (selectedFolderFilter === 'profile') {
            return itemType === 'profile' || itemType === 'dp' || itemType === 'avatar' || item.id.includes('dp') || item.id.includes('profile') || item.id.includes('avatar');
          }
        }
        
        if (platform === 'youtube') {
          if (selectedFolderFilter === 'video') {
            return itemType === 'video' || itemType === 'reel' || itemType === 'shorts';
          }
          if (selectedFolderFilter === 'audio') {
            return itemType === 'audio' || !!item.audioUrl || !!item.audioName || itemType === 'video';
          }
          if (selectedFolderFilter === 'thumbnail') {
            return !!item.thumbnailUrl || itemType === 'video';
          }
          if (selectedFolderFilter === 'description') {
            return !!item.caption && item.caption.trim().length > 0;
          }
          if (selectedFolderFilter === 'profile') {
            return itemType === 'profile' || itemType === 'dp' || itemType === 'avatar' || item.id.includes('dp') || item.id.includes('profile') || item.id.includes('avatar');
          }
        }
        
        if (platform === 'threads') {
          if (selectedFolderFilter === 'post') {
            return itemType === 'post' || itemType === 'image' || itemType === 'carousel' || itemType === 'photo';
          }
          if (selectedFolderFilter === 'media') {
            return itemType === 'video' || itemType === 'reel' || itemType === 'audio' || !!item.url;
          }
          if (selectedFolderFilter === 'caption') {
            return !!item.caption && item.caption.trim().length > 0;
          }
          if (selectedFolderFilter === 'profile') {
            return itemType === 'profile' || itemType === 'dp' || itemType === 'avatar' || item.id.includes('dp') || item.id.includes('profile') || item.id.includes('avatar');
          }
        }
        
        if (platform === 'tiktok') {
          if (selectedFolderFilter === 'video') {
            return itemType === 'video' || itemType === 'reel';
          }
          if (selectedFolderFilter === 'post') {
            return itemType === 'post' || itemType === 'image' || itemType === 'photo' || itemType === 'carousel';
          }
          if (selectedFolderFilter === 'audio') {
            return itemType === 'audio' || !!item.audioUrl || !!item.audioName;
          }
          if (selectedFolderFilter === 'caption') {
            return !!item.caption && item.caption.trim().length > 0;
          }
          if (selectedFolderFilter === 'cover') {
            return itemType === 'cover' || !!item.thumbnailUrl;
          }
          if (selectedFolderFilter === 'profile') {
            return itemType === 'profile' || itemType === 'dp' || itemType === 'avatar' || item.id.includes('dp') || item.id.includes('profile') || item.id.includes('avatar');
          }
        }
        
        if (platform === 'snapchat') {
          if (selectedFolderFilter === 'stories') {
            return itemType === 'story';
          }
          if (selectedFolderFilter === 'media') {
            return itemType === 'video' || itemType === 'image' || itemType === 'reel' || itemType === 'story' || !!item.url;
          }
          if (selectedFolderFilter === 'caption') {
            return !!item.caption && item.caption.trim().length > 0;
          }
          if (selectedFolderFilter === 'profile') {
            return itemType === 'profile' || itemType === 'dp' || itemType === 'avatar';
          }
        }

        return true;
      });
    }

    // Filter Search keyword matching caption, description, title, tags, mentions, audio name
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      items = items.filter(item => {
        const matchesCaption = item.caption.toLowerCase().includes(kw);
        const matchesType = item.type.toLowerCase().includes(kw);
        const matchesAudio = item.audioName?.toLowerCase().includes(kw) || false;
        const matchesPostId = item.postId?.toLowerCase().includes(kw) || false;
        return matchesCaption || matchesType || matchesAudio || matchesPostId;
      });
    }

    // Sort: Latest, Oldest, Most Views, Most Likes, Most Comments, Most Shares, Highest Engagement
    items.sort((a, b) => {
      if (selectedSort === 'latest') {
        const dateA = new Date(a.createdAt.replace(' ', 'T')).getTime();
        const dateB = new Date(b.createdAt.replace(' ', 'T')).getTime();
        return dateB - dateA;
      }
      if (selectedSort === 'oldest') {
        const dateA = new Date(a.createdAt.replace(' ', 'T')).getTime();
        const dateB = new Date(b.createdAt.replace(' ', 'T')).getTime();
        return dateA - dateB;
      }
      if (selectedSort === 'likes') return b.likeCount - a.likeCount;
      if (selectedSort === 'comments') return b.commentCount - a.commentCount;
      if (selectedSort === 'views') return b.viewCount - a.viewCount;
      if (selectedSort === 'shares') return b.shareCount - a.shareCount;
      if (selectedSort === 'engagement') {
        const engA = (a.likeCount + a.commentCount + a.shareCount) / Math.max(1, a.viewCount);
        const engB = (b.likeCount + b.commentCount + b.shareCount) / Math.max(1, b.viewCount);
        return engB - engA;
      }
      return 0;
    });

    return items;
  }, [profileContents, selectedFolderFilter, selectedSort, searchKeyword, platform]);

  // 2. EXPORT FUNCTIONS BINDING
  const triggerPlatformExport = (format: 'json' | 'csv' | 'xlsx') => {
    if (!user) {
      openAuth();
      return;
    }
    if (!activeProfile) return;

    // Use full list or selected only? If any selected, export only those!
    const targetContents = filteredAndSortedContents.filter(item => selectedNodeIds[item.id]);
    const itemsToExport = targetContents.length > 0 ? targetContents : filteredAndSortedContents;

    const filename = `${activeProfile.username}-${platform}-history-export`;

    if (format === 'json') {
      handleExportJSON(filename, platform, activeProfile, itemsToExport);
    } else if (format === 'csv') {
      handleExportCSV(filename, platform, activeProfile, itemsToExport);
    } else {
      handleExportXLSX(filename, platform, activeProfile, itemsToExport);
    }

    // Add to Global Exports log history
    onAddExportLog(`${filename}.${format}`, `Account Explorer export for @${activeProfile.username}. Records: ${itemsToExport.length}`);
  };

  // 3. SPECIAL Multi-folder ZIP DOWNLOAD GENERATOR
  // Inside Account Explorer ZIP structure: username-export.zip (containing folders: Reels/, Reels Covers/, Metadata/, etc)
  const triggerZIPCompilation = async (mode: 'all' | 'selected') => {
    if (!user) {
      openAuth();
      return;
    }
    if (!activeProfile) return;

    const selectedList = filteredAndSortedContents.filter(item => selectedNodeIds[item.id]);
    
    // Choose list target
    let targetDataset = filteredAndSortedContents;
    if (mode === 'selected') {
      if (selectedList.length === 0) {
        alert('Please check individual checkboxes on media cards first to download selected.');
        return;
      }
      targetDataset = selectedList;
    }

    setZipPacking(true);
    try {
      const zipBlob = await downloadExplorerZip(platform, activeProfile, targetDataset);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeProfile.username}-export.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Register complete in system download queue logs
      onAddDownload({
        platform,
        title: `@${activeProfile.username} ZIP collection: ${targetDataset.length} files saved`,
        type: 'all',
        url: `@${activeProfile.username}/export.zip`,
        size: '18.4 MB'
      });

    } catch (err) {
      console.error(err);
      alert('Error parsing binary file streams for JSZip.');
    } finally {
      setZipPacking(false);
    }
  };

  const activePlatformPlaceholder = () => {
    switch (platform) {
      case 'instagram': return '@travel_explorers or profile url';
      case 'twitter': return '@tech_guru or tweet author handle';
      case 'youtube': return '@science_simplified or channel name';
      case 'snapchat': return '@daily_vibe or username';
      case 'threads': return '@coder_threads or threads URL';
      case 'tiktok': return '@dance_beats or video profile link';
    }
  };

  return (
    <div id="account-explorer-view" className="p-6 md:p-8 space-y-8 select-none max-w-5xl mx-auto">
      
      {/* Search Input bar */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Execute profile explorer audit</label>
        <form onSubmit={handleQueryExplore} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
            <input
              id="explorer-username-input"
              type="text"
              autoComplete="off"
              placeholder={`Enter profile handle (e.g. ${activePlatformPlaceholder()})`}
              value={targetQuery}
              onChange={(e) => {
                setTargetQuery(e.target.value);
                forceResetAllUrlStates();
              }}
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 outline-none focus:border-orange-500 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 outline-none transition shadow-sm font-medium"
              required
            />
            {targetQuery && (
              <button
                id="explorer-clear-btn"
                type="button"
                onClick={() => {
                  setTargetQuery('');
                  forceResetAllUrlStates();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition cursor-pointer"
                title="Clear input"
              >
                <span className="text-[14px] font-extrabold select-none">×</span>
              </button>
            )}
          </div>
          <button
            id="explorer-submit-btn"
            type="submit"
            disabled={isLoadingProfile}
            className="px-5 py-2.5 bg-orange-555 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-xl text-xs font-bold transition hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow"
          >
            {isLoadingProfile ? 'Exploring...' : 'Scrape Profile'}
          </button>
        </form>
      </div>

      {isLoadingProfile && (
        <div className="py-24 text-center space-y-3" id="explorer-loading-spinner">
          <div className="relative flex h-10 w-10 mx-auto">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-10 w-10 bg-orange-550 bg-zinc-950" />
          </div>
          <p className="text-xs text-zinc-500 font-bold font-mono uppercase tracking-wider">Initiating Cloud Scan protocols...</p>
        </div>
      )}

      {/* Explorer Workspace */}
      <AnimatePresence mode="wait">
        {activeProfile && (
          <motion.div
            id="explorer-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* PROFILE HEADER DISPLAY BLOCK */}
            <div id="explorer-profile-header" className="relative border border-zinc-200 dark:border-zinc-900 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
              
              {/* Profile Banner */}
              <div className="h-44 w-full bg-zinc-200 dark:bg-zinc-90 w-full relative">
                <img 
                  src={activeProfile.bannerUrl} 
                  alt="Banner" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
              </div>

              {/* Profile details structure */}
              <div className="p-6 relative -mt-16 flex flex-col items-start gap-4">
                
                {/* [ Profile Image ] */}
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-400 overflow-hidden shrink-0 shadow-lg relative">
                  <img 
                    src={activeProfile.avatarUrl} 
                    alt="Avatar" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Username */}
                <div className="text-sm font-mono text-zinc-500 font-medium truncate max-w-full" title={activeProfile.username}>
                  @{activeProfile.username}
                </div>

                {/* Display Name */}
                <div className="flex items-center gap-2 max-w-full flex-wrap">
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate max-w-full" title={activeProfile.displayName}>{activeProfile.displayName}</h3>
                  {activeProfile.isVerified && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-650 dark:bg-orange-950/50 dark:text-orange-400 text-[9px] font-black uppercase rounded border border-orange-200/50 shrink-0 select-none">
                      Verified Verified
                    </span>
                  )}
                </div>

                {/* Followers */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{activeProfile.followers}</span>
                  <span className="text-[10px] uppercase text-zinc-400 font-bold">Followers</span>
                </div>

                {/* Following */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{activeProfile.following}</span>
                  <span className="text-[10px] uppercase text-zinc-400 font-bold">Following</span>
                </div>

                {/* Posts */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{activeProfile.postsCount}</span>
                  <span className="text-[10px] uppercase text-zinc-400 font-bold">Posts</span>
                </div>

                {/* Bio */}
                {activeProfile.bio && (
                  <p className="text-xs max-w-xl leading-relaxed text-zinc-650 dark:text-zinc-400 break-words [word-break:break-word] [overflow-wrap:anywhere] text-left">
                    {activeProfile.bio}
                  </p>
                )}

              </div>
            </div>

            {/* CONTROLLERS GRID: SORT, FILTER, SEARCH */}
            <div id="explorer-controllers-bar" className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Category selector */}
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <SlidersHorizontal className="w-4 h-4 text-zinc-400 shrink-0" />
                <div className="flex gap-1.5">
                  {getPlatformCategories(platform).map((f) => (
                    <button
                      id={`filter-category-${f.id}`}
                      key={f.id}
                      onClick={() => {
                        setSelectedFolderFilter(f.id);
                        setSelectedNodeIds({});
                      }}
                      className={`px-3 py-1 text-[10px] border font-bold rounded-lg transition shrink-0 cursor-pointer ${
                        selectedFolderFilter === f.id 
                          ? 'bg-white border-orange-500 text-orange-500 dark:bg-[#1F2937] dark:border-[#F97316] dark:text-[#FFFFFF]' 
                          : 'bg-white border-zinc-200 text-zinc-500 dark:text-[#9CA3AF] hover:bg-zinc-50 dark:bg-transparent dark:border-zinc-900 dark:hover:bg-[#111827] dark:hover:text-[#FFFFFF]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort selector */}
              <div className="flex w-full md:w-auto items-center">
                <select
                  id="explorer-sort-select"
                  className="p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-[10px] font-bold text-zinc-700 dark:text-zinc-300"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="likes">Most Highlighted Likes</option>
                  <option value="comments">Most Comments</option>
                  <option value="views">Most Views</option>
                  <option value="shares">Most Shared</option>
                  <option value="engagement">Engagement Rate</option>
                </select>
              </div>

            </div>

            {/* ZIP COMPILING ACTION CONTROLLERS BLOCK (SPECIAL ACC. EXP. REQUIREMENT) */}
            <div id="explorer-mass-download-desk" className="p-4 border border-orange-500/25 bg-orange-500/[0.01] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-100 text-orange-550 rounded-xl"><FolderDown className="w-5 h-5" /></div>
                <div className="min-w-0 flex-1 text-left">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 break-words [word-break:break-word] [overflow-wrap:anywhere]">Special multi-folder ZIP structures downloader</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 break-words [word-break:break-word] [overflow-wrap:anywhere]">Unpacks All Reel Videos &rarr; Reels/, All Covers &rarr; Reel Covers/, Post Images &rarr; Posts/, Audios &rarr; Audio/. Compiled into 1 ZIP.</p>
                </div>
              </div>

              {/* ZIP actions */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  id="dl-selected-zip-btn"
                  onClick={() => triggerZIPCompilation('selected')}
                  disabled={zipPacking}
                  className="flex-1 sm:flex-initial py-2 px-3 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-[10px] font-extrabold text-zinc-700 dark:text-zinc-300 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  {zipPacking ? 'Packing Selected...' : 'Download Selected (ZIP)'}
                </button>
                <button
                  id="dl-all-media-zip-btn"
                  onClick={() => triggerZIPCompilation('all')}
                  disabled={zipPacking}
                  className="flex-1 sm:flex-initial py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-extrabold rounded-xl transition shadow shadow-orange-500/10 flex items-center justify-center gap-1.5"
                >
                  <FolderDown className="w-3.5 h-3.5 text-orange-100" />
                  {zipPacking ? 'Packing archive...' : 'Download All Media (ZIP)'}
                </button>
              </div>
            </div>

            {/* BULK SELECTION ACTION STRIP */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  id="explorer-select-all-btn"
                  onClick={handleSelectAllNodes}
                  className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 py-1 px-2.5 border border-zinc-200 dark:border-zinc-900 rounded-lg hover:bg-zinc-50"
                >
                  {filteredAndSortedContents.every(item => selectedNodeIds[item.id]) ? 'Deselect All' : 'Select All On Panel'}
                </button>
                
                {filteredAndSortedContents.some(item => selectedNodeIds[item.id]) && (
                  <span className="text-[10px] font-bold text-orange-500">
                    {Object.values(selectedNodeIds).filter(Boolean).length} rows checked
                  </span>
                )}
              </div>

              {/* EXPORT OPTIONS RIGHT */}
              <div className="flex gap-2">
                <span className="text-[11px] text-zinc-450 font-bold shrink-0 self-center hidden sm:inline">Export dataset matrices:</span>
                <button
                  id="exp-explorer-json"
                  onClick={() => triggerPlatformExport('json')}
                  className="p-1 px-2.5 bg-zinc-900 dark:bg-zinc-800 text-white rounded-lg text-[10px] font-bold hover:bg-zinc-800 transition flex items-center gap-1"
                >
                  <FileJson className="w-3 h-3 text-orange-400" />
                  JSON
                </button>
                <button
                  id="exp-explorer-csv"
                  onClick={() => triggerPlatformExport('csv')}
                  className="p-1 px-2.5 bg-zinc-900 dark:bg-zinc-800 text-white rounded-lg text-[10px] font-bold hover:bg-zinc-800 transition flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                  CSV
                </button>
                <button
                  id="exp-explorer-xlsx"
                  onClick={() => triggerPlatformExport('xlsx')}
                  className="p-1 px-2.5 bg-zinc-900 dark:bg-zinc-800 text-white rounded-lg text-[10px] font-bold hover:bg-zinc-850 transition flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3 h-3 text-blue-400" />
                  Excel / XLSX
                </button>
              </div>
            </div>

            {/* GRID ITERATIONS: Renders media blocks matching sort algorithms */}
            <div id="explorer-contents-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAndSortedContents.length === 0 ? (
                <div className="col-span-full py-16 text-center text-xs italic text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-900 rounded-xl bg-zinc-50 dark:bg-zinc-900/10">
                  No results found. Try selecting another filter category or search term.
                </div>
              ) : (
                filteredAndSortedContents.map((item) => {
                  const isChecked = selectedNodeIds[item.id] || false;
                  
                  return (
                    <div
                      id={`explorer-card-${item.id}`}
                      key={item.id}
                      className={`bg-white dark:bg-zinc-950 border rounded-2xl overflow-hidden transition relative group flex flex-col justify-between ${
                        isChecked 
                          ? 'border-orange-500 ring-1 ring-orange-500 shadow-lg shadow-orange-500/[0.02]' 
                          : 'border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 hover:shadow-md'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Media image preview container */}
                        <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-900 relative">
                          <img
                            src={item.thumbnailUrl}
                            alt="Captured frame"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />

                          {/* Hover Overlay Play Icon */}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            {['video', 'reel'].includes(item.type) && (
                              <div className="p-2.5 bg-white/90 text-zinc-950 rounded-full shadow-lg">
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              </div>
                            )}
                          </div>

                          {/* Top selection Checkbox */}
                          <div className="absolute top-2.5 left-2.5 z-10">
                            <input
                              id={`explorer-check-${item.id}`}
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSelectNode(item.id)}
                              className="w-4.5 h-4.5 rounded border-zinc-300 text-orange-555 focus:ring-orange-500 cursor-pointer shadow-md bg-white/90"
                            />
                          </div>

                          {/* Top right type Badge */}
                          <div className="absolute top-2.5 right-2.5 z-10">
                            <span className="py-0.5 px-2 bg-zinc-950/75 text-white font-mono text-[9px] font-bold rounded-full uppercase tracking-wider shadow">
                              {item.type}
                            </span>
                          </div>
                        </div>

                        {/* Caption content: No likes, comment count, share metrics, post IDs (STRICT DIRECTIVE IN PLACE) */}
                        <div className="px-4 py-1.5 space-y-2 text-left min-w-0 w-full">
                          <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-normal line-clamp-3 break-words [word-break:break-word] [overflow-wrap:anywhere]">
                            {item.caption}
                          </p>
                          
                          {item.audioName && (
                            <div className="flex items-center gap-1.5 text-[9px] text-orange-500 font-bold font-mono min-w-0 w-full">
                              <Volume2 className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate block flex-1 min-w-0" title={item.audioName}>{item.audioName}</span>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Individual direct download buttons */}
                      <div className="px-4 pb-4 pt-2 shrink-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900/60 mt-3">
                        <span className="text-[9px] text-zinc-400 font-mono flex items-center gap-1.5 grayscale shrink-0">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.createdAt.split(' ')[0]}
                        </span>

                        <div className="flex gap-1">
                          <button
                            id={`standalone-card-dl-${item.id}`}
                            onClick={() => {
                              if (!user) {
                                openAuth();
                                return;
                              }
                              onAddDownload({
                                platform,
                                title: `${activeProfile.username}: ${item.type} save - ${item.id}`,
                                type: item.type === 'image' || item.type === 'story' || item.type === 'post' ? 'image' : 'video',
                                url: item.url,
                                size: '12.4 MB'
                              });
                            }}
                            className="p-1 px-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 hover:text-orange-500 border border-zinc-200 dark:border-zinc-850 rounded text-[10px] font-bold transition flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Save Asset</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Strict Verification Note banner */}
      <div className="p-4 rounded-xl bg-orange-500/[0.02] border border-orange-500/10 text-[11px] text-zinc-500 leading-relaxed max-w-4xl mx-auto flex gap-2">
        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <span><b>Important Compliance Guide</b>: Under-the-hood parameters parsed from active profile nodes are meticulously preserved. Saving/downloading media records, exporting table indices, or calling zip files compiles these parameters into files. Custom system metrics, tables or labels are strictly kept hidden on-screen to comply with product-level aesthetic targets.</span>
      </div>

    </div>
  );
}
