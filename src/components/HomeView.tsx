/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  PlatformType, 
  AppView, 
  DownloadItem, 
  HistoryItem 
} from '../types';
import LogoIcon from './LogoIcon';
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Layers, 
  Share2, 
  Tv, 
  Download, 
  Compass, 
  ArrowRight, 
  Clock, 
  Database,
  FileJson,
  FileSpreadsheet,
  Cpu,
  TrendingUp,
  History,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  setCurrentView: (view: AppView) => void;
  setActivePlatform: (platform: PlatformType) => void;
  downloads: DownloadItem[];
  exports: HistoryItem[];
  history: HistoryItem[];
  onSelectAction: (type: 'search' | 'explorer' | 'all_downloader', text: string, platform?: PlatformType) => void;
}

export default function HomeView({
  setCurrentView,
  setActivePlatform,
  downloads,
  exports: exportHistory,
  history,
  onSelectAction
}: HomeViewProps) {

  const platforms = [
    { 
      id: 'instagram' as PlatformType, 
      label: 'Instagram', 
      desc: 'Bulk profile explorer, posts download, and stories backup.',
      toolsCount: 4, 
      icon: Instagram, 
      color: 'from-pink-500 to-rose-500',
      textColor: 'text-pink-500'
    },
    { 
      id: 'twitter' as PlatformType, 
      label: 'Twitter / X', 
      desc: 'Single media grabber, threads backup, and tweet exports.',
      toolsCount: 3, 
      icon: Twitter, 
      color: 'from-blue-400 to-indigo-500',
      textColor: 'text-blue-400'
    },
    { 
      id: 'youtube' as PlatformType, 
      label: 'YouTube', 
      desc: 'Video extraction, channel profile download, and audio extraction.',
      toolsCount: 3, 
      icon: Youtube, 
      color: 'from-red-500 to-orange-600',
      textColor: 'text-red-500'
    },
    { 
      id: 'threads' as PlatformType, 
      label: 'Threads', 
      desc: 'Download high resolution carousel images, videos, and texts.',
      toolsCount: 2, 
      icon: Layers, 
      color: 'from-zinc-700 to-zinc-900',
      textColor: 'text-zinc-500 dark:text-zinc-300'
    },
    { 
      id: 'tiktok' as PlatformType, 
      label: 'TikTok', 
      desc: 'Video grabber without watermark and profile history indexer.',
      toolsCount: 2, 
      icon: Share2, 
      color: 'from-cyan-400 to-teal-500',
      textColor: 'text-cyan-500'
    },
    { 
      id: 'snapchat' as PlatformType, 
      label: 'Snapchat', 
      desc: 'Back up stories, snaps, user indicators, and profile data.',
      toolsCount: 2, 
      icon: Tv, 
      color: 'from-yellow-400 to-amber-500',
      textColor: 'text-yellow-600'
    }
  ];

  const features = [
    { title: 'All Downloader', desc: 'Bulk extract full posts, reels, carousel images, and media packages in seconds.', icon: Download },
    { title: 'Account Explorer', desc: 'Audit profile metadata, view hidden statistics, bio indexes, and engagement factors.', icon: Compass },
    { title: 'Download Center', desc: 'Asynchronous background downloader thread simulation for concurrent task queues.', icon: Activity },
    { title: 'Export System', desc: 'Instant local data package compiling to structured files.', icon: Database, isParent: true },
    { title: 'JSON Export', desc: 'Standard key-value schema format with minimized structures.', icon: FileJson },
    { title: 'CSV Export', desc: 'Compact tabular cell layouts ideal for bulk analytical processing.', icon: FileSpreadsheet },
    { title: 'XLSX Export', desc: 'Perfect spreadsheet sheets detailing engagement values, bio, metrics.', icon: TrendingUp }
  ];

  const handleLaunchPlatform = (platId: PlatformType) => {
    setActivePlatform(platId);
    setCurrentView('tools');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12 dark:text-zinc-100 text-zinc-800">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-100 via-zinc-50 to-orange-50/50 dark:from-zinc-900 dark:via-zinc-950 dark:to-orange-950 border border-zinc-200 dark:border-zinc-850 p-8 sm:p-12 text-zinc-900 dark:text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.06),transparent_60%)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_60%)]" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-3.5">
            <LogoIcon className="w-12 h-12" />
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white">
              Socialintel
            </h1>
          </div>
          <p className="text-lg sm:text-xl font-semibold text-zinc-800 dark:text-zinc-300">
            Professional Social Media Download &amp; Account Intelligence Platform
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Directly parse metrics and grab native media records securely across all dominant networks.
            Designed for data analyst backup, legal preservation, creator index logging, and analytics reporting.
          </p>
          <div className="pt-2 flex flex-wrap gap-2.5">
            {platforms.map(p => {
              const Icon = p.icon;
              return (
                <span 
                  key={p.id} 
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-zinc-200/50 dark:bg-zinc-900 border border-zinc-300/40 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-medium"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {p.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUICK START TRAY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold tracking-tight">Quick Start Platform Anchors</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {platforms.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => handleLaunchPlatform(p.id)}
                className="group p-4 border border-zinc-200 dark:border-zinc-900 rounded-2xl bg-white dark:bg-zinc-950 hover:border-orange-500 dark:hover:border-orange-500 transition-all text-center flex flex-col items-center justify-center gap-3.5"
              >
                <div className={`p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 group-hover:bg-orange-500/10 transition-colors`}>
                  <Icon className={`w-5 h-5 ${p.textColor}`} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold block text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors">
                    {p.label}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">
                    Launch Svc
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>



      {/* CORE FUNCTIONAL CAPABILITIES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold tracking-tight">System &amp; Export Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div 
                key={i} 
                className={`p-4 border rounded-2xl bg-white dark:bg-zinc-950 transition flex flex-col justify-between ${
                  f.isParent 
                    ? 'border-orange-500 bg-orange-500/[0.01]' 
                    : 'border-zinc-250/50 dark:border-zinc-900'
                }`}
              >
                <div className="space-y-2">
                  <Icon className={`w-4 h-4 ${f.isParent ? 'text-orange-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{f.title}</h4>
                </div>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2.5 leading-relaxed">{f.desc || 'Local system compiling'}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
