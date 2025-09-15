import React from "react";

const TermsOfService = () => {
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
          Terms of Service
        </h1>

        <p style={{ color: "#e5e7eb", lineHeight: 1.7, marginBottom: 24 }}>
          These Terms of Service ("Terms") govern your access to and use of the
          services provided by GainVault ("GainVault", "we", "us", or "our"). By
          accessing or using our website, products, or services (collectively, the
          "Services"), you agree to be bound by these Terms.
        </p>

        <div style={{ display: "grid", gap: 20 }}>
          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              By using the Services, you confirm that you have read, understood,
              and agree to these Terms and our Privacy Policy. If you do not agree,
              you may not use the Services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              2. Eligibility
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              You must be at least 18 years of age and legally capable of
              entering into a binding agreement to use the Services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              3. Account Registration
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7, marginBottom: 12 }}>
              To access certain features, you may be required to create an account.
              You agree to provide accurate, current, and complete information and
              to update such information as necessary.
            </p>
            <ul style={{ paddingLeft: 20, listStyle: "disc" }}>
              {["Maintain the security of your account credentials", "Notify us immediately of any unauthorized use", "Accept responsibility for all activities under your account"].map((item, idx) => (
                <li key={idx} style={{ color: "#e5e7eb", marginBottom: 8 }}>
                  <span style={{ color: "#00FF88", fontWeight: 700, marginRight: 6 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              4. Acceptable Use
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7, marginBottom: 12 }}>
              You agree not to use the Services in any manner that is unlawful,
              harmful, or interferes with the operation of the Services. Prohibited
              activities include, but are not limited to:
            </p>
            <ul style={{ paddingLeft: 20, listStyle: "disc" }}>
              {["Attempting to gain unauthorized access to systems or data", "Distributing malware or harmful code", "Using the Services for fraudulent or illegal activities", "Interfering with or disrupting network or server operations"].map((item, idx) => (
                <li key={idx} style={{ color: "#e5e7eb", marginBottom: 8 }}>
                  <span style={{ color: "#00FF88", fontWeight: 700, marginRight: 6 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              5. Payments and Fees
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              Certain features may require payment of fees. You agree to pay all
              applicable fees in accordance with the pricing and billing terms
              presented to you. All fees are non-refundable except as required by
              law or expressly stated by GainVault.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              6. Intellectual Property
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              All content, trademarks, logos, and other intellectual property
              displayed through the Services are owned by GainVault or its
              licensors and are protected by applicable laws. You may not copy,
              modify, distribute, or create derivative works without express
              permission.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              7. Disclaimers
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              The Services are provided on an "as is" and "as available" basis
              without warranties of any kind, whether express or implied. GainVault
              disclaims all warranties, including implied warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              8. Limitation of Liability
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              To the maximum extent permitted by law, GainVault shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages, or any loss of profits or revenues, whether incurred directly
              or indirectly, or any loss of data, use, or goodwill.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              9. Indemnification
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              You agree to indemnify and hold harmless GainVault, its affiliates,
              officers, directors, employees, and agents from any claims, damages,
              liabilities, and expenses arising out of your use of the Services or
              violation of these Terms.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              10. Termination
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              We may suspend or terminate your access to the Services at any time
              for any reason, including for violation of these Terms.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              11. Governing Law
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              These Terms are governed by and construed in accordance with the laws
              of the applicable jurisdiction, without regard to conflict of law
              principles.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              12. Changes to These Terms
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              We may update these Terms from time to time. Changes will be posted
              on this page with an updated effective date. Your continued use of the
              Services after changes take effect constitutes acceptance of the
              updated Terms.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 12 }}>
              13. Contact Us
            </h2>
            <p style={{ color: "#e5e7eb", lineHeight: 1.7 }}>
              For questions about these Terms, please contact us at:
              <br />
              <a href="mailto:gainvaultcapital@gmail.com" style={{ color: "#00FF88", textDecoration: "underline" }}>
                gainvaultcapital@gmail.com
              </a>
            </p>
          </section>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;


