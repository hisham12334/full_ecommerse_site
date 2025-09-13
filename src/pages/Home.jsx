import React from "react";
import { motion } from "framer-motion";

// H&M-style homepage React component
// TailwindCSS utility classes are used for styling.


export default function Home({ products = [], heroImageUrl, brandLogoUrl }) {
  const topProducts = products.slice(0, 6);


  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button className="p-2 md:hidden" aria-label="open menu">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-gray-700">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                {brandLogoUrl ? (
                  <img src={brandLogoUrl} alt="brand logo" className="h-7 w-auto object-contain" />
                ) : (
                  <span className="font-medium text-lg tracking-wide">Brand</span>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a className="text-sm font-medium hover:underline">Women</a>
              <a className="text-sm font-medium hover:underline">Men</a>
              <a className="text-sm font-medium hover:underline">New</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-md hover:bg-gray-100" aria-label="search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100" aria-label="account">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100" aria-label="bag">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2h12l1 5H5l1-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 7h12v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="w-full min-h-screen p-3">
        <section className="relative grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-1 gap-6">
          <div className="relative overflow-hidden rounded-md mt-6">
            <div className="aspect-[3/2] sm:aspect-[3/1] w-full bg-gray-50">
              {heroImageUrl ? (
                <img src={heroImageUrl} alt="hero" className="w-full h-full object-cover object-center" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Hero image</div>
              )}
            </div>

            {/* Overlay text */}
            <div className="absolute inset-0 flex flex-col justify-end pb-8 px-6 sm:pb-12">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-white text-4xl sm:text-6xl font-extrabold leading-tight drop-shadow-lg"
                style={{ textShadow: '0 6px 18px rgba(0,0,0,0.4)' }}
              >
                New Arrivals
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <a
                  href="#women"
                  className="inline-block bg-white/95 text-gray-900 px-6 py-3 rounded-sm font-semibold mr-3 shadow-sm hover:opacity-95"
                >
                  Shop Women
                </a>
                <a
                  href="#men"
                  className="inline-block bg-white/30 text-white px-6 py-3 rounded-sm font-semibold hover:opacity-95"
                >
                  Shop Men
                </a>
              </motion.div>
            </div>
          </div>

          {/* Secondary band */}
          <div className="mt-4 sm:mt-0">
            <div className="aspect-[3/1] w-full bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                <div className="max-w-2xl text-center p-6">
                  <p className="text-lg sm:text-xl font-medium text-gray-700">Free delivery on orders above ₹999</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promo tiles */}
        <section className="mt-8 grid grid-cols-2 gap-4 px-2 sm:px-0">
          <a className="block rounded-md border border-gray-100 p-6 bg-white shadow-sm hover:shadow-md">
            <h3 className="text-sm font-semibold text-gray-800">New here?</h3>
            <p className="mt-2 text-xs text-gray-500">Get 10% off your first order</p>
          </a>
          <a className="block rounded-md border border-gray-100 p-6 bg-white shadow-sm hover:shadow-md">
            <h3 className="text-sm font-semibold text-gray-800">Download our app</h3>
            <p className="mt-2 text-xs text-gray-500">For exclusive drops and offers</p>
          </a>
        </section>

        {/* Products Grid */}
        <section id="women" className="mt-10">
          <div className="flex items-center justify-between mb-4 px-2 sm:px-0">
            <h2 className="text-2xl font-semibold">Featured Products</h2>
            <a className="text-sm text-gray-600 hover:underline">View all</a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {topProducts.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-md bg-white border border-gray-100 shadow-sm overflow-hidden">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center">Image</div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            ) : (
              topProducts.map((p) => (
                <div key={p.id} className="rounded-md bg-white border border-gray-100 shadow-sm overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-56 object-cover" />
                  <div className="p-3">
                    <div className="font-medium text-sm text-gray-800">{p.title}</div>
                    <div className="mt-1 text-xs text-gray-500">₹{p.price}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-100 py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-600">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div>© {new Date().getFullYear()} Brand. All rights reserved.</div>
              <div className="flex gap-4">
                <a className="hover:underline">Contact</a>
                <a className="hover:underline">Careers</a>
                <a className="hover:underline">Privacy</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
