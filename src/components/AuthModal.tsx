/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, SessionDevice } from '../types';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Github, 
  Chrome, 
  Smartphone, 
  Compass, 
  ShieldAlert, 
  Fingerprint, 
  RefreshCw, 
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  devices: SessionDevice[];
  setDevices: React.Dispatch<React.SetStateAction<SessionDevice[]>>;
}

type AuthScreen = 'login' | 'register' | 'forgot' | 'reset' | 'verification';

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  devices,
  setDevices
}: AuthModalProps) {
  const [screen, setScreen] = useState<AuthScreen>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSocialMock = (provider: 'Google' | 'GitHub') => {
    setErrorMsg('');
    const mockUser: User = {
      id: `usr_${Math.floor(Math.random() * 9000) + 1000}`,
      email: `${provider.toLowerCase()}@socialintel.com`,
      displayName: `${provider} Explorer`,
      plan: 'Free',
      billingInterval: 'monthly',
      joinedAt: new Date().toLocaleDateString(),
      twoFactorEnabled: false,
      emailVerified: true,
      rememberMe: true
    };
    onAuthSuccess(mockUser);
    onClose();
  };

  const handleEmailAction = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (screen === 'login') {
      if (!email.includes('@') || password.length < 5) {
        setErrorMsg('Please enter a valid email and 5+ character password.');
        return;
      }
      const mockUser: User = {
        id: `usr_${Math.floor(Math.random() * 9000) + 1000}`,
        email,
        displayName: displayName || email.split('@')[0],
        plan: 'Free',
        billingInterval: 'monthly',
        joinedAt: new Date().toLocaleDateString(),
        twoFactorEnabled: false,
        emailVerified: true,
        rememberMe
      };
      
      onAuthSuccess(mockUser);
      onClose();
    } else if (screen === 'register') {
      if (!displayName || !email.includes('@') || password.length < 5) {
        setErrorMsg('All fields are required. Password must be 5+ characters.');
        return;
      }
      // Trigger Verification screen as required
      setScreen('verification');
    } else if (screen === 'forgot') {
      if (!email.includes('@')) {
        setErrorMsg('Please specify a valid email target.');
        return;
      }
      setSuccessMsg(`We sent a secure recovery link to ${email}. Check your spam filter!`);
    } else if (screen === 'reset') {
      if (password.length < 5) {
        setErrorMsg('Password should have at least 5 characters.');
        return;
      }
      setSuccessMsg('Your security credential has been reset. Proceed to Login.');
      setTimeout(() => setScreen('login'), 2000);
    }
  };

  const handleSimulateVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const mockUser: User = {
        id: `usr_new_${Math.floor(Math.random() * 9000) + 1000}`,
        email,
        displayName,
        plan: 'Free',
        billingInterval: 'monthly',
        joinedAt: new Date().toLocaleDateString(),
        twoFactorEnabled: false,
        emailVerified: true,
        rememberMe
      };
      onAuthSuccess(mockUser);
      onClose();
    }, 1500);
  };

  const handleRevokeDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.id !== deviceId));
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm select-none">
      <motion.div
        id="auth-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header toolbar */}
        <div className="h-14 border-b border-zinc-200 dark:border-zinc-900 px-5 flex items-center justify-between shrink-0 bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-1.5">
            <Fingerprint className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">Identity Vault</span>
          </div>
          <button 
            id="auth-modal-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Scrollable Main body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <AnimatePresence mode="wait">
            
            {/* LOGIN PAGE */}
            {screen === 'login' && (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Welcome Back</h3>
                  <p className="text-xs text-zinc-500">Analyze & download records in real-time across 6 platforms.</p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-950/20 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Social logins */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    id="auth-google-login"
                    type="button"
                    onClick={() => handleSocialMock('Google')}
                    className="flex items-center justify-center gap-2 py-2 px-3 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    <Chrome className="w-4 h-4 text-red-500" />
                    Google
                  </button>
                  <button
                    id="auth-github-login"
                    type="button"
                    onClick={() => handleSocialMock('GitHub')}
                    className="flex items-center justify-center gap-2 py-2 px-3 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    <Github className="w-4 h-4 text-zinc-900 dark:text-white" />
                    GitHub
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex py-2 items-center text-xs text-zinc-400">
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-900" />
                  <span className="flex-shrink mx-3">or continue with email</span>
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-900" />
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailAction} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="auth-login-email"
                        type="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-orange-500 rounded-lg text-xs dark:text-zinc-100 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Security Password</label>
                      <button
                        type="button"
                        onClick={() => setScreen('forgot')}
                        className="text-[10px] text-orange-500 hover:underline"
                      >
                        Reset password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="auth-login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-orange-500 rounded-lg text-xs dark:text-zinc-100 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Remember me & verification status */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer">
                      <input
                        id="auth-remember-me-checkbox"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-zinc-300 dark:border-zinc-850 text-orange-500 focus:ring-orange-500"
                      />
                      Remember my device session
                    </label>
                  </div>

                  <button
                    id="auth-login-submit"
                    type="submit"
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white rounded-lg transition shadow-lg shadow-orange-500/10"
                  >
                    Authenticate email
                  </button>
                </form>

                {/* Footer redirection */}
                <div className="text-center pt-2 text-xs text-zinc-500">
                  Don't have an enterprise account?{' '}
                  <button
                    type="button"
                    onClick={() => setScreen('register')}
                    className="text-orange-500 font-bold hover:underline"
                  >
                    Register free portfolio
                  </button>
                </div>
              </motion.div>
            )}

            {/* REGISTER PAGE */}
            {screen === 'register' && (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Create Corporate Account</h3>
                  <p className="text-xs text-zinc-500">Start saving and exploring high-resonance social assets.</p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-950/20 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleEmailAction} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Your Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="auth-register-name"
                        type="text"
                        placeholder="John Doe"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-orange-500 rounded-lg text-xs dark:text-zinc-100 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="auth-register-email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-orange-500 rounded-lg text-xs dark:text-zinc-100 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Security Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="auth-register-password"
                        type="password"
                        placeholder="Min 5 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-orange-500 rounded-lg text-xs dark:text-zinc-100 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-500 leading-relaxed">
                    By registering, you conform to standard fair-use agreements regarding downloaded public metadata and automated exports tracking system rules.
                  </div>

                  <button
                    id="auth-register-submit"
                    type="submit"
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white rounded-lg transition shadow-lg shadow-orange-500/10"
                  >
                    Initiate Security Verification
                  </button>
                </form>

                <div className="text-center pt-2 text-xs text-zinc-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setScreen('login')}
                    className="text-orange-500 font-bold hover:underline"
                  >
                    Sign in to account
                  </button>
                </div>
              </motion.div>
            )}

            {/* EMAIL VERIFICATION SCREEN */}
            {screen === 'verification' && (
              <motion.div
                key="verification-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-5 text-center"
              >
                <div className="w-14 h-14 bg-orange-500/10 text-orange-500 mx-auto rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Activate Your License</h3>
                  <p className="text-xs text-zinc-500">
                    We sent a mock sandbox verification sequence to <b>{email}</b>. Click below to verify instantly!
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl space-y-3">
                  <span className="text-[11px] font-bold font-mono tracking-widest text-zinc-500 block">SIMULATED EMAIL LINK SENT</span>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono">Status: Awaiting Link Response</span>
                  </div>
                  <button
                    id="auth-verify-now-btn"
                    onClick={handleSimulateVerification}
                    disabled={isVerifying}
                    className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )}
                    <span>Simulate Verification Link Click</span>
                  </button>
                </div>

                <button
                  onClick={() => setScreen('register')}
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition underline"
                >
                  Change email address
                </button>
              </motion.div>
            )}

            {/* FORGOT PASSWORD */}
            {screen === 'forgot' && (
              <motion.div
                key="forgot-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Reset Credentials</h3>
                  <p className="text-xs text-zinc-500">Provide registration mail matching files directory.</p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 rounded-lg text-xs font-medium space-y-2">
                    <p>{successMsg}</p>
                    <button
                      type="button"
                      onClick={() => setScreen('reset')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] transition block"
                    >
                      Follow Dynamic Link (Reset) &rarr;
                    </button>
                  </div>
                )}

                {!successMsg && (
                  <form onSubmit={handleEmailAction} className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Registrant Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          id="auth-forgot-email"
                          type="email"
                          placeholder="you@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-orange-500 rounded-lg text-xs outline-none transition"
                        />
                      </div>
                    </div>

                    <button
                      id="auth-forgot-submit"
                      type="submit"
                      className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition"
                    >
                      Dispatch Recovery Link
                    </button>
                  </form>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setScreen('login')}
                    className="text-xs text-orange-500 font-semibold hover:underline"
                  >
                    Go back to sign in
                  </button>
                </div>
              </motion.div>
            )}

            {/* RESET PASSWORD */}
            {screen === 'reset' && (
              <motion.div
                key="reset-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Set New Security Password</h3>
                  <p className="text-xs text-zinc-500 font-mono text-orange-500">Security Ticket #SL-284902-D7</p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleEmailAction} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-[9px]">Enter New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        id="auth-reset-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50"
                      />
                    </div>
                  </div>

                  <button
                    id="auth-reset-submit"
                    type="submit"
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
                  >
                    Persist Custom Security Credential
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIVE SESSIONS & DEVICE MANAGEMENT PANEL */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-900 space-y-3">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Device Session Tracker</span>
            </div>
            
            <p className="text-[11px] text-zinc-500 leading-normal">
              For security, you are currently allowed up to <b>3 dynamic browser slots</b>. Revoking a session signs that unit out immediately.
            </p>

            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {devices.map((d) => (
                <div 
                  id={`device-session-${d.id}`}
                  key={d.id} 
                  className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850"
                >
                  <div className="flex items-center gap-2.5">
                    {d.os === 'iOS' || d.os === 'Android' ? (
                      <Smartphone className="w-4 h-4 text-zinc-400 shrink-0" />
                    ) : (
                      <Chrome className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                    <div className="flex flex-col text-[10px]">
                      <span className="font-semibold text-zinc-850 dark:text-zinc-200">
                        {d.browser} on {d.os} {d.isCurrent && <span className="text-[9px] px-1 bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 rounded font-bold">This unit</span>}
                      </span>
                      <span className="text-zinc-500 font-mono scale-95 origin-left">
                        IP: {d.ip} | {d.location} | Active: {d.lastActive}
                      </span>
                    </div>
                  </div>

                  {!d.isCurrent && (
                    <button
                      id={`revoke-session-btn-${d.id}`}
                      onClick={() => handleRevokeDevice(d.id)}
                      className="text-[9px] font-bold text-red-500 hover:text-red-600 hover:underline transition px-2 py-1 shrink-0 bg-red-500/5 hover:bg-red-500/10 rounded"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
