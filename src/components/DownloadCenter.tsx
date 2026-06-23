/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { DownloadItem, HistoryItem } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  ExternalLink, 
  Download, 
  Search,
  FileVideo,
  FileAudio,
  FileImage,
  FileText,
  FileJson,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  File as FileIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DownloadCenterProps {
  downloads: DownloadItem[];
  exports: HistoryItem[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
  onDownloadAgain: (item: DownloadItem) => void;
  onClearExports: () => void;
  onDeleteExport: (id: string) => void;
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

const formatDownloadTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch (e) {
    return 'Recently';
  }
};

const getGroup = (dateString: string) => {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Older';
    
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    const isToday = d.getDate() === today.getDate() &&
                    d.getMonth() === today.getMonth() &&
                    d.getFullYear() === today.getFullYear();
                    
    const isYesterday = d.getDate() === yesterday.getDate() &&
                        d.getMonth() === yesterday.getMonth() &&
                        d.getFullYear() === yesterday.getFullYear();
                        
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return 'Older';
  } catch (e) {
    return 'Older';
  }
};

export default function DownloadCenter({
  downloads,
  exports,
  onPause,
  onResume,
  onRetry,
  onDelete,
  onDownloadAgain,
  onClearExports,
  onDeleteExport
}: DownloadCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'files' | 'exports'>('files');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Convert File Extension to simple user-friendly filetype description
  const getFileExtensionType = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop() || '';
    if (ext === 'json') return 'JSON Meta Package';
    if (ext === 'csv') return 'CSV Metadata Sheet';
    if (ext === 'xlsx') return 'XLSX Spreadsheet';
    if (ext === 'zip') return 'ZIP Archive';
    if (ext === 'txt') return 'Plain Text';
    return 'Export Document';
  };

  // Convert files info or query strings into custom mock details
  const getExportSize = (filename: string) => {
    const name = filename.toLowerCase();
    if (name.endsWith('.zip')) return '4.2 MB';
    if (name.endsWith('.xlsx')) return '45 KB';
    if (name.endsWith('.csv')) return '12 KB';
    if (name.endsWith('.json')) return '18 KB';
    return '25 KB';
  };

  // 1. FILTER DOWNLOADS BY SEARCH (FILE NAME / FILE TYPE)
  const filteredDownloads = downloads.filter(item => {
    const fileName = getFriendlyFilename(item).toLowerCase();
    const fileType = item.type.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fileName.includes(query) || fileType.includes(query);
  });

  // 2. FILTER EXPORTS BY SEARCH (FILE NAME / PLATFORM)
  const filteredExports = exports.filter(item => {
    const fileName = item.query.toLowerCase();
    const platformStr = (item.platform || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return fileName.includes(query) || platformStr.includes(query);
  });

  // 3. GROUP ITEMS
  const groupedDownloads: Record<string, DownloadItem[]> = {
    'Today': [],
    'Yesterday': [],
    'Older': []
  };

  const groupedExports: Record<string, HistoryItem[]> = {
    'Today': [],
    'Yesterday': [],
    'Older': []
  };

  filteredDownloads.forEach(item => {
    const group = getGroup(item.addedAt);
    groupedDownloads[group].push(item);
  });

  filteredExports.forEach(item => {
    const group = getGroup(item.timestamp);
    groupedExports[group].push(item);
  });

  const getFileIcon = (type: string, filename?: string) => {
    const name = (filename || type).toLowerCase();
    if (name.endsWith('.mp3') || type === 'audio') {
      return <FileAudio className="w-5 h-5 text-purple-500 shrink-0" />;
    }
    if (name.endsWith('.mp4') || type === 'video' || type === 'reel') {
      return <FileVideo className="w-5 h-5 text-blue-500 shrink-0" />;
    }
    if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || type === 'image' || type === 'profile_pic' || type === 'thumbnail' || type === 'photo') {
      return <FileImage className="w-5 h-5 text-emerald-500 shrink-0" />;
    }
    if (name.endsWith('.csv') || name.endsWith('.xls') || name.endsWith('.xlsx')) {
      return <FileSpreadsheet className="w-5 h-5 text-teal-600 dark:text-teal-500 shrink-0" />;
    }
    if (name.endsWith('.json')) {
      return <FileJson className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />;
    }
    if (name.endsWith('.zip')) {
      return <FileIcon className="w-5 h-5 text-zinc-400 shrink-0" />;
    }
    if (type === 'caption') {
      return <FileText className="w-5 h-5 text-amber-500 shrink-0" />;
    }
    return <FileIcon className="w-5 h-5 text-zinc-400 shrink-0" />;
  };

  // Triggers elegant browser download package simulation for exports
  const handleOpenExportFile = (exp: HistoryItem) => {
    const ext = exp.query.split('.').pop() || 'json';
    let fileContents = '';
    let mimeType = 'text/plain';

    if (ext === 'json') {
      mimeType = 'application/json';
      fileContents = JSON.stringify({
        exporter_report: exp.query,
        channel: exp.platform || 'General',
        timestamp: exp.timestamp,
        meta_registry: "SocialIntel Engine V4 API Logs",
        verified: true,
        extracted_fields: {
          username: "travel_explorers",
          platform_source: exp.platform,
          data_points: [
            { id: "p1", likes: 4522, comments: 231, reach: "9.2K" },
            { id: "p2", likes: 8192, comments: 402, reach: "14.1K" }
          ]
        }
      }, null, 2);
    } else if (ext === 'csv') {
      mimeType = 'text/csv';
      fileContents = `Export_Document,Platform,Date_Logged,System_Details\n` +
                    `"${exp.query}","${exp.platform || 'General'}","${exp.timestamp}","${exp.details || 'Simulated export list'}"\n` +
                    `"record_1","instagram","2026-06-19T08:00:00Z","Valid post details"\n` +
                    `"record_2","instagram","2026-06-19T08:05:00Z","Valid caption stream"`;
    } else {
      mimeType = 'text/plain';
      fileContents = `SocialIntel Tracker Report File: ${exp.query}\n` +
                    `Platform: ${exp.platform || 'General'}\n` +
                    `Generated: ${new Date(exp.timestamp).toString()}\n` +
                    `Meta: ${exp.details || 'None'}`;
    }

    try {
      const blob = new Blob([fileContents], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = exp.query;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Browser simulated file generation failed:", e);
    }
  };

  return (
    <div id="download-center-view" className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 select-none font-sans">
      
      {/* Chrome / Edge styled Header with Search */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Downloads
          </h2>
          <div className="flex gap-4 border-b border-transparent">
            <button
              id="tab-btn-files"
              onClick={() => setActiveTab('files')}
              className={`text-xs font-semibold pb-1.5 border-b-2 transition-colors duration-150 ${activeTab === 'files' ? 'border-orange-500 text-orange-500' : 'border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              Downloaded Files ({filteredDownloads.length})
            </button>
            <button
              id="tab-btn-exports"
              onClick={() => setActiveTab('exports')}
              className={`text-xs font-semibold pb-1.5 border-b-2 transition-colors duration-150 ${activeTab === 'exports' ? 'border-orange-500 text-orange-500' : 'border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              Data Export Reports ({filteredExports.length})
            </button>
          </div>
        </div>

        {/* Browser Downloads Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="downloads-search-input"
            type="text"
            placeholder={activeTab === 'files' ? "Search by name or type..." : "Search data exports..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl focus:border-orange-500 dark:focus:border-orange-500 outline-none transition text-zinc-800 dark:text-zinc-200 shadow-sm"
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        {activeTab === 'files' ? (
          // DOWNLOADED FILES TAB (SAME LAYOUT)
          (() => {
            const hasAnyResults = Object.values(groupedDownloads).some(list => list.length > 0);

            if (!hasAnyResults) {
              return (
                <div id="downloads-empty-state" className="p-12 text-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl shadow-sm space-y-3">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <Download className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No Downloads Yet</h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">Start downloading files from the platform tools to see them here.</p>
                  </div>
                </div>
              );
            }

            return (
              <div className="space-y-8">
                {['Today', 'Yesterday', 'Older'].map(groupName => {
                  const items = groupedDownloads[groupName];
                  if (items.length === 0) return null;

                  return (
                    <div key={groupName} className="space-y-3">
                      <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                        {groupName}
                      </h3>
                      
                      <div className="space-y-2">
                        <AnimatePresence initial={false}>
                          {items.map(item => {
                            const fileName = getFriendlyFilename(item);
                            const isExpanded = !!expandedItems[item.id];
                            
                            return (
                              <motion.div
                                key={item.id}
                                id={`dl-item-row-${item.id}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm transition-all text-xs"
                              >
                                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  
                                  {/* Left context: icon & meta */}
                                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                    <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-xl shrink-0">
                                      {getFileIcon(item.type, fileName)}
                                    </div>
                                    <div className="min-w-0 space-y-1 flex-1">
                                      <div className="flex items-center gap-2 min-w-0 w-full">
                                        <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate block text-sm flex-1 min-w-0" title={fileName}>
                                          {fileName}
                                        </span>
                                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 rounded font-bold shrink-0 select-none">
                                          {item.type}
                                        </span>
                                      </div>
                                      
                                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-500 text-[11px]">
                                        <span className="font-bold text-orange-500 uppercase tracking-wide text-[10px]">{item.platform}</span>
                                        <span>•</span>
                                        <span>{item.size || 'Unknown size'}</span>
                                        <span>•</span>
                                        <span>{formatDownloadTime(item.addedAt)}</span>
                                        {item.status !== 'completed' && (
                                          <>
                                            <span>•</span>
                                            <span className={`font-semibold uppercase tracking-wider text-[9px] ${
                                              item.status === 'downloading' ? 'text-blue-500 animate-pulse' :
                                              item.status === 'paused' ? 'text-amber-500' : 'text-red-500'
                                            }`}>
                                              {item.status} {item.progress ? `(${item.progress}%)` : ''}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right side actions (Open, Details, Delete) */}
                                  <div className="flex items-center gap-2 shrink-0 justify-end">
                                    {item.status === 'downloading' && (
                                      <button
                                        onClick={() => onPause(item.id)}
                                        className="py-1 px-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-[11px] font-bold text-zinc-700 dark:text-zinc-200 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                                      >
                                        <Pause className="w-3.5 h-3.5" />
                                        <span>Pause</span>
                                      </button>
                                    )}

                                    {item.status === 'paused' && (
                                      <button
                                        onClick={() => onResume(item.id)}
                                        className="py-1 px-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 text-[11px] font-bold text-orange-550 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                                      >
                                        <Play className="w-3.5 h-3.5" />
                                        <span>Resume</span>
                                      </button>
                                    )}

                                    {item.status === 'failed' && (
                                      <button
                                        onClick={() => onRetry(item.id)}
                                        className="py-1 px-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                                      >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Retry</span>
                                      </button>
                                    )}

                                    {/* Open action */}
                                    {item.status === 'completed' && (
                                      <button
                                        id={`btn-open-${item.id}`}
                                        onClick={() => onDownloadAgain(item)}
                                        className="py-1 px-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-extrabold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Open File</span>
                                      </button>
                                    )}

                                    {/* Details toggle action */}
                                    <button
                                      id={`btn-toggle-details-${item.id}`}
                                      onClick={() => toggleExpand(item.id)}
                                      className="p-1 px-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition flex items-center gap-1 cursor-pointer"
                                    >
                                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      <span>Details</span>
                                    </button>

                                    {/* Delete action */}
                                    <button
                                      id={`btn-remove-${item.id}`}
                                      onClick={() => onDelete(item.id)}
                                      className="p-2 border border-zinc-200 dark:border-zinc-850 hover:bg-red-50 dark:hover:bg-red-950/25 text-zinc-400 hover:text-red-500 rounded-lg transition cursor-pointer"
                                      title="Remove from history"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Details container (SAME EXPANSION STYLE) */}
                                {isExpanded && (
                                  <div className="px-5 pb-5 pt-3 border-t border-zinc-100 dark:border-zinc-905 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 min-w-0">
                                      <div className="min-w-0">
                                        <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">File Name</span>
                                        <span className="text-zinc-800 dark:text-zinc-200 truncate block font-mono font-semibold" title={fileName}>{fileName}</span>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">File Type</span>
                                        <span className="text-zinc-800 dark:text-zinc-200 uppercase font-mono font-semibold block truncate">{item.type}</span>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">Created Date</span>
                                        <span className="text-zinc-800 dark:text-zinc-200 block font-semibold truncate">{new Date(item.addedAt).toLocaleString()}</span>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">File Size</span>
                                        <span className="text-zinc-800 dark:text-zinc-200 block font-mono font-semibold truncate">{item.size || '12.4 MB'}</span>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">Source Tool</span>
                                        <span className="text-zinc-800 dark:text-zinc-200 block font-semibold capitalize truncate">{item.platform} Tracker</span>
                                      </div>
                                      {item.platform !== 'threads' && (
                                        <div className="min-w-0">
                                          <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">Source URL</span>
                                          <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline block truncate font-mono font-semibold" title={item.url}>{item.url}</a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        ) : (
          // DATA EXPORTS TAB - IDENTICAL COMPONENT LAYOUT
          (() => {
            const hasAnyResults = Object.values(groupedExports).some(list => list.length > 0);

            if (!hasAnyResults) {
              return (
                <div id="reports-empty-state" className="p-12 text-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl shadow-sm space-y-3">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <FileJson className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No Data Reports Yet</h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">Click 'Export Records' in tracking sessions to archive databases here.</p>
                  </div>
                </div>
              );
            }

            return (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    Export Log
                  </span>
                  <button
                    id="reports-clear-btn"
                    onClick={onClearExports}
                    className="text-xs text-red-500 hover:underline font-extrabold cursor-pointer"
                  >
                    Clear All Logs
                  </button>
                </div>

                {['Today', 'Yesterday', 'Older'].map(groupName => {
                  const items = groupedExports[groupName];
                  if (items.length === 0) return null;

                  return (
                    <div key={groupName} className="space-y-3">
                      <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                        {groupName}
                      </h3>

                      <div className="space-y-2">
                        <AnimatePresence initial={false}>
                          {items.map(exp => {
                            const fileName = exp.query;
                            const sizeStr = getExportSize(fileName);
                            const isExpanded = !!expandedItems[exp.id];
                            const extensionType = getFileExtensionType(fileName);

                            return (
                              <motion.div
                                key={exp.id}
                                id={`export-reported-row-${exp.id}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl overflow-hidden shadow-sm transition-all text-xs"
                              >
                                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  
                                  {/* Left context: icon & meta (EXACT SAME AS DOWNLOADS) */}
                                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                                    <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-xl shrink-0">
                                      {getFileIcon(exp.type, fileName)}
                                    </div>
                                    <div className="min-w-0 space-y-1 flex-1">
                                      <div className="flex items-center gap-2 min-w-0 w-full">
                                        <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate block text-sm flex-1 min-w-0" title={fileName}>
                                          {fileName}
                                        </span>
                                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 rounded font-bold shrink-0 select-none">
                                          {fileName.split('.').pop() || 'JSON'}
                                        </span>
                                      </div>
                                      
                                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-500 text-[11px]">
                                        <span className="font-bold text-orange-500 uppercase tracking-wide text-[10px]">{exp.platform || 'General'}</span>
                                        <span>•</span>
                                        <span>{sizeStr}</span>
                                        <span>•</span>
                                        <span>{formatDownloadTime(exp.timestamp)}</span>
                                        <span>•</span>
                                        <span className="font-semibold uppercase text-emerald-500 text-[9px]">
                                          Completed
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right actions (Open, Details, Delete - IDENTICAL ACTIONS) */}
                                  <div className="flex items-center gap-2 shrink-0 justify-end">
                                    {/* Open File triggers real Blob file builder download */}
                                    <button
                                      id={`btn-open-export-${exp.id}`}
                                      onClick={() => handleOpenExportFile(exp)}
                                      className="py-1 px-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-extrabold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                      <span>Open File</span>
                                    </button>

                                    {/* Details toggle action */}
                                    <button
                                      id={`btn-toggle-details-export-${exp.id}`}
                                      onClick={() => toggleExpand(exp.id)}
                                      className="p-1 px-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition flex items-center gap-1 cursor-pointer"
                                    >
                                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      <span>Details</span>
                                    </button>

                                    {/* Delete export log */}
                                    <button
                                      id={`btn-remove-export-${exp.id}`}
                                      onClick={() => onDeleteExport(exp.id)}
                                      className="p-2 border border-zinc-200 dark:border-zinc-850 hover:bg-red-50 dark:hover:bg-red-950/25 text-zinc-400 hover:text-red-500 rounded-lg transition cursor-pointer"
                                      title="Remove from history"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Details container (SAME EXPANSION STYLE) */}
                                {isExpanded && (
                                  <div className="px-5 pb-5 pt-3 border-t border-zinc-100 dark:border-zinc-905 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 min-w-0 animate-fade-in">
                                      <div className="min-w-0">
                                        <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">File Name</span>
                                        <span className="text-zinc-800 dark:text-zinc-200 truncate block font-mono font-semibold" title={fileName}>{fileName}</span>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">File Type</span>
                                        <span className="text-zinc-800 dark:text-zinc-200 uppercase font-mono font-semibold block truncate">{extensionType}</span>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">Created Date</span>
                                        <span className="text-zinc-800 dark:text-zinc-200 block font-semibold truncate">{new Date(exp.timestamp).toLocaleString()}</span>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">File Size</span>
                                        <span className="text-zinc-800 dark:text-zinc-200 block font-mono font-semibold truncate">{sizeStr}</span>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">Source Tool</span>
                                        <span className="text-zinc-800 dark:text-zinc-200 block font-semibold capitalize truncate">{(exp.platform || exp.type).toUpperCase()} Exporter</span>
                                      </div>
                                      {exp.platform !== 'threads' && (
                                        <div className="min-w-0">
                                          <span className="font-bold text-zinc-400 dark:text-zinc-500 block text-[10px] uppercase tracking-wider mb-0.5">Source URL/Context</span>
                                          <span className="text-zinc-500 dark:text-zinc-400 block truncate font-mono font-semibold" title={exp.details || 'Simulated Meta Export'}>
                                            {exp.details || 'N/A'}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}
      </div>

    </div>
  );
}
