import StaticPage from "@/components/layout/UX/StaticPage";

export default function DeliveryPage() {
  return (
    <StaticPage 
      title="Delivery Options" 
      subtitle="Fast, reliable shipping from our merchants to you"
    >
      <section>
        <h3>Shipping Methods</h3>
        <p>
          We offer various shipping options to meet your needs. Shipping times and costs depend on your location 
          and the merchants you are buying from.
        </p>
      </section>

      <section>
        <h3>Available Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
            <h4 className="font-bold mb-2">Standard</h4>
            <p className="text-xs text-neutral-500 mb-4">5-7 Business Days</p>
            <p className="text-lg font-black">$5.00</p>
          </div>
          <div className="p-6 bg-neutral-900 text-white rounded-2xl border border-neutral-800">
            <h4 className="font-bold mb-2">Express</h4>
            <p className="text-xs text-neutral-400 mb-4">2-3 Business Days</p>
            <p className="text-lg font-black">$15.00</p>
          </div>
          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
            <h4 className="font-bold mb-2">Same Day</h4>
            <p className="text-xs text-neutral-500 mb-4">Select Locations Only</p>
            <p className="text-lg font-black">$25.00</p>
          </div>
        </div>
      </section>

      <section>
        <h3>Order Processing</h3>
        <p>
          Orders are typically processed by merchants within 1-2 business days. You will receive an email confirmation 
          with tracking information as soon as your package is dispatched.
        </p>
      </section>

      <section>
        <h3>International Shipping</h3>
        <p>
          Arohoo currently supports domestic shipping within our primary operating regions. We are working on 
          expanding our reach to offer international delivery soon.
        </p>
      </section>

      <section>
        <h3>Tracking Your Order</h3>
        <p>
          Stay updated on your delivery status through your personal dashboard or by clicking the tracking link 
          sent to your email.
        </p>
      </section>
    </StaticPage>
  );
}
