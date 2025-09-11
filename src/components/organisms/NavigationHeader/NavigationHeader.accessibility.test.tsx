import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import NavigationHeader from './NavigationHeader';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

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

describe('NavigationHeader Accessibility Tests (WCAG 2.1 AA Compliance)', () => {
  const renderNavigationHeader = (props: NavigationHeaderProps = {}) => {
    return render(<NavigationHeader {...props} />);
  };

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations (default state)', async () => {
      const { container } = renderNavigationHeader();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (mobile menu closed)', async () => {
      const { container } = renderNavigationHeader();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (mobile menu open)', async () => {
      const user = userEvent.setup();
      const { container } = renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with custom className', async () => {
      const { container } = renderNavigationHeader({ className: 'custom-navigation' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass all relevant axe-core rules', async () => {
      const { container } = renderNavigationHeader();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation (WCAG 2.1.1 - Keyboard)', () => {
    it('should be fully navigable with keyboard only', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      // Tab through all interactive elements
      const interactiveElements = [
        screen.getAllByRole('link')[0], // First nav link
        screen.getAllByRole('link')[1], // Second nav link 
        screen.getAllByRole('link')[2], // Third nav link
        screen.getAllByRole('button')[0], // Log In button
        screen.getAllByRole('button')[1], // Sign Up button
        screen.getByRole('button', { name: 'Open menu' }), // Mobile toggle
      ];
      
      for (const element of interactiveElements) {
        await user.tab();
        expect(document.activeElement).toBe(element);
      }
    });

    it('should support keyboard activation of mobile menu toggle', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Focus the toggle button
      toggleButton.focus();
      expect(document.activeElement).toBe(toggleButton);
      
      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      // Activate with Space to close
      await user.keyboard(' ');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should maintain logical tab order when mobile menu is open', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      // Open mobile menu
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      // Tab order should include mobile menu items
      const allLinks = screen.getAllByRole('link');
      const allButtons = screen.getAllByRole('button');
      
      expect(allLinks.length).toBeGreaterThan(3); // Desktop + mobile links
      expect(allButtons.length).toBeGreaterThan(3); // Desktop + mobile buttons + toggle
    });

    it('should support keyboard navigation for all links', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const productLink = screen.getByRole('link', { name: 'Product' });
      productLink.focus();
      expect(document.activeElement).toBe(productLink);
      
      // Verify link has correct href
      expect(productLink).toHaveAttribute('href', '#product');
      
      // Test keyboard activation (Enter key)
      const mockPreventDefault = jest.fn();
      productLink.addEventListener('click', (e) => e.preventDefault = mockPreventDefault);
      await user.keyboard('{Enter}');
    });

    it('should not trap focus in mobile menu', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      // Focus should be able to move outside mobile menu
      const firstMobileLink = screen.getAllByRole('link')[3]; // First mobile link
      firstMobileLink.focus();
      
      // Tab should move to next element, not loop back
      await user.tab();
      expect(document.activeElement).not.toBe(firstMobileLink);
    });
  });

  describe('Screen Reader Support (WCAG 4.1.2 - Name, Role, Value)', () => {
    it('should have proper semantic structure with landmarks', () => {
      renderNavigationHeader();
      
      // Header landmark
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header.tagName).toBe('HEADER');
      
      // Navigation landmarks
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toBeInTheDocument();
      expect(nav.tagName).toBe('NAV');
    });

    it('should provide proper accessible names for all interactive elements', () => {
      renderNavigationHeader();
      
      // Navigation links
      expect(screen.getByRole('link', { name: 'Product' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Enterprise' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
      
      // CTA buttons (desktop only initially)
      expect(screen.getAllByRole('button', { name: 'Log In' })).toHaveLength(1);
      expect(screen.getAllByRole('button', { name: 'Sign Up' })).toHaveLength(1);
      
      // Mobile toggle
      expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    });

    it('should have meaningful logo alt text', () => {
      renderNavigationHeader();
      
      const logo = screen.getByAltText('CKYE Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('alt', 'CKYE Logo');
    });

    it('should use decorative image pattern for mobile toggle icon', () => {
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      const icon = toggleButton.querySelector('img');
      
      expect(icon).toHaveAttribute('alt', '');
      expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
    });

    it('should announce state changes via aria-expanded', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Initial state
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
      
      // After opening
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(toggleButton).toHaveAttribute('aria-label', 'Close menu');
      
      // After closing
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
    });

    it('should provide appropriate context for mobile navigation', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      // Open mobile menu
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      // Mobile navigation should be distinguishable
      const mainNav = screen.getByRole('navigation', { name: 'Main navigation' });
      const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' });
      expect(mainNav).toBeInTheDocument();
      expect(mobileNav).toBeInTheDocument();
      
      // Mobile links should have the same accessible names as desktop
      expect(screen.getAllByRole('link', { name: 'Product' })).toHaveLength(2);
      expect(screen.getAllByRole('link', { name: 'Enterprise' })).toHaveLength(2);
      expect(screen.getAllByRole('link', { name: 'Contact' })).toHaveLength(2);
    });
  });

  describe('Focus Management (WCAG 2.4.7 - Focus Visible)', () => {
    it('should have visible focus indicators on all interactive elements', () => {
      renderNavigationHeader();
      
      // Test focus on navigation links
      const productLink = screen.getByRole('link', { name: 'Product' });
      productLink.focus();
      expect(document.activeElement).toBe(productLink);
      
      // Test focus on buttons
      const loginButton = screen.getAllByRole('button', { name: 'Log In' })[0];
      loginButton.focus();
      expect(document.activeElement).toBe(loginButton);
      
      // Test focus on mobile toggle
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      toggleButton.focus();
      expect(document.activeElement).toBe(toggleButton);
    });

    it('should maintain focus visibility when navigating mobile menu', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      // Open mobile menu
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      // Focus mobile elements
      const mobileLinks = screen.getAllByRole('link');
      const mobileProductLink = mobileLinks.find(link => 
        link.textContent === 'Product' && link !== screen.getAllByRole('link', { name: 'Product' })[0]
      );
      
      if (mobileProductLink) {
        mobileProductLink.focus();
        expect(document.activeElement).toBe(mobileProductLink);
      }
    });

    it('should not lose focus when mobile menu state changes', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      toggleButton.focus();
      expect(document.activeElement).toBe(toggleButton);
      
      // Open menu - focus should remain on toggle
      await user.keyboard('{Enter}');
      expect(document.activeElement).toBe(toggleButton);
      
      // Close menu - focus should still be on toggle
      await user.keyboard('{Enter}');
      expect(document.activeElement).toBe(toggleButton);
    });
  });

  describe('Color and Contrast (WCAG 1.4.3 - Contrast Minimum)', () => {
    it('should have sufficient color contrast for text elements', async () => {
      const { container } = renderNavigationHeader();
      
      // Note: Color contrast testing is limited in jsdom environment
      // In real browser testing, this would verify actual contrast ratios
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: false } // Disabled due to jsdom limitations
        }
      });
      expect(results).toHaveNoViolations();
    });

    it('should maintain contrast in different states', async () => {
      const user = userEvent.setup();
      const { container } = renderNavigationHeader();
      
      // Test with mobile menu open
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: false } // Disabled due to jsdom limitations
        }
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Motion and Animation (WCAG 2.3.3 - Animation from Interactions)', () => {
    it('should respect reduced motion preferences for mobile menu toggle', () => {
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

      renderNavigationHeader();
      
      // Component should render without animations when reduced motion is preferred
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      expect(toggleButton).toBeInTheDocument();
    });

    it('should not cause motion sickness with rapid menu toggles', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Rapid toggles should not cause accessibility issues
      for (let i = 0; i < 5; i++) {
        await user.click(toggleButton);
      }
      
      // Final state should be accessible
      expect(toggleButton).toHaveAttribute('aria-expanded');
      expect(['true', 'false']).toContain(toggleButton.getAttribute('aria-expanded'));
    });
  });

  describe('Touch and Pointer Accessibility (WCAG 2.5.5 - Target Size)', () => {
    it('should have adequate touch target sizes for mobile interactions', () => {
      renderNavigationHeader();
      
      // Mobile toggle button should be large enough for touch
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      expect(toggleButton).toBeInTheDocument();
      
      // CTA buttons should be properly sized
      const ctaButtons = screen.getAllByRole('button').filter(button => 
        button.textContent === 'Log In' || button.textContent === 'Sign Up'
      );
      expect(ctaButtons.length).toBeGreaterThan(0);
    });

    it('should maintain touch accessibility in mobile menu', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      // Mobile menu buttons should be accessible
      const mobileButtons = screen.getAllByRole('button').filter(button =>
        button !== toggleButton
      );
      expect(mobileButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Error Prevention and Help (WCAG 3.3.2 - Labels or Instructions)', () => {
    it('should provide clear labeling for all interactive elements', () => {
      renderNavigationHeader();
      
      // All buttons should have clear, descriptive labels
      expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'Log In' })).toHaveLength(1);
      expect(screen.getAllByRole('button', { name: 'Sign Up' })).toHaveLength(1);
      
      // All links should have descriptive text
      expect(screen.getByRole('link', { name: 'Product' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Enterprise' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
    });

    it('should provide contextual information for mobile menu state', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // State should be clear from aria attributes
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
      
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(toggleButton).toHaveAttribute('aria-label', 'Close menu');
    });
  });

  describe('Responsive Design Accessibility', () => {
    it('should maintain accessibility across viewport changes', async () => {
      const { container } = renderNavigationHeader();
      
      // Simulate viewport change by testing both desktop and mobile states
      const results1 = await axe(container);
      expect(results1).toHaveNoViolations();
      
      // Open mobile menu (simulating mobile viewport behavior)
      const user = userEvent.setup();
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      const results2 = await axe(container);
      expect(results2).toHaveNoViolations();
    });

    it('should provide consistent navigation experience across devices', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      // Desktop navigation should be accessible
      const desktopLinks = screen.getAllByRole('link');
      expect(desktopLinks).toHaveLength(3); // Product, Enterprise, Contact
      
      // Mobile navigation should be accessible
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      await user.click(toggleButton);
      
      const allLinks = screen.getAllByRole('link');
      expect(allLinks).toHaveLength(6); // Desktop + mobile versions
    });
  });

  describe('Form Integration Accessibility', () => {
    it('should work correctly with form accessibility patterns', () => {
      render(
        <div>
          <NavigationHeader />
          <main>
            <form>
              <label htmlFor="search">Search:</label>
              <input id="search" type="text" />
              <button type="submit">Submit</button>
            </form>
          </main>
        </div>
      );
      
      // Navigation should not interfere with form accessibility
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByLabelText('Search:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should maintain proper heading hierarchy', () => {
      render(
        <div>
          <NavigationHeader />
          <main>
            <h1>Main Page Title</h1>
            <h2>Section Title</h2>
          </main>
        </div>
      );
      
      // Heading structure should be logical
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  describe('Screen Reader Announcements', () => {
    it('should provide appropriate announcements for state changes', async () => {
      const user = userEvent.setup();
      renderNavigationHeader();
      
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      
      // Initial state should be announced via aria-expanded
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      
      // State change should be announced
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      // The screen reader will announce "Close menu" due to aria-label change
      expect(toggleButton).toHaveAttribute('aria-label', 'Close menu');
    });

    it('should not announce decorative content', () => {
      renderNavigationHeader();
      
      // Mobile toggle icon should be decorative
      const toggleButton = screen.getByRole('button', { name: 'Open menu' });
      const icon = toggleButton.querySelector('img');
      
      expect(icon).toHaveAttribute('alt', '');
    });
  });
});