import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { NavTextItem } from './NavTextItem';

// Mock Next.js Link since we're not testing routing functionality
jest.mock('next/link', () => {
  return ({ children, ...props }: any) => {
    return <a {...props}>{children}</a>;
  };
});

// Mock the CSS module to return actual class names for testing
jest.mock('./NavTextItem.module.scss', () => ({
  navTextItem: 'navTextItem',
  'navTextItem--active': 'navTextItem--active',
}));

describe('NavTextItem', () => {
  // Setup
  const defaultProps = {
    href: '/test',
    children: 'Test Nav Item',
  };

  const renderComponent = (props = {}) => {
    return render(
      <NavTextItem {...defaultProps} {...props} />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderComponent();
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('should display correct text content', () => {
      renderComponent({ children: 'Home' });
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('should render with correct href attribute', () => {
      renderComponent({ href: '/about' });
      expect(screen.getByRole('link')).toHaveAttribute('href', '/about');
    });

    it('should render with React node children', () => {
      const iconChild = <span data-testid="icon">🏠</span>;
      renderComponent({ children: iconChild });
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should render with complex children structure', () => {
      const complexChild = (
        <div>
          <span>Home</span>
          <small>Main page</small>
        </div>
      );
      renderComponent({ children: complexChild });
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Main page')).toBeInTheDocument();
    });
  });

  // Props Tests
  describe('Props', () => {
    it('should apply default CSS classes', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toHaveClass('navTextItem');
    });

    it('should apply active CSS class when isActive is true', () => {
      const { container } = renderComponent({ isActive: true });
      expect(container.firstChild).toHaveClass('navTextItem--active');
    });

    it('should not apply active CSS class when isActive is false', () => {
      const { container } = renderComponent({ isActive: false });
      expect(container.firstChild).not.toHaveClass('navTextItem--active');
    });

    it('should apply additional CSS classes from className prop', () => {
      const { container } = renderComponent({ className: 'custom-class' });
      expect(container.firstChild).toHaveClass('navTextItem', 'custom-class');
    });

    it('should combine multiple CSS classes correctly', () => {
      const { container } = renderComponent({ 
        isActive: true, 
        className: 'custom-class another-class' 
      });
      expect(container.firstChild).toHaveClass(
        'navTextItem',
        'navTextItem--active',
        'custom-class',
        'another-class'
      );
    });

    it('should handle empty className prop', () => {
      const { container } = renderComponent({ className: '' });
      expect(container.firstChild).toHaveClass('navTextItem');
    });

    it('should handle undefined className prop', () => {
      const { container } = renderComponent({ className: undefined });
      expect(container.firstChild).toHaveClass('navTextItem');
    });

    it('should apply data-testid when provided', () => {
      renderComponent({ 'data-testid': 'nav-home' });
      expect(screen.getByTestId('nav-home')).toBeInTheDocument();
    });

    it('should apply aria-label when provided', () => {
      renderComponent({ 'aria-label': 'Navigate to home page' });
      expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Navigate to home page');
    });

    it('should not apply aria-label when not provided', () => {
      renderComponent();
      expect(screen.getByRole('link')).not.toHaveAttribute('aria-label');
    });
  });

  // Active State Tests
  describe('Active State', () => {
    it('should set aria-current to "page" when isActive is true', () => {
      renderComponent({ isActive: true });
      expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
    });

    it('should not set aria-current when isActive is false', () => {
      renderComponent({ isActive: false });
      expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
    });

    it('should not set aria-current when isActive is undefined', () => {
      renderComponent({ isActive: undefined });
      expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
    });

    it('should handle isActive default value correctly', () => {
      renderComponent(); // isActive defaults to false
      expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
      const { container } = render(<NavTextItem {...defaultProps} />);
      expect(container.firstChild).not.toHaveClass('navTextItem--active');
    });
  });

  // Interaction Tests
  describe('User Interactions', () => {
    it('should call onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderComponent({ onClick });
      
      await user.click(screen.getByRole('link'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should pass event object to onClick handler', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderComponent({ onClick });
      
      await user.click(screen.getByRole('link'));
      expect(onClick).toHaveBeenCalledWith(expect.any(Object));
      expect(onClick.mock.calls[0][0]).toHaveProperty('type', 'click');
    });

    it('should not throw error when onClick is not provided', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      await expect(user.click(screen.getByRole('link'))).resolves.not.toThrow();
    });

    it('should handle multiple clicks correctly', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderComponent({ onClick });
      
      const link = screen.getByRole('link');
      await user.click(link);
      await user.click(link);
      await user.click(link);
      
      expect(onClick).toHaveBeenCalledTimes(3);
    });

    it('should handle keyboard navigation with Enter key', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderComponent({ onClick });
      
      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard('{Enter}');
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard navigation with Space key', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderComponent({ onClick });
      
      const link = screen.getByRole('link');
      link.focus();
      
      // Note: By default, links don't respond to space key in browsers
      // This is expected behavior - only Enter key activates links
      await user.keyboard('{Space}');
      
      // Space key should not trigger onClick for links (this is correct behavior)
      expect(onClick).toHaveBeenCalledTimes(0);
    });

    it('should be focusable', () => {
      renderComponent();
      const link = screen.getByRole('link');
      link.focus();
      expect(document.activeElement).toBe(link);
    });
  });

  // Integration with Next.js Link Tests
  describe('Next.js Link Integration', () => {
    it('should pass href to Link component', () => {
      renderComponent({ href: '/products' });
      expect(screen.getByRole('link')).toHaveAttribute('href', '/products');
    });

    it('should handle complex href paths', () => {
      const complexHref = '/products/category?sort=price#top';
      renderComponent({ href: complexHref });
      expect(screen.getByRole('link')).toHaveAttribute('href', complexHref);
    });

    it('should handle external links', () => {
      const externalHref = 'https://example.com';
      renderComponent({ href: externalHref });
      expect(screen.getByRole('link')).toHaveAttribute('href', externalHref);
    });

    it('should handle relative paths', () => {
      const relativePath = './relative';
      renderComponent({ href: relativePath });
      expect(screen.getByRole('link')).toHaveAttribute('href', relativePath);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should handle empty string children', () => {
      renderComponent({ children: '' });
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toBeEmptyDOMElement();
    });

    it('should handle zero as children', () => {
      renderComponent({ children: 0 });
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle null children gracefully', () => {
      renderComponent({ children: null });
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toBeEmptyDOMElement();
    });

    it('should handle false as children', () => {
      renderComponent({ children: false });
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toBeEmptyDOMElement();
    });

    it('should handle array of children', () => {
      const arrayChildren = ['Home', ' ', 'Page'];
      renderComponent({ children: arrayChildren });
      expect(screen.getByText(/Home\s+Page/)).toBeInTheDocument();
    });

    it('should handle special characters in href', () => {
      const specialHref = '/search?q=test%20query&category=all';
      renderComponent({ href: specialHref });
      expect(screen.getByRole('link')).toHaveAttribute('href', specialHref);
    });

    it('should handle whitespace-only className', () => {
      const { container } = renderComponent({ className: '   ' });
      expect(container.firstChild).toHaveClass('navTextItem');
      // Whitespace should be filtered out by the component logic
    });
  });

  // Event Handling Tests
  describe('Event Handling', () => {
    it('should handle onClick with event prevention', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn((event) => {
        event.preventDefault();
      });
      renderComponent({ onClick });
      
      await user.click(screen.getByRole('link'));
      expect(onClick).toHaveBeenCalled();
    });

    it('should maintain event target reference', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderComponent({ onClick });
      
      const link = screen.getByRole('link');
      await user.click(link);
      
      expect(onClick.mock.calls[0][0].target).toBe(link);
    });

    it('should handle onClick returning different values', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn(() => 'return value');
      renderComponent({ onClick });
      
      await user.click(screen.getByRole('link'));
      expect(onClick).toHaveBeenCalled();
    });

    it('should execute internal handleClick function when onClick is undefined', async () => {
      const user = userEvent.setup();
      renderComponent({ onClick: undefined });
      
      // This should not throw an error and should execute handleClick internally
      await user.click(screen.getByRole('link'));
      
      // The test passes if no error is thrown
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });

  // CSS Class Logic Tests
  describe('CSS Class Logic', () => {
    it('should filter out falsy values from class array', () => {
      const { container } = renderComponent({ 
        isActive: false, 
        className: '' 
      });
      
      // Should only have the base class, filtering out falsy values
      expect(container.firstChild).toHaveClass('navTextItem');
      expect(container.firstChild?.className).toBe('navTextItem');
    });

    it('should handle multiple classes in className prop', () => {
      const { container } = renderComponent({ 
        className: 'class1 class2 class3' 
      });
      
      expect(container.firstChild).toHaveClass(
        'navTextItem',
        'class1',
        'class2', 
        'class3'
      );
    });

    it('should maintain class order consistency', () => {
      const { container } = renderComponent({ 
        isActive: true,
        className: 'custom-class'
      });
      
      const classNames = container.firstChild?.className.split(' ');
      expect(classNames).toEqual([
        'navTextItem',
        'navTextItem--active',
        'custom-class'
      ]);
    });
  });
});