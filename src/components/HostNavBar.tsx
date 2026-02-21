import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export default function NavBar() {
  return (
    <header className="fixed top-2 inset-x-0 z-50 flex justify-center px-2">
      <nav className="mx-auto w-full max-w-3xl flex justify-between items-center gap-2 px-2 py-2">
        <Link to="/host" className="flex items-center space-x-2">
          <img src="/moiming-symbol.svg" alt="logo" />
        </Link>
        <Button
          variant="link"
          className="text-black font-semibold cursor-pointer"
        >
          로그아웃
        </Button>
      </nav>
    </header>
  );
}
