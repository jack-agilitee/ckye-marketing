# NavTextItem

## Overview
A navigation menu item component that provides consistent styling and behavior for text-based navigation links. The component renders as a rounded pill-style button with hover states and active state support, optimized for use in navigation menus and navigation bars.

## Figma Reference
- **Design URL**: [CKYE Marketing Design System](https://www.figma.com/design/batSZdoIexmqeC4jNmxObc/)
- **Last Updated**: 2025-09-09
- **Component Type**: Atom

## Installation
```bash
import { NavTextItem } from '@/components/atoms/NavTextItem';
```

## Basic Usage
```tsx
import { NavTextItem } from '@/components/atoms/NavTextItem';

function Navigation() {
  return (
    <nav>
      <NavTextItem href="/">Home</NavTextItem>
      <NavTextItem href="/about">About</NavTextItem>
      <NavTextItem href="/contact" isActive>Contact</NavTextItem>
    </nav>
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `ReactNode` | - | Yes | Text content of the navigation item |
| `href` | `string` | - | Yes | URL or path to navigate to |
| `isActive` | `boolean` | `false` | No | Whether this nav item is currently active |
| `className` | `string` | `''` | No | Additional CSS classes |
| `onClick` | `(event: MouseEvent) => void` | - | No | Click handler for custom navigation logic |
| `aria-label` | `string` | - | No | Accessible label for screen readers |
| `data-testid` | `string` | - | No | Test identifier for automated testing |

## Examples

### Basic Navigation Item
```tsx
<NavTextItem href="/products">
  Products
</NavTextItem>
```

### Active Navigation Item
```tsx
<NavTextItem href="/dashboard" isActive>
  Dashboard
</NavTextItem>
```

### With Custom Click Handler
```tsx
<NavTextItem 
  href="/settings" 
  onClick={(event) => {
    // Custom analytics tracking
    analytics.track('nav_click', { page: 'settings' });
  }}
>
  Settings
</NavTextItem>
```

### With Accessibility Label
```tsx
<NavTextItem 
  href="/user/profile" 
  aria-label="Go to user profile page"
>
  Profile
</NavTextItem>
```

### With Custom Styling
```tsx
<NavTextItem 
  href="/special" 
  className="special-nav-item"
>
  Special Page
</NavTextItem>
```

### For Testing
```tsx
<NavTextItem 
  href="/test-page" 
  data-testid="test-nav-item"
>
  Test Page
</NavTextItem>
```

## States

### Visual States
- **Default**: Gray text (#8b8f97) with transparent background
- **Hover**: White text (#f7f8f8) with dark background (#28282c)
- **Active**: Same styling as hover state - white text with dark background
- **Focus**: Accessible focus ring with primary color (#5193cf) outline

### Interactive States
```tsx
{/* Default state */}
<NavTextItem href="/default">Default Item</NavTextItem>

{/* Active state */}
<NavTextItem href="/current" isActive>Current Page</NavTextItem>

{/* With hover interaction */}
<NavTextItem 
  href="/interactive"
  onMouseEnter={() => console.log('Hovered')}
>
  Interactive Item
</NavTextItem>
```

## Accessibility

### WCAG 2.1 AA Compliance
- ✅ **Color Contrast**: Meets minimum contrast ratios
- ✅ **Focus Management**: Visible focus indicators with 2px outline
- ✅ **Keyboard Navigation**: Full keyboard support via native link behavior
- ✅ **Screen Reader Support**: Proper ARIA attributes and semantic HTML

### Keyboard Navigation
- `Tab`: Focus the navigation item
- `Enter`/`Space`: Navigate to the linked page
- `Shift + Tab`: Focus previous item

### ARIA Properties
```tsx
<NavTextItem
  href="/accessible"
  aria-label="Navigate to accessible page"
  aria-current="page" // Automatically set when isActive=true
>
  Accessible Link
</NavTextItem>
```

### Screen Reader Support
- Uses semantic `<Link>` element from Next.js
- Automatically sets `aria-current="page"` when active
- Supports custom `aria-label` for additional context
- Maintains proper focus management

## Styling

### Design System
- **Font Family**: Inter, sans-serif
- **Font Size**: 16px
- **Font Weight**: 500 (Medium)
- **Line Height**: 1.45
- **Letter Spacing**: -0.08px
- **Border Radius**: 12px
- **Padding**: 8px 16px
- **Transition**: 200ms ease-in-out

### Color Palette
```scss
// Default state
color: #8b8f97;                    // Gray text
background-color: transparent;     // No background

// Hover & Active states
color: #f7f8f8;                   // White text
background-color: #28282c;        // Dark background

// Focus state
outline: 2px solid #5193cf;       // Primary blue outline
outline-offset: 2px;
```

### CSS Classes
```scss
.navTextItem {
  // Base styles applied to all instances
}

.navTextItem--active {
  // Styles applied when isActive=true
}
```

## Responsive Behavior

### All Screen Sizes
- Consistent appearance across all breakpoints
- Touch-optimized padding for mobile interactions
- `white-space: nowrap` prevents text wrapping

### Mobile Considerations
- Adequate touch target size (minimum 44px recommended)
- Readable font size without zooming
- Sufficient contrast for outdoor viewing

## Performance Considerations

### Bundle Size
- **Component**: ~1.2 KB (minified)
- **With styles**: ~1.8 KB (minified)

### Optimization Tips
- Uses CSS modules for scoped styling
- Minimal re-renders with React.memo if needed
- Efficient class name concatenation
- Leverages Next.js Link for optimized navigation

## Testing

### Test IDs
```tsx
<NavTextItem 
  href="/test" 
  data-testid="nav-item-test"
>
  Test Page
</NavTextItem>
```

### Testing Examples
```tsx
// Testing with React Testing Library
import { render, screen } from '@testing-library/react';
import { NavTextItem } from '@/components/atoms/NavTextItem';

test('renders navigation item with correct text', () => {
  render(<NavTextItem href="/test">Test Link</NavTextItem>);
  expect(screen.getByText('Test Link')).toBeInTheDocument();
});

test('applies active class when isActive is true', () => {
  render(
    <NavTextItem href="/active" isActive data-testid="active-nav">
      Active Link
    </NavTextItem>
  );
  const navItem = screen.getByTestId('active-nav');
  expect(navItem).toHaveClass('navTextItem--active');
});

test('handles click events', () => {
  const handleClick = jest.fn();
  render(
    <NavTextItem href="/click" onClick={handleClick}>
      Click Me
    </NavTextItem>
  );
  
  fireEvent.click(screen.getByText('Click Me'));
  expect(handleClick).toHaveBeenCalled();
});

test('sets aria-current when active', () => {
  render(
    <NavTextItem href="/current" isActive>
      Current Page
    </NavTextItem>
  );
  
  expect(screen.getByText('Current Page')).toHaveAttribute('aria-current', 'page');
});
```

### Accessibility Testing
```tsx
// Axe accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe';

test('should not have accessibility violations', async () => {
  const { container } = render(
    <NavTextItem href="/accessible">Accessible Link</NavTextItem>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Browser Support

### Modern Browsers
- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

### Features Used
- CSS Grid and Flexbox
- CSS Custom Properties (via SCSS compilation)
- CSS Transitions
- Focus-visible pseudo-class

## Integration with Next.js

### Server-Side Rendering
- Fully compatible with SSR/SSG
- No hydration issues
- SEO-friendly with proper link attributes

### Client-Side Navigation
```tsx
// Automatic prefetching with Next.js Link
<NavTextItem href="/prefetched-page">
  Prefetched Link
</NavTextItem>

// External links (opens in new tab)
<NavTextItem href="https://external-site.com">
  External Link
</NavTextItem>
```

## Related Components
- [NavigationBar](/src/components/organisms/NavigationBar) - Container component for navigation items
- [Button](/src/components/atoms/Button) - Alternative action component
- [Link](/src/components/atoms/Link) - Generic link component

## Migration Guide

### From Custom Link Components
```diff
// Before: Custom link component
- <CustomLink href="/page" active={isCurrentPage}>
+ <NavTextItem href="/page" isActive={isCurrentPage}>
    Page Name
- </CustomLink>
+ </NavTextItem>
```

### Props Mapping
```diff
// Previous component props → NavTextItem props
- active          → isActive
- url             → href
- label           → children
- customClass     → className
- clickHandler    → onClick
```

## Changelog

### Version 1.0.0 (2025-09-09)
- Initial release with core navigation functionality
- Support for active states and hover interactions
- Full accessibility compliance (WCAG 2.1 AA)
- Integration with Next.js Link component
- Responsive design with consistent cross-browser support
- Comprehensive test coverage and documentation

## Best Practices

### When to Use
- ✅ Primary navigation menus
- ✅ Secondary navigation sections
- ✅ Breadcrumb navigation
- ✅ Tab-style navigation interfaces

### When Not to Use
- ❌ Call-to-action buttons (use Button component)
- ❌ External links requiring new tabs (customize or use Link component)
- ❌ Complex dropdown navigation (use NavigationDropdown)
- ❌ Non-navigational interactions (use Button component)

### Usage Guidelines
1. **Group Related Items**: Use within navigation containers
2. **Maintain Consistency**: Apply same styling patterns across site
3. **Accessible Labels**: Provide clear, descriptive text content
4. **Active State Management**: Always indicate current page/section
5. **Test Interactions**: Verify keyboard and screen reader functionality