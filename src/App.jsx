import React, { useEffect, useState } from "react";
import logo from './assets/logo.png'; 

import { useSpring, animated, useTrail, config } from "@react-spring/web";
import {
  BarChart3,
  Users,
  Zap,
  TrendingUp,
  Shield,
  Globe,
  Cpu,
  Headphones,
  Play,
  Star,
  Linkedin,
  Twitter,
  Menu,
  X,
} from "lucide-react";
import "./App.css";

// Intersection Observer Hook for animations
const useInView = (threshold = 0.1) => {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, inView];
};

// Animated Section Component
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [ref, inView] = useInView();

  const animation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(30px)",
    delay: delay,
    config: config.gentle,
  });

  return (
    <animated.div ref={ref} style={animation} className={className}>
      {children}
    </animated.div>
  );
};

// Header Component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <img
                src={logo}
                alt="Logo"
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            <span>GainVault</span>
          </div>

          <nav className={`nav ${isMobileMenuOpen ? "nav-open" : ""}`}>
            <a href="#platform">Platform</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </nav>

          <div className="header-actions">
            <a href="#signin" className="sign-in">
              Sign In
            </a>
            <button className="btn-primary">Start Trading</button>
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

// Hero Section Component
const HeroSection = () => {
  const heroAnimation = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(50px)" },
    delay: 200,
    config: config.gentle,
  });

  return (
    <section className="hero">
      <div className="container">
        <animated.div style={heroAnimation} className="hero-content">
          <h1 className="hero-title">
            Trade with
            <br />
            <span className="gradient-text">Precision & Power</span>
          </h1>
          <p className="hero-subtitle">
            Access institutional-grade trading tools, real-time market data, and
            advanced analytics to maximize your trading potential in global
            markets.
          </p>
          <div className="hero-actions">
            <button className="btn-primary btn-large">
              Start Trading Now →
            </button>
            <button className="btn-secondary btn-large">
              <Play size={16} /> Watch Demo
            </button>
          </div>
        </animated.div>
      </div>
    </section>
  );
};

// Statistics Section Component
const StatsSection = () => {
  const stats = [
    { icon: BarChart3, value: "$2.4B+", label: "Daily Volume" },
    { icon: Users, value: "500K+", label: "Active Traders" },
    { icon: Zap, value: "0.1ms", label: "Execution Speed" },
  ];

  return (
    <AnimatedSection className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <stat.icon className="stat-icon" size={32} />
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description:
        "Real-time market analysis with AI-powered insights and predictive modeling.",
    },
    {
      icon: Zap,
      title: "Lightning Execution",
      description:
        "Ultra-low latency trading with sub-millisecond order execution.",
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description:
        "Multi-layer security protocols and encrypted data transmission.",
    },
    {
      icon: Globe,
      title: "Global Markets",
      description:
        "Access to 150+ markets worldwide including forex, stocks, and crypto.",
    },
    {
      icon: Cpu,
      title: "AI Trading Bots",
      description:
        "Automated trading strategies powered by machine learning algorithms.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock market access with real-time support.",
    },
  ];

  return (
    <section className="features-section" id="features">
      <div className="container">
        <AnimatedSection className="features-header">
          <h2>Professional Trading Made Simple</h2>
          <p>
            Experience the power of institutional-grade trading tools designed
            for both beginners and professional traders.
          </p>
        </AnimatedSection>

        <div className="features-grid">
          {features.map((feature, index) => (
            <AnimatedSection
              key={index}
              delay={index * 100}
              className="feature-card"
            >
              <feature.icon className="feature-icon" size={32} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="features-cta">
          <button className="btn-outline">Explore All Features</button>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Pricing Section Component
const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/Forever Free",
      description: "Perfect for beginners exploring trading",
      features: [
        "Basic trading tools",
        "Real-time market data",
        "Educational resources",
        "Community support",
        "Mobile app access",
      ],
      buttonText: "Get Started",
      buttonClass: "btn-secondary",
    },
    {
      name: "Professional",
      price: "$49",
      period: "/per month",
      description: "Advanced tools for serious traders",
      popular: true,
      features: [
        "Advanced charting tools",
        "AI-powered analytics",
        "Priority customer support",
        "Advanced order types",
        "Risk management tools",
        "API access",
        "Custom indicators",
      ],
      buttonText: "Start Free Trial",
      buttonClass: "btn-primary",
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/per month",
      description: "Institutional-grade trading platform",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solutions",
        "Advanced security features",
        "SLA guarantee",
        "Custom reporting",
      ],
      buttonText: "Contact Sales",
      buttonClass: "btn-outline",
    },
  ];

  return (
    <section className="pricing-section" id="pricing">
      <div className="container">
        <AnimatedSection className="pricing-header">
          <h2>Choose Your Trading Plan</h2>
          <p>
            Start with our free plan and upgrade as you grow. All plans include
            our core trading features with varying levels of advanced tools.
          </p>
        </AnimatedSection>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <AnimatedSection
              key={index}
              delay={index * 100}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <Star size={14} /> Most Popular
                </div>
              )}
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                <p className="plan-description">{plan.description}</p>
              </div>
              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button className={`btn-full ${plan.buttonClass}`}>
                {plan.buttonText}
              </button>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="pricing-guarantee">
          <p>
            All plans include SSL encryption, 99.9% uptime guarantee, and 24/7
            customer support.
          </p>
          <div className="guarantee-badge">30-day money-back guarantee</div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const footerLinks = {
    Platform: [
      "Trading Tools",
      "Market Data",
      "API Documentation",
      "Mobile App",
      "Desktop Platform",
    ],
    Company: ["About Us", "Careers", "Press", "Blog", "Contact"],
    Resources: [
      "Help Center",
      "Trading Guides",
      "Webinars",
      "Status Page",
      "Community",
    ],
    Legal: [
      "Privacy Policy",
      "Terms of Service",
      "Risk Disclosure",
      "Compliance",
      "Licenses",
    ],
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon"></div>
              <span>ProTrade</span>
            </div>
            <p>
              Empowering traders worldwide with cutting-edge technology,
              real-time data, and professional-grade trading tools.
            </p>
            <div className="social-links">
              <a href="#">
                <Linkedin size={20} />
              </a>
              <a href="#">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="footer-links">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="link-column">
                <h4>{category}</h4>
                <ul>
                  {links.map((link, index) => (
                    <li key={index}>
                      <a href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="newsletter">
            <h4>Stay Updated</h4>
            <p>
              Get the latest market insights and platform updates delivered to
              your inbox.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="btn-primary">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>© 2024 ProTrade. All rights reserved.</p>
            <p>Regulated by Financial Conduct Authority, Member SIPC.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
