import React from 'react';
import Image from 'next/image';
import styles from './CompatibleWith.module.scss';

export interface CompatibleWithProps {
  className?: string;
}

export const CompatibleWith: React.FC<CompatibleWithProps> = ({ className = '' }) => {
  const models = [
    {
      name: 'Claude',
      src: '/models/claude.png',
      alt: 'Claude AI logo',
      width: 204,
      height: 48
    },
    {
      name: 'Gemini',
      src: '/models/gemini.png',
      alt: 'Google Gemini logo',
      width: 196,
      height: 48
    },
    {
      name: 'GitHub Copilot',
      src: '/models/copilot.png',
      alt: 'GitHub Copilot logo',
      width: 340,
      height: 48
    }
  ];

  return (
    <section 
      className={`${styles['compatible-with']} ${className}`}
      aria-label="AI models compatibility"
    >
      <div className={styles['compatible-with__container']}>
        <h2 className={styles['compatible-with__header']}>Compatible With:</h2>
        <div className={styles['compatible-with__models']} role="list">
          {models.map((model, index) => (
            <div 
              key={model.name} 
              className={styles['compatible-with__model']}
              role="listitem"
            >
              <Image
                src={model.src}
                alt={model.alt}
                width={model.width}
                height={model.height}
                priority={index === 0}
                className={styles['compatible-with__logo']}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompatibleWith;