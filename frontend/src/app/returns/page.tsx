import StaticPage from "@/components/layout/UX/StaticPage";

export default function ReturnsPage() {
  return (
    <StaticPage 
      title="Return Policy" 
      subtitle="Hassle-free returns for your peace of mind"
    >
      <section>
        <h3>Our Promise</h3>
        <p>
          We want you to be completely satisfied with your purchase. If for any reason you are not happy with your 
          order, we offer a straightforward return process.
        </p>
      </section>

      <section>
        <h3>Eligibility for Returns</h3>
        <ul>
          <li>Items must be returned within <strong>30 days</strong> of receipt.</li>
          <li>Items must be in their original condition, unworn, unwashed, and with all tags attached.</li>
          <li>Personal care products, intimate apparel, and final sale items are not eligible for return.</li>
        </ul>
      </section>

      <section>
        <h3>How to Start a Return</h3>
        <ol>
          <li>Go to your order history in your dashboard.</li>
          <li>Select the item(s) you wish to return and choose a reason.</li>
          <li>Print the prepaid shipping label and attach it to your package.</li>
          <li>Drop off the package at any authorized shipping location.</li>
        </ol>
      </section>

      <section>
        <h3>Refunds</h3>
        <p>
          Once we receive and inspect your return, we will process your refund to the original payment method within 
          5-7 business days. Shipping costs are non-refundable unless the item is defective or incorrect.
        </p>
      </section>

      <section>
        <h3>Exchanges</h3>
        <p>
          To exchange an item for a different size or color, please follow the return process and place a new order 
          for the replacement item.
        </p>
      </section>
    </StaticPage>
  );
}
