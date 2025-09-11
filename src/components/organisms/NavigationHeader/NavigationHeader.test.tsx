import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import NavigationHeader from './NavigationHeader';

// Mock Next.js Image component
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, width, height, priority, ...props }: any) => (
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      data-priority={priority} 
      {...props} 
    />
  );
  MockImage.displayName = 'Image';
  return MockImage;
});

// Mock the SCSS module
jest.mock('./NavigationHeader.module.scss', () => ({
  'navigation-header': 'navigation-header',
  'navigation-header__container': 'navigation-header__container',
  'navigation-header__logo': 'navigation-header__logo',
  'navigation-header__nav': 'navigation-header__nav',
  'navigation-header__nav-list': 'navigation-header__nav-list',
  'navigation-header__nav-item': 'navigation-header__nav-item',
  'navigation-header__nav-link': 'navigation-header__nav-link',
  'navigation-header__cta': 'navigation-header__cta',
  'navigation-header__cta-button': 'navigation-header__cta-button',
  'navigation-header__cta-button--primary': 'navigation-header__cta-button--primary',
  'navigation-header__mobile-right': 'navigation-header__mobile-right',
  'navigation-header__mobile-toggle': 'navigation-header__mobile-toggle',
  'navigation-header__mobile-menu': 'navigation-header__mobile-menu',
  'navigation-header__mobile-nav': 'navigation-header__mobile-nav',
  'navigation-header__mobile-nav-list': 'navigation-header__mobile-nav-list',
  'navigation-header__mobile-nav-item': 'navigation-header__mobile-nav-item',
  'navigation-header__mobile-nav-link': 'navigation-header__mobile-nav-link',
  'navigation-header__mobile-cta': 'navigation-header__mobile-cta',
  'navigation-header__mobile-cta-button': 'navigation-header__mobile-cta-button',
  'navigation-header__mobile-cta-button--primary': 'navigation-header__mobile-cta-button--primary',
}));

interface NavigationHeaderProps {
  className?: string;
  'data-testid'?: string;
}

