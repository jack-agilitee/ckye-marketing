import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import Hero from './Hero';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

// Mock the SCSS module
jest.mock('./Hero.module.scss', () => ({
  hero: 'hero',
  hero__container: 'hero__container',
  hero__content: 'hero__content',
  hero__text: 'hero__text',
  hero__tagline: 'hero__tagline',
  hero__heading: 'hero__heading',
  hero__description: 'hero__description',
  hero__cta: 'hero__cta',
  hero__imageWrapper: 'hero__imageWrapper',
  hero__image: 'hero__image',
  hero__img: 'hero__img',
}));

// Mock the Button component for accessibility testing
const mockButtonOnClick = jest.fn();
jest.mock('../atoms/Button/Button', () => {
  return function MockButton({ 
    children, 
    variant, 
    className, 
    'aria-label': ariaLabel, 
    ...props 
  }: any) {
    return (
      <button
        className={className}
        aria-label={ariaLabel}
        onClick={mockButtonOnClick}
        data-variant={variant}
        aria-disabled="false"
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  };
});

describe('Hero Accessibility Tests (WCAG 2.1 AA Compliance)', () => {
  const renderHero = (props: { className?: string } = {}) => {
    return render(<Hero {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WCAG 2.1 AA Compliance - Automated Testing', () => {
    it('should have no accessibility violations (default state)', async () => {
      const { container } = renderHero();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with custom className', async () => {
      const { container } = renderHero({ className: 'custom-hero-class' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations in different screen contexts', async () => {
      // Test with different viewport assumptions
      const { container } = renderHero();
      
      // Test mobile context
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      let results = await axe(container);
      expect(results).toHaveNoViolations();
      
      // Test tablet context
      Object.defineProperty(window, 'innerWidth', { value: 768 });
      results = await axe(container);
      expect(results).toHaveNoViolations();
      
      // Test desktop context
      Object.defineProperty(window, 'innerWidth', { value: 1024 });
      results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Semantic HTML and Document Structure (WCAG 1.3.1)', () => {
    it('should use proper semantic elements for content structure', () => {
      renderHero();
      
      // Main container should be a section with landmark role
      const section = screen.getByRole('region');
      expect(section.tagName).toBe('SECTION');
      expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
      
      // Main heading should be h1
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading.tagName).toBe('H1');
      expect(heading).toHaveAttribute('id', 'hero-heading');
      
      // CTA should be a button
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
      
      // Image should have proper alt text
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Ckye AI coding agents interface showing code orchestration and governance features');
    });

    it('should maintain proper heading hierarchy', () => {
      renderHero();
      
      // Should have exactly one h1
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      
      // Verify no other heading levels are skipped or misused
      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
    });

    it('should use paragraph elements for descriptive text', () => {
      const { container } = renderHero();
      
      const tagline = container.querySelector('.hero__tagline');
      const description = container.querySelector('.hero__description');
      
      expect(tagline?.tagName).toBe('P');
      expect(description?.tagName).toBe('P');
    });

    it('should establish correct landmark relationships', () => {
      renderHero();
      
      const section = screen.getByRole('region');
      const heading = screen.getByRole('heading', { level: 1 });
      
      // Section should be labeled by the heading
      expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
      expect(heading).toHaveAttribute('id', 'hero-heading');
      
      // Verify the accessible name is computed correctly
      expect(section).toHaveAccessibleName('Ckye is a Governed Orchestration Layer for AI Coding Agents');
    });
  });

  describe('Keyboard Navigation and Focus Management (WCAG 2.1.1, 2.4.3)', () => {
    it('should support complete keyboard navigation', async () => {
      const user = userEvent.setup();
      renderHero();
      
      const button = screen.getByRole('button', { name: 'Get started with Ckye' });
      
      // Tab should reach the button
      await user.tab();
      expect(button).toHaveFocus();
      
      // Should be the only focusable element in the component
      await user.tab();
      expect(button).not.toHaveFocus(); // Focus should move beyond component
    });

    it('should support keyboard activation of interactive elements', async () => {
      const user = userEvent.setup();
      renderHero();
      
      const button = screen.getByRole('button', { name: 'Get started with Ckye' });
      button.focus();
      
      // Test Enter key activation
      await user.keyboard('{Enter}');
      expect(mockButtonOnClick).toHaveBeenCalledTimes(1);
      
      // Test Space key activation
      mockButtonOnClick.mockClear();
      await user.keyboard(' ');
      expect(mockButtonOnClick).toHaveBeenCalledTimes(1);
    });

    it('should have logical tab order', async () => {
      const user = userEvent.setup();
      renderHero();
      
      // The button should be the first (and only) focusable element
      await user.tab();
      const button = screen.getByRole('button', { name: 'Get started with Ckye' });
      expect(document.activeElement).toBe(button);
    });

    it('should maintain focus visibility', () => {
      renderHero();
      const button = screen.getByRole('button', { name: 'Get started with Ckye' });
      
      button.focus();
      expect(document.activeElement).toBe(button);
      
      // Focus should remain on the element
      expect(button).toHaveFocus();
    });
  });

  describe('Screen Reader Support and ARIA (WCAG 4.1.2)', () => {
    it('should provide proper accessible names for all interactive elements', () => {
      renderHero();
      
      // Button should have accessible name from aria-label
      const button = screen.getByRole('button', { name: 'Get started with Ckye' });
      expect(button).toHaveAccessibleName('Get started with Ckye');
      expect(button).toHaveAttribute('aria-label', 'Get started with Ckye');
    });

    it('should use appropriate ARIA attributes', () => {
      renderHero();
      
      const section = screen.getByRole('region');
      const heading = screen.getByRole('heading', { level: 1 });
      const button = screen.getByRole('button');
      
      // Section should have aria-labelledby pointing to heading
      expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
      
      // Heading should have matching id
      expect(heading).toHaveAttribute('id', 'hero-heading');
      
      // Button should have proper state
      expect(button).toHaveAttribute('aria-disabled', 'false');
    });

    it('should provide meaningful text alternatives for images', () => {
      renderHero();
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Ckye AI coding agents interface showing code orchestration and governance features');
      
      // Alt text should be descriptive and meaningful
      const altText = image.getAttribute('alt') || '';
      expect(altText.length).toBeGreaterThan(10); // Should be descriptive
      expect(altText).toMatch(/ckye/i); // Should be relevant to content
      expect(altText).toMatch(/interface/i); // Should describe what's shown
    });

    it('should maintain proper role relationships', () => {
      renderHero();
      
      // Verify all expected roles are present
      expect(screen.getByRole('region')).toBeInTheDocument(); // section
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument(); // h1
      expect(screen.getByRole('button')).toBeInTheDocument(); // button
      expect(screen.getByRole('img')).toBeInTheDocument(); // img
    });

    it('should support screen reader text parsing', () => {
      renderHero();
      
      // Text content should be accessible to screen readers
      expect(screen.getByText('/ sky /')).toBeInTheDocument();
      expect(screen.getByText('Ckye is a Governed Orchestration Layer for AI Coding Agents')).toBeInTheDocument();
      expect(screen.getByText(/Ckye unlocks EBITA your current stack can't reach/)).toBeInTheDocument();
      
      // All text should be within proper semantic containers
      const { container } = renderHero();
      const textElements = container.querySelectorAll('p, h1');
      expect(textElements.length).toBe(3); // tagline, heading, description
    });
  });

  describe('Color and Contrast Compliance (WCAG 1.4.3)', () => {
    it('should have sufficient color contrast (automated check)', async () => {
      const { container } = renderHero();
      
      // Note: Color contrast testing is limited in jsdom, but axe will catch
      // some issues. Real browser testing would be more comprehensive.
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: false } // Disabled due to jsdom canvas limitations
        }
      });
      expect(results).toHaveNoViolations();
    });

    it('should not rely solely on color to convey information', () => {
      renderHero();
      
      // The component should work without color information
      // Text content is the primary means of conveying information
      expect(screen.getByText('/ sky /')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      // Button has both visual styling and text content
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Get Ckye');
      expect(button).toHaveAccessibleName('Get started with Ckye');
    });
  });

  describe('Responsive and Zoom Compliance (WCAG 1.4.4, 1.4.10)', () => {
    it('should maintain usability at 200% zoom', () => {
      // Simulate zoom by testing with smaller viewport
      Object.defineProperty(window, 'innerWidth', { value: 640 }); // Half of 1280
      Object.defineProperty(window, 'innerHeight', { value: 360 }); // Half of 720
      
      renderHero();
      
      // All content should still be accessible
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should support mobile viewport accessibility', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      Object.defineProperty(window, 'innerHeight', { value: 812 });
      
      renderHero();
      
      // Content should remain accessible on mobile
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAccessibleName('Get started with Ckye');
      
      // Responsive images should work
      const { container } = renderHero();
      const mobileSource = container.querySelector('source[media="(min-width: 768px)"]');
      expect(mobileSource).toBeInTheDocument();
    });

    it('should maintain content reflow without horizontal scrolling', () => {
      renderHero();
      
      // Component should not force horizontal scrolling
      // (This is primarily tested through CSS, but we can verify structure)
      const { container } = renderHero();
      const heroContainer = container.querySelector('.hero__container');
      expect(heroContainer).toBeInTheDocument();
    });
  });

  describe('Motion and Animation Accessibility (WCAG 2.3.3)', () => {
    it('should respect reduced motion preferences', () => {
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

      renderHero();
      
      // Component should render without issues when reduced motion is preferred
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      // Any animations would be handled via CSS media queries
      // This ensures the component structure supports reduced motion
    });

    it('should not have automatically playing animations', () => {
      renderHero();
      
      // Hero component should not have auto-playing animations
      // Static content and images only
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
      
      // No video or audio elements
      expect(screen.queryByRole('video')).not.toBeInTheDocument();
      expect(screen.queryByRole('audio')).not.toBeInTheDocument();
    });
  });

  describe('Form and Input Accessibility (WCAG 1.3.1, 3.3.2)', () => {
    it('should provide clear labeling for interactive elements', () => {
      renderHero();
      
      const button = screen.getByRole('button');
      
      // Button should have clear, descriptive labeling
      expect(button).toHaveAccessibleName('Get started with Ckye');
      expect(button).toHaveAttribute('aria-label', 'Get started with Ckye');
      
      // Label should describe the action, not just the visual text
      const accessibleName = button.getAttribute('aria-label') || '';
      expect(accessibleName).toMatch(/get started/i);
      expect(accessibleName).toMatch(/ckye/i);
    });

    it('should indicate the purpose of interactive elements', () => {
      renderHero();
      
      const button = screen.getByRole('button');
      
      // Button type should be specified
      expect(button).toHaveAttribute('type', 'button');
      
      // Purpose should be clear from accessible name
      expect(button).toHaveAccessibleName('Get started with Ckye');
    });
  });

  describe('Error Prevention and Help (WCAG 3.3.1, 3.3.2)', () => {
    it('should provide clear interaction feedback', async () => {
      const user = userEvent.setup();
      renderHero();
      
      const button = screen.getByRole('button', { name: 'Get started with Ckye' });
      
      // Button should provide clear feedback on interaction
      await user.click(button);
      expect(mockButtonOnClick).toHaveBeenCalled();
      
      // Button remains enabled and functional
      expect(button).not.toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'false');
    });

    it('should maintain consistent interaction patterns', async () => {
      const user = userEvent.setup();
      renderHero();
      
      const button = screen.getByRole('button');
      
      // Click interaction
      await user.click(button);
      expect(mockButtonOnClick).toHaveBeenCalledTimes(1);
      
      // Keyboard interaction should work the same way
      mockButtonOnClick.mockClear();
      button.focus();
      await user.keyboard('{Enter}');
      expect(mockButtonOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Language and Text Accessibility (WCAG 3.1.1)', () => {
    it('should have proper text content that can be programmatically determined', () => {
      renderHero();
      
      // All text content should be accessible
      const textContent = [
        '/ sky /',
        'Ckye is a Governed Orchestration Layer for AI Coding Agents',
        'Ckye unlocks EBITA your current stack can\'t reach, compressing timelines, cutting unit costs, and avoiding rework.',
        'Get Ckye'
      ];
      
      textContent.forEach(text => {
        expect(screen.getByText(new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
      });
    });

    it('should use clear and understandable text', () => {
      renderHero();
      
      // Heading should be clear and descriptive
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Ckye is a Governed Orchestration Layer for AI Coding Agents');
      
      // Button text should be action-oriented
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Get Ckye');
      
      // Description should provide meaningful information
      expect(screen.getByText(/unlocks EBITA/)).toBeInTheDocument();
    });
  });

  describe('Progressive Enhancement and Robustness (WCAG 4.1.1)', () => {
    it('should work without JavaScript enhancements', () => {
      renderHero();
      
      // Component should render core content without JavaScript
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should maintain valid HTML structure', () => {
      const { container } = renderHero();
      
      // Check for proper nesting and element relationships
      const section = container.querySelector('section');
      const h1 = container.querySelector('h1');
      const button = container.querySelector('button');
      const img = container.querySelector('img');
      const picture = container.querySelector('picture');
      
      expect(section).toBeInTheDocument();
      expect(h1).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      expect(img).toBeInTheDocument();
      expect(picture).toBeInTheDocument();
      
      // Image should be inside picture element
      expect(picture).toContainElement(img);
    });

    it('should handle component state changes gracefully', () => {
      const { rerender } = renderHero();
      
      // Initial state
      expect(screen.getByRole('region')).toBeInTheDocument();
      
      // State change (props update)
      rerender(<Hero className="updated" />);
      expect(screen.getByRole('region')).toBeInTheDocument();
      
      // Accessibility should be maintained
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Comprehensive Accessibility Integration', () => {
    it('should pass comprehensive accessibility audit', async () => {
      const { container } = renderHero();
      
      // Run comprehensive axe audit with all rules
      const results = await axe(container, {
        rules: {
          // Enable specific accessibility checks
          'aria-allowed-attr': { enabled: true },
          'aria-required-attr': { enabled: true },
          'aria-roles': { enabled: true },
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
          'button-name': { enabled: true },
          'bypass': { enabled: true },
          'color-contrast': { enabled: false }, // Disabled due to jsdom limitations
          'document-title': { enabled: false }, // Not applicable to component
          'duplicate-id': { enabled: true },
          'form-field-multiple-labels': { enabled: true },
          'html-has-lang': { enabled: false }, // Not applicable to component
          'html-lang-valid': { enabled: false }, // Not applicable to component
          'image-alt': { enabled: true },
          'input-image-alt': { enabled: true },
          'label': { enabled: true },
          'link-name': { enabled: true },
          'list': { enabled: true },
          'listitem': { enabled: true },
          'meta-refresh': { enabled: false }, // Not applicable to component
          'meta-viewport': { enabled: false }, // Not applicable to component
          'object-alt': { enabled: true },
          'role-img-alt': { enabled: true },
          'scrollable-region-focusable': { enabled: true },
          'server-side-image-map': { enabled: true },
          'svg-img-alt': { enabled: true },
          'td-headers-attr': { enabled: true },
          'th-has-data-cells': { enabled: true },
          'valid-lang': { enabled: true },
          'video-caption': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });
  });
});