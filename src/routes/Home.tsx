import { Button } from '@/components/ui/button';
import { useUploadFile } from '@/hooks/useFile';
import { useVerifyParticipation } from '@/hooks/useParticipation';
import type { VerifyParticipationResponse } from '@/types/participation';
import { AlertCircle, Loader2, Mic } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

export default function Home() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId') ?? '';

  const verifyMutation = useVerifyParticipation(sessionId);
  const uploadFileMutation = useUploadFile();

  const [isRecording, setIsRecording] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleStartRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        const recordedAt = new Date().getTime();

        setIsRecording(false);
        setIsVerifying(true);

        try {
          // 1. Upload audio file to get the key
          const uploadResponse = await uploadFileMutation.mutateAsync({
            file: audioBlob,
            prefix: 'audio',
          });

          // 2. Verify participation with the received key
          const response: VerifyParticipationResponse =
            await verifyMutation.mutateAsync({
              key: uploadResponse.key,
              recordedAt,
            });
          // Navigate to success page with the verified data
          navigate('/success', { state: { verificationData: response } });
        } catch (error) {
          console.error('Verification failed', error);
          setErrorMsg('출석 확인에 실패했습니다. 다시 녹음해주세요.');
        } finally {
          setIsVerifying(false);
          // Stop all audio tracks
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimeLeft(5);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Stop recording after 5 seconds
      setTimeout(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === 'recording'
        ) {
          mediaRecorderRef.current.stop();
        }
      }, 5000);
    } catch (err) {
      console.error('Failed to get user media', err);
      setErrorMsg('마이크 권한을 허용해 주세요.');
    }
  };

  return (
    <div className="flex flex-col gap-12 w-full items-center md:mt-24 mt-12">
      <div className="flex flex-col gap-2 w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold tracking-tight">현장 출석 체크</h1>

        <p className="body-base text-muted-foreground mt-2">
          강의실에서 들리는 음악 소리를 녹음하여
          <br />
          출석을 인증하세요.
        </p>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Animated rings when recording */}
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="absolute inset-4 rounded-full bg-primary/30 animate-pulse" />
          </>
        )}

        <Button
          size="icon"
          className={`w-32 h-32 rounded-full transition-all duration-300 shadow-xl ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 scale-110'
              : 'bg-primary hover:bg-primary/90'
          }`}
          onClick={handleStartRecording}
          disabled={isRecording || isVerifying}
        >
          {isVerifying ? (
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          ) : (
            <Mic
              className={`size-16 text-white ${isRecording ? 'animate-pulse' : ''}`}
            />
          )}
        </Button>
      </div>

      <div className="h-16 flex flex-col justify-center items-center w-full max-w-sm">
        {isRecording && (
          <p className="text-lg font-medium text-red-500 animate-pulse">
            녹음 중입니다… ({timeLeft}초)
          </p>
        )}

        {isVerifying && (
          <p className="text-lg font-medium text-primary">
            출석 인증 중입니다…
          </p>
        )}

        {errorMsg && !isRecording && !isVerifying && (
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}
      </div>

      {errorMsg && !isRecording && !isVerifying && (
        <Button size="lg" onClick={handleStartRecording} className="mt-4">
          다시 시도하기
        </Button>
      )}
    </div>
  );
}
