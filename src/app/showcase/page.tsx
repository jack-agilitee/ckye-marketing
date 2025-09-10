'use client';

import React from 'react';
import Button from '@/components/atoms/Button/Button';
import NavTextItem from '@/components/atoms/NavTextItem/NavTextItem';
import { Metrics } from '@/components/molecules/Metrics/Metrics';
import FeatureSection from '@/components/organisms/FeatureSection/FeatureSection';
import styles from './showcase.module.scss';

// Navigation component
function ShowcaseNavigation() {
  return (
    <nav className={styles.showcaseNav}>
      <a href="#atoms" className={styles.showcaseNav__link}>Atoms</a>
      <a href="#molecules" className={styles.showcaseNav__link}>Molecules</a>
      <a href="#organisms" className={styles.showcaseNav__link}>Organisms</a>
      <a href="#templates" className={styles.showcaseNav__link}>Templates</a>
    </nav>
  );
}

// Code Example Component
interface CodeExampleProps {
  children: string;
  language?: string;
}

function CodeExample({ children, language = 'tsx' }: CodeExampleProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
  };

  return (
    <div className={styles.codeExample}>
      <div className={styles.codeExample__header}>
        <span className={styles.codeExample__language}>{language}</span>
        <button 
          onClick={handleCopy}
          className={styles.codeExample__button}
        >
          Copy
        </button>
      </div>
      <pre className={styles.codeExample__block}>
        <code className={styles.codeExample__content}>
          {children.trim()}
        </code>
      </pre>
    </div>
  );
}

// Component Showcase Item
interface ShowcaseItemProps {
  title: string;
  children: React.ReactNode;
  code: string;
}

function ShowcaseItem({ title, children, code }: ShowcaseItemProps) {
  return (
    <div className={styles.showcaseItem}>
      <h3 className={styles.showcaseItem__title}>{title}</h3>
      <div className={styles.showcaseItem__preview}>
        {children}
      </div>
      <CodeExample>{code}</CodeExample>
    </div>
  );
}

