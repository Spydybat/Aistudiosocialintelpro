import React from 'react';
 
interface LogoIconProps {
  className?: string;
  theme?: 'light' | 'dark';
}
 
export default function LogoIcon({ className = "w-6 h-6", theme }: LogoIconProps) {
  const isLightOverride = theme === 'light';
  const isDarkOverride = theme === 'dark';

  return (
    <div 
      className={`${className} shrink-0 transition-transform duration-300 hover:scale-105 inline-block relative`} 
      id="socialintel-logo-icon"
    >
      {/* Light Mode SVG (visible by default, hidden in dark mode) */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${isLightOverride ? 'block' : isDarkOverride ? 'hidden' : 'block dark:hidden'}`}
      >
        <defs>
          <linearGradient id="si-blue-gradient-light" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>
        
        {/* 'S' Monogram Path: geometric fluid curve with thick profile */}
        <path
          d="M 54,34 C 44,28 26,28 26,40 C 26,51 54,49 54,60 C 54,72 36,72 26,66"
          stroke="url(#si-blue-gradient-light)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lowercase 'i' Vertical Pill */}
        <path
          d="M 72,42 V 66"
          stroke="url(#si-blue-gradient-light)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Lowercase 'i' Dot */}
        <circle
          cx="72"
          cy="26"
          r="5.5"
          fill="url(#si-blue-gradient-light)"
        />
      </svg>

      {/* Dark Mode SVG (hidden by default, visible in dark mode) */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${isDarkOverride ? 'block' : isLightOverride ? 'hidden' : 'hidden dark:block'}`}
      >
        <defs>
          <linearGradient id="si-blue-gradient-dark" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        
        {/* Subtle underlay outline offset for incredible pop on pitch-dark backdrops */}
        <path
          d="M 54,34 C 44,28 26,28 26,40 C 26,51 54,49 54,60 C 54,72 36,72 26,66"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 72,42 V 66"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <circle
          cx="72"
          cy="26"
          r="6.5"
          fill="rgba(255, 255, 255, 0.08)"
        />

        {/* Foregound High Contrast Monogram */}
        <path
          d="M 54,34 C 44,28 26,28 26,40 C 26,51 54,49 54,60 C 54,72 36,72 26,66"
          stroke="url(#si-blue-gradient-dark)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 72,42 V 66"
          stroke="url(#si-blue-gradient-dark)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <circle
          cx="72"
          cy="26"
          r="5.5"
          fill="url(#si-blue-gradient-dark)"
        />
      </svg>
    </div>
  );
}
