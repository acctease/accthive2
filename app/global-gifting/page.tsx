import Link from "next/link";

export default function GlobalGiftingPage() {
  return (
    <div className="bg-background-dark font-display text-white overflow-x-hidden selection:bg-primary selection:text-white min-h-screen">
      {/* Decorative Background Glows */}
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none z-0"></div>

      {/* Layout Container */}
      <div className="relative flex min-h-screen w-full flex-col z-10">
        {/* Top Navigation (Assuming reuse from Layout or global component not extracted yet, replicating structure for now) */}
        <header className="glass-nav fixed top-0 w-full z-50 transition-all duration-300">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">
                    hive
                  </span>
                </div>
                <h2 className="text-white text-xl font-bold tracking-tight">
                  Accthive
                </h2>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <Link
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  href="/services"
                >
                  Services
                </Link>
                <Link
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  href="/pricing"
                >
                  Pricing
                </Link>
                <Link
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  href="/api"
                >
                  API
                </Link>
                <Link
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  href="/support"
                >
                  Support
                </Link>
              </nav>

              {/* CTA Button */}
              <div className="flex items-center gap-4">
                <Link
                  className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  href="/login"
                >
                  Log In
                </Link>
                <Link
                  className="flex items-center justify-center rounded-full h-10 px-6 bg-primary hover:bg-opacity-90 text-white text-sm font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 cursor-pointer"
                  href="/login"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow pt-20">
          {/* Hero Section */}
          <section className="relative px-4 py-20 lg:py-32 flex flex-col items-center justify-center text-center">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
                <span className="flex h-2 w-2 rounded-full bg-purple-400"></span>
                <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">
                  Global Gifting Platform
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                Send Love{" "}
                <span className="text-gradient from-purple-400 to-indigo-400">
                  Globally
                </span>{" "}
                <br className="hidden md:block" />
                In Seconds
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                Connect with friends, family, and colleagues worldwide. Send
                digital gifts, vouchers, and rewards instantly via email, no
                shipping required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-background-dark font-bold text-base hover:bg-gray-100 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Start Gifting</span>
                  <span className="material-symbols-outlined text-[20px]">
                    volunteer_activism
                  </span>
                </button>
                <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-white/5 border border-white/10 text-white font-bold text-base hover:bg-white/10 transition-all backdrop-blur-sm active:scale-95 cursor-pointer">
                  See Available Brands
                </button>
              </div>
            </div>
          </section>

          {/* Features Grid Section */}
          <section className="px-4 py-16 max-w-[1280px] mx-auto">
            <div className="flex flex-col gap-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Why Choose Global Gifting?
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  We make international gifting seamless, secure, and instant.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 hover-glow">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-6 border border-white/5">
                    <span className="material-symbols-outlined text-purple-400 text-[32px]">
                      bolt
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    Instant Delivery
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Gifts are delivered directly to the recipient's email inbox
                    within seconds of purchase.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 hover-glow">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 border border-white/5">
                    <span className="material-symbols-outlined text-blue-400 text-[32px]">
                      public
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    Global Reach
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Access thousands of brands and retailers across 150+
                    countries. No borders, no limits.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 hover-glow">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-6 border border-white/5">
                    <span className="material-symbols-outlined text-green-400 text-[32px]">
                      verified_user
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    Secure Payments
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Built with enterprise-grade security. Your transactions are
                    safe and encrypted.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="px-4 py-20 bg-white/5">
            <div className="max-w-[1280px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  How It Works
                </h2>
                <p className="text-gray-400">
                  Three simple steps to send happiness.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10"></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center gap-6 group">
                  <div className="size-24 rounded-full bg-background-dark border-4 border-white/10 flex items-center justify-center z-10 group-hover:border-primary transition-colors duration-300">
                    <span className="text-4xl font-bold text-gray-500 group-hover:text-white transition-colors">
                      1
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Choose a Gift
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Select from our wide range of digital gift cards and
                      vouchers.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-6 group">
                  <div className="size-24 rounded-full bg-background-dark border-4 border-white/10 flex items-center justify-center z-10 group-hover:border-primary transition-colors duration-300">
                    <span className="text-4xl font-bold text-gray-500 group-hover:text-white transition-colors">
                      2
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Personalize
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Add a custom message and choose a delivery date.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-6 group">
                  <div className="size-24 rounded-full bg-background-dark border-4 border-white/10 flex items-center justify-center z-10 group-hover:border-primary transition-colors duration-300">
                    <span className="text-4xl font-bold text-gray-500 group-hover:text-white transition-colors">
                      3
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Send & Enjoy
                    </h3>
                    <p className="text-gray-400 text-sm">
                      We deliver the gift instantly via email. Smiles
                      guaranteed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 py-20 flex justify-center">
            <div className="max-w-4xl w-full text-center flex flex-col items-center gap-8 relative">
              {/* Abstract Background for CTA */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl -z-10 rounded-full"></div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                Ready to surprise someone special?
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl">
                Join thousands of users sharing joy across borders. No hidden
                fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                <button className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white text-lg font-bold transition-all shadow-lg shadow-primary/30 active:scale-95 min-w-[200px] cursor-pointer">
                  Start Gifting Now
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#0d0b12]">
          <div className="max-w-[1280px] mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Brand */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[14px]">
                      hive
                    </span>
                  </div>
                  <span className="text-white font-bold text-lg">Accthive</span>
                </div>
                <p className="text-gray-500 text-sm">
                  © 2024 Accthive Inc. All rights reserved.
                </p>
              </div>

              {/* Links */}
              <div className="flex flex-wrap justify-center gap-8">
                <Link
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
                <Link
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  href="/terms"
                >
                  Terms of Service
                </Link>
                <Link
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  href="/cookies"
                >
                  Cookie Policy
                </Link>
                <Link
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  href="/contact"
                >
                  Contact
                </Link>
              </div>

              {/* Socials */}
              <div className="flex gap-4">
                <a
                  className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    alternate_email
                  </span>
                </a>
                <a
                  className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    forum
                  </span>
                </a>
                <a
                  className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    rss_feed
                  </span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
