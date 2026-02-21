import MusicCard from '@/components/MusicCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { useCreateSession } from '@/hooks/useSessions';
import { useYouTubeVideo } from '@/hooks/useYouTube';
import { formatDate } from '@/utils/date';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Pause, Play, Square } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function Class() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const { data: classData, isLoading, updateStatus } = useClass(classId || '');
  const { mutateAsync: createSession } = useCreateSession();
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const title = classData?.class.title || '';
  const sessions = classData?.sessions || [];
  const currentSession = classData?.currentSession ?? null;

  const handleUpdateStatus = (status: 'ACTIVE' | 'PAUSED' | 'CLOSED') => {
    console.info('handleUpdateStatus: ', status);
    updateStatus(status);
  };

  const PlayerInfo = ({ videoId }: { videoId: string }) => {
    const { data: videoInfo, isLoading } = useYouTubeVideo(videoId);

    return (
      <span className="body-strong truncate">
        {isLoading ? 'Loading...' : (videoInfo?.title ?? '알 수 없는 곡')}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-8 ">
        <Loader2 className="size-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 ">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex flex-col w-full gap-1">
        {sessions.map((session, index) => (
          <div key={session.sessionId}>
            <MusicCard
              key={session.sessionId}
              sessionId={session.sessionId}
              title={session.sessionTitle}
              videoId={session.videoId}
              date={session.createdAt || ''}
              participants={session.totalParticipants || 0}
              onClick={() =>
                navigate(`/class/${classId}/${session.sessionId}`, {
                  viewTransition: true,
                })
              }
            />
            {index < sessions.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {currentSession && currentSession.status !== 'CLOSED' ? (
          /* Floating Player Bar */
          <motion.div
            key="player-bar"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/95 backdrop-blur-md border border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl p-3 flex items-center justify-between gap-4 z-50 overflow-hidden"
          >
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

            <motion.div layout className="flex items-center gap-2 shrink-0">
              <AnimatePresence mode="popLayout">
                {currentSession.status === 'PAUSED' && (
                  <motion.div
                    key="stop-button"
                    initial={{ x: 20, opacity: 0, scale: 0.5 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 20, opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-full size-12 bg-red-50 hover:bg-red-100 text-red-600 border-none cursor-pointer shadow-sm"
                      onClick={() => setShowCloseDialog(true)}
                    >
                      <Square className="size-5 fill-red-600" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div layout>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full size-12 bg-primary/10 hover:bg-primary/20 text-primary border-none cursor-pointer overflow-hidden"
                  onClick={() =>
                    handleUpdateStatus(
                      currentSession.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
                    )
                  }
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentSession.status}
                      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {currentSession.status === 'ACTIVE' ? (
                        <Pause className="size-6 fill-primary" />
                      ) : (
                        <Play className="size-6 fill-primary" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div> /* Start Session Dialog */
        ) : (
          <motion.div
            key="start-fab"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className="h-12 w-40 rounded-full shadow-xl cursor-pointer"
                >
                  <Play className="size-5" />
                  <span className="text-base font-semibold">세션 시작하기</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const sessionTitle = formData.get(
                      'session-title'
                    ) as string;
                    const videoUrlOrId = formData.get('video-url') as string;

                    let videoId = videoUrlOrId;
                    try {
                      const url = new URL(videoUrlOrId);
                      videoId =
                        url.searchParams.get('v') ||
                        url.pathname.split('/').pop() ||
                        videoId;
                    } catch {
                      // Not a full URL, fallback to videoId naturally
                    }

                    if (classId && sessionTitle && videoId) {
                      await createSession({
                        classId,
                        data: { sessionTitle, videoId },
                      });
                    }
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>세션 시작하기</DialogTitle>
                    <DialogDescription>
                      지금부터 출석 체크를 시작합니다.
                      <br />
                      세션의 이름과 재생할 음악을 입력해 주세요.
                    </DialogDescription>
                  </DialogHeader>
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
                      <Label htmlFor="video-url">YouTube URL 또는 ID</Label>
                      <Input
                        id="video-url"
                        name="video-url"
                        placeholder="https://youtube.com/watch?v=..."
                        required
                      />
                    </Field>
                  </FieldGroup>
                  <DialogFooter>
                    <div className="flex gap-3 items-center justify-center">
                      <DialogClose asChild>
                        <Button variant="outline" className="w-[48%]">
                          취소
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="submit" className="w-[48%]">
                          시작
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>세션 종료</AlertDialogTitle>
            <AlertDialogDescription>
              세션을 종료하면 출석 체크가 끝나고 출석부가 확정돼요. 세션을
              종료할까요?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">취소</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-2xl bg-red-600 hover:bg-red-700"
              onClick={() => {
                handleUpdateStatus('CLOSED');
                setShowCloseDialog(false);
              }}
            >
              종료
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
