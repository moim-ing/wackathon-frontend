import GuestLayout from '@/layouts/GuestLayout';
import HostLayout from '@/layouts/HostLayout';
import Class from '@/routes/Class';
import Home from '@/routes/Home';
import HostHome from '@/routes/HostHome';

import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: GuestLayout,
    children: [{ index: true, Component: Home }],
  },
  {
    path: '/host',
    Component: HostLayout,
    children: [{ index: true, Component: HostHome }],
  },
  {
    path: '/class/:classId',
    Component: HostLayout,
    children: [{ index: true, Component: Class }],
  },
]);
