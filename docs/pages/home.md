# Home Page Documentation

## Overview
The home page (`/Users/jack/Documents/Projects/ckye_marketing/ckye_marketing/src/app/page.tsx`) serves as the primary landing page for the CKYE marketing site. It showcases CKYE as a governed orchestration layer for AI coding agents, emphasizing enterprise ROI, cost reduction, and improved development efficiency.

## Page Purpose and Structure

### Primary Goals
- **Lead Generation**: Convert visitors into prospects through compelling value proposition
- **Product Education**: Explain CKYE's role in AI-powered development workflows
- **Trust Building**: Demonstrate credibility through metrics and compatibility indicators
- **SEO Optimization**: Rank for AI coding agents and enterprise AI keywords

### Page Structure
The home page follows a linear narrative structure designed to guide users through the value proposition:

1. **Hero Section** - Primary value proposition and call-to-action
2. **Compatibility Section** - Trust signals showing AI model support
3. **Problem Statement** - Feature section addressing enterprise AI challenges
4. **Key Metrics** - Quantified benefits and ROI metrics
5. **Solution Details** - Additional feature sections with visual support
6. **Comparison Metrics** - Detailed cost and timeline comparisons

## Component Usage and Composition

### Hero Component
```tsx
<Hero
  tagline="/ ckye /"
  heading="Ckye is a Governed Orchestration Layer for AI Coding Agents"
  description="Ckye unlocks EBITA your current stack can't reach, compressing timelines, cutting unit costs, and avoiding rework."
  ctaText="Get Ckye"
  ctaAriaLabel="Get started with Ckye platform"
/>
```

**Purpose**: Primary conversion element with main value proposition
**Props Passed**:
- `tagline`: Brand identifier and pronunciation guide
- `heading`: Main headline explaining product category
- `description`: Value proposition focusing on business benefits
- `ctaText`: Action-oriented button text
- `ctaAriaLabel`: Accessibility-compliant button description

**Default Behavior**: Uses responsive images with mobile-first loading strategy

### CompatibleWith Component
```tsx
<CompatibleWith />
```

**Purpose**: Trust signal showing integration capabilities
**Props Passed**: None (uses internal configuration)
**Data Source**: Static array of AI models (Claude, Gemini, GitHub Copilot)
**Business Logic**:
- Prioritizes first logo for faster loading
- Uses semantic list structure for accessibility
- Displays model compatibility without requiring external API calls

### FeatureSection Components
Three instances showcasing different aspects of the solution:

#### Feature Section 1 - Problem Statement
```tsx
<FeatureSection
  heading="Where is the AI revolution I was promised?"
  bodyText="The reality is enterprises are only one step away from unlocking millions in ROI this budget year, by leveraging the AI tools you already have in place."
  image={{
    src: "/content/feature-ai-revolution.png",
    alt: "AI revolution visualization showing current enterprise AI tools and potential"
  }}
  layout="image-right"
/>
```

#### Feature Section 2 - Solution Approach
```tsx
<FeatureSection
  heading="Where is the AI revolution I was promised?"
  bodyText="The reality is enterprises are only one step away from unlocking millions in ROI this budget year, by leveraging the AI tools you already have in place."
  image={{
    src: "/content/feature-ai-revolution-left.png",
    alt: "Enterprise AI transformation roadmap and implementation strategy"
  }}
  layout="image-left"
/>
```

#### Feature Section 3 - Full Solution
```tsx
<FeatureSection
  heading="Concise Copy goes here"
  bodyText="Ckye unlocks EBITA your current stack can't reach, compressing timelines, cutting unit costs, and avoiding rework."
  image={{
    src: "/content/feature-full-width.png",
    alt: "Comprehensive view of Ckye platform capabilities and benefits"
  }}
  layout="image-right"
/>
```

**Props Structure**:
- `heading`: Section title
- `bodyText`: Descriptive content
- `image.src`: Image file path
- `image.alt`: Descriptive alt text for accessibility
- `layout`: Visual arrangement ("image-left" | "image-right")

### Metrics Components

