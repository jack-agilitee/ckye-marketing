import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Hero from './Hero';

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

// Mock the Button component
jest.mock('../atoms/Button/Button', () => {
  return function MockButton({ 
    children, 
    variant, 
    className, 
    'aria-label': ariaLabel,
    onClick,
    ...props 
  }: any) {
    return (
      <button
        className={className}
        aria-label={ariaLabel}
        onClick={onClick}
        data-variant={variant}
        {...props}
      >
        {children}
      </button>
    );
  };
});

describe('Hero Component', () => {
  // Setup
  const renderHero = (props: any = {}) => {
    return render(<Hero {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderHero();
      expect(screen.getByRole('region', { name: /ckye is a governed orchestration layer/i })).toBeInTheDocument();
    });

    it('should render as a semantic section element', () => {
      const { container } = renderHero();
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should apply correct base CSS classes', () => {
      const { container } = renderHero();
      const section = container.querySelector('section');
      expect(section).toHaveClass('hero');
    });

    it('should render the hero container', () => {
      const { container } = renderHero();
      const heroContainer = container.querySelector('.hero__container');
      expect(heroContainer).toBeInTheDocument();
    });

    it('should render the hero content area', () => {
      const { container } = renderHero();
      const heroContent = container.querySelector('.hero__content');
      expect(heroContent).toBeInTheDocument();
    });
  });

  // Props Tests
  describe('Props', () => {
    it('should handle optional className prop', () => {
      const { container } = renderHero({ className: 'custom-hero' });
      const section = container.querySelector('section');
      expect(section).toHaveClass('hero', 'custom-hero');
    });

    it('should handle empty className gracefully', () => {
      const { container } = renderHero({ className: '' });
      const section = container.querySelector('section');
      expect(section).toHaveClass('hero');
      expect(section?.className).toBe('hero ');
    });

    it('should handle undefined className gracefully', () => {
      const { container } = renderHero({ className: undefined });
      const section = container.querySelector('section');
      expect(section).toHaveClass('hero');
    });

    it('should handle multiple CSS classes', () => {
      const { container } = renderHero({ className: 'custom-hero additional-class' });
      const section = container.querySelector('section');
      expect(section).toHaveClass('hero', 'custom-hero', 'additional-class');
    });
  });

  // Content Tests
  describe('Text Content', () => {
    it('should display the correct tagline', () => {
      renderHero();
      expect(screen.getByText('/ sky /')).toBeInTheDocument();
    });

    it('should display the correct heading text', () => {
      renderHero();
      expect(screen.getByText('Ckye is a Governed Orchestration Layer for AI Coding Agents')).toBeInTheDocument();
    });

    it('should display the correct description text', () => {
      renderHero();
      expect(screen.getByText(/Ckye unlocks EBITA your current stack can't reach/)).toBeInTheDocument();
      expect(screen.getByText(/compressing timelines, cutting unit costs, and avoiding rework/)).toBeInTheDocument();
    });

    it('should display the CTA button text', () => {
      renderHero();
      expect(screen.getByRole('button', { name: 'Get started with Ckye' })).toBeInTheDocument();
      expect(screen.getByText('Get Ckye')).toBeInTheDocument();
    });

    it('should apply correct CSS classes to text elements', () => {
      const { container } = renderHero();
      
      expect(container.querySelector('.hero__tagline')).toBeInTheDocument();
      expect(container.querySelector('.hero__heading')).toBeInTheDocument();
      expect(container.querySelector('.hero__description')).toBeInTheDocument();
    });
  });

  // Semantic HTML and Accessibility Tests
  describe('Semantic HTML Structure', () => {
    it('should use semantic section element with proper aria-labelledby', () => {
      renderHero();
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
    });

    it('should use h1 heading with correct id', () => {
      renderHero();
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveAttribute('id', 'hero-heading');
      expect(heading).toHaveClass('hero__heading');
    });

    it('should use paragraph elements for tagline and description', () => {
      const { container } = renderHero();
      const tagline = container.querySelector('.hero__tagline');
      const description = container.querySelector('.hero__description');
      
      expect(tagline?.tagName).toBe('P');
      expect(description?.tagName).toBe('P');
    });

    it('should maintain proper heading hierarchy', () => {
      renderHero();
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      
      // Ensure no other heading levels are present that would break hierarchy
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0]).toBe(h1);
    });
  });

  // Button Component Integration Tests
  describe('CTA Button Integration', () => {
    it('should render Button component with correct props', () => {
      renderHero();
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('data-variant', 'secondary');
      expect(button).toHaveAttribute('aria-label', 'Get started with Ckye');
      expect(button).toHaveClass('hero__cta');
    });

    it('should handle button click interactions', async () => {
      const mockOnClick = jest.fn();
      const user = userEvent.setup();
      renderHero({ onCtaClick: mockOnClick });
      
      const button = screen.getByRole('button', { name: 'Get started with Ckye' });
      await user.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should be keyboard accessible', async () => {
      const mockOnClick = jest.fn();
      const user = userEvent.setup();
      renderHero({ onCtaClick: mockOnClick });
      
      const button = screen.getByRole('button', { name: 'Get started with Ckye' });
      
      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();
      
      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      
      // Reset mock and test Space key
      mockOnClick.mockClear();
      await user.keyboard(' ');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should be focusable via keyboard navigation', () => {
      renderHero();
      const button = screen.getByRole('button', { name: 'Get started with Ckye' });
      
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  // Responsive Image Tests
  describe('Responsive Image Implementation', () => {
    it('should render picture element with responsive sources', () => {
      const { container } = renderHero();
      const picture = container.querySelector('picture');
      expect(picture).toBeInTheDocument();
      expect(picture).toHaveClass('hero__image');
    });

    it('should have desktop source for large screens', () => {
      const { container } = renderHero();
      const desktopSource = container.querySelector('source[media="(min-width: 1024px)"]');
      expect(desktopSource).toBeInTheDocument();
      expect(desktopSource).toHaveAttribute('srcSet', '/content/hero--desktop.png');
    });

    it('should have tablet source for medium screens', () => {
      const { container } = renderHero();
      const tabletSource = container.querySelector('source[media="(min-width: 768px)"]');
      expect(tabletSource).toBeInTheDocument();
      expect(tabletSource).toHaveAttribute('srcSet', '/content/hero--tablet.png');
    });

    it('should have fallback mobile image', () => {
      renderHero();
      const img = screen.getByAltText(/ckye ai coding agents interface/i);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/content/hero--mobile.png');
    });

    it('should have proper image attributes', () => {
      renderHero();
      const img = screen.getByAltText(/ckye ai coding agents interface/i);
      
      expect(img).toHaveAttribute('width', '295');
      expect(img).toHaveAttribute('height', '312');
      // Note: priority prop is filtered out by Next.js Image mock in jest.setup.js
      expect(img).toHaveClass('hero__img');
    });

    it('should have descriptive alt text for accessibility', () => {
      renderHero();
      const img = screen.getByAltText('Ckye AI coding agents interface showing code orchestration and governance features');
      expect(img).toBeInTheDocument();
    });

    it('should apply correct CSS classes to image wrapper and elements', () => {
      const { container } = renderHero();
      
      const imageWrapper = container.querySelector('.hero__imageWrapper');
      const picture = container.querySelector('.hero__image');
      const img = container.querySelector('.hero__img');
      
      expect(imageWrapper).toBeInTheDocument();
      expect(picture).toBeInTheDocument();
      expect(img).toBeInTheDocument();
    });
  });

  // Layout and Structure Tests
  describe('Component Structure', () => {
    it('should have proper content hierarchy', () => {
      const { container } = renderHero();
      
      // Check main structure
      const section = container.querySelector('.hero');
      const heroContainer = section?.querySelector('.hero__container');
      const heroContent = heroContainer?.querySelector('.hero__content');
      const heroText = heroContent?.querySelector('.hero__text');
      const imageWrapper = heroContainer?.querySelector('.hero__imageWrapper');
      
      expect(section).toBeInTheDocument();
      expect(heroContainer).toBeInTheDocument();
      expect(heroContent).toBeInTheDocument();
      expect(heroText).toBeInTheDocument();
      expect(imageWrapper).toBeInTheDocument();
    });

    it('should have correct text element order', () => {
      const { container } = renderHero();
      const heroText = container.querySelector('.hero__text');
      const children = Array.from(heroText?.children || []);
      
      expect(children).toHaveLength(3);
      expect(children[0]).toHaveClass('hero__tagline');
      expect(children[1]).toHaveClass('hero__heading');
      expect(children[2]).toHaveClass('hero__description');
    });

    it('should have button after text content', () => {
      const { container } = renderHero();
      const heroContent = container.querySelector('.hero__content');
      const children = Array.from(heroContent?.children || []);
      
      expect(children).toHaveLength(2);
      expect(children[0]).toHaveClass('hero__text');
      expect(children[1]).toHaveClass('hero__cta');
    });

    it('should have image wrapper after content', () => {
      const { container } = renderHero();
      const heroContainer = container.querySelector('.hero__container');
      const children = Array.from(heroContainer?.children || []);
      
      expect(children).toHaveLength(2);
      expect(children[0]).toHaveClass('hero__content');
      expect(children[1]).toHaveClass('hero__imageWrapper');
    });
  });

  // Integration with Next.js Image Tests
  describe('Next.js Image Integration', () => {
    it('should work with mocked Next.js Image component', () => {
      renderHero();
      const img = screen.getByAltText(/ckye ai coding agents interface/i);
      
      // Verify the mock is working and essential props are applied
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/content/hero--mobile.png');
      expect(img).toHaveAttribute('alt', 'Ckye AI coding agents interface showing code orchestration and governance features');
    });

    it('should handle priority loading correctly', () => {
      renderHero();
      const img = screen.getByAltText(/ckye ai coding agents interface/i);
      
      // The priority prop should be passed through (though filtered by mock)
      expect(img).toBeInTheDocument();
    });
  });

  // Performance and Edge Cases
  describe('Edge Cases and Performance', () => {
    it('should handle component re-renders without errors', () => {
      const { rerender } = renderHero();
      
      expect(() => {
        rerender(<Hero className="updated-class" />);
      }).not.toThrow();
      
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('should handle rapid prop changes', () => {
      const { rerender } = renderHero();
      
      // Simulate rapid className changes
      rerender(<Hero className="class-1" />);
      rerender(<Hero className="class-2" />);
      rerender(<Hero className="class-3" />);
      
      const section = screen.getByRole('region');
      expect(section).toHaveClass('hero', 'class-3');
    });

    it('should maintain component stability across renders', () => {
      const { container, rerender } = renderHero();
      const initialSection = container.querySelector('.hero');
      
      rerender(<Hero />);
      const rerenderedSection = container.querySelector('.hero');
      
      expect(initialSection).toBe(rerenderedSection);
    });

    it('should handle missing optional props gracefully', () => {
      expect(() => {
        render(<Hero />);
      }).not.toThrow();
      
      expect(screen.getByRole('region')).toBeInTheDocument();
    });
  });

  // Content Validation Tests
  describe('Content Validation', () => {
    it('should have consistent content across renders', () => {
      const { rerender } = renderHero();
      
      expect(screen.getByText('/ sky /')).toBeInTheDocument();
      expect(screen.getByText('Ckye is a Governed Orchestration Layer for AI Coding Agents')).toBeInTheDocument();
      
      rerender(<Hero className="test" />);
      
      expect(screen.getByText('/ sky /')).toBeInTheDocument();
      expect(screen.getByText('Ckye is a Governed Orchestration Layer for AI Coding Agents')).toBeInTheDocument();
    });

    it('should not contain any unexpected text content', () => {
      renderHero();
      
      // Should not contain common error messages or debugging text
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/null/i)).not.toBeInTheDocument();
    });

    it('should have proper text formatting and punctuation', () => {
      renderHero();
      
      const tagline = screen.getByText('/ sky /');
      const description = screen.getByText(/Ckye unlocks EBITA your current stack can't reach, compressing timelines, cutting unit costs, and avoiding rework./);
      
      expect(tagline.textContent).toBe('/ sky /');
      expect(description.textContent?.endsWith('.')).toBe(true);
    });
  });

  // Accessibility Foundation Tests (basic ones for unit tests)
  describe('Basic Accessibility Features', () => {
    it('should have proper ARIA relationship between section and heading', () => {
      renderHero();
      const section = screen.getByRole('region');
      const heading = screen.getByRole('heading', { level: 1 });
      
      expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
      expect(heading).toHaveAttribute('id', 'hero-heading');
    });

    it('should have accessible button with proper labeling', () => {
      renderHero();
      const button = screen.getByRole('button', { name: 'Get started with Ckye' });
      expect(button).toHaveAccessibleName('Get started with Ckye');
    });

    it('should use semantic HTML elements', () => {
      renderHero();
      
      expect(screen.getByRole('region')).toBeInTheDocument(); // section
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument(); // h1
      expect(screen.getByRole('button')).toBeInTheDocument(); // button
      expect(screen.getByRole('img')).toBeInTheDocument(); // img
    });

    it('should maintain focus management for CTA button', async () => {
      const mockOnClick = jest.fn();
      const user = userEvent.setup();
      renderHero({ onCtaClick: mockOnClick });
      
      const button = screen.getByRole('button', { name: 'Get started with Ckye' });
      
      // Should be focusable
      await user.tab();
      expect(button).toHaveFocus();
      
      // Should be activatable while focused
      await user.keyboard('{Enter}');
      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  // New Props Tests
  describe('Custom Props', () => {
    it('should render with custom tagline', () => {
      renderHero({ tagline: '/ innovation /' });
      expect(screen.getByText('/ innovation /')).toBeInTheDocument();
    });

    it('should render with custom heading', () => {
      renderHero({ heading: 'Custom Heading Text' });
      expect(screen.getByRole('heading', { name: 'Custom Heading Text' })).toBeInTheDocument();
    });

    it('should render with custom description', () => {
      renderHero({ description: 'Custom description text here' });
      expect(screen.getByText('Custom description text here')).toBeInTheDocument();
    });

    it('should render with custom CTA text', () => {
      renderHero({ ctaText: 'Start Free Trial' });
      expect(screen.getByRole('button', { name: 'Get started with Ckye' })).toHaveTextContent('Start Free Trial');
    });

    it('should render with custom CTA aria-label', () => {
      renderHero({ ctaAriaLabel: 'Begin your journey' });
      expect(screen.getByRole('button', { name: 'Begin your journey' })).toBeInTheDocument();
    });

    it('should handle custom onClick callback', async () => {
      const customOnClick = jest.fn();
      const user = userEvent.setup();
      
      renderHero({ onCtaClick: customOnClick });
      const button = screen.getByRole('button');
      
      await user.click(button);
      expect(customOnClick).toHaveBeenCalled();
    });

    it('should render with custom images', () => {
      const customImages = {
        desktop: '/custom/desktop.jpg',
        tablet: '/custom/tablet.jpg',
        mobile: '/custom/mobile.jpg',
        alt: 'Custom alt text'
      };
      
      renderHero({ images: customImages });
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Custom alt text');
      expect(image).toHaveAttribute('src', '/custom/mobile.jpg');
      
      // Check picture sources
      const picture = image.closest('picture');
      const sources = picture?.querySelectorAll('source');
      expect(sources?.[0]).toHaveAttribute('srcSet', '/custom/desktop.jpg');
      expect(sources?.[1]).toHaveAttribute('srcSet', '/custom/tablet.jpg');
    });

    it('should render with all custom props combined', () => {
      const allProps = {
        className: 'custom-hero',
        tagline: '/ custom /',
        heading: 'Custom Hero Heading',
        description: 'Custom hero description',
        ctaText: 'Custom CTA',
        ctaAriaLabel: 'Custom aria label',
        images: {
          desktop: '/img/d.png',
          tablet: '/img/t.png',
          mobile: '/img/m.png',
          alt: 'Custom image'
        }
      };
      
      renderHero(allProps);
      
      expect(screen.getByText('/ custom /')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Custom Hero Heading' })).toBeInTheDocument();
      expect(screen.getByText('Custom hero description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Custom aria label' })).toHaveTextContent('Custom CTA');
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Custom image');
    });
  });
});