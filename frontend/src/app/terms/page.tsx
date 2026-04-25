import StaticPage from "@/components/layout/UX/StaticPage";

export default function TermsPage() {
  return (
    <StaticPage 
      title="Terms of Service" 
      subtitle="The rules of engagement on our platform"
    >
      <section>
        <p>
          By accessing and using the Arohoo platform, you agree to comply with and be bound by the following terms and 
          conditions of use.
        </p>
      </section>

      <section>
        <h3>User Accounts</h3>
        <p>
          To access certain features of the platform, you must create an account. You are responsible for maintaining 
          the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
      </section>

      <section>
        <h3>Purchase and Payment</h3>
        <p>
          All purchases made through Arohoo are subject to availability. We reserve the right to refuse or cancel 
          orders at our discretion. Prices are subject to change without notice.
        </p>
      </section>

      <section>
        <h3>Intellectual Property</h3>
        <p>
          All content on this platform, including text, graphics, logos, and images, is the property of Arohoo or its 
          content suppliers and is protected by international copyright laws.
        </p>
      </section>

      <section>
        <h3>Limitation of Liability</h3>
        <p>
          Arohoo is a multi-tenant platform. While we strive to ensure merchant quality, we are not responsible for the 
          actions, products, or content of third-party merchants on the platform.
        </p>
      </section>

      <section>
        <h3>Governing Law</h3>
        <p>
          These terms are governed by and construed in accordance with the laws of the jurisdiction in which Arohoo 
          operates.
        </p>
      </section>
    </StaticPage>
  );
}