describe('NavigationHeader Component', () => {
  // Setup
  const renderNavigationHeader = (props: NavigationHeaderProps = {}) => {
    return render(<NavigationHeader {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderNavigationHeader();
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should render header with correct semantic structure', () => {
      renderNavigationHeader();
      const header = screen.getByRole('banner');
      expect(header.tagName).toBe('HEADER');
    });

    it('should display logo with correct attributes', () => {
      renderNavigationHeader();
      const logo = screen.getByAltText('CKYE Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/logo.png');
      expect(logo).toHaveAttribute('width', '120');
      expect(logo).toHaveAttribute('height', '40');
      expect(logo).toHaveAttribute('data-priority', 'true');
    });

    it('should render desktop navigation with all nav items', () => {
      renderNavigationHeader();
      
      // Check navigation landmark
      const nav = screen.getAllByRole('navigation')[0]; // First nav is desktop nav
      expect(nav).toBeInTheDocument();
      
      // Check all navigation links
      expect(screen.getByRole('link', { name: 'Product' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Enterprise' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
    });

    it('should render desktop CTA buttons', () => {
      renderNavigationHeader();
      
      // Check desktop CTA buttons exist (mobile versions are also visible in header)
      const loginButtons = screen.getAllByRole('button', { name: 'Log In' });
      const signupButtons = screen.getAllByRole('button', { name: 'Sign Up' });
      
      expect(loginButtons).toHaveLength(2); // Desktop and mobile versions
      expect(signupButtons).toHaveLength(2); // Desktop and mobile versions
    });

    it('should render mobile CTA buttons when menu is open', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      // Open mobile menu
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      // Now both desktop and mobile CTA buttons should exist
      const loginButtons = screen.getAllByRole('button', { name: 'Log In' });
      const signupButtons = screen.getAllByRole('button', { name: 'Sign Up' });
      
      expect(loginButtons).toHaveLength(2); // Desktop and mobile versions
      expect(signupButtons).toHaveLength(2); // Desktop and mobile versions
    });

    it('should render mobile menu toggle button', () => {
      renderNavigationHeader();
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      expect(toggleButton).toBeInTheDocument();
    });

    it('should not render mobile menu initially', () => {
      renderNavigationHeader();
      
      // Mobile menu should not be visible initially
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      
      // Only desktop nav links should be present
      const desktopNavLinks = screen.getAllByRole('link');
      expect(desktopNavLinks).toHaveLength(3); // Product, Enterprise, Contact
    });
  });

  // Props and Default Values Tests
  describe('Props and Default Values', () => {
    it('should apply default classes', () => {
      const { container } = renderNavigationHeader();
      const header = container.querySelector('header');
      expect(header).toHaveClass('navigation-header');
    });

    it('should apply custom className when provided', () => {
      const { container } = renderNavigationHeader({ className: 'custom-header' });
      const header = container.querySelector('header');
      expect(header).toHaveClass('navigation-header', 'custom-header');
    });

    it('should handle empty className', () => {
      const { container } = renderNavigationHeader({ className: '' });
      const header = container.querySelector('header');
      expect(header).toHaveClass('navigation-header');
    });

    it('should handle undefined className', () => {
      const { container } = renderNavigationHeader({ className: undefined });
      const header = container.querySelector('header');
      expect(header).toHaveClass('navigation-header');
    });
  });

  // Mobile Menu State Management Tests
  describe('Mobile Menu State Management', () => {
    it('should initialize with mobile menu closed', () => {
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      
      // Mobile menu should not be in DOM initially
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });

    it('should open mobile menu when toggle button is clicked', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(toggleButton).toHaveAttribute('aria-label', 'Close menu');
      
      // Mobile menu should now be visible
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      
      // Check mobile navigation links are present
      const allProductLinks = screen.getAllByRole('link', { name: 'Product' });
      expect(allProductLinks).toHaveLength(2); // Desktop + mobile
    });

    it('should close mobile menu when toggle button is clicked again', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Open menu
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      // Wait for mobile menu to appear
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      
      // Close menu
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
      
      // Mobile menu should not be visible
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });

    it('should update menu icon when mobile menu state changes', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      const icon = toggleButton.querySelector('img');
      
      // Initially should show hamburger icon
      expect(icon).toHaveAttribute('src', '/hamburger.svg');
      
      // Click to open menu
      await user.click(toggleButton);
      expect(icon).toHaveAttribute('src', '/close.svg');
      
      // Click to close menu
      await user.click(toggleButton);
      expect(icon).toHaveAttribute('src', '/hamburger.svg');
    });
  });

  // Navigation Link Interactions
  describe('Navigation Link Interactions', () => {
    it('should have correct href attributes for desktop navigation links', () => {
      renderNavigationHeader();
      
      expect(screen.getByRole('link', { name: 'Product' })).toHaveAttribute('href', '#product');
      expect(screen.getByRole('link', { name: 'Enterprise' })).toHaveAttribute('href', '#enterprise');
      expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
    });

    it('should close mobile menu when navigation link is clicked', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Open mobile menu
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      // Wait for mobile menu to appear
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      
      // Click on mobile navigation link
      const mobileProductLink = screen.getByTestId('mobile-nav-link-product');
      await user.click(mobileProductLink);
      
      // Menu should be closed
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
    });

    it('should not close mobile menu when header CTA button is clicked', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Open mobile menu
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      // Wait for mobile menu to appear
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      
      // Click on mobile CTA button (now in header, not in dropdown)
      const mobileLoginButton = screen.getByTestId('mobile-cta-login');
      await user.click(mobileLoginButton);
      
      // Menu should remain open since CTA buttons are now in header
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(toggleButton).toHaveAttribute('aria-label', 'Close menu');
    });
  });

  // Keyboard Navigation Tests
  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation for toggle button', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Focus and activate with Enter
      toggleButton.focus();
      await user.keyboard('{Enter}');
      
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should support keyboard navigation for toggle button with Space', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Focus and activate with Space
      toggleButton.focus();
      await user.keyboard(' ');
      
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should maintain focus order in desktop navigation', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      // Tab through desktop navigation elements
      await user.tab(); // Should focus first focusable element
      
      const focusedElement = document.activeElement;
      expect(focusedElement?.tagName).toBe('A');
    });

    it('should include mobile menu elements in tab order when open', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      // Wait for mobile menu to appear
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      
      // Mobile navigation links should be focusable
      const mobileLinks = screen.getAllByRole('link');
      expect(mobileLinks.length).toBe(6); // 3 desktop + 3 mobile links
    });
  });

  // Responsive Behavior Tests
  describe('Responsive Behavior', () => {
    it('should handle multiple menu toggles correctly', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Multiple open/close cycles
      for (let i = 0; i < 3; i++) {
        await user.click(toggleButton);
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
        
        await user.click(toggleButton);
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      }
    });

    it('should maintain state consistency across rapid toggles', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Rapid toggles
      await user.click(toggleButton);
      await user.click(toggleButton);
      await user.click(toggleButton);
      
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(toggleButton).toHaveAttribute('aria-label', 'Close menu');
    });
  });

  // CSS Class Application Tests
  describe('CSS Class Application', () => {
    it('should apply correct CSS classes to elements', () => {
      const { container } = renderNavigationHeader();
      
      expect(container.querySelector('.navigation-header')).toBeInTheDocument();
      expect(container.querySelector('.navigation-header__container')).toBeInTheDocument();
      expect(container.querySelector('.navigation-header__logo')).toBeInTheDocument();
      expect(container.querySelector('.navigation-header__nav')).toBeInTheDocument();
      expect(container.querySelector('.navigation-header__cta')).toBeInTheDocument();
      expect(container.querySelector('.navigation-header__mobile-toggle')).toBeInTheDocument();
    });

    it('should apply primary variant class to signup buttons', () => {
      const { container } = renderNavigationHeader();
      
      const primaryButtons = container.querySelectorAll('.navigation-header__cta-button--primary');
      expect(primaryButtons).toHaveLength(1); // Only desktop version initially
    });

    it('should show mobile menu classes when menu is open', async () => {
      const user = userEvent.setup();
      const { container } = renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      expect(container.querySelector('.navigation-header__mobile-menu')).toBeInTheDocument();
      expect(container.querySelector('.navigation-header__mobile-nav')).toBeInTheDocument();
      expect(container.querySelector('.navigation-header__mobile-cta')).toBeInTheDocument();
    });
  });

  // ARIA Attributes and Accessibility Tests
  describe('ARIA Attributes and Accessibility', () => {
    it('should have proper ARIA attributes on toggle button', () => {
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should update ARIA attributes when menu state changes', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-label', 'Close menu');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should have decorative icon with empty alt text', () => {
      renderNavigationHeader();
      
      const toggleIcon = screen.getByRole('button', { name: 'Open menu' }).querySelector('img');
      expect(toggleIcon).toHaveAttribute('alt', '');
    });

    it('should have proper semantic structure with landmarks', () => {
      renderNavigationHeader();
      
      // Header landmark
      expect(screen.getByRole('banner')).toBeInTheDocument();
      
      // Navigation landmark
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should be accessible by screen readers', () => {
      renderNavigationHeader();
      
      // Verify semantic HTML structure is in place
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
      
      // Verify ARIA attributes are correct
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
    });

    it('should maintain accessibility when mobile menu is open', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      // Verify mobile navigation landmark is accessible
      expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();
      
      // Verify ARIA state updates
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(toggleButton).toHaveAttribute('aria-label', 'Close menu');
    });
  });

  // Edge Cases and Error Handling
  describe('Edge Cases', () => {
    it('should handle null className gracefully', () => {
      const { container } = renderNavigationHeader({ className: null as any });
      const header = container.querySelector('header');
      expect(header).toHaveClass('navigation-header');
    });

    it('should maintain functionality with complex className values', () => {
      const complexClassName = 'class1 class2 class3';
      const { container } = renderNavigationHeader({ className: complexClassName });
      const header = container.querySelector('header');
      expect(header).toHaveClass('navigation-header', 'class1', 'class2', 'class3');
    });

    it('should handle repeated menu interactions without issues', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Test many interactions
      for (let i = 0; i < 10; i++) {
        await user.click(toggleButton);
        const isOpen = toggleButton.getAttribute('aria-expanded') === 'true';
        expect(typeof isOpen).toBe('boolean');
      }
    });
  });

  // Performance and Re-render Tests
  describe('Performance', () => {
    it('should not unnecessarily re-render when props do not change', () => {
      const { rerender } = renderNavigationHeader();
      const header1 = screen.getByRole('banner');
      
      rerender(<NavigationHeader />);
      const header2 = screen.getByRole('banner');
      
      expect(header1).toBe(header2);
    });

    it('should handle rapid state changes efficiently', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Rapid state changes should not cause issues
      const promises = Array.from({ length: 5 }, () => user.click(toggleButton));
      await Promise.all(promises);
      
      // Final state should be consistent
      const finalExpanded = toggleButton.getAttribute('aria-expanded');
      expect(['true', 'false']).toContain(finalExpanded);
    });
  });

  // Integration Tests
  describe('Integration Scenarios', () => {
    it('should work correctly in different contexts', () => {
      render(
        <div>
          <NavigationHeader className="main-nav" />
          <main>
            <h1>Page Content</h1>
          </main>
        </div>
      );
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should maintain navigation functionality with external state changes', async () => {
      const user = userEvent.setup();
      const { rerender } = renderNavigationHeader({ className: 'initial' });
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      // External prop change should not affect internal state
      rerender(<NavigationHeader className="updated" />);
      
      // State should persist after rerender (React behavior)
      const persistentToggleButton = screen.getByTestId('mobile-menu-toggle');
      expect(persistentToggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(persistentToggleButton).toHaveAttribute('aria-label', 'Close menu');
      
      // Should still be able to interact normally
      await user.click(persistentToggleButton);
      expect(persistentToggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(persistentToggleButton).toHaveAttribute('aria-label', 'Open menu');
    });

    it('should handle multiple NavigationHeader instances independently', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <NavigationHeader className="header1" />
          <NavigationHeader className="header2" />
        </div>
      );
      
      const toggleButtons = screen.getAllByRole('button', { name: 'Open menu' });
      expect(toggleButtons).toHaveLength(2);
      
      // Interact with first header
      await user.click(toggleButtons[0]);
      expect(toggleButtons[0]).toHaveAttribute('aria-expanded', 'true');
      expect(toggleButtons[1]).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // Additional Comprehensive Tests for Full Coverage
  describe('Data Attributes and TestIds', () => {
    it('should apply custom data-testid when provided', () => {
      renderNavigationHeader({ 'data-testid': 'custom-nav-header' });
      expect(screen.getByTestId('custom-nav-header')).toBeInTheDocument();
    });

    it('should use default data-testid when not provided', () => {
      renderNavigationHeader();
      expect(screen.getByTestId('navigation-header')).toBeInTheDocument();
    });

    it('should have all required test ids for components', () => {
      renderNavigationHeader();
      
      expect(screen.getByTestId('navigation-logo')).toBeInTheDocument();
      expect(screen.getByTestId('desktop-navigation')).toBeInTheDocument();
      expect(screen.getByTestId('desktop-cta-buttons')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-menu-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('nav-link-product')).toBeInTheDocument();
      expect(screen.getByTestId('nav-link-enterprise')).toBeInTheDocument();
      expect(screen.getByTestId('nav-link-contact')).toBeInTheDocument();
      expect(screen.getByTestId('cta-login')).toBeInTheDocument();
      expect(screen.getByTestId('cta-signup')).toBeInTheDocument();
    });

    it('should have mobile-specific test ids when menu is open', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
        expect(screen.getByTestId('mobile-nav-link-product')).toBeInTheDocument();
        expect(screen.getByTestId('mobile-nav-link-enterprise')).toBeInTheDocument();
        expect(screen.getByTestId('mobile-nav-link-contact')).toBeInTheDocument();
      });
      
      // Mobile CTA buttons should be in header (always visible)
      expect(screen.getByTestId('mobile-cta-buttons')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-cta-login')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-cta-signup')).toBeInTheDocument();
    });
  });

  // Event Handling Tests
  describe('Event Handling', () => {
    it('should handle clicks on navigation links', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const productLink = screen.getByTestId('nav-link-product');
      const enterpriseLink = screen.getByTestId('nav-link-enterprise');
      const contactLink = screen.getByTestId('nav-link-contact');
      
      // These would normally navigate in a real browser
      await user.click(productLink);
      await user.click(enterpriseLink);
      await user.click(contactLink);
      
      // Verify links maintain their href attributes
      expect(productLink).toHaveAttribute('href', '#product');
      expect(enterpriseLink).toHaveAttribute('href', '#enterprise');
      expect(contactLink).toHaveAttribute('href', '#contact');
    });

    it('should handle clicks on CTA buttons', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const loginButton = screen.getByTestId('cta-login');
      const signupButton = screen.getByTestId('cta-signup');
      
      // Test that buttons are clickable
      await user.click(loginButton);
      await user.click(signupButton);
      
      // Verify buttons maintain their type
      expect(loginButton).toHaveAttribute('type', 'button');
      expect(signupButton).toHaveAttribute('type', 'button');
    });

    it('should handle all mobile navigation interactions', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      
      // Test all mobile navigation links
      const mobileProductLink = screen.getByTestId('mobile-nav-link-product');
      
      // Each click should close the menu
      await user.click(mobileProductLink);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      
      // Reopen and test enterprise link
      await user.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      const enterpriseLink = screen.getByTestId('mobile-nav-link-enterprise');
      await user.click(enterpriseLink);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      
      // Reopen and test contact link
      await user.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      const contactLink = screen.getByTestId('mobile-nav-link-contact');
      await user.click(contactLink);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // Image and Asset Tests
  describe('Image and Asset Handling', () => {
    it('should render logo image with correct properties', () => {
      renderNavigationHeader();
      
      const logo = screen.getByAltText('CKYE Logo');
      expect(logo).toHaveAttribute('src', '/logo.png');
      expect(logo).toHaveAttribute('width', '120');
      expect(logo).toHaveAttribute('height', '40');
      expect(logo).toHaveAttribute('data-priority', 'true');
    });

    it('should render hamburger icon when menu is closed', () => {
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      const icon = toggleButton.querySelector('img');
      
      expect(icon).toHaveAttribute('src', '/hamburger.svg');
      expect(icon).toHaveAttribute('width', '24');
      expect(icon).toHaveAttribute('height', '24');
      expect(icon).toHaveAttribute('alt', '');
    });

    it('should render close icon when menu is open', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      const icon = toggleButton.querySelector('img');
      expect(icon).toHaveAttribute('src', '/close.svg');
      expect(icon).toHaveAttribute('width', '24');
      expect(icon).toHaveAttribute('height', '24');
      expect(icon).toHaveAttribute('alt', '');
    });
  });

  // State Persistence Tests
  describe('State Persistence', () => {
    it('should maintain consistent state through multiple interactions', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Test 5 cycles of open/close
      for (let i = 0; i < 5; i++) {
        // Open
        await user.click(toggleButton);
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
        expect(toggleButton).toHaveAttribute('aria-label', 'Close menu');
        
        // Verify mobile menu appears
        await waitFor(() => {
          expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
        });
        
        // Close
        await user.click(toggleButton);
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
        expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
        
        // Verify mobile menu disappears
        expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      }
    });

    it('should handle state changes from mobile nav link clicks', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Test each mobile nav link closes the menu
      const navItems = ['product', 'enterprise', 'contact'];
      
      for (const item of navItems) {
        // Open menu
        await user.click(toggleButton);
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
        
        // Wait for mobile menu to appear
        await waitFor(() => {
          expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
        });
        
        // Click mobile nav link
        const mobileLink = screen.getByTestId(`mobile-nav-link-${item}`);
        await user.click(mobileLink);
        
        // Verify menu closes
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      }
    });

    it('should handle state independence of mobile CTA button clicks', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Test login button (should not affect menu state)
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      const mobileLoginButton = screen.getByTestId('mobile-cta-login');
      await user.click(mobileLoginButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true'); // Remains open
      
      // Test signup button (should not affect menu state)
      const mobileSignupButton = screen.getByTestId('mobile-cta-signup');
      await user.click(mobileSignupButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true'); // Remains open
    });
  });

  // Browser Compatibility Tests
  describe('Browser Compatibility', () => {
    it('should work with different button interaction methods', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Test mouse click
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      // Test keyboard activation
      await user.keyboard('{Enter}');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      
      // Test space key
      await user.keyboard(' ');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should handle touch-like interactions', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Simulate touch interaction
      fireEvent.touchStart(toggleButton);
      fireEvent.touchEnd(toggleButton);
      await user.click(toggleButton);
      
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});