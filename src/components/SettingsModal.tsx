/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { User, UserSettings } from '../types';
import { 
  User as UserIcon, 
  Eye, 
  Download, 
  Share2, 
  Bell, 
  ShieldCheck, 
  KeyRound, 
  CreditCard, 
  Cpu, 
  Check, 
} from 'lucide-react';

interface SettingsModalProps {
  user: User | null;
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onUpdateTheme: (theme: 'light' | 'dark' | 'system') => void;
  openBilling: () => void;
  onOpenProfile: () => void;
}

type SettingsSection = 'account' | 'appearance' | 'downloads' | 'exports' | 'notifications' | 'security' | 'privacy' | 'billing' | 'aiSettings';

export default function SettingsModal({
  user,
  settings,
  onUpdateSettings,
  onUpdateTheme,
  openBilling,
  onOpenProfile
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsSection>('account');

  const tabs: { id: SettingsSection; label: string; icon: any }[] = [
    { id: 'account', label: 'My Account', icon: UserIcon },
    { id: 'appearance', label: 'Appearance', icon: Eye },
    { id: 'downloads', label: 'Downloads Config', icon: Download },
    { id: 'exports', label: 'Export Options', icon: Share2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & 2FA', icon: ShieldCheck },
    { id: 'privacy', label: 'Logs & Privacy', icon: KeyRound },
    { id: 'billing', label: 'Billing Center', icon: CreditCard },
    { id: 'aiSettings', label: 'Translation & AI', icon: Cpu },
  ];

  const handleToggleDownloadsAutoResume = () => {
    onUpdateSettings({
      ...settings,
      downloads: { ...settings.downloads, autoResume: !settings.downloads.autoResume }
    });
  };

  const handleToggleAskSave = () => {
    onUpdateSettings({
      ...settings,
      downloads: { ...settings.downloads, askSaveLocation: !settings.downloads.askSaveLocation }
    });
  };

  const handleMinifyJsonToggle = () => {
    onUpdateSettings({
      ...settings,
      exports: { ...settings.exports, minifyJson: !settings.exports.minifyJson }
    });
  };

  const handleNotificationToggle = (field: 'downloadFinished' | 'downloadFailed' | 'newsletters' | 'securityAlerts') => {
    onUpdateSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: !settings.notifications[field] }
    });
  };

  const handleSecurityToggle = (field: 'twoFactorEnabled' | 'loginNotify') => {
    onUpdateSettings({
      ...settings,
      security: { ...settings.security, [field]: !settings.security[field] }
    });
  };

  const handlePrivacyToggle = (field: 'saveSearchHistory' | 'anonymousLogs') => {
    onUpdateSettings({
      ...settings,
      privacy: { ...settings.privacy, [field]: !settings.privacy[field] }
    });
  };

  const handleAiToggle = (field: 'autoCaptionTranslate' | 'captionSummarizer') => {
    onUpdateSettings({
      ...settings,
      aiSettings: { ...settings.aiSettings, [field]: !settings.aiSettings[field] }
    });
  };

  return (
    <div id="settings-view" className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto select-none">
      
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-900 pb-5">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
          <SettingsModalIcon className="w-5 h-5 text-orange-500" />
          Settings Manager
        </h2>
        <p className="text-xs text-zinc-500">Configure downloads velocity limits, export properties, themes, and AI translators.</p>
      </div>

      {/* ChatGPT-style Split Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Left Side Navigation Tabs */}
        <div id="settings-tabs-list" className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 space-x-1.5 md:space-x-0 md:space-y-1 shrink-0 border-b md:border-b-0 border-zinc-200 dark:border-zinc-900">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                id={`settings-tab-btn-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition duration-155 ${
                  isSelected 
                    ? 'bg-zinc-150 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-bold border-l-2 border-orange-500' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/30'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-orange-500' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side Settings Contents Panels */}
        <div id="settings-tab-content" className="md:col-span-3 bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 p-6 rounded-2xl min-h-[380px] text-zinc-800 dark:text-zinc-250">
          
          {/* TAB 1: MY ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Account Credentials</h3>
                <p className="text-[11px] text-zinc-500">Configure your secure user moniker and registrant details.</p>
              </div>

              {user ? (
                <div className="space-y-4 text-xs">
                  <button
                    id="settings-open-profile"
                    type="button"
                    onClick={onOpenProfile}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-900 p-3 bg-zinc-50 dark:bg-zinc-900/60 text-left transition hover:border-orange-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-sm">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Profile</h4>
                        <p className="text-[10px] text-zinc-500">Manage your account profile, password, avatar and account options.</p>
                      </div>
                      <UserIcon className="w-4 h-4 text-orange-500 shrink-0" />
                    </div>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic py-6">Please log in to change secure account attributes.</p>
              )}
            </div>
          )}

          {/* TAB 2: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">User Appearance Vibe</h3>
                <p className="text-[11px] text-zinc-500">Pick the visual look that integrates best in your analytics cockpit.</p>
              </div>

              {/* Theme Selector */}
              <div id="theme-selectors-grid" className="grid grid-cols-3 gap-3.5 pt-2">
                {[
                  { id: 'light', label: 'Light Mode', desc: 'Elegant light theme off-whites design' },
                  { id: 'dark', label: 'Dark Mode', desc: 'Slate-colored twilight dark theme design' },
                  { id: 'system', label: 'System Default', desc: 'Sync with browser OS theme interface preferences' }
                ].map((th) => {
                  const isSel = settings.appearance === th.id;
                  return (
                    <button
                      id={`theme-option-btn-${th.id}`}
                      key={th.id}
                      onClick={() => {
                        onUpdateSettings({ ...settings, appearance: th.id as any });
                        onUpdateTheme(th.id as any);
                      }}
                      className={`p-4 border text-left rounded-xl transition flex flex-col justify-between ${
                        isSel 
                          ? 'border-orange-500 bg-orange-505/[0.02] dark:bg-orange-500/[0.02]' 
                          : 'border-zinc-200 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/10'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{th.label}</span>
                        {isSel && (
                          <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-2">{th.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOADS CONFIG */}
          {activeTab === 'downloads' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Downloads Config</h3>
                <p className="text-[11px] text-zinc-500 font-mono text-orange-550">Velocity stream restrictions and triggers.</p>
              </div>

              <div className="space-y-4 text-xs">
                {/* auto resume toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60">
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Automatic Stream Recovery</h4>
                    <p className="text-[10px] text-zinc-550">Resumes halted or slow streams automatically upon link check.</p>
                  </div>
                  <input
                    id="toggle-auto-resume"
                    type="checkbox"
                    checked={settings.downloads.autoResume}
                    onChange={handleToggleDownloadsAutoResume}
                    className="w-4 h-4 rounded text-orange-500"
                  />
                </div>

                {/* ask save toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60">
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Interactive Location Audit</h4>
                    <p className="text-[10px] text-zinc-550">Prompts save directory targets manually for singular media capture.</p>
                  </div>
                  <input
                    id="toggle-ask-save"
                    type="checkbox"
                    checked={settings.downloads.askSaveLocation}
                    onChange={handleToggleAskSave}
                    className="w-4 h-4 rounded text-orange-500"
                  />
                </div>

                {/* concurrent limit input */}
                <div className="space-y-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60">
                  <div className="flex justify-between">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Maximum Concurrent Downloads Limit</span>
                    <span className="font-bold text-orange-500">{settings.downloads.concurrentLimit} lanes</span>
                  </div>
                  <input
                    id="setting-concurrent-limit"
                    type="range"
                    min={1}
                    max={5}
                    value={settings.downloads.concurrentLimit}
                    onChange={(e) => {
                      onUpdateSettings({
                        ...settings,
                        downloads: { ...settings.downloads, concurrentLimit: Number(e.target.value) }
                      });
                    }}
                    className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <p className="text-[9px] text-zinc-500">Pro accounts support up to 5 parallel streams. Team supports up to 10.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPORT OPTIONS */}
          {activeTab === 'exports' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Export Parameters</h3>
                <p className="text-[11px] text-zinc-500">Fine-tune files generation configurations for CSV and JSON datasets.</p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Minify JSON toggle */}
                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Minify Packaged JSON Datasets</h4>
                    <p className="text-[10px] text-zinc-500">Reduces downloaded JSON file sizes by stripping spaces and returns.</p>
                  </div>
                  <input
                    id="toggle-minify-json"
                    type="checkbox"
                    checked={settings.exports.minifyJson}
                    onChange={handleMinifyJsonToggle}
                    className="w-4 h-4 text-orange-500"
                  />
                </div>

                {/* CSV Delimiter selecting */}
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">CSV Cell Delimiter Property</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-[9px] font-mono">Current: "{settings.exports.csvSeparator}"</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: ',', label: 'Comma ( , )' },
                      { id: ';', label: 'Semicolon ( ; )' },
                      { id: '\t', label: 'Tab key space' }
                    ].map((del) => {
                      const isSel = settings.exports.csvSeparator === del.id;
                      return (
                        <button
                          id={`csv-delimiter-btn-${del.id.charCodeAt(0)}`}
                          key={tabId(del.id)}
                          type="button"
                          onClick={() => {
                            onUpdateSettings({
                              ...settings,
                              exports: { ...settings.exports, csvSeparator: del.id }
                            });
                          }}
                          className={`p-2 border rounded-lg text-center font-bold ${
                            isSel 
                              ? 'border-orange-500 text-orange-500' 
                              : 'border-zinc-200 dark:border-zinc-900 text-zinc-500'
                          }`}
                        >
                          {del.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Workspace Alerts Notifications</h3>
              
              <div className="space-y-3.5">
                {[
                  { id: 'downloadFinished', t: 'Notify on Completed Stream', d: 'Plays a system chime and flashes top status upon complete.' },
                  { id: 'downloadFailed', t: 'Notify on Failed Downloads', d: 'Flashes alert instantly when a connection is aborted.' },
                  { id: 'securityAlerts', t: 'Identity & Revoke Sessions Logs Alerts', d: 'Sends security verification codes if custom devices logs are registered.' }
                ].map((not) => (
                  <div key={not.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-150">{not.t}</h4>
                      <p className="text-[10px] text-zinc-500">{not.d}</p>
                    </div>
                    <input
                      id={`toggle-not-${not.id}`}
                      type="checkbox"
                      checked={(settings.notifications as any)[not.id]}
                      onChange={() => handleNotificationToggle(not.id as any)}
                      className="w-4 h-4 text-orange-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Identity Security Rules</h3>

              <div className="space-y-3">
                {/* 2FA simulated toggle */}
                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-205 dark:border-zinc-850">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      Two-Factor Authentication (2FA)
                      <span className="text-[9px] px-1 bg-orange-100 text-orange-600 rounded font-black uppercase">Unlocks in Pro</span>
                    </h4>
                    <p className="text-[10px] text-zinc-550">Secure session logging matching code targets verification.</p>
                  </div>
                  <input
                    id="toggle-2fa"
                    type="checkbox"
                    checked={settings.security.twoFactorEnabled}
                    onChange={() => handleSecurityToggle('twoFactorEnabled')}
                    className="w-4 h-4 text-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-205 dark:border-zinc-850">
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Login Attempt Notification alert</h4>
                    <p className="text-[10px] text-zinc-550">Dispatches an email alert whenever another browser session registers.</p>
                  </div>
                  <input
                    id="toggle-login-notify"
                    type="checkbox"
                    checked={settings.security.loginNotify}
                    onChange={() => handleSecurityToggle('loginNotify')}
                    className="w-4 h-4 text-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Privacy & Audits Rules</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Store Search Ledger History</h4>
                    <p className="text-[10px] text-zinc-550">Keeps processed explorer searches in recent lists like ChatGPT.</p>
                  </div>
                  <input
                    id="toggle-track-history"
                    type="checkbox"
                    checked={settings.privacy.saveSearchHistory}
                    onChange={() => handlePrivacyToggle('saveSearchHistory')}
                    className="w-4 h-4 text-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Anonymous Diagnostics Logging</h4>
                    <p className="text-[10px] text-zinc-550 font-mono tracking-tight text-zinc-500">Transfers diagnostics stats logs in standard anonymous hash.</p>
                  </div>
                  <input
                    id="toggle-anonymous-logs"
                    type="checkbox"
                    checked={settings.privacy.anonymousLogs}
                    onChange={() => handlePrivacyToggle('anonymousLogs')}
                    className="w-4 h-4 text-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: BILLING */}
          {activeTab === 'billing' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Corporate Billing Center</h3>
                <p className="text-[11px] text-zinc-400">Control active card subscriptions, renewal dates, and trial loops.</p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/40 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Active Seat Package:</span>
                  <span className="font-bold text-orange-500 uppercase">{user?.plan || 'Free'} License</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Billing Cycle:</span>
                  <span className="font-bold capitalize">{user?.billingInterval || 'monthly'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-550">Card digits on file:</span>
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">•••• •••• •••• {settings.billing.cardLast4}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-550">Renewal / Expire Target Date:</span>
                  <span className="font-mono text-zinc-500">{settings.billing.renewalDate}</span>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    id="upgrade-tier-settings-btn"
                    onClick={openBilling}
                    className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold transition flex items-center gap-1"
                  >
                    Manage Billing / Upgrade
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: AI SETTINGS */}
          {activeTab === 'aiSettings' && (
            <div className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Translation & AI engine settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Translate CAPTIONS Automatically</h4>
                    <p className="text-[10px] text-zinc-500">Translates foreign captious dynamically during Account Explorer sweeps.</p>
                  </div>
                  <input
                    id="toggle-caption-translate"
                    type="checkbox"
                    checked={settings.aiSettings.autoCaptionTranslate}
                    onChange={() => handleAiToggle('autoCaptionTranslate')}
                    className="w-4 h-4 text-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">AI Capsule Summarizer</h4>
                    <p className="text-[10px] text-zinc-500">Collates high-density captions into quick, readable executive bullet summaries.</p>
                  </div>
                  <input
                    id="toggle-caption-summarizer"
                    type="checkbox"
                    checked={settings.aiSettings.captionSummarizer}
                    onChange={() => handleAiToggle('captionSummarizer')}
                    className="w-4 h-4 text-orange-500"
                  />
                </div>

                {/* Translate target language selecting */}
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl space-y-2">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">AI translation target Language</span>
                  <select
                    id="setting-ai-language"
                    className="w-full p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded text-zinc-900 dark:text-zinc-100 font-medium cursor-pointer"
                    value={settings.aiSettings.language}
                    onChange={(e) => {
                      onUpdateSettings({
                        ...settings,
                        aiSettings: { ...settings.aiSettings, language: e.target.value }
                      });
                    }}
                  >
                    <option value="en">English (US corporate standards)</option>
                    <option value="es">Español (Castellano)</option>
                    <option value="de">Deutsch (German standard)</option>
                    <option value="ja">日本語 (Japanese standard)</option>
                    <option value="fr">Français (French compliance)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

// Custom simple Icons to bypass extra exports
function SettingsModalIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  );
}

// Convert unique chars to strings safely
function tabId(str: string): string {
  if (str === '\t') return 'tab';
  return str;
}
