'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './NavigationHeader.module.scss';

interface NavigationHeaderProps {
  className?: string;
  'data-testid'?: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ className, 'data-testid': testId }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    closeMobileMenu();
  };

  return (
    <header className={`${styles['navigation-header']} ${className || ''}`} data-testid={testId || "navigation-header"}>
      <div className={styles['navigation-header__container']}>
        {/* Logo */}
        <div className={styles['navigation-header__logo']} data-testid="navigation-logo">
          <Image
            src="/logo.png"
            alt="CKYE Logo"
            width={120}
            height={40}
            priority
          />
        </div>

        {/* Desktop Navigation */}
        <nav className={styles['navigation-header__nav']} aria-label="Main navigation" data-testid="desktop-navigation">
          <ul className={styles['navigation-header__nav-list']}>
            <li className={styles['navigation-header__nav-item']}>
              <a href="#product" className={styles['navigation-header__nav-link']} data-testid="nav-link-product">
                Product
              </a>
            </li>
            <li className={styles['navigation-header__nav-item']}>
              <a href="#enterprise" className={styles['navigation-header__nav-link']} data-testid="nav-link-enterprise">
                Enterprise
              </a>
            </li>
            <li className={styles['navigation-header__nav-item']}>
              <a href="#contact" className={styles['navigation-header__nav-link']} data-testid="nav-link-contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* CTA Buttons */}
        <div className={styles['navigation-header__cta']} data-testid="desktop-cta-buttons">
          <button className={styles['navigation-header__cta-button']} type="button" data-testid="cta-login">
            Log In
          </button>
          <button className={`${styles['navigation-header__cta-button']} ${styles['navigation-header__cta-button--primary']}`} type="button" data-testid="cta-signup">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles['navigation-header__mobile-toggle']}
          onClick={toggleMobileMenu}
          type="button"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          data-testid="mobile-menu-toggle"
        >
          <Image
            src={isMobileMenuOpen ? '/close.svg' : '/hamburger.svg'}
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className={styles['navigation-header__mobile-menu']} data-testid="mobile-menu">
          <nav className={styles['navigation-header__mobile-nav']} aria-label="Mobile navigation">
            <ul className={styles['navigation-header__mobile-nav-list']}>
              <li className={styles['navigation-header__mobile-nav-item']}>
                <a 
                  href="#product" 
                  className={styles['navigation-header__mobile-nav-link']}
                  onClick={handleNavClick}
                  data-testid="mobile-nav-link-product"
                >
                  Product
                </a>
              </li>
              <li className={styles['navigation-header__mobile-nav-item']}>
                <a 
                  href="#enterprise" 
                  className={styles['navigation-header__mobile-nav-link']}
                  onClick={handleNavClick}
                  data-testid="mobile-nav-link-enterprise"
                >
                  Enterprise
                </a>
              </li>
              <li className={styles['navigation-header__mobile-nav-item']}>
                <a 
                  href="#contact" 
                  className={styles['navigation-header__mobile-nav-link']}
                  onClick={handleNavClick}
                  data-testid="mobile-nav-link-contact"
                >
                  Contact
                </a>
              </li>
            </ul>
            <div className={styles['navigation-header__mobile-cta']} data-testid="mobile-cta-buttons">
              <button 
                className={styles['navigation-header__mobile-cta-button']} 
                type="button"
                onClick={handleNavClick}
                data-testid="mobile-cta-login"
              >
                Log In
              </button>
              <button 
                className={`${styles['navigation-header__mobile-cta-button']} ${styles['navigation-header__mobile-cta-button--primary']}`} 
                type="button"
                onClick={handleNavClick}
                data-testid="mobile-cta-signup"
              >
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavigationHeader;