import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-charcoal text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Shipping Policy</h1>
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
                <p>Email: shipping@qadr.fits | Phone: +91 98765 43210</p>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Shipping Overview</h2>
            <p className="font-sans text-charcoal mb-4">
              At Qadr Fits, we are committed to delivering your premium hoodies safely and efficiently 
              across India. This Shipping Policy outlines our delivery process, timelines, and costs.
            </p>
            <p className="font-sans text-charcoal mb-4">
              We partner with reliable courier services to ensure your orders reach you in perfect condition.
            </p>
          </section>

          {/* Shipping Areas */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Shipping Coverage</h2>
            
            <h3 className="font-serif text-xl text-charcoal mb-4">Domestic Shipping (India)</h3>
            <p className="font-sans text-charcoal mb-4">
              We currently ship to all states and union territories within India, including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-cool-white p-4 rounded-lg">
                <h4 className="font-serif text-lg text-charcoal mb-2">Metro Cities</h4>
                <ul className="font-sans text-charcoal text-sm space-y-1">
                  <li>• Mumbai, Delhi, Bangalore, Chennai</li>
                  <li>• Kolkata, Hyderabad, Pune, Ahmedabad</li>
                  <li>• Delivery: 2-4 business days</li>
                </ul>
              </div>
              <div className="bg-cool-white p-4 rounded-lg">
                <h4 className="font-serif text-lg text-charcoal mb-2">Other Cities & Towns</h4>
                <ul className="font-sans text-charcoal text-sm space-y-1">
                  <li>• All tier 2 and tier 3 cities</li>
                  <li>• Remote areas (subject to courier availability)</li>
                  <li>• Delivery: 4-7 business days</li>
                </ul>
              </div>
            </div>

            <h3 className="font-serif text-xl text-charcoal mb-4">International Shipping</h3>
            <p className="font-sans text-charcoal mb-4">
              Currently, we do not offer international shipping. We are working on expanding our 
              services to international markets. Please check back for updates.
            </p>
          </section>

          {/* Shipping Costs */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Shipping Costs</h2>
            
            <div className="bg-cool-white p-6 rounded-lg mb-6">
              <h3 className="font-serif text-lg text-charcoal mb-4">Standard Shipping Rates</h3>
              <div className="space-y-3 font-sans text-charcoal">
                <div className="flex justify-between items-center border-b border-warm-grey/20 pb-2">
                  <span>Orders below ₹999</span>
                  <span className="font-medium">₹99</span>
                </div>
                <div className="flex justify-between items-center border-b border-warm-grey/20 pb-2">
                  <span>Orders ₹999 - ₹1,999</span>
                  <span className="font-medium">₹49</span>
                </div>
                <div className="flex justify-between items-center border-b border-warm-grey/20 pb-2">
                  <span>Orders above ₹2,000</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
              </div>
            </div>

            <h3 className="font-serif text-xl text-charcoal mb-4">Express Shipping</h3>
            <p className="font-sans text-charcoal mb-4">
              Express shipping available for metro cities (1-2 business days):
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Express shipping cost: ₹199 (regardless of order value)</li>
              <li>• Available only for orders placed before 2 PM</li>
              <li>• Subject to product availability</li>
            </ul>
          </section>

          {/* Processing Time */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Order Processing</h2>
            
            <h3 className="font-serif text-xl text-charcoal mb-4">Processing Timeline</h3>
            <div className="space-y-4 font-sans text-charcoal">
              <div className="bg-cool-white p-4 rounded-lg">
                <p><strong>Order Confirmation:</strong> Within 2 hours of payment</p>
              </div>
              <div className="bg-cool-white p-4 rounded-lg">
                <p><strong>Processing Time:</strong> 1-2 business days</p>
              </div>
              <div className="bg-cool-white p-4 rounded-lg">
                <p><strong>Dispatch Notification:</strong> Email with tracking details</p>
              </div>
            </div>

            <h3 className="font-serif text-xl text-charcoal mb-4 mt-8">Business Days</h3>
            <p className="font-sans text-charcoal mb-4">
              Business days are Monday through Saturday, excluding national holidays and Sundays. 
              Orders placed on weekends or holidays will be processed on the next business day.
            </p>
          </section>

          {/* Delivery Information */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Delivery Information</h2>
            
            <h3 className="font-serif text-xl text-charcoal mb-4">Delivery Process</h3>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Delivery attempts made during business hours (10 AM - 6 PM)</li>
              <li>• SMS and call notifications before delivery</li>
              <li>• Signature required for delivery confirmation</li>
              <li>• Photo proof of delivery for contactless delivery</li>
              <li>• Maximum 3 delivery attempts</li>
            </ul>

            <h3 className="font-serif text-xl text-charcoal mb-4 mt-8">Address Requirements</h3>
            <p className="font-sans text-charcoal mb-4">
              Please ensure your delivery address includes:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Complete name of recipient</li>
              <li>• Full address with landmark</li>
              <li>• PIN code</li>
              <li>• Contact number (mobile preferred)</li>
              <li>• Alternative contact number (recommended)</li>
            </ul>
          </section>

          {/* Tracking */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Order Tracking</h2>
            
            <div className="bg-cool-white p-6 rounded-lg">
              <h3 className="font-serif text-lg text-charcoal mb-4">How to Track Your Order</h3>
              <ol className="font-sans text-charcoal space-y-2">
                <li>1. Check your email for dispatch notification with tracking number</li>
                <li>2. Visit your account dashboard on qadr.fits</li>
                <li>3. Use the tracking number on our courier partner's website</li>
                <li>4. Contact customer service for tracking assistance</li>
              </ol>
            </div>

            <h3 className="font-serif text-xl text-charcoal mb-4 mt-8">Tracking Updates</h3>
            <p className="font-sans text-charcoal mb-4">
              You will receive updates at key milestones:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Order confirmed and being prepared</li>
              <li>• Order dispatched from warehouse</li>
              <li>• Out for delivery</li>
              <li>• Delivered successfully</li>
            </ul>
          </section>

          {/* Special Circumstances */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Special Circumstances</h2>
            
            <h3 className="font-serif text-xl text-charcoal mb-4">Delivery Delays</h3>
            <p className="font-sans text-charcoal mb-4">
              Delays may occur due to:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Weather conditions or natural disasters</li>
              <li>• Political situations or strikes</li>
              <li>• Festival seasons (high volume)</li>
              <li>• Remote location accessibility</li>
              <li>• Incorrect or incomplete address</li>
            </ul>

            <h3 className="font-serif text-xl text-charcoal mb-4 mt-8">Undelivered Packages</h3>
            <p className="font-sans text-charcoal mb-4">
              If delivery fails after 3 attempts:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Package returned to our warehouse</li>
              <li>• Customer notified via email/SMS</li>
              <li>• Reshipment possible with additional charges</li>
              <li>• Refund processed if reshipment declined</li>
            </ul>
          </section>

          {/* Packaging */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Packaging Standards</h2>
            <p className="font-sans text-charcoal mb-4">
              We take great care in packaging your premium hoodies:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Eco-friendly packaging materials</li>
              <li>• Protective wrapping to prevent damage</li>
              <li>• Branded packaging for premium experience</li>
              <li>• Tamper-evident sealing</li>
              <li>• Care instructions included</li>
            </ul>
          </section>

          {/* Contact for Shipping */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Shipping Support</h2>
            <div className="bg-cool-white p-6 rounded-lg">
              <p className="font-sans text-charcoal mb-4">
                For shipping-related queries, contact us:
              </p>
              <div className="font-sans text-charcoal space-y-2">
                <p><strong>Shipping Department:</strong> shipping@qadr.fits</p>
                <p><strong>Customer Service:</strong> +91 98765 43210</p>
                <p><strong>WhatsApp:</strong> +91 98765 43210</p>
                <p><strong>Business Hours:</strong> Monday to Saturday, 10 AM to 6 PM IST</p>
              </div>
            </div>
          </section>

          {/* Policy Updates */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Policy Updates</h2>
            <p className="font-sans text-charcoal mb-4">
              We may update this Shipping Policy from time to time to reflect changes in our 
              services or legal requirements. Any changes will be posted on this page with 
              an updated "Last updated" date.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;