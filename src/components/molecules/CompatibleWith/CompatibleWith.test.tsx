import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CompatibleWith, CompatibleWithProps } from './CompatibleWith';

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

describe('CompatibleWith Component', () => {
  // Setup
  const renderComponent = (props: Partial<CompatibleWithProps> = {}) => {
    return render(<CompatibleWith {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('should render the section element with proper semantic structure', () => {
      renderComponent();
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });

    it('should have proper aria-label for the section', () => {
      renderComponent();
      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'AI models compatibility');
    });

    it('should render the header text', () => {
      renderComponent();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Compatible With:')).toBeInTheDocument();
    });

    it('should render the models container with list role', () => {
      renderComponent();
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('should render all three AI model logos', () => {
      renderComponent();
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    it('should render images for all models', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      expect(images).toHaveLength(3);
    });
  });

  // Props and Default Values Tests
  describe('Props and Default Values', () => {
    it('should apply default CSS classes', () => {
      const { container } = renderComponent();
      const section = container.querySelector('section');
      expect(section).toHaveClass('compatible-with');
    });

    it('should apply custom className when provided', () => {
      const customClass = 'custom-compatible-with';
      const { container } = renderComponent({ className: customClass });
      const section = container.querySelector('section');
      expect(section).toHaveClass('compatible-with');
      expect(section).toHaveClass(customClass);
    });

    it('should handle empty className', () => {
      const { container } = renderComponent({ className: '' });
      const section = container.querySelector('section');
      expect(section).toHaveClass('compatible-with');
    });

    it('should handle undefined className', () => {
      const { container } = renderComponent({ className: undefined });
      const section = container.querySelector('section');
      expect(section).toHaveClass('compatible-with');
    });

    it('should apply multiple custom classes', () => {
      const customClasses = 'class1 class2 class3';
      const { container } = renderComponent({ className: customClasses });
      const section = container.querySelector('section');
      expect(section).toHaveClass('compatible-with');
      expect(section).toHaveClass('class1');
      expect(section).toHaveClass('class2');
      expect(section).toHaveClass('class3');
    });
  });

  // Model Data Tests
  describe('Model Data', () => {
    it('should render Claude AI logo with correct attributes', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      const claudeImage = images.find(img => img.getAttribute('alt') === 'Claude AI logo');
      
      expect(claudeImage).toBeInTheDocument();
      expect(claudeImage).toHaveAttribute('src', '/models/claude.png');
      expect(claudeImage).toHaveAttribute('alt', 'Claude AI logo');
      expect(claudeImage).toHaveAttribute('width', '204');
      expect(claudeImage).toHaveAttribute('height', '48');
      expect(claudeImage).toHaveAttribute('data-priority', 'true'); // First image should have priority
    });

    it('should render Google Gemini logo with correct attributes', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      const geminiImage = images.find(img => img.getAttribute('alt') === 'Google Gemini logo');
      
      expect(geminiImage).toBeInTheDocument();
      expect(geminiImage).toHaveAttribute('src', '/models/gemini.png');
      expect(geminiImage).toHaveAttribute('alt', 'Google Gemini logo');
      expect(geminiImage).toHaveAttribute('width', '196');
      expect(geminiImage).toHaveAttribute('height', '48');
      expect(geminiImage).toHaveAttribute('data-priority', 'false');
    });

    it('should render GitHub Copilot logo with correct attributes', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      const copilotImage = images.find(img => img.getAttribute('alt') === 'GitHub Copilot logo');
      
      expect(copilotImage).toBeInTheDocument();
      expect(copilotImage).toHaveAttribute('src', '/models/copilot.png');
      expect(copilotImage).toHaveAttribute('alt', 'GitHub Copilot logo');
      expect(copilotImage).toHaveAttribute('width', '340');
      expect(copilotImage).toHaveAttribute('height', '48');
      expect(copilotImage).toHaveAttribute('data-priority', 'false');
    });

    it('should only set priority on the first image (Claude)', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      
      // First image (Claude) should have priority
      expect(images[0]).toHaveAttribute('data-priority', 'true');
      
      // Other images should not have priority
      expect(images[1]).toHaveAttribute('data-priority', 'false');
      expect(images[2]).toHaveAttribute('data-priority', 'false');
    });

    it('should render models in correct order', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      
      expect(images[0]).toHaveAttribute('alt', 'Claude AI logo');
      expect(images[1]).toHaveAttribute('alt', 'Google Gemini logo');
      expect(images[2]).toHaveAttribute('alt', 'GitHub Copilot logo');
    });
  });

  // CSS Class Application Tests
  describe('CSS Class Application', () => {
    it('should apply all required CSS classes to section', () => {
      const { container } = renderComponent({ className: 'custom-class' });
      const section = container.querySelector('section');
      
      expect(section).toHaveClass('compatible-with');
      expect(section).toHaveClass('custom-class');
    });

    it('should apply container class to inner div', () => {
      const { container } = renderComponent();
      const containerDiv = container.querySelector('.compatible-with__container');
      
      expect(containerDiv).toBeInTheDocument();
      expect(containerDiv).toHaveClass('compatible-with__container');
    });

    it('should apply header class to h2 element', () => {
      const { container } = renderComponent();
      const header = container.querySelector('h2');
      
      expect(header).toHaveClass('compatible-with__header');
    });

    it('should apply models class to models container', () => {
      const { container } = renderComponent();
      const modelsContainer = container.querySelector('[role="list"]');
      
      expect(modelsContainer).toHaveClass('compatible-with__models');
    });

    it('should apply model class to each model item', () => {
      const { container } = renderComponent();
      const modelItems = container.querySelectorAll('[role="listitem"]');
      
      modelItems.forEach(item => {
        expect(item).toHaveClass('compatible-with__model');
      });
    });

    it('should apply logo class to each image', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      
      images.forEach(image => {
        expect(image).toHaveClass('compatible-with__logo');
      });
    });
  });

  // Semantic Structure Tests
  describe('Semantic Structure', () => {
    it('should have proper heading hierarchy', () => {
      renderComponent();
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('should use semantic list structure', () => {
      renderComponent();
      const list = screen.getByRole('list');
      const listItems = screen.getAllByRole('listitem');
      
      expect(list).toBeInTheDocument();
      expect(listItems).toHaveLength(3);
      
      listItems.forEach(item => {
        expect(list).toContainElement(item);
      });
    });

    it('should have proper section structure', () => {
      renderComponent();
      const section = screen.getByRole('region');
      const heading = screen.getByRole('heading');
      const list = screen.getByRole('list');
      
      expect(section).toContainElement(heading);
      expect(section).toContainElement(list);
    });

    it('should maintain proper parent-child relationships', () => {
      const { container } = renderComponent();
      const section = container.querySelector('section');
      const containerDiv = container.querySelector('.compatible-with__container');
      const header = container.querySelector('h2');
      const modelsDiv = container.querySelector('.compatible-with__models');
      const modelItems = container.querySelectorAll('.compatible-with__model');
      
      expect(section).toContainElement(containerDiv);
      expect(containerDiv).toContainElement(header);
      expect(containerDiv).toContainElement(modelsDiv);
      
      modelItems.forEach(item => {
        expect(modelsDiv).toContainElement(item);
      });
    });
  });

  // Image Attributes Tests
  describe('Image Attributes', () => {
    it('should have meaningful alt text for all images', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      
      images.forEach(image => {
        const altText = image.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText).not.toBe('');
        expect(altText).toContain('logo');
      });
    });

    it('should have proper dimensions for all images', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      
      images.forEach(image => {
        expect(image).toHaveAttribute('width');
        expect(image).toHaveAttribute('height');
        expect(parseInt(image.getAttribute('width')!)).toBeGreaterThan(0);
        expect(parseInt(image.getAttribute('height')!)).toBeGreaterThan(0);
      });
    });

    it('should have consistent height across all images', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      
      images.forEach(image => {
        expect(image).toHaveAttribute('height', '48');
      });
    });

    it('should have unique widths for different models', () => {
      renderComponent();
      const images = screen.getAllByTestId('mocked-image');
      const widths = images.map(img => img.getAttribute('width'));
      const uniqueWidths = new Set(widths);
      
      expect(uniqueWidths.size).toBe(3); // All widths should be different
    });
  });

  // Edge Cases and Error Handling
  describe('Edge Cases', () => {
    it('should handle null className gracefully', () => {
      const { container } = renderComponent({ className: null as any });
      const section = container.querySelector('section');
      expect(section).toHaveClass('compatible-with');
    });

    it('should handle special characters in className', () => {
      const specialClass = 'class-with-special_chars.and.dots';
      const { container } = renderComponent({ className: specialClass });
      const section = container.querySelector('section');
      expect(section).toHaveClass('compatible-with');
      expect(section).toHaveClass(specialClass);
    });

    it('should render consistently on multiple renders', () => {
      const { rerender } = renderComponent();
      const firstRender = screen.getByRole('region');
      
      rerender(<CompatibleWith />);
      const secondRender = screen.getByRole('region');
      
      expect(firstRender).toBe(secondRender);
    });

    it('should maintain structure with different className values', () => {
      const { rerender } = renderComponent({ className: 'class1' });
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
      
      rerender(<CompatibleWith className="class2" />);
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
  });

  // Performance Tests
  describe('Performance', () => {
    it('should not unnecessarily re-render when props do not change', () => {
      const { rerender } = renderComponent();
      const section1 = screen.getByRole('region');
      
      rerender(<CompatibleWith />);
      const section2 = screen.getByRole('region');
      
      expect(section1).toBe(section2);
    });

    it('should handle rapid prop changes without errors', () => {
      const { rerender } = renderComponent({ className: 'initial' });
      
      for (let i = 0; i < 10; i++) {
        rerender(<CompatibleWith className={`class-${i}`} />);
      }
      
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
  });

  // Data-driven Tests
  describe('Model Data Integrity', () => {
    const expectedModels = [
      {
        name: 'Claude',
        src: '/models/claude.png',
        alt: 'Claude AI logo',
        width: 204,
        height: 48
      },
      {
        name: 'Gemini',
        src: '/models/gemini.png',
        alt: 'Google Gemini logo',
        width: 196,
        height: 48
      },
      {
        name: 'GitHub Copilot',
        src: '/models/copilot.png',
        alt: 'GitHub Copilot logo',
        width: 340,
        height: 48
      }
    ];

    expectedModels.forEach((model, index) => {
      it(`should render ${model.name} with correct data`, () => {
        renderComponent();
        const images = screen.getAllByTestId('mocked-image');
        const targetImage = images[index];
        
        expect(targetImage).toHaveAttribute('src', model.src);
        expect(targetImage).toHaveAttribute('alt', model.alt);
        expect(targetImage).toHaveAttribute('width', model.width.toString());
        expect(targetImage).toHaveAttribute('height', model.height.toString());
      });
    });
  });

  // Component Interface Tests
  describe('Component Interface', () => {
    it('should export CompatibleWith as named export', () => {
      expect(CompatibleWith).toBeDefined();
      expect(typeof CompatibleWith).toBe('function');
    });

    it('should export CompatibleWith as default export', () => {
      const DefaultExport = require('./CompatibleWith').default;
      expect(DefaultExport).toBeDefined();
      expect(typeof DefaultExport).toBe('function');
      expect(DefaultExport).toBe(CompatibleWith);
    });

    it('should have proper TypeScript interface', () => {
      // This test ensures the component accepts the expected props structure
      const validProps: CompatibleWithProps = {};
      expect(() => renderComponent(validProps)).not.toThrow();
      
      const propsWithClassName: CompatibleWithProps = { className: 'test' };
      expect(() => renderComponent(propsWithClassName)).not.toThrow();
    });

    it('should be a functional component', () => {
      expect(CompatibleWith.prototype).toBeUndefined(); // Functional components don't have prototype
    });
  });
});