/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PlatformType, DownloadItem, User } from '../types';
import { 
  Download, 
  Link2, 
  Copy, 
  FileText, 
  Music, 
  Image as ImageIcon, 
  Tv, 
  Layers, 
  Share2, 
  Cpu, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle,
  FileJson,
  FileSpreadsheet,
  Globe,
  Sparkles,
  Play,
  ArrowLeft
} from 'lucide-react';
import { 
  handleExportJSON, 
  handleExportCSV, 
  handleExportXLSX 
} from '../lib/exporter';
import { motion } from 'motion/react';

/// Dynamic Content Attribute Resolver
export const getCompiledContentAttributes = (p: PlatformType, urlStr: string) => {
  const urlLower = (urlStr || '').toLowerCase();
  
  const isImageKeyword = urlLower.includes('image') || urlLower.includes('photo') || urlLower.includes('pic') || urlLower.includes('png') || urlLower.includes('jpg') || urlLower.includes('post') || urlLower.includes('image-post');
  const isVideoKeyword = urlLower.includes('video') || urlLower.includes('reel') || urlLower.includes('mp4') || urlLower.includes('watch') || urlLower.includes('v=') || urlLower.includes('story') || urlLower.includes('clip');
  
  let hasAudio = false;
  let hasVideo = false;
  let hasImage = false;
  let hasCaption = false;
  let hasDP = false;

  if (p === 'snapchat') {
    if (isVideoKeyword) {
      hasVideo = true;
    } else {
      hasImage = true;
    }
  } else if (p === 'threads') {
    if (isVideoKeyword) {
      hasAudio = true;
      hasVideo = true;
      hasCaption = true;
    } else {
      hasImage = true;
      hasCaption = true;
    }
  } else if (p === 'instagram') {
    if (isImageKeyword) {
      hasImage = true;
      hasCaption = true;
    } else {
      hasAudio = true;
      hasVideo = true;
      hasCaption = true;
    }
  } else if (p === 'twitter') {
    if (isImageKeyword) {
      hasImage = true;
      hasCaption = true;
    } else {
      hasAudio = true;
      hasVideo = true;
      hasCaption = true;
    }
  } else if (p === 'youtube') {
    hasAudio = true;
    hasVideo = true;
  } else if (p === 'tiktok') {
    hasAudio = true;
    hasVideo = true;
    hasCaption = true;
  }

  return { hasAudio, hasVideo, hasImage, hasCaption, hasDP };
};

