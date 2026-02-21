import MusicCard from '@/components/MusicCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useClass } from '@/hooks/useClasses';
import { useCreateSession, usePatchSessionStatus } from '@/hooks/useSessions';
import { useYouTubeVideo } from '@/hooks/useYouTube';
import { formatDate } from '@/utils/date';
import { extractYouTubeVideoId } from '@/utils/youtube';
import { Loader2, Pause, Play, Square } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

export default function Class() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useClass(classId ?? '');
  const { mutate: createSession } = useCreateSession();
  const { mutate: patchStatus } = usePatchSessionStatus();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const { class: classInfo, sessions, currentSession } = data;

  const handleStartSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sessionTitle = formData.get('session-title') as string;
    const videoUrl = formData.get('video-url') as string;
    const videoId = extractYouTubeVideoId(videoUrl);

    if (!videoId) {
      alert('유효한 YouTube URL을 입력해주세요.');
      return;
    }

    if (classId) {
      createSession(
        {
          classId,
          data: { sessionTitle, videoId },
        },
        {
          onSuccess: () => {
            // Refresh is usually handled by mutation onSuccess in hook, but let's double check
            // In useCreateSession hook, it's not handled. I should handle it.
          },
        }
      );
    }
  };

  const handleUpdateStatus = (status: 'ACTIVE' | 'PAUSED' | 'CLOSED') => {
    console.info('handleUpdateStatus: ', status);
    if (classId && currentSession) {
      patchStatus({
        classId,
        sessionId: currentSession.sessionId,
        data: {
          status,
          currentTime: 0, // Placeholder
          updatedAt: Date.now(),
        },
      });
    }
  };

  function PlayerInfo({ videoId }: { videoId: string }) {
    const { data: videoInfo, isLoading } = useYouTubeVideo(videoId);

    return (
      <span className="body-strong truncate">
        {isLoading ? 'Loading...' : (videoInfo?.title ?? '알 수 없는 곡')}
      </span>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-32">
      <h1 className="text-3xl font-bold">{classInfo.title}</h1>
      <div className="flex flex-col w-full gap-1">
        {sessions.map((session) => (
          <div key={session.sessionId}>
            <MusicCard
              sessionId={session.sessionId}
              title={session.sessionTitle}
              videoId={session.videoId}
              date={session.createdAt ?? ''}
              participants={session.totalParticipants ?? 0}
              onClick={() =>
                navigate(`/class/${classId}/${session.sessionId}`, {
                  viewTransition: true,
                })
              }
            />
            {sessions.indexOf(session) < sessions.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      {currentSession ? (
        /* Floating Player Bar */
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/95 backdrop-blur-md border border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl p-3 flex items-center justify-between gap-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div
            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() =>
              navigate(`/class/${classId}/${currentSession.sessionId}`, {
                viewTransition: true,
              })
            }
          >
            <img
              src={`https://img.youtube.com/vi/${currentSession.videoId}/maxresdefault.jpg`}
              alt="Current Album Art"
              className="size-12 rounded-xl object-cover shadow-md"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-primary uppercase">
                {currentSession.sessionTitle}
              </span>
              <PlayerInfo videoId={currentSession.videoId} />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentSession.status === 'ACTIVE' ? (
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full size-12 bg-primary/10 hover:bg-primary/20 text-primary border-none cursor-pointer"
                onClick={() => handleUpdateStatus('PAUSED')}
              >
                <Pause className="size-6 fill-primary" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full size-12 bg-red-50 hover:bg-red-100 text-red-600 border-none cursor-pointer shadow-sm"
                  onClick={() => handleUpdateStatus('CLOSED')}
                >
                  <Square className="size-5 fill-red-600" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full size-12 bg-primary/10 hover:bg-primary/20 text-primary border-none cursor-pointer"
                  onClick={() => handleUpdateStatus('ACTIVE')}
                >
                  <Play className="size-6 fill-primary" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Start Session Dialog */
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-10 left-1/2 -translate-x-1/2 h-14 w-44 rounded-full shadow-2xl shadow-primary/30 cursor-pointer bg-primary hover:scale-105 transition-transform"
            >
              <Play className="size-5 fill-white" />
              <span className="text-base font-bold">세션 시작하기</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm rounded-3xl">
            <form onSubmit={handleStartSession}>
              <DialogHeader>
                <DialogTitle>새 세션 시작</DialogTitle>
                <DialogDescription>
                  새로운 수업의 출석을 체크하고 음악을 공유합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <FieldGroup>
                  <Field>
                    <Label htmlFor="session-title">세션 이름</Label>
                    <Input
                      id="session-title"
                      name="session-title"
                      defaultValue={formatDate()}
                      required
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="video-url">YouTube URL</Label>
                    <Input id="video-url" name="video-url" required />
                  </Field>
                </FieldGroup>
              </div>
              <DialogFooter>
                <div className="flex gap-3 w-full">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl h-11"
                    >
                      취소
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="flex-1 rounded-2xl h-11">
                    시작
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
