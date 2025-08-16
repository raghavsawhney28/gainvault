import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import WalletButton from '../WalletButton/WalletButton';
import styles from './Header.module.css';
import logo from "../../assets/logo.png";
import useAuth from '../../hooks/useAuth'; // ✅ Now uses unified hook

const Header = ({ onAuthClick, onLogout, isLoggedIn: propIsLoggedIn, username }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use props if provided, otherwise fall back to hook
  const { isLoggedIn: hookIsLoggedIn, user: hookUser, logout: hookLogout, checkAuthStatus } = useAuth();
  
  // Prefer props over hook values for better control
  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : hookIsLoggedIn;
  const user = username ? { username } : hookUser;
  const logout = onLogout || hookLogout;

  // Debug logging
  console.log('Header - isLoggedIn:', isLoggedIn, 'user:', user);
  console.log('Header - props received:', { onAuthClick, onLogout, propIsLoggedIn, username });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // ✅ Ensure we have the latest login state when header mounts
    checkAuthStatus();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkAuthStatus]);

  const handleStartTrading = () => {
    navigate('/trading-challenge');
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <img src={logo} alt="GainVault Logo" className={styles.logoImage} />
            </div>
            <span>GainVault</span>
          </div>
          
          <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
            <a href="#platform">Platform</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
            <a href="/rules" onClick={(e) => { e.preventDefault(); navigate('/rules'); }}>Rules</a>
          </nav>

          <div className={styles.headerActions}>
            {isLoggedIn ? (
              <div className={styles.userSection}>
                <span className={styles.welcomeMessage}>
                  Welcome, {user?.username || "Trader"}!
                </span>
                <button 
                  className={styles.logoutButton} 
                  onClick={() => {
                    console.log("🔓 Logout button clicked");
                    logout();
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                className={styles.authButton} 
                onClick={() => {
                  console.log("🔐 Auth button clicked, onAuthClick:", onAuthClick);
                  if (onAuthClick) {
                    onAuthClick();
                  } else {
                    console.error("❌ onAuthClick is not defined!");
                  }
                }}
              >
                Sign In
              </button>
            )}
            {/* <WalletButton /> */}
            <button className={styles.btnPrimary} onClick={handleStartTrading}>
              Start Trading
            </button>
          </div>

          <button 
            className={styles.mobileMenuToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
