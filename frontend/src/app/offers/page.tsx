import PageLayout from "@/components/layout/UX/PageLayout";
import { Badge } from "lucide-react";
import Link from "next/link";
import { Sparkles, Percent, Tag, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Exclusive Offers & Deals | Arohoo Marketplace",
  description: "Explore ongoing seasonal sales, merchant coupons, and limited-time designer discounts.",
};

export default function OffersPage() {
  const activeOffers = [
    {
      id: "offer-1",
      badge: "Seasonal Event",
      title: "Summer Solstice Sale",
      description: "Enjoy site-wide reductions across boutique apparel, custom jewelry, and handmade footwear.",
      discount: "Up to 40% OFF",
      code: "SOLSTICE40",
      cta: "Shop Sale",
      link: "/products",
      colorClass: "from-amber-500/10 to-orange-500/10 text-orange-600 border-orange-500/10",
      badgeColor: "bg-orange-500 text-white"
    },
    {
      id: "offer-2",
      badge: "Exclusive",
      title: "First Order Discount",
      description: "Welcome to Arohoo. Save on your initial purchase from any designer boutique store.",
      discount: "15% OFF",
      code: "WELCOME15",
      cta: "Explore Shop",
      link: "/products",
      colorClass: "from-emerald-500/10 to-teal-500/10 text-teal-600 border-teal-500/10",
      badgeColor: "bg-teal-500 text-white"
    },
    {
      id: "offer-3",
      badge: "Mall Special",
      title: "District Free Shipping",
      description: "Get free delivery on orders exceeding 2,500 BDT from participating flagship brands.",
      discount: "FREE SHIPPING",
      code: "FREESHIP",
      cta: "View Malls",
      link: "/malls",
      colorClass: "from-blue-500/10 to-indigo-500/10 text-indigo-600 border-indigo-500/10",
      badgeColor: "bg-indigo-500 text-white"
    }
  ];

  return (
    <PageLayout>
      <div className="bg-neutral-50/50 min-h-screen py-16 sm:py-24">
        <div className="responsive-container">
          
          {/* Header Section */}
          <div className="max-w-2xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Special Event Promos
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tighter uppercase italic mb-4">
              Seasonal Offers
            </h1>
            <p className="text-neutral-500 text-sm font-medium leading-relaxed italic">
              Exclusive discounts, limited-edition promotional codes, and free delivery offers aggregated from boutique merchants across our premier malls.
            </p>
          </div>

          {/* Offers List */}
          <div className="space-y-8 max-w-4xl">
            {activeOffers.map((offer) => (
              <div
                key={offer.id}
                className={`bg-white border rounded-[2.5rem] p-8 sm:p-12 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center shadow-sm hover:shadow-md transition-shadow duration-300`}
              >
                <div className="flex-1 space-y-4">
                  <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${offer.badgeColor}`}>
                    {offer.badge}
                  </span>
                  <div>
                    <h2 className="text-2xl font-black text-neutral-900 uppercase italic tracking-tighter mb-2">
                      {offer.title}
                    </h2>
                    <p className="text-neutral-500 text-xs font-medium leading-relaxed italic max-w-xl">
                      {offer.description}
                    </p>
                  </div>
                  
                  {/* Coupon Code Card */}
                  <div className="inline-flex items-center gap-3 bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-100">
                    <Tag className="w-4 h-4 text-neutral-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Code:</span>
                    <span className="text-xs font-black tracking-widest text-neutral-900 select-all bg-neutral-200/50 px-2.5 py-0.5 rounded">
                      {offer.code}
                    </span>
                  </div>
                </div>

                {/* Right Promo Box */}
                <div className={`w-full md:w-auto bg-gradient-to-br ${offer.colorClass} border rounded-3xl p-8 text-center flex flex-col items-center justify-center min-w-[240px]`}>
                  <Percent className="w-8 h-8 mb-3 opacity-80" />
                  <span className="text-xl font-black tracking-tighter uppercase italic block mb-6">
                    {offer.discount}
                  </span>
                  <Link
                    href={offer.link}
                    className="w-full bg-neutral-900 text-white py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-neutral-800 transition-colors active:scale-98"
                  >
                    {offer.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Secure Purchase Disclaimer */}
          <div className="mt-16 max-w-4xl p-6 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" />
            <p className="text-neutral-500 text-[10px] font-medium leading-relaxed italic">
              All discounts are verified and secured by our unified gateway. Promo codes are automatically applied at checkout when items from eligible merchants are in your cart.
            </p>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
