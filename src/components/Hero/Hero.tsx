import Image from 'next/image';
import Button from '../atoms/Button/Button';
import styles from './Hero.module.scss';

// TypeScript interfaces
interface HeroImageSet {
  /** Desktop image source */
  desktop: string;
  /** Tablet image source */
  tablet: string;
  /** Mobile image source */
  mobile: string;
  /** Alt text for images */
  alt: string;
}

interface HeroProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Tagline text */
  tagline?: string;
  /** Main heading text */
  heading?: string;
  /** Description text */
  description?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA button aria-label */
  ctaAriaLabel?: string;
  /** CTA button click handler */
  onCtaClick?: () => void;
  /** Images for different breakpoints */
  images?: HeroImageSet;
}

const Hero: React.FC<HeroProps> = ({ 
  className,
  tagline = '/ sky /',
  heading = 'Ckye is a Governed Orchestration Layer for AI Coding Agents',
  description = "Ckye unlocks EBITA your current stack can't reach, compressing timelines, cutting unit costs, and avoiding rework.",
  ctaText = 'Get Ckye',
  ctaAriaLabel = 'Get started with Ckye',
  onCtaClick,
  images = {
    desktop: '/content/hero--desktop.png',
    tablet: '/content/hero--tablet.png',
    mobile: '/content/hero--mobile.png',
    alt: 'Ckye AI coding agents interface showing code orchestration and governance features'
  }
}) => {
  return (
    <section className={`${styles.hero} ${className || ''}`} aria-labelledby="hero-heading">
      <div className={styles.hero__container}>
        <div className={styles.hero__content}>
          <div className={styles.hero__text}>
            <p className={styles.hero__tagline}>{tagline}</p>
            <h1 id="hero-heading" className={styles.hero__heading}>
              {heading}
            </h1>
            <p className={styles.hero__description}>
              {description}
            </p>
          </div>
          <Button 
            variant="secondary" 
            className={styles.hero__cta}
            aria-label={ctaAriaLabel}
            onClick={onCtaClick}
          >
            {ctaText}
          </Button>
        </div>
        
        <div className={styles.hero__imageWrapper}>
          <picture className={styles.hero__image}>
            <source 
              media="(min-width: 1024px)" 
              srcSet={images.desktop}
            />
            <source 
              media="(min-width: 768px)" 
              srcSet={images.tablet}
            />
            <Image
              src={images.mobile}
              alt={images.alt}
              width={295}
              height={312}
              priority
              className={styles.hero__img}
            />
          </picture>
        </div>
      </div>
    </section>
  );
};

export default Hero;