import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, LogOut, Settings, UserCheck, Bell, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import styles from './Header.module.css';

const Header = ({ isLoggedIn, username, onAuthClick, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle profile dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show welcome animation when user first signs in
  useEffect(() => {
    if (isLoggedIn && username) {
      setUserInitial(username.charAt(0).toUpperCase());
      setShowWelcomeAnimation(true);
      
      // Hide welcome animation after 3 seconds
      const timer = setTimeout(() => {
        setShowWelcomeAnimation(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, username]);

  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
    setShowProfileDropdown(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setShowProfileDropdown(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleProfileAction = (action) => {
    setShowProfileDropdown(false);
    
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'logout':
        onLogout();
        break;
      default:
        break;
    }
  };

  const getProfileColor = () => {
    // Generate consistent color based on username
    if (!username) return '#666666';
    
    const colors = [
      '#2DDA7D', '#FF6B6B', '#4ECDC4', '#45B7D1', 
      '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
    ];
    
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
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
              {/* Welcome Animation */}
              {showWelcomeAnimation && (
                <div className={styles.welcomeAnimation}>
                  <UserCheck size={16} />
                  <span>Welcome back, {username}!</span>
                </div>
              )}
              
              {/* Profile Icon */}
              <div className={styles.profileContainer} ref={profileDropdownRef}>
                <button 
                  className={styles.profileButton}
                  onClick={handleProfileClick}
                  aria-label="Profile menu"
                >
                  <div 
                    className={styles.profileIcon}
                    style={{ backgroundColor: getProfileColor() }}
                  >
                    {userInitial}
                  </div>
                  <span className={styles.username}>{username}</span>
                  <ChevronDown 
                    size={16} 
                    className={`${styles.dropdownArrow} ${showProfileDropdown ? styles.rotated : ''}`}
                  />
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className={styles.profileDropdown}>
                    <div className={styles.dropdownHeader}>
                      <div 
                        className={styles.dropdownProfileIcon}
                        style={{ backgroundColor: getProfileColor() }}
                      >
                        {userInitial}
                      </div>
                      <div className={styles.dropdownUserInfo}>
                        <span className={styles.dropdownUsername}>{username}</span>
                        <span className={styles.dropdownStatus}>Online</span>
                      </div>
                    </div>
                    
                    <div className={styles.dropdownDivider} />
                    
                    <div className={styles.dropdownMenu}>
                      <button 
                        className={styles.dropdownItem}
                        onClick={() => handleProfileAction('profile')}
                      >
                        <User size={16} />
                        <span>Dashboard</span>
                      </button>
                      
                      
                      
                      
                    </div>
                    
                    <div className={styles.dropdownDivider} />
                    
                    <button 
                      className={`${styles.dropdownItem} ${styles.logoutItem}`}
                      onClick={() => handleProfileAction('logout')}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
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
