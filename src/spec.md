# Markdown Editor with Live Preview

## Overview
A web-based Markdown editor that provides real-time preview functionality, allowing users to write Markdown text and see the rendered HTML output simultaneously.

## Core Features

### Editor Interface
- Split-pane layout with Markdown input on the left and HTML preview on the right
- Real-time preview updates as the user types
- Syntax highlighting for Markdown text in the editor pane
- Responsive design that works on desktop and mobile devices

### Formatting Toolbar
- Bold text button
- Italic text button
- Heading levels (H1, H2, H3) buttons
- Link insertion button
- Code block button
- Unordered list button
- Ordered list button

### Local Storage
- Save notes locally in the browser
- Load previously saved notes
- Multiple note management (create, delete, rename notes)
- Automatic saving of current work

### Theme Support
- Dark mode and light mode toggle
- Theme preference persisted in browser storage

### User Interface
- Clean, minimalist design
- Responsive layout that adapts to different screen sizes
- Resizable panes for editor and preview
- Clear visual separation between editor and preview areas

## Technical Requirements

### Frontend Only
- All functionality runs in the browser
- No backend data persistence required
- Uses browser's localStorage for saving notes
- Markdown parsing and HTML rendering handled client-side

### Markdown Support
- Standard Markdown syntax support
- Code syntax highlighting in preview
- Table rendering
- Link and image support
- Blockquotes and lists
