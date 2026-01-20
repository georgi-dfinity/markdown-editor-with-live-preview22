# Markdown Editor with Live Preview

## Overview
A web-based Markdown editor that provides real-time preview functionality, allowing users to write Markdown text and see the rendered HTML output simultaneously.

## Core Features

### Editor Interface
- Split-pane layout with Markdown input on the left and HTML preview on the right
- Real-time preview updates as the user types
- Syntax highlighting for Markdown text in the editor pane
- Responsive design that works on desktop and mobile devices
- Green background color applied globally across all components and pages

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
- Dark mode and light mode toggle with green background maintained in both themes
- Theme preference persisted in browser storage
- Text contrast optimized for readability against green background

### User Interface
- Clean, minimalist design with consistent green background
- Responsive layout that adapts to different screen sizes
- Resizable panes for editor and preview with matching green styling
- Clear visual separation between editor and preview areas
- Optimized text contrast and readability for markdown content on green background

## Technical Requirements

### Frontend Only
- All functionality runs in the browser
- No backend data persistence required
- Uses browser's localStorage for saving notes
- Markdown parsing and HTML rendering handled client-side
- Global green background styling applied via CSS

### Markdown Support
- Standard Markdown syntax support
- Code syntax highlighting in preview
- Table rendering
- Link and image support
- Blockquotes and lists

### Styling Requirements
- Green background color applied globally to ensure uniform appearance
- Both editor pane and preview pane styled consistently with green background
- Text readability and contrast maintained for all markdown content
- Global styling implemented through main CSS files for consistent application
