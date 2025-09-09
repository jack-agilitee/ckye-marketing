'use client';

import React, { useState } from 'react';
import Button from '@/components/atoms/Button/Button';
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
    const importCode = `import Button from '@/components/atoms/Button/Button';`;
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
          </div>
        </section>
      </main>
    </div>
  );
}