import React from 'react';
import './MainTemplate.css';
import type { MainTemplateProps } from '../../../types';

export const MainTemplate: React.FC<MainTemplateProps> = ({
  children,
  variant = 'default',
  showScrollToTop = true,
  className = '',
}) => {
  const [showScrollButton, setShowScrollButton] = React.useState(false);

  React.useEffect(() => {
    if (!showScrollToTop) return;

    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollToTop]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const templateClasses = [
    'main-template',
    `main-template--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={templateClasses}>
      <div className="main-template__container">
        {children}
      </div>

      {showScrollToTop && showScrollButton && (
        <button
          onClick={scrollToTop}
          className="main-template__scroll-to-top"
          aria-label="Voltar ao topo"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
};