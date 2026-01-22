# Custom Chat Design System

## Color Palette

### Primary Colors
```css
/* Main Gradient (AI Messages, Buttons) */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* User Messages */
--gradient-user: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

### Neutral Colors
```css
--white: #ffffff;
--gray-50: #fafafa;
--gray-100: #f9fafb;
--gray-200: #f3f4f6;
--gray-300: #e5e7eb;
--gray-400: #d1d5db;
--gray-500: #9ca3af;
--gray-600: #6b7280;
--gray-700: #374151;
--gray-800: #1f2937;
```

### Accent Colors
```css
--red-100: #fee2e2;
--red-200: #fecaca;
--red-500: #ef4444;
```

## Typography

### Font Families
```css
--font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
                "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
                "Helvetica Neue", sans-serif;
--font-mono: ui-monospace, monospace;
```

### Font Sizes
```css
--text-xs: 0.6875rem;    /* 11px - Keyboard hints */
--text-sm: 0.75rem;      /* 12px - Time stamps, hints */
--text-base: 0.8125rem;  /* 13px - Subtitles, labels */
--text-md: 0.9375rem;    /* 15px - Messages, input */
--text-lg: 1rem;         /* 16px - Titles */
--text-xl: 1.25rem;      /* 20px - Empty state title */
```

### Font Weights
```css
--weight-normal: 400;
--weight-medium: 500;
--weight-semibold: 600;
```

## Spacing Scale

Based on 8px grid system:

```css
--space-1: 0.125rem;   /* 2px */
--space-2: 0.25rem;    /* 4px */
--space-3: 0.375rem;   /* 6px */
--space-4: 0.5rem;     /* 8px */
--space-5: 0.625rem;   /* 10px */
--space-6: 0.75rem;    /* 12px */
--space-7: 0.875rem;   /* 14px */
--space-8: 1rem;       /* 16px */
--space-10: 1.25rem;   /* 20px */
--space-12: 1.5rem;    /* 24px */
```

## Border Radius

```css
--radius-sm: 4px;      /* Keyboard hints */
--radius-md: 8px;      /* Buttons, inputs */
--radius-lg: 10px;     /* Avatars */
--radius-xl: 12px;     /* Message bubbles */
--radius-2xl: 16px;    /* Input container */
--radius-3xl: 20px;    /* Empty state icon */
```

## Shadows

```css
/* Subtle shadow for header */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.02);

/* Message bubble shadows */
--shadow-md: 0 2px 8px rgba(102, 126, 234, 0.2);

/* Hover states */
--shadow-lg: 0 4px 12px rgba(102, 126, 234, 0.35);

/* Avatar shadows */
--shadow-avatar: 0 2px 8px rgba(102, 126, 234, 0.25);
```

## Components

### Header
- **Height**: 72px
- **Background**: White (#ffffff)
- **Border**: 1px solid #f0f0f0 (bottom)
- **Padding**: 1.25rem 1.5rem (20px 24px)

### Chat Messages Area
- **Background**: Linear gradient (#fafafa to #ffffff)
- **Padding**: 1.5rem (24px)
- **Gap between messages**: 1.5rem (24px)
- **Scrollbar width**: 6px

### Message Bubble (User)
- **Background**: Primary gradient
- **Color**: White
- **Padding**: 0.875rem 1.125rem (14px 18px)
- **Border radius**: 12px (except bottom-right: 4px)
- **Shadow**: 0 2px 8px rgba(102, 126, 234, 0.2)

### Message Bubble (Assistant)
- **Background**: #f9fafb
- **Color**: #1f2937
- **Border**: 1px solid #e5e7eb
- **Padding**: 0.875rem 1.125rem (14px 18px)
- **Border radius**: 12px (except bottom-left: 4px)

### Avatar
- **Size**: 36px × 36px
- **Border radius**: 10px
- **Shadow**: 0 2px 8px rgba(color, 0.25)
- **User**: Gradient (#f093fb to #f5576c)
- **Assistant**: Gradient (#667eea to #764ba2)

### Input Container
- **Background**: #f9fafb (default), #ffffff (focused)
- **Border**: 1.5px solid #e5e7eb (default), #667eea (focused)
- **Border radius**: 16px
- **Padding**: 0.875rem 1rem (14px 16px)
- **Focus ring**: 0 0 0 3px rgba(102, 126, 234, 0.1)

### Send Button
- **Size**: 36px × 36px
- **Background**: Primary gradient
- **Color**: White
- **Border radius**: 10px
- **Shadow**: 0 2px 8px rgba(102, 126, 234, 0.25)
- **Hover transform**: translateY(-1px)
- **Disabled background**: #e5e7eb
- **Disabled color**: #9ca3af

### Suggestion Chip
- **Background**: White
- **Border**: 1px solid #e5e7eb
- **Border radius**: 12px
- **Padding**: 0.875rem 1.25rem (14px 20px)
- **Hover border**: #667eea
- **Hover transform**: translateY(-1px)
- **Hover shadow**: 0 4px 12px rgba(102, 126, 234, 0.1)

### Empty State Icon
- **Size**: 80px × 80px
- **Background**: Linear gradient with 15% opacity
- **Border radius**: 20px
- **Color**: #667eea

## Animations

### Message Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Duration: 0.3s ease */
```

### Typing Indicator
```css
@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-4px);
  }
}
/* Duration: 1.4s infinite, staggered by 0.2s */
```

### Transitions
```css
/* All interactive elements */
transition: all 0.2s ease;
```

## Responsive Breakpoints

### Mobile (< 768px)
- Reduced padding: 1rem (16px) instead of 1.5rem (24px)
- Smaller header: 1rem 1.25rem (16px 20px)
- Full-width suggestion chips

## Accessibility

### Contrast Ratios
- Body text on white: 8.59:1 (AAA)
- Gray text on white: 4.54:1 (AA)
- White on primary gradient: 4.5:1+ (AA)

### Focus States
- All interactive elements have visible focus states
- Focus ring: 3px solid rgba(102, 126, 234, 0.1)

### Keyboard Navigation
- Tab order follows visual hierarchy
- Enter to submit message
- Shift+Enter for new line
- All buttons keyboard accessible

## Best Practices

1. **Spacing**: Use the 8px grid system consistently
2. **Colors**: Use semantic color names, not hardcoded values
3. **Shadows**: Apply sparingly for depth hierarchy
4. **Animations**: Keep under 0.3s for snappy feel
5. **Gradients**: Use as accents, not primary backgrounds
6. **Typography**: Maintain 1.5-1.6 line-height for readability
7. **Borders**: 1px for dividers, 1.5px for inputs
8. **Hover States**: Always include for interactive elements
9. **Loading States**: Provide visual feedback during async operations
10. **Empty States**: Guide users with helpful suggestions

## Icon System

All icons are SVG-based with the following properties:
- **Size**: 18-24px
- **Stroke width**: 2px
- **Stroke linecap**: round
- **Stroke linejoin**: round
- **Color**: Inherits from parent

Common icons used:
- Layers (AI Assistant)
- User (User avatar)
- Send (Submit message)
- Stop (Cancel generation)
- Trash (Clear chat)
- Search (Empty state)

## Dark Mode (Future)

When implementing dark mode, invert the color palette:
- Background: #1f2937 → #0f172a
- Cards: #374151 → #1e293b
- Text: #1f2937 → #f9fafb
- Borders: #e5e7eb → #334155
- Keep gradients the same for brand consistency
