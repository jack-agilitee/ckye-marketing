# FeatureSection

## Overview
The FeatureSection component is a flexible content display organism that presents information with an accompanying image in two distinct layout variations. It's designed to create engaging content sections with optimal visual hierarchy and responsive behavior across all device sizes.

## Figma Reference
- **Design URL**: [FeatureSection Component](https://figma.com/file/...)
- **Last Updated**: 2025-01-09
- **Designer**: CKYE Design Team

## Installation
```tsx
import FeatureSection from '@/components/organisms/FeatureSection/FeatureSection';
```

## Basic Usage
```tsx
import FeatureSection from '@/components/organisms/FeatureSection/FeatureSection';

function Example() {
  return (
    <FeatureSection
      heading="Innovative Solutions"
      bodyText="Discover cutting-edge technologies that transform your business operations and drive sustainable growth."
      image={{
        src: "/images/feature-innovation.jpg",
        alt: "Modern technology solutions in action"
      }}
      layout="image-left"
    />
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `heading` | `string` | - | Yes | The main heading text displayed in the content section |
| `bodyText` | `string` | - | Yes | The body text that provides detailed description |
| `image` | `{ src: string, alt: string }` | - | Yes | Image object containing source URL and alt text |
| `layout` | `'image-left' \| 'image-right'` | - | Yes | Controls the layout direction and image position |
| `className` | `string` | - | No | Additional CSS classes for custom styling |

## Examples

### Image Left Layout
```tsx
<FeatureSection
  heading="Advanced Analytics"
  bodyText="Leverage powerful data insights to make informed decisions and optimize your business performance across all channels."
  image={{
    src: "/images/analytics-dashboard.jpg",
    alt: "Analytics dashboard showing business metrics"
  }}
  layout="image-left"
/>
```

### Image Right Layout
```tsx
<FeatureSection
  heading="Seamless Integration"
  bodyText="Connect all your business tools and workflows in one unified platform designed for efficiency and scalability."
  image={{
    src: "/images/integration-workflow.jpg",
    alt: "Workflow integration diagram"
  }}
  layout="image-right"
/>
```

### With Custom Styling
```tsx
<FeatureSection
  heading="Custom Solutions"
  bodyText="Tailored solutions that adapt to your unique business requirements and industry-specific challenges."
  image={{
    src: "/images/custom-solutions.jpg",
    alt: "Custom business solutions interface"
  }}
  layout="image-left"
  className="custom-feature-section"
/>
```

### Full Implementation Example
```tsx
import FeatureSection from '@/components/organisms/FeatureSection/FeatureSection';

export default function FeaturesPage() {
  const features = [
    {
      heading: "Real-time Collaboration",
      bodyText: "Work together seamlessly with your team using our advanced real-time collaboration tools and shared workspaces.",
      image: {
        src: "/images/collaboration-team.jpg",
        alt: "Team collaborating in real-time on projects"
      },
      layout: "image-left" as const
    },
    {
      heading: "Enterprise Security",
      bodyText: "Enterprise-grade security measures protect your data with end-to-end encryption and compliance standards.",
      image: {
        src: "/images/security-shield.jpg",
        alt: "Security shield protecting enterprise data"
      },
      layout: "image-right" as const
    }
  ];

  return (
    <main>
      {features.map((feature, index) => (
        <FeatureSection
          key={index}
          heading={feature.heading}
          bodyText={feature.bodyText}
          image={feature.image}
          layout={feature.layout}
        />
      ))}
    </main>
  );
}
```

## Layout Variants

### Image Left (`image-left`)
- **Mobile**: Image appears above content (stacked vertically)
- **Tablet/Desktop**: Image positioned on the left side of the content
- **Use Case**: Ideal for introducing new features or primary content

### Image Right (`image-right`)
- **Mobile**: Image appears above content (stacked vertically)
- **Tablet/Desktop**: Image positioned on the right side of the content
- **Use Case**: Perfect for secondary features or alternating content sections

## Responsive Behavior

### Mobile (< 768px)
- **Layout**: Vertical stack with image above content
- **Image**: 100% width with aspect ratio 544:432
- **Typography**: 
  - Heading: 32px, -0.64px letter-spacing
  - Body: 16px, -0.08px letter-spacing
- **Spacing**: 40px horizontal padding, 64px vertical padding

### Tablet (768px - 1024px)
- **Layout**: Horizontal with image and content side by side
- **Image**: Fixed dimensions 304px × 241px
- **Typography**:
  - Heading: 40px, -0.8px letter-spacing
  - Body: 18px, -0.09px letter-spacing
- **Spacing**: 64px padding on all sides

### Desktop (> 1024px)
- **Layout**: Horizontal with image and content side by side
- **Image**: Fixed dimensions 470px × 374px
- **Typography**:
  - Heading: 56px, -1.12px letter-spacing
  - Body: 24px, -0.12px letter-spacing
- **Spacing**: 64px padding on all sides

## Accessibility

### Semantic HTML
- Uses semantic `<section>` element for proper document structure
- Heading hierarchy with `<h2>` for proper content organization
- Paragraph `<p>` element for body text content

### Image Accessibility
- **Required Alt Text**: All images must include descriptive alt text
- **Next.js Image**: Uses optimized Next.js Image component for performance
- **Object Fit**: Images use `object-fit: cover` for consistent aspect ratios

### Keyboard Navigation
- Component is non-interactive, so no keyboard navigation required
- Content is fully accessible to screen readers
- Proper reading order maintained across all layouts

### ARIA Properties
```tsx
// Example with enhanced accessibility
<FeatureSection
  heading="Accessible Feature"
  bodyText="This feature section includes proper ARIA labeling for screen readers."
  image={{
    src: "/images/accessible-feature.jpg",
    alt: "Detailed description of the feature visualization including key elements and context"
  }}
  layout="image-left"
/>
```

### Screen Reader Support
- Content follows logical reading order
- Image alt text provides meaningful context
- Typography hierarchy is clearly defined
- Color contrast meets WCAG 2.1 AA standards

## Testing

### Test IDs
```tsx
<FeatureSection
  heading="Test Feature"
  bodyText="Feature section for testing purposes"
  image={{
    src: "/test-image.jpg",
    alt: "Test image description"
  }}
  layout="image-left"
  className="test-feature-section"
  data-testid="feature-section"
/>
```

### Testing Examples
```tsx
import { render, screen } from '@testing-library/react';
import FeatureSection from '@/components/organisms/FeatureSection/FeatureSection';

describe('FeatureSection', () => {
  const mockProps = {
    heading: 'Test Heading',
    bodyText: 'Test body text content',
    image: {
      src: '/test-image.jpg',
      alt: 'Test image alt text'
    },
    layout: 'image-left' as const
  };

  test('renders with correct content', () => {
    render(<FeatureSection {...mockProps} />);
    
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Heading');
    expect(screen.getByText('Test body text content')).toBeInTheDocument();
    expect(screen.getByAltText('Test image alt text')).toBeInTheDocument();
  });

  test('applies correct layout class', () => {
    render(<FeatureSection {...mockProps} layout="image-right" />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveClass('image-right');
  });

  test('accepts custom className', () => {
    render(<FeatureSection {...mockProps} className="custom-class" />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveClass('custom-class');
  });
});
```

## Performance Considerations

### Bundle Size
- **Component**: ~2.1 KB (minified)
- **With styles**: ~3.8 KB (minified)
- **Dependencies**: Next.js Image component

### Optimization Tips
- **Image Optimization**: Uses Next.js Image component for automatic optimization
- **Lazy Loading**: Images load when entering viewport (Next.js default)
- **Responsive Images**: Different image sizes served based on screen size
- **CSS Modules**: Scoped styles prevent style conflicts and enable tree shaking

### Next.js Image Configuration
```tsx
// Recommended image sizes for optimal performance
const imageProps = {
  src: "/images/feature.jpg",
  alt: "Feature description",
  sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 304px, 470px"
};
```

## Content Guidelines

### Heading Best Practices
- **Length**: Keep headings concise (2-8 words ideal)
- **Clarity**: Use action-oriented language
- **Hierarchy**: Ensure logical content flow
- **SEO**: Include relevant keywords naturally

### Body Text Guidelines
- **Length**: 1-3 sentences for optimal readability
- **Tone**: Match brand voice and audience
- **Value**: Clearly communicate benefits
- **Scanability**: Use clear, descriptive language

### Image Requirements
- **Format**: JPG, PNG, or WebP
- **Resolution**: Minimum 940px width for desktop display
- **Aspect Ratio**: Maintain consistent ratios across sections
- **Alt Text**: Descriptive and contextual (not just filename)

## Related Components
- [ContentSection](/src/components/organisms/ContentSection) - Text-only content sections
- [HeroSection](/src/components/organisms/HeroSection) - Primary page headers
- [ImageGallery](/src/components/organisms/ImageGallery) - Multi-image displays

## Changelog

### Version 1.0.0 (2025-01-09)
- Initial release with image-left and image-right layouts
- Responsive design for mobile, tablet, and desktop
- Next.js Image component integration
- SCSS modules with BEM methodology
- Full accessibility compliance
- Comprehensive TypeScript interface