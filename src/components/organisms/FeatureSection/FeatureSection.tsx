import Image from 'next/image';
import styles from './FeatureSection.module.scss';

interface FeatureSectionProps {
  heading: string;
  bodyText: string;
  image: {
    src: string;
    alt: string;
  };
  layout: 'image-left' | 'image-right';
  className?: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  heading,
  bodyText,
  image,
  layout,
  className
}) => {
  const layoutClass = layout === 'image-left' 
    ? styles['featureSection--imageLeft'] 
    : styles['featureSection--imageRight'];
  
  return (
    <section className={`${styles.featureSection} ${layoutClass} ${className || ''}`}>
      <div className={styles['featureSection__imageWrapper']}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className={styles['featureSection__image']}
          priority={false}
        />
      </div>
      
      <div className={styles['featureSection__content']}>
        <h2 className={styles['featureSection__heading']}>{heading}</h2>
        <p className={styles['featureSection__body']}>{bodyText}</p>
      </div>
    </section>
  );
};

export default FeatureSection;