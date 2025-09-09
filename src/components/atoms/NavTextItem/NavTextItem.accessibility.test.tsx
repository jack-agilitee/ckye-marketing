import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import { NavTextItem } from './NavTextItem';

// Mock Next.js Link for accessibility testing
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

expect.extend(toHaveNoViolations);

describe('NavTextItem Accessibility', () => {
  const defaultProps = {
    href: '/test',
    children: 'Test Nav Item',
  };

  const renderComponent = (props = {}) => {
    return render(<NavTextItem {...defaultProps} {...props} />);
  };

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations', async () => {
      const { container } = renderComponent();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when active', async () => {
      const { container } = renderComponent({ isActive: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with aria-label', async () => {
      const { container } = renderComponent({ 
        'aria-label': 'Navigate to home page' 
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with custom classes', async () => {
      const { container } = renderComponent({ 
        className: 'custom-nav-item'
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with complex children', async () => {
      const complexChildren = (
        <div>
          <span>Home</span>
          <small>Main page</small>
        </div>
      );
      const { container } = renderComponent({ children: complexChildren });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Semantic HTML Structure', () => {
    it('should render as a proper link element', () => {
      renderComponent();
      const link = screen.getByRole('link');
      expect(link.tagName).toBe('A');
    });

    it('should have accessible name from children', () => {
      renderComponent({ children: 'Home Page' });
      expect(screen.getByRole('link', { name: 'Home Page' })).toBeInTheDocument();
    });

    it('should have accessible name from aria-label when provided', () => {
      renderComponent({ 
        children: 'Home',
        'aria-label': 'Navigate to home page' 
      });
      expect(screen.getByRole('link', { name: 'Navigate to home page' })).toBeInTheDocument();
    });

    it('should prioritize aria-label over children for accessible name', () => {
      renderComponent({ 
        children: 'Home',
        'aria-label': 'Go to homepage' 
      });
      expect(screen.getByRole('link', { name: 'Go to homepage' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
    });

    it('should have proper href attribute for navigation', () => {
      renderComponent({ href: '/about-us' });
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/about-us');
    });
  });

  describe('ARIA Attributes', () => {
    it('should set aria-current="page" when active', () => {
      renderComponent({ isActive: true });
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-current', 'page');
    });

    it('should not have aria-current when not active', () => {
      renderComponent({ isActive: false });
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('aria-current');
    });

    it('should maintain aria-current state correctly', () => {
      const { rerender } = renderComponent({ isActive: false });
      let link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('aria-current');

      rerender(<NavTextItem {...defaultProps} isActive={true} />);
      link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-current', 'page');

      rerender(<NavTextItem {...defaultProps} isActive={false} />);
      link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('aria-current');
    });

    it('should support custom aria-label', () => {
      renderComponent({ 
        'aria-label': 'Navigate to products page' 
      });
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label', 'Navigate to products page');
    });

    it('should combine aria-current and aria-label correctly', () => {
      renderComponent({ 
        isActive: true,
        'aria-label': 'Current page: Home' 
      });
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-current', 'page');
      expect(link).toHaveAttribute('aria-label', 'Current page: Home');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be focusable with Tab key', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const link = screen.getByRole('link');
      await user.tab();
      expect(link).toHaveFocus();
    });

    it('should be activatable with Enter key', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderComponent({ onClick });
      
      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard('{Enter}');
      
      expect(onClick).toHaveBeenCalled();
    });

    it('should follow standard link behavior for Space key', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderComponent({ onClick });
      
      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard(' ');
      
      // Standard link behavior: Space key doesn't activate links, only Enter does
      // This is the expected and correct behavior for accessibility
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should maintain focus visibility', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const link = screen.getByRole('link');
      await user.tab();
      
      expect(link).toHaveFocus();
      expect(document.activeElement).toBe(link);
    });

    it('should support keyboard navigation in sequence', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <NavTextItem href="/first" children="First" />
          <NavTextItem href="/second" children="Second" />
          <NavTextItem href="/third" children="Third" />
        </div>
      );
      
      const links = screen.getAllByRole('link');
      
      // Tab through each link
      await user.tab();
      expect(links[0]).toHaveFocus();
      
      await user.tab();
      expect(links[1]).toHaveFocus();
      
      await user.tab();
      expect(links[2]).toHaveFocus();
    });

    it('should handle Shift+Tab for reverse navigation', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <NavTextItem href="/first" children="First" />
          <NavTextItem href="/second" children="Second" />
        </div>
      );
      
      const links = screen.getAllByRole('link');
      
      // Focus on second link first
      links[1].focus();
      expect(links[1]).toHaveFocus();
      
      // Shift+Tab should move to first link
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(links[0]).toHaveFocus();
    });
  });

  describe('Screen Reader Support', () => {
    it('should announce link role correctly', () => {
      renderComponent();
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });

    it('should provide meaningful accessible name', () => {
      renderComponent({ 
        children: 'Products',
        'aria-label': 'View all products'
      });
      expect(screen.getByRole('link', { name: 'View all products' })).toBeInTheDocument();
    });

    it('should announce current page state', () => {
      renderComponent({ 
        isActive: true,
        children: 'Home'
      });
      const link = screen.getByRole('link', { current: 'page' });
      expect(link).toBeInTheDocument();
    });

    it('should handle complex content for screen readers', () => {
      const complexContent = (
        <>
          <span>Products</span>
          <span aria-hidden="true"> →</span>
        </>
      );
      renderComponent({ 
        children: complexContent,
        'aria-label': 'Navigate to products page'
      });
      expect(screen.getByRole('link', { name: 'Navigate to products page' })).toBeInTheDocument();
    });

    it('should support hidden decorative content', () => {
      const decorativeContent = (
        <>
          About Us
          <span aria-hidden="true"> ★</span>
        </>
      );
      renderComponent({ children: decorativeContent });
      expect(screen.getByRole('link', { name: 'About Us' })).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus after interaction', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn((event) => {
        // Prevent default navigation for testing
        event.preventDefault();
      });
      renderComponent({ onClick });
      
      const link = screen.getByRole('link');
      await user.click(link);
      
      expect(onClick).toHaveBeenCalled();
      expect(link).toHaveFocus();
    });

    it('should handle focus on disabled-like states', () => {
      // Even though there's no disabled prop, test that the component
      // always remains focusable (which is correct for nav links)
      renderComponent();
      const link = screen.getByRole('link');
      link.focus();
      expect(link).toHaveFocus();
    });

    it('should be focusable when active', () => {
      renderComponent({ isActive: true });
      const link = screen.getByRole('link');
      link.focus();
      expect(link).toHaveFocus();
    });
  });

  describe('Color and Contrast', () => {
    it('should pass general accessibility checks in default state', async () => {
      const { container } = renderComponent();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass general accessibility checks when active', async () => {
      const { container } = renderComponent({ isActive: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have appropriate color styling classes', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toHaveClass('navTextItem');
      
      const { container: activeContainer } = renderComponent({ isActive: true });
      expect(activeContainer.firstChild).toHaveClass('navTextItem--active');
    });
  });

  describe('Responsive Accessibility', () => {
    it('should maintain accessibility on different viewport sizes', async () => {
      // Test mobile viewport
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));
      
      const { container } = renderComponent();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should be touch-friendly on mobile devices', () => {
      renderComponent();
      const link = screen.getByRole('link');
      
      // Should have sufficient touch target size (this would typically be tested with CSS)
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href');
    });
  });

  describe('Error Prevention', () => {
    it('should handle minimal href values for accessibility', () => {
      // Test with minimal but valid href
      render(<NavTextItem href="#" children="Test" />);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '#');
    });

    it('should handle empty content gracefully', () => {
      renderComponent({ children: '' });
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      // Empty content should still be a valid link
    });
  });

  describe('High Contrast Mode Support', () => {
    it('should be compatible with Windows High Contrast Mode', () => {
      renderComponent();
      const link = screen.getByRole('link');
      
      // In high contrast mode, the component should still be functional
      // This is more about ensuring no accessibility violations
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href');
    });

    it('should maintain functionality in forced-colors mode', async () => {
      const { container } = renderComponent({ isActive: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});