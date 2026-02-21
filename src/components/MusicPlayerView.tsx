import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { usePatchSessionStatus } from '@/hooks/useSessions';
import { useYouTubeVideo } from '@/hooks/useYouTube';
import { motion } from 'framer-motion';
import { ChevronDown, Pause, Play, Square, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { SessionInfo } from '@/types/classes';

interface MusicPlayerViewProps {
  classId: string;
  session: SessionInfo;
  onClose: () => void;
}

export default function MusicPlayerView({
  classId,
  session,
  onClose,
}: MusicPlayerViewProps) {
  const { data: videoInfo } = useYouTubeVideo(session.videoId);
  const { mutate: patchStatus } = usePatchSessionStatus();

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // 최신 상태를 이벤트 핸들러에서 참조하기 위한 Ref
  const statusRef = useRef(session.status);

  useEffect(() => {
    statusRef.current = session.status;
  }, [session.status]);

  // URL of the MP3 file
  const sampleURL =
    'https://github.com/young-52/audio-test/raw/refs/heads/main/no-pain.mp3';

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio(sampleURL);
    audioRef.current = audio;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsReady(true);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      // 음원 재생 완료 시 다시 처음부터 재생하고 상태 전송
      audio.currentTime = 0;
      audio.play().catch((err) => console.error('Audio replay failed:', err));
      // Ref를 사용하여 최신 상태를 참조
      handleUpdateStatus(statusRef.current === 'ACTIVE' ? 'ACTIVE' : 'PAUSED');
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, []);

  // Sync prop status to actual audio playback
  useEffect(() => {
    if (!audioRef.current || !isReady) return;

    if (session.status === 'ACTIVE') {
      audioRef.current
        .play()
        .then(() => {
          // 음원 로드가 완료된 후 재생이 시작될 때 상태 전송
          handleUpdateStatus('ACTIVE');
        })
        .catch((err) => console.error('Audio play failed:', err));
    } else {
      audioRef.current.pause();
    }
  }, [session.status, isReady]);

  // Handle status update
  const handleUpdateStatus = (status: 'ACTIVE' | 'PAUSED' | 'CLOSED') => {
    patchStatus({
      classId,
      sessionId: session.sessionId,
      data: {
        status,
        currentTime: audioRef.current?.currentTime || 0,
        updatedAt: Date.now(),
      },
    });
  };

  // Handle Slider Change (Dragging)
  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      setCurrentTime(value[0]);
    }
  };

  // Handle Slider Commit (Released)
  const handleSliderCommit = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      handleUpdateStatus(session.status === 'ACTIVE' ? 'ACTIVE' : 'PAUSED');
    }
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
          value={[currentTime]}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          max={duration || 100}
          step={0.1}
          className="py-2 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-black text-muted-foreground/50 tracking-widest uppercase">
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(duration - currentTime)}</span>
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
