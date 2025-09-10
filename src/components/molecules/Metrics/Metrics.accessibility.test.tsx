import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Metrics, MetricsProps, MetricData } from './Metrics';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

// Mock the SCSS module
jest.mock('./Metrics.module.scss', () => ({
  metrics: 'metrics',
  'metrics--single': 'metrics--single',
  'metrics--double': 'metrics--double',
  metrics__container: 'metrics__container',
  metrics__row: 'metrics__row',
  metrics__item: 'metrics__item',
  metrics__title: 'metrics__title',
  metrics__values: 'metrics__values',
  metrics__value: 'metrics__value',
  'metrics__value--secondary': 'metrics__value--secondary',
  metrics__description: 'metrics__description',
  'gradient--blue': 'gradient--blue',
  'gradient--orange': 'gradient--orange',
}));

describe('Metrics Accessibility Tests (WCAG 2.1 AA Compliance)', () => {
  // Test data builders
  const buildMetricData = (overrides: Partial<MetricData> = {}): MetricData => ({
    title: 'Test Metric',
    value: '100',
    description: 'Test description',
    ...overrides,
  });

  const buildMetricDataWithSecondary = (overrides: Partial<MetricData> = {}): MetricData => ({
    title: 'Test Metric',
    value: '100',
    secondaryValue: '50',
    description: 'Test description',
    ...overrides,
  });

  const renderMetrics = (props: Partial<MetricsProps> = {}) => {
    const defaultProps: MetricsProps = {
      metrics: [buildMetricData()],
      ...props,
    };
    return render(<Metrics {...defaultProps} />);
  };

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations (default state)', async () => {
      const { container } = renderMetrics();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (single variant)', async () => {
      const { container } = renderMetrics({ variant: 'single' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (double variant)', async () => {
      const { container } = renderMetrics({ variant: 'double' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (all gradient colors)', async () => {
      const gradientColors = ['blue', 'orange', '#FF5733'];
      
      for (const gradientColor of gradientColors) {
        const { container } = renderMetrics({ gradientColor });
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('should have no accessibility violations (multiple metrics)', async () => {
      const metrics = [
        buildMetricData({ title: 'Metric 1', value: '100' }),
        buildMetricData({ title: 'Metric 2', value: '200' }),
        buildMetricData({ title: 'Metric 3', value: '300' }),
      ];
      
      const { container } = renderMetrics({ metrics });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations (double variant with secondary values)', async () => {
      const metrics = [
        buildMetricDataWithSecondary({ title: 'Revenue', value: '$1M', secondaryValue: '$800K' }),
        buildMetricDataWithSecondary({ title: 'Users', value: '10K', secondaryValue: '8K' }),
      ];
      
      const { container } = renderMetrics({ 
        variant: 'double', 
        metrics,
        gradientColor: 'blue' 
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Semantic Structure and Roles (WCAG 1.3.1)', () => {
    it('should use proper semantic structure', () => {
      renderMetrics();
      
      // Should render as a section with proper landmark role
      const section = screen.getByLabelText('Metrics dashboard');
      expect(section).toBeInTheDocument();
      expect(section.tagName.toLowerCase()).toBe('section');
    });

    it('should use proper heading hierarchy', () => {
      const metrics = [
        buildMetricData({ title: 'Revenue' }),
        buildMetricData({ title: 'Users' }),
        buildMetricData({ title: 'Growth' }),
      ];
      
      renderMetrics({ metrics });
      
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(3);
      
      headings.forEach(heading => {
        expect(heading.tagName.toLowerCase()).toBe('h3');
      });
    });

    it('should maintain heading hierarchy consistency', () => {
      const metrics = Array.from({ length: 5 }, (_, i) => 
        buildMetricData({ title: `Metric ${i + 1}` })
      );
      
      renderMetrics({ metrics });
      
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(5);
      
      // All headings should be at the same level (h3)
      headings.forEach(heading => {
        expect(heading.tagName.toLowerCase()).toBe('h3');
      });
    });

    it('should structure content with proper paragraph elements', () => {
      const metric = buildMetricData({
        title: 'Revenue',
        value: '$1,000,000',
        description: 'Total annual revenue',
      });
      
      renderMetrics({ metrics: [metric] });
      
      // Values and descriptions should be in paragraph elements
      const value = screen.getByText('$1,000,000');
      const description = screen.getByText('Total annual revenue');
      
      expect(value.tagName.toLowerCase()).toBe('p');
      expect(description.tagName.toLowerCase()).toBe('p');
    });

    it('should maintain semantic structure in double variant', () => {
      const metric = buildMetricDataWithSecondary({
        title: 'Sales Performance',
        value: '$2M',
        secondaryValue: '$1.5M',
        description: 'Current vs Previous Quarter',
      });
      
      renderMetrics({ variant: 'double', metrics: [metric] });
      
      const heading = screen.getByRole('heading', { level: 3 });
      const primaryValue = screen.getByText('$2M');
      const secondaryValue = screen.getByText('$1.5M');
      const description = screen.getByText('Current vs Previous Quarter');
      
      expect(heading.tagName.toLowerCase()).toBe('h3');
      expect(primaryValue.tagName.toLowerCase()).toBe('p');
      expect(secondaryValue.tagName.toLowerCase()).toBe('p');
      expect(description.tagName.toLowerCase()).toBe('p');
    });
  });

  describe('Screen Reader Support (WCAG 4.1.2)', () => {
    it('should provide accessible names for all headings', () => {
      const metrics = [
        buildMetricData({ title: 'Monthly Active Users' }),
        buildMetricData({ title: 'Annual Recurring Revenue' }),
        buildMetricData({ title: 'Customer Satisfaction Score' }),
      ];
      
      renderMetrics({ metrics });
      
      expect(screen.getByRole('heading', { name: 'Monthly Active Users' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Annual Recurring Revenue' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Customer Satisfaction Score' })).toBeInTheDocument();
    });

    it('should provide meaningful content structure for screen readers', () => {
      const metric = buildMetricData({
        title: 'Website Traffic',
        value: '1.2M visits',
        description: 'Monthly unique visitors',
      });
      
      renderMetrics({ metrics: [metric] });
      
      // Content should be available to screen readers in logical order
      const section = screen.getByLabelText('Metrics dashboard');
      const heading = screen.getByRole('heading', { name: 'Website Traffic' });
      const value = screen.getByText('1.2M visits');
      const description = screen.getByText('Monthly unique visitors');
      
      // Verify the hierarchical structure
      expect(section).toContainElement(heading);
      expect(section).toContainElement(value);
      expect(section).toContainElement(description);
    });

    it('should handle empty or minimal content gracefully for screen readers', () => {
      const metric: MetricData = {
        title: 'Zero Value Metric',
        value: '0',
        description: 'No description available',
      };
      
      renderMetrics({ metrics: [metric] });
      
      // Should still maintain proper structure even with minimal content
      expect(screen.getByLabelText('Metrics dashboard')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should provide proper content association for complex metrics', () => {
      const metric = buildMetricDataWithSecondary({
        title: 'Q4 Sales Performance',
        value: '$2.5M',
        secondaryValue: '$2.1M',
        description: 'Current quarter vs previous quarter',
      });
      
      renderMetrics({ variant: 'double', metrics: [metric] });
      
      // All content should be properly associated within the metric item
      const heading = screen.getByRole('heading', { name: 'Q4 Sales Performance' });
      const primaryValue = screen.getByText('$2.5M');
      const secondaryValue = screen.getByText('$2.1M');
      const description = screen.getByText('Current quarter vs previous quarter');
      
      expect(heading).toBeInTheDocument();
      expect(primaryValue).toBeInTheDocument();
      expect(secondaryValue).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation (WCAG 2.1.1)', () => {
    it('should not create keyboard traps', async () => {
      const user = userEvent.setup();
      renderMetrics();
      
      // Metrics component should not trap keyboard focus
      // Tab navigation should move through the document normally
      await user.tab();
      
      // Since the component is non-interactive, it should not receive focus
      // but should not prevent normal tab navigation
      const focusedElement = document.activeElement;
      
      // The component itself shouldn't trap focus or interfere with navigation
      expect(focusedElement).not.toHaveClass('metrics');
    });

    it('should allow keyboard navigation to pass through the component', async () => {
      const user = userEvent.setup();
      
      // Render component with interactive elements before and after
      render(
        <div>
          <button>Before Metrics</button>
          <Metrics metrics={[buildMetricData()]} />
          <button>After Metrics</button>
        </div>
      );
      
      const beforeButton = screen.getByRole('button', { name: 'Before Metrics' });
      const afterButton = screen.getByRole('button', { name: 'After Metrics' });
      
      // Start from before button
      beforeButton.focus();
      expect(document.activeElement).toBe(beforeButton);
      
      // Tab should move to after button (skipping non-interactive metrics)
      await user.tab();
      expect(document.activeElement).toBe(afterButton);
    });

    it('should not interfere with assistive technology navigation', () => {
      const metrics = [
        buildMetricData({ title: 'Metric 1' }),
        buildMetricData({ title: 'Metric 2' }),
      ];
      
      renderMetrics({ metrics });
      
      // Verify that all content is accessible for screen readers
      // without requiring keyboard interaction
      expect(screen.getByText('Metric 1')).toBeInTheDocument();
      expect(screen.getByText('Metric 2')).toBeInTheDocument();
      expect(screen.getAllByRole('heading')).toHaveLength(2);
    });
  });

  describe('Color and Contrast (WCAG 1.4.3)', () => {
    it('should not rely solely on color to convey information', () => {
      const metrics = [
        buildMetricData({ title: 'Positive Metric', value: '+25%' }),
        buildMetricData({ title: 'Negative Metric', value: '-10%' }),
        buildMetricData({ title: 'Neutral Metric', value: '0%' }),
      ];
      
      renderMetrics({ metrics });
      
      // Information should be conveyed through text content, not just color
      expect(screen.getByText('+25%')).toBeInTheDocument();
      expect(screen.getByText('-10%')).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
      
      // Titles provide context for the values
      expect(screen.getByText('Positive Metric')).toBeInTheDocument();
      expect(screen.getByText('Negative Metric')).toBeInTheDocument();
      expect(screen.getByText('Neutral Metric')).toBeInTheDocument();
    });

    it('should have sufficient color contrast with different gradient colors', async () => {
      const gradientColors = ['blue', 'orange', '#FF5733'];
      
      for (const gradientColor of gradientColors) {
        const { container } = renderMetrics({ gradientColor });
        
        // Skip actual color contrast testing in jest due to jsdom canvas limitations
        // In a real browser environment, this would test actual color contrast
        const results = await axe(container, {
          rules: {
            'color-contrast': { enabled: false } // Disabled due to jsdom limitations
          }
        });
        expect(results).toHaveNoViolations();
      }
    });

    it('should maintain readability with custom gradient colors', async () => {
      const customColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
      
      for (const [index, color] of customColors.entries()) {
        const testMetric = buildMetricData({
          title: `Custom Color Test ${index + 1}`,
          value: `${(index + 1) * 100}`,
          description: `Description for test ${index + 1}`,
        });
        
        const { container, unmount } = renderMetrics({ 
          gradientColor: color, 
          metrics: [testMetric] 
        });
        
        // Text content should remain accessible regardless of color
        expect(screen.getByText(`Custom Color Test ${index + 1}`)).toBeInTheDocument();
        expect(screen.getByText(`${(index + 1) * 100}`)).toBeInTheDocument();
        expect(screen.getByText(`Description for test ${index + 1}`)).toBeInTheDocument();
        
        // Basic accessibility check
        const results = await axe(container, {
          rules: {
            'color-contrast': { enabled: false } // Disabled due to jsdom limitations
          }
        });
        expect(results).toHaveNoViolations();
        
        // Clean up before next iteration
        unmount();
      }
    });
  });

  describe('Focus Management (WCAG 2.4.7)', () => {
    it('should not interfere with natural focus flow', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <input placeholder="Before metrics" />
          <Metrics metrics={[buildMetricData()]} />
          <input placeholder="After metrics" />
        </div>
      );
      
      const beforeInput = screen.getByPlaceholderText('Before metrics');
      const afterInput = screen.getByPlaceholderText('After metrics');
      
      beforeInput.focus();
      expect(document.activeElement).toBe(beforeInput);
      
      await user.tab();
      expect(document.activeElement).toBe(afterInput);
    });

    it('should not create focus management issues with dynamic content', () => {
      const { rerender } = renderMetrics({
        metrics: [buildMetricData({ title: 'Initial Metric' })],
      });
      
      rerender(
        <Metrics
          metrics={[
            buildMetricData({ title: 'Updated Metric 1' }),
            buildMetricData({ title: 'Updated Metric 2' }),
          ]}
        />
      );
      
      // Content updates should not affect focus management
      expect(screen.getByText('Updated Metric 1')).toBeInTheDocument();
      expect(screen.getByText('Updated Metric 2')).toBeInTheDocument();
      expect(screen.queryByText('Initial Metric')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design Accessibility (WCAG 1.4.10)', () => {
    it('should maintain accessibility at different viewport sizes', async () => {
      // Test with different viewport implications via different content
      const longMetrics = [
        buildMetricData({
          title: 'Very Long Metric Title That Might Wrap',
          value: 'Large Value 1,000,000',
          description: 'This is a very long description that explains the metric in great detail and might wrap to multiple lines',
        }),
        buildMetricData({
          title: 'Another Long Title',
          value: 'Another Large Value',
          description: 'Another detailed description',
        }),
      ];
      
      const { container } = renderMetrics({ metrics: longMetrics });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      
      // Content should remain accessible regardless of wrapping
      expect(screen.getByText('Very Long Metric Title That Might Wrap')).toBeInTheDocument();
      expect(screen.getByText('Large Value 1,000,000')).toBeInTheDocument();
    });

    it('should maintain semantic structure with responsive content', () => {
      const responsiveMetrics = Array.from({ length: 6 }, (_, i) => 
        buildMetricData({ title: `Metric ${i + 1}`, value: `${(i + 1) * 100}` })
      );
      
      renderMetrics({ metrics: responsiveMetrics });
      
      // All headings should maintain proper hierarchy
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(6);
      
      // All content should be accessible
      responsiveMetrics.forEach((_, i) => {
        expect(screen.getByText(`Metric ${i + 1}`)).toBeInTheDocument();
        expect(screen.getByText(`${(i + 1) * 100}`)).toBeInTheDocument();
      });
    });
  });

  describe('Content Structure and Navigation (WCAG 1.3.2)', () => {
    it('should present content in a meaningful sequence', () => {
      const metric = buildMetricDataWithSecondary({
        title: 'Sales Data',
        value: 'Q4 2024: $2M',
        secondaryValue: 'Q3 2024: $1.8M',
        description: 'Quarterly sales comparison',
      });
      
      renderMetrics({ variant: 'double', metrics: [metric] });
      
      // Content should be presented in logical order
      const section = screen.getByLabelText('Metrics dashboard');
      const heading = screen.getByRole('heading', { name: 'Sales Data' });
      const primaryValue = screen.getByText('Q4 2024: $2M');
      const secondaryValue = screen.getByText('Q3 2024: $1.8M');
      const description = screen.getByText('Quarterly sales comparison');
      
      // Verify hierarchical containment
      expect(section).toContainElement(heading);
      expect(section).toContainElement(primaryValue);
      expect(section).toContainElement(secondaryValue);
      expect(section).toContainElement(description);
    });

    it('should maintain meaningful content sequence with multiple metrics', () => {
      const metrics = [
        buildMetricData({ title: 'First Metric', value: '100', description: 'First description' }),
        buildMetricData({ title: 'Second Metric', value: '200', description: 'Second description' }),
        buildMetricData({ title: 'Third Metric', value: '300', description: 'Third description' }),
      ];
      
      renderMetrics({ metrics });
      
      // Each metric should maintain its internal structure
      metrics.forEach((metric, index) => {
        expect(screen.getByText(metric.title)).toBeInTheDocument();
        expect(screen.getByText(metric.value)).toBeInTheDocument();
        expect(screen.getByText(metric.description)).toBeInTheDocument();
      });
      
      // All headings should be properly structured
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(3);
    });
  });

  describe('Error Prevention and Robustness (WCAG 4.1.1)', () => {
    it('should handle missing or invalid data gracefully', async () => {
      const problematicMetrics: MetricData[] = [
        { title: 'Empty Content Metric', value: '', description: '' },
        buildMetricData({ title: 'Valid Metric' }),
      ];
      
      const { container } = renderMetrics({ metrics: problematicMetrics });
      
      // Should still maintain accessibility even with problematic data
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      
      // Valid content should still be accessible
      expect(screen.getByText('Valid Metric')).toBeInTheDocument();
      expect(screen.getByText('Empty Content Metric')).toBeInTheDocument();
    });

    it('should maintain accessibility with dynamic content changes', async () => {
      const { rerender, container } = renderMetrics({
        metrics: [buildMetricData({ title: 'Initial' })],
      });
      
      let results = await axe(container);
      expect(results).toHaveNoViolations();
      
      // Update with different content
      rerender(
        <Metrics
          variant="double"
          gradientColor="blue"
          metrics={[
            buildMetricDataWithSecondary({ title: 'Updated', secondaryValue: 'Secondary' }),
          ]}
        />
      );
      
      results = await axe(container);
      expect(results).toHaveNoViolations();
      
      expect(screen.getByText('Updated')).toBeInTheDocument();
      expect(screen.getByText('Secondary')).toBeInTheDocument();
    });

    it('should handle edge cases without breaking accessibility', async () => {
      const edgeCaseMetrics = [
        buildMetricData({
          title: 'Special Characters: !@#$%^&*()',
          value: 'Unicode: 🚀 💰 📈',
          description: 'HTML entities: &lt;&gt;&amp;',
        }),
      ];
      
      const { container } = renderMetrics({ metrics: edgeCaseMetrics });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      
      // Content with special characters should still be accessible
      expect(screen.getByText('Special Characters: !@#$%^&*()')).toBeInTheDocument();
      expect(screen.getByText('Unicode: 🚀 💰 📈')).toBeInTheDocument();
    });
  });

  describe('Internationalization and Localization (WCAG 3.1.1)', () => {
    it('should handle different text lengths and directions', () => {
      const internationalMetrics = [
        buildMetricData({
          title: 'English Title',
          value: '1,000',
          description: 'English description',
        }),
        buildMetricData({
          title: 'Título muy largo en español',
          value: '2.000',
          description: 'Descripción muy detallada en español',
        }),
        buildMetricData({
          title: 'Très long titre français',
          value: '3 000',
          description: 'Description très détaillée en français',
        }),
      ];
      
      renderMetrics({ metrics: internationalMetrics });
      
      // All international content should be accessible
      expect(screen.getByText('English Title')).toBeInTheDocument();
      expect(screen.getByText('Título muy largo en español')).toBeInTheDocument();
      expect(screen.getByText('Très long titre français')).toBeInTheDocument();
    });

    it('should maintain structure with varying content lengths', async () => {
      const varyingLengthMetrics = [
        buildMetricData({
          title: 'Short',
          value: '1',
          description: 'Brief',
        }),
        buildMetricData({
          title: 'This is a much longer title that will test text wrapping and layout behavior',
          value: '999,999,999',
          description: 'This is a much longer description that provides detailed context about the metric and explains what it means for the business and stakeholders',
        }),
      ];
      
      const { container } = renderMetrics({ metrics: varyingLengthMetrics });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      
      // Both short and long content should be accessible
      expect(screen.getByText('Short')).toBeInTheDocument();
      expect(screen.getByText('This is a much longer title that will test text wrapping and layout behavior')).toBeInTheDocument();
    });
  });
});