import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const isPasswordValid = formData.password.length >= 8;
  const isConfirmPasswordMatch = formData.password === formData.confirmPassword;

  const showPasswordError = formData.password.length > 0 && !isPasswordValid;
  const showConfirmError =
    formData.confirmPassword.length > 0 && !isConfirmPasswordMatch;

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    isPasswordValid &&
    isConfirmPasswordMatch &&
    formData.confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.info('Sign up submitted:', formData);
      // 가입 로직 처리
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full w-full items-center justify-center">
      <div className="flex flex-col px-2 gap-2 w-full max-w-sm">
        <h1>회원가입</h1>
        <span className="body-base">
          회원으로 가입하시고,
          <br />
          소리로 출석을 관리해 보세요.
        </span>
      </div>
      <Card className="w-full max-w-sm">
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="name">이름</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">이메일</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="8자 이상 입력"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={showPasswordError}
                required
              />
              {showPasswordError && (
                <FieldError>비밀번호는 8자 이상 입력해 주세요.</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">비밀번호 확인</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호 다시 입력"
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-invalid={showConfirmError}
                required
              />
              {showConfirmError && (
                <FieldError>비밀번호를 다시 확인해 주세요.</FieldError>
              )}
            </Field>
            <Button type="submit" className="w-full" disabled={!isFormValid}>
              회원가입
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="flex text-muted-foreground items-center justify-center">
        <span className="body-base mb-[1.5px]">이미 계정이 있으신가요?</span>
        <Button
          className="body-strong text-foreground hover:text-primary"
          variant="link"
          onClick={() => navigate('/host')}
        >
          로그인
        </Button>
      </div>
    </div>
  );
}
