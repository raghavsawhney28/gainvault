import React from "react";

const PrivacyPolicy = () => {
  return (
    <div style={{ backgroundColor: "#000000", color: "#FFFFFF" }}>
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "48px 20px",
        }}
      >
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: 16 }}>
          Privacy Policy
        </h1>

        <p style={{ color: "#e5e7eb", lineHeight: 1.7, marginBottom: 24 }}>
          This Privacy Policy explains how GainVault ("GainVault", "we", "us", or
          "our") collects, uses, discloses, and protects your information when you
          use our website, products, and services (collectively, the "Services"). By
          accessing or using the Services, you agree to the terms of this Privacy
          Policy.
        </p>

        <div style={{ display: "grid", gap: 20 }}>
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              1. Collection of Your Personal Information
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7, marginBottom: 12 }}>
              We may collect information that identifies you directly or indirectly
              when you use our Services. This may include:
            </p>
            <ul style={{ paddingLeft: 20, listStyle: "disc" }}>
              {[
                "Name",
                "Address",
                "Email",
                "Phone",
                "Payment details",
              ].map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: 8,
                    color: "#e5e7eb",
                  }}
                >
                  <span
                    style={{
                      color: "#00FF88",
                      fontWeight: 700,
                      marginRight: 6,
                    }}
                  >
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              2. Use of Your Personal Information
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              We use the information we collect to operate and improve the Services,
              process payments, communicate with you, provide customer support,
              personalize your experience, enforce our agreements, and comply with
              applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              3. Sharing of Information
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              GainVault does not sell or rent your personal information. We may
              share information with trusted service providers who assist us in
              operating the Services, with our affiliates as needed, or as required
              to comply with applicable law, legal process, or governmental requests.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              4. Tracking & Analytics
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              We may collect certain information automatically, such as IP address,
              browser type, operating system, device identifiers, referring URLs, and
              usage information for analytics, security, and service improvement
              purposes.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              5. Use of Cookies
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              Cookies and similar technologies help us remember your preferences,
              understand how you use the Services, and provide a more personalized
              experience. You can control cookies through your browser settings, but
              disabling them may affect certain features.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              6. Security of Information
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              We implement technical and organizational measures, including SSL and
              encryption, to help protect your information. However, no method of
              transmission or storage is completely secure, and we cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              7. Data Retention & Deletion
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              We retain personal information for as long as necessary to fulfill the
              purposes outlined in this Policy or as required by law. You may request
              deletion of your personal data, subject to legal and contractual
              obligations.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              8. Children’s Privacy
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              Our Services are not directed to individuals under the age of 13, and
              we do not knowingly collect personal information from children. If we
              learn that we have collected such information, we will take appropriate
              steps to delete it.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              9. Opt-Out & Contact
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              You may opt out of non-essential communications at any time. For
              privacy-related inquiries, please contact us at:
              <br />
              <a
                href="mailto:gainvaultcapital@gmail.com"
                style={{ color: "#00FF88", textDecoration: "underline" }}
              >
                gainvaultcapital@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              10. Changes to this Policy
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              We may update this Privacy Policy from time to time. Changes will be
              posted on this page with an updated effective date. Your continued use
              of the Services after changes take effect constitutes acceptance of the
              revised Policy.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              11. Contact Us
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              GainVault Capital Ltd.
              <br />
              18 Pasea Estate Road, Road Town, TORTOLA, VG1110, BRITISH VIRGIN ISLANDS
              <br />
              Email: <a href="mailto:gainvaultcapital@gmail.com" style={{ color: "#00FF88", textDecoration: "underline" }}>gainvaultcapital@gmail.com</a>
            </p>
          </section>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;


