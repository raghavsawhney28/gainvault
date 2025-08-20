import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, LogOut, Settings, Bell, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import styles from './Header.module.css';

const Header = ({ isLoggedIn, username, onAuthClick, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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

  // Set user initial when user logs in
  useEffect(() => {
    if (isLoggedIn && username) {
      setUserInitial(username.charAt(0).toUpperCase());
    }
  }, [isLoggedIn, username]);

  const handleLogoClick = () => {
    navigate('/');
    setShowProfileDropdown(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
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
        {/* Left Side - Hamburger Menu */}
        <div className={styles.leftSection}>
          <div className={styles.hamburgerContainer} ref={profileDropdownRef}>
            <button 
              className={styles.hamburgerButton}
              onClick={handleProfileClick}
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>

            {/* Mega Menu Dropdown */}
            {showProfileDropdown && (
              <div className={styles.megaMenuDropdown}>
                <div className={styles.megaMenuHeader}>
                  <div className={styles.megaMenuTitle}>Navigation Menu</div>
                </div>
                
                <div className={styles.megaMenuContent}>
                  <div className={styles.megaMenuSection}>
                    <h3>Main Pages</h3>
                    <div className={styles.megaMenuItems}>
                      <button 
                        className={styles.megaMenuItem}
                        onClick={() => handleNavClick('/')}
                      >
                        <span>Home</span>
                      </button>
                      <button 
                        className={styles.megaMenuItem}
                        onClick={() => handleNavClick('/trading-challenge')}
                      >
                        <span>Trading Challenge</span>
                      </button>
                      <button 
                        className={styles.megaMenuItem}
                        onClick={() => handleNavClick('/rules')}
                      >
                        <span>Rules</span>
                      </button>
                      <button 
                        className={styles.megaMenuItem}
                        onClick={() => handleNavClick('/referral')}
                      >
                        <span>Referral</span>
                      </button>
                    </div>
                  </div>
                  

                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center - Logo */}
        <div className={styles.centerSection}>
          <div className={styles.logo} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <div className={styles.logoIcon}>
              <img src={logo} alt="GainVault Logo" className={styles.logoImage} />
            </div>
            <span>GainVault</span>
          </div>
        </div>

        {/* Right Side - Account Section */}
        <div className={styles.rightSection}>
          {isLoggedIn ? (
            <div className={styles.accountSection} ref={profileDropdownRef}>
              <div 
                className={styles.accountInfo}
                onClick={handleProfileClick}
              >
                <div 
                  className={styles.accountAvatar}
                  style={{ backgroundColor: getProfileColor() }}
                >
                  {userInitial}
                </div>
                <div className={styles.accountDetails}>
                  <span className={styles.accountUsername}>{username}</span>
                  <span className={styles.accountStatus}>Online</span>
                </div>
              </div>

              {/* Account Dropdown */}
              {showProfileDropdown && (
                <div className={styles.accountDropdown}>
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
                    
                    <button 
                      className={styles.dropdownItem}
                      onClick={() => handleProfileAction('logout')}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className={styles.authButton} onClick={onAuthClick}>
              <User size={16} />
              Login
            </button>
          )}
        </div>


      </div>
    </header>
  );
};

export default Header;
