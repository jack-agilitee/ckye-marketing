import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Metrics, MetricsProps, MetricData } from './Metrics';

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

describe('Metrics Component', () => {
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

  // Default props
  const defaultProps: MetricsProps = {
    metrics: [buildMetricData()],
  };

  const renderMetrics = (props: Partial<MetricsProps> = {}) => {
    return render(<Metrics {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering Tests
  describe('Rendering', () => {
    it('should render without crashing', () => {
      renderMetrics();
      expect(screen.getByLabelText('Metrics dashboard')).toBeInTheDocument();
    });

    it('should render as a section element with proper semantic structure', () => {
      renderMetrics();
      const section = screen.getByLabelText('Metrics dashboard');
      expect(section.tagName.toLowerCase()).toBe('section');
    });

    it('should render metrics container and row', () => {
      const { container } = renderMetrics();
      expect(container.querySelector('.metrics__container')).toBeInTheDocument();
      expect(container.querySelector('.metrics__row')).toBeInTheDocument();
    });

    it('should render single metric correctly', () => {
      const metric = buildMetricData({
        title: 'Revenue',
        value: '$1M',
        description: 'Total revenue',
      });
      
      renderMetrics({ metrics: [metric] });
      
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Revenue');
      expect(screen.getByText('$1M')).toBeInTheDocument();
      expect(screen.getByText('Total revenue')).toBeInTheDocument();
    });

    it('should render multiple metrics correctly', () => {
      const metrics = [
        buildMetricData({ title: 'Users', value: '10K', description: 'Active users' }),
        buildMetricData({ title: 'Revenue', value: '$1M', description: 'Total revenue' }),
        buildMetricData({ title: 'Growth', value: '25%', description: 'Year over year' }),
      ];
      
      renderMetrics({ metrics });
      
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('10K')).toBeInTheDocument();
      expect(screen.getByText('Active users')).toBeInTheDocument();
      
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('$1M')).toBeInTheDocument();
      expect(screen.getByText('Total revenue')).toBeInTheDocument();
      
      expect(screen.getByText('Growth')).toBeInTheDocument();
      expect(screen.getByText('25%')).toBeInTheDocument();
      expect(screen.getByText('Year over year')).toBeInTheDocument();
    });

    it('should handle empty metrics array gracefully', () => {
      renderMetrics({ metrics: [] });
      expect(screen.getByLabelText('Metrics dashboard')).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  // Props and Default Values Tests
  describe('Props and Default Values', () => {
    it('should use default variant (single)', () => {
      const { container } = renderMetrics();
      expect(container.querySelector('.metrics--single')).toBeInTheDocument();
    });

    it('should use default gradientColor (orange)', () => {
      const { container } = renderMetrics();
      expect(container.querySelector('.gradient--orange')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = renderMetrics({ className: 'custom-metrics' });
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-metrics');
    });

    it('should handle empty className', () => {
      const { container } = renderMetrics({ className: '' });
      const section = container.querySelector('section');
      expect(section).toHaveClass('metrics');
    });

    it('should handle undefined className', () => {
      const { container } = renderMetrics({ className: undefined });
      const section = container.querySelector('section');
      expect(section).toHaveClass('metrics');
    });
  });

  // Variant Tests
  describe('Variant Behavior', () => {
    describe('Single Variant', () => {
      it('should apply single variant class', () => {
        const { container } = renderMetrics({ variant: 'single' });
        expect(container.querySelector('.metrics--single')).toBeInTheDocument();
      });

      it('should not display secondary values in single variant', () => {
        const metric = buildMetricDataWithSecondary();
        renderMetrics({ variant: 'single', metrics: [metric] });
        
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.queryByText('50')).not.toBeInTheDocument();
      });

      it('should ignore secondaryValue when variant is single', () => {
        const metric = buildMetricDataWithSecondary({
          title: 'Sales',
          value: 'Primary Value',
          secondaryValue: 'Secondary Value',
        });
        
        renderMetrics({ variant: 'single', metrics: [metric] });
        
        expect(screen.getByText('Primary Value')).toBeInTheDocument();
        expect(screen.queryByText('Secondary Value')).not.toBeInTheDocument();
      });
    });

    describe('Double Variant', () => {
      it('should apply double variant class', () => {
        const { container } = renderMetrics({ variant: 'double' });
        expect(container.querySelector('.metrics--double')).toBeInTheDocument();
      });

      it('should display both primary and secondary values when present', () => {
        const metric = buildMetricDataWithSecondary({
          value: 'Primary Value',
          secondaryValue: 'Secondary Value',
        });
        
        renderMetrics({ variant: 'double', metrics: [metric] });
        
        expect(screen.getByText('Primary Value')).toBeInTheDocument();
        expect(screen.getByText('Secondary Value')).toBeInTheDocument();
      });

      it('should only display primary value when secondaryValue is not provided', () => {
        const metric = buildMetricData({ value: 'Only Primary' });
        renderMetrics({ variant: 'double', metrics: [metric] });
        
        expect(screen.getByText('Only Primary')).toBeInTheDocument();
        expect(screen.queryByText('secondary')).not.toBeInTheDocument();
      });

      it('should apply secondary value CSS class correctly', () => {
        const { container } = renderMetrics({
          variant: 'double',
          metrics: [buildMetricDataWithSecondary()],
        });
        
        expect(container.querySelector('.metrics__value--secondary')).toBeInTheDocument();
      });

      it('should handle missing secondaryValue gracefully', () => {
        const metric = buildMetricData({
          title: 'Test',
          value: 'Primary',
          secondaryValue: undefined,
        });
        
        renderMetrics({ variant: 'double', metrics: [metric] });
        
        expect(screen.getByText('Primary')).toBeInTheDocument();
        expect(screen.queryByText('undefined')).not.toBeInTheDocument();
      });

      it('should handle empty string secondaryValue', () => {
        const metric = buildMetricData({
          title: 'Test',
          value: 'Primary',
          secondaryValue: '',
        });
        
        renderMetrics({ variant: 'double', metrics: [metric] });
        
        expect(screen.getByText('Primary')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('')).not.toBeInTheDocument();
      });
    });
  });

  // Gradient Color Tests
  describe('Gradient Colors', () => {
    describe('Predefined Gradient Colors', () => {
      it('should apply blue gradient class', () => {
        const { container } = renderMetrics({ gradientColor: 'blue' });
        expect(container.querySelector('.gradient--blue')).toBeInTheDocument();
      });

      it('should apply orange gradient class', () => {
        const { container } = renderMetrics({ gradientColor: 'orange' });
        expect(container.querySelector('.gradient--orange')).toBeInTheDocument();
      });

      it('should apply gradient color to all metric values', () => {
        const metrics = [
          buildMetricData({ value: 'Value 1' }),
          buildMetricData({ value: 'Value 2' }),
        ];
        
        const { container } = renderMetrics({ 
          gradientColor: 'blue', 
          metrics 
        });
        
        const values = container.querySelectorAll('.metrics__value');
        values.forEach(value => {
          expect(value).toHaveClass('gradient--blue');
        });
      });

      it('should apply gradient color to secondary values in double variant', () => {
        const { container } = renderMetrics({
          variant: 'double',
          gradientColor: 'blue',
          metrics: [buildMetricDataWithSecondary()],
        });
        
        const secondaryValue = container.querySelector('.metrics__value--secondary');
        expect(secondaryValue).toHaveClass('gradient--blue');
      });
    });

    describe('Custom Gradient Colors', () => {
      it('should apply custom gradient style for non-predefined colors', () => {
        const { container } = renderMetrics({ gradientColor: '#FF5733' });
        const value = container.querySelector('.metrics__value');
        
        expect(value).toHaveStyle({
          '--gradient-custom': 'linear-gradient(180deg, #FFF 0%, #FF5733 100%)'
        });
      });

      it('should not apply predefined gradient classes for custom colors', () => {
        const { container } = renderMetrics({ gradientColor: '#FF5733' });
        
        expect(container.querySelector('.gradient--blue')).not.toBeInTheDocument();
        expect(container.querySelector('.gradient--orange')).not.toBeInTheDocument();
      });

      it('should apply custom gradient to secondary values', () => {
        const { container } = renderMetrics({
          variant: 'double',
          gradientColor: '#FF5733',
          metrics: [buildMetricDataWithSecondary()],
        });
        
        const secondaryValue = container.querySelector('.metrics__value--secondary');
        expect(secondaryValue).toHaveStyle({
          '--gradient-custom': 'linear-gradient(180deg, #FFF 0%, #FF5733 100%)'
        });
      });

      it('should handle custom colors with different formats', () => {
        const testCases = [
          'rgb(255, 87, 51)',
          'hsl(12, 100%, 60%)',
          'red',
          '#FF5733',
        ];
        
        testCases.forEach(color => {
          const { container } = renderMetrics({ gradientColor: color });
          const value = container.querySelector('.metrics__value');
          
          expect(value).toHaveStyle({
            '--gradient-custom': `linear-gradient(180deg, #FFF 0%, ${color} 100%)`
          });
        });
      });
    });

    describe('Gradient Edge Cases', () => {
      it('should handle empty string gradientColor', () => {
        const { container } = renderMetrics({ gradientColor: '' });
        const value = container.querySelector('.metrics__value');
        
        expect(value).toHaveStyle({
          '--gradient-custom': 'linear-gradient(180deg, #FFF 0%,  100%)'
        });
      });

      it('should differentiate between blue/orange strings and custom colors', () => {
        // Test that exact string matching works
        const { container: blueContainer } = renderMetrics({ gradientColor: 'blue' });
        expect(blueContainer.querySelector('.gradient--blue')).toBeInTheDocument();
        
        const { container: customContainer } = renderMetrics({ gradientColor: 'blueish' });
        const value = customContainer.querySelector('.metrics__value');
        expect(value).toHaveStyle({
          '--gradient-custom': 'linear-gradient(180deg, #FFF 0%, blueish 100%)'
        });
      });
    });
  });

  // Semantic Structure Tests
  describe('Semantic Structure', () => {
    it('should use proper heading hierarchy', () => {
      const metric = buildMetricData({ title: 'Test Title' });
      renderMetrics({ metrics: [metric] });
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Test Title');
      expect(heading.tagName.toLowerCase()).toBe('h3');
    });

    it('should structure values in proper containers', () => {
      const { container } = renderMetrics({
        variant: 'double',
        metrics: [buildMetricDataWithSecondary()],
      });
      
      const valuesContainer = container.querySelector('.metrics__values');
      expect(valuesContainer).toBeInTheDocument();
      
      const primaryValue = container.querySelector('.metrics__value:not(.metrics__value--secondary)');
      const secondaryValue = container.querySelector('.metrics__value--secondary');
      
      expect(valuesContainer).toContainElement(primaryValue);
      expect(valuesContainer).toContainElement(secondaryValue);
    });

    it('should use paragraph elements for values and descriptions', () => {
      renderMetrics();
      
      const value = screen.getByText('100');
      const description = screen.getByText('Test description');
      
      expect(value.tagName.toLowerCase()).toBe('p');
      expect(description.tagName.toLowerCase()).toBe('p');
    });
  });

  // CSS Classes and Structure Tests
  describe('CSS Classes and Structure', () => {
    it('should apply all required CSS classes', () => {
      const { container } = renderMetrics({
        variant: 'double',
        className: 'custom-class',
      });
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('metrics');
      expect(section).toHaveClass('metrics--double');
      expect(section).toHaveClass('custom-class');
    });

    it('should maintain proper DOM structure', () => {
      const { container } = renderMetrics();
      
      const section = container.querySelector('section');
      const metricsContainer = section?.querySelector('.metrics__container');
      const row = metricsContainer?.querySelector('.metrics__row');
      const item = row?.querySelector('.metrics__item');
      
      expect(section).toBeInTheDocument();
      expect(metricsContainer).toBeInTheDocument();
      expect(row).toBeInTheDocument();
      expect(item).toBeInTheDocument();
    });

    it('should create proper item structure for each metric', () => {
      const metrics = [
        buildMetricData({ title: 'Metric 1' }),
        buildMetricData({ title: 'Metric 2' }),
      ];
      
      const { container } = renderMetrics({ metrics });
      const items = container.querySelectorAll('.metrics__item');
      
      expect(items).toHaveLength(2);
      
      items.forEach(item => {
        expect(item.querySelector('.metrics__title')).toBeInTheDocument();
        expect(item.querySelector('.metrics__values')).toBeInTheDocument();
        expect(item.querySelector('.metrics__value')).toBeInTheDocument();
        expect(item.querySelector('.metrics__description')).toBeInTheDocument();
      });
    });
  });

  // Data Handling Tests
  describe('Data Handling', () => {
    it('should handle special characters in metric data', () => {
      const metric = buildMetricData({
        title: 'Revenue & Profit',
        value: '$1,000,000+',
        description: 'Q1 2024 (est.)',
      });
      
      renderMetrics({ metrics: [metric] });
      
      expect(screen.getByText('Revenue & Profit')).toBeInTheDocument();
      expect(screen.getByText('$1,000,000+')).toBeInTheDocument();
      expect(screen.getByText('Q1 2024 (est.)')).toBeInTheDocument();
    });

    it('should handle very long metric values', () => {
      const metric = buildMetricData({
        title: 'Long Title',
        value: 'This is a very long metric value that might wrap',
        description: 'This is a very long description that explains the metric in great detail',
      });
      
      renderMetrics({ metrics: [metric] });
      
      expect(screen.getByText('This is a very long metric value that might wrap')).toBeInTheDocument();
      expect(screen.getByText('This is a very long description that explains the metric in great detail')).toBeInTheDocument();
    });

    it('should handle numeric values correctly', () => {
      const metric = buildMetricData({
        title: 'Count',
        value: '0',
        description: 'Zero value',
      });
      
      renderMetrics({ metrics: [metric] });
      
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Zero value')).toBeInTheDocument();
    });

    it('should handle empty string values gracefully', () => {
      const metric: MetricData = {
        title: 'Empty Values Test',
        value: '',
        description: '',
      };
      
      renderMetrics({ metrics: [metric] });
      
      // Should still render structure even with empty strings
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByLabelText('Metrics dashboard')).toBeInTheDocument();
    });
  });

  // Integration Tests
  describe('Integration Scenarios', () => {
    it('should render complex multi-metric layout correctly', () => {
      const metrics = [
        buildMetricData({
          title: 'Active Users',
          value: '1.2M',
          description: 'Monthly active users',
        }),
        buildMetricDataWithSecondary({
          title: 'Revenue',
          value: '$2.5M',
          secondaryValue: '$1.8M',
          description: 'Current vs Previous Quarter',
        }),
        buildMetricData({
          title: 'Growth Rate',
          value: '25%',
          description: 'Year over year growth',
        }),
      ];
      
      renderMetrics({
        variant: 'double',
        gradientColor: 'blue',
        className: 'dashboard-metrics',
        metrics,
      });
      
      // Check all metrics are rendered
      expect(screen.getByText('Active Users')).toBeInTheDocument();
      expect(screen.getByText('1.2M')).toBeInTheDocument();
      expect(screen.getByText('Monthly active users')).toBeInTheDocument();
      
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('$2.5M')).toBeInTheDocument();
      expect(screen.getByText('$1.8M')).toBeInTheDocument(); // Secondary value
      expect(screen.getByText('Current vs Previous Quarter')).toBeInTheDocument();
      
      expect(screen.getByText('Growth Rate')).toBeInTheDocument();
      expect(screen.getByText('25%')).toBeInTheDocument();
      expect(screen.getByText('Year over year growth')).toBeInTheDocument();
      
      // Check styling is applied
      const section = screen.getByLabelText('Metrics dashboard');
      expect(section).toHaveClass('metrics--double');
      expect(section).toHaveClass('dashboard-metrics');
      
      // Check gradient classes are applied to values
      const { container } = renderMetrics({ variant: 'double', gradientColor: 'blue', metrics });
      expect(container.querySelector('.gradient--blue')).toBeInTheDocument();
    });

    it('should handle mixed secondary value availability in double variant', () => {
      const metrics = [
        buildMetricDataWithSecondary({
          title: 'With Secondary',
          value: 'Primary',
          secondaryValue: 'Secondary',
        }),
        buildMetricData({
          title: 'Without Secondary',
          value: 'Only Primary',
        }),
      ];
      
      renderMetrics({ variant: 'double', metrics });
      
      expect(screen.getByText('Primary')).toBeInTheDocument();
      expect(screen.getByText('Secondary')).toBeInTheDocument();
      expect(screen.getByText('Only Primary')).toBeInTheDocument();
      
      // Check that secondary value CSS class is only applied where appropriate
      const { container } = renderMetrics({ variant: 'double', metrics });
      const secondaryValues = container.querySelectorAll('.metrics__value--secondary');
      expect(secondaryValues).toHaveLength(1);
    });
  });

  // Edge Cases and Error Handling
  describe('Edge Cases', () => {
    it('should handle metrics array with mixed data types', () => {
      const metrics = [
        buildMetricData({ title: 'String', value: 'Text Value' }),
        buildMetricData({ title: 'Number', value: '123' }),
        buildMetricData({ title: 'Percentage', value: '45%' }),
      ];
      
      renderMetrics({ metrics });
      
      expect(screen.getByText('Text Value')).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument();
      expect(screen.getByText('45%')).toBeInTheDocument();
    });

    it('should maintain component stability with prop changes', () => {
      const initialMetrics = [buildMetricData({ title: 'Initial' })];
      const { rerender } = renderMetrics({ metrics: initialMetrics });
      
      expect(screen.getByText('Initial')).toBeInTheDocument();
      
      const updatedMetrics = [buildMetricData({ title: 'Updated' })];
      rerender(<Metrics metrics={updatedMetrics} variant="double" gradientColor="blue" />);
      
      expect(screen.queryByText('Initial')).not.toBeInTheDocument();
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });

    it('should handle rapid re-renders without issues', () => {
      const { rerender } = renderMetrics();
      
      // Simulate rapid property changes
      for (let i = 0; i < 5; i++) {
        rerender(
          <Metrics
            metrics={[buildMetricData({ title: `Test ${i}` })]}
            variant={i % 2 === 0 ? 'single' : 'double'}
            gradientColor={i % 2 === 0 ? 'blue' : 'orange'}
          />
        );
        expect(screen.getByText(`Test ${i}`)).toBeInTheDocument();
      }
    });
  });

  // Performance Tests
  describe('Performance', () => {
    it('should handle large numbers of metrics efficiently', () => {
      const metrics = Array.from({ length: 10 }, (_, i) => 
        buildMetricData({
          title: `Metric ${i}`,
          value: `${i * 100}`,
          description: `Description for metric ${i}`,
        })
      );
      
      const startTime = performance.now();
      renderMetrics({ metrics });
      const endTime = performance.now();
      
      // Should render quickly (under 100ms for 10 metrics)
      expect(endTime - startTime).toBeLessThan(100);
      
      // All metrics should be present
      metrics.forEach((metric, i) => {
        expect(screen.getByText(`Metric ${i}`)).toBeInTheDocument();
        expect(screen.getByText(`${i * 100}`)).toBeInTheDocument();
      });
    });
  });
});