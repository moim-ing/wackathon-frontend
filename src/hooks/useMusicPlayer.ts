import { useGetFile } from '@/hooks/useFile';
import { usePatchSessionStatus } from '@/hooks/useSessions';
import type { SessionInfo } from '@/types/classes';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useMusicPlayer(classId: string, session: SessionInfo | null) {
  const { mutate: patchStatus } = usePatchSessionStatus();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // 최신 상태를 이벤트 핸들러에서 참조하기 위한 Ref
  const statusRef = useRef(session?.status);
  const sessionRef = useRef(session);

  useEffect(() => {
    if (session) {
      statusRef.current = session.status;
      sessionRef.current = session;
    }
  }, [session]);

  // Handle status update - memoized but internal logic uses refs for stability
  const handleUpdateStatus = useCallback(
    (status: 'ACTIVE' | 'PAUSED' | 'CLOSED') => {
      const currentSession = sessionRef.current;
      if (!currentSession) return;
      patchStatus({
        classId,
        sessionId: currentSession.sessionId,
        data: {
          status,
          currentTime: audioRef.current?.currentTime || 0,
          updatedAt: Date.now(),
        },
      });
    },
    [classId, patchStatus]
  );

  const handleUpdateStatusRef = useRef(handleUpdateStatus);
  useEffect(() => {
    handleUpdateStatusRef.current = handleUpdateStatus;
  }, [handleUpdateStatus]);

  const { data: fileData } = useGetFile(session?.sessionId || '');
  const audioUrl = session?.audioUrl || fileData?.url;

  // Initialize Audio
  // biome-ignore lint/correctness/useExhaustiveDependencies: session is not a dependency
  useEffect(() => {
    if (!audioUrl) {
      setIsReady(false);
      setCurrentTime(0);
      return;
    }

    // 새로운 오디오 URL이 들어오면 모든 상태 초기화
    setIsReady(false);
    setCurrentTime(0);
    const audio = new Audio(audioUrl);
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsReady(true);
    };

    if (audio.readyState >= 1) {
      onLoadedMetadata();
    }

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onEnded = () => {
      audio.currentTime = 0;
      audio.play().catch((err) => console.error('Audio replay failed:', err));
      handleUpdateStatusRef.current(
        statusRef.current === 'ACTIVE' ? 'ACTIVE' : 'PAUSED'
      );
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
  }, [audioUrl, session?.sessionId]); // session?.sessionId 추가

  // Sync prop status to actual audio playback
  // biome-ignore lint/correctness/useExhaustiveDependencies: session is not a dependency
  useEffect(() => {
    if (!audioRef.current || !isReady || !session) return;

    if (session.status === 'ACTIVE') {
      audioRef.current
        .play()
        .then(() => {
          console.info('Playback started successfully');
        })
        .catch((err) => console.error('Audio play failed:', err));
    } else {
      audioRef.current.pause();
    }
  }, [session?.sessionId, session?.status, isReady]);

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return {
    currentTime,
    duration,
    isReady,
    seek,
    handleUpdateStatus,
  };
}
