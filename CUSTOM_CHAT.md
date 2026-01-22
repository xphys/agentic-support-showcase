# Custom CopilotKit Chat UI

A modern, light-themed custom chat interface for CopilotKit built with React and headless hooks.

## Overview

This custom implementation replaces the default CopilotChat component with a beautiful, modern UI that features:

- **Modern Light Design** - Clean, minimal aesthetic with gradient accents
- **Smooth Animations** - Slide-up message animations and smooth transitions
- **Responsive Layout** - Works seamlessly on desktop and mobile
- **Professional UX** - Typing indicators, timestamps, and message states
- **Accessible** - Keyboard shortcuts and ARIA-compliant markup

## Features

### Visual Design

- **Gradient Accents** - Purple-to-indigo gradients for brand consistency
- **Clean Typography** - Optimized font sizes and line heights
- **Subtle Shadows** - Depth without visual clutter
- **Rounded Corners** - Modern, friendly aesthetic
- **Custom Scrollbar** - Minimal, unobtrusive scrollbar design

### User Experience

- **Empty State** - Welcoming empty state with suggestion chips
- **Message Bubbles** - Distinct styling for user vs AI messages
- **Typing Indicator** - Animated dots while AI is responding
- **Auto-scroll** - Automatically scrolls to latest message
- **Auto-resize Input** - Textarea grows with content
- **Keyboard Shortcuts** - Enter to send, Shift+Enter for new line
- **Clear Chat** - Easy way to start fresh conversation

### Technical Features

- **Headless Architecture** - Built with `useCopilotChatInternal` hook
- **Type-safe** - Full TypeScript support
- **Performance** - Optimized re-renders and smooth animations
- **Customizable** - Easy to modify colors, spacing, and behavior

## File Structure

```
src/app/components/
├── CustomCopilotChat.tsx    # Main chat component
└── CustomCopilotChat.css    # Styling
```

## Usage

The custom chat is already integrated into your main page:

```tsx
import { CustomCopilotChat } from "./components/CustomCopilotChat";

export default function HomePage() {
  return (
    <Grid.Col span={6}>
      <CustomCopilotChat />
    </Grid.Col>
  );
}
```

## Customization Guide

### Colors

Edit `CustomCopilotChat.css` to change the color scheme:

```css
/* Primary gradient (AI messages, buttons) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* User message gradient */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Background colors */
background: #ffffff; /* Main background */
background: #f9fafb; /* Secondary background */
background: #fafafa; /* Gradient start */
```

### Typography

Adjust font sizes in the CSS:

```css
.chat-title { font-size: 1rem; }
.message-text { font-size: 0.9375rem; }
.empty-state-title { font-size: 1.25rem; }
```

### Spacing

Modify padding and gaps:

```css
.chat-header { padding: 1.25rem 1.5rem; }
.chat-messages { padding: 1.5rem; }
.messages-list { gap: 1.5rem; }
```

### Suggestion Chips

Customize the default suggestions:

```tsx
<button
  className="suggestion-chip"
  onClick={() => setInputValue("Your custom prompt")}
>
  Your custom text
</button>
```

## API Reference

### Props

```tsx
interface CustomCopilotChatProps {
  className?: string; // Optional CSS class name
}
```

### Hooks Used

The component uses `useCopilotChatInternal` which provides:

- `messages` - Array of chat messages
- `sendMessage` - Send a new message
- `setMessages` - Replace all messages
- `isLoading` - Loading state
- `stopGeneration` - Stop AI response

## Styling Philosophy

The design follows these principles:

1. **Light Mode First** - Optimized for light theme with high readability
2. **Subtle Depth** - Minimal shadows for hierarchy
3. **Consistent Spacing** - 8px grid system
4. **Modern Radius** - Generous border-radius values
5. **Gradient Accents** - Used sparingly for emphasis
6. **Smooth Transitions** - 0.2s ease for interactive elements

## Performance

The component is optimized for performance:

- **Auto-resize** - Efficient textarea height calculation
- **Scroll optimization** - Smooth scrolling with `behavior: smooth`
- **Conditional rendering** - Empty state vs message list
- **Memoization ready** - Easy to add React.memo if needed

## Accessibility

Built with accessibility in mind:

- Semantic HTML structure
- ARIA-compliant buttons and inputs
- Keyboard navigation support
- Focus states for interactive elements
- Readable color contrast ratios

## Browser Support

Tested and working on:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential improvements:

- [ ] Markdown rendering for AI responses
- [ ] Code syntax highlighting
- [ ] File upload support
- [ ] Voice input
- [ ] Dark mode toggle
- [ ] Custom avatars
- [ ] Message reactions
- [ ] Export chat history

## Troubleshooting

### Build Errors

If you get TypeScript errors, ensure:
- `@copilotkit/react-core` version is 1.50.1 or higher
- All dependencies are properly installed with `pnpm install`

### Styling Issues

If styles don't apply:
- Check that `CustomCopilotChat.css` is imported in the component
- Verify CSS file is in the same directory as the component
- Clear Next.js cache with `rm -rf .next`

### Messages Not Showing

If messages don't appear:
- Check browser console for errors
- Verify CopilotKit runtime is configured in layout.tsx
- Ensure API route at `/api/copilotkit` is working

## License

Part of your CopilotKit implementation. Follow your project's license.
