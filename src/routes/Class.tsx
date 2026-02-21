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
import { Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

const sampleHistory = [
  {
    sessionId: '1',
    sessionTitle: '1주차',
    videoId: 'hHHQ4bNhwjU',
    createdAt: '2026-02-02T20:00:00Z',
    totalParticipants: 8,
  },
  {
    sessionId: '2',
    sessionTitle: '2주차',
    videoId: '3BFTio5296w',
    createdAt: '2026-02-09T20:00:00Z',
    totalParticipants: 6,
  },
];

function getSampleTitle(classId: string | undefined) {
  if (classId == '1') return '리액트의 원리와 실습';
  if (classId == '2') return '고급 CSS';

  console.error('Invalid classId: ' + classId);
  return '?';
}

export default function Class() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const sampleTitle = getSampleTitle(classId);

  return (
    <div className="flex w-full flex-col gap-8 ">
      <h1 className="text-3xl font-bold">{sampleTitle}</h1>
      <div className="flex flex-col w-full gap-1">
        {sampleHistory.map((session) => (
          <>
            <MusicCard
              key={session.sessionId}
              title={session.sessionTitle}
              videoId={session.videoId}
              date={session.createdAt}
              participants={session.totalParticipants}
              onClick={() => navigate(`/class/${classId}/${session.sessionId}`)}
            />
            {sampleHistory.indexOf(session) < sampleHistory.length - 1 && (
              <Separator />
            )}
          </>
        ))}
      </div>

      <Dialog>
        <form>
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
                <Label htmlFor="name-1">세션 이름</Label>
                <Input
                  id="session-title"
                  name="session-title"
                  defaultValue={new Date().toLocaleDateString('ko-kr')}
                />
              </Field>
              <Field>
                <Label htmlFor="name-1">제목</Label>
                <Input id="song-title" name="song-title" />
              </Field>
              <Field>
                <Label htmlFor="name-1">아티스트</Label>
                <Input id="song-artist" name="song-artist" />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <div className="flex gap-3 items-center justify-center">
                <DialogClose asChild>
                  <Button variant="outline" className="w-[48%]">
                    취소
                  </Button>
                </DialogClose>
                <Button type="submit" className="w-[48%]">
                  시작
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
