import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import MarkdownEditor from './pages/MarkdownEditor';

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <MarkdownEditor />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
