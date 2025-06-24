"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioMessageProps {
  audioUrl: string;
  className?: string;
  variant?: "default" | "user" | "ai";
}

export function AudioMessage({ audioUrl, className = "", variant = "default" }: AudioMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = () => {
    const audio = audioRef.current;
    if (!audio) return;

    let newSpeed;
    if (playbackSpeed === 1) {
      newSpeed = 1.5;
    } else if (playbackSpeed === 1.5) {
      newSpeed = 2;
    } else {
      newSpeed = 1;
    }

    setPlaybackSpeed(newSpeed);
    audio.playbackRate = newSpeed;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const newTime = clickRatio * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Função para gerar uma waveform consistente baseada na URL
  const generateWaveform = () => {
    const bars = [];
    const barCount = 40;
    
    // Usar a URL como seed para ter uma waveform consistente
    const seed = audioUrl.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = 0; i < barCount; i++) {
      // Gerar altura pseudo-aleatória baseada no seed e índice
      const pseudoRandom = Math.sin(seed + i * 1.5) * 0.5 + 0.5;
      const height = pseudoRandom * 16 + 4; // Altura entre 4px e 20px
      
      const progress = duration > 0 ? currentTime / duration : 0;
      const isActive = i / barCount <= progress;
      
      const activeColor = variant === "user" || variant === "ai" ? "bg-white" : "bg-primary";
      const inactiveColor = variant === "user" || variant === "ai" ? "bg-white/30" : "bg-gray-300";
      
      bars.push(
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${
            isActive 
              ? activeColor
              : inactiveColor
          } ${isActive && isPlaying ? "animate-pulse" : ""}`}
          style={{ height: `${height}px` }}
        />
      );
    }
    
    return bars;
  };

  const getContainerStyles = () => {
    if (variant === "user" || variant === "ai") {
      return "bg-transparent border-none";
    }
    return "bg-white-soft border border-white-warm";
  };

  const getButtonStyles = () => {
    if (variant === "user" || variant === "ai") {
      return "bg-white/20 hover:bg-white/30 text-white border-white/30";
    }
    return "bg-primary hover:bg-primary/90 text-white";
  };

  const getTextColor = () => {
    if (variant === "user" || variant === "ai") {
      return "text-white/70";
    }
    return "text-muted-foreground";
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg min-w-[280px] ${getContainerStyles()} ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />
      
      {/* Botão Play/Pause */}
      <Button
        onClick={togglePlayPause}
        disabled={isLoading}
        size="icon"
        variant="ghost"
        className={`flex-shrink-0 h-10 w-10 rounded-full ${getButtonStyles()}`}
      >
        {isLoading ? (
          <div className={`w-4 h-4 border-2 ${variant === "user" || variant === "ai" ? "border-white border-t-transparent" : "border-primary border-t-transparent"} rounded-full animate-spin`} />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </Button>

      <div className="flex-1 space-y-2">
        {/* Waveform visual */}
        <div 
          className="flex items-center justify-between gap-0.5 h-6 cursor-pointer"
          onClick={handleProgressClick}
        >
          {generateWaveform()}
        </div>

        {/* Tempo e velocidade */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-mono ${getTextColor()}`}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          
          <Button
            onClick={handleSpeedChange}
            variant="ghost"
            size="sm"
            className={`h-6 px-2 text-xs font-medium ${getTextColor()} hover:opacity-80`}
          >
            {playbackSpeed}x
          </Button>
        </div>
      </div>

      {/* Ícone de áudio */}
      <Volume2 className={`h-4 w-4 flex-shrink-0 ${getTextColor()}`} />
    </div>
  );
} 