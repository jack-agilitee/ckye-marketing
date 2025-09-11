# NavigationHeader

## Overview
A responsive navigation header component that provides the main site navigation with logo, navigation links, and call-to-action buttons. Features a mobile-friendly hamburger menu that transforms into a full overlay menu on smaller screens. The component is designed to be sticky and provides smooth transitions between desktop and mobile layouts.

## Figma Reference
- **Design URL**: [NavigationHeader in Figma](https://figma.com/file/...)
- **Last Updated**: 2025-09-11
- **Designer**: CKYE Design Team

## Installation
```bash
import NavigationHeader from '@/components/organisms/NavigationHeader/NavigationHeader';
```

## Basic Usage
```tsx
import NavigationHeader from '@/components/organisms/NavigationHeader/NavigationHeader';

function App() {
  return (
    <div>
      <NavigationHeader />
      {/* Rest of your app */}
    </div>
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | - | No | Additional CSS classes to apply to the header |

## Examples

### Basic Implementation
```tsx
<NavigationHeader />
```

### With Custom Styling
```tsx
<NavigationHeader className="custom-header-class" />
```

## Component Structure

### Desktop Layout (≥768px)
- **Logo**: Left-aligned CKYE logo (120x40px)
- **Navigation**: Center-aligned navigation links (Product, Enterprise, Contact)
- **CTA Buttons**: Right-aligned Log In and Sign Up buttons
- **Mobile Toggle**: Hidden on desktop

### Mobile Layout (<768px)
- **Logo**: Left-aligned CKYE logo
- **Navigation**: Hidden, replaced by mobile menu
- **CTA Buttons**: Hidden, moved to mobile menu
- **Mobile Toggle**: Visible hamburger/close icon button

## Navigation Items

### Desktop Navigation Links
- **Product**: Links to `#product` section
- **Enterprise**: Links to `#enterprise` section
- **Contact**: Links to `#contact` section

### CTA Buttons
- **Log In**: Secondary button style with transparent background
- **Sign Up**: Primary button style with white background

## Responsive Behavior

### Desktop (≥768px)
- Full horizontal layout with all elements visible
- Logo on left, navigation centered, CTAs on right
- Sticky positioning at top of viewport
- Horizontal navigation menu with hover effects

### Tablet (600px - 767px)
- Mobile layout activated
- Hamburger menu replaces desktop navigation
- Logo remains visible, CTAs hidden until menu opens

### Mobile (<600px)
- Compact header with logo and hamburger menu
- Mobile menu overlay covers full width
- Vertical navigation list in mobile menu
- CTA buttons stacked vertically in mobile menu

## Mobile Menu Behavior

### Menu Toggle
- **Closed State**: Shows hamburger icon (`/hamburger.svg`)
- **Open State**: Shows close icon (`/close.svg`)
- **Animation**: Smooth icon transition when toggling

### Menu Content
```tsx
// Mobile menu structure when open
<div className="navigation-header__mobile-menu">
  <nav className="navigation-header__mobile-nav">
    <ul className="navigation-header__mobile-nav-list">
      <li><a href="#product">Product</a></li>
      <li><a href="#enterprise">Enterprise</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <div className="navigation-header__mobile-cta">
      <button>Log In</button>
      <button className="--primary">Sign Up</button>
    </div>
  </nav>
</div>
```

### Auto-Close Behavior
- Menu automatically closes when any navigation link is clicked
- Menu automatically closes when any CTA button is clicked
- Manual close via close icon button

## Accessibility

### Keyboard Navigation
- `Tab`: Navigate through focusable elements (logo, nav links, buttons)
- `Enter`/`Space`: Activate buttons and links
- `Escape`: Close mobile menu (when implemented)

### ARIA Properties
- `aria-label`: Dynamic label for mobile toggle ("Open menu" / "Close menu")
- `aria-expanded`: Indicates mobile menu state (true/false)
- `role="navigation"`: Semantic navigation landmark

### Screen Reader Support
```tsx
<button
  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={isMobileMenuOpen}
>
  {/* Icon content */}
</button>
```

### Focus Management
- Visible focus indicators on all interactive elements
- Focus styles follow design system standards
- Logical tab order throughout component

## States

### Default State
- Desktop: All navigation elements visible and interactive
- Mobile: Logo and hamburger menu visible

### Mobile Menu Open
- Hamburger icon changes to close icon
- Mobile menu overlay appears below header
- Navigation links and CTA buttons accessible

### Hover States
- **Navigation Links**: Background highlight and color change
- **CTA Buttons**: Background and color transitions
- **Mobile Toggle**: Subtle background highlight

### Focus States
- All interactive elements have visible focus indicators
- Focus styles consistent with design system

## Styling Architecture

### SCSS Module Structure
```scss
.navigation-header {
  // Main header container
  
  &__container {
    // Flex layout container
  }
  
  &__logo {
    // Logo positioning
  }
  
  &__nav {
    // Desktop navigation
  }
  
  &__cta {
    // Desktop CTA buttons
  }
  
  &__mobile-toggle {
    // Mobile hamburger button
  }
  
  &__mobile-menu {
    // Mobile menu overlay
  }
}
```

### Design Tokens Used
- **Colors**: `$color-grey-800`, `$color-grey-600`, `$color-grey-200`, `$color-white`
- **Spacing**: `$spacing-sm`, `$spacing-md`, `$spacing-lg`, `$spacing-xl`
- **Typography**: `$font-family-inter`, `$font-weight-medium`
- **Borders**: `$border-radius-lg`, `$border-radius-xl`
- **Transitions**: `$transition-colors`

## Testing

### Test IDs
```tsx
// Add test IDs for testing
<header data-testid="navigation-header">
  <button data-testid="mobile-menu-toggle">
  <nav data-testid="desktop-navigation">
  <div data-testid="mobile-menu">
```

### Testing Examples
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import NavigationHeader from './NavigationHeader';

test('renders navigation header', () => {
  render(<NavigationHeader />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
});

test('toggles mobile menu', () => {
  render(<NavigationHeader />);
  const toggleButton = screen.getByLabelText('Open menu');
  
  fireEvent.click(toggleButton);
  expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
});

test('closes mobile menu when nav link clicked', () => {
  render(<NavigationHeader />);
  const toggleButton = screen.getByLabelText('Open menu');
  
  fireEvent.click(toggleButton);
  const productLink = screen.getByText('Product');
  fireEvent.click(productLink);
  
  expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
});
```

## Performance Considerations

### Bundle Size
- **Component**: ~2.1 KB (minified)
- **With styles**: ~3.8 KB (minified)

### Optimization Features
- Uses Next.js Image component for optimized logo loading
- Priority loading for logo image
- Conditional rendering of mobile menu (not hidden with CSS)
- Efficient state management with minimal re-renders

### Best Practices
- Sticky positioning uses `position: sticky` for better performance
- Hover effects use CSS transitions, not JavaScript
- Mobile menu uses conditional rendering to avoid DOM bloat

## Browser Support

### Supported Browsers
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile Safari 14+
- Chrome Mobile 88+

### Fallbacks
- CSS Grid with flexbox fallback
- Modern CSS features with appropriate prefixes
- Graceful degradation for older browsers

## Integration Examples

### With Layout Component
```tsx
import NavigationHeader from '@/components/organisms/NavigationHeader/NavigationHeader';

export default function Layout({ children }) {
  return (
    <>
      <NavigationHeader />
      <main>{children}</main>
    </>
  );
}
```

### With Custom Styling
```tsx
// Apply custom styles while maintaining functionality
<NavigationHeader className="homepage-header" />
```

```scss
// Custom styles
.homepage-header {
  background: linear-gradient(90deg, #000, #333);
  
  .navigation-header__container {
    max-width: 1400px;
  }
}
```

### With Custom Navigation Items
```tsx
// Note: Current implementation has hardcoded nav items
// Future enhancement could accept navigation items as props
interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

interface NavigationHeaderProps {
  className?: string;
  navigationItems?: NavigationItem[];
  ctaButtons?: {
    primary: { label: string; onClick: () => void };
    secondary: { label: string; onClick: () => void };
  };
}
```

## Future Enhancements

### Potential Improvements
1. **Configurable Navigation**: Accept navigation items as props
2. **Custom CTA Actions**: Support for custom button handlers
3. **Theme Support**: Light/dark theme variations
4. **Dropdown Menus**: Support for nested navigation
5. **Search Integration**: Optional search bar component
6. **User Avatar**: Support for authenticated user display

### Breaking Changes Considerations
- Navigation items currently hardcoded - future versions may require props
- CTA buttons use dummy handlers - may need real navigation logic
- Logo path is hardcoded - may need configurable logo prop

## Related Components
- [Button](/docs/components/atoms/Button) - CTA button styling reference
- [Logo](/docs/components/atoms/Logo) - Logo component alternative
- [MobileMenu](/docs/components/molecules/MobileMenu) - Potential extracted mobile menu

## Dependencies

### External Dependencies
- `react`: State management and component lifecycle
- `next/image`: Optimized image loading for logo and icons

### Internal Dependencies
- `NavigationHeader.module.scss`: Component styles
- `/public/logo.png`: Company logo image
- `/public/hamburger.svg`: Mobile menu open icon
- `/public/close.svg`: Mobile menu close icon

## Changelog

### Version 1.0.0 (2025-09-11)
- Initial implementation with responsive design
- Mobile hamburger menu with toggle functionality
- Sticky positioning and accessibility features
- SCSS module with BEM methodology
- Next.js Image optimization integration
- Full keyboard navigation support