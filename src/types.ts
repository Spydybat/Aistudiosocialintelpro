/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlatformType = 'instagram' | 'twitter' | 'youtube' | 'snapchat' | 'threads' | 'tiktok';

export type AppView = 'home' | 'tools' | 'pricing' | 'settings' | 'download-center' | 'profile' | 'download-history' | 'saved-exports' | 'help';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  plan: 'Free' | 'Pro' | 'Team';
  billingInterval: 'monthly' | 'yearly';
  joinedAt: string;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  rememberMe: boolean;
}

export interface SessionDevice {
  id: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  isCurrent: boolean;
  lastActive: string;
}

export interface BillingInvoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
  pdfUrl: string;
}

export interface DownloadItem {
  id: string;
  platform: PlatformType;
  title: string;
  type: 'video' | 'audio' | 'image' | 'caption' | 'thumbnail' | 'profile_pic' | 'bundle' | 'all';
  url: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed' | 'paused';
  progress: number; // 0 to 100
  size: string; // e.g., "12.4 MB"
  addedAt: string;
  error?: string;
  downloadUrl?: string; // local blob or dummy url
  filename?: string;
}

export interface HistoryItem {
  id: string;
  type: 'download' | 'export' | 'search' | 'explorer' | 'all_downloader';
  platform?: PlatformType;
  query: string; // url, username, or text
  timestamp: string;
  details?: string;
}

export interface ExplorerProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  followers: string;
  following: string;
  isVerified: boolean;
  postsCount: number;
}

export interface ExplorerContent {
  id: string;
  type: 'image' | 'video' | 'reel' | 'audio' | 'story' | 'post' | 'carousel' | 'profile';
  caption: string;
  url: string;
  thumbnailUrl: string;
  audioUrl?: string;
  audioName?: string;
  duration?: string;
  createdAt: string;
  // Metadata for Exports (only visible in generated CSV/JSON/XLSX - NOT in frontend lists/tables)
  commentCount: number;
  likeCount: number;
  viewCount: number;
  shareCount: number;
  engagementRate?: string;
  postId?: string;
  userId?: string;
}

export interface UserSettings {
  account: {
    displayName: string;
    email: string;
  };
  appearance: 'light' | 'dark' | 'system';
  downloads: {
    autoResume: boolean;
    askSaveLocation: boolean;
    concurrentLimit: number;
    defaultFormat: string;
  };
  exports: {
    includeMetadata: boolean;
    minifyJson: boolean;
    csvSeparator: string;
  };
  notifications: {
    downloadFinished: boolean;
    downloadFailed: boolean;
    newsletters: boolean;
    securityAlerts: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginNotify: boolean;
  };
  privacy: {
    saveSearchHistory: boolean;
    anonymousLogs: boolean;
  };
  billing: {
    plan: 'Free' | 'Pro' | 'Team';
    renewalDate: string;
    cardLast4: string;
  };
  aiSettings: {
    autoCaptionTranslate: boolean;
    captionSummarizer: boolean;
    language: string;
  };
}
