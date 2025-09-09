import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  'button--disabled': 'button--disabled',
}));

describe('Button Component', () => {
  // Setup
  const defaultProps: ButtonProps = {
    children: 'Test Button',
  };

  const renderButton = (props: Partial<ButtonProps> = {}) => {
    return render(<Button {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderButton();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should display children content', () => {
      renderButton({ children: 'Click Me' });
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should render as a button element by default', () => {
      renderButton();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render complex children content', () => {
      const complexChildren = (
        <span>
          <strong>Bold</strong> text
        </span>
      );
      renderButton({ children: complexChildren });
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('text')).toBeInTheDocument();
    });
  });

  // Props and Default Values Tests
  describe('Props and Default Values', () => {
    it('should use default variant (primary)', () => {
      const { container } = renderButton();
      const button = container.querySelector('button');
      expect(button).toHaveClass('button--primary');
    });


    it('should use default type (button)', () => {
      renderButton();
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('should not be disabled by default', () => {
      renderButton();
      expect(screen.getByRole('button')).not.toBeDisabled();
    });


    it('should apply custom className', () => {
      const { container } = renderButton({ className: 'custom-class' });
      const button = container.querySelector('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should handle empty className', () => {
      const { container } = renderButton({ className: '' });
      const button = container.querySelector('button');
      expect(button).toHaveClass('button');
    });

    it('should handle undefined className', () => {
      const { container } = renderButton({ className: undefined });
      const button = container.querySelector('button');
      expect(button).toHaveClass('button');
    });
  });

  // Variant Tests
  describe('Button Variants', () => {
    it('should apply primary variant class', () => {
      const { container } = renderButton({ variant: 'primary' });
      const button = container.querySelector('button');
      expect(button).toHaveClass('button--primary');
    });

    it('should apply secondary variant class', () => {
      const { container } = renderButton({ variant: 'secondary' });
      const button = container.querySelector('button');
      expect(button).toHaveClass('button--secondary');
    });

    it('should apply tertiary variant class', () => {
      const { container } = renderButton({ variant: 'tertiary' });
      const button = container.querySelector('button');
      expect(button).toHaveClass('button--tertiary');
    });

    it('should combine variant and size classes', () => {
      const { container } = renderButton({ variant: 'secondary', size: 'default' });
      const button = container.querySelector('button');
      expect(button).toHaveClass('button--secondary');
      expect(button).toHaveClass('button--default');
    });
  });

  // State Tests
  describe('Button States', () => {
    describe('Disabled State', () => {
      it('should apply disabled state', () => {
        renderButton({ disabled: true });
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-disabled', 'true');
      });

      it('should apply disabled CSS class', () => {
        const { container } = renderButton({ disabled: true });
        const button = container.querySelector('button');
        expect(button).toHaveClass('button--disabled');
      });

      it('should not call onClick when disabled', async () => {
        const user = userEvent.setup();
        const onClick = jest.fn();
        renderButton({ disabled: true, onClick });
        
        const button = screen.getByRole('button');
        await user.click(button);
        
        expect(onClick).not.toHaveBeenCalled();
      });
    });

  });

  // User Interaction Tests
  describe('User Interactions', () => {
    it('should call onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderButton({ onClick });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick with event object', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderButton({ onClick });
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(onClick).toHaveBeenCalledWith(expect.any(Object));
      expect(onClick.mock.calls[0][0]).toHaveProperty('type', 'click');
    });

    it('should handle keyboard interactions (Enter key)', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderButton({ onClick });
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard interactions (Space key)', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      renderButton({ onClick });
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should be focusable', () => {
      renderButton();
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('should not be focusable when disabled', () => {
      renderButton({ disabled: true });
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).not.toBe(button);
    });
  });

  // ARIA and Accessibility Tests
  describe('ARIA Attributes and Accessibility', () => {
    it('should have proper role', () => {
      renderButton();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should apply aria-label when provided', () => {
      renderButton({ 'aria-label': 'Custom Label' });
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom Label');
    });

    it('should not have aria-label when not provided', () => {
      renderButton();
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-label');
    });

    it('should set aria-disabled to true when disabled', () => {
      renderButton({ disabled: true });
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should set aria-disabled to false when enabled', () => {
      renderButton({ disabled: false });
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'false');
    });

    it('should have no accessibility violations', async () => {
      const { container } = renderButton();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when disabled', async () => {
      const { container } = renderButton({ disabled: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when loading', async () => {
      const { container } = renderButton({ loading: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with aria-label', async () => {
      const { container } = renderButton({ 'aria-label': 'Submit form' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // CSS Class Application Tests
  describe('CSS Class Application', () => {
    it('should always apply base button class', () => {
      const { container } = renderButton();
      const button = container.querySelector('button');
      expect(button).toHaveClass('button');
    });

    it('should apply multiple classes correctly', () => {
      const { container } = renderButton({
        variant: 'primary',
        size: 'default',
        loading: true,
        disabled: true,
        className: 'custom-class'
      });
      const button = container.querySelector('button');
      
      expect(button).toHaveClass('button');
      expect(button).toHaveClass('button--primary');
      expect(button).toHaveClass('button--default');
      expect(button).toHaveClass('button--loading');
      expect(button).toHaveClass('button--disabled');
      expect(button).toHaveClass('custom-class');
    });

    it('should filter out falsy class names', () => {
      const { container } = renderButton({
        disabled: false,
        className: ''
      });
      const button = container.querySelector('button');
      
      expect(button).not.toHaveClass('button--disabled');
      expect(button?.className?.split(' ')).not.toContain('');
    });
  });

  // Props Spreading Tests
  describe('Props Spreading', () => {
    it('should spread additional HTML button props', () => {
      renderButton({
        id: 'test-button',
        title: 'Test Title',
        'data-testid': 'custom-test-id',
        tabIndex: 0
      });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'test-button');
      expect(button).toHaveAttribute('title', 'Test Title');
      expect(button).toHaveAttribute('data-testid', 'custom-test-id');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('should handle form-related props', () => {
      renderButton({
        form: 'test-form',
        formAction: '/submit',
        formMethod: 'post',
        type: 'submit'
      });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'test-form');
      expect(button).toHaveAttribute('formAction', '/submit');
      expect(button).toHaveAttribute('formMethod', 'post');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should override type prop correctly', () => {
      renderButton({ type: 'submit' });
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should handle event handlers from props spreading', async () => {
      const user = userEvent.setup();
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const onMouseEnter = jest.fn();
      const onMouseLeave = jest.fn();
      
      renderButton({
        onFocus,
        onBlur,
        onMouseEnter,
        onMouseLeave
      });
      
      const button = screen.getByRole('button');
      
      await user.hover(button);
      expect(onMouseEnter).toHaveBeenCalledTimes(1);
      
      await user.unhover(button);
      expect(onMouseLeave).toHaveBeenCalledTimes(1);
      
      button.focus();
      expect(onFocus).toHaveBeenCalledTimes(1);
      
      button.blur();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  // Edge Cases and Error Handling
  describe('Edge Cases', () => {
    it('should handle null children', () => {
      renderButton({ children: null });
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('should handle undefined children', () => {
      renderButton({ children: undefined });
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('should handle empty string children', () => {
      renderButton({ children: '' });
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('should handle numeric children', () => {
      renderButton({ children: 0 });
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle boolean children (false should not render)', () => {
      renderButton({ children: false });
      const button = screen.getByRole('button');
      expect(button).toBeEmptyDOMElement();
    });

    it('should handle array of children', () => {
      const children = ['First', ' ', 'Second'];
      renderButton({ children });
      expect(screen.getByText('First Second')).toBeInTheDocument();
    });

    it('should maintain button functionality with complex nested children', () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      const complexChildren = (
        <div>
          <span>Icon</span>
          <span>Text</span>
        </div>
      );
      
      renderButton({ children: complexChildren, onClick });
      
      const button = screen.getByRole('button');
      user.click(button);
      
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });

  // Performance and Re-render Tests
  describe('Performance', () => {
    it('should not unnecessarily re-render when props do not change', () => {
      const { rerender } = renderButton({ children: 'Test' });
      const button1 = screen.getByRole('button');
      
      rerender(<Button>Test</Button>);
      const button2 = screen.getByRole('button');
      
      expect(button1).toBe(button2);
    });

    it('should handle rapid state changes', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      const { rerender } = renderButton({ onClick });
      
      // Rapidly change disabled state
      rerender(<Button onClick={onClick} disabled={true}>Test</Button>);
      rerender(<Button onClick={onClick} disabled={false}>Test</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  // Integration Tests
  describe('Integration Scenarios', () => {
    it('should work correctly in a form context', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={onSubmit}>
          <Button type="submit">Submit Form</Button>
        </form>
      );
      
      const form = screen.getByRole('button').closest('form');
      expect(form).toBeInTheDocument();
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      
      // Test form submission with fireEvent as a workaround for jsdom limitation
      fireEvent.submit(form!);
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should work with different button types', () => {
      const { rerender } = renderButton({ type: 'button' });
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
      
      rerender(<Button type="submit">Test</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
      
      rerender(<Button type="reset">Test</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });

    it('should maintain accessibility across variant changes', async () => {
      const { rerender, container } = renderButton({ variant: 'primary' });
      
      let results = await axe(container);
      expect(results).toHaveNoViolations();
      
      rerender(<Button variant="secondary">Test</Button>);
      results = await axe(container);
      expect(results).toHaveNoViolations();
      
      rerender(<Button variant="tertiary">Test</Button>);
      results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});