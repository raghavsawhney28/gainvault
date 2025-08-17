import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import styles from './Header.module.css';

const Header = ({ isLoggedIn, username, onAuthClick, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    // Navigate to homepage
    navigate('/');
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContent}>
        {/* Logo */}
        <div className={styles.logo} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <div className={styles.logoIcon}>
            <img src={logo} alt="GainVault Logo" className={styles.logoImage} />
          </div>
          <span>GainVault</span>
        </div>

        {/* Navigation */}
        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <a 
            className={isActive('/') ? styles.active : ''} 
            onClick={() => handleNavClick('/')}
          >
            Home
          </a>
          <a 
            className={isActive('/trading-challenge') ? styles.active : ''} 
            onClick={() => handleNavClick('/trading-challenge')}
          >
            Trading Challenge
          </a>
          <a 
            className={isActive('/rules') ? styles.active : ''} 
            onClick={() => handleNavClick('/rules')}
          >
            Rules
          </a>
          <a 
            className={isActive('/referral') ? styles.active : ''} 
            onClick={() => handleNavClick('/referral')}
          >
            Referral
          </a>
        </nav>

        {/* Header Actions */}
        <div className={styles.headerActions}>
          {isLoggedIn ? (
            <div className={styles.userSection}>
              <div className={styles.welcomeMessage}>
                Welcome, <span className={styles.username}>{username}</span>
              </div>
              <button className={styles.logoutButton} onClick={onLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <button className={styles.authButton} onClick={onAuthClick}>
              <User size={16} />
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobileMenuToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
