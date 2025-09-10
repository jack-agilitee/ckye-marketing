'use client';

import React, { useState } from 'react';
import Button from '@/components/atoms/Button/Button';
import NavTextItem from '@/components/atoms/NavTextItem/NavTextItem';
import FeatureSection from '@/components/organisms/FeatureSection/FeatureSection';
import { Metrics } from '@/components/molecules/Metrics/Metrics';
import styles from './showcase.module.scss';

// Code Example Component
interface CodeExampleProps {
  children: string;
  language?: string;
  collapsible?: boolean;
}

function CodeExample({
  children,
  language = 'tsx',
  collapsible = false
}: CodeExampleProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={styles.codeExample} data-testid="code-example">
      <div className={styles.codeExampleHeader}>
        <span className={styles.codeExampleLanguage}>{language}</span>
        <div className={styles.codeExampleActions}>
          {collapsible && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid="code-toggle"
              className={styles.codeButton}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
          <button 
            onClick={handleCopy}
            data-testid="code-copy"
            className={styles.codeButton}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <pre className={styles.codeBlock}>
          <code className={styles.codeContent}>
            {children.trim()}
          </code>
        </pre>
      )}
    </div>
  );
}

// Component Wrapper
interface ComponentWrapperProps {
  id: string;
  title: string;
  description: string;
  figmaUrl?: string;
  githubUrl?: string;
  children: React.ReactNode;
  'data-testid': string;
}

function ComponentWrapper({
  id,
  title,
  description,
  figmaUrl,
  githubUrl,
  children,
  'data-testid': testId
}: ComponentWrapperProps) {
  const copyComponentCode = async () => {
    let importCode = '';
    if (id === 'button') {
      importCode = `import Button from '@/components/atoms/Button/Button';`;
    } else if (id === 'nav-text-item') {
      importCode = `import NavTextItem from '@/components/atoms/NavTextItem/NavTextItem';`;
    } else if (id === 'feature-section') {
      importCode = `import FeatureSection from '@/components/organisms/FeatureSection/FeatureSection';`;
    } else if (id === 'metrics') {
      importCode = `import { Metrics } from '@/components/molecules/Metrics/Metrics';`;
    }
    await navigator.clipboard.writeText(importCode);
  };

  return (
    <div 
      id={id}
      className={styles.showcaseComponent}
      data-testid={testId}
    >
      <header className={styles.showcaseComponentHeader}>
        <h2>{title}</h2>
        <p>{description}</p>
        
        <div className={styles.showcaseLinks}>
          {figmaUrl && (
            <a 
              href={figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`${testId}-figma-link`}
              className={styles.showcaseLink}
            >
              View in Figma
            </a>
          )}
          {githubUrl && (
            <a 
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`${testId}-github-link`}
              className={styles.showcaseLink}
            >
              View Source
            </a>
          )}
        </div>
      </header>

      <div className={styles.showcaseComponentContent}>
        {children}
      </div>

      <footer className={styles.showcaseComponentFooter}>
        <button 
          onClick={copyComponentCode}
          data-testid={`${testId}-copy-code`}
          className={styles.showcaseButton}
        >
          Copy Import
        </button>
      </footer>
    </div>
  );
}

// Button Showcase
function ButtonShowcase() {
  return (
    <ComponentWrapper
      id="button"
      title="Button"
      description="Interactive button component with multiple variants and states"
      githubUrl="/src/components/atoms/Button/Button.tsx"
      data-testid="showcase-button"
    >
      {/* Variants Section */}
      <div className={styles.showcaseSection} data-testid="button-variants">
        <h3>Variants</h3>
        <div className={styles.showcaseExamples}>
          <div className={styles.showcaseExample} data-testid="button-primary">
            <div className={styles.showcasePreview}>
              <Button variant="primary">Primary Button</Button>
            </div>
            <CodeExample>
              {`<Button variant="primary">Primary Button</Button>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="button-secondary">
            <div className={styles.showcasePreview}>
              <Button variant="secondary">Secondary Button</Button>
            </div>
            <CodeExample>
              {`<Button variant="secondary">Secondary Button</Button>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="button-tertiary">
            <div className={styles.showcasePreview}>
              <Button variant="tertiary">Tertiary Button</Button>
            </div>
            <CodeExample>
              {`<Button variant="tertiary">Tertiary Button</Button>`}
            </CodeExample>
          </div>
        </div>
      </div>


      {/* Disabled States Section */}
      <div className={styles.showcaseSection} data-testid="button-disabled-states">
        <h3>Disabled States</h3>
        <div className={styles.showcaseExamples}>
          <div className={styles.showcaseExample} data-testid="button-primary-disabled">
            <div className={styles.showcasePreview}>
              <Button variant="primary" disabled>Disabled Primary</Button>
            </div>
            <CodeExample>
              {`<Button variant="primary" disabled>Disabled Primary</Button>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="button-secondary-disabled">
            <div className={styles.showcasePreview}>
              <Button variant="secondary" disabled>Disabled Secondary</Button>
            </div>
            <CodeExample>
              {`<Button variant="secondary" disabled>Disabled Secondary</Button>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="button-tertiary-disabled">
            <div className={styles.showcasePreview}>
              <Button variant="tertiary" disabled>Disabled Tertiary</Button>
            </div>
            <CodeExample>
              {`<Button variant="tertiary" disabled>Disabled Tertiary</Button>`}
            </CodeExample>
          </div>
        </div>
      </div>

      {/* Interactive States Section */}
      <div className={styles.showcaseSection} data-testid="button-interactive-states">
        <h3>Interactive States</h3>
        <div className={styles.showcaseExamples}>
          <div className={styles.showcaseExample} data-testid="button-with-click">
            <div className={styles.showcasePreview}>
              <Button 
                variant="primary" 
                onClick={() => alert('Button clicked!')}
              >
                Clickable Button
              </Button>
            </div>
            <CodeExample>
              {`<Button 
  variant="primary" 
  onClick={() => alert('Button clicked!')}
>
  Clickable Button
</Button>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="button-with-aria-label">
            <div className={styles.showcasePreview}>
              <Button 
                variant="secondary"
                aria-label="Save your changes"
              >
                Save
              </Button>
            </div>
            <CodeExample>
              {`<Button 
  variant="secondary"
  aria-label="Save your changes"
>
  Save
</Button>`}
            </CodeExample>
          </div>
        </div>
      </div>

      {/* Usage Examples Section */}
      <div className={styles.showcaseSection} data-testid="button-usage-examples">
        <h3>Usage Examples</h3>
        
        <CodeExample language="tsx" collapsible={true}>
          {`import Button from '@/components/atoms/Button/Button';

function MyPage() {
  const handleSubmit = async () => {
    // Perform async operation
    await submitForm();
  };

  return (
    <div>
      <Button
        variant="primary"
        onClick={handleSubmit}
        aria-label="Submit form"
      >
        Submit
      </Button>
      
      <Button
        variant="secondary"
        onClick={() => window.history.back()}
      >
        Cancel
      </Button>
      
      <Button
        variant="tertiary"
        disabled={!formIsValid}
        onClick={handleReset}
      >
        Reset Form
      </Button>
    </div>
  );
}`}
        </CodeExample>
      </div>
    </ComponentWrapper>
  );
}

// NavTextItem Showcase
function NavTextItemShowcase() {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <ComponentWrapper
      id="nav-text-item"
      title="NavTextItem"
      description="Navigation text item component with hover states and active indicators"
      githubUrl="/src/components/atoms/NavTextItem/NavTextItem.tsx"
      data-testid="showcase-nav-text-item"
    >
      {/* Basic Variants Section */}
      <div className={styles.showcaseSection} data-testid="nav-text-item-variants">
        <h3>States</h3>
        <div className={styles.showcaseExamples}>
          <div className={styles.showcaseExample} data-testid="nav-text-item-default">
            <div className={styles.showcasePreview}>
              <NavTextItem href="/about" data-testid="nav-item-default">
                About Us
              </NavTextItem>
            </div>
            <CodeExample>
              {`<NavTextItem href="/about">About Us</NavTextItem>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="nav-text-item-active">
            <div className={styles.showcasePreview}>
              <NavTextItem href="/services" isActive data-testid="nav-item-active">
                Services
              </NavTextItem>
            </div>
            <CodeExample>
              {`<NavTextItem href="/services" isActive>Services</NavTextItem>`}
            </CodeExample>
          </div>
        </div>
      </div>

      {/* Different Content Examples Section */}
      <div className={styles.showcaseSection} data-testid="nav-text-item-content">
        <h3>Different Text Content</h3>
        <div className={styles.showcaseExamples}>
          <div className={styles.showcaseExample} data-testid="nav-text-item-short">
            <div className={styles.showcasePreview}>
              <NavTextItem href="/home" data-testid="nav-item-short">
                Home
              </NavTextItem>
            </div>
            <CodeExample>
              {`<NavTextItem href="/home">Home</NavTextItem>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="nav-text-item-medium">
            <div className={styles.showcasePreview}>
              <NavTextItem href="/portfolio" data-testid="nav-item-medium">
                Our Portfolio
              </NavTextItem>
            </div>
            <CodeExample>
              {`<NavTextItem href="/portfolio">Our Portfolio</NavTextItem>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="nav-text-item-long">
            <div className={styles.showcasePreview}>
              <NavTextItem href="/contact" data-testid="nav-item-long">
                Contact Information
              </NavTextItem>
            </div>
            <CodeExample>
              {`<NavTextItem href="/contact">Contact Information</NavTextItem>`}
            </CodeExample>
          </div>
        </div>
      </div>

      {/* Interactive Navigation Demo Section */}
      <div className={styles.showcaseSection} data-testid="nav-text-item-interactive">
        <h3>Interactive Navigation Demo</h3>
        <div className={styles.showcaseExamples}>
          <div className={styles.showcaseExample} data-testid="nav-text-item-navigation-demo">
            <div className={styles.showcasePreview}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['home', 'about', 'services', 'portfolio', 'contact'].map((item) => (
                  <NavTextItem
                    key={item}
                    href={`/${item}`}
                    isActive={activeItem === item}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveItem(item);
                    }}
                    data-testid={`nav-item-demo-${item}`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </NavTextItem>
                ))}
              </div>
            </div>
            <CodeExample>
              {`const [activeItem, setActiveItem] = useState('home');

{['home', 'about', 'services', 'portfolio', 'contact'].map((item) => (
  <NavTextItem
    key={item}
    href={\`/\${item}\`}
    isActive={activeItem === item}
    onClick={(e) => {
      e.preventDefault();
      setActiveItem(item);
    }}
  >
    {item.charAt(0).toUpperCase() + item.slice(1)}
  </NavTextItem>
))}`}
            </CodeExample>
          </div>
        </div>
      </div>

      {/* Accessibility Examples Section */}
      <div className={styles.showcaseSection} data-testid="nav-text-item-accessibility">
        <h3>Accessibility Features</h3>
        <div className={styles.showcaseExamples}>
          <div className={styles.showcaseExample} data-testid="nav-text-item-aria-label">
            <div className={styles.showcasePreview}>
              <NavTextItem 
                href="/dashboard" 
                aria-label="Navigate to user dashboard"
                data-testid="nav-item-aria-label"
              >
                Dashboard
              </NavTextItem>
            </div>
            <CodeExample>
              {`<NavTextItem 
  href="/dashboard" 
  aria-label="Navigate to user dashboard"
>
  Dashboard
</NavTextItem>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="nav-text-item-custom-click">
            <div className={styles.showcasePreview}>
              <NavTextItem 
                href="/custom"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Custom navigation logic triggered');
                }}
                data-testid="nav-item-custom-click"
              >
                Custom Handler
              </NavTextItem>
            </div>
            <CodeExample>
              {`<NavTextItem 
  href="/custom"
  onClick={(e) => {
    e.preventDefault();
    // Custom navigation logic
    handleCustomNavigation();
  }}
>
  Custom Handler
</NavTextItem>`}
            </CodeExample>
          </div>
        </div>
      </div>

      {/* Usage Examples Section */}
      <div className={styles.showcaseSection} data-testid="nav-text-item-usage-examples">
        <h3>Usage Examples</h3>
        
        <CodeExample language="tsx" collapsible={true}>
          {`import NavTextItem from '@/components/atoms/NavTextItem/NavTextItem';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function Navigation() {
  const router = useRouter();
  const [activeRoute, setActiveRoute] = useState('/home');

  const navItems = [
    { href: '/home', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/contact', label: 'Contact' }
  ];

  const handleNavigation = (href: string) => {
    setActiveRoute(href);
    router.push(href);
  };

  return (
    <nav>
      {navItems.map((item) => (
        <NavTextItem
          key={item.href}
          href={item.href}
          isActive={activeRoute === item.href}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation(item.href);
          }}
          aria-label={\`Navigate to \${item.label} page\`}
          data-testid={\`nav-item-\${item.label.toLowerCase().replace(/\\s+/g, '-')}\`}
        >
          {item.label}
        </NavTextItem>
      ))}
    </nav>
  );
}`}
        </CodeExample>
      </div>
    </ComponentWrapper>
  );
}

// FeatureSection Showcase
function FeatureSectionShowcase() {
  const sampleContent = {
    heading: "Where is the AI revolution I was promised?",
    bodyText: "The reality is enterprises are only one step away from unlocking millions in ROI this budget year, by leveraging the AI tools you already have in place.",
    image: {
      src: "/content/feature.png",
      alt: "AI technology illustration showing modern business transformation"
    }
  };

  return (
    <ComponentWrapper
      id="feature-section"
      title="FeatureSection"
      description="Feature section organism with image and text content in two layout variants"
      githubUrl="/src/components/organisms/FeatureSection/FeatureSection.tsx"
      data-testid="showcase-feature-section"
    >
      {/* Layout Variants Section */}
      <div className={styles.showcaseSection} data-testid="feature-section-variants">
        <h3>Layout Variants</h3>
        <div className={styles.showcaseExamples}>
          <div className={styles.showcaseExample} data-testid="feature-section-image-left">
            <div className={styles.showcasePreview} style={{ overflow: 'visible' }}>
              <FeatureSection
                heading={sampleContent.heading}
                bodyText={sampleContent.bodyText}
                image={sampleContent.image}
                layout="image-left"
              />
            </div>
            <CodeExample>
              {`<FeatureSection
  heading="Where is the AI revolution I was promised?"
  bodyText="The reality is enterprises are only one step away from unlocking millions in ROI this budget year, by leveraging the AI tools you already have in place."
  image={{
    src: "/content/feature.png",
    alt: "AI technology illustration showing modern business transformation"
  }}
  layout="image-left"
/>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="feature-section-image-right">
            <div className={styles.showcasePreview} style={{ overflow: 'visible' }}>
              <FeatureSection
                heading={sampleContent.heading}
                bodyText={sampleContent.bodyText}
                image={sampleContent.image}
                layout="image-right"
              />
            </div>
            <CodeExample>
              {`<FeatureSection
  heading="Where is the AI revolution I was promised?"
  bodyText="The reality is enterprises are only one step away from unlocking millions in ROI this budget year, by leveraging the AI tools you already have in place."
  image={{
    src: "/content/feature.png",
    alt: "AI technology illustration showing modern business transformation"
  }}
  layout="image-right"
/>`}
            </CodeExample>
          </div>
        </div>
      </div>
    </ComponentWrapper>
  );
}

// Metrics Showcase
function MetricsShowcase() {
  const singleMetricsData = [
    {
      title: "Total Revenue",
      value: "$2.4M",
      description: "Revenue generated this quarter"
    },
    {
      title: "Active Users",
      value: "12.8K",
      description: "Monthly active users"
    },
    {
      title: "Conversion Rate",
      value: "8.2%",
      description: "Lead to customer conversion"
    }
  ];

  const doubleMetricsData = [
    {
      title: "Revenue Growth",
      value: "$2.4M",
      secondaryValue: "+24%",
      description: "Current quarter vs previous"
    },
    {
      title: "User Engagement",
      value: "12.8K",
      secondaryValue: "+15%",
      description: "Active users this month"
    },
    {
      title: "Performance Score",
      value: "94.5",
      secondaryValue: "+2.1",
      description: "Overall system performance"
    }
  ];

  return (
    <ComponentWrapper
      id="metrics"
      title="Metrics"
      description="Metrics display component with single and double value variants, supporting custom gradient colors"
      githubUrl="/src/components/molecules/Metrics/Metrics.tsx"
      data-testid="showcase-metrics"
    >
      {/* Variant Types Section */}
      <div className={styles.showcaseSection} data-testid="metrics-variants">
        <h3>Variant Types</h3>
        <div className={styles.showcaseExamples}>
          <div className={styles.showcaseExample} data-testid="metrics-single">
            <div className={styles.showcasePreview} style={{ overflow: 'visible' }}>
              <Metrics
                variant="single"
                metrics={singleMetricsData}
                gradientColor="orange"
              />
            </div>
            <CodeExample>
              {`<Metrics
  variant="single"
  metrics={[
    {
      title: "Total Revenue",
      value: "$2.4M",
      description: "Revenue generated this quarter"
    },
    {
      title: "Active Users",
      value: "12.8K",
      description: "Monthly active users"
    },
    {
      title: "Conversion Rate",
      value: "8.2%",
      description: "Lead to customer conversion"
    }
  ]}
  gradientColor="orange"
/>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="metrics-double">
            <div className={styles.showcasePreview} style={{ overflow: 'visible' }}>
              <Metrics
                variant="double"
                metrics={doubleMetricsData}
                gradientColor="blue"
              />
            </div>
            <CodeExample>
              {`<Metrics
  variant="double"
  metrics={[
    {
      title: "Revenue Growth",
      value: "$2.4M",
      secondaryValue: "+24%",
      description: "Current quarter vs previous"
    },
    {
      title: "User Engagement",
      value: "12.8K",
      secondaryValue: "+15%",
      description: "Active users this month"
    },
    {
      title: "Performance Score",
      value: "94.5",
      secondaryValue: "+2.1",
      description: "Overall system performance"
    }
  ]}
  gradientColor="blue"
/>`}
            </CodeExample>
          </div>
        </div>
      </div>

      {/* Gradient Color Options Section */}
      <div className={styles.showcaseSection} data-testid="metrics-gradient-colors">
        <h3>Gradient Color Options</h3>
        <div className={styles.showcaseExamples}>
          <div className={styles.showcaseExample} data-testid="metrics-gradient-orange">
            <div className={styles.showcasePreview} style={{ overflow: 'visible' }}>
              <Metrics
                variant="single"
                metrics={[
                  {
                    title: "Sales Target",
                    value: "85%",
                    description: "Monthly goal achievement"
                  }
                ]}
                gradientColor="orange"
              />
            </div>
            <CodeExample>
              {`<Metrics
  variant="single"
  metrics={[{
    title: "Sales Target",
    value: "85%",
    description: "Monthly goal achievement"
  }]}
  gradientColor="orange"
/>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="metrics-gradient-blue">
            <div className={styles.showcasePreview} style={{ overflow: 'visible' }}>
              <Metrics
                variant="single"
                metrics={[
                  {
                    title: "Customer Satisfaction",
                    value: "4.8",
                    description: "Average rating this month"
                  }
                ]}
                gradientColor="blue"
              />
            </div>
            <CodeExample>
              {`<Metrics
  variant="single"
  metrics={[{
    title: "Customer Satisfaction",
    value: "4.8",
    description: "Average rating this month"
  }]}
  gradientColor="blue"
/>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="metrics-gradient-custom">
            <div className={styles.showcasePreview} style={{ overflow: 'visible' }}>
              <Metrics
                variant="single"
                metrics={[
                  {
                    title: "System Uptime",
                    value: "99.9%",
                    description: "Availability this quarter"
                  }
                ]}
                gradientColor="#22c55e"
              />
            </div>
            <CodeExample>
              {`<Metrics
  variant="single"
  metrics={[{
    title: "System Uptime",
    value: "99.9%",
    description: "Availability this quarter"
  }]}
  gradientColor="#22c55e"
/>`}
            </CodeExample>
          </div>
        </div>
      </div>

      {/* Double Values with Different Colors Section */}
      <div className={styles.showcaseSection} data-testid="metrics-double-colors">
        <h3>Double Values with Different Colors</h3>
        <div className={styles.showcaseExamples}>
          <div className={styles.showcaseExample} data-testid="metrics-double-orange">
            <div className={styles.showcasePreview} style={{ overflow: 'visible' }}>
              <Metrics
                variant="double"
                metrics={[
                  {
                    title: "Marketing ROI",
                    value: "$156K",
                    secondaryValue: "+32%",
                    description: "Return on marketing investment"
                  }
                ]}
                gradientColor="orange"
              />
            </div>
            <CodeExample>
              {`<Metrics
  variant="double"
  metrics={[{
    title: "Marketing ROI",
    value: "$156K",
    secondaryValue: "+32%",
    description: "Return on marketing investment"
  }]}
  gradientColor="orange"
/>`}
            </CodeExample>
          </div>

          <div className={styles.showcaseExample} data-testid="metrics-double-custom">
            <div className={styles.showcasePreview} style={{ overflow: 'visible' }}>
              <Metrics
                variant="double"
                metrics={[
                  {
                    title: "Team Productivity",
                    value: "127%",
                    secondaryValue: "+8%",
                    description: "Productivity index vs baseline"
                  }
                ]}
                gradientColor="#8b5cf6"
              />
            </div>
            <CodeExample>
              {`<Metrics
  variant="double"
  metrics={[{
    title: "Team Productivity",
    value: "127%",
    secondaryValue: "+8%",
    description: "Productivity index vs baseline"
  }]}
  gradientColor="#8b5cf6"
/>`}
            </CodeExample>
          </div>
        </div>
      </div>

      {/* Usage Examples Section */}
      <div className={styles.showcaseSection} data-testid="metrics-usage-examples">
        <h3>Usage Examples</h3>
        
        <CodeExample language="tsx" collapsible={true}>
          {`import { Metrics, MetricData } from '@/components/molecules/Metrics/Metrics';

function DashboardPage() {
  const businessMetrics: MetricData[] = [
    {
      title: "Monthly Revenue",
      value: "$245K",
      secondaryValue: "+18%",
      description: "Revenue growth vs last month"
    },
    {
      title: "New Customers",
      value: "1,247",
      secondaryValue: "+24%",
      description: "Customer acquisition this month"
    },
    {
      title: "Churn Rate",
      value: "2.1%",
      secondaryValue: "-0.3%",
      description: "Customer retention improvement"
    }
  ];

  const performanceMetrics: MetricData[] = [
    {
      title: "Page Load Time",
      value: "1.2s",
      description: "Average page load speed"
    },
    {
      title: "API Response",
      value: "245ms",
      description: "Average API response time"
    },
    {
      title: "Error Rate",
      value: "0.02%",
      description: "System error percentage"
    }
  ];

  return (
    <div>
      <section>
        <h2>Business Metrics</h2>
        <Metrics
          variant="double"
          metrics={businessMetrics}
          gradientColor="blue"
        />
      </section>
      
      <section>
        <h2>Performance Metrics</h2>
        <Metrics
          variant="single"
          metrics={performanceMetrics}
          gradientColor="#22c55e"
        />
      </section>
    </div>
  );
}`}
        </CodeExample>
      </div>
    </ComponentWrapper>
  );
}

// Main Showcase Page
export default function ShowcasePage() {
  return (
    <div className={styles.showcase} data-testid="showcase-root">
      <header className={styles.showcaseHeader} data-testid="showcase-header">
        <h1>Component Showcase</h1>
        <p>Interactive component library organized by Atomic Design principles</p>
      </header>

      <main className={styles.showcaseContent} data-testid="showcase-content">
        <section id="atoms" data-testid="showcase-atoms">
          <h2>Atoms</h2>
          <div className={styles.showcaseGrid}>
            <ButtonShowcase />
            <NavTextItemShowcase />
          </div>
        </section>

        <section id="molecules" data-testid="showcase-molecules">
          <h2>Molecules</h2>
          <div className={styles.showcaseGrid}>
            <MetricsShowcase />
          </div>
        </section>
        
        <section id="organisms" data-testid="showcase-organisms">
          <h2>Organisms</h2>
          <div className={styles.showcaseGrid}>
            <FeatureSectionShowcase />
          </div>
        </section>
      </main>
    </div>
  );
}