import StaticPage from "@/components/layout/UX/StaticPage";

export default function PrivacyPage() {
  return (
    <StaticPage 
      title="Privacy Policy" 
      subtitle="Last updated: April 2026"
    >
      <section>
        <p>
          At Arohoo, we take your privacy seriously. This policy describes how we collect, use, and handle your personal 
          information when you use our platform and services.
        </p>
      </section>

      <section>
        <h3>Information We Collect</h3>
        <ul>
          <li><strong>Personal Details:</strong> Name, email address, phone number, and shipping address.</li>
          <li><strong>Payment Information:</strong> Securely processed through our payment partners; we do not store full credit card numbers.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our site to improve your experience.</li>
        </ul>
      </section>

      <section>
        <h3>How We Use Your Data</h3>
        <p>
          Your data is used to process orders, provide customer support, and personalize your shopping experience. 
          We share necessary information with merchants and delivery partners to fulfill your purchases.
        </p>
      </section>

      <section>
        <h3>Your Rights</h3>
        <p>
          You have the right to access, correct, or delete your personal information at any time through your account settings 
          or by contacting our privacy team at privacy@arohoo.com.
        </p>
      </section>

      <section>
        <h3>Security</h3>
        <p>
          We implement industry-standard security measures, including encryption and secure protocols, to protect your 
          data from unauthorized access.
        </p>
      </section>
    </StaticPage>
  );
}
