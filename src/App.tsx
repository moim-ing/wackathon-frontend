import './index.css';
import { GlobalErrorModal } from '@/components/GlobalErrorModal';
import { router } from '@/routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <GlobalErrorModal />
    </QueryClientProvider>
  );
}
