import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, Settings, Bell, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Drawer, Button, Stack, Text, Divider, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import logo from '../../assets/logo.png';
import styles from './Header.module.css';

const Header = ({ isLoggedIn, username, onAuthClick, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [userInitial, setUserInitial] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const accountDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Set initial mobile state
    handleResize();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle dropdown clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
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
    close();
    setShowAccountDropdown(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    close();
    setShowAccountDropdown(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleHamburgerClick = () => {
    open();
  };

  const handleAccountClick = () => {
    setShowAccountDropdown(!showAccountDropdown);
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

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/trading-challenge', label: 'Trading Challenge' },
    { path: '/rules', label: 'Rules' },
    { path: '/referral', label: 'Referral' },
    ...(isLoggedIn ? [{ path: `/dashboard/${username}`, label: 'Dashboard' }] : [])
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContent}>
        {/* Left Side - Hamburger Menu */}
        <div className={styles.leftSection}>
          <div className={styles.hamburgerContainer}>
            <button 
              className={styles.hamburgerButton}
              onClick={handleHamburgerClick}
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
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
                      onClick={() => handleNavClick(`/dashboard/${username}`)}
                    >
                      <PersonOutlineIcon />
                      <span>Dashboard</span>
                    </button>
                    
                    <button 
                      className={styles.dropdownItem}
                      onClick={() => handleProfileAction('profile')}
                    >
                      <PersonOutlineIcon />
                      <span>Profile</span>
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

      {/* Left Side Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        position="left"
        size={isMobile ? 280 : 'sm'}
        overlayProps={{ opacity: 0.5, blur: 4 }}
        withCloseButton={false}
        zIndex={1001}
        styles={{
          body: { padding: 0, height: '100%' },
          inner: { padding: 0, height: '100%' },
          root: { height: '100%' },
          content: { height: '100%' }
        }}
        classNames={{
          body: styles.drawerBody,
          inner: styles.drawerInner,
          content: styles.drawerContent
        }}
      >
        <div className={styles.drawerContent}>
          {/* Drawer Header */}
          <div className={styles.drawerHeader}>
            <div className={styles.drawerLogo} onClick={handleLogoClick}>
              <div className={styles.drawerLogoIcon}>
                <img src={logo} alt="GainVault Logo" className={styles.drawerLogoImage} />
              </div>
              <span>GainVault</span>
            </div>
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={close}
              className={styles.drawerCloseButton}
            >
              <X size={20} />
            </ActionIcon>
          </div>

          <Divider />

          {/* Navigation Menu */}
          <Stack gap={0} className={styles.drawerMenu}>
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`${styles.drawerMenuItem} ${isActive(item.path) ? styles.active : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                <span className={styles.menuLabel}>{item.label}</span>
              </button>
            ))}
          </Stack>

          {/* User Section (if logged in) */}
          {isLoggedIn && (
            <>
              <Divider />
              <div className={styles.drawerUserSection}>
                <div className={styles.drawerUserInfo}>
                  <div className={styles.drawerUserAvatar}>
                    <PersonOutlineIcon />
                  </div>
                  <div className={styles.drawerUserDetails}>
                    <Text size="sm" fw={600} c="white">
                      Welcome back!
                    </Text>
                    <Text size="xs" c="dimmed">
                      {username}
                    </Text>
                  </div>
                </div>
                <Button
                  variant="subtle"
                  color="red"
                  size="sm"
                  leftSection={<LogOut size={16} />}
                  onClick={() => {
                    handleProfileAction('logout');
                    close();
                  }}
                  className={styles.drawerLogoutButton}
                >
                  Sign Out
                </Button>
              </div>
            </>
          )}

          {/* Auth Section (if not logged in) */}
          {!isLoggedIn && (
            <>
              <Divider />
              <div className={styles.drawerAuthSection}>
                <Button
                  fullWidth
                  variant="filled"
                  color="green"
                  leftSection={<PersonOutlineIcon />}
                  onClick={() => {
                    onAuthClick();
                    close();
                  }}
                  className={styles.drawerLoginButton}
                >
                  Login / Sign Up
                </Button>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