#### Single Metrics Display
```tsx
<Metrics
  variant="single"
  metrics={[
    {
      title: "OpEx",
      value: "50%",
      description: "Reduction in IT Operating Expenses"
    },
    {
      title: "Time to Market",
      value: "2X",
      description: "Faster compared to out of the box AI alone"
    },
    {
      title: "Code Quality",
      value: "50%",
      description: "Increase in overall code quality vs. non Ckye users"
    }
  ]}
  gradientColor="blue"
/>
```

#### Double Metrics Display (Comparison)
```tsx
<Metrics
  variant="double"
  metrics={[
    {
      title: "Traditional Offshore",
      value: "6 mo",
      secondaryValue: "$1MM",
      description: "7 person offshore team"
    },
    {
      title: "Out-of-the-box AI",
      value: "5 mo",
      secondaryValue: "$850K",
      description: "7 person offshore team using AI"
    },
    {
      title: "With Ckye",
      value: "6 weeks",
      secondaryValue: "$90K",
      description: "2 person onshore team using Ckye"
    }
  ]}
  gradientColor="orange"
/>
```

**Business Logic**:
- **Single variant**: Displays individual benefits
- **Double variant**: Shows comparative analysis (time + cost)
- **Gradient colors**: Visual differentiation (blue for benefits, orange for comparisons)

## SEO Metadata Implementation

### Primary Metadata
```tsx
export const metadata: Metadata = {
  title: 'CKYE - Governed Orchestration Layer for AI Coding Agents',
  description: 'Ckye unlocks EBITA your current stack can\'t reach, compressing timelines, cutting unit costs, and avoiding rework.',
  keywords: ['AI coding agents', 'orchestration', 'governance', 'enterprise AI', 'code quality', 'development tools']
}
```

### Open Graph Configuration
```tsx
openGraph: {
  title: 'CKYE - Governed Orchestration Layer for AI Coding Agents',
  description: 'Ckye unlocks EBITA your current stack can\'t reach, compressing timelines, cutting unit costs, and avoiding rework.',
  type: 'website',
  url: 'https://ckye.com',
  siteName: 'CKYE',
  images: [
    {
      url: '/content/hero--desktop.png',
      width: 1200,
      height: 630,
      alt: 'CKYE AI coding agents interface'
    }
  ]
}
```

### Twitter Card Configuration
```tsx
twitter: {
  card: 'summary_large_image',
  title: 'CKYE - Governed Orchestration Layer for AI Coding Agents',
  description: 'Ckye unlocks EBITA your current stack can\'t reach, compressing timelines, cutting unit costs, and avoiding rework.',
  images: ['/content/hero--desktop.png']
}
```

**SEO Strategy**:
- **Target Keywords**: AI coding agents, orchestration, governance, enterprise AI
- **Business Focus**: EBITA, cost reduction, timeline compression
- **Social Sharing**: Optimized for LinkedIn and Twitter professional audiences
- **Image Optimization**: Uses hero image as primary social media visual

## Responsive Behavior Across Breakpoints

### Hero Component Responsive Images
- **Desktop (≥1024px)**: `/content/hero--desktop.png`
- **Tablet (768px-1023px)**: `/content/hero--tablet.png`
- **Mobile (<768px)**: `/content/hero--mobile.png`

### Layout Adaptations

#### Mobile (<768px)
- Single column layout for all sections
- Stacked content with text above images
- Full-width images for maximum impact
- Larger touch targets for CTA buttons
- Condensed metrics display

#### Tablet (768px-1023px)
- Two-column layout for feature sections
- Side-by-side content and images
- Optimized image sizes for tablet viewports
- Balanced text and visual hierarchy

#### Desktop (≥1024px)
- Full multi-column layouts
- Large hero images for visual impact
- Expanded metrics displays
- Optimized for conversion-focused browsing

### Component-Specific Responsive Behavior

#### FeatureSection
- **Image Layout**: Alternates left/right positioning on larger screens
- **Content Width**: Constrains text width for optimal readability
- **Image Sizing**: Uses CSS `fill` for dynamic sizing

#### Metrics
- **Single Variant**: Horizontal layout on desktop, stacked on mobile
- **Double Variant**: Grid layout that adapts to available space
- **Typography**: Scalable text sizes for different screen densities

#### CompatibleWith
- **Logo Arrangement**: Horizontal flow with responsive spacing
- **Logo Sizing**: Maintains aspect ratios across breakpoints
- **Overflow Handling**: Prevents horizontal scrolling on small screens

## Data Flow and Props

### Static Data Sources
All content is statically defined within the page component:

```tsx
// Hero props - directly passed from page
const heroProps = {
  tagline: "/ ckye /",
  heading: "Ckye is a Governed Orchestration Layer for AI Coding Agents",
  description: "Ckye unlocks EBITA your current stack can't reach...",
  ctaText: "Get Ckye",
  ctaAriaLabel: "Get started with Ckye platform"
};

// Metrics data - array of metric objects
const singleMetrics = [
  { title: "OpEx", value: "50%", description: "Reduction in IT Operating Expenses" },
  // ...additional metrics
];

// Feature section props - individual configurations
const featureProps = {
  heading: "Where is the AI revolution I was promised?",
  bodyText: "The reality is enterprises are only one step away...",
  image: { src: "/content/feature-ai-revolution.png", alt: "..." },
  layout: "image-right"
};
```

### Props Validation
Components use TypeScript interfaces for prop validation:

```typescript
// Hero component props
interface HeroProps {
  tagline?: string;
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaAriaLabel?: string;
  onCtaClick?: () => void;
  images?: HeroImageSet;
}

// Metrics component props
interface MetricsProps {
  variant?: 'single' | 'double';
  metrics: MetricData[];
  gradientColor?: 'blue' | 'orange' | string;
  className?: string;
}
```

### Data Dependencies
- **No External APIs**: All content is statically defined
- **Image Dependencies**: Requires images in `/public/content/` and `/public/models/`
- **No State Management**: Page is purely presentational

## Accessibility Features

### Semantic HTML Structure
```tsx
<main>
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">...</h1>
  </section>
  <section aria-label="AI models compatibility">
    <div role="list">
      <div role="listitem">...</div>
    </div>
  </section>
  <section aria-label="Metrics dashboard">
    <h3>...</h3>
  </section>
</main>
```

### ARIA Labels and Descriptions
- **Hero CTA**: `aria-label="Get started with Ckye platform"`
- **Sections**: Descriptive `aria-label` attributes
- **Images**: Comprehensive `alt` text describing content and context
- **Lists**: Semantic `role="list"` and `role="listitem"` for model compatibility

### Keyboard Navigation
- **Focus Management**: All interactive elements are keyboard accessible
- **Tab Order**: Logical flow from hero CTA through page content
- **Skip Links**: Semantic section structure supports screen reader navigation

### Screen Reader Support
- **Heading Hierarchy**: Proper h1-h3 structure for content organization
- **Descriptive Text**: Alt text provides context, not just description
- **List Semantics**: AI model compatibility uses proper list markup

## Image Requirements and Placeholder Handling

### Hero Images
**Required Images**:
- `/public/content/hero--desktop.png` (Desktop: ≥1024px)
- `/public/content/hero--tablet.png` (Tablet: 768px-1023px)
- `/public/content/hero--mobile.png` (Mobile: <768px)

**Specifications**:
- **Format**: PNG for transparency support
- **Optimization**: Next.js Image component with `priority` flag
- **Dimensions**: Mobile baseline 295x312px, scaled for larger screens
- **Alt Text**: "Ckye AI coding agents interface showing code orchestration and governance features"

### Feature Section Images
**Required Images**:
- `/public/content/feature-ai-revolution.png`
- `/public/content/feature-ai-revolution-left.png`
- `/public/content/feature-full-width.png`

**Specifications**:
- **Layout**: Uses CSS `fill` for responsive sizing
- **Loading**: Lazy loaded (not priority)
- **Alt Text**: Descriptive and context-aware

### AI Model Logos
**Required Images**:
- `/public/models/claude.png` (204x48px)
- `/public/models/gemini.png` (196x48px)
- `/public/models/copilot.png` (340x48px)

**Loading Strategy**:
- **Priority**: First logo (Claude) gets priority loading
- **Consistency**: All logos maintain 48px height
- **Format**: PNG for logo transparency

### Placeholder Handling
**Current Implementation**: No placeholder system implemented
**Fallback Behavior**:
- Images rely on Next.js Image component error handling
- No explicit loading states or error boundaries
- Alt text serves as fallback content for screen readers

**Recommended Enhancements**:
```tsx
// Enhanced image loading with placeholders
<Image
  src={image.src}
  alt={image.alt}
  fill
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  onError={(e) => {
    // Handle image load errors
    console.error('Image failed to load:', image.src);
  }}
/>
```

## Business Logic and Special Behaviors

### Conversion Optimization
- **Hero CTA**: Primary conversion point with action-oriented copy
- **Multiple Touchpoints**: Various sections reinforce value proposition
- **Social Proof**: AI model compatibility builds trust and credibility

### Content Strategy
- **Problem-Solution Flow**: Identifies enterprise AI challenges then presents CKYE as solution
- **Metrics-Driven**: Quantified benefits (50% OpEx reduction, 2X faster delivery)
- **Comparison Framework**: Direct comparison showing CKYE advantages

### Performance Optimizations
- **Image Priority**: Hero images marked as priority for faster LCP
- **Lazy Loading**: Feature section images loaded as needed
- **Static Generation**: Page pre-rendered for optimal performance

### User Journey Design
1. **Attention**: Hero grabs attention with clear value proposition
2. **Credibility**: Compatibility section builds trust
3. **Problem Recognition**: Feature sections identify pain points
4. **Solution Validation**: Metrics demonstrate quantified benefits
5. **Decision Support**: Comparison metrics provide concrete decision criteria

### Analytics Considerations
**Recommended Tracking**:
- Hero CTA click rates
- Scroll depth through sections
- Time spent on metrics sections
- Exit points for optimization

**Conversion Events**:
- Primary CTA interactions
- Section engagement metrics
- Image load performance
- Mobile vs desktop behavior differences

## Usage Instructions

### Content Updates
```tsx
// Update hero content
<Hero
  tagline="/ ckye /"  // Update brand tagline
  heading="..."       // Modify main headline
  description="..."   // Update value proposition
  ctaText="..."      // Change CTA text
/>

// Update metrics
const metrics = [
  {
    title: "New Metric",     // Update metric name
    value: "75%",           // Update percentage/value
    description: "..."      // Update description
  }
];
```

### Image Management
```bash
# Add new images to public directory
/public/content/hero--desktop.png    # Hero desktop image
/public/content/feature-new.png      # Feature section image
/public/models/new-model.png         # AI model logo
```

### SEO Updates
```tsx
// Update metadata for SEO changes
export const metadata: Metadata = {
  title: 'Updated Title - CKYE',
  description: 'Updated description...',
  keywords: ['new', 'keywords', 'here']
};
```

### A/B Testing Setup
```tsx
// Conditional content for testing
const isVariantB = process.env.VARIANT === 'B';

<Hero
  heading={isVariantB ? "Alternative Headline" : "Default Headline"}
  ctaText={isVariantB ? "Try CKYE" : "Get CKYE"}
/>
```

## Performance Considerations

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: Hero image optimized with priority loading
- **CLS (Cumulative Layout Shift)**: Fixed image dimensions prevent layout shifts
- **FID (First Input Delay)**: Minimal JavaScript for fast interactivity

### Bundle Size
- **Static Content**: No dynamic imports or heavy dependencies
- **Image Optimization**: Next.js automatic optimization
- **CSS Modules**: Component-scoped styles prevent bloat

### Caching Strategy
- **Static Generation**: Page pre-rendered at build time
- **Image Caching**: Next.js handles image optimization and caching
- **CDN Ready**: All assets optimized for CDN delivery

This documentation provides a comprehensive overview of the home page implementation, covering all aspects from component composition to SEO optimization and accessibility features.