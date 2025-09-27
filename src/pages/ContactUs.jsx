import React from "react";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";

const ContactUs = () => {
  return (
    <div style={{ backgroundColor: "#000000", color: "#FFFFFF", minHeight: "100vh" }}>
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "48px 20px",
        }}
      >
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: 16 }}>
          Contact Us
        </h1>

        <p style={{ color: "#e5e7eb", lineHeight: 1.7, marginBottom: 32 }}>
          Get in touch with our team for any questions, support, or inquiries. 
          We're here to help you succeed in your trading journey.
        </p>

        <div style={{ display: "grid", gap: 32 }}>
          {/* Contact Methods */}
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 20 }}>
              Get In Touch
            </h2>
            
            <div style={{ display: "grid", gap: 20 }}>
              {/* Email Contact */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 16,
                padding: "20px",
                backgroundColor: "#1a1a1a",
                borderRadius: "12px",
                border: "1px solid #333"
              }}>
                <div style={{ 
                  backgroundColor: "#00FF88", 
                  borderRadius: "50%", 
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Mail size={20} color="#000" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 4 }}>
                    Email Support
                  </h3>
                  <a 
                    href="mailto:gainvaultcapital@gmail.com"
                    style={{ 
                      color: "#00FF88", 
                      textDecoration: "none",
                      fontSize: "1rem"
                    }}
                  >
                    gainvaultcapital@gmail.com
                  </a>
                  <p style={{ color: "#e5e7eb", fontSize: "0.9rem", marginTop: 4 }}>
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              {/* Telegram Contact */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 16,
                padding: "20px",
                backgroundColor: "#1a1a1a",
                borderRadius: "12px",
                border: "1px solid #333"
              }}>
                <div style={{ 
                  backgroundColor: "#00FF88", 
                  borderRadius: "50%", 
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <MessageCircle size={20} color="#000" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 4 }}>
                    Telegram Support
                  </h3>
                  <a 
                    href="https://t.me/gainvaultcapital"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: "#00FF88", 
                      textDecoration: "none",
                      fontSize: "1rem"
                    }}
                  >
                    t.me/gainvaultcapital
                  </a>
                  <p style={{ color: "#e5e7eb", fontSize: "0.9rem", marginTop: 4 }}>
                    Join our community for real-time support
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Company Information */}
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 20 }}>
              Company Information
            </h2>
            
            <div style={{ 
              padding: "24px",
              backgroundColor: "#1a1a1a",
              borderRadius: "12px",
              border: "1px solid #333"
            }}>
              <div style={{ display: "grid", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <MapPin size={18} color="#00FF88" />
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>
                      Registered Office
                    </h3>
                    <p style={{ color: "#e5e7eb", fontSize: "0.9rem" }}>
                      18 Pasea Estate Road, Road Town, TORTOLA, VG1110, BRITISH VIRGIN ISLANDS
                    </p>
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Clock size={18} color="#00FF88" />
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>
                      Business Hours
                    </h3>
                    <p style={{ color: "#e5e7eb", fontSize: "0.9rem" }}>
                      Monday - Friday: 9:00 AM - 6:00 PM (GMT)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Support Topics */}
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 20 }}>
              How We Can Help
            </h2>
            
            <div style={{ display: "grid", gap: 16 }}>
              {[
                "Account setup and verification",
                "Trading platform technical support",
                "Payment and withdrawal assistance",
                "Trading rules and compliance questions",
                "General inquiries and feedback"
              ].map((topic, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: idx < 4 ? "1px solid #333" : "none"
                  }}
                >
                  <span
                    style={{
                      color: "#00FF88",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      marginRight: 8,
                    }}
                  >
                    •
                  </span>
                  <span style={{ color: "#e5e7eb", fontSize: "1rem" }}>
                    {topic}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Response Time */}
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 20 }}>
              Response Times
            </h2>
            
            <div style={{ 
              padding: "20px",
              backgroundColor: "#1a1a1a",
              borderRadius: "12px",
              border: "1px solid #333"
            }}>
              <p style={{ color: "#e5e7eb", lineHeight: 1.7, marginBottom: 16 }}>
                We're committed to providing timely support to all our users:
              </p>
              
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#e5e7eb" }}>General Inquiries</span>
                  <span style={{ color: "#00FF88", fontWeight: 600 }}>Within 24 hours</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#e5e7eb" }}>Technical Support</span>
                  <span style={{ color: "#00FF88", fontWeight: 600 }}>Within 12 hours</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#e5e7eb" }}>Urgent Issues</span>
                  <span style={{ color: "#00FF88", fontWeight: 600 }}>Within 4 hours</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;

