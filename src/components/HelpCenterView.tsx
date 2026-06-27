/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Compass, 
  Download, 
  FolderDown, 
  CreditCard, 
  User, 
  HelpCircle, 
  Mail, 
  Bug, 
  Lightbulb, 
  X, 
  ArrowRight
} from 'lucide-react';

interface HelpTopic {
  id: string;
  section: 'getting-started' | 'tools' | 'explorer' | 'all-downloader' | 'download-center' | 'pricing' | 'account';
  categoryTitle: string;
  title: string;
  content: string;
  tags: string[];
}

export default function HelpCenterView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'gs1': true, // Auto-open the very first item for a warm welcome
  });

  // Support interaction states
  const [supportModalOpen, setSupportModalOpen] = useState<'email' | 'bug' | 'feature' | null>(null);
  const [supportFormSubmitted, setSupportFormSubmitted] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState({ title: '', message: '', email: '' });

  // Seeded rich Help Topics aligned to requested sections
  const helpTopics: HelpTopic[] = [
    // 1. Getting Started
    {
      id: 'gs1',
      section: 'getting-started',
      categoryTitle: 'Getting Started',
      title: 'What is Socialintel and how do I begin?',
      content: 'Socialintel is an enterprise intelligence platform designed to aggregate, explore, and download public social media data under a unified interface. To begin, use the Platform tools on the left sidebar to select your target platform (Instagram, X/Twitter, YouTube, Snapchat, Threads, or TikTok) and search/explore profiles or download posts.',
      tags: ['intro', 'socialintel', 'start', 'guide']
    },
    {
      id: 'gs2',
      section: 'getting-started',
      categoryTitle: 'Getting Started',
      title: 'Is my search history private?',
      content: 'Yes. Socialintel stores your local searches, explorer records, and download queues strictly within your browser Session Storage by default. You can configure automatic clearing or disable local historical logging permanently within the privacy section of your Settings.',
      tags: ['privacy', 'history', 'security']
    },

    // 2. Tools Guide
    {
      id: 'tg1',
      section: 'tools',
      categoryTitle: 'Tools Guide',
      title: 'What features are supported across different social channels?',
      content: 'Socialintel supports structured metadata analysis, grid views, media caption extraction, profile image retrieval, and high-fidelity video/audio streams across 6 main channels. Note that Snapchat supports media downloading, while Instagram, YouTube, and X support full rich database schema exports.',
      tags: ['platforms', 'features', 'youtube', 'instagram', 'twitter']
    },
    {
      id: 'tg2',
      section: 'tools',
      categoryTitle: 'Tools Guide',
      title: 'How do you handle platform rate limits?',
      content: 'We employ multi-agent rotation proxies to guarantee a 99.9% uptime. If a platform experiences sudden maintenance or temporary throttling, the stream is automatically paused and enters an exponential backoff state before resuming.',
      tags: ['rate limit', 'limits', 'errors', 'proxy']
    },

    // 3. Account Explorer Guide
    {
      id: 'ae1',
      section: 'explorer',
      categoryTitle: 'Account Explorer Guide',
      title: 'What is the Account Profile Explorer?',
      content: 'The Profile Explorer (found under the "Tools" tab after searching a key username) lets you inspect follower details, active statistics charts, verified statuses, grid posts, and interactive timeline analysis. It brings full offline search tools to filtered account grids.',
      tags: ['explorer', 'profile', 'followers', 'grid', 'analytics']
    },
    {
      id: 'ae2',
      section: 'explorer',
      categoryTitle: 'Account Explorer Guide',
      title: 'Can I export profile follower datasets in bulk?',
      content: 'Yes! Navigate to the Tool view, open the Account Profile Explorer tab, search your target account, and click "Export Grid Records". You can choose from spreadsheet (XLSX), mini-database format (JSON), or CSV format in your export logs.',
      tags: ['export', 'xlsx', 'csv', 'bulk', 'followers']
    },

    // 4. All Downloader Guide
    {
      id: 'ad1',
      section: 'all-downloader',
      categoryTitle: 'All Downloader Guide',
      title: 'How does the "All Downloader" work?',
      content: 'The All Downloader is our most advanced capture tool. Instead of acquiring single media files one-by-one, you can paste any key profile URL or post and check boxes to capture all associated components (high-definition video, audio files, full text captions, and main thumbnails) simultaneously.',
      tags: ['all downloader', 'bulk', 'video', 'audio', 'captions']
    },
    {
      id: 'ad2',
      section: 'all-downloader',
      categoryTitle: 'All Downloader Guide',
      title: 'What is the "Extract Audio (320kbps MP3)" option?',
      content: 'Under supported video streams on YouTube and TikTok, the system automatically runs a client-side layout synthesizer to extract high-fidelity audio streams into space-saving standalone MP3 files. Great for podcast libraries and archiving.',
      tags: ['audio', 'mp3', 'extractor', 'youtube', 'tiktok']
    },

    // 5. Download Center Guide
    {
      id: 'dc1',
      section: 'download-center',
      categoryTitle: 'Download Center Guide',
      title: 'How do I manage active downloads?',
      content: 'Go to the Download Center via the profile trigger menu or header notification badges. Here you will see active download streams. You can pause running queues, resume stuck items, cancel streams, or retry failed items dynamically without losing already downloaded packet fragments.',
      tags: ['download center', 'pause', 'resume', 'retry', 'stream']
    },
    {
      id: 'dc2',
      section: 'download-center',
      categoryTitle: 'Download Center Guide',
      title: 'Where do my completed files go?',
      content: 'Once a download reaches 100%, the browser triggers a native layout download stream directly to your OS "Downloads" folder. In the Download Center, you can review historic exports and trigger "Re-download" to pull them to other local storage devices.',
      tags: ['storage', 'completed', 'browser', 'os']
    },

    // 6. Pricing FAQ
    {
      id: 'pr1',
      section: 'pricing',
      categoryTitle: 'Pricing FAQ',
      title: 'Are there voucher discounts available for Socialintel?',
      content: 'Yes! We support promo codes. Enter coupon "SI50" at checkout for a 50% discount on both Pro and Team tiers, or voucher "TRIALFREE" for 14 Days of unlimited Premium Trial access without any upfront billing.',
      tags: ['pricing', 'discount', 'free trial', 'si50', 'trialfree', 'coupon']
    },
    {
      id: 'pr2',
      section: 'pricing',
      categoryTitle: 'Pricing FAQ',
      title: 'What is the fair use query limit on the Free tier?',
      content: 'The Free tier is limited to 1 live search and 1 media packet snapshot download per social network daily. Upgrading to our premium subscription tiers unlocks unlimited multithreaded downloads and 10Gbps parallel stream servers.',
      tags: ['limits', 'pro', 'plans', 'subscriptions']
    },

    // 7. Account FAQ
    {
      id: 'ac1',
      section: 'account',
      categoryTitle: 'Account FAQ',
      title: 'How do I enable Multi-Factor Authentication (2FA)?',
      content: 'Click "Settings" in your profile menu dropdown, navigate to the "Security & Profile" panel, and toggle "Active Two-Factor Authentication". You can secure your account via QR codes or SMS notification tokens.',
      tags: ['2fa', 'security', 'mfa', 'settings']
    },
    {
      id: 'ac2',
      section: 'account',
      categoryTitle: 'Account FAQ',
      title: 'Can I manage multiple verified logins synchronously?',
      content: 'Yes. In the App Settings, you can verify your device session list. Active devices are populated with browser models, system operating systems, and IP locations. You can sign out unrecognized browsers with a single toggle command.',
      tags: ['devices', 'session', 'account', 'login']
    }
  ];

  // Group Categories for Navigation Rails
  const categories = [
    { id: 'all', label: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'tools', label: 'Tools Guide', icon: Compass },
    { id: 'explorer', label: 'Account Explorer Guide', icon: User },
    { id: 'all-downloader', label: 'All Downloader Guide', icon: Download },
    { id: 'download-center', label: 'Download Center Guide', icon: FolderDown },
    { id: 'pricing', label: 'Pricing FAQ', icon: CreditCard },
    { id: 'account', label: 'Account FAQ', icon: User },
  ];

  // Filtering Logic based on rail selection and Search Query
  const filteredTopics = useMemo(() => {
    let result = helpTopics;
    
    // Filter by rail category first (if not 'all')
    if (activeCategory !== 'all') {
      result = result.filter(item => item.section === activeCategory);
    }
    
    // Search query matches
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.content.toLowerCase().includes(q) ||
        item.categoryTitle.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.includes(q))
      );
    }
    
    return result;
  }, [searchQuery, activeCategory]);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittedDetails.message.trim() || !submittedDetails.email.trim()) return;
    setSupportFormSubmitted(true);
    setTimeout(() => {
      setSupportModalOpen(null);
      setSupportFormSubmitted(false);
      setSubmittedDetails({ title: '', message: '', email: '' });
      alert("Support Ticket submitted successfully! Our representative will respond to your registered email coordinate within 4 hours.");
    }, 1500);
  };

  return (
    <div id="help-center-root" className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* 2. HEADER INTRO SECTION */}
      <div id="help-header-section" className="relative p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
            Support center
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Help Center
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Search our comprehensive guides, explore account parameters, manage bulk downloads, or request feature enhancements.
          </p>
        </div>
        
        {/* Support quick triggers */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto self-stretch md:self-center">
          <button
            onClick={() => setSupportModalOpen('email')}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-200 font-medium text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 transition flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4 text-blue-500" />
            Email Support
          </button>
          <button
            onClick={() => setSupportModalOpen('bug')}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-200 font-medium text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 transition flex items-center justify-center gap-2"
          >
            <Bug className="w-4 h-4 text-red-500 animate-pulse" />
            Report Bug
          </button>
          <button
            onClick={() => setSupportModalOpen('feature')}
            className="flex-1 sm:flex-initial py-2.5 px-4 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-200 font-medium text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 transition flex items-center justify-center gap-2"
          >
            <Lightbulb className="w-4 h-4 text-orange-500" />
            Feature Request
          </button>
        </div>
      </div>

      {/* 3. SEARCH & INTEGRATION ROW */}
      <div id="help-search-row" className="max-w-2xl mx-auto relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search help topics, guides, FAQs, error troubleshooters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-905 rounded-2xl text-sm focus:outline-none focus:border-orange-500 shadow-sm transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4. CONTENT GRID COLLABORATION */}
      <div id="help-grid-layout" className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Category Side Rails (Desktop-friendly, horizontal on mobile) */}
        <div className="lg:col-span-1 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-2.5 rounded-2xl space-y-1 sticky top-4 flex overflow-x-auto lg:flex-col lg:overflow-x-visible gap-1.5 lg:gap-1 max-w-full">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  // Ensure first item autoexpand if possible
                  const firstOfCat = helpTopics.find(x => x.section === cat.id);
                  if (firstOfCat) {
                    setOpenItems(prev => ({ ...prev, [firstOfCat.id]: true }));
                  }
                }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 lg:w-full text-left transition duration-150 ${
                  isSelected
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                }`}
              >
                <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-orange-500' : 'text-zinc-405'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic FAQ Panels */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-900">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400">
              {categories.find(c => c.id === activeCategory)?.label || 'All Topics'} ({filteredTopics.length})
            </h2>
            {searchQuery && (
              <span className="text-xs text-zinc-500 dark:text-zinc-450 italic">
                Filtered by &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

          {filteredTopics.length > 0 ? (
            <div className="space-y-3">
              {filteredTopics.map((topic) => {
                const isOpen = !!openItems[topic.id];
                return (
                  <div
                    key={topic.id}
                    className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/20 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-850 transition duration-150"
                  >
                    <button
                      onClick={() => toggleItem(topic.id)}
                      className="w-full flex items-center justify-between p-4 text-left transition"
                    >
                      <div className="space-y-1.5 pr-4">
                        <span className="text-[10px] font-bold text-orange-500 dark:text-orange-400 uppercase tracking-widest">
                          {topic.categoryTitle}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                          {topic.title}
                        </h3>
                      </div>
                      <div className="shrink-0 p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-500">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-900/60 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50/50 dark:bg-zinc-950/20">
                        <p>{topic.content}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-zinc-100/30 dark:border-zinc-900/10">
                          {topic.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-zinc-100 dark:bg-zinc-900/80 text-zinc-500 px-2 py-0.5 rounded-md font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-900 rounded-2xl space-y-4">
              <HelpCircle className="w-12 h-12 text-zinc-300 dark:text-zinc-800 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No help topics matches your search.</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-450 pr-4 pl-4">Try checking spelling, deleting certain keywords or resetting filters below.</p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="py-2 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. INTERACTIVE SUPPORT MODALS / DIALOG POPUP */}
      {supportModalOpen && (
        <div id="support-modal-backdrop" className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {supportModalOpen === 'email' && <Mail className="w-5 h-5 text-blue-500" />}
                {supportModalOpen === 'bug' && <Bug className="w-5 h-5 text-red-500" />}
                {supportModalOpen === 'feature' && <Lightbulb className="w-5 h-5 text-orange-500" />}
                <h3 className="font-bold text-base text-zinc-900 dark:text-white capitalize">
                  {supportModalOpen === 'email' && 'Contact Support via Email'}
                  {supportModalOpen === 'bug' && 'Submit Bug Report'}
                  {supportModalOpen === 'feature' && 'Suggest Feature Request'}
                </h3>
              </div>
              <button
                onClick={() => setSupportModalOpen(null)}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSupportSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Your registered email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={submittedDetails.email}
                  onChange={(e) => setSubmittedDetails({ ...submittedDetails, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 text-zinc-800 dark:text-zinc-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  {supportModalOpen === 'email' && 'Subject'}
                  {supportModalOpen === 'bug' && 'Defect Title'}
                  {supportModalOpen === 'feature' && 'Feature Concept Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    supportModalOpen === 'email' ? 'How can we help you?' :
                    supportModalOpen === 'bug' ? 'E.g., TikTok MP3 download times out' :
                    'E.g., Support exports format for Threads profile graphs'
                  }
                  value={submittedDetails.title}
                  onChange={(e) => setSubmittedDetails({ ...submittedDetails, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 text-zinc-800 dark:text-zinc-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  {supportModalOpen === 'email' && 'Please describe your request'}
                  {supportModalOpen === 'bug' && 'Steps to reproduce & expected outcome'}
                  {supportModalOpen === 'feature' && 'Describe the use case and benefit'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide precise details to help us investigate as fast as possible."
                  value={submittedDetails.message}
                  onChange={(e) => setSubmittedDetails({ ...submittedDetails, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500 text-zinc-800 dark:text-zinc-200"
                />
              </div>

              <div id="modal-actions" className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                <button
                  type="button"
                  onClick={() => setSupportModalOpen(null)}
                  className="py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={supportFormSubmitted}
                  className="py-2.5 px-5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-150 text-white dark:text-zinc-950 font-bold text-xs rounded-xl transition flex items-center gap-2"
                >
                  {supportFormSubmitted ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
