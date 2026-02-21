import GuestLayout from '@/layouts/GuestLayout';
import HostLayout from '@/layouts/HostLayout';
import Class from '@/routes/Class';
import Dashboard from '@/routes/Dashboard';
import Home from '@/routes/Home';

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
    children: [
      { index: true, Component: Dashboard },
      { path: 'class', Component: Class },
    ],
  },
]);
