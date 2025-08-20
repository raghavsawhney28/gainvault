import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, Settings, Bell, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import logo from '../../assets/logo.png';
import styles from './Header.module.css';

const Header = ({ isLoggedIn, username, onAuthClick, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHamburgerDropdown, setShowHamburgerDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const hamburgerDropdownRef = useRef(null);
  const accountDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle dropdown clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hamburgerDropdownRef.current && !hamburgerDropdownRef.current.contains(event.target)) {
        setShowHamburgerDropdown(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
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
    setShowHamburgerDropdown(false);
    setShowAccountDropdown(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setShowHamburgerDropdown(false);
    setShowAccountDropdown(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleHamburgerClick = () => {
    setShowHamburgerDropdown(!showHamburgerDropdown);
    setShowAccountDropdown(false); // Close account dropdown when opening hamburger
  };

  const handleAccountClick = () => {
    setShowAccountDropdown(!showAccountDropdown);
    setShowHamburgerDropdown(false); // Close hamburger dropdown when opening account
  };

  const handleProfileAction = (action) => {
    setShowAccountDropdown(false);
    
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
          <div className={styles.hamburgerContainer} ref={hamburgerDropdownRef}>
            <button 
              className={styles.hamburgerButton}
              onClick={handleHamburgerClick}
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>

            {/* Mega Menu Dropdown */}
            {showHamburgerDropdown && (
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
            <div className={styles.accountSection} ref={accountDropdownRef}>
              <div 
                className={styles.accountInfo}
                onClick={handleAccountClick}
              >
                <div className={styles.accountAvatar}>
                  <PersonOutlineIcon />
                </div>
              </div>

              {/* Account Dropdown */}
              {showAccountDropdown && (
                <div className={styles.accountDropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownUserInfo}>
                      <span className={styles.dropdownUsername}>{username}</span>
                    </div>
                  </div>
                  
                  <div className={styles.dropdownDivider} />
                  
                  <div className={styles.dropdownMenu}>
                    <button 
                      className={styles.dropdownItem}
                      onClick={() => handleProfileAction('profile')}
                    >
                      <PersonOutlineIcon />
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
              <PersonOutlineIcon />
              Login
            </button>
          )}
        </div>


      </div>
    </header>
  );
};

export default Header;
