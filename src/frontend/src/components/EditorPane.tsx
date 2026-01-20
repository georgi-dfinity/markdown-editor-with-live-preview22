import { useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Code,
  List,
  ListOrdered,
  Quote,
  Image,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EditorPaneProps {
  markdown: string;
  onChange: (value: string) => void;
  noteTitle: string;
  onTitleChange: (title: string) => void;
}

export default function EditorPane({
  markdown,
  onChange,
  noteTitle,
  onTitleChange,
}: EditorPaneProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = useCallback(
    (before: string, after: string = '', placeholder: string = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = markdown.substring(start, end);
      const textToInsert = selectedText || placeholder;

      const newText =
        markdown.substring(0, start) +
        before +
        textToInsert +
        after +
        markdown.substring(end);

      onChange(newText);

      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + before.length + textToInsert.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [markdown, onChange]
  );

  const insertAtLineStart = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const lineStart = markdown.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = markdown.indexOf('\n', start);
      const actualLineEnd = lineEnd === -1 ? markdown.length : lineEnd;

      const newText =
        markdown.substring(0, lineStart) +
        prefix +
        markdown.substring(lineStart, actualLineEnd) +
        markdown.substring(actualLineEnd);

      onChange(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }, 0);
    },
    [markdown, onChange]
  );

  const toolbarButtons = [
    {
      icon: Bold,
      label: 'Bold',
      action: () => insertText('**', '**', 'bold text'),
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => insertText('*', '*', 'italic text'),
    },
    {
      icon: Heading1,
      label: 'Heading 1',
      action: () => insertAtLineStart('# '),
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      action: () => insertAtLineStart('## '),
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      action: () => insertAtLineStart('### '),
    },
    {
      icon: Link,
      label: 'Link',
      action: () => insertText('[', '](url)', 'link text'),
    },
    {
      icon: Image,
      label: 'Image',
      action: () => insertText('![', '](url)', 'alt text'),
    },
    {
      icon: Code,
      label: 'Code Block',
      action: () => insertText('```\n', '\n```', 'code'),
    },
    {
      icon: List,
      label: 'Unordered List',
      action: () => insertAtLineStart('- '),
    },
    {
      icon: ListOrdered,
      label: 'Ordered List',
      action: () => insertAtLineStart('1. '),
    },
    {
      icon: Quote,
      label: 'Blockquote',
      action: () => insertAtLineStart('> '),
    },
  ];

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b border-border bg-card px-4 py-3">
        <Input
          value={noteTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Note title..."
          className="mb-3 border-0 bg-transparent px-0 text-lg font-semibold focus-visible:ring-0"
        />
        <TooltipProvider>
          <div className="flex flex-wrap gap-1">
            {toolbarButtons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={button.action}
                    className="h-8 w-8"
                  >
                    <button.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{button.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
      <div className="flex-1 overflow-hidden p-4">
        <Textarea
          ref={textareaRef}
          value={markdown}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start typing your markdown here..."
          className="h-full resize-none border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
