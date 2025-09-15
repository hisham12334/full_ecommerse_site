import React from "react";

import { motion } from "framer-motion";



export default function HMHome({ products = [], heroImageUrl, brandLogoUrl }) {

const topProducts = products.slice(0, 6);



return (

<div className="min-h-screen bg-white text-gray-900 antialiased">

{/* Nav, Hero, Products, Footer from user code */}

<header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">

<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

<div className="flex items-center justify-between h-16">

<div className="flex items-center gap-4">

<span className="font-medium text-lg tracking-wide">Brand</span>

</div>

<div className="hidden md:flex items-center gap-6">

<a className="text-sm font-medium hover:underline">Women</a>

<a className="text-sm font-medium hover:underline">Men</a>

<a className="text-sm font-medium hover:underline">New</a>

</div>

</div>

</div>

</header>



<main className="max-w-5xl mx-auto">

<section className="relative grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-1 gap-6">

<div className="relative overflow-hidden rounded-md mt-6">

<div className="aspect-[3/2] sm:aspect-[3/1] w-full bg-gray-50">

{heroImageUrl ? (

<img src={heroImageUrl} alt="hero" className="w-full h-full object-cover object-center" />

) : (

<div className="w-full h-full flex items-center justify-center text-gray-400">Hero image</div>

)}

</div>



<div className="absolute inset-0 flex flex-col justify-end pb-8 px-6 sm:pb-12">

<motion.h1

initial={{ opacity: 0, y: 24 }}

animate={{ opacity: 1, y: 0 }}

transition={{ duration: 0.6 }}

className="text-white text-4xl sm:text-6xl font-extrabold leading-tight drop-shadow-lg"

>

New Arrivals

</motion.h1>

</div>

</div>

</section>



<section className="mt-10">

<h2 className="text-2xl font-semibold mb-4">Featured Products</h2>

<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

{topProducts.map((p) => (

<div key={p.id} className="rounded-md bg-white border border-gray-100 shadow-sm overflow-hidden">

<img src={p.image} alt={p.title} className="w-full h-56 object-cover" />

<div className="p-3">

<div className="font-medium text-sm text-gray-800">{p.title}</div>

<div className="mt-1 text-xs text-gray-500">₹{p.price}</div>

</div>

</div>

))}

</div>

</section>

</main>

</div>

);

}