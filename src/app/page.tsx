import type { Metadata } from 'next';
import Hero from '@/components/organisms/Hero/Hero';
import CompatibleWith from '@/components/molecules/CompatibleWith/CompatibleWith';
import FeatureSection from '@/components/organisms/FeatureSection/FeatureSection';
import { Metrics } from '@/components/molecules/Metrics/Metrics';

export const metadata: Metadata = {
  title: 'CKYE - Governed Orchestration Layer for AI Coding Agents',
  description: 'Ckye unlocks EBITA your current stack can\'t reach, compressing timelines, cutting unit costs, and avoiding rework.',
  keywords: ['AI coding agents', 'orchestration', 'governance', 'enterprise AI', 'code quality', 'development tools'],
  openGraph: {
    title: 'CKYE - Governed Orchestration Layer for AI Coding Agents',
    description: 'Ckye unlocks EBITA your current stack can\'t reach, compressing timelines, cutting unit costs, and avoiding rework.',
    type: 'website',
    url: 'https://ckye.com',
    siteName: 'CKYE',
    images: [
      {
        url: '/content/hero--desktop.png',
        width: 1200,
        height: 630,
        alt: 'CKYE AI coding agents interface'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CKYE - Governed Orchestration Layer for AI Coding Agents',
    description: 'Ckye unlocks EBITA your current stack can\'t reach, compressing timelines, cutting unit costs, and avoiding rework.',
    images: ['/content/hero--desktop.png']
  }
};

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        tagline="/ ckye /"
        heading="Ckye is a Governed Orchestration Layer for AI Coding Agents"
        description="Ckye unlocks EBITA your current stack can't reach, compressing timelines, cutting unit costs, and avoiding rework."
        ctaText="Get Ckye"
        ctaAriaLabel="Get started with Ckye platform"
      />

      {/* Compatible With Section */}
      <CompatibleWith />

      {/* Feature Right Section */}
      <FeatureSection
        heading="Where is the AI revolution I was promised?"
        bodyText="The reality is enterprises are only one step away from unlocking millions in ROI this budget year, by leveraging the AI tools you already have in place."
        image={{
          src: "/content/feature-ai-revolution.png",
          alt: "AI revolution visualization showing current enterprise AI tools and potential"
        }}
        layout="image-right"
      />

      {/* Metrics Section */}
      <Metrics
        variant="single"
        metrics={[
          {
            title: "OpEx",
            value: "50%",
            description: "Reduction in IT Operating Expenses"
          },
          {
            title: "Time to Market",
            value: "2X",
            description: "Faster compared to out of the box AI alone"
          },
          {
            title: "Code Quality",
            value: "50%",
            description: "Increase in overall code quality vs. non Ckye users"
          }
        ]}
        gradientColor="blue"
      />

      {/* Feature Left Section */}
      <FeatureSection
        heading="Where is the AI revolution I was promised?"
        bodyText="The reality is enterprises are only one step away from unlocking millions in ROI this budget year, by leveraging the AI tools you already have in place."
        image={{
          src: "/content/feature-ai-revolution-left.png",
          alt: "Enterprise AI transformation roadmap and implementation strategy"
        }}
        layout="image-left"
      />

      {/* Feature Full Section */}
      <FeatureSection
        heading="Concise Copy goes here"
        bodyText="Ckye unlocks EBITA your current stack can't reach, compressing timelines, cutting unit costs, and avoiding rework."
        image={{
          src: "/content/feature-full-width.png",
          alt: "Comprehensive view of Ckye platform capabilities and benefits"
        }}
        layout="image-right"
      />

      {/* Metrics Double Stack Section */}
      <Metrics
        variant="double"
        metrics={[
          {
            title: "Traditional Offshore",
            value: "6 mo",
            secondaryValue: "$1MM",
            description: "7 person offshore team"
          },
          {
            title: "Out-of-the-box AI",
            value: "5 mo",
            secondaryValue: "$850K",
            description: "7 person offshore team using AI"
          },
          {
            title: "With Ckye",
            value: "6 weeks",
            secondaryValue: "$90K",
            description: "2 person onshore team using Ckye"
          }
        ]}
        gradientColor="orange"
      />
    </main>
  );
}