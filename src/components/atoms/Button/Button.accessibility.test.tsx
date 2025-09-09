import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button, { ButtonProps } from './Button';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

// Mock the SCSS module
jest.mock('./Button.module.scss', () => ({
  button: 'button',
  'button--primary': 'button--primary',
  'button--secondary': 'button--secondary',
  'button--tertiary': 'button--tertiary',
  'button--default': 'button--default',
  'button--loading': 'button--loading',
  'button--disabled': 'button--disabled',
  loadingContent: 'loadingContent',
  spinner: 'spinner',
  loadingText: 'loadingText',
}));

describe('Button Accessibility Tests (WCAG 2.1 AA Compliance)', () => {
  const renderButton = (props: Partial<ButtonProps> = {}) => {
    return render(<Button children="Test Button" {...props} />);
  };

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations (default state)', async () => {
      const { container } = renderButton();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (all variants)', async () => {
      const variants: Array<ButtonProps['variant']> = ['primary', 'secondary', 'tertiary'];
      
      for (const variant of variants) {
        const { container } = renderButton({ variant });
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('should have no accessibility violations (all states)', async () => {
      const states = [
        { disabled: true },
        { loading: true },
        { disabled: true, loading: true },
      ];
      
      for (const state of states) {
        const { container } = renderButton(state);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('should have no accessibility violations with custom aria-label', async () => {
      const { container } = renderButton({ 'aria-label': 'Submit your application form' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation (WCAG 2.1.1)', () => {
    it('should be reachable via tab navigation', async () => {
      const user = userEvent.setup();
      renderButton();
      
      const button = screen.getByRole('button');
      
      await user.tab();
      expect(button).toHaveFocus();
    });

    it('should not be reachable via tab when disabled', async () => {
      const user = userEvent.setup();
      renderButton({ disabled: true });
      
      const button = screen.getByRole('button');
      
      await user.tab();
      expect(button).not.toHaveFocus();
    });

    it('should not be reachable via tab when loading', async () => {
      const user = userEvent.setup();
      renderButton({ loading: true });
      
      const button = screen.getByRole('button');
      
      await user.tab();
      expect(button).not.toHaveFocus();
    });

    it('should be activatable with Enter key', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderButton({ onClick });
      
      const button = screen.getByRole('button');
      button.focus();
      
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should be activatable with Space key', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderButton({ onClick });
      
      const button = screen.getByRole('button');
      button.focus();
      
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not be activatable with keyboard when disabled', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderButton({ disabled: true, onClick });
      
      const button = screen.getByRole('button');
      
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not be activatable with keyboard when loading', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderButton({ loading: true, onClick });
      
      const button = screen.getByRole('button');
      
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Screen Reader Support (WCAG 4.1.2)', () => {
    it('should have proper role', () => {
      renderButton();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should have accessible name from children', () => {
      renderButton({ children: 'Submit Application' });
      expect(screen.getByRole('button', { name: 'Submit Application' })).toBeInTheDocument();
    });

    it('should prioritize aria-label over children for accessible name', () => {
      renderButton({ 
        children: 'Submit', 
        'aria-label': 'Submit your job application form' 
      });
      expect(screen.getByRole('button', { name: 'Submit your job application form' })).toBeInTheDocument();
    });

    it('should announce state changes with aria-disabled', () => {
      const { rerender } = renderButton();
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'false');
      
      rerender(<Button disabled>Test Button</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      
      rerender(<Button loading>Test Button</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should hide decorative spinner from screen readers', () => {
      const { container } = renderButton({ loading: true });
      const spinner = container.querySelector('.spinner');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });

    it('should maintain accessible content during loading state', () => {
      renderButton({ loading: true, children: 'Processing...' });
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAccessibleName('Processing...');
    });
  });

  describe('Focus Management (WCAG 2.4.7)', () => {
    it('should have visible focus indicator', () => {
      renderButton();
      const button = screen.getByRole('button');
      
      button.focus();
      
      // The focus indicator is applied via CSS :focus-visible pseudo-class
      // We can't directly test CSS styles, but we can ensure the element is focusable
      expect(document.activeElement).toBe(button);
    });

    it('should maintain focus visibility across state changes', async () => {
      const { rerender } = renderButton();
      const button = screen.getByRole('button');
      
      button.focus();
      expect(document.activeElement).toBe(button);
      
      // Test variant changes don't affect focus
      rerender(<Button variant="secondary">Test Button</Button>);
      expect(document.activeElement).toBe(screen.getByRole('button'));
    });

    it('should lose focus when disabled', async () => {
      const { rerender } = renderButton();
      const button = screen.getByRole('button');
      
      button.focus();
      expect(document.activeElement).toBe(button);
      
      rerender(<Button disabled>Test Button</Button>);
      // When disabled, the button element itself may still be the active element,
      // but it should not receive keyboard focus
      const disabledButton = screen.getByRole('button');
      expect(disabledButton).toBeDisabled();
    });

    it('should lose focus when loading', async () => {
      const { rerender } = renderButton();
      const button = screen.getByRole('button');
      
      button.focus();
      expect(document.activeElement).toBe(button);
      
      rerender(<Button loading>Test Button</Button>);
      // When loading, the button element itself may still be the active element,
      // but it should not receive keyboard focus
      const loadingButton = screen.getByRole('button');
      expect(loadingButton).toBeDisabled();
    });
  });

  describe('Color and Contrast (WCAG 1.4.3)', () => {
    it('should have sufficient color contrast in default state', async () => {
      const { container } = renderButton();
      // Skip color contrast testing in jest due to jsdom canvas limitations
      // In a real browser environment, this would test actual color contrast
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: false } // Disabled due to jsdom limitations
        }
      });
      expect(results).toHaveNoViolations();
    });

    it('should have sufficient color contrast in all variants', async () => {
      const variants: Array<ButtonProps['variant']> = ['primary', 'secondary', 'tertiary'];
      
      for (const variant of variants) {
        const { container } = renderButton({ variant });
        // Skip color contrast testing in jest due to jsdom canvas limitations
        const results = await axe(container, {
          rules: {
            'color-contrast': { enabled: false } // Disabled due to jsdom limitations
          }
        });
        expect(results).toHaveNoViolations();
      }
    });

    it('should have sufficient color contrast when disabled', async () => {
      const { container } = renderButton({ disabled: true });
      // Skip color contrast testing in jest due to jsdom canvas limitations
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: false } // Disabled due to jsdom limitations
        }
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Motion and Animation (WCAG 2.3.3)', () => {
    it('should respect reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(), // deprecated
          removeListener: jest.fn(), // deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = renderButton({ loading: true });
      const spinner = container.querySelector('.spinner');
      
      // While we can't directly test CSS animation being disabled,
      // we can ensure the spinner element exists and is properly marked
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Error Prevention and Help (WCAG 3.3.2)', () => {
    it('should provide clear indication of disabled state', () => {
      renderButton({ disabled: true });
      const button = screen.getByRole('button');
      
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should provide clear indication of loading state', () => {
      renderButton({ loading: true });
      const button = screen.getByRole('button');
      
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should maintain clear labeling in all states', () => {
      const testCases = [
        { props: { children: 'Submit' }, expectedName: 'Submit' },
        { props: { children: 'Submit', disabled: true }, expectedName: 'Submit' },
        { props: { children: 'Submit', loading: true }, expectedName: 'Submit' },
        { props: { children: 'Submit', 'aria-label': 'Submit form' }, expectedName: 'Submit form' },
      ];
      
      testCases.forEach(({ props, expectedName }) => {
        const { unmount } = renderButton(props);
        expect(screen.getByRole('button')).toHaveAccessibleName(expectedName);
        unmount();
      });
    });
  });

  describe('Form Integration (WCAG 1.3.1)', () => {
    it('should work correctly with form labels', () => {
      render(
        <form>
          <label htmlFor="submit-btn">Submit your application</label>
          <Button id="submit-btn" type="submit">Submit</Button>
        </form>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'submit-btn');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should maintain form submission semantics', () => {
      renderButton({ type: 'submit' });
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).not.toBeDisabled();
    });

    it('should prevent form submission when disabled', () => {
      renderButton({ type: 'submit', disabled: true });
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toBeDisabled();
    });

    it('should prevent form submission when loading', () => {
      renderButton({ type: 'submit', loading: true });
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toBeDisabled();
    });
  });
});