import ClassCard from '@/components/ClassCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
import useAuth from '@/hooks/useAuth';
import { useCreateClass } from '@/hooks/useClasses';
import { useMyClasses } from '@/hooks/useUser';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function HostHome() {
  const { user, isLoggedIn, handleLogin } = useAuth();
  const { data: myClassesData } = useMyClasses();
  const myClasses = myClassesData?.classes || [];
  const { mutateAsync: createClass } = useCreateClass();
  const navigate = useNavigate();

  // if not signed in, show the login page
  if (!isLoggedIn) {
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
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              const password = formData.get('password') as string;
              await handleLogin({ email, password });
            }}
          >
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">비밀번호</Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="flex text-muted-foreground items-center justify-center">
          <span className="body-base mb-[1.5px]">계정이 없으신가요?</span>
          <Button
            className="body-strong text-foreground hover:text-primary"
            variant="link"
            onClick={() => navigate('/host/signup')}
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
          안녕하세요, <br /> {user?.name}님!
        </h1>
        <span className="body-base">
          출석 체크를 시작할 수업을 선택해주세요.
        </span>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {myClasses.map((classItem) => (
          <ClassCard
            key={classItem.id}
            title={classItem.title}
            onClick={() => navigate(`/class/${classItem.id}`)}
          />
        ))}
      </div>
      <Dialog>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const title = formData.get('class-title') as string;
            if (title) {
              await createClass({ title });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-10 left-1/2 -translate-x-1/2 h-12 w-40 rounded-full shadow-xl cursor-pointer"
            >
              <Plus className="size-5" />
              <span className="text-base font-semibold">수업 추가하기</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>수업 추가하기</DialogTitle>
              <DialogDescription>
                새로운 수업의 제목을 입력해 주세요.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Input
                  id="class-title"
                  name="class-title"
                  placeholder="수업 제목"
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
                    추가
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
