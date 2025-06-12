import React, { useState } from 'react';
import { Header, Navigation } from '../../organisms';
import { Button, Icon } from '../../atoms';
import './DashboardTemplate.css';
import type { DashboardTemplateProps } from '../../../types';

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  children,
  showSidebar = true,
  sidebarCollapsible = true,
  className = '',
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const templateClasses = [
    'dashboard-template',
    showSidebar && 'dashboard-template--with-sidebar',
    isSidebarOpen && 'dashboard-template--sidebar-open',
    isMobileMenuOpen && 'dashboard-template--mobile-menu-open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={templateClasses}>
      <Header className="dashboard-template__header" />

      <div className="dashboard-template__mobile-nav">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobileMenu}
          className="dashboard-template__mobile-toggle"
        >
          <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size="sm" />
          Menu
        </Button>
      </div>

      <div className="dashboard-template__layout">
        {showSidebar && (
          <aside className="dashboard-template__sidebar">
            <div className="dashboard-template__sidebar-header">
              {sidebarCollapsible && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSidebar}
                  className="dashboard-template__sidebar-toggle"
                >
                  <Icon name={isSidebarOpen ? 'close' : 'menu'} size="sm" />
                  {isSidebarOpen && 'Recolher'}
                </Button>
              )}
            </div>

            <nav className="dashboard-template__sidebar-content">
              <Navigation variant="vertical" />
            </nav>
          </aside>
        )}

        <main className="dashboard-template__main">
          <div className="dashboard-template__content">
            {children}
          </div>
        </main>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="dashboard-template__mobile-overlay"
          onClick={toggleMobileMenu}
        >
          <nav className="dashboard-template__mobile-nav-content">
            <Navigation variant="mobile" />
          </nav>
        </div>
      )}

      {showSidebar && isSidebarOpen && (
        <div 
          className="dashboard-template__sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};