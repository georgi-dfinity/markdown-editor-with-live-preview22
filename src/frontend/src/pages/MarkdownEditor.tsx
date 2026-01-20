import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Plus, Save, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import EditorPane from '../components/EditorPane';
import PreviewPane from '../components/PreviewPane';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export default function MarkdownEditor() {
  const { theme, setTheme } = useTheme();
  const [notes, setNotes] = useLocalStorage<Note[]>('markdown-notes', []);
  const [currentNoteId, setCurrentNoteId] = useLocalStorage<string | null>('current-note-id', null);
  const [markdown, setMarkdown] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const currentNote = notes.find((note) => note.id === currentNoteId);

  // Load current note content
  useEffect(() => {
    if (currentNote) {
      setMarkdown(currentNote.content);
    } else if (notes.length === 0) {
      // Create a welcome note for first-time users
      const welcomeNote: Note = {
        id: crypto.randomUUID(),
        title: 'Welcome to Markdown Editor',
        content: `# Welcome to Markdown Editor! 🎉

This is a powerful markdown editor with live preview. Start typing to see your markdown rendered in real-time!

## Features

- **Live Preview**: See your markdown rendered as you type
- **Multiple Notes**: Create and manage multiple markdown documents
- **Auto-Save**: Your work is automatically saved to browser storage
- **Dark Mode**: Toggle between light and dark themes
- **Formatting Toolbar**: Quick access to common markdown formatting

## Quick Start

### Headings
Use \`#\` for headings. More \`#\` symbols = smaller heading.

### Text Formatting
- **Bold text** with \`**text**\`
- *Italic text* with \`*text*\`
- ~~Strikethrough~~ with \`~~text~~\`

### Lists
1. Ordered lists use numbers
2. Like this
3. Simple!

- Unordered lists use dashes
- Or asterisks
- Easy peasy

### Links and Images
[Link text](https://example.com)
![Alt text](https://via.placeholder.com/150)

### Code
Inline \`code\` uses backticks.

\`\`\`javascript
// Code blocks use triple backticks
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Blockquotes
> This is a blockquote
> It can span multiple lines

### Tables
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |

---

**Happy writing!** ✨`,
        updatedAt: Date.now(),
      };
      setNotes([welcomeNote]);
      setCurrentNoteId(welcomeNote.id);
      setMarkdown(welcomeNote.content);
    }
  }, [currentNote, notes.length]);

  // Auto-save current note
  useEffect(() => {
    if (currentNoteId && markdown !== currentNote?.content) {
      const timeoutId = setTimeout(() => {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === currentNoteId
              ? { ...note, content: markdown, updatedAt: Date.now() }
              : note
          )
        );
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [markdown, currentNoteId, currentNote?.content]);

  const createNewNote = useCallback(() => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: `Note ${notes.length + 1}`,
      content: '# New Note\n\nStart writing here...',
      updatedAt: Date.now(),
    };
    setNotes([...notes, newNote]);
    setCurrentNoteId(newNote.id);
    setMarkdown(newNote.content);
    toast.success('New note created');
  }, [notes, setNotes, setCurrentNoteId]);

  const saveNote = useCallback(() => {
    if (currentNoteId) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === currentNoteId
            ? { ...note, content: markdown, updatedAt: Date.now() }
            : note
        )
      );
      toast.success('Note saved');
    }
  }, [currentNoteId, markdown, setNotes]);

  const deleteNote = useCallback(
    (noteId: string) => {
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);

      if (currentNoteId === noteId) {
        if (updatedNotes.length > 0) {
          setCurrentNoteId(updatedNotes[0].id);
          setMarkdown(updatedNotes[0].content);
        } else {
          setCurrentNoteId(null);
          setMarkdown('');
        }
      }

      toast.success('Note deleted');
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    },
    [notes, currentNoteId, setNotes, setCurrentNoteId]
  );

  const confirmDelete = useCallback((noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  }, []);

  const switchNote = useCallback(
    (noteId: string) => {
      setCurrentNoteId(noteId);
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setMarkdown(note.content);
      }
    },
    [notes, setCurrentNoteId]
  );

  const updateNoteTitle = useCallback(
    (noteId: string, newTitle: string) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, title: newTitle, updatedAt: Date.now() } : note
        )
      );
    },
    [setNotes]
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Markdown Editor</h1>
              <p className="text-xs text-muted-foreground">Live Preview</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={createNewNote}>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Notes ({notes.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <ScrollArea className="max-h-96">
                  {notes.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notes yet. Create one to get started!
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center justify-between gap-2 px-2 py-1.5"
                      >
                        <DropdownMenuItem
                          className="flex-1 cursor-pointer"
                          onClick={() => switchNote(note.id)}
                        >
                          <div className="flex-1 truncate">
                            <div className="truncate font-medium">{note.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(note.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                          {currentNoteId === note.id && (
                            <div className="ml-2 h-2 w-2 rounded-full bg-primary" />
                          )}
                        </DropdownMenuItem>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(note.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={saveNote}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <EditorPane
              markdown={markdown}
              onChange={setMarkdown}
              noteTitle={currentNote?.title || ''}
              onTitleChange={(title) => currentNoteId && updateNoteTitle(currentNoteId, title)}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <PreviewPane markdown={markdown} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              {markdown.split(/\s+/).filter((word) => word.length > 0).length} words
            </span>
            <span>{markdown.length} characters</span>
            {currentNote && (
              <span>Last saved: {new Date(currentNote.updatedAt).toLocaleTimeString()}</span>
            )}
          </div>
          <div>
            © 2025. Built with love using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => noteToDelete && deleteNote(noteToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
