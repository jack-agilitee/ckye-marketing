import React from 'react';
import styles from './Metrics.module.scss';

export interface MetricData {
  title: string;
  value: string;
  secondaryValue?: string;
  description: string;
}

export interface MetricsProps {
  variant?: 'single' | 'double';
  metrics: MetricData[];
  gradientColor?: 'blue' | 'orange' | string;
  className?: string;
}

export const Metrics: React.FC<MetricsProps> = ({
  variant = 'single',
  metrics,
  gradientColor = 'orange',
  className = ''
}) => {
  const gradientClass = typeof gradientColor === 'string' && (gradientColor === 'blue' || gradientColor === 'orange')
    ? styles[`gradient--${gradientColor}`]
    : '';

  const customGradientStyle = typeof gradientColor === 'string' && gradientColor !== 'blue' && gradientColor !== 'orange'
    ? { '--gradient-custom': `linear-gradient(180deg, #FFF 0%, ${gradientColor} 100%)` } as React.CSSProperties
    : {};

  return (
    <section 
      className={`${styles.metrics} ${styles[`metrics--${variant}`]} ${className}`}
      aria-label="Metrics dashboard"
    >
      <div className={styles.metrics__container}>
        <div className={styles.metrics__row}>
          {metrics.map((metric, index) => (
            <div key={index} className={styles.metrics__item}>
              <h3 className={styles.metrics__title}>{metric.title}</h3>
              <div className={styles.metrics__values}>
                <p 
                  className={`${styles.metrics__value} ${gradientClass}`}
                  style={customGradientStyle}
                >
                  {metric.value}
                </p>
                {variant === 'double' && metric.secondaryValue && (
                  <p 
                    className={`${styles.metrics__value} ${styles['metrics__value--secondary']} ${gradientClass}`}
                    style={customGradientStyle}
                  >
                    {metric.secondaryValue}
                  </p>
                )}
              </div>
              <p className={styles.metrics__description}>{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};