// Main Showcase Page
export default function ShowcasePage() {
  return (
    <div className={styles.showcase}>
      <header className={styles.showcase__header}>
        <h1>Component Showcase</h1>
        <p>Interactive component library organized by Atomic Design principles</p>
      </header>

      <ShowcaseNavigation />

      <main className={styles.showcase__content}>
        {/* Atoms Section */}
        <section id="atoms" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Atoms</h2>
          
          <ShowcaseItem 
            title="Button - Primary"
            code={`<Button variant="primary">Primary Button</Button>`}
          >
            <Button variant="primary">Primary Button</Button>
          </ShowcaseItem>

          <ShowcaseItem 
            title="Button - Secondary"
            code={`<Button variant="secondary">Secondary Button</Button>`}
          >
            <Button variant="secondary">Secondary Button</Button>
          </ShowcaseItem>

          <ShowcaseItem 
            title="Button - Tertiary"
            code={`<Button variant="tertiary">Tertiary Button</Button>`}
          >
            <Button variant="tertiary">Tertiary Button</Button>
          </ShowcaseItem>

          <ShowcaseItem 
            title="NavTextItem - Default"
            code={`<NavTextItem href="/about">About Us</NavTextItem>`}
          >
            <NavTextItem href="/about">About Us</NavTextItem>
          </ShowcaseItem>

          <ShowcaseItem 
            title="NavTextItem - Active"
            code={`<NavTextItem href="/services" isActive>Services</NavTextItem>`}
          >
            <NavTextItem href="/services" isActive>Services</NavTextItem>
          </ShowcaseItem>
        </section>

        {/* Molecules Section */}
        <section id="molecules" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Molecules</h2>
          
          <ShowcaseItem 
            title="Metrics - Single Variant"
            code={`<Metrics
  variant="single"
  metrics={[
    {
      title: "Total Revenue",
      value: "$2.4M",
      description: "Revenue this quarter"
    },
    {
      title: "Active Users",
      value: "12.8K",
      description: "Monthly active users"
    },
    {
      title: "Conversion Rate",
      value: "8.2%",
      description: "Lead to customer"
    }
  ]}
  gradientColor="orange"
/>`}
          >
            <div className={styles.showcaseItem__metricsWrapper}>
              <Metrics
                variant="single"
                metrics={[
                  {
                    title: "Total Revenue",
                    value: "$2.4M",
                    description: "Revenue this quarter"
                  },
                  {
                    title: "Active Users",
                    value: "12.8K",
                    description: "Monthly active users"
                  },
                  {
                    title: "Conversion Rate",
                    value: "8.2%",
                    description: "Lead to customer"
                  }
                ]}
                gradientColor="orange"
              />
            </div>
          </ShowcaseItem>

          <ShowcaseItem 
            title="Metrics - Double Variant"
            code={`<Metrics
  variant="double"
  metrics={[
    {
      title: "Revenue Growth",
      value: "$2.4M",
      secondaryValue: "+24%",
      description: "Quarter vs previous"
    },
    {
      title: "User Engagement",
      value: "12.8K",
      secondaryValue: "+15%",
      description: "Active this month"
    },
    {
      title: "Performance Score",
      value: "94.5",
      secondaryValue: "+2.1",
      description: "System performance"
    }
  ]}
  gradientColor="blue"
/>`}
          >
            <div className={styles.showcaseItem__metricsWrapper}>
              <Metrics
                variant="double"
                metrics={[
                  {
                    title: "Revenue Growth",
                    value: "$2.4M",
                    secondaryValue: "+24%",
                    description: "Quarter vs previous"
                  },
                  {
                    title: "User Engagement",
                    value: "12.8K",
                    secondaryValue: "+15%",
                    description: "Active this month"
                  },
                  {
                    title: "Performance Score",
                    value: "94.5",
                    secondaryValue: "+2.1",
                    description: "System performance"
                  }
                ]}
                gradientColor="blue"
              />
            </div>
          </ShowcaseItem>
        </section>

        {/* Organisms Section */}
        <section id="organisms" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Organisms</h2>
          
          <ShowcaseItem 
            title="FeatureSection - Image Left"
            code={`<FeatureSection
  heading="Where is the AI revolution I was promised?"
  bodyText="The reality is enterprises are only one step away from unlocking millions in ROI this budget year."
  image={{
    src: "/content/feature.png",
    alt: "AI technology illustration"
  }}
  layout="image-left"
/>`}
          >
            <div className={styles.showcaseItem__featureWrapper}>
              <FeatureSection
                heading="Where is the AI revolution I was promised?"
                bodyText="The reality is enterprises are only one step away from unlocking millions in ROI this budget year."
                image={{
                  src: "/content/feature.png",
                  alt: "AI technology illustration"
                }}
                layout="image-left"
              />
            </div>
          </ShowcaseItem>

          <ShowcaseItem 
            title="FeatureSection - Image Right"
            code={`<FeatureSection
  heading="Where is the AI revolution I was promised?"
  bodyText="The reality is enterprises are only one step away from unlocking millions in ROI this budget year."
  image={{
    src: "/content/feature.png",
    alt: "AI technology illustration"
  }}
  layout="image-right"
/>`}
          >
            <div className={styles.showcaseItem__featureWrapper}>
              <FeatureSection
                heading="Where is the AI revolution I was promised?"
                bodyText="The reality is enterprises are only one step away from unlocking millions in ROI this budget year."
                image={{
                  src: "/content/feature.png",
                  alt: "AI technology illustration"
                }}
                layout="image-right"
              />
            </div>
          </ShowcaseItem>
        </section>

        {/* Templates Section (empty for now) */}
        <section id="templates" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Templates</h2>
          <p className={styles.showcase__placeholder}>No templates available yet</p>
        </section>
      </main>
    </div>
  );
}