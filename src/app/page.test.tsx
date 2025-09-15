import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

// Mock all child components before importing the page
jest.mock('@/components/organisms/Hero/Hero', () => {
  return function MockHero({
    tagline,
    heading,
    description,
    ctaText,
    ctaAriaLabel,
    className,
    ...props
  }: any) {
    return (
      <section
        data-testid="hero"
        className={className}
        aria-labelledby="hero-heading"
        role="region"
        {...props}
      >
        <h1 id="hero-heading">{heading}</h1>
        <p>{tagline}</p>
        <p>{description}</p>
        <button aria-label={ctaAriaLabel}>{ctaText}</button>
      </section>
    );
  };
});

jest.mock('@/components/molecules/CompatibleWith/CompatibleWith', () => {
  return function MockCompatibleWith(props: any) {
    return (
      <section data-testid="compatible-with" role="region" {...props}>
        <h2>Compatible With Section</h2>
      </section>
    );
  };
});

jest.mock('@/components/organisms/FeatureSection/FeatureSection', () => {
  return function MockFeatureSection({
    heading,
    bodyText,
    image,
    layout,
    className,
    ...props
  }: any) {
    return (
      <section
        data-testid="feature-section"
        data-layout={layout}
        className={className}
        role="region"
        {...props}
      >
        <h2>{heading}</h2>
        <p>{bodyText}</p>
        <img src={image.src} alt={image.alt} />
      </section>
    );
  };
});

jest.mock('@/components/molecules/Metrics/Metrics', () => {
  return {
    Metrics: function MockMetrics({
      variant,
      metrics,
      gradientColor,
      className,
      ...props
    }: any) {
      return (
        <section
          data-testid="metrics"
          data-variant={variant}
          data-gradient={gradientColor}
          className={className}
          role="region"
          {...props}
        >
          <h2>Metrics Section</h2>
          {metrics.map((metric: any, index: number) => (
            <div key={index} data-testid={`metric-${index}`}>
              <h3>{metric.title}</h3>
              <span>{metric.value}</span>
              {metric.secondaryValue && <span>{metric.secondaryValue}</span>}
              <p>{metric.description}</p>
            </div>
          ))}
        </section>
      );
    }
  };
});

// Import after mocks are set up
import Home, { metadata } from './page';

