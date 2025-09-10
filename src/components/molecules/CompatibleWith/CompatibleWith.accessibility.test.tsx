import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CompatibleWith, CompatibleWithProps } from './CompatibleWith';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, priority, className }: any) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        data-priority={priority}
        data-testid="mocked-image"
      />
    );
  };
});

// Mock the SCSS module
jest.mock('./CompatibleWith.module.scss', () => ({
  'compatible-with': 'compatible-with',
  'compatible-with__container': 'compatible-with__container',
  'compatible-with__header': 'compatible-with__header',
  'compatible-with__models': 'compatible-with__models',
  'compatible-with__model': 'compatible-with__model',
  'compatible-with__logo': 'compatible-with__logo',
}));

describe('CompatibleWith Accessibility Tests (WCAG 2.1 AA Compliance)', () => {
  const renderComponent = (props: Partial<CompatibleWithProps> = {}) => {
    return render(<CompatibleWith {...props} />);
  };

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations (default state)', async () => {
      const { container } = renderComponent();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with custom className', async () => {
      const { container } = renderComponent({ className: 'custom-class' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with multiple classes', async () => {
      const { container } = renderComponent({ className: 'class1 class2 class3' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility audit with strict rules', async () => {
      const { container } = renderComponent();
      const results = await axe(container, {
        rules: {
          // Enable strict accessibility rules
          'color-contrast': { enabled: false }, // Disabled due to jsdom limitations
          'landmark-one-main': { enabled: true },
          'region': { enabled: true },
          'heading-order': { enabled: true },
          'list': { enabled: true },
          'listitem': { enabled: true },
          'image-alt': { enabled: true },
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
        }
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Semantic Structure (WCAG 1.3.1 - Info and Relationships)', () => {
    it('should use proper semantic HTML elements', () => {
      renderComponent();
      
      // Section should be present for content grouping
      expect(screen.getByRole('region')).toBeInTheDocument();
      
      // Heading should be present for content hierarchy
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      
      // List structure should be used for model items
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('should have proper heading hierarchy', () => {
      renderComponent();
      const heading = screen.getByRole('heading');
      
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
      expect(heading).toHaveTextContent('Compatible With:');
    });

    it('should use semantic list structure correctly', () => {
      renderComponent();
      const list = screen.getByRole('list');
      const listItems = screen.getAllByRole('listitem');
      
      // List should contain all list items
      listItems.forEach(item => {
        expect(list).toContainElement(item);
      });
      
      // Each list item should contain an image
      listItems.forEach(item => {
        const image = item.querySelector('img');
        expect(image).toBeInTheDocument();
      });
    });

    it('should have proper content organization', () => {
      const { container } = renderComponent();
      const section = container.querySelector('section');
      const heading = screen.getByRole('heading');
      const list = screen.getByRole('list');
      
      // Verify proper nesting
      expect(section).toContainElement(heading);
      expect(section).toContainElement(list);
      
      // Both heading and list should be within the same container div
      const containerDiv = section?.querySelector('.compatible-with__container');
      expect(containerDiv).toContainElement(heading);
      expect(containerDiv).toContainElement(list);
      
      // Heading should come before the list in DOM order
      const allElements = Array.from(containerDiv?.querySelectorAll('*') || []);
      const headingIndex = allElements.indexOf(heading);
      const listIndex = allElements.indexOf(list);
      expect(headingIndex).toBeLessThan(listIndex);
    });
  });

  describe('Meaningful Sequence (WCAG 1.3.2)', () => {
    it('should present content in logical reading order', () => {
      renderComponent();
      const heading = screen.getByRole('heading');
      const list = screen.getByRole('list');
      
      // Get DOM order
      const allElements = screen.getByRole('region').querySelectorAll('*');
      const elementsArray = Array.from(allElements);
      const headingIndex = elementsArray.indexOf(heading);
      const listIndex = elementsArray.indexOf(list);
      
      expect(headingIndex).toBeLessThan(listIndex);
    });

    it('should maintain logical model presentation order', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      const expectedOrder = [
        'Claude AI logo',
        'Google Gemini logo', 
        'GitHub Copilot logo'
      ];
      
      images.forEach((image, index) => {
        expect(image).toHaveAttribute('alt', expectedOrder[index]);
      });
    });
  });

  describe('Images and Media (WCAG 1.1.1 - Non-text Content)', () => {
    it('should have meaningful alt text for all images', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      
      images.forEach(image => {
        const altText = image.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText).not.toBe('');
        expect(altText?.length).toBeGreaterThan(0);
      });
    });

    it('should have descriptive and informative alt text', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      const expectedAltTexts = [
        'Claude AI logo',
        'Google Gemini logo',
        'GitHub Copilot logo'
      ];
      
      images.forEach((image, index) => {
        const altText = image.getAttribute('alt');
        expect(altText).toBe(expectedAltTexts[index]);
        expect(altText).toContain('logo');
      });
    });

    it('should not have empty or whitespace-only alt text', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      
      images.forEach(image => {
        const altText = image.getAttribute('alt');
        expect(altText?.trim()).toBeTruthy();
        expect(altText?.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have alt text that describes the purpose/function', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      
      images.forEach(image => {
        const altText = image.getAttribute('alt');
        // Alt text should indicate this is a logo, which helps users understand
        // these are brand identifiers for AI models
        expect(altText).toMatch(/logo/i);
      });
    });
  });

  describe('Programmatic Determination (WCAG 4.1.2)', () => {
    it('should use proper ARIA roles and properties', () => {
      renderComponent();
      
      // Section should have region role and aria-label
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('aria-label', 'AI models compatibility');
      
      // List should have proper list role
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      
      // List items should have proper listitem role
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    it('should have appropriate ARIA labels for context', () => {
      renderComponent();
      const section = screen.getByRole('region');
      const ariaLabel = section.getAttribute('aria-label');
      
      expect(ariaLabel).toBe('AI models compatibility');
      expect(ariaLabel).toBeTruthy();
    });

    it('should maintain proper element relationships', () => {
      renderComponent();
      const list = screen.getByRole('list');
      const listItems = screen.getAllByRole('listitem');
      
      // All list items should be children of the list
      listItems.forEach(item => {
        expect(list).toContainElement(item);
      });
    });
  });

  describe('Page Structure (WCAG 2.4.6 - Headings and Labels)', () => {
    it('should have descriptive section heading', () => {
      renderComponent();
      const heading = screen.getByRole('heading', { level: 2 });
      
      expect(heading).toHaveTextContent('Compatible With:');
      expect(heading.textContent?.trim()).toBeTruthy();
    });

    it('should use appropriate heading level', () => {
      renderComponent();
      const heading = screen.getByRole('heading');
      
      expect(heading.tagName).toBe('H2');
      expect(heading).toHaveAttribute('class', 'compatible-with__header');
    });

    it('should provide clear content structure', () => {
      renderComponent();
      
      // Should have one main heading
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      
      // Should have clear content sections
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });

  describe('Navigation and Landmarks (WCAG 2.4.1)', () => {
    it('should provide appropriate landmarks', () => {
      renderComponent();
      const region = screen.getByRole('region');
      
      expect(region).toBeInTheDocument();
      expect(region.tagName).toBe('SECTION');
      expect(region).toHaveAttribute('aria-label');
    });

    it('should have meaningful region label', () => {
      renderComponent();
      const region = screen.getByRole('region');
      const ariaLabel = region.getAttribute('aria-label');
      
      expect(ariaLabel).toBe('AI models compatibility');
      expect(ariaLabel).toMatch(/compatibility/i);
    });
  });

  describe('Content Organization (WCAG 1.3.1)', () => {
    it('should group related content appropriately', () => {
      renderComponent();
      
      // All models should be grouped in a list
      const list = screen.getByRole('list');
      const listItems = screen.getAllByRole('listitem');
      
      expect(listItems).toHaveLength(3);
      listItems.forEach(item => {
        expect(list).toContainElement(item);
      });
    });

    it('should maintain content relationships', () => {
      renderComponent();
      
      // Heading should relate to the content that follows
      const heading = screen.getByText('Compatible With:');
      const list = screen.getByRole('list');
      const region = screen.getByRole('region');
      
      expect(region).toContainElement(heading);
      expect(region).toContainElement(list);
    });
  });

  describe('Assistive Technology Support', () => {
    it('should be properly announced by screen readers', () => {
      renderComponent();
      
      // Region should be announced with its label
      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-label', 'AI models compatibility');
      
      // Heading should provide context
      expect(screen.getByRole('heading')).toHaveTextContent('Compatible With:');
      
      // List structure should be announced
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('should provide meaningful information for each element', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      
      images.forEach(image => {
        // Each image should have meaningful alt text
        const alt = image.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt).toMatch(/logo/i);
        
        // Images should have proper dimensions for context
        expect(image).toHaveAttribute('width');
        expect(image).toHaveAttribute('height');
      });
    });
  });

  describe('Mobile and Touch Accessibility', () => {
    it('should maintain accessibility on different viewport sizes', async () => {
      // Test with different viewport sizes
      const viewports = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1024, height: 768 }, // Desktop
      ];
      
      for (const viewport of viewports) {
        // Mock viewport size
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        });
        
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: viewport.height,
        });
        
        const { container } = renderComponent();
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('should maintain semantic structure across screen sizes', () => {
      renderComponent();
      
      // Core semantic elements should always be present
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
  });

  describe('Color and Contrast Independence (WCAG 1.4.1)', () => {
    it('should not rely solely on color for information', () => {
      renderComponent();
      
      // Component uses text and images for information, not just color
      expect(screen.getByText('Compatible With:')).toBeInTheDocument();
      
      // Each model is identified by its logo image with descriptive alt text
      const images = screen.getAllByTestId('mocked-image');
      images.forEach(image => {
        const alt = image.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt).toMatch(/logo/i);
      });
    });

    it('should provide information through multiple sensory characteristics', () => {
      renderComponent();
      
      // Information is conveyed through:
      // 1. Text label ("Compatible With:")
      // 2. Visual logos (images)
      // 3. Alt text for logos
      // 4. Semantic structure (list of items)
      
      expect(screen.getByText('Compatible With:')).toBeInTheDocument();
      expect(screen.getAllByTestId('mocked-image')).toHaveLength(3);
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });

  describe('Focus Management (WCAG 2.4.3)', () => {
    it('should not interfere with focus order', () => {
      renderComponent();
      
      // Component is presentational and should not trap or interfere with focus
      // Since there are no interactive elements, focus should pass through naturally
      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
      
      // No elements should have tabindex or focus-related attributes
      const allElements = region.querySelectorAll('*');
      Array.from(allElements).forEach(element => {
        expect(element).not.toHaveAttribute('tabindex');
      });
    });
  });

  describe('Language and Reading Level (WCAG 3.1.1)', () => {
    it('should use clear and understandable text', () => {
      renderComponent();
      
      // Heading text should be clear and concise
      const heading = screen.getByText('Compatible With:');
      expect(heading.textContent).toBe('Compatible With:');
      
      // Alt text should be descriptive but concise
      const images = screen.getAllByTestId('mocked-image');
      images.forEach(image => {
        const alt = image.getAttribute('alt');
        expect(alt?.split(' ').length).toBeLessThanOrEqual(4); // Keep alt text concise
      });
    });
  });

  describe('Error Prevention and Robust Code (WCAG 4.1.1)', () => {
    it('should generate valid HTML markup', async () => {
      const { container } = renderComponent();
      
      // Run axe tests focused on HTML validation
      const results = await axe(container, {
        rules: {
          'valid-lang': { enabled: true },
          'html-has-lang': { enabled: true },
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
          'duplicate-id': { enabled: true },
        }
      });
      
      expect(results).toHaveNoViolations();
    });

    it('should handle different prop combinations without accessibility errors', async () => {
      const propCombinations = [
        {},
        { className: 'test-class' },
        { className: 'multiple test classes' },
        { className: '' },
      ];
      
      for (const props of propCombinations) {
        const { container } = renderComponent(props);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });

  describe('Backwards Compatibility', () => {
    it('should maintain accessibility across different rendering contexts', async () => {
      // Test multiple renders to ensure consistency
      const { rerender, container } = renderComponent();
      let results = await axe(container);
      expect(results).toHaveNoViolations();
      
      rerender(<CompatibleWith className="updated-class" />);
      results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should work with different versions of assistive technology', () => {
      renderComponent();
      
      // Ensure component uses standard ARIA roles and HTML elements
      // that are widely supported across assistive technologies
      expect(screen.getByRole('region')).toBeInTheDocument(); // Standard HTML section
      expect(screen.getByRole('heading')).toBeInTheDocument(); // Standard HTML heading
      expect(screen.getByRole('list')).toBeInTheDocument(); // Standard HTML list
      expect(screen.getAllByRole('listitem')).toHaveLength(3); // Standard HTML list items
    });
  });
});