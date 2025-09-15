# Hero

## Overview
The Hero component is the primary landing section of the CKYE marketing site, designed to capture user attention and communicate the core value proposition. It features responsive design with optimized images, a compelling headline, descriptive text, and a prominent call-to-action button. The component follows accessibility best practices and provides an optimal user experience across all devices.

## Figma Reference
- **Design URL**: [Hero Section in Figma](https://figma.com/file/...)
- **Last Updated**: 2025-01-15
- **Designer**: CKYE Design Team

## Installation
```bash
import Hero from '@/components/Hero/Hero';
```

## Basic Usage
```tsx
import Hero from '@/components/Hero/Hero';

function LandingPage() {
  return (
    <div>
      <Hero />
      {/* Other page content */}
    </div>
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | `''` | No | Additional CSS classes to apply to the hero section |
| `tagline` | `string` | `'/ sky /'` | No | Tagline text displayed above the heading |
| `heading` | `string` | `'Ckye is a Governed Orchestration Layer for AI Coding Agents'` | No | Main heading text |
| `description` | `string` | `'Ckye unlocks EBITA your current stack can't reach, compressing timelines, cutting unit costs, and avoiding rework.'` | No | Description text below the heading |
| `ctaText` | `string` | `'Get Ckye'` | No | Text for the call-to-action button |
| `ctaAriaLabel` | `string` | `'Get started with Ckye'` | No | Accessible label for the CTA button |
| `onCtaClick` | `() => void` | `undefined` | No | Callback function when CTA button is clicked |
| `images` | `HeroImageSet` | See below | No | Images for different breakpoints |

### HeroImageSet Type
```typescript
interface HeroImageSet {
  desktop: string;  // Desktop image source path
  tablet: string;   // Tablet image source path  
  mobile: string;   // Mobile image source path
  alt: string;      // Alt text for images
}
```

Default images:
```typescript
{
  desktop: '/content/hero--desktop.png',
  tablet: '/content/hero--tablet.png',
  mobile: '/content/hero--mobile.png',
  alt: 'Ckye AI coding agents interface showing code orchestration and governance features'
}

## Examples

### Default Usage
```tsx
<Hero />
```

### With Custom Styling
```tsx
<Hero className="custom-hero-styles" />
```

### With Custom Content
```tsx
<Hero 
  tagline="/ innovation /"
  heading="Transform Your Development Process"
  description="Accelerate delivery with AI-powered coding agents"
  ctaText="Start Free Trial"
  ctaAriaLabel="Start your free trial"
/>
```

### With Click Handler
```tsx
<Hero 
  onCtaClick={() => {
    console.log('CTA clicked');
    // Navigate to signup page
    router.push('/signup');
  }}
/>
```

### With Custom Images
```tsx
<Hero 
  images={{
    desktop: '/images/hero-desktop.jpg',
    tablet: '/images/hero-tablet.jpg',
    mobile: '/images/hero-mobile.jpg',
    alt: 'Custom hero image description'
  }}
/>
```

### Fully Customized
```tsx
<Hero 
  className="landing-hero"
  tagline="/ enterprise ready /"
  heading="Scale Your Engineering Team with AI"
  description="Deploy governed AI agents that deliver enterprise-grade code"
  ctaText="Book a Demo"
  ctaAriaLabel="Book a product demonstration"
  onCtaClick={handleDemoRequest}
  images={{
    desktop: '/assets/enterprise-hero-lg.png',
    tablet: '/assets/enterprise-hero-md.png',
    mobile: '/assets/enterprise-hero-sm.png',
    alt: 'Enterprise AI coding platform dashboard'
  }}
/>
```

## Content Structure

### Tagline
- **Text**: "/ sky /"
- **Purpose**: Brand identifier and visual element
- **Styling**: Primary color, bold weight

### Main Heading
- **Text**: "Ckye is a Governed Orchestration Layer for AI Coding Agents"
- **Element**: `<h1>` with id "hero-heading"
- **Purpose**: Primary page heading for SEO and accessibility

### Description
- **Text**: "Ckye unlocks EBITA your current stack can't reach, compressing timelines, cutting unit costs, and avoiding rework."
- **Purpose**: Value proposition explanation

### Call-to-Action
- **Text**: "Get Ckye"
- **Type**: Secondary variant button
- **Action**: Primary conversion element

## Responsive Behavior

### Mobile (< 768px)
- **Image**: `/content/hero--mobile.png` (295x312px)
- **Layout**: Single column, stacked content
- **Padding**: Optimized for mobile touch targets
- **Typography**: Responsive font sizes and line heights

### Tablet (768px - 1023px)
- **Image**: `/content/hero--tablet.png`
- **Layout**: Enhanced spacing and typography
- **Padding**: Increased horizontal padding

### Desktop (≥ 1024px)
- **Image**: `/content/hero--desktop.png`
- **Layout**: Maximum width container (1280px)
- **Typography**: Largest font sizes for impact
- **Spacing**: Optimal desktop spacing

## Image Optimization

### Responsive Images
The Hero component uses the HTML `<picture>` element with multiple source sets:

```tsx
<picture className={styles.hero__image}>
  <source 
    media="(min-width: 1024px)" 
    srcSet="/content/hero--desktop.png"
  />
  <source 
    media="(min-width: 768px)" 
    srcSet="/content/hero--tablet.png"
  />
  <Image
    src="/content/hero--mobile.png"
    alt="Ckye AI coding agents interface showing code orchestration and governance features"
    width={295}
    height={312}
    priority
    className={styles.hero__img}
  />
</picture>
```

### Performance Features
- **Next.js Image**: Automatic optimization and lazy loading
- **Priority Loading**: Images marked as priority for above-the-fold content
- **Format Optimization**: Automatic WebP/AVIF serving when supported
- **Responsive Sizing**: Different images for different breakpoints

## Accessibility

### Semantic HTML
- Uses `<section>` with proper ARIA labeling
- Semantic heading hierarchy with `<h1>`
- Descriptive alt text for images
- Proper button semantics

### ARIA Properties
- `aria-labelledby="hero-heading"`: Section labeled by main heading
- `aria-label` on CTA button for clear action description

### Keyboard Navigation
- **Tab**: Focus moves to CTA button
- **Enter/Space**: Activates the CTA button
- **Screen Reader**: All content is properly announced

### WCAG 2.1 AA Compliance
- **Color Contrast**: All text meets minimum contrast ratios
- **Focus Indicators**: Clear focus outlines on interactive elements
- **Touch Targets**: Minimum 44px touch target size on buttons
- **Alternative Text**: Descriptive alt text for images

## Styling

### SCSS Modules
The component uses SCSS modules with BEM methodology:

```scss
.hero {
  // Main container styles
  
  &__container {
    // Layout container
  }
  
  &__content {
    // Content wrapper
  }
  
  &__text {
    // Text content group
  }
  
  &__tagline {
    // Brand tagline
  }
  
  &__heading {
    // Main headline
  }
  
  &__description {
    // Description text
  }
  
  &__cta {
    // Call-to-action button
  }
  
  &__imageWrapper {
    // Image container
  }
  
  &__image {
    // Picture element
  }
  
  &__img {
    // Next.js Image component
  }
}
```

### CSS Variables Used
- `$color-background`: Section background
- `$color-primary`: Tagline and focus colors
- `$color-text-primary`: Main heading color
- `$color-text-secondary`: Description text color
- `$spacing-*`: Consistent spacing scale
- `$font-family-inter`: Typography family
- `$transition-colors`: Smooth transitions

## Dependencies

### Required Components
- `Button` from `@/components/atoms/Button/Button`

### Next.js Features
- `next/image` for optimized image loading

### Styling Dependencies
- SCSS modules support
- Design system variables and mixins from:
  - `@/styles/variables`
  - `@/styles/mixins`

## Performance Considerations

### Bundle Size
- **Component**: ~2.5 KB (minified)
- **With styles**: ~4.2 KB (minified)
- **Images**: Optimized per breakpoint

### Optimization Features
- Priority loading for hero image
- Responsive image srcsets
- CSS-in-JS with SCSS modules
- Minimal JavaScript footprint

### Loading Strategy
- Hero image loads with `priority` flag
- Above-the-fold optimization
- Progressive enhancement

## SEO Features

### Schema Markup Ready
The component structure supports adding JSON-LD schema:

```tsx
// Can be extended with structured data
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ckye",
  "description": "Governed Orchestration Layer for AI Coding Agents"
}
</script>
```

### Meta Information
- Main heading serves as primary page title context
- Description provides page summary
- Image alt text contributes to SEO context

## Testing

### Test IDs
```tsx
// Component can be tested using aria-labelledby
const heroSection = screen.getByRole('region', { name: /ckye is a governed/i });
const ctaButton = screen.getByRole('button', { name: /get started with ckye/i });
```

### Testing Examples
```tsx
import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero/Hero';

