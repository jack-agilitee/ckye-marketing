import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeatureSection from './FeatureSection';

describe('FeatureSection', () => {
  // Setup
  const defaultProps = {
    heading: 'Test Feature Heading',
    bodyText: 'This is the test body text for the feature section component.',
    image: {
      src: '/test-image.jpg',
      alt: 'Test image description',
    },
    layout: 'image-left' as const,
  };

  const renderComponent = (props = {}) => {
    return render(<FeatureSection {...defaultProps} {...props} />);
  };

  // Rendering Tests
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderComponent();
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should render as a section element', () => {
      const { container } = renderComponent();
      expect(container.firstChild?.nodeName).toBe('SECTION');
    });

    it('should have proper semantic structure', () => {
      const { container } = renderComponent();
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  // Content Rendering Tests
  describe('Content Rendering', () => {
    it('should display the heading text', () => {
      renderComponent({ heading: 'Custom Heading' });
      expect(screen.getByRole('heading', { level: 2, name: 'Custom Heading' })).toBeInTheDocument();
    });

    it('should display the body text', () => {
      renderComponent({ bodyText: 'Custom body text content' });
      expect(screen.getByText('Custom body text content')).toBeInTheDocument();
    });

    it('should render heading as h2 element', () => {
      renderComponent();
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading.tagName).toBe('H2');
    });

    it('should render body text as paragraph element', () => {
      const { container } = renderComponent();
      const paragraph = container.querySelector('p');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveTextContent(defaultProps.bodyText);
    });
  });

  // Image Rendering Tests
  describe('Image Rendering', () => {
    it('should render image with correct src', () => {
      renderComponent({ image: { src: '/custom-image.jpg', alt: 'Custom alt text' } });
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/custom-image.jpg');
    });

    it('should render image with correct alt text', () => {
      renderComponent({ image: { src: '/test.jpg', alt: 'Descriptive alt text' } });
      expect(screen.getByAltText('Descriptive alt text')).toBeInTheDocument();
    });

    it('should render image without fill attribute in DOM', () => {
      renderComponent();
      const image = screen.getByRole('img');
      // The fill prop is handled by Next.js and shouldn't appear in the DOM
      expect(image).not.toHaveAttribute('fill');
    });

    it('should render image without priority attribute in DOM', () => {
      renderComponent();
      const image = screen.getByRole('img');
      // The priority prop is handled by Next.js and shouldn't appear in the DOM
      expect(image).not.toHaveAttribute('priority');
    });
  });

  // Layout Tests
  describe('Layout Variations', () => {
    it('should apply image-left layout class', () => {
      const { container } = renderComponent({ layout: 'image-left' });
      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('image-left');
    });

    it('should apply image-right layout class', () => {
      const { container } = renderComponent({ layout: 'image-right' });
      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('image-right');
    });

    it('should always have base featureSection class', () => {
      const { container } = renderComponent();
      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('featureSection');
    });

    it('should handle layout prop changes', () => {
      const { container, rerender } = renderComponent({ layout: 'image-left' });
      let section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('image-left');
      expect(section).not.toHaveClass('image-right');

      rerender(<FeatureSection {...defaultProps} layout="image-right" />);
      section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('image-right');
      expect(section).not.toHaveClass('image-left');
    });
  });

  // CSS Classes Tests
  describe('CSS Classes', () => {
    it('should apply custom className when provided', () => {
      const { container } = renderComponent({ className: 'custom-class' });
      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('custom-class');
    });

    it('should apply multiple classes correctly', () => {
      const { container } = renderComponent({ 
        className: 'custom-class another-class',
        layout: 'image-right'
      });
      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('featureSection');
      expect(section).toHaveClass('image-right');
      expect(section).toHaveClass('custom-class');
      expect(section).toHaveClass('another-class');
    });

    it('should handle undefined className gracefully', () => {
      const { container } = renderComponent({ className: undefined });
      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('featureSection');
      expect(section.className).not.toContain('undefined');
    });

    it('should handle empty string className', () => {
      const { container } = renderComponent({ className: '' });
      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('featureSection');
    });

    it('should apply correct CSS module classes to child elements', () => {
      const { container } = renderComponent();
      
      // Check container div
      expect(container.querySelector('.container')).toBeInTheDocument();
      
      // Check image wrapper
      expect(container.querySelector('.imageWrapper')).toBeInTheDocument();
      
      // Check content wrapper
      expect(container.querySelector('.content')).toBeInTheDocument();
      
      // Check heading class
      expect(container.querySelector('.heading')).toBeInTheDocument();
      
      // Check body text class
      expect(container.querySelector('.bodyText')).toBeInTheDocument();
      
      // Check image class
      expect(container.querySelector('.image')).toBeInTheDocument();
    });
  });

  // Props Validation Tests
  describe('Props Validation', () => {
    it('should handle empty heading', () => {
      renderComponent({ heading: '' });
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('');
    });

    it('should handle empty body text', () => {
      const { container } = renderComponent({ bodyText: '' });
      const paragraph = container.querySelector('p');
      expect(paragraph?.tagName).toBe('P');
      expect(paragraph?.textContent).toBe('');
    });

    it('should handle special characters in text content', () => {
      const specialText = 'Special chars: !@#$%^&*()_+-={}[]|\\:";\'<>?,./';
      renderComponent({ 
        heading: specialText,
        bodyText: specialText 
      });
      expect(screen.getByRole('heading', { name: specialText })).toBeInTheDocument();
      expect(screen.getAllByText(specialText)).toHaveLength(2); // heading and body
    });

    it('should handle long text content', () => {
      const longText = 'This is a very long text '.repeat(50);
      const { container } = renderComponent({ 
        heading: longText,
        bodyText: longText 
      });
      const heading = screen.getByRole('heading');
      const paragraph = container.querySelector('p');
      
      expect(heading.textContent).toBe(longText);
      expect(paragraph?.textContent).toBe(longText);
      expect(heading.textContent?.length).toBeGreaterThan(100);
    });

    it('should handle HTML entities in text', () => {
      const textWithEntities = 'AT&T - Johnson & Johnson - Ben & Jerry\'s';
      renderComponent({ 
        heading: textWithEntities,
        bodyText: textWithEntities 
      });
      expect(screen.getByRole('heading', { name: textWithEntities })).toBeInTheDocument();
      expect(screen.getAllByText(textWithEntities)).toHaveLength(2);
    });
  });

  // Image Props Tests
  describe('Image Props', () => {
    it('should handle different image extensions', () => {
      const imageTypes = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
      
      imageTypes.forEach((ext, index) => {
        const { container } = renderComponent({ 
          image: { 
            src: `/test-image${ext}`, 
            alt: `Test ${ext} image` 
          }
        });
        const image = container.querySelector('img');
        expect(image).toHaveAttribute('src', `/test-image${ext}`);
        expect(image).toHaveAttribute('alt', `Test ${ext} image`);
      });
    });

    it('should handle external image URLs', () => {
      renderComponent({ 
        image: { 
          src: 'https://example.com/image.jpg', 
          alt: 'External image' 
        }
      });
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should handle empty alt text', () => {
      const { container } = renderComponent({ 
        image: { 
          src: '/test.jpg', 
          alt: '' 
        }
      });
      const image = container.querySelector('img');
      expect(image).toHaveAttribute('alt', '');
    });

    it('should handle alt text with special characters', () => {
      const altText = 'Image with "quotes" & ampersands < > symbols';
      renderComponent({ 
        image: { 
          src: '/test.jpg', 
          alt: altText 
        }
      });
      expect(screen.getByAltText(altText)).toBeInTheDocument();
    });
  });

  // Structure and DOM Tests
  describe('DOM Structure', () => {
    it('should have correct DOM hierarchy', () => {
      const { container } = renderComponent();
      
      // section > div.container > [div.imageWrapper, div.content]
      const section = container.querySelector('section');
      const containerDiv = section?.querySelector('.container');
      const imageWrapper = containerDiv?.querySelector('.imageWrapper');
      const contentDiv = containerDiv?.querySelector('.content');
      const heading = contentDiv?.querySelector('h2.heading');
      const bodyText = contentDiv?.querySelector('p.bodyText');
      const image = imageWrapper?.querySelector('img.image');

      expect(section).toBeInTheDocument();
      expect(containerDiv).toBeInTheDocument();
      expect(imageWrapper).toBeInTheDocument();
      expect(contentDiv).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(bodyText).toBeInTheDocument();
      expect(image).toBeInTheDocument();
    });

    it('should maintain proper parent-child relationships', () => {
      const { container } = renderComponent();
      
      const section = container.querySelector('section');
      const containerDiv = container.querySelector('.container');
      const imageWrapper = container.querySelector('.imageWrapper');
      const contentDiv = container.querySelector('.content');

      expect(containerDiv?.parentElement).toBe(section);
      expect(imageWrapper?.parentElement).toBe(containerDiv);
      expect(contentDiv?.parentElement).toBe(containerDiv);
    });
  });

  // Integration Tests
  describe('Component Integration', () => {
    it('should work with all props provided', () => {
      const allProps = {
        heading: 'Integration Test Heading',
        bodyText: 'Integration test body text with comprehensive content.',
        image: {
          src: '/integration-test.jpg',
          alt: 'Integration test image'
        },
        layout: 'image-right' as const,
        className: 'integration-test-class'
      };

      const { container } = renderComponent(allProps);

      expect(screen.getByRole('heading', { name: allProps.heading })).toBeInTheDocument();
      expect(screen.getByText(allProps.bodyText)).toBeInTheDocument();
      expect(screen.getByAltText(allProps.image.alt)).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', allProps.image.src);
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('featureSection');
      expect(section).toHaveClass('image-right');
      expect(section).toHaveClass('integration-test-class');
    });

    it('should work with minimal required props', () => {
      const minimalProps = {
        heading: 'Min',
        bodyText: 'Min body',
        image: {
          src: '/min.jpg',
          alt: 'Min'
        },
        layout: 'image-left' as const
      };

      const { container } = renderComponent(minimalProps);

      expect(screen.getByRole('heading', { name: 'Min' })).toBeInTheDocument();
      expect(screen.getByText('Min body')).toBeInTheDocument();
      expect(screen.getByAltText('Min')).toBeInTheDocument();
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('featureSection');
      expect(section).toHaveClass('image-left');
    });
  });

  // Snapshot Tests
  describe('Snapshot Tests', () => {
    it('should match snapshot with image-left layout', () => {
      const { container } = renderComponent({ layout: 'image-left' });
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with image-right layout', () => {
      const { container } = renderComponent({ layout: 'image-right' });
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with custom className', () => {
      const { container } = renderComponent({ 
        className: 'custom-feature-section',
        layout: 'image-left'
      });
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with different content', () => {
      const { container } = renderComponent({
        heading: 'Different Heading for Snapshot',
        bodyText: 'Different body text content for comprehensive snapshot testing.',
        image: {
          src: '/different-image.jpg',
          alt: 'Different image for snapshot'
        },
        layout: 'image-right'
      });
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});