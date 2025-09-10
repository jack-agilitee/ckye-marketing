# Metrics

## Overview
The Metrics component displays statistical data in a visually appealing format with gradient text effects and responsive design. It supports two display variants: single-line metrics showing one value each, or double-line metrics showing both primary and secondary values for each metric.

## Installation
```bash
import { Metrics } from '@/components/molecules/Metrics';
```

## Basic Usage
```tsx
import { Metrics } from '@/components/molecules/Metrics';

const metricsData = [
  {
    title: "Active Users",
    value: "50K+",
    description: "Monthly active users"
  },
  {
    title: "Projects Completed",
    value: "1,000+",
    description: "Successfully delivered projects"
  },
  {
    title: "Client Satisfaction",
    value: "98%",
    description: "Customer satisfaction rate"
  }
];

function Example() {
  return (
    <Metrics
      variant="single"
      metrics={metricsData}
      gradientColor="blue"
    />
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `metrics` | `MetricData[]` | - | Yes | Array of metric data to display |
| `variant` | `'single' \| 'double'` | `'single'` | No | Display variant - single or double line values |
| `gradientColor` | `'blue' \| 'orange' \| string` | `'orange'` | No | Gradient color for values (predefined or custom hex) |
| `className` | `string` | `''` | No | Additional CSS classes |

## TypeScript Interfaces

```typescript
export interface MetricData {
  /**
   * Title displayed above the metric value
   * @example "Active Users"
   */
  title: string;
  
  /**
   * Primary metric value
   * @example "50K+"
   */
  value: string;
  
  /**
   * Secondary metric value (only displayed in double variant)
   * @example "2,500"
   */
  secondaryValue?: string;
  
  /**
   * Description text displayed below the values
   * @example "Monthly active users"
   */
  description: string;
}

export interface MetricsProps {
  /**
   * Array of metrics to display (typically 3 metrics)
   */
  metrics: MetricData[];
  
  /**
   * Display variant for metric values
   * @default 'single'
   */
  variant?: 'single' | 'double';
  