describe('Hero Component', () => {
  test('renders hero section with heading', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/ckye is a governed orchestration layer/i)).toBeInTheDocument();
  });

  test('includes call-to-action button', () => {
    render(<Hero />);
    expect(screen.getByRole('button', { name: /get started with ckye/i })).toBeInTheDocument();
  });

  test('displays responsive hero image', () => {
    render(<Hero />);
    const image = screen.getByAltText(/ckye ai coding agents interface/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/content/hero--mobile.png');
  });

  test('applies custom className', () => {
    render(<Hero className="custom-class" />);
    const hero = screen.getByRole('region');
    expect(hero).toHaveClass('custom-class');
  });
});
```

## Browser Support

### Modern Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Progressive Enhancement
- Fallback to mobile image if picture element not supported
- CSS Grid with flexbox fallbacks
- Modern CSS with appropriate fallbacks

## Integration Guidelines

### Page Integration
```tsx
import Hero from '@/components/Hero/Hero';

export default function HomePage() {
  return (
    <main>
      <Hero />
      {/* Additional page sections */}
    </main>
  );
}
```

### Layout Considerations
- Designed as a full-width section
- Self-contained with internal spacing
- Works within any page layout container

## Related Components
- [Button](/src/components/atoms/Button) - CTA button dependency
- [Header](/src/components/organisms/Header) - Often used together
- [Footer](/src/components/organisms/Footer) - Page layout companion

## Changelog

### Version 1.0.0 (2025-01-15)
- Initial Hero component implementation
- Responsive image optimization with picture element
- SCSS modules with BEM methodology
- Full accessibility compliance (WCAG 2.1 AA)
- Next.js Image component integration
- Mobile-first responsive design

### Future Enhancements
- Planned animation effects for enhanced user engagement
- A/B testing support for different headlines
- Dynamic content management integration
- Video background option