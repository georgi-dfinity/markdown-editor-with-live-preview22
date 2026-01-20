import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PreviewPaneProps {
  markdown: string;
}

export default function PreviewPane({ markdown }: PreviewPaneProps) {
  const [html, setHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load marked library from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    script.async = true;
    script.onload = () => {
      setIsLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && (window as any).marked) {
      try {
        // Configure marked options
        (window as any).marked.setOptions({
          breaks: true,
          gfm: true,
          headerIds: true,
          mangle: false,
        });

        const rendered = (window as any).marked.parse(markdown);
        setHtml(rendered);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        setHtml('<p>Error rendering markdown</p>');
      }
    }
  }, [markdown, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="mb-2 text-sm text-muted-foreground">Loading preview...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <div className="border-b border-border bg-card px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Preview</h2>
      </div>
      <ScrollArea className="flex-1">
        <div
          className="prose prose-sm dark:prose-invert max-w-none p-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </ScrollArea>
    </div>
  );
}
