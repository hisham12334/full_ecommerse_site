import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-charcoal text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Refund Policy</h1>
          <p className="font-sans text-warm-grey">
            Last updated: {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          
          {/* Company Information */}
          <section className="mb-12">
            <div className="bg-cool-white p-6 rounded-lg mb-6">
              <h3 className="font-serif text-xl text-charcoal mb-4">Qadr Fits Private Limited</h3>
              <div className="space-y-2 font-sans text-charcoal">
                <p>CIN: U18101MH2024PTC123456</p>
                <p>GST: 27AABCQ1234F1Z5</p>
                <p>Address: 123 Fashion Street, Textile District, Mumbai, Maharashtra 400001, India</p>
                <p>Email: refunds@qadr.fits | Phone: +91 98765 43210</p>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Refund Policy Overview</h2>
            <p className="font-sans text-charcoal mb-4">
              At Qadr Fits, we want you to be completely satisfied with your purchase. 
              This Refund Policy outlines the conditions under which refunds are processed 
              for products purchased from qadr.fits.
            </p>
            <p className="font-sans text-charcoal mb-4">
              We process all refunds in compliance with RBI guidelines and consumer protection laws in India.
            </p>
          </section>

          {/* Eligibility */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Refund Eligibility</h2>
            
            <h3 className="font-serif text-xl text-charcoal mb-4">Eligible for Refund</h3>
            <ul className="font-sans text-charcoal mb-6 space-y-2">
              <li>• Products returned within 7 days of delivery</li>
              <li>• Items in original, unused condition with all tags attached</li>
              <li>• Products in original packaging</li>
              <li>• Defective or damaged products (reported within 48 hours of delivery)</li>
              <li>• Wrong product delivered</li>
              <li>• Significant quality issues</li>
            </ul>

            <h3 className="font-serif text-xl text-charcoal mb-4">Not Eligible for Refund</h3>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Products returned after 7 days</li>
              <li>• Used, washed, or altered items</li>
              <li>• Items without original tags or packaging</li>
              <li>• Products damaged due to misuse</li>
              <li>• Change of mind after 7 days</li>
            </ul>
          </section>

          {/* Refund Process */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Refund Process</h2>
            
            <h3 className="font-serif text-xl text-charcoal mb-4">Step-by-Step Process</h3>
            <div className="space-y-4 font-sans text-charcoal">
              <div className="bg-cool-white p-4 rounded-lg">
                <p><strong>Step 1:</strong> Contact our customer service at refunds@qadr.fits or +91 98765 43210</p>
              </div>
              <div className="bg-cool-white p-4 rounded-lg">
                <p><strong>Step 2:</strong> Provide order number, reason for return, and photos (if applicable)</p>
              </div>
              <div className="bg-cool-white p-4 rounded-lg">
                <p><strong>Step 3:</strong> Receive return authorization and shipping instructions</p>
              </div>
              <div className="bg-cool-white p-4 rounded-lg">
                <p><strong>Step 4:</strong> Ship the product back to us (customer bears return shipping cost unless defective)</p>
              </div>
              <div className="bg-cool-white p-4 rounded-lg">
                <p><strong>Step 5:</strong> Quality check and verification (2-3 business days)</p>
              </div>
              <div className="bg-cool-white p-4 rounded-lg">
                <p><strong>Step 6:</strong> Refund processed to original payment method (5-7 business days)</p>
              </div>
            </div>
          </section>

          {/* Refund Timeline */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Refund Timeline</h2>
            <div className="bg-cool-white p-6 rounded-lg">
              <h3 className="font-serif text-lg text-charcoal mb-4">Processing Times</h3>
              <ul className="font-sans text-charcoal space-y-2">
                <li>• <strong>Return Authorization:</strong> Within 24 hours of request</li>
                <li>• <strong>Quality Check:</strong> 2-3 business days after receiving returned item</li>
                <li>• <strong>Refund Initiation:</strong> Within 1 business day of approval</li>
                <li>• <strong>Credit to Account:</strong> 5-7 business days (depends on bank/payment method)</li>
              </ul>
            </div>
          </section>

          {/* Refund Methods */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Refund Methods</h2>
            <p className="font-sans text-charcoal mb-4">
              Refunds are processed to the original payment method used for the purchase:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• <strong>Credit/Debit Cards:</strong> 5-7 business days</li>
              <li>• <strong>UPI:</strong> 1-3 business days</li>
              <li>• <strong>Net Banking:</strong> 3-5 business days</li>
              <li>• <strong>Digital Wallets:</strong> 1-3 business days</li>
            </ul>
            <p className="font-sans text-charcoal mt-4">
              <em>Note: Refund timelines may vary based on your bank's processing time.</em>
            </p>
          </section>

          {/* Partial Refunds */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Partial Refunds</h2>
            <p className="font-sans text-charcoal mb-4">
              Partial refunds may be issued in the following cases:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Products returned with minor damage not reported at delivery</li>
              <li>• Items missing original packaging (but otherwise eligible)</li>
              <li>• Products returned after quality check reveals wear beyond normal handling</li>
            </ul>
          </section>

          {/* Shipping Costs */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Shipping Costs</h2>
            <div className="bg-cool-white p-6 rounded-lg">
              <h3 className="font-serif text-lg text-charcoal mb-4">Return Shipping Policy</h3>
              <ul className="font-sans text-charcoal space-y-2">
                <li>• <strong>Defective/Wrong Product:</strong> We cover return shipping costs</li>
                <li>• <strong>Change of Mind:</strong> Customer bears return shipping costs</li>
                <li>• <strong>Original Shipping:</strong> Non-refundable (unless defective product)</li>
              </ul>
            </div>
          </section>

          {/* Exchanges */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Exchanges</h2>
            <p className="font-sans text-charcoal mb-4">
              We currently process exchanges as returns followed by new orders:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Return the original product following our return process</li>
              <li>• Place a new order for the desired item</li>
              <li>• Refund will be processed for the returned item</li>
              <li>• New order will be charged separately</li>
            </ul>
          </section>

          {/* Cancellations */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Order Cancellations</h2>
            <div className="bg-cool-white p-6 rounded-lg">
              <h3 className="font-serif text-lg text-charcoal mb-4">Cancellation Policy</h3>
              <ul className="font-sans text-charcoal space-y-2">
                <li>• <strong>Before Shipping:</strong> Full refund within 24 hours</li>
                <li>• <strong>After Shipping:</strong> Follow return process</li>
                <li>• <strong>Cancellation Window:</strong> Within 2 hours of order placement</li>
              </ul>
            </div>
          </section>

          {/* Damaged Products */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Damaged or Defective Products</h2>
            <p className="font-sans text-charcoal mb-4">
              If you receive a damaged or defective product:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Report within 48 hours of delivery</li>
              <li>• Provide photos of the damage/defect</li>
              <li>• We will arrange pickup at no cost to you</li>
              <li>• Full refund or replacement (your choice)</li>
              <li>• Expedited processing (2-3 business days)</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Contact for Refunds</h2>
            <div className="bg-cool-white p-6 rounded-lg">
              <p className="font-sans text-charcoal mb-4">
                For refund requests and queries, contact us:
              </p>
              <div className="font-sans text-charcoal space-y-2">
                <p><strong>Refund Department:</strong> refunds@qadr.fits</p>
                <p><strong>Customer Service:</strong> +91 98765 43210</p>
                <p><strong>WhatsApp:</strong> +91 98765 43210</p>
                <p><strong>Business Hours:</strong> Monday to Saturday, 10 AM to 6 PM IST</p>
                <p><strong>Address:</strong><br />
                Qadr Fits Private Limited<br />
                123 Fashion Street, Textile District<br />
                Mumbai, Maharashtra 400001<br />
                India</p>
              </div>
            </div>
          </section>

          {/* Legal Compliance */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Legal Compliance</h2>
            <p className="font-sans text-charcoal mb-4">
              This refund policy complies with:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Consumer Protection Act, 2019</li>
              <li>• RBI Guidelines for Payment System Operators</li>
              <li>• E-commerce Rules under Consumer Protection Act</li>
              <li>• Information Technology Act, 2000</li>
            </ul>
          </section>

          {/* Policy Updates */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Policy Updates</h2>
            <p className="font-sans text-charcoal mb-4">
              We may update this Refund Policy from time to time. Any changes will be 
              posted on this page with an updated "Last updated" date. Continued use 
              of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;