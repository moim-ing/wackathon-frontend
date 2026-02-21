import loginApi from '@/api/auth/login';
import logoutApi from '@/api/auth/logout';
import signupApi from '@/api/auth/signup';
import { getMe as getMeApi } from '@/api/users/me';
import useAuthStore from '@/hooks/useAuthStore';
import type { LoginRequest, SignUpRequest } from '@/types/auth';
import { useNavigate } from 'react-router';

export default function useAuth() {
  const navigate = useNavigate();

  const { user, isLoggedIn, login, logout, updateUser } = useAuthStore(
    (state) => state
  );

  // 1. 이메일 로그인 로직
  const handleLogin = async (data: LoginRequest) => {
    try {
      const { token } = await loginApi(data);
      const user = await getMeApi(token);
      login(user, token); // Zustand 스토어 업데이트
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // 2. 이메일 회원가입 로직
  const handleSignUp = async (data: SignUpRequest) => {
    try {
      const response = await signupApi(data);

      if (response.data.token) {
        // 성공 시 바로 로그인 할지 여부는 선택사항. 지금은 true 리턴.
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup failed:', error);
    }
    return false;
  };

  // 4. 내 정보 동기화
  const refreshUser = async () => {
    if (!isLoggedIn) return;
    try {
      const userData = await getMeApi();
      updateUser(userData);
    } catch (error) {
      console.error('Refresh user failed:', error);
      handleLogout(); // 토큰이 유효하지 않으면 로그아웃 처리
    }
  };

  // 5. 로그아웃 로직
  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error(e);
    } finally {
      logout(); // Zustand 상태 초기화
      navigate('/login');
    }
  };

  return {
    user,
    isLoggedIn,
    handleLogin,
    handleSignUp,
    refreshUser,
    handleLogout,
  };
}
