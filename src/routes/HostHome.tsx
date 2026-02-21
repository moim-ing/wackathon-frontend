import ClassCard from '@/components/ClassCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router';

const sampleClasses = [
  {
    id: '1',
    title: '리액트의 원리와 실습',
  },
  {
    id: '2',
    title: '고급 CSS ',
  },
];

export default function HostHome() {
  const isLoggedin = true;
  const navigate = useNavigate();

  // if not signed in, show the login page
  if (!isLoggedin) {
    return (
      <div className="flex flex-col gap-8 h-full w-full items-center justify-center">
        <div className="flex flex-col px-2 gap-2 w-full max-w-sm">
          <h1>로그인</h1>
          <span className="body-base">
            로그인하면 쉽게 <strong>수업 출석을 관리</strong>하고, <br />
            <strong>음성 녹음 기반 출석 체크</strong>를 사용할 수 있어요.
          </span>
        </div>
        <Card className="w-full max-w-sm">
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">비밀번호</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </CardFooter>
        </Card>
        <div className="flex text-muted-foreground items-center justify-center">
          <span className="body-base mb-[1.5px]">계정이 없으신가요?</span>
          <Button
            className="body-strong text-foreground hover:text-primary"
            variant="link"
          >
            회원가입
          </Button>
        </div>
      </div>
    );
  }

  // otherwise, show the dashboard
  return (
    <div className="flex flex-col gap-8 h-full w-full items-center">
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <h1 className="leading-[1.3]">
          안녕하세요, <br /> 홍지수 님!
        </h1>
        <span className="body-base">
          출석 체크를 시작할 수업을 선택해주세요.
        </span>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {sampleClasses.map((classItem) => (
          <ClassCard
            key={classItem.id}
            title={classItem.title}
            onClick={() => navigate(`/class/${classItem.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
