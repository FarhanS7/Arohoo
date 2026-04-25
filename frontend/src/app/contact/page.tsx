import StaticPage from "@/components/layout/UX/StaticPage";

export default function ContactPage() {
  return (
    <StaticPage 
      title="Contact Us" 
      subtitle="We're here to help and listen to your feedback"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div>
          <h3>Get in Touch</h3>
          <p className="mb-8">
            Have a question about an order, a merchant, or just want to say hello? 
            Fill out the form or reach out through our official channels.
          </p>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Email</h4>
              <p className="text-lg font-bold">support@arohoo.com</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Phone</h4>
              <p className="text-lg font-bold">+1 (555) 000-0000</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Headquarters</h4>
              <p className="text-lg font-bold">Innovation Drive, Tech City, 90210</p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
          <form className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Name</label>
              <input type="text" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-neutral-900 transition-colors" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Email</label>
              <input type="email" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-neutral-900 transition-colors" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Message</label>
              <textarea rows={4} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-neutral-900 transition-colors" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full bg-neutral-900 text-white rounded-xl py-4 text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </StaticPage>
  );
}
