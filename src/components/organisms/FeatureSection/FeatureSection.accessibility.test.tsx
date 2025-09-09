import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import FeatureSection from './FeatureSection';

expect.extend(toHaveNoViolations);

describe('FeatureSection Accessibility', () => {
  // Setup
  const defaultProps = {
    heading: 'Accessible Feature Heading',
    bodyText: 'This feature section provides accessible content for all users including those using screen readers and keyboard navigation.',
    image: {
      src: '/accessible-feature-image.jpg',
      alt: 'A descriptive alternative text that explains the image content for screen reader users',
    },
    layout: 'image-left' as const,
  };

  const renderComponent = (props = {}) => {
    return render(<FeatureSection {...defaultProps} {...props} />);
  };

  // Core Accessibility Tests
  describe('WCAG Compliance', () => {
    it('should have no accessibility violations', async () => {
      const { container } = renderComponent();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with image-right layout', async () => {
      const { container } = renderComponent({ layout: 'image-right' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with custom className', async () => {
      const { container } = renderComponent({ 
        className: 'custom-accessible-class',
        layout: 'image-left' 
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with long content', async () => {
      const longContent = {
        heading: 'This is a very long heading that tests accessibility with extended content ' +
                 'to ensure screen readers can properly navigate and announce lengthy text content',
        bodyText: 'This is comprehensive body text content that spans multiple lines and provides ' +
                 'detailed information about the feature being described. It includes various ' +
                 'punctuation marks, numbers like 123 and 456, and ensures that screen readers ' +
                 'can properly parse and announce all the content without any accessibility issues.',
      };
      
      const { container } = renderComponent(longContent);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // Semantic HTML and Landmark Tests
  describe('Semantic Structure', () => {
    it('should use semantic section element', () => {
      const { container } = renderComponent();
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section?.tagName).toBe('SECTION');
    });

    it('should have proper heading hierarchy with h2', () => {
      renderComponent();
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('should maintain heading hierarchy in context', () => {
      // Test that h2 is appropriate as a subsection heading
      renderComponent();
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0].tagName).toBe('H2');
    });

    it('should use paragraph element for body text', () => {
      const { container } = renderComponent();
      const paragraph = container.querySelector('p');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.tagName).toBe('P');
    });
  });

  // Image Accessibility Tests
  describe('Image Accessibility', () => {
    it('should have meaningful alt text', () => {
      renderComponent({
        image: {
          src: '/test-image.jpg',
          alt: 'A detailed description of the image that provides context and meaning to screen reader users'
        }
      });
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'A detailed description of the image that provides context and meaning to screen reader users');
    });

    it('should handle empty alt text for decorative images', () => {
      const { container } = renderComponent({
        image: {
          src: '/decorative-image.jpg',
          alt: ''
        }
      });
      
      const image = container.querySelector('img');
      expect(image).toHaveAttribute('alt', '');
    });

    it('should not have redundant alt text', () => {
      // Test that alt text doesn't repeat the heading
      renderComponent({
        heading: 'Advanced Analytics Dashboard',
        image: {
          src: '/analytics.jpg',
          alt: 'Screenshot showing various charts, graphs, and data visualizations in the analytics interface'
        }
      });
      
      const image = screen.getByRole('img');
      const altText = image.getAttribute('alt');
      const heading = screen.getByRole('heading', { level: 2 });
      
      expect(altText).not.toBe(heading.textContent);
      expect(altText).toContain('charts'); // Should describe the image content
    });

    it('should handle special characters in alt text', () => {
      renderComponent({
        image: {
          src: '/special-chars.jpg',
          alt: 'Image showing "quotes", ampersands & symbols, and other special characters: <>, [], {}'
        }
      });
      
      const image = screen.getByRole('img');
      expect(image).toHaveAccessibleName('Image showing "quotes", ampersands & symbols, and other special characters: <>, [], {}');
    });
  });

  // Keyboard Navigation Tests
  describe('Keyboard Accessibility', () => {
    it('should not trap keyboard focus', () => {
      const { container } = renderComponent();
      
      // The component should not contain any focusable elements that trap focus
      // Since this is a display component, it shouldn't interfere with tab navigation
      const section = container.querySelector('section');
      expect(section).not.toHaveAttribute('tabindex');
    });

    it('should not have any elements with negative tabindex', () => {
      const { container } = renderComponent();
      const elementsWithTabIndex = container.querySelectorAll('[tabindex]');
      
      elementsWithTabIndex.forEach(element => {
        const tabIndex = element.getAttribute('tabindex');
        expect(parseInt(tabIndex || '0')).toBeGreaterThanOrEqual(0);
      });
    });

    it('should allow keyboard users to scroll past the component', () => {
      // Test that the component doesn't interfere with keyboard navigation
      const { container } = renderComponent();
      const section = container.querySelector('section');
      
      // Should not have focus traps or keyboard event handlers that prevent navigation
      expect(section).not.toHaveAttribute('onkeydown');
      expect(section).not.toHaveAttribute('onkeyup');
      expect(section).not.toHaveAttribute('onkeypress');
    });
  });

  // Screen Reader Tests
  describe('Screen Reader Accessibility', () => {
    it('should have proper reading order', () => {
      const { container } = renderComponent();
      
      // Test that content flows logically for screen readers
      const allText = container.textContent;
      const heading = defaultProps.heading;
      const body = defaultProps.bodyText;
      
      const headingIndex = allText?.indexOf(heading) || 0;
      const bodyIndex = allText?.indexOf(body) || 0;
      
      // Heading should come before body text in reading order
      expect(headingIndex).toBeLessThan(bodyIndex);
    });

    it('should have appropriate text content for screen readers', () => {
      renderComponent();
      
      // Check that all text content is accessible
      expect(screen.getByText(defaultProps.heading)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.bodyText)).toBeInTheDocument();
      expect(screen.getByAltText(defaultProps.image.alt)).toBeInTheDocument();
    });

    it('should not have hidden text that confuses screen readers', () => {
      const { container } = renderComponent();
      
      // Check for hidden content that might confuse screen readers
      const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenElements).toHaveLength(0);
      
      const visuallyHiddenElements = container.querySelectorAll('.sr-only, .visually-hidden');
      // If there are visually hidden elements, they should have meaningful content
      visuallyHiddenElements.forEach(element => {
        if (element.textContent) {
          expect(element.textContent.trim()).not.toBe('');
        }
      });
    });
  });

  // Color and Contrast Tests
  describe('Visual Accessibility', () => {
    it('should pass color contrast checks', async () => {
      const { container } = renderComponent();
      
      // Use axe to specifically test color contrast
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      expect(results).toHaveNoViolations();
    });

    it('should not rely solely on color to convey information', async () => {
      const { container } = renderComponent();
      
      // Test that information is not conveyed through color alone
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true },
          'link-in-text-block': { enabled: true }
        }
      });
      expect(results).toHaveNoViolations();
    });
  });

  // ARIA and Labels Tests
  describe('ARIA and Labels', () => {
    it('should have proper accessible names', () => {
      renderComponent();
      
      const heading = screen.getByRole('heading', { level: 2 });
      const image = screen.getByRole('img');
      
      expect(heading).toHaveAccessibleName(defaultProps.heading);
      expect(image).toHaveAccessibleName(defaultProps.image.alt);
    });

    it('should not have unnecessary ARIA attributes', () => {
      const { container } = renderComponent();
      
      // Check that ARIA attributes are not overused
      const elementsWithAriaLabel = container.querySelectorAll('[aria-label]');
      const elementsWithAriaLabelledby = container.querySelectorAll('[aria-labelledby]');
      
      // For a simple display component, these should be minimal or non-existent
      // unless there's a specific accessibility need
      expect(elementsWithAriaLabel.length).toBeLessThan(3);
      expect(elementsWithAriaLabelledby.length).toBeLessThan(3);
    });

    it('should not have conflicting accessibility attributes', () => {
      const { container } = renderComponent();
      
      // Elements should not have conflicting accessibility attributes
      const elementsWithBothLabelAndLabelledby = container.querySelectorAll('[aria-label][aria-labelledby]');
      expect(elementsWithBothLabelAndLabelledby.length).toBe(0);
    });
  });

  // Layout Accessibility Tests
  describe('Layout Accessibility', () => {
    it('should maintain accessibility in image-left layout', async () => {
      const { container } = renderComponent({ layout: 'image-left' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      
      // Verify content order is still logical
      const allText = container.textContent;
      const headingIndex = allText?.indexOf(defaultProps.heading) || 0;
      const bodyIndex = allText?.indexOf(defaultProps.bodyText) || 0;
      expect(headingIndex).toBeLessThan(bodyIndex);
    });

    it('should maintain accessibility in image-right layout', async () => {
      const { container } = renderComponent({ layout: 'image-right' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      
      // Verify content order is still logical regardless of visual layout
      const allText = container.textContent;
      const headingIndex = allText?.indexOf(defaultProps.heading) || 0;
      const bodyIndex = allText?.indexOf(defaultProps.bodyText) || 0;
      expect(headingIndex).toBeLessThan(bodyIndex);
    });

    it('should handle responsive design accessibility', async () => {
      // Test that accessibility is maintained across different viewport sizes
      const { container } = renderComponent();
      
      // Test with mobile viewport simulation
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // Error Handling and Edge Cases
  describe('Accessibility Edge Cases', () => {
    it('should handle empty body text accessibility', async () => {
      const { container } = renderComponent({
        heading: 'Valid heading',
        bodyText: '',
        image: {
          src: '/test.jpg',
          alt: 'Test image'
        }
      });
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should handle very long content accessibility', async () => {
      const longContent = 'Very long content '.repeat(100);
      
      const { container } = renderComponent({
        heading: longContent,
        bodyText: longContent
      });
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should handle special characters in content', async () => {
      const specialContent = 'Content with special chars: àáâãäåæçèéêë & "quotes" & <tags>';
      
      const { container } = renderComponent({
        heading: specialContent,
        bodyText: specialContent,
        image: {
          src: '/test.jpg',
          alt: specialContent
        }
      });
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});