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
import { useCreateSession } from '@/hooks/useSessions';
import { formatDate } from '@/utils/date';
import { Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

export default function Class() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const { data: classData } = useClass(classId || '');
  const { mutateAsync: createSession } = useCreateSession();

  const title = classData?.class.title || '';
  const sessions = classData?.sessions || [];

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

      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-10 left-1/2 -translate-x-1/2 h-12 w-40 rounded-full shadow-xl cursor-pointer"
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
              const sessionTitle = formData.get('session-title') as string;
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
    </div>
  );
}