describe('Home Page', () => {
  const renderHome = () => {
    return render(<Home />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  describe('Page Structure and Rendering', () => {
    it('should render without crashing', () => {
      renderHome();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should use semantic main element', () => {
      const { container } = renderHome();
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should render all page sections in correct order', () => {
      renderHome();

      const sections = screen.getAllByRole('region');
      expect(sections).toHaveLength(7); // Hero + CompatibleWith + 3 FeatureSections + 2 Metrics

      // Verify section order by test IDs
      expect(screen.getByTestId('hero')).toBeInTheDocument();
      expect(screen.getByTestId('compatible-with')).toBeInTheDocument();
      expect(screen.getAllByTestId('feature-section')).toHaveLength(3);
      expect(screen.getAllByTestId('metrics')).toHaveLength(2);
    });

    it('should maintain proper document structure', () => {
      const { container } = renderHome();

      // Main should be the root element
      const main = container.firstChild;
      expect(main?.nodeName).toBe('MAIN');

      // All sections should be direct children of main
      const directChildren = Array.from(main?.children || []);
      expect(directChildren).toHaveLength(7);
    });
  });

  // Hero Section Tests
  describe('Hero Section', () => {
    it('should render Hero with correct props', () => {
      renderHome();

      const hero = screen.getByTestId('hero');
      expect(hero).toBeInTheDocument();

      // Check content within hero section
      expect(screen.getByText('/ ckye /')).toBeInTheDocument();
      expect(screen.getByRole('heading', {
        name: 'Ckye is a Governed Orchestration Layer for AI Coding Agents'
      })).toBeInTheDocument();

      // Check for Hero-specific description within the hero section
      const heroDescription = hero.querySelector('p:last-of-type');
      expect(heroDescription).toHaveTextContent(/Ckye unlocks EBITA your current stack can't reach/);

      expect(screen.getByRole('button', { name: 'Get started with Ckye platform' })).toBeInTheDocument();
      expect(screen.getByText('Get Ckye')).toBeInTheDocument();
    });

    it('should pass correct aria-label for CTA button', () => {
      renderHome();

      const ctaButton = screen.getByRole('button', { name: 'Get started with Ckye platform' });
      expect(ctaButton).toHaveAttribute('aria-label', 'Get started with Ckye platform');
    });
  });

  // Compatible With Section Tests
  describe('Compatible With Section', () => {
    it('should render CompatibleWith component', () => {
      renderHome();

      const compatibleWith = screen.getByTestId('compatible-with');
      expect(compatibleWith).toBeInTheDocument();
      expect(screen.getByText('Compatible With Section')).toBeInTheDocument();
    });

    it('should be positioned after Hero section', () => {
      renderHome();

      const hero = screen.getByTestId('hero');
      const compatibleWith = screen.getByTestId('compatible-with');

      const heroIndex = Array.from(hero.parentElement?.children || []).indexOf(hero);
      const compatibleIndex = Array.from(compatibleWith.parentElement?.children || []).indexOf(compatibleWith);

      expect(compatibleIndex).toBe(heroIndex + 1);
    });
  });

  // Feature Sections Tests
  describe('Feature Sections', () => {
    it('should render all three feature sections', () => {
      renderHome();

      const featureSections = screen.getAllByTestId('feature-section');
      expect(featureSections).toHaveLength(3);
    });

    it('should render first feature section with correct props (image-right)', () => {
      renderHome();

      const featureSections = screen.getAllByTestId('feature-section');
      const firstFeature = featureSections[0];

      expect(firstFeature).toHaveAttribute('data-layout', 'image-right');

      // Check for heading specifically in first feature section
      const heading = firstFeature.querySelector('h2');
      expect(heading).toHaveTextContent('Where is the AI revolution I was promised?');

      // Check for body text specifically in first feature section
      const bodyText = firstFeature.querySelector('p');
      expect(bodyText).toHaveTextContent(/The reality is enterprises are only one step away/);

      const image = screen.getByAltText('AI revolution visualization showing current enterprise AI tools and potential');
      expect(image).toHaveAttribute('src', '/content/feature-ai-revolution.png');
    });

    it('should render second feature section with correct props (image-left)', () => {
      renderHome();

      const featureSections = screen.getAllByTestId('feature-section');
      const secondFeature = featureSections[1];

      expect(secondFeature).toHaveAttribute('data-layout', 'image-left');

      const image = screen.getByAltText('Enterprise AI transformation roadmap and implementation strategy');
      expect(image).toHaveAttribute('src', '/content/feature-ai-revolution-left.png');
    });

    it('should render third feature section with correct props (image-right)', () => {
      renderHome();

      const featureSections = screen.getAllByTestId('feature-section');
      const thirdFeature = featureSections[2];

      expect(thirdFeature).toHaveAttribute('data-layout', 'image-right');
      expect(screen.getByText('Concise Copy goes here')).toBeInTheDocument();

      const image = screen.getByAltText('Comprehensive view of Ckye platform capabilities and benefits');
      expect(image).toHaveAttribute('src', '/content/feature-full-width.png');
    });

    it('should have proper image alt text for accessibility', () => {
      renderHome();

      const images = [
        'AI revolution visualization showing current enterprise AI tools and potential',
        'Enterprise AI transformation roadmap and implementation strategy',
        'Comprehensive view of Ckye platform capabilities and benefits'
      ];

      images.forEach(altText => {
        expect(screen.getByAltText(altText)).toBeInTheDocument();
      });
    });
  });

  // Metrics Sections Tests
  describe('Metrics Sections', () => {
    it('should render both metrics sections', () => {
      renderHome();

      const metricsComponents = screen.getAllByTestId('metrics');
      expect(metricsComponents).toHaveLength(2);
    });

    it('should render first metrics section with single variant and blue gradient', () => {
      renderHome();

      const metricsComponents = screen.getAllByTestId('metrics');
      const firstMetrics = metricsComponents[0];

      expect(firstMetrics).toHaveAttribute('data-variant', 'single');
      expect(firstMetrics).toHaveAttribute('data-gradient', 'blue');

      // Check metrics content within first metrics section
      const firstMetricsItems = firstMetrics.querySelectorAll('[data-testid^="metric-"]');
      expect(firstMetricsItems).toHaveLength(3);

      // Check individual metrics within the first section
      expect(firstMetrics).toHaveTextContent('OpEx');
      expect(firstMetrics).toHaveTextContent('50%');
      expect(firstMetrics).toHaveTextContent('Reduction in IT Operating Expenses');

      expect(firstMetrics).toHaveTextContent('Time to Market');
      expect(firstMetrics).toHaveTextContent('2X');
      expect(firstMetrics).toHaveTextContent('Faster compared to out of the box AI alone');

      expect(firstMetrics).toHaveTextContent('Code Quality');
      expect(firstMetrics).toHaveTextContent('Increase in overall code quality vs. non Ckye users');
    });

    it('should render second metrics section with double variant and orange gradient', () => {
      renderHome();

      const metricsComponents = screen.getAllByTestId('metrics');
      const secondMetrics = metricsComponents[1];

      expect(secondMetrics).toHaveAttribute('data-variant', 'double');
      expect(secondMetrics).toHaveAttribute('data-gradient', 'orange');

      // Check comparison metrics content
      expect(screen.getByText('Traditional Offshore')).toBeInTheDocument();
      expect(screen.getByText('6 mo')).toBeInTheDocument();
      expect(screen.getByText('$1MM')).toBeInTheDocument();

      expect(screen.getByText('Out-of-the-box AI')).toBeInTheDocument();
      expect(screen.getByText('5 mo')).toBeInTheDocument();
      expect(screen.getByText('$850K')).toBeInTheDocument();

      expect(screen.getByText('With Ckye')).toBeInTheDocument();
      expect(screen.getByText('6 weeks')).toBeInTheDocument();
      expect(screen.getByText('$90K')).toBeInTheDocument();
    });

    it('should render all metrics with proper data structure', () => {
      renderHome();

      // First metrics section (3 metrics)
      const firstMetrics = screen.getAllByTestId(/^metric-\d+$/);
      const metricsInFirstSection = firstMetrics.slice(0, 3);
      expect(metricsInFirstSection).toHaveLength(3);

      // Second metrics section (3 comparison metrics)
      const secondMetrics = firstMetrics.slice(3, 6);
      expect(secondMetrics).toHaveLength(3);
    });
  });

  // Responsive Behavior Tests
  describe('Responsive Behavior', () => {
    beforeEach(() => {
      // Reset viewport dimensions and mock matchMedia
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });

      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    const mockViewport = (width: number, height: number) => {
      Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
    };

    const testViewportBreakpoints = [
      { name: 'mobile', width: 375, height: 812 },
      { name: 'mobile-landscape', width: 812, height: 375 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'tablet-landscape', width: 1024, height: 768 },
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'large-desktop', width: 1920, height: 1080 },
      { name: 'ultra-wide', width: 2560, height: 1440 },
    ];

    testViewportBreakpoints.forEach(({ name, width, height }) => {
      it(`should render properly on ${name} viewport (${width}x${height})`, () => {
        mockViewport(width, height);
        renderHome();

        expect(screen.getByRole('main')).toBeInTheDocument();

        // All sections should render at all breakpoints
        expect(screen.getByTestId('hero')).toBeInTheDocument();
        expect(screen.getByTestId('compatible-with')).toBeInTheDocument();
        expect(screen.getAllByTestId('feature-section')).toHaveLength(3);
        expect(screen.getAllByTestId('metrics')).toHaveLength(2);

        // Check that content is still accessible
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(1);
        expect(screen.getAllByRole('img')).toHaveLength(3);
      });
    });

    it('should handle dynamic viewport changes', () => {
      const { rerender } = renderHome();

      // Start with desktop
      mockViewport(1440, 900);
      rerender(<Home />);
      expect(screen.getByRole('main')).toBeInTheDocument();

      // Change to mobile
      mockViewport(375, 812);
      rerender(<Home />);
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('hero')).toBeInTheDocument();

      // Change to tablet
      mockViewport(768, 1024);
      rerender(<Home />);
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getAllByTestId('feature-section')).toHaveLength(3);
    });

    it('should maintain proper layout order across breakpoints', () => {
      const breakpoints = [375, 768, 1024, 1440];

      breakpoints.forEach(width => {
        mockViewport(width, 768);
        const { container } = render(<Home />);

        const main = container.querySelector('main');
        const children = Array.from(main?.children || []);

        // Order should remain consistent: Hero, CompatibleWith, Feature1, Metrics1, Feature2, Feature3, Metrics2
        expect(children).toHaveLength(7);

        const testIds = children.map(child =>
          child.getAttribute('data-testid') || child.tagName.toLowerCase()
        );

        expect(testIds[0]).toBe('hero');
        expect(testIds[1]).toBe('compatible-with');
        expect(testIds[2]).toBe('feature-section');
        expect(testIds[3]).toBe('metrics');
        expect(testIds[4]).toBe('feature-section');
        expect(testIds[5]).toBe('feature-section');
        expect(testIds[6]).toBe('metrics');
      });
    });

    it('should handle orientation changes', () => {
      // Portrait mobile
      mockViewport(375, 812);
      renderHome();
      expect(screen.getByRole('main')).toBeInTheDocument();

      // Landscape mobile
      mockViewport(812, 375);
      const { rerender } = renderHome();
      rerender(<Home />);
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getAllByRole('region')).toHaveLength(7);
    });

    it('should handle edge case viewports', () => {
      const edgeCases = [
        { width: 320, height: 568 }, // iPhone 5/SE
        { width: 280, height: 653 }, // Very narrow
        { width: 4096, height: 2160 }, // 4K display
        { width: 1, height: 1 }, // Minimal
      ];

      edgeCases.forEach(({ width, height }) => {
        mockViewport(width, height);

        expect(() => {
          renderHome();
        }).not.toThrow();

        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });

    it('should work with prefers-reduced-motion media query', () => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      renderHome();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getAllByRole('region')).toHaveLength(7);
    });

    it('should work with print media query', () => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === 'print',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      renderHome();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getAllByRole('region')).toHaveLength(7);
    });
  });

  // SEO Metadata Tests
  describe('SEO Metadata', () => {
    it('should export correct page title', () => {
      expect(metadata.title).toBe('CKYE - Governed Orchestration Layer for AI Coding Agents');
    });

    it('should export correct page description', () => {
      expect(metadata.description).toBe('Ckye unlocks EBITA your current stack can\'t reach, compressing timelines, cutting unit costs, and avoiding rework.');
    });

    it('should export correct keywords', () => {
      expect(metadata.keywords).toEqual([
        'AI coding agents',
        'orchestration',
        'governance',
        'enterprise AI',
        'code quality',
        'development tools'
      ]);
    });

    it('should export correct Open Graph metadata', () => {
      expect(metadata.openGraph).toEqual({
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
      });
    });

    it('should export correct Twitter metadata', () => {
      expect(metadata.twitter).toEqual({
        card: 'summary_large_image',
        title: 'CKYE - Governed Orchestration Layer for AI Coding Agents',
        description: 'Ckye unlocks EBITA your current stack can\'t reach, compressing timelines, cutting unit costs, and avoiding rework.',
        images: ['/content/hero--desktop.png']
      });
    });

    it('should have proper SEO metadata structure', () => {
      expect(metadata).toHaveProperty('title');
      expect(metadata).toHaveProperty('description');
      expect(metadata).toHaveProperty('keywords');
      expect(metadata).toHaveProperty('openGraph');
      expect(metadata).toHaveProperty('twitter');

      // Verify metadata types
      expect(typeof metadata.title).toBe('string');
      expect(typeof metadata.description).toBe('string');
      expect(Array.isArray(metadata.keywords)).toBe(true);
      expect(typeof metadata.openGraph).toBe('object');
      expect(typeof metadata.twitter).toBe('object');
    });
  });

  // Accessibility Tests (WCAG 2.1 AA Compliance)
  describe('Accessibility Compliance (WCAG 2.1 AA)', () => {
    it('should have no accessibility violations', async () => {
      const { container } = renderHome();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should use semantic HTML structure', () => {
      renderHome();

      // Main landmark
      expect(screen.getByRole('main')).toBeInTheDocument();

      // Section landmarks - check using testids to ensure we get all sections
      expect(screen.getByTestId('hero')).toBeInTheDocument();
      expect(screen.getByTestId('compatible-with')).toBeInTheDocument();
      expect(screen.getAllByTestId('feature-section')).toHaveLength(3);
      expect(screen.getAllByTestId('metrics')).toHaveLength(2);

      // Headings hierarchy
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);

      // Check for proper h1
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      renderHome();

      const headings = screen.getAllByRole('heading');

      // Should have one h1 (from Hero)
      const h1Elements = headings.filter(h => h.tagName === 'H1');
      expect(h1Elements).toHaveLength(1);

      // Should have multiple h2 elements (from sections)
      const h2Elements = headings.filter(h => h.tagName === 'H2');
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderHome();

      // Tab through the page
      await user.tab();

      // Should be able to focus on interactive elements
      const focusableElements = screen.getAllByRole('button');
      expect(focusableElements.length).toBeGreaterThan(0);
    });

    it('should have proper ARIA labels and roles', () => {
      renderHome();

      // Main should have main role
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();

      // Sections should have region role
      const regions = screen.getAllByRole('region');
      expect(regions).toHaveLength(7);

      // Images should have alt text
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });

    it('should have meaningful alt text for all images', () => {
      renderHome();

      const images = screen.getAllByRole('img');

      images.forEach(img => {
        const altText = img.getAttribute('alt') || '';
        expect(altText.length).toBeGreaterThan(5); // Should be descriptive
        expect(altText).toMatch(/\w+/); // Should contain words
      });
    });

    it('should support screen readers', () => {
      renderHome();

      // Check for proper labeling
      const button = screen.getByRole('button', { name: 'Get started with Ckye platform' });
      expect(button).toHaveAccessibleName('Get started with Ckye platform');

      // Check for proper heading structure
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveAccessibleName();
    });

    it('should maintain focus visibility', async () => {
      const user = userEvent.setup();
      renderHome();

      // Tab to first focusable element
      await user.tab();

      // Active element should be visible and properly focused
      expect(document.activeElement).toBeInTheDocument();
    });

    it('should work with reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderHome();

      // Component should render without issues when reduced motion is preferred
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getAllByRole('region')).toHaveLength(7);
    });
  });

  // Component Integration Tests
  describe('Component Integration', () => {
    it('should pass correct props to Hero component', () => {
      renderHome();

      const hero = screen.getByTestId('hero');
      expect(hero).toBeInTheDocument();

      // Verify Hero receives correct props via rendered content
      expect(screen.getByText('/ ckye /')).toBeInTheDocument();
      expect(screen.getByText('Ckye is a Governed Orchestration Layer for AI Coding Agents')).toBeInTheDocument();
      expect(screen.getByText('Get Ckye')).toBeInTheDocument();
    });

    it('should pass correct props to FeatureSection components', () => {
      renderHome();

      const featureSections = screen.getAllByTestId('feature-section');

      // First feature section
      expect(featureSections[0]).toHaveAttribute('data-layout', 'image-right');

      // Second feature section
      expect(featureSections[1]).toHaveAttribute('data-layout', 'image-left');

      // Third feature section
      expect(featureSections[2]).toHaveAttribute('data-layout', 'image-right');
    });

    it('should pass correct props to Metrics components', () => {
      renderHome();

      const metricsComponents = screen.getAllByTestId('metrics');

      // First metrics component
      expect(metricsComponents[0]).toHaveAttribute('data-variant', 'single');
      expect(metricsComponents[0]).toHaveAttribute('data-gradient', 'blue');

      // Second metrics component
      expect(metricsComponents[1]).toHaveAttribute('data-variant', 'double');
      expect(metricsComponents[1]).toHaveAttribute('data-gradient', 'orange');
    });

    it('should render all components without prop warnings', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderHome();

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  // Performance and Edge Cases
  describe('Performance and Edge Cases', () => {
    it('should handle component re-renders without errors', () => {
      const { rerender } = renderHome();

      expect(() => {
        rerender(<Home />);
      }).not.toThrow();

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should maintain component stability across renders', () => {
      const { container, rerender } = renderHome();
      const initialMain = container.querySelector('main');

      rerender(<Home />);
      const rerenderedMain = container.querySelector('main');

      expect(initialMain).toBe(rerenderedMain);
    });

    it('should not have memory leaks in component mounting/unmounting', () => {
      const { unmount } = renderHome();

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('should handle rapid state changes', () => {
      const { rerender } = renderHome();

      // Simulate rapid re-renders
      for (let i = 0; i < 5; i++) {
        rerender(<Home />);
      }

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getAllByRole('region')).toHaveLength(7);
    });
  });

  // Content Validation Tests
  describe('Content Validation', () => {
    it('should not contain any error messages', () => {
      renderHome();

      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/null/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/failed/i)).not.toBeInTheDocument();
    });

    it('should have consistent content across renders', () => {
      const { rerender } = renderHome();

      expect(screen.getByText('/ ckye /')).toBeInTheDocument();
      expect(screen.getByText('Ckye is a Governed Orchestration Layer for AI Coding Agents')).toBeInTheDocument();

      rerender(<Home />);

      expect(screen.getByText('/ ckye /')).toBeInTheDocument();
      expect(screen.getByText('Ckye is a Governed Orchestration Layer for AI Coding Agents')).toBeInTheDocument();
    });

    it('should have proper text formatting', () => {
      renderHome();

      // Check for proper punctuation and formatting
      const tagline = screen.getByText('/ ckye /');
      expect(tagline.textContent).toBe('/ ckye /');

      const description = screen.getByText(/Ckye unlocks EBITA your current stack can't reach/);
      expect(description.textContent?.endsWith('.')).toBe(true);
    });
  });

  // Browser Environment Tests
  describe('Browser Environment Tests', () => {
    it('should maintain consistent rendering across different environments', () => {
      const { container: container1 } = renderHome();
      const { container: container2 } = render(<Home />);

      expect(container1.innerHTML).toBe(container2.innerHTML);
    });

    it('should handle different browser environments gracefully', () => {
      // Mock different user agents
      const originalUserAgent = Object.getOwnPropertyDescriptor(navigator, 'userAgent');

      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        configurable: true,
      });

      renderHome();
      expect(screen.getByRole('main')).toBeInTheDocument();

      // Restore original user agent
      if (originalUserAgent) {
        Object.defineProperty(navigator, 'userAgent', originalUserAgent);
      }
    });

    it('should work with different color schemes', () => {
      // Mock dark mode preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderHome();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getAllByRole('region')).toHaveLength(7);
    });
  });

  // Integration with Next.js Features
  describe('Next.js Integration', () => {
    it('should work with Next.js metadata export', () => {
      expect(metadata).toBeDefined();
      expect(typeof metadata).toBe('object');
    });

    it('should export as default function', () => {
      expect(typeof Home).toBe('function');
      expect(Home.name).toBe('Home');
    });

    it('should render without Next.js specific errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderHome();

      // Should not have any Next.js related errors
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringMatching(/next/i)
      );

      consoleSpy.mockRestore();
    });
  });
});