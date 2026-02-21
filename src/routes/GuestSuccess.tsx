import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSessionAttendance } from '@/hooks/useSessions';
import type { VerifyParticipationResponse } from '@/types/participation';
import { getYouTubeInfo, getYouTubeThumbnailUrl } from '@/utils/youtube';
import { CheckCircle2, Loader2, Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const DEFAULT_VERIFICATION_DATA: VerifyParticipationResponse = {
  id: '1',
  title: '알고리즘 (테스트)',
  sessionId: '2',
  sessionTitle: '1주차',
  videoId: 'hHHQ4bNhwjU',
  verifiedAt: new Date().toISOString(),
};

export default function GuestSuccess() {
  const attendMutation = useSessionAttendance();
  const location = useLocation();
  const navigate = useNavigate();
  // const verificationData = location.state
  //   ?.verificationData as VerifyParticipationResponse;
  // 개발 시 편리한 테스트를 위해 라우트로 직접 접근해도 기본 데이터를 제공합니다.
  const verificationData =
    (location.state?.verificationData as VerifyParticipationResponse) ||
    DEFAULT_VERIFICATION_DATA;

  const [studentName, setStudentName] = useState('');
  const [songTitle, setSongTitle] = useState<string>('');
  const [songAuthor, setSongAuthor] = useState<string>('');
  const [isFetchingInfo, setIsFetchingInfo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!verificationData) {
      navigate('/', { replace: true });
      return;
    }

    const fetchInfo = async () => {
      setIsFetchingInfo(true);
      try {
        const info = await getYouTubeInfo(verificationData.videoId);
        setSongTitle(info.title);
        setSongAuthor(info.authorName);
      } catch (error) {
        console.error('Failed to get song info', error);
        setSongTitle('재생 중인 곡 (정보 없음)');
        setSongAuthor('알 수 없는 업로더');
      } finally {
        setIsFetchingInfo(false);
      }
    };

    fetchInfo();
  }, [verificationData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !verificationData) return;

    setIsSubmitting(true);
    try {
      await attendMutation.mutateAsync({
        classId: verificationData.id,
        sessionId: verificationData.sessionId,
        data: {
          name: studentName,
          verifiedAt: verificationData.verifiedAt,
        },
      });
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Attendance submit failed', error);
      alert('출석 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!verificationData) return null;

  if (submitSuccess) {
    return (
      <div className="flex flex-col gap-6 h-full w-full items-center justify-center animate-in fade-in zoom-in duration-300 md:mt-24 mt-12 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h1 className="leading-[1.3] text-3xl font-bold tracking-tight">
            출석 완료!
          </h1>
          <p className="body-base text-muted-foreground w-full">
            {studentName}님의 출석이 성공적으로 등록되었습니다.
          </p>
        </div>
        <Button size="lg" className="mt-4" onClick={() => navigate('/')}>
          처음으로 돌아가기
        </Button>
      </div>
    );
  }

  const thumbnailUrl = getYouTubeThumbnailUrl(verificationData.videoId);

  return (
    <div className="flex flex-col gap-6 h-full w-full items-center md:mt-12 mt-6">
      <Card className="w-full max-w-sm shadow-lg border-primary/20 animate-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            음원 인증 성공
          </CardTitle>
          <CardDescription className="text-base mt-2">
            출석을 완료하려면 본인의 이름을 입력해주세요.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Class Info Box */}
          <div className="bg-muted p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-muted-foreground">강의명</span>
              <span>{verificationData.title}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-muted-foreground">세션</span>
              <span>{verificationData.sessionTitle}</span>
            </div>
          </div>

          {/* Song Info Box */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-semibold text-muted-foreground">
              <Music className="w-4 h-4" />
              <span>현재 재생 중인 곡</span>
            </div>

            <div className="flex items-center space-x-4 bg-muted/50 p-3 rounded-xl border border-border/50">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-black/10 flex-shrink-0">
                <img
                  src={thumbnailUrl}
                  alt="YouTube Thumbnail"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                {isFetchingInfo ? (
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 bg-primary/10 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-primary/10 rounded animate-pulse" />
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium line-clamp-2 text-foreground break-all">
                      {songTitle}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {songAuthor}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form
            id="attendance-form"
            onSubmit={handleSubmit}
            className="space-y-3 pt-2"
          >
            <label
              htmlFor="student-name"
              className="text-sm font-semibold block"
            >
              이름
            </label>
            <Input
              id="student-name"
              type="text"
              placeholder="홍길동"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full text-lg py-6"
              required
              disabled={isSubmitting}
            />
          </form>
        </CardContent>

        <CardFooter>
          <Button
            form="attendance-form"
            type="submit"
            className="w-full text-lg h-14"
            disabled={!studentName.trim() || isSubmitting || isFetchingInfo}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                제출 중...
              </>
            ) : (
              '출석 완료하기'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
