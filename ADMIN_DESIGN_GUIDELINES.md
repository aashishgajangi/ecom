# Admin Dashboard Design Guidelines

## Overview

This document outlines the design patterns and guidelines for maintaining consistency across all admin pages in the Ecom application. The design follows modern ecommerce patterns while accounting for Tailwind v4 differences.

## Design Principles

1. **Consistency**: All admin pages should follow the same visual language
2. **Professionalism**: Clean, modern design that reflects the brand
3. **Usability**: Intuitive navigation and clear visual hierarchy
4. **Responsiveness**: Mobile-friendly design that works on all devices

## Color Scheme

- **Primary Gradient**: `from-primary-start (#70843d)` to `from-primary-end (#7bd63c)`
- **Background**: `bg-gradient-to-br from-gray-50 to-white`
- **Cards**: `bg-white` with `border border-gray-100` and `shadow-md`
- **Text**: Standard gray scale with gradient text for headings

## Typography

- **Headings**: Use `gradient-text` class for main headings
- **Body**: Standard gray text colors
- **Font Weights**: Bold for headings, medium for subheadings

## Layout Structure

### Container Structure
```tsx
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
  {/* Header */}
  <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
    <div className="container-custom">
      {/* Header content */}
    </div>
  </header>

  {/* Main Content */}
  <main className="container-custom py-8">
    {/* Page content */}
  </main>
</div>
```

### Card Components
```tsx
<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
  {/* Card content */}
</div>
```

### Button Styles
```tsx
// Primary buttons
<button className="bg-gradient-to-r from-primary-start to-primary-end hover:from-primary-end hover:to-primary-start text-white rounded-lg transition-all duration-300 transform hover:-translate-y-0.5">
  Button Text
</button>

// Secondary buttons (links)
<Link className="text-primary-start hover:text-primary-end transition-colors">
  Link Text
</Link>
```

## Component Patterns

### Stats Cards
```tsx
<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
  <p className="text-3xl font-bold gradient-text">123</p>
</div>
```

### Action Links
```tsx
<Link
  href="/path"
  className="block w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-300 transform hover:-translate-y-0.5"
>
  Action Text
</Link>
```

### Form Elements
```tsx
<form className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
  {/* Form fields */}
</form>
```

## Implementation Examples

### Dashboard Page
- Uses grid layout for stats overview
- Card-based navigation sections
- Consistent header with gradient text

### Content Management
- Maintains the same header structure
- Uses container-custom for consistent spacing
- Follows the same card and button patterns

### Login Page
- Gradient background
- Centered card layout
- Gradient button styling

## Tailwind v4 Considerations

The project uses Tailwind v4 with the following key differences from v3:

1. **Import syntax**: Uses `@import "tailwindcss"` instead of `@tailwind` directives
2. **Theme configuration**: Configured in `tailwind.config.ts` with proper TypeScript support
3. **Custom classes**: All custom utility classes are defined in `src/app/globals.css`

## File Structure

```
src/app/admin/
├── dashboard/          # Main dashboard
├── content/           # Content management
│   ├── pages/         # Page management
│   └── create/        # Page creation
├── backup/            # Backup management
└── page.tsx          # Login page
```

## Best Practices

1. **Reuse Components**: Use consistent header and card components
2. **Follow Patterns**: Stick to the established design patterns
3. **Test Responsiveness**: Ensure all pages work on mobile devices
4. **Maintain Consistency**: Keep the same styling across all admin pages

## Custom CSS Classes

Available in `src/app/globals.css`:
- `.gradient-text` - Gradient text effect
- `.container-custom` - Standard container with max-width and padding
- `.btn-primary` - Primary button styles
- `.btn-secondary` - Secondary button styles

## Browser Support

The design uses modern CSS features:
- CSS Grid and Flexbox
- CSS Custom Properties
- Backdrop filters (for header blur)
- CSS transitions and transforms

Ensure fallbacks for older browsers if needed.

## Performance Considerations

- Use efficient CSS with minimal redundancy
- Leverage Tailwind's utility-first approach
- Optimize images and assets
- Consider code splitting for larger admin sections