// Interactive Video Player with Play, Pause, Duration, Seek Bar, Current Time, Volume, Mute
const InteractiveVideoPlayer = ({ src, coverUrl }: { src: string; coverUrl?: string; key?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log('Video play failed:', err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      setIsMuted(nextMute);
      videoRef.current.muted = nextMute;
      if (nextMute) {
        videoRef.current.volume = 0;
      } else {
        videoRef.current.volume = volume || 0.8;
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono block">Video Preview Player</span>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-zinc-200 dark:border-zinc-800 shadow-md group">
        <video 
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover cursor-pointer"
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onClick={togglePlay}
          playsInline
        />
        
        {/* Play/Pause Center Overlay */}
        {!isPlaying && (
          <div onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer hover:bg-black/40 transition">
            <span className="p-3 bg-white/95 dark:bg-zinc-900/95 text-orange-500 rounded-full shadow-lg transform hover:scale-110 active:scale-95 transition flex items-center justify-center">
              <Play className="w-5 h-5 fill-current text-orange-500 ml-0.5" />
            </span>
          </div>
        )}

        {/* Video Decryption Indicator Badge */}
        <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-emerald-400 font-mono flex items-center gap-1 border border-zinc-800 select-none pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ACTIVE PLAYER
        </div>

        {/* Control Interface Hud Panel */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-3 pt-8 space-y-2 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-200">
          <div className="flex items-center gap-2">
            <input 
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-550 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-white text-[10px] font-mono select-none">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={togglePlay}
                className="text-white hover:text-orange-400 transition cursor-pointer flex items-center justify-center outline-none h-4 w-4"
              >
                {isPlaying ? (
                  <span className="flex items-center gap-0.5 justify-center">
                    <span className="w-1 h-3.5 bg-white rounded-sm inline-block" />
                    <span className="w-1 h-3.5 bg-white rounded-sm inline-block" />
                  </span>
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current text-white" />
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <button 
                  type="button" 
                  onClick={toggleMute}
                  className="text-white hover:text-orange-400 transition cursor-pointer outline-none"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  <Music className={`w-3.5 h-3.5 ${isMuted ? 'text-zinc-500 line-through' : 'text-orange-450'}`} />
                </button>
                <input 
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-12 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 text-zinc-300">
              <span>{formatTime(currentTime)}</span>
              <span className="opacity-40">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Interactive Audio Card Preview with Play, Pause, Duration, Current Time, Seek Bar, Volume Control
const InteractiveAudioPlayer = ({ audioName }: { audioName: string; key?: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      audioRef.current.muted = vol === 0;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMute = !isMuted;
      setIsMuted(nextMute);
      audioRef.current.muted = nextMute;
      if (nextMute) {
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = volume || 0.8;
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 rounded-xl space-y-3.5 shadow-sm">
      <audio 
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
      />
      
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            type="button"
            onClick={togglePlay}
            className="p-2.5 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 active:scale-95 transition rounded-xl shrink-0 flex items-center justify-center outline-none cursor-pointer"
            title={isPlaying ? 'Pause Audio' : 'Play Audio'}
          >
            {isPlaying ? (
              <span className="flex items-center gap-0.5 justify-center w-4 h-4">
                <span className="w-1 bg-orange-500 h-3.5 rounded-sm inline-block" />
                <span className="w-1 bg-orange-500 h-3.5 rounded-sm inline-block" />
              </span>
            ) : (
              <Play className="w-4 h-4 fill-current text-orange-500 ml-0.5" />
            )}
          </button>
          <div className="flex flex-col min-w-0 text-xs text-left">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate block w-[140px] xs:w-[190px] sm:w-[280px] md:w-full max-w-full" title={audioName}>{audioName}</span>
            <span className="text-[10px] text-zinc-550 font-mono mt-0.5">MP3 Audio Layer ready</span>
          </div>
        </div>
        <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded font-mono shrink-0 select-none">320 KBPS</span>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-200/55 dark:border-zinc-800/40">
        <input 
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeekChange}
          className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
        />

        <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-mono select-none">
          <div className="flex items-center gap-1.5 text-zinc-455">
            <span>{formatTime(currentTime)}</span>
            <span className="opacity-40">/</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={toggleMute}
              className="outline-none"
            >
              <Music className={`w-3 h-3 ${isMuted ? 'text-zinc-400 line-through' : 'text-zinc-500'}`} />
            </button>
            <input 
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Interactive Image Preview Component with Large Layout, Zoom Increments, and Fullscreen Lightbox
const InteractiveImagePreview = ({ src, label = 'Cover Image Preview' }: { src: string; label?: string; key?: string }) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 1));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between select-none">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono block">{label}</span>
        
        <div className="flex items-center gap-1.5">
          <button 
            type="button" 
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            className="w-5 h-5 flex items-center justify-center text-[11px] font-bold border border-zinc-200 dark:border-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30 transition cursor-pointer"
            title="Zoom Out"
          >
            -
          </button>
          <span className="text-[9px] font-mono font-bold text-zinc-550 w-8 text-center">{Math.round(zoom * 100)}%</span>
          <button 
            type="button" 
            onClick={handleZoomIn}
            disabled={zoom >= 2.5}
            className="w-5 h-5 flex items-center justify-center text-[10px] font-bold border border-zinc-200 dark:border-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30 transition cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          {zoom > 1 && (
            <button 
               type="button" 
               onClick={handleResetZoom}
               className="px-1 py-0.5 text-[8px] font-bold border border-orange-200 text-orange-500 rounded hover:bg-orange-50 dark:hover:bg-orange-950/20 transition cursor-pointer"
            >
              Reset
            </button>
          )}
          <button 
            type="button" 
            onClick={toggleFullscreen}
            className="p-1 text-[10px] font-bold border border-zinc-200 dark:border-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition flex items-center justify-center cursor-pointer"
            title="Toggle Lightbox Fullscreen"
          >
            <span className="text-[10px] font-mono leading-none">⛶</span>
          </button>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 shadow-sm max-h-56 flex items-center justify-center">
        <div className="w-full h-56 flex items-center justify-center overflow-hidden">
          <img
            src={src}
            alt="Captured content"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>
        <div 
          onClick={toggleFullscreen} 
          className="absolute inset-0 bg-black/0 hover:bg-black/10 transition cursor-zoom-in flex items-end justify-end p-2 group"
        >
          <span className="text-[8px] bg-black/75 text-zinc-200 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition font-mono border border-zinc-800 select-none">
            Expand view ⛶
          </span>
        </div>
      </div>

      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-200 cursor-zoom-out"
          onClick={toggleFullscreen}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center gap-3">
            <button 
              type="button" 
              onClick={toggleFullscreen} 
              className="absolute -top-10 right-0 text-white font-extrabold text-[10px] sm:text-xs hover:text-orange-500 transition tracking-wider"
            >
              ✕ CLOSE LIGHTBOX PREVIEW
            </button>
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl flex items-center justify-center max-w-full max-h-[75vh]">
              <img 
                src={src} 
                alt="Lightbox preview" 
                referrerPolicy="no-referrer" 
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
            <span className="text-zinc-500 text-[10px] font-mono text-center">
              Viewing Full HD Decrypted Asset • Click empty workspace to collapse
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Interactive Carousel Preview component with multiple image navigation, thumbnail selection, zoom support, and fullscreen lightbox
const InteractiveCarouselPreview = ({ images, label = 'Carousel Preview' }: { images: string[]; label?: string; key?: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 1));
  const handleResetZoom = () => setZoom(1);

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % images.length);
    setZoom(1);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + images.length) % images.length);
    setZoom(1);
  };

  return (
    <div className="space-y-4">
      {/* Label and Zoom controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between select-none">
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono block">
            {label} ({activeIndex + 1}/{images.length})
          </span>
          
          <div className="flex items-center gap-1.5">
            <button 
              type="button" 
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="w-5 h-5 flex items-center justify-center text-[11px] font-bold border border-zinc-200 dark:border-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30 transition cursor-pointer"
              title="Zoom Out"
            >
              -
            </button>
            <span className="text-[9px] font-mono font-bold text-zinc-550 w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button 
              type="button" 
              onClick={handleZoomIn}
              disabled={zoom >= 2.5}
              className="w-5 h-5 flex items-center justify-center text-[10px] font-bold border border-zinc-250 dark:border-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-30 transition cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
            {zoom > 1 && (
              <button 
                type="button" 
                onClick={handleResetZoom}
                className="px-1 py-0.5 text-[8px] font-bold border border-orange-200 text-orange-500 rounded hover:bg-orange-50 dark:hover:bg-orange-950/20 transition cursor-pointer"
              >
                Reset
              </button>
            )}
            <button 
              type="button" 
              onClick={toggleFullscreen}
              className="p-1 text-[10px] font-bold border border-zinc-200 dark:border-zinc-800 rounded text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition flex items-center justify-center cursor-pointer"
              title="Toggle Lightbox Fullscreen"
            >
              <span className="text-[10px] font-mono leading-none">⛶</span>
            </button>
          </div>
        </div>

        {/* The Carousel slide display */}
        <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 shadow-sm h-56 flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
            <img
              src={images[activeIndex]}
              alt={`Slide ${activeIndex + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>

          {/* Navigation buttons */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 border border-zinc-700/50 flex items-center justify-center text-white text-xs font-bold transition shadow-md z-10"
          >
            ←
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 border border-zinc-700/50 flex items-center justify-center text-white text-xs font-bold transition shadow-md z-10"
          >
            →
          </button>

          {/* Indicators */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/45 px-2 py-1 rounded-full backdrop-blur-xs select-none">
            {images.map((_, i) => (
              <span 
                key={i} 
                onClick={() => { setActiveIndex(i); setZoom(1); }} 
                className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${i === activeIndex ? 'bg-orange-500 scale-125' : 'bg-zinc-400 opacity-60'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Multiple Images Preview grid */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest font-mono block">
          Multiple Images Preview
        </span>
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <div 
              key={idx}
              onClick={() => { setActiveIndex(idx); setZoom(1); }}
              className={`relative aspect-square rounded-lg overflow-hidden border cursor-pointer group transition-all ${
                idx === activeIndex 
                  ? 'border-orange-500 ring-2 ring-orange-500/20' 
                  : 'border-zinc-200 dark:border-zinc-800 opacity-65 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover animate-in fade-in" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
              <div className="absolute bottom-1 right-1 text-[8px] bg-black/75 text-white px-1 py-0.5 rounded font-mono leading-none">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-200 cursor-zoom-out"
          onClick={toggleFullscreen}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center gap-3">
            <button 
              type="button" 
              onClick={toggleFullscreen} 
              className="absolute -top-10 right-0 text-white font-extrabold text-[10px] sm:text-xs hover:text-orange-500 transition tracking-wider"
            >
              ✕ CLOSE LIGHTBOX PREVIEW
            </button>
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl flex items-center justify-center max-w-full max-h-[75vh]">
              <img 
                src={images[activeIndex]} 
                alt={`Slide preview ${activeIndex + 1}`} 
                referrerPolicy="no-referrer" 
                className="max-w-full max-h-[75vh] object-contain animate-in fade-in"
              />
            </div>
            <span className="text-zinc-500 text-[10px] font-mono text-center">
              Viewing Slide #{activeIndex + 1} of {images.length} • Click empty workspace to collapse
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Media Preview component displaying precise visual items requested per tool and platform
const MediaPreview = ({
  platform,
  toolId,
  mockData
}: {
  platform: PlatformType;
  toolId: string;
  mockData: any;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCaption = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const renderCaption = () => (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 rounded-xl space-y-1.5 text-left" key="caption-container">
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono truncate max-w-[100px] xs:max-w-[140px] sm:max-w-xs" title={mockData.username}>{mockData.username}</span>
        <div className="flex items-center gap-2 select-none shrink-0">
          {copied && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-1 py-0.5 animate-pulse">
              Caption copied.
            </span>
          )}
          <button
            id={`copy-caption-btn-${platform}`}
            type="button"
            onClick={() => handleCopyCaption(mockData.caption)}
            className="text-[10px] bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition shadow-sm"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Caption</span>
          </button>
        </div>
      </div>
      <p className="text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed italic text-left break-words [word-break:break-word] [overflow-wrap:anywhere]">"{mockData.caption}"</p>
    </div>
  );

  const renderProfile = () => (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 rounded-xl flex items-center gap-3" key="profile-card">
      <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-orange-500 shrink-0">
        <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
          <img
            src={mockData.avatarUrl}
            alt="Avatar"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex flex-col min-w-0 text-left">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono truncate">{mockData.username}</span>
        <span className="text-[9px] text-zinc-550 font-medium">Profile Preview</span>
      </div>
    </div>
  );

  const renderGIF = () => (
    <div className="space-y-2" key="gif-preview">
      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono block">GIF Preview Loop</span>
      <div className="relative rounded-xl overflow-hidden aspect-video bg-zinc-950 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center">
        <img src={mockData.coverUrl} alt="GIF" className="w-full h-full object-cover animate-[pulse_2.5s_infinite]" />
        <div className="absolute top-2.5 left-2.5 bg-zinc-900 border border-zinc-800 text-white font-extrabold text-[9px] px-2 py-0.5 rounded select-none">
          GIF LOOP
        </div>
      </div>
    </div>
  );

  const renderSnapstory = () => (
    <div className="space-y-2" key="snapchat-story">
      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono block">Story Segment Preview</span>
      <div className="relative rounded-2xl overflow-hidden aspect-[9/16] max-h-72 mx-auto bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
        <img src={mockData.coverUrl} alt="Snap Story" className="w-full h-full object-cover" />
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/85 to-transparent p-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border border-white/40 overflow-hidden">
            <img src={mockData.avatarUrl} alt="Avatar" className="w-full h-full object-cover animate-pulse" />
          </div>
          <div className="flex flex-col text-[10px] text-white text-left">
            <span className="font-extrabold">{mockData.username}</span>
            <span className="text-[8px] opacity-65">Story Preview</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDescription = () => (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 rounded-xl space-y-1.5 text-left" key="yt-description-container">
      <div className="flex items-center justify-between gap-1.5 min-w-0">
        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono truncate max-w-[100px] xs:max-w-[140px] sm:max-w-xs" title={mockData.username}>{mockData.username}</span>
        <div className="flex items-center gap-2 select-none shrink-0">
          {copied && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-455 font-bold px-1 py-0.5 animate-pulse">
              Caption copied.
            </span>
          )}
          <button
            id={`copy-caption-btn-${platform}-desc`}
            type="button"
            onClick={() => handleCopyCaption(mockData.caption)}
            className="text-[10px] bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition shadow-sm"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Caption</span>
          </button>
        </div>
      </div>
      <p className="text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed italic text-left break-words [word-break:break-word] [overflow-wrap:anywhere]">"{mockData.caption}"</p>
    </div>
  );

  // Return correctly constructed visual element lists based strictly on prompt specs:
  const getPreviewElements = () => {
    if (toolId !== 'all') {
      if (toolId === 'reels' || toolId === 'video' || toolId === 'media') {
        const videoSrc = platform === 'snapchat' 
          ? "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-501-large.mp4" 
          : "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4";
        return [<InteractiveVideoPlayer key="iv" src={videoSrc} coverUrl={mockData.coverUrl} />];
      }
      if (toolId === 'post') {
        return [
          <InteractiveImagePreview key="post-img" src={mockData.postImageUrl || mockData.coverUrl} label="Image Preview" />
        ];
      }
      if (toolId === 'carousel') {
        const carouselImgs = mockData.carouselImages || [
          'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&h=450',
          'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&h=450',
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&h=450',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=450',
        ];
        return [
          <InteractiveCarouselPreview key="carousel" images={carouselImgs} label="Carousel Preview" />
        ];
      }
      if (toolId === 'caption') {
        return [renderCaption()];
      }
      if (toolId === 'cover' || toolId === 'thumbnail') {
        const label = platform === 'youtube' ? "YouTube Video Thumbnail Preview" : "Cover Preview";
        return [<InteractiveImagePreview key="cover" src={mockData.coverUrl} label={label} />];
      }
      if (toolId === 'audio') {
        return [<InteractiveAudioPlayer key="ia" audioName={mockData.audioName} />];
      }
      if (toolId === 'dp') {
        return [<InteractiveImagePreview key="dp" src={mockData.avatarUrl} label="Profile Image Preview" />];
      }
      if (toolId === 'photo' || toolId === 'image') {
        return [<InteractiveImagePreview key="cover" src={mockData.coverUrl} label="Image Preview" />];
      }
      if (toolId === 'gif') {
        return [renderGIF()];
      }
      if (toolId === 'story') {
        return [renderSnapstory()];
      }
      return [<InteractiveImagePreview key="cover" src={mockData.coverUrl} />];
    }

    const hasImageKeyword = false;
    const hasVideoKeyword = false;
    const hasAudioKeyword = false;

    const noKeywords = true;

    const elementsList: React.ReactNode[] = [];

    if (platform === 'instagram') {
      const videoExists = hasVideoKeyword || noKeywords;
      const audioExists = hasAudioKeyword || noKeywords;
      const imageExists = hasImageKeyword || noKeywords || hasVideoKeyword || hasAudioKeyword;

      // 1. MAIN CONTENT PREVIEW
      if (videoExists) {
        elementsList.push(<InteractiveVideoPlayer key="iv" src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" coverUrl={mockData.coverUrl} />);
      } else if (imageExists) {
        elementsList.push(<InteractiveImagePreview key="cover-main" src={mockData.coverUrl} label="Image Preview" />);
      }

      // 2. AUDIO PREVIEW
      if (audioExists) {
        elementsList.push(<InteractiveAudioPlayer key="ia" audioName={mockData.audioName} />);
      }

      // 3. CAPTION PREVIEW
      elementsList.push(renderCaption());

      // 4. COVER / THUMBNAIL PREVIEW
      if (imageExists && videoExists) {
        elementsList.push(<InteractiveImagePreview key="cover" src={mockData.coverUrl} label="Cover Preview" />);
      }

      // 5. PROFILE PREVIEW
      elementsList.push(renderProfile());
    } else if (platform === 'twitter') {
      const videoExists = hasVideoKeyword || noKeywords;
      const audioExists = hasAudioKeyword || noKeywords;
      const imageExists = hasImageKeyword || noKeywords || hasVideoKeyword || hasAudioKeyword;

      // 1. MAIN CONTENT PREVIEW
      if (videoExists) {
        elementsList.push(<InteractiveVideoPlayer key="iv" src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" coverUrl={mockData.coverUrl} />);
      } else if (imageExists) {
        elementsList.push(<InteractiveImagePreview key="cover-main" src={mockData.coverUrl} label="Tweet Media Cover Preview" />);
      }

      // 2. AUDIO PREVIEW
      if (audioExists) {
        elementsList.push(<InteractiveAudioPlayer key="ia" audioName={mockData.audioName} />);
      }

      // 3. CAPTION PREVIEW
      elementsList.push(renderCaption());

      // 4. COVER / THUMBNAIL PREVIEW
      if (imageExists && videoExists) {
        elementsList.push(<InteractiveImagePreview key="cover" src={mockData.coverUrl} label="Tweet Media Cover Preview" />);
      }

      // 5. PROFILE PREVIEW
      elementsList.push(renderProfile());
    } else if (platform === 'youtube') {
      const videoExists = hasVideoKeyword || noKeywords;
      const audioExists = hasAudioKeyword || noKeywords;
      const imageExists = hasImageKeyword || noKeywords || hasVideoKeyword || hasAudioKeyword;

      // 1. MAIN CONTENT PREVIEW
      if (videoExists) {
        elementsList.push(<InteractiveVideoPlayer key="iv" src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" coverUrl={mockData.coverUrl} />);
      } else if (imageExists) {
        elementsList.push(<InteractiveImagePreview key="cover-main" src={mockData.coverUrl} label="YouTube Video Thumbnail Preview" />);
      }

      // 2. AUDIO PREVIEW
      if (audioExists) {
        elementsList.push(<InteractiveAudioPlayer key="ia" audioName={mockData.audioName} />);
      }

      // 3. CAPTION PREVIEW
      elementsList.push(renderDescription());

      // 4. COVER / THUMBNAIL PREVIEW
      if (imageExists && videoExists) {
        elementsList.push(<InteractiveImagePreview key="cover" src={mockData.coverUrl} label="YouTube Video Thumbnail Preview" />);
      }

      // 5. PROFILE PREVIEW
      elementsList.push(renderProfile());
    } else if (platform === 'threads') {
      const videoExists = hasVideoKeyword || noKeywords;
      const audioExists = hasAudioKeyword || noKeywords;

      // 1. POST PREVIEW
      if (mockData.hasPostContent) {
        elementsList.push(
          <div key="post-preview-container" className="space-y-1 bg-zinc-50 dark:bg-zinc-900/20 p-2.5 rounded-xl border border-zinc-250/60 dark:border-zinc-850 text-left">
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider font-mono block">Post Image Preview</span>
            <InteractiveImagePreview src={mockData.postImageUrl || mockData.coverUrl} label="Threads Post Image Slide" />
          </div>
        );
      }

      // 2. MEDIA PREVIEW
      if (videoExists) {
        elementsList.push(
          <div key="media-preview-container" className="space-y-1 text-left">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-mono block">Media Preview</span>
            <InteractiveVideoPlayer src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" coverUrl={mockData.coverUrl} />
          </div>
        );
      }

      if (audioExists) {
        elementsList.push(<InteractiveAudioPlayer key="ia" audioName={mockData.audioName} />);
      }

      // 3. CAPTION PREVIEW
      elementsList.push(renderCaption());

      // 4. PROFILE PREVIEW
      elementsList.push(renderProfile());
    } else if (platform === 'tiktok') {
      const videoExists = hasVideoKeyword || noKeywords;
      const audioExists = hasAudioKeyword || noKeywords;
      const imageExists = hasImageKeyword || noKeywords || hasVideoKeyword || hasAudioKeyword;

      // 1. MAIN CONTENT PREVIEW
      if (videoExists) {
        elementsList.push(<InteractiveVideoPlayer key="iv" src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" coverUrl={mockData.coverUrl} />);
      } else if (imageExists) {
        elementsList.push(<InteractiveImagePreview key="cover-main" src={mockData.coverUrl} label="Cover Preview" />);
      }

      if (mockData.hasPostContent) {
        elementsList.push(
          <div key="post-preview-container" className="space-y-1 bg-zinc-50 dark:bg-zinc-900/20 p-2.5 rounded-xl border border-zinc-250/60 dark:border-zinc-850 text-left">
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider font-mono block">Post Image Preview</span>
            <InteractiveImagePreview src={mockData.postImageUrl || mockData.coverUrl} label="TikTok Post Image Slide" />
          </div>
        );
      }

      // 2. AUDIO PREVIEW
      if (audioExists) {
        elementsList.push(<InteractiveAudioPlayer key="ia" audioName={mockData.audioName} />);
      }

      // 3. CAPTION PREVIEW
      elementsList.push(renderCaption());

      // 4. COVER / THUMBNAIL PREVIEW
      if (imageExists && videoExists) {
        elementsList.push(<InteractiveImagePreview key="cover" src={mockData.coverUrl} label="Cover Preview" />);
      }

      // 5. PROFILE PREVIEW
      elementsList.push(renderProfile());
    } else if (platform === 'snapchat') {
      const videoExists = hasVideoKeyword || noKeywords;
      const imageExists = hasImageKeyword || noKeywords;

      // 1. MAIN CONTENT PREVIEW
      elementsList.push(renderSnapstory());

      // 2. AUDIO PREVIEW - N/A for snapchat

      // 3. CAPTION PREVIEW
      if (mockData.caption) {
        elementsList.push(renderCaption());
      }

      // 4. COVER / THUMBNAIL PREVIEW
      if (videoExists) {
        elementsList.push(<InteractiveVideoPlayer key="iv" src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-501-large.mp4" coverUrl={mockData.coverUrl} />);
      }
      if (imageExists) {
        elementsList.push(<InteractiveImagePreview key="cover-snap" src={mockData.coverUrl} label="Image Preview" />);
      }

      // 5. PROFILE PREVIEW
      elementsList.push(renderProfile());
    }

    if (elementsList.length === 0) {
      elementsList.push(<InteractiveImagePreview key="cover" src={mockData.coverUrl} />, renderCaption());
    }

    return elementsList;
  };

  return (
    <div className="space-y-4 p-5 bg-zinc-50/55 dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-900 rounded-2xl select-text">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-2.5">
        <h4 className="text-[11px] font-bold text-orange-500 uppercase tracking-wider font-mono flex items-center gap-1.5 select-none">
          <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-[pulse_1.5s_infinite]" />
          PREVIEW GENERATED
        </h4>
        <span className="text-[9px] bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 font-mono px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-850 select-none">
          Safe Feed Verified
        </span>
      </div>
      <div className={toolId === 'all' ? "flex flex-col gap-6 w-full" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {getPreviewElements().map((el, i) => (
          <div key={i} className={toolId === 'all' ? "w-full space-y-1.5 animate-fade-in" : "col-span-1 md:last:col-span-2 md:only:col-span-2 space-y-1"}>
            {el}
          </div>
        ))}
      </div>
    </div>
  );
};

interface PlatformToolsProps {
  platform: PlatformType;
  user: User | null;
  onAddDownload: (item: Omit<DownloadItem, 'id' | 'progress' | 'status' | 'addedAt'>) => void;
  onAddExportLog: (query: string, details: string) => void;
  openAuth: () => void;
  setExplorerActiveUsername: (username: string) => void;
  setExplorerActiveTab: () => void;
  selectedToolType: string | null;
  setSelectedToolType: (toolType: string | null) => void;
}

export default function PlatformTools({
  platform,
  user,
  onAddDownload,
  onAddExportLog,
  openAuth,
  setExplorerActiveUsername,
  setExplorerActiveTab,
  selectedToolType,
  setSelectedToolType
}: PlatformToolsProps) {
  
  // URL configurations
  const [singleUrl, setSingleUrl] = useState(() => {
    return sessionStorage.getItem(`platform_tools_${platform}_singleUrl`) || '';
  });
  const [allUrl, setAllUrl] = useState(() => {
    return sessionStorage.getItem(`platform_tools_${platform}_allUrl`) || '';
  });
  const [isUrlCompiling, setIsUrlCompiling] = useState(false);
  const [hasCompiledAll, setHasCompiledAll] = useState(() => {
    return sessionStorage.getItem(`platform_tools_${platform}_hasCompiledAll`) === 'true';
  });

  // Standalone tools specific transitions
  const [isSingleAnalyzing, setIsSingleAnalyzing] = useState(false);
  const [hasCompiledSingle, setHasCompiledSingle] = useState(() => {
    return sessionStorage.getItem(`platform_tools_${platform}_hasCompiledSingle`) === 'true';
  });
  const [singleAnalyzedUrl, setSingleAnalyzedUrl] = useState(() => {
    return sessionStorage.getItem(`platform_tools_${platform}_singleAnalyzedUrl`) || '';
  });

  // Strict URL states for resetting as requested by CRITICAL FORCE FIX
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [urlHistory, setUrlHistory] = useState<string[]>([]);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);
  const [cachedUrls, setCachedUrls] = useState<string[]>([]);
  const [processedUrls, setProcessedUrls] = useState<string[]>([]);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  // Helper to force reset ALL historical or previous states
  const forceResetAllUrlStates = () => {
    setPreviousUrl(null);
    setUrlHistory([]);
    setRecentUrls([]);
    setCachedUrls([]);
    setProcessedUrls([]);
    setSourceUrl(null);
  };
  
  // Custom tool modes
  const [copiedCaptionSuccess, setCopiedCaptionSuccess] = useState(false);

  // Track previous values in refs to guard against initial mount/remount clearing
  const prevPlatformRef = useRef<PlatformType>(platform);
  const prevSelectedToolTypeRef = useRef<string | null>(selectedToolType);
  const prevAllUrlRef = useRef<string>(allUrl);
  const prevSingleUrlRef = useRef<string>(singleUrl);

  // Sync states to sessionStorage on update
  useEffect(() => {
    sessionStorage.setItem(`platform_tools_${platform}_singleUrl`, singleUrl);
  }, [platform, singleUrl]);

  useEffect(() => {
    sessionStorage.setItem(`platform_tools_${platform}_allUrl`, allUrl);
  }, [platform, allUrl]);

  useEffect(() => {
    sessionStorage.setItem(`platform_tools_${platform}_hasCompiledAll`, String(hasCompiledAll));
  }, [platform, hasCompiledAll]);

  useEffect(() => {
    sessionStorage.setItem(`platform_tools_${platform}_hasCompiledSingle`, String(hasCompiledSingle));
  }, [platform, hasCompiledSingle]);

  useEffect(() => {
    sessionStorage.setItem(`platform_tools_${platform}_singleAnalyzedUrl`, singleAnalyzedUrl);
  }, [platform, singleAnalyzedUrl]);

  // Clear states ONLY when platform actually changes
  useEffect(() => {
    if (prevPlatformRef.current !== platform) {
      setSelectedToolType(null);
      setHasCompiledAll(false);
      setHasCompiledSingle(false);
      setIsSingleAnalyzing(false);
      setSingleUrl('');
      setAllUrl('');
      forceResetAllUrlStates();
      
      // Clear current platform sessionStorage cache
      sessionStorage.removeItem(`platform_tools_${platform}_singleUrl`);
      sessionStorage.removeItem(`platform_tools_${platform}_allUrl`);
      sessionStorage.removeItem(`platform_tools_${platform}_hasCompiledAll`);
      sessionStorage.removeItem(`platform_tools_${platform}_hasCompiledSingle`);
      sessionStorage.removeItem(`platform_tools_${platform}_singleAnalyzedUrl`);
      sessionStorage.removeItem(`platform_tools_${platform}_capturedCaption`);
      sessionStorage.removeItem(`platform_tools_${platform}_capturedAudioName`);
      sessionStorage.removeItem(`platform_tools_${platform}_capturedMediaSource`);

      prevPlatformRef.current = platform;
    }
  }, [platform]);

  // Clear states ONLY when selectedToolType actually changes
  useEffect(() => {
    if (prevSelectedToolTypeRef.current !== selectedToolType) {
      setHasCompiledAll(false);
      setHasCompiledSingle(false);
      setIsSingleAnalyzing(false);
      setSingleUrl('');
      setAllUrl('');
      forceResetAllUrlStates();
      prevSelectedToolTypeRef.current = selectedToolType;
    }
  }, [selectedToolType]);

  // Automatically clear previous URL compiled states when URL inputs actually change
  useEffect(() => {
    if (prevAllUrlRef.current !== allUrl) {
      setHasCompiledAll(false);
      setIsUrlCompiling(false);
      forceResetAllUrlStates();
      prevAllUrlRef.current = allUrl;
    }
  }, [allUrl]);

  useEffect(() => {
    if (prevSingleUrlRef.current !== singleUrl) {
      setHasCompiledSingle(false);
      setIsSingleAnalyzing(false);
      setSingleAnalyzedUrl('');
      forceResetAllUrlStates();
      prevSingleUrlRef.current = singleUrl;
    }
  }, [singleUrl]);

  // Synchronized platforms configs helper
  const getMockDataForPlatform = (p: PlatformType) => {
    switch (p) {
      case 'instagram': return {
        username: '@mindful_scapes',
        caption: 'Explore the absolute best views of our planet! Modern architectures meet positive ambient flows. 🌿✨ #nature #architecture #mindfulness #saas',
        audioName: 'Cyber Twilight Lo-Fi - Original Audio',
        coverUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&h=450',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150',
        title: 'Instagram Reel Visual Post',
        carouselImages: [
          'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&h=450',
          'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&h=450',
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&h=450',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=450',
        ]
      };
      case 'twitter': return {
        username: '@ambient_pulse',
        caption: 'Designing a fully functional layout in React is pure art. Clean spacing, bold negative layouts, and true craftsmanship. 💻🔥 #build #uidesign #webdev',
        audioName: 'Verified Space Audio Broadcast',
        coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=450',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150',
        title: 'Tweet Thread Media Capture',
      };
      case 'youtube': return {
        username: 'Mindfulness & Sound Channel',
        caption: 'We compiled another full-length set for your twilight programming. Let the waves of 432hz focus stream guide your productivity hours.',
        audioName: '10 Hours Deep Lofi for Coding & Creative Focus',
        coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&h=450',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
        title: '10 Hours Deep Ambient Lofi for Coding & Creative Work',
      };
      case 'snapchat': return {
        username: 'daily_flows',
        caption: 'Out on the mountains today. Feeling blessed with these organic peaks. 🏔️✨',
        audioName: 'Live Snap Audio Sync',
        coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&h=450',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150',
        title: 'Snapchat Story Slice',
      };
      case 'threads': return {
        username: '@serene_vibes',
        caption: 'Threads spacing is quite beautiful. It forces the writer to design clean text structures. Let us continue the build carefully! 🧵📐',
        audioName: 'Threads Voice Stream Layer',
        coverUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&h=450',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150',
        title: 'Threads Micro Post Media',
        postImageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&h=450',
        hasPostContent: true,
      };
      case 'tiktok': return {
        username: '@ambient.twilight',
        caption: 'Try this breathing pattern loop for 30 seconds. Inhale, synchronize, expand. 🌸 Breath cycle active. #wellness #aesthetic #ambient',
        audioName: 'Aesthetic Breathing Wave - Ambient Sound Track',
        coverUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392c?auto=format&fit=crop&w=800&h=450',
        avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150',
        title: 'TikTok Viral Breathing Loop',
        postImageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392c?auto=format&fit=crop&w=800&h=450',
        hasPostContent: true,
      };
    }
  };

  const mockData = getMockDataForPlatform(platform);

  // Simulated captures (kept for backwards compatibility with previous definitions)
  const [capturedCaption, setCapturedCaption] = useState(() => {
    return sessionStorage.getItem(`platform_tools_${platform}_capturedCaption`) || mockData.caption;
  });
  const [capturedAudioName, setCapturedAudioName] = useState(() => {
    return sessionStorage.getItem(`platform_tools_${platform}_capturedAudioName`) || mockData.audioName;
  });
  const [capturedMediaSource, setCapturedMediaSource] = useState(() => {
    return sessionStorage.getItem(`platform_tools_${platform}_capturedMediaSource`) || mockData.coverUrl;
  });

  useEffect(() => {
    sessionStorage.setItem(`platform_tools_${platform}_capturedCaption`, capturedCaption);
  }, [platform, capturedCaption]);

  useEffect(() => {
    sessionStorage.setItem(`platform_tools_${platform}_capturedAudioName`, capturedAudioName);
  }, [platform, capturedAudioName]);

  useEffect(() => {
    sessionStorage.setItem(`platform_tools_${platform}_capturedMediaSource`, capturedMediaSource);
  }, [platform, capturedMediaSource]);

  const getPlatformColors = (p: PlatformType) => {
    switch (p) {
      case 'instagram': return { primary: 'bg-pink-600 hover:bg-pink-700 focus:border-pink-500', text: 'text-pink-500' };
      case 'twitter': return { primary: 'bg-blue-450 hover:bg-blue-500 focus:border-blue-400', text: 'text-blue-400' };
      case 'youtube': return { primary: 'bg-red-655 hover:bg-red-700 focus:border-red-500', text: 'text-red-500' };
      case 'snapchat': return { primary: 'bg-yellow-500 hover:bg-yellow-600 focus:border-yellow-400', text: 'text-yellow-600' };
      case 'threads': return { primary: 'bg-zinc-800 hover:bg-zinc-900 focus:border-zinc-700', text: 'text-zinc-450' };
      case 'tiktok': return { primary: 'bg-cyan-500 hover:bg-cyan-600 focus:border-cyan-400', text: 'text-cyan-400' };
    }
  };

  const getToolsForPlatform = (p: PlatformType) => {
    switch (p) {
      case 'instagram': return [
        { id: 'all', name: 'All-in-1 Downloader', icon: Layers, desc: 'Extractor tool taking a single URL and capturing videos, reels, frames, sound and covers' },
        { id: 'reels', name: 'Reels Video Capture', icon: Tv, desc: 'Downloads fully rendered Reels as high-bitrate MP4 files' },
        { id: 'post', name: 'Post Downloader', icon: ImageIcon, desc: 'Extract high definition image/photo assets from single image post URLs' },
        { id: 'carousel', name: 'Carousel Downloader', icon: Layers, desc: 'Extract and navigate all image cards from multi-media carousel slides' },
        { id: 'audio', name: 'Audio Extractor', icon: Music, desc: 'Extract original sounds and audio layers as standard 320kbps MP3 tracks' },
        { id: 'caption', name: 'Caption Copy Tool', icon: FileText, desc: 'Copies and extracts Unicode descriptions with hashtags and mentions' },
        { id: 'cover', name: 'Reel Cover Downloader', icon: ImageIcon, desc: 'Download original high-definition cover photography' },
        { id: 'dp', name: 'DP Profile Downloader', icon: Share2, desc: 'Retrieve full-size avatar imagery from link post users' },
        { id: 'explorer', name: 'Account Explorer', icon: Sparkles, desc: 'Advanced search, analytics, and metadata export engine for profiles' },
      ];
      case 'twitter': return [
        { id: 'all', name: 'All-in-1 Downloader', icon: Layers, desc: 'Simultaneous text, video stream, GIF and photo assets capture' },
        { id: 'video', name: 'Twt Video Downloader', icon: Tv, desc: 'Captures and downloads MP4 video attachments from tweets' },
        { id: 'photo', name: 'Photo Extractor', icon: ImageIcon, desc: 'Extracts full-resolution image attachments' },
        { id: 'gif', name: 'GIF Capture Tool', icon: Share2, desc: 'Download animated micro looping GIFs' },
        { id: 'dp', name: 'Avatar Profile Downloader', icon: Globe, desc: 'High-res extraction of the author avatar' },
        { id: 'cover', name: 'Tweet Media Cover', icon: ImageIcon, desc: 'Saves the preview image container' },
        { id: 'audio', name: 'Audio Extractor', icon: Music, desc: 'Converts voice links to MP3 file' },
        { id: 'caption', name: 'Caption Downloader', icon: FileText, desc: 'Extract text message characters' },
        { id: 'explorer', name: 'Account Explorer', icon: Sparkles, desc: 'Advanced search, analytics, and metadata export engine for profiles' },
      ];
      case 'youtube': return [
        { id: 'all', name: 'All Downloader', icon: Layers, desc: 'Captures video, sound layers, transcripts, description and profile picture at once' },
        { id: 'video', name: 'Video Downloader', icon: Tv, desc: 'Full-length MP4 video save' },
        { id: 'audio', name: 'Audio Downloader', icon: Music, desc: 'Saves standard 320kbps MP3 sound' },
        { id: 'thumbnail', name: 'Thumbnail Downloader', icon: ImageIcon, desc: 'Captures YouTube HD preview thumbnail' },
        { id: 'caption', name: 'Description Downloader', icon: FileText, desc: 'Copies description texts and timestamp comments' },
        { id: 'dp', name: 'Profile Picture Downloader', icon: Share2, desc: 'Downloads YouTube channel profile picture avatar in high resolution' },
        { id: 'explorer', name: 'Account Explorer', icon: Sparkles, desc: 'Advanced search, analytics, and metadata export engine for profiles' },
      ];
      case 'snapchat': return [
        { id: 'all', name: 'All Downloader', icon: Layers, desc: 'Pulls profile pic, video, stories from URL' },
        { id: 'story', name: 'Story Downloader', icon: Tv, desc: 'Saves active temporary story slides' },
        { id: 'video', name: 'Media Downloader', icon: Play, desc: 'Extracts high definition snap video clips' },
        { id: 'caption', name: 'Caption Downloader', icon: FileText, desc: 'Save Snapchat descriptions and text captions' },
        { id: 'dp', name: 'Profile Downloader', icon: Share2, desc: 'Retrieve Snapchat avatar graphics' },
        { id: 'explorer', name: 'Account Explorer', icon: Sparkles, desc: 'Advanced search, analytics, and metadata export engine for profiles' },
      ];
      case 'threads': return [
        { id: 'all', name: 'All Downloader', icon: Layers, desc: 'Pulls video/media, post, captions, and profile picture concurrently' },
        { id: 'post', name: 'Post Downloader', icon: ImageIcon, desc: 'Saves Threads photo/carousel/image posts' },
        { id: 'media', name: 'Media Downloader', icon: Tv, desc: 'Downloads high quality video/audio media from Threads' },
        { id: 'caption', name: 'Caption Downloader', icon: FileText, desc: 'Save Threads text sequences' },
        { id: 'dp', name: 'Profile Downloader', icon: Share2, desc: 'Avatar saver' },
        { id: 'explorer', name: 'Account Explorer', icon: Sparkles, desc: 'Advanced search, analytics, and metadata export engine for profiles' },
      ];
      case 'tiktok': return [
        { id: 'all', name: 'All Downloader', icon: Layers, desc: 'Pulls video, post, audio, caption, cover and profile picture concurrently' },
        { id: 'video', name: 'Video Downloader', icon: Tv, desc: 'Saves watermark-free loop video tracks' },
        { id: 'post', name: 'Post Downloader', icon: ImageIcon, desc: 'Saves TikTok image slide and photo posts' },
        { id: 'audio', name: 'Audio Downloader', icon: Music, desc: 'Save TikTok sounds as MP3 audio layers' },
        { id: 'caption', name: 'Caption Downloader', icon: FileText, desc: 'Saves Unicode descriptions' },
        { id: 'cover', name: 'Cover Downloader', icon: ImageIcon, desc: 'Extractor for video frames and carousel covers' },
        { id: 'dp', name: 'Profile Downloader', icon: Share2, desc: 'Saves TikTok user avatar graphic' },
        { id: 'explorer', name: 'Account Explorer', icon: Sparkles, desc: 'Advanced search, analytics, and metadata export engine for profiles' },
      ];
    }
  };

  const colors = getPlatformColors(platform);
  const tools = getToolsForPlatform(platform);

  // Triggering the compiling/searching of All Downloader
  const handleCompileAllDownloader = (e: React.FormEvent) => {
    e.preventDefault();
    const url = allUrl.trim();
    if (!url) return;

    // Reset previous URL, history, cached and processed URL memories completely
    forceResetAllUrlStates();

    setIsUrlCompiling(true);
    setHasCompiledAll(false);

    // Simulate safe server sync
    setTimeout(() => {
      setIsUrlCompiling(false);
      setHasCompiledAll(true);
      // Set only current url as active processed state
      setSourceUrl(url);
      setProcessedUrls([url]);
    }, 1500);
  };

  // Triggering individual tool capture with analysis first
  const handleSingleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const url = singleUrl.trim();
    if (!url) return;

    // Reset previous URL, history, cached and processed URL memories completely
    forceResetAllUrlStates();

    setIsSingleAnalyzing(true);
    setHasCompiledSingle(false);
    setSingleAnalyzedUrl(url);

    // Simulate safe server sync
    setTimeout(() => {
      setIsSingleAnalyzing(false);
      setHasCompiledSingle(true);
      // Set only current url as active processed state
      setSourceUrl(url);
      setProcessedUrls([url]);
    }, 1200);
  };

  const handleSingleDownload = () => {
    if (!user) {
      openAuth();
      return;
    }

    const url = singleAnalyzedUrl || singleUrl || 'https://mock-stream.com/active-download';

    let typeName = selectedToolType || 'video';
    let size = '14.2 MB';
    if (typeName === 'caption' || typeName === 'caption_copy') size = '6 KB';
    if (typeName === 'audio') size = '3.5 MB';
    if (typeName === 'dp' || typeName === 'cover' || typeName === 'photo') size = '1.2 MB';
    if (typeName === 'post') size = '2.1 MB';
    if (typeName === 'carousel') size = '8.4 MB';

    let dlType: any = typeName;
    if (typeName === 'post') dlType = 'image';
    if (typeName === 'carousel') dlType = 'bundle';

    onAddDownload({
      platform,
      title: platform === 'threads'
        ? `${platform.toUpperCase()} ${selectedToolType?.toUpperCase()} Asset`
        : `${platform.toUpperCase()} ${selectedToolType?.toUpperCase()} Asset - ${url.substring(0, 18)}`,
      type: dlType,
      url: url,
      size: size
    });
  };

  // Copy Caption to Clipboard safely
  const triggerCopyCaption = () => {
    navigator.clipboard.writeText(capturedCaption);
    setCopiedCaptionSuccess(true);
    setTimeout(() => setCopiedCaptionSuccess(false), 2000);
  };

  // All Downloader triggers
  const executeCaptureAllField = (type: any, titleStr: string, size: string) => {
    if (!user) {
      openAuth();
      return;
    }
    onAddDownload({
      platform,
      title: `${platform.toUpperCase()} All-Downloader: ${titleStr}`,
      type,
      url: allUrl || 'https://mock-stream.com/link-active',
      size
    });
  };

  // Export metadata for All Downloader
  const executeExportAll = (format: 'json' | 'csv' | 'xlsx') => {
    if (!user) {
      openAuth();
      return;
    }

    const mockProfile = {
      username: 'harvester_target',
      displayName: 'System Scan Node',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      bannerUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600',
      bio: 'Verified source content',
      followers: '150K',
      following: '420',
      isVerified: true,
      postsCount: 140
    };

    const mockContents = [
      {
        id: `all_downloader_ext_${platform}`,
        type: 'post' as any,
        caption: capturedCaption,
        url: capturedMediaSource,
        thumbnailUrl: capturedMediaSource,
        audioName: capturedAudioName,
        createdAt: new Date().toLocaleDateString(),
        commentCount: 412,
        likeCount: 54910,
        viewCount: 120904,
        shareCount: 890
      }
    ];

    const filename = `${platform}-all-downloader-export`;

    if (format === 'json') {
      handleExportJSON(filename, platform, mockProfile, mockContents);
    } else if (format === 'csv') {
      handleExportCSV(filename, platform, mockProfile, mockContents);
    } else {
      handleExportXLSX(filename, platform, mockProfile, mockContents);
    }

    onAddExportLog(`${filename}.${format}`, platform === 'threads' ? 'All Downloader metadata package' : `All Downloader metadata package from URL: ${allUrl}`);
  };

  return (
    <div id="platform-tools-panel" className="p-6 md:p-8 space-y-8 select-none max-w-5xl mx-auto">
      
      {selectedToolType === null ? (
        <>
          {/* Platform Title Briefing */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-900/40 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-900">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">Socialintel Active Core</span>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full bg-orange-500`} />
                {platform.toUpperCase()} Suite Tools
              </h2>
              <p className="text-xs text-zinc-500">Pick any fine-tuned standalone downloader, run an All-in-1 captures check, or execute Account Explorer.</p>
            </div>

            {/* Action Link directly pointing to Account Explorer! */}
            <button
              id="direct-to-explorer-btn"
              onClick={() => {
                const presetMapping: Record<PlatformType, string> = {
                  instagram: 'travel_explorers',
                  twitter: 'tech_guru',
                  youtube: 'science_simplified',
                  snapchat: 'daily_vibe',
                  threads: 'coder_threads',
                  tiktok: 'dance_beats'
                };
                setExplorerActiveUsername(presetMapping[platform] || 'travel_explorers');
                setExplorerActiveTab();
              }}
              className="py-2 px-4.5 bg-zinc-900 text-white text-xs font-bold rounded-xl transition shadow hover:bg-zinc-800 dark:bg-[#2563EB] dark:border dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-600 animate-spin" style={{ animationDuration: '6s' }} />
              Launch Account Explorer
            </button>
          </div>

          {/* GRID OF TOOL DIRECTORY */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Available Tools</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tools.map((t) => {
                const ToolIcon = t.icon;
                return (
                  <button
                    id={`tool-card-btn-${t.id}`}
                    key={t.id}
                    onClick={() => {
                      if (t.id === 'explorer') {
                        const presetMapping: Record<PlatformType, string> = {
                          instagram: 'travel_explorers',
                          twitter: 'tech_guru',
                          youtube: 'science_simplified',
                          snapchat: 'daily_vibe',
                          threads: 'coder_threads',
                          tiktok: 'dance_beats'
                        };
                        setExplorerActiveUsername(presetMapping[platform] || 'travel_explorers');
                        setExplorerActiveTab();
                      } else {
                        setSelectedToolType(t.id);
                        setHasCompiledAll(false);
                      }
                    }}
                    className="group relative flex flex-col items-start p-6 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/20 rounded-2xl transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/[0.02] cursor-pointer text-left h-full"
                  >
                    <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors duration-200 shrink-0 mb-4">
                      <ToolIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="space-y-1.5 flex-1 select-none pb-6">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-500 transition-colors block">{t.name}</span>
                      <span className="text-xs text-zinc-500 leading-normal block">{t.desc}</span>
                    </div>

                    <div className="absolute bottom-5 right-5 text-zinc-300 group-hover:text-orange-500 transition-colors">
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* BACK BUTTON AND WORKSTATION LAYOUT */}
          <div className="flex flex-col gap-6">
            <button
              id="back-to-directory-btn"
              onClick={() => {
                setSelectedToolType(null);
                setHasCompiledAll(false);
              }}
              className="self-start py-2 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {platform.toUpperCase()} Suite Tools</span>
            </button>

            <div className="max-w-3xl mx-auto w-full bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6">
              
              {/* ALL DOWNLOADER WORKFLOW PANEL */}
              {selectedToolType === 'all' ? (
                <div className="space-y-6" id="all-downloader-panel">
                  <div className="space-y-1 border-b border-zinc-200 dark:border-zinc-900 pb-3">
                    <span className="text-[10px] uppercase font-bold text-orange-500 font-mono">All-in-1 Universal capturing</span>
                    <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-150">Capturing Single Post URL</h3>
                    <p className="text-[11px] text-zinc-550">Provide any public URL post, story, reel or snap to compile and export everything available on that link node.</p>
                  </div>

                  {/* URL Submission form */}
                  <form onSubmit={handleCompileAllDownloader} className="space-y-3">
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                        <input
                          id={platform === 'instagram' ? "all-downloader-url-input" : `all-downloader-url-input-${platform}`}
                          type="url"
                          autoComplete="off"
                          placeholder="https://instagram.com/p/Co_xyz123/ ..."
                          value={allUrl}
                          onChange={(e) => {
                            setAllUrl(e.target.value);
                            forceResetAllUrlStates();
                          }}
                          required
                          className={platform === 'instagram'
                            ? "w-full pl-10 pr-10 py-2.5 bg-zinc-50 dark:bg-[#111827] border border-zinc-250 dark:border-[#374151] hover:border-zinc-350 dark:hover:border-zinc-700 focus:border-[#3B82F6] rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-455 dark:placeholder-[#9CA3AF] outline-none transition focus:ring-2 focus:ring-[#3B82F6]"
                            : "w-full pl-10 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 focus:border-orange-500 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-455 dark:placeholder-zinc-500 outline-none transition"
                          }
                        />
                        {allUrl && (
                          <button
                            id="clear-url-inner-btn"
                            type="button"
                            onClick={() => {
                              setAllUrl('');
                              setHasCompiledAll(false);
                              setIsUrlCompiling(false);
                              forceResetAllUrlStates();
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition cursor-pointer"
                            title="Clear URL"
                          >
                            <span className="text-[14px] font-extrabold select-none">×</span>
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          id="all-downloader-submit-btn"
                          type="submit"
                          disabled={isUrlCompiling}
                          className={`px-5 py-2.5 whitespace-nowrap text-xs font-bold text-white rounded-xl transition ${colors?.primary} dark:bg-[#2563EB] dark:border dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none cursor-pointer flex-1 sm:flex-none`}
                        >
                          {isUrlCompiling ? 'Syncing...' : 'Compile Link'}
                        </button>

                        {hasCompiledAll && (
                          <button
                            id="all-downloader-reset-btn"
                            type="button"
                            onClick={() => {
                              setAllUrl('');
                              setHasCompiledAll(false);
                              setIsUrlCompiling(false);
                              forceResetAllUrlStates();
                            }}
                            className="px-4 py-2.5 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-750 dark:text-zinc-350 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Reset</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </form>

                  {isUrlCompiling && (
                    <div className="py-12 text-center space-y-3">
                      <span className="relative flex h-8 w-8 mx-auto">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-8 w-8 bg-orange-500"></span>
                      </span>
                      <p className="text-xs text-zinc-500 font-medium">Extracting platform media, caption and profile layers...</p>
                    </div>
                  )}

                  {/* COMPILED ALL-IN-1 SUCCESS OUTPUT VIEW */}
                  {hasCompiledAll && !isUrlCompiling && (
                    <div id="all-downloader-compiled-result" className="space-y-6">
                      
                      {/* PREVIEW SECTION FIRST */}
                      <MediaPreview 
                        platform={platform} 
                        toolId="all" 
                        mockData={mockData} 
                      />

                      {/* DOWNLOAD BUTTONS SECOND */}
                      <div className="space-y-3 border-t border-zinc-200 dark:border-zinc-900 pt-4">
                        <span className="text-[10px] font-bold text-zinc-455 uppercase tracking-wider font-mono block">Download Options</span>
                        
                        <div className="grid grid-cols-2 gap-2.5">
                          {platform === 'threads' ? (
                            <>
                              <button
                                id="dl-all-post-btn"
                                onClick={() => executeCaptureAllField('post', 'Static post image', '2.1 MB')}
                                className="py-2 px-3 border border-zinc-200 text-xs font-semibold text-zinc-800 rounded-xl transition flex items-center gap-2 hover:bg-zinc-50 dark:bg-[#2563EB] dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                              >
                                <ImageIcon className="w-4 h-4 text-orange-500 shrink-0" />
                                <span>Download Post</span>
                              </button>

                              <button
                                id="dl-all-video-btn"
                                onClick={() => executeCaptureAllField('media', 'Threads HD Media stream', '12.4 MB')}
                                className="py-2 px-3 border border-zinc-200 text-xs font-semibold text-zinc-800 rounded-xl transition flex items-center gap-2 hover:bg-zinc-50 dark:bg-[#2563EB] dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                              >
                                <Tv className="w-4 h-4 text-zinc-450 shrink-0" />
                                <span>Download Media</span>
                              </button>

                              <button
                                id="dl-all-caption-btn"
                                onClick={() => executeCaptureAllField('caption', 'Formatted captions metadata', '4 KB')}
                                className="py-2 px-3 border border-zinc-200 text-xs font-semibold text-zinc-800 rounded-xl transition flex items-center gap-2 hover:bg-zinc-50 dark:bg-[#2563EB] dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                              >
                                <FileText className="w-4 h-4 text-zinc-455 shrink-0" />
                                <span>Download Caption</span>
                              </button>

                              <button
                                id="dl-all-dp-btn"
                                onClick={() => executeCaptureAllField('profile_pic', 'Author avatar graphic', '450 KB')}
                                className="py-2 px-3 border border-zinc-200 text-xs font-semibold text-zinc-800 rounded-xl transition flex items-center gap-2 col-span-1 hover:bg-zinc-50 dark:bg-[#2563EB] dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                              >
                                <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
                                <span>Download Profile Image</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                id="dl-all-video-btn"
                                onClick={() => executeCaptureAllField('video', 'Reels video stream', '12.4 MB')}
                                className="py-2 px-3 border border-zinc-200 text-xs font-semibold text-zinc-800 rounded-xl transition flex items-center gap-2 hover:bg-zinc-50 dark:bg-[#2563EB] dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                              >
                                <Tv className="w-4 h-4 text-zinc-450 shrink-0" />
                                <span>Download Video</span>
                              </button>

                              <button
                                id="dl-all-audio-btn"
                                onClick={() => executeCaptureAllField('audio', 'Original extracted MP3 track', '3.5 MB')}
                                className="py-2 px-3 border border-zinc-200 text-xs font-semibold text-zinc-800 rounded-xl transition flex items-center gap-2 hover:bg-zinc-50 dark:bg-[#2563EB] dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                              >
                                <Music className="w-4 h-4 text-zinc-455 shrink-0" />
                                <span>Download Audio</span>
                              </button>

                              <button
                                id="dl-all-caption-btn"
                                onClick={() => executeCaptureAllField('caption', 'Formatted captions metadata', '4 KB')}
                                className="py-2 px-3 border border-zinc-200 text-xs font-semibold text-zinc-800 rounded-xl transition flex items-center gap-2 hover:bg-zinc-50 dark:bg-[#2563EB] dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                              >
                                <FileText className="w-4 h-4 text-zinc-450 shrink-0" />
                                <span>Download Caption</span>
                              </button>

                              <button
                                id="dl-all-cover-btn"
                                onClick={() => executeCaptureAllField('thumbnail', 'Ultra HD cover photography', '1.4 MB')}
                                className="py-2 px-3 border border-zinc-200 text-xs font-semibold text-zinc-800 rounded-xl transition flex items-center gap-2 hover:bg-zinc-50 dark:bg-[#2563EB] dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                              >
                                <ImageIcon className="w-4 h-4 text-zinc-450 shrink-0" />
                                <span>Download Cover</span>
                              </button>

                              <button
                                id="dl-all-dp-btn"
                                onClick={() => executeCaptureAllField('profile_pic', 'Author avatar graphic', '450 KB')}
                                className="py-2 px-3 border border-zinc-200 text-xs font-semibold text-zinc-800 rounded-xl transition flex items-center gap-2 col-span-2 hover:bg-zinc-50 dark:bg-[#2563EB] dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                              >
                                <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
                                <span>Download Profile Image</span>
                              </button>

                              {platform === 'tiktok' && mockData.hasPostContent && (
                                <button
                                  id="dl-all-post-btn"
                                  onClick={() => executeCaptureAllField('post', 'Static post image', '2.1 MB')}
                                  className="py-2 px-3 border border-zinc-200 text-xs font-semibold text-zinc-800 rounded-xl transition flex items-center gap-2 col-span-2 hover:bg-zinc-50 dark:bg-[#2563EB] dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                                >
                                  <ImageIcon className="w-4 h-4 text-orange-500 shrink-0 animate-pulse" />
                                  <span>Download Post</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-zinc-250 dark:border-zinc-900 pt-4">
                        <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono block">Export Post Metadata (XLSX, CSV, JSON)</span>
                        
                        <div className="grid grid-cols-3 gap-2.5">
                          <button
                            id="all-export-json-btn"
                            onClick={() => executeExportAll('json')}
                            className="py-2 px-3 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 dark:bg-[#2563EB] dark:border dark:border-[#3B82F6] dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none cursor-pointer"
                          >
                            <FileJson className="w-4 h-4 text-orange-400" />
                            <span>JSON</span>
                          </button>

                          <button
                            id="all-export-csv-btn"
                            onClick={() => executeExportAll('csv')}
                            className="py-2 px-3 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 dark:bg-[#2563EB] dark:border dark:border-[#3B82F6] dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none cursor-pointer"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                            <span>CSV</span>
                          </button>

                          <button
                            id="all-export-xlsx-btn"
                            onClick={() => executeExportAll('xlsx')}
                            className="py-2 px-3 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 dark:bg-[#2563EB] dark:border dark:border-[#3B82F6] dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none cursor-pointer"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                            <span>Excel / XLSX</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                
                // STANDALONE FIELD SPECIFIC DOWNLOADERS PANEL
                <div className="space-y-6" id="standalone-downs-panel">
                  <div className="space-y-1 border-b border-zinc-200 dark:border-zinc-900 pb-3">
                    <span className="text-[10px] uppercase font-bold text-orange-500 font-mono">Standalone Downloader</span>
                    <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-150 capitalize">{selectedToolType?.replace('_', ' ')} Tool</h3>
                    <p className="text-[11px] text-zinc-550">Fine-tuned capture algorithm extracting only the selected asset types from your source links.</p>
                  </div>

                  {/* URL Submission and Analysis Option */}
                  <form onSubmit={handleSingleAnalyze} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Input Singular Media URL</label>
                      <div className="flex gap-2 flex-col sm:flex-row">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                          <input
                            id={platform === 'instagram' ? "standalone-url-input" : `standalone-url-input-${platform}`}
                            type="url"
                            autoComplete="off"
                            placeholder={`Enter public ${platform} post link...`}
                            value={singleUrl}
                            onChange={(e) => {
                              setSingleUrl(e.target.value);
                              forceResetAllUrlStates();
                            }}
                            required
                            className={platform === 'instagram'
                              ? "w-full pl-10 pr-10 py-2.5 bg-zinc-50 dark:bg-[#111827] border border-zinc-200 dark:border-[#374151] hover:border-zinc-300 dark:hover:border-zinc-700 outline-none focus:border-[#3B82F6] rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-450 dark:placeholder-[#9CA3AF] transition focus:ring-2 focus:ring-[#3B82F6]"
                              : "w-full pl-10 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700 outline-none focus:border-orange-500 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-455 dark:placeholder-zinc-500 outline-none transition"
                            }
                          />
                          {singleUrl && (
                            <button
                              id="clear-standalone-url-inner-btn"
                              type="button"
                              onClick={() => {
                                setSingleUrl('');
                                setHasCompiledSingle(false);
                                setIsSingleAnalyzing(false);
                                forceResetAllUrlStates();
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition cursor-pointer"
                              title="Clear URL"
                            >
                              <span className="text-[14px] font-extrabold select-none">×</span>
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            id="standalone-submit-btn"
                            type="submit"
                            disabled={isSingleAnalyzing}
                            className={`px-5 py-2.5 whitespace-nowrap text-xs font-bold text-white rounded-xl transition ${colors?.primary} dark:bg-[#2563EB] dark:border dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none cursor-pointer flex-1 sm:flex-none`}
                          >
                            {isSingleAnalyzing ? 'Analyzing...' : 'Analyze Post URL'}
                          </button>

                          {hasCompiledSingle && (
                            <button
                              id="standalone-reset-btn"
                              type="button"
                              onClick={() => {
                                setSingleUrl('');
                                setHasCompiledSingle(false);
                                setIsSingleAnalyzing(false);
                                forceResetAllUrlStates();
                              }}
                              className="px-4 py-2.5 border border-zinc-250 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-750 dark:text-zinc-350 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>Reset</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>

                  {isSingleAnalyzing && (
                    <div className="py-12 text-center space-y-3">
                      <span className="relative flex h-8 w-8 mx-auto">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-8 w-8 bg-orange-500"></span>
                      </span>
                      <p className="text-xs text-zinc-500 font-medium">Resolving safe route nodes and extracting headers...</p>
                    </div>
                  )}

                  {/* PREVIEW AND SELECTION FLOW */}
                  {hasCompiledSingle && !isSingleAnalyzing && (
                    <div className="space-y-6" id="standalone-preview-result">
                      
                      {/* PREVIEW SECTION FIRST */}
                      <MediaPreview 
                        platform={platform} 
                        toolId={selectedToolType || ''} 
                        mockData={mockData} 
                      />

                      {/* DOWNLOAD OPTIONS AND ACTIONS BELOW */}
                      <div className="space-y-3.5 border-t border-zinc-200 dark:border-zinc-900 pt-5">
                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono block">Download Options</span>
                        
                        <div className="flex flex-col gap-2.5">
                          <button
                            id="execute-standalone-save-btn"
                            onClick={handleSingleDownload}
                            className={`w-full py-3 text-white font-extrabold text-xs rounded-xl transition ${colors?.primary} dark:bg-[#2563EB] dark:border dark:border-[#3B82F6] dark:text-white dark:hover:bg-[#1D4ED8] dark:active:bg-[#1E40AF] dark:focus:bg-[#1E40AF] focus:ring-2 focus:ring-[#3B82F6] focus:outline-none flex items-center justify-center gap-2 cursor-pointer shadow`}
                          >
                            <Download className="w-4 h-4 animate-bounce" />
                            <span>
                              {(() => {
                                if (selectedToolType === 'post') return 'Download Post';
                                if (selectedToolType === 'carousel') return 'Download Carousel';
                                if (selectedToolType === 'video' || selectedToolType === 'reels' || selectedToolType === 'shorts' || selectedToolType === 'media') return 'Download Video';
                                if (selectedToolType === 'audio') return 'Download Audio';
                                if (selectedToolType === 'dp' || selectedToolType === 'profile' || selectedToolType === 'avatar') return 'Download Profile';
                                if (selectedToolType === 'cover' || selectedToolType === 'thumbnail') return 'Download Cover';
                                return `Download Decrypted ${selectedToolType?.toUpperCase()} Asset`;
                              })()}
                            </span>
                          </button>

                          {/* Extra helpers like Copy description for Caption tools */}
                          {(selectedToolType === 'caption' || selectedToolType === 'caption_copy') && (
                            <button
                              id="copy-preset-caption-btn-v2"
                              onClick={triggerCopyCaption}
                              className="py-2.5 px-4.5 border border-zinc-200 text-zinc-750 dark:border-[#334155]/60 hover:bg-zinc-50 dark:bg-slate-900 dark:text-zinc-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                              {copiedCaptionSuccess ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-orange-500" />}
                              <span>{copiedCaptionSuccess ? 'Caption Copied!' : 'Copy Caption Characters to Clipboard'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        </>
      )}

    </div>
  );
}
