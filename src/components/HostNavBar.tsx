import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export default function NavBar() {
  const isLogin = false;

  const handleLogout = () => {
    console.info('Logout button clicked.');
  };

  return (
    <header className="fixed top-2 inset-x-0 z-50 flex justify-center px-2">
      <nav className="mx-auto w-full max-w-3xl flex justify-between items-center gap-2 px-2 py-2">
        <Link to="/host" className="flex items-center space-x-2">
          <img src="/muCheckLogo.svg" alt="logo" />
        </Link>
        {isLogin ? (
          <Button
            variant="link"
            className="text-black font-semibold cursor-pointer"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        ) : (
          <Button
            variant="link"
            className="text-black font-semibold cursor-pointer"
          >
            <Link to="/host">로그인</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}