  /**
   * Gradient color for metric values
   * - 'blue': White to blue gradient
   * - 'orange': White to orange gradient  
   * - Custom hex color: White to custom color gradient
   * @default 'orange'
   */
  gradientColor?: 'blue' | 'orange' | string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
```

## Examples

### Single Line Variant (Default)
```tsx
<Metrics
  variant="single"
  metrics={[
    {
      title: "Revenue Growth",
      value: "150%",
      description: "Year over year increase"
    },
    {
      title: "Team Members",
      value: "25+",
      description: "Experienced professionals"
    },
    {
      title: "Awards Won",
      value: "12",
      description: "Industry recognition"
    }
  ]}
  gradientColor="blue"
/>
```

### Double Line Variant
```tsx
<Metrics
  variant="double"
  metrics={[
    {
      title: "Monthly Users",
      value: "50K",
      secondaryValue: "2,500",
      description: "Active vs New Users"
    },
    {
      title: "Revenue",
      value: "$2.5M",
      secondaryValue: "$150K",
      description: "Total vs Monthly"
    },
    {
      title: "Satisfaction",
      value: "98%",
      secondaryValue: "4.9/5",
      description: "Rating vs Score"
    }
  ]}
  gradientColor="orange"
/>
```

### Custom Gradient Color
```tsx
<Metrics
  variant="single"
  metrics={metricsData}
  gradientColor="#FF6B35"
/>
```

### With Custom Styling
```tsx
<Metrics
  variant="single"
  metrics={metricsData}
  gradientColor="blue"
  className="custom-metrics"
/>
```

## Variants

### Display Variants

#### Single Line
- **Purpose**: Clean, focused display of key metrics
- **Typography**: Large primary values with descriptive text
- **Best for**: Simple KPIs, achievement numbers, statistics

#### Double Line  
- **Purpose**: Compare related metrics or show primary/secondary data
- **Typography**: Smaller primary values with secondary values below
- **Best for**: Before/after comparisons, total vs partial metrics, multi-dimensional data

### Color Variants

#### Blue Gradient
- **Style**: White to blue gradient text
- **Use case**: Professional, corporate, trust-focused metrics
- **CSS**: `linear-gradient(180deg, #FFF 0%, [primary-blue] 100%)`

#### Orange Gradient (Default)
- **Style**: White to orange gradient text  
- **Use case**: Energetic, creative, growth-focused metrics
- **CSS**: `linear-gradient(180deg, #FFF 0%, [orange-color] 100%)`

#### Custom Gradient
- **Style**: White to custom color gradient
- **Use case**: Brand-specific styling, themed sections
- **CSS**: `linear-gradient(180deg, #FFF 0%, [custom-hex] 100%)`

## Responsive Behavior

### Mobile (< 768px)
- **Layout**: Vertical stacking with full width items
- **Typography**: 
  - Title: 18px
  - Primary value: 64px (single) / 48px (double)
  - Secondary value: 32px
  - Description: 16px (single) / 12px (double)
- **Spacing**: Reduced padding and gaps
- **Padding**: 64px 24px

### Tablet (768px - 1024px)
- **Layout**: Horizontal row with equal flex items
- **Typography**:
  - Title: 24px (single) / 18px (double)
  - Primary value: 80px (single) / 48px (double)
  - Secondary value: 48px
  - Description: 18px (single) / 12px (double)
- **Spacing**: Medium gaps between items

### Desktop (> 1024px)
- **Layout**: Horizontal row with maximum width container (1440px)
- **Typography**:
  - Title: 32px (single) / 24px (double)
  - Primary value: 100px (single) / 80px (double)
  - Secondary value: 48px
  - Description: 24px
- **Spacing**: Large gaps for optimal readability

## Styling and Customization

### Background
- **Section**: Full viewport height with gradient background
- **Gradient**: Grey gradient from light to dark (#F8F9FA to #1F2937)
- **Centering**: Flexbox centered content vertically and horizontally

### Typography
- **Font Family**: Inter (system font stack)
- **Gradient Text**: Uses `background-clip: text` for gradient effects
- **Letter Spacing**: Responsive letter spacing for optimal readability
- **Line Height**: Tight line height for large numbers

### Layout Structure
```scss
.metrics {
  // Full height section with gradient background
  &__container {
    // Max-width container with auto margins
    &__row {
      // Responsive flex layout (column → row)
      &__item {
        // Equal flex items with center alignment
        &__title { /* Metric title */ }
        &__values {
          &__value { /* Primary value with gradient */ }
          &__value--secondary { /* Secondary value */ }
        }
        &__description { /* Descriptive text */ }
      }
    }
  }
}
```

### Custom CSS Variables
```css
.metrics__value {
  background: var(--gradient-custom, linear-gradient(180deg, #FFF 0%, #FF6B35 100%));
}
```

## Accessibility

### Semantic HTML
- Uses `<section>` for the main container
- Uses `<h3>` for metric titles (proper heading hierarchy)
- Uses `<p>` elements for values and descriptions

### Screen Reader Support
```tsx
<section aria-label="Key performance metrics">
  <h3>Active Users</h3>
  <p aria-label="50 thousand plus active users">50K+</p>
  <p>Monthly active users</p>
</section>
```

### Color and Contrast
- **Background**: High contrast dark gradient background
- **Text**: Light colored text (grey-200) for readability
- **Gradients**: Maintains sufficient contrast with white-to-color gradients
- **Focus**: Keyboard navigation support for interactive elements

### Responsive Text Scaling
- Uses relative units and responsive typography
- Scales appropriately with system font size preferences
- Maintains readability across all device sizes

## Performance Considerations

### Bundle Size
- **Component**: ~2.1 KB (minified)
- **With styles**: ~3.8 KB (minified + gzipped)
- **Dependencies**: React only (no external libraries)

### Optimization Tips
```tsx
// Memoize static metric data
const metricsData = useMemo(() => [
  { title: "Users", value: "50K+", description: "Active monthly" }
], []);

// Lazy load for below-the-fold sections
const LazyMetrics = lazy(() => import('./Metrics'));
```

### CSS Performance
- Uses CSS gradients instead of images
- Efficient flexbox layout
- Minimal DOM structure
- CSS custom properties for theming

## Testing

### Test IDs
```tsx
<Metrics 
  data-testid="metrics-section"
  metrics={metricsData}
/>
```

### Testing Examples
```tsx
// Testing with React Testing Library
import { render, screen } from '@testing-library/react';
import { Metrics } from '@/components/molecules/Metrics';

const mockMetrics = [
  {
    title: "Test Metric",
    value: "100",
    description: "Test description"
  }
];

test('renders single variant metrics', () => {
  render(
    <Metrics 
      variant="single" 
      metrics={mockMetrics}
      data-testid="metrics"
    />
  );
  
  expect(screen.getByText('Test Metric')).toBeInTheDocument();
  expect(screen.getByText('100')).toBeInTheDocument();
  expect(screen.getByText('Test description')).toBeInTheDocument();
});

test('renders double variant with secondary values', () => {
  const doubleMetrics = [{
    title: "Users",
    value: "1000",
    secondaryValue: "500",
    description: "Total vs Active"
  }];
  
  render(
    <Metrics 
      variant="double" 
      metrics={doubleMetrics}
    />
  );
  
  expect(screen.getByText('1000')).toBeInTheDocument();
  expect(screen.getByText('500')).toBeInTheDocument();
});

test('applies custom gradient color', () => {
  const { container } = render(
    <Metrics 
      metrics={mockMetrics}
      gradientColor="#FF0000"
    />
  );
  
  const valueElement = container.querySelector('.metrics__value');
  expect(valueElement).toHaveStyle({
    '--gradient-custom': 'linear-gradient(180deg, #FFF 0%, #FF0000 100%)'
  });
});
```

## Usage Guidelines

### Data Structure
- **Metrics Array**: Typically contains 3 metrics for optimal visual balance
- **Values**: Keep consistent format (e.g., all percentages, all with units)
- **Titles**: Keep concise (1-3 words ideal)
- **Descriptions**: Brief explanatory text (3-5 words)

### Content Recommendations
```tsx
// Good: Consistent formatting
const metrics = [
  { title: "Growth", value: "150%", description: "Year over year" },
  { title: "Users", value: "50K+", description: "Active monthly" },
  { title: "Rating", value: "4.9", description: "Customer satisfaction" }
];

// Good: Double variant with related values
const doubleMetrics = [
  { 
    title: "Revenue", 
    value: "$2.5M", 
    secondaryValue: "$150K",
    description: "Total vs Monthly" 
  }
];
```

### Visual Design
- **Spacing**: Component provides full viewport height
- **Background**: Works best on gradient or dark backgrounds
- **Placement**: Typically used in hero sections or feature highlights
- **Context**: Should represent key business metrics or achievements

## Related Components
- [StatCard](/docs/components/atoms/StatCard) - Individual statistic display
- [Hero](/docs/components/organisms/Hero) - Main section layout
- [FeatureGrid](/docs/components/molecules/FeatureGrid) - Alternative data presentation

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Single and double variant support
- Responsive design implementation
- Gradient color variants (blue, orange, custom)
- Full accessibility support
- TypeScript interface definitions