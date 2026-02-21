import { Link } from 'react-router';

export default function NavBar() {
  return (
    <header className="fixed top-2 inset-x-0 z-50 flex justify-center px-2">
      <nav className="mx-auto w-full max-w-3xl flex justify-between items-center gap-2 px-2 py-2">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/moiming-symbol.svg" alt="logo" />
        </Link>
      </nav>
    </header>
  );
}
