import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/utils/date';
import { ArrowLeft, Calendar, Music, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { useSession } from '@/hooks/useSessions';
import { getYouTubeInfo } from '@/utils/youtube';
import { useQuery } from '@tanstack/react-query';

export default function Session() {
  const { classId, sessionId } = useParams<{
    classId: string;
    sessionId: string;
  }>();
  const navigate = useNavigate();

  const {
    data: sessionData,
    isLoading,
    isError,
  } = useSession(classId || '', sessionId || '');

  const videoId = sessionData?.videoId;

  const { data: youtubeInfo } = useQuery({
    queryKey: ['youtube', videoId],
    queryFn: () => getYouTubeInfo(videoId!),
    enabled: !!videoId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        Loading...
      </div>
    );
  }

  // Session not found
  if (isError || !sessionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
        <div className="size-20 bg-secondary rounded-full flex items-center justify-center">
          <Music className="size-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">세션을 찾을 수 없습니다</h1>
          <p className="text-muted-foreground">
            요청하신 세션 정보가 존재하지 않거나 삭제되었습니다.
          </p>
        </div>
        <Button onClick={() => navigate(-1)} className="rounded-full px-8">
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const songTitle = youtubeInfo?.title || '로딩 중...';
  const songArtist = youtubeInfo?.authorName || '';
  const participants = sessionData.participants || [];

  return (
    <div className="flex flex-col w-full gap-8 pb-20 max-w-3xl mx-auto">
      {/* Header section */}
      <header className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-95 bg-white border border-border"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{sessionData.sessionTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-5 text-muted-foreground bg-muted/20 w-fit px-4 py-2 rounded-2xl border border-secondary/30">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            <span className="text-sm font-semibold">
              {formatDate(sessionData.createdAt || '')}
            </span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <span className="text-sm font-semibold">
              {participants.length}명 출석
            </span>
          </div>
        </div>
      </header>

      {/* Featured Music Card */}
      <section className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary opacity-[0.03] rounded-[2.5rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border-1 border-primary/10 shadow-xl shadow-primary/5 relative z-10">
          <div className="relative">
            <img
              src={`https://img.youtube.com/vi/${sessionData.videoId}/maxresdefault.jpg`}
              alt="Album Art"
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] object-cover shadow-2xl shadow-black/20"
              style={{ viewTransitionName: `album-art-${sessionId}` }}
            />
            <div className="absolute -bottom-2 -right-2 size-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
              <Music className="size-5" />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 text-center sm:text-left pt-2">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tighter leading-none pt-2">
                {songTitle}
              </h2>
              <h3 className="text-lg text-muted-foreground font-medium">
                {songArtist}
              </h3>
            </div>
          </div>
        </div>
      </section>

      <Separator className="opacity-50" />

      {/* Attendees' Section */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1>출석부</h1>
            <span className="text-primary font-black text-lg">·</span>
            <span className="text-muted-foreground font-medium">
              {participants.length}
            </span>
          </div>
        </div>

        {/* TODO: 이 그리드 형태가 최선인가? 그리드 줄 수 늘리기? 그리드가 아니라 다른 스타일 찾기? */}
        <div className="grid px-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {participants.map((participant, index) => (
            <div key={index} className="">
              <span className="single-line-body-base">{participant.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
