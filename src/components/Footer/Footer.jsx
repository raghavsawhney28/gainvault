import React from "react";
import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import styles from "./Footer.module.css";
import logo from "../../assets/logo.png";

const Footer = () => {
  const footerLinks = {
    Company: [
      { label: "About Us", to: "#" },
      { label: "Contact", to: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/terms-of-service" },
      { label: "Risk Disclosure", to: "#" },
    ],
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <img
                  src={logo}
                  alt="GainVault Logo"
                  className={styles.logoImage}
                />
              </div>
              <span>GainVault</span>
            </div>
            <p>
              Empowering traders worldwide with cutting-edge technology,
              real-time data, and professional-grade trading tools.
            </p>
            
            {/* Contact Details */}
            <div className={styles.contactDetails}>
              <h4>Contact Us</h4>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <a href="mailto:gainvaultcapital@gmail.com">gainvaultcapital@gmail.com</a>
              </div>
              <div className={styles.contactItem}>
                <MessageCircle size={16} />
                <a href="https://t.me/gainvaultcapital" target="_blank" rel="noopener noreferrer">t.me/gainvaultcapital</a>
              </div>
            </div>
          </div>

          <div className={styles.footerLinks}>
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className={styles.linkColumn}>
                <h4>{category}</h4>
                <ul>
                  {links.map((link, index) => (
                    <li key={index}>
                      {link.to && link.to !== "#" ? (
                        <Link to={link.to}>{link.label}</Link>
                      ) : (
                        <a href={link.to || "#"}>{link.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className={styles.newsletter}>
            <h4>Stay Updated</h4>
            <p>
              Get the latest market insights and platform updates delivered to
              your inbox.
            </p>
            <div className={styles.newsletterForm}>
              <input type="email" placeholder="Enter your email" />
              <button className={styles.btnPrimary}>Subscribe</button>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerBottomContent}>
            <p>© 2024 GainVault. All rights reserved.</p>
            <p>Regulated by Financial Conduct Authority, Member SIPC.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
