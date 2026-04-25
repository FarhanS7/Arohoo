import StaticPage from "@/components/layout/UX/StaticPage";

export default function HelpPage() {
  return (
    <StaticPage 
      title="Help Center" 
      subtitle="Everything you need to know about shopping on Arohoo"
    >
      <section>
        <h3>Getting Started</h3>
        <p>
          Welcome to Arohoo, the premier multi-tenant ecommerce platform. Whether you're looking for the latest fashion, 
          exclusive skincare, or the best deals in your favorite malls, we've got you covered.
        </p>
      </section>

      <section>
        <h3>Common Questions</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold">How do I place an order?</h4>
            <p>Simply browse our collections, add items to your cart, and proceed to checkout. You can shop from multiple merchants in a single transaction.</p>
          </div>
          <div>
            <h4 className="font-bold">What payment methods are accepted?</h4>
            <p>We accept all major credit cards, digital wallets, and region-specific payment methods to ensure a smooth checkout experience.</p>
          </div>
          <div>
            <h4 className="font-bold">How can I track my delivery?</h4>
            <p>Once your order is processed, you will receive a tracking link via email. You can also view the status of your orders in your dashboard.</p>
          </div>
        </div>
      </section>

      <section className="mt-12 p-8 bg-neutral-50 rounded-3xl border border-neutral-100">
        <h3>Still need help?</h3>
        <p>Our support team is available 24/7 to assist you with any inquiries or issues you may encounter.</p>
        <button className="mt-4 px-8 py-4 bg-neutral-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest">
          Contact Support
        </button>
      </section>
    </StaticPage>
  );
}
