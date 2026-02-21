import NavBar from '@/components/GuestNavBar';
import { Outlet } from 'react-router';

export default function RootLayout() {
  return (
    <main>
      <NavBar />
      <div className="flex min-h-screen max-w-md mx-auto pt-14">
        <div className="flex w-full mx-4 my-4">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
