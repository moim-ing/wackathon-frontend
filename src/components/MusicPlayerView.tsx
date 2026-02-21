import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useYouTubeVideo } from '@/hooks/useYouTube';
import { motion } from 'framer-motion';
import { ChevronDown, Pause, Play, Square, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { SessionInfo } from '@/types/classes';

interface MusicPlayerViewProps {
  session: SessionInfo;
  onClose: () => void;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
  handleUpdateStatus: (status: 'ACTIVE' | 'PAUSED' | 'CLOSED') => void;
}

export default function MusicPlayerView({
  session,
  onClose,
  currentTime,
  duration,
  seek,
  handleUpdateStatus,
}: MusicPlayerViewProps) {
  const { data: videoInfo } = useYouTubeVideo(session.videoId);
  const [displayTime, setDisplayTime] = useState(currentTime);

  // 별도의 이펙트로 currentTime이 소수점 단위로 바뀔 때 displayTime을 동기화
  useEffect(() => {
    setDisplayTime(currentTime);
  }, [currentTime]);

  // Handle Slider Change (Dragging)
  const handleSliderChange = (value: number[]) => {
    setDisplayTime(value[0]);
  };

  // Handle Slider Commit (Released)
  const handleSliderCommit = (value: number[]) => {
    seek(value[0]);
    handleUpdateStatus(session.status === 'ACTIVE' ? 'ACTIVE' : 'PAUSED');
  };

  // Time Formatter (seconds -> mm:ss)
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center px-8 pt-4 pb-12 overflow-hidden"
    >
      {/* Background Glow */}
      <div
        className="absolute inset-0 z-0 opacity-20 blur-[100px] saturate-150 scale-150"
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${session.videoId}/maxresdefault.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Header */}
      <header className="relative z-10 w-full flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-black/5 cursor-pointer"
        >
          <ChevronDown className="size-6 text-muted-foreground" />
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-0.5">
            NOW PLAYING
          </span>
          <span className="text-sm font-bold text-primary">
            {session.sessionTitle}
          </span>
        </div>
        <div className="size-10" /> {/* Spacer */}
      </header>

      {/* Album Art Container */}
      <div className="relative z-10 w-full max-w-[340px] aspect-square mb-12 flex items-center justify-center">
        <motion.img
          layoutId="album-art"
          src={`https://img.youtube.com/vi/${session.videoId}/maxresdefault.jpg`}
          alt="Album Art"
          className="w-full h-full object-cover rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]"
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        />
      </div>

      {/* Metadata & Attendance */}
      <div className="relative z-10 w-full mb-8 pt-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h1 className="text-3xl font-black tracking-tighter leading-[1.1] truncate">
              {videoInfo?.title || '로딩 중...'}
            </h1>
            <p className="text-xl font-medium text-muted-foreground truncate">
              {videoInfo?.authorName || '아티스트 정보 없음'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-2xl border border-primary/20 shrink-0 mt-1">
            <Users className="size-4 text-primary" />
            <span className="text-sm font-black text-primary">
              {session.totalParticipants || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative z-10 w-full mb-10 space-y-3">
        <Slider
          value={[displayTime]}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          max={duration || 100}
          step={0.1}
          className="py-2 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-black text-muted-foreground/50 tracking-widest uppercase">
          <span>{formatTime(displayTime)}</span>
          <span>-{formatTime(duration - displayTime)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 w-full flex items-center justify-center gap-10">
        <Button
          variant="destructive"
          size="icon"
          className="size-16 rounded-full bg-red-50 hover:bg-red-100 text-red-500 cursor-pointer transition-transform active:scale-90"
          onClick={() => handleUpdateStatus('CLOSED')}
        >
          <Square className="size-6 fill-red-500" />
        </Button>
        <Button
          size="icon"
          className="size-24 rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_15px_30px_-5px_rgba(var(--primary-rgb),0.3)] cursor-pointer transition-transform active:scale-95"
          onClick={() =>
            handleUpdateStatus(
              session.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
            )
          }
        >
          {session.status === 'ACTIVE' ? (
            <Pause className="size-10 fill-current" />
          ) : (
            <Play className="size-10 fill-current ml-1" />
          )}
        </Button>
        <div className="size-16" /> {/* Placeholder for symmetrical layout */}
      </div>
    </motion.div>
  );
}
