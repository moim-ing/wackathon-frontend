import RootLayout from '@/layouts/RootLayout';
import Home from '@/routes/Home';

import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [{ index: true, Component: Home }],
  },
]);
