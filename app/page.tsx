import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background-dark font-display text-white overflow-x-hidden selection:bg-primary selection:text-white min-h-screen">
      {/* Decorative Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px] pointer-events-none z-0"></div>

      {/* Layout Container */}
      <div className="relative flex min-h-screen w-full flex-col z-10">
        {/* Top Navigation */}
        <header className="glass-nav fixed top-0 w-full z-50 transition-all duration-300">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-[20px]">
                    hive
                  </span>
                </div>
                <h2 className="text-white text-xl font-bold tracking-tight">
                  Accthive
                </h2>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <a
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  href="#"
                >
                  Services
                </a>
                <a
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  href="#"
                >
                  Pricing
                </a>
                <a
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  href="#"
                >
                  API
                </a>
                <a
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                  href="#"
                >
                  Support
                </a>
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
                <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
                <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">
                  Now Live: API v2.0
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                All-in-One <br className="hidden md:block" />
                <span className="text-gradient">Digital Service Platform</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                Elevate your digital presence with premium social boosting,
                verified accounts, instant SMS verification, and global gifting
                solutions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-background-dark font-bold text-base hover:bg-gray-100 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                  <span>Get Started Now</span>
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </button>
                <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-white/5 border border-white/10 text-white font-bold text-base hover:bg-white/10 transition-all backdrop-blur-sm active:scale-95 cursor-pointer">
                  View Documentation
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-12 flex flex-col items-center gap-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                  Trusted by 10,000+ Agencies
                </p>
                <div className="flex gap-8 opacity-40 grayscale">
                  {/* Simple circles as placeholders for logos to keep it abstract and clean */}
                  <div className="h-8 w-20 bg-white/20 rounded"></div>
                  <div className="h-8 w-20 bg-white/20 rounded"></div>
                  <div className="h-8 w-20 bg-white/20 rounded"></div>
                  <div className="h-8 w-20 bg-white/20 rounded hidden sm:block"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid Section */}
          <section className="px-4 py-16 max-w-[1280px] mx-auto">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Our Core Services
                  </h2>
                  <p className="text-gray-400">
                    Everything you need to scale your operations.
                  </p>
                </div>
                <a
                  className="text-primary hover:text-secondary font-medium flex items-center gap-1 transition-colors"
                  href="#"
                >
                  Explore all features
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_outward
                  </span>
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Feature 1: Social Boost */}
                <div className="glass-card rounded-3xl p-6 group hover:-translate-y-2 transition-all duration-300 hover-glow cursor-pointer">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                    <span className="material-symbols-outlined text-pink-400 text-[32px]">
                      rocket_launch
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    Social Boost
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Amplify your reach instantly with our automated engagement
                    tools designed for organic growth.
                  </p>
                </div>

                {/* Feature 2: Social Accounts */}
                <div className="glass-card rounded-3xl p-6 group hover:-translate-y-2 transition-all duration-300 hover-glow cursor-pointer">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                    <span className="material-symbols-outlined text-blue-400 text-[32px]">
                      manage_accounts
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    Social Accounts
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Access a marketplace of premium, aged, and verified accounts
                    across all major platforms.
                  </p>
                </div>

                {/* Feature 3: SMS Verification */}
                <div className="glass-card rounded-3xl p-6 group hover:-translate-y-2 transition-all duration-300 hover-glow cursor-pointer">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                    <span className="material-symbols-outlined text-green-400 text-[32px]">
                      sms
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    SMS Verification
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Bypass OTP verifications instantly with our private pool of
                    real non-VoIP SIM numbers.
                  </p>
                </div>

                {/* Feature 4: Global Gifting */}
                <Link
                  href="/global-gifting"
                  className="glass-card rounded-3xl p-6 group hover:-translate-y-2 transition-all duration-300 hover-glow cursor-pointer block"
                >
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                    <span className="material-symbols-outlined text-purple-400 text-[32px]">
                      card_giftcard
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    Global Gifting
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Send digital gifts, vouchers, and rewards worldwide with
                    instant delivery via email.
                  </p>
                </Link>
              </div>
            </div>
          </section>

          {/* Stats/Metrics Section (Optional Visual Breaker) */}
          <section className="py-20 px-4">
            <div className="max-w-[1280px] mx-auto glass-card rounded-3xl p-10 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                <div className="text-center md:text-left">
                  <h3 className="text-4xl font-black text-white mb-1">99.9%</h3>
                  <p className="text-gray-400 text-sm">Uptime SLA</p>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-4xl font-black text-white mb-1">5M+</h3>
                  <p className="text-gray-400 text-sm">Orders Processed</p>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-4xl font-black text-white mb-1">24/7</h3>
                  <p className="text-gray-400 text-sm">Live Support</p>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-4xl font-black text-white mb-1">150+</h3>
                  <p className="text-gray-400 text-sm">Countries Supported</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 py-20 flex justify-center">
            <div className="max-w-4xl w-full text-center flex flex-col items-center gap-6 relative">
              {/* Abstract Background for CTA */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-3xl -z-10 rounded-full"></div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                Ready to elevate your <br /> digital presence?
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl">
                Join thousands of marketers, developers, and businesses scaling
                with Accthive today. No credit card required for signup.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
                <button className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white text-lg font-bold transition-all shadow-lg shadow-primary/30 active:scale-95 min-w-[200px] cursor-pointer">
                  Get Started Free
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
                <a
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  href="#"
                >
                  Privacy Policy
                </a>
                <a
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  href="#"
                >
                  Terms of Service
                </a>
                <a
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  href="#"
                >
                  Cookie Policy
                </a>
                <a
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  href="#"
                >
                  Contact
                </a>
              </div>

              {/* Socials */}
              <div className="flex gap-4">
                <a
                  className="size-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                  href="#"
                >
                  <i className="fa-brands fa-twitter"></i>
                  {/* Using material symbols as requested */}
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
