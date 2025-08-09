import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import WalletButton from '../WalletButton/WalletButton';
import styles from './Header.module.css';
import logo from "../../assets/logo.png";
import { AuthContext } from '../../context/AuthContext';

const Header = ({ onAuthClick }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Get auth state from context
  const { isLoggedIn, username, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                  Welcome, {username}!
                </span>
                <button className={styles.logoutButton} onClick={logout}>
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            ) : (
              <button className={styles.authButton} onClick={onAuthClick}>
                Sign Up / Log In
              </button>
            )}
            <WalletButton />
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
