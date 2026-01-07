import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-charcoal text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Terms of Service</h1>
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
          
          {/* Agreement */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Agreement to Terms</h2>
            <p className="font-sans text-charcoal mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you 
              and Qadr Fits Private Limited ("Company," "we," "us," or "our") regarding your use 
              of our website qadr.fits and purchase of our products.
            </p>
            <p className="font-sans text-charcoal mb-4">
              By accessing or using our website, you agree to be bound by these Terms. If you 
              disagree with any part of these terms, you may not access our website or services.
            </p>
          </section>

          {/* Company Information */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Company Information</h2>
            <div className="bg-cool-white p-6 rounded-lg">
              <div className="space-y-2 font-sans text-charcoal">
                <p><strong>Qadr Fits Private Limited</strong></p>
                <p>CIN: U18101MH2024PTC123456</p>
                <p>GST: 27AABCQ1234F1Z5</p>
                <p>Address: 123 Fashion Street, Textile District, Mumbai, Maharashtra 400001, India</p>
                <p>Email: contact@qadr.fits</p>
                <p>Phone: +91 98765 43210</p>
              </div>
            </div>
          </section>

          {/* Products and Services */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Products and Services</h2>
            <p className="font-sans text-charcoal mb-4">
              We offer premium quality hoodies and apparel. All product descriptions, images, 
              and specifications are provided for informational purposes and may be subject 
              to change without notice.
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Product availability is subject to stock</li>
              <li>• Prices are in Indian Rupees (INR) and include applicable taxes</li>
              <li>• We reserve the right to modify prices without prior notice</li>
              <li>• Product colors may vary slightly due to monitor settings</li>
            </ul>
          </section>

          {/* Orders and Payment */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Orders and Payment</h2>
            <h3 className="font-serif text-xl text-charcoal mb-4">Order Process</h3>
            <ul className="font-sans text-charcoal mb-6 space-y-2">
              <li>• All orders are subject to acceptance and availability</li>
              <li>• We reserve the right to refuse or cancel orders</li>
              <li>• Order confirmation will be sent via email</li>
              <li>• Prices are confirmed at the time of order placement</li>
            </ul>

            <h3 className="font-serif text-xl text-charcoal mb-4">Payment Terms</h3>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Payment is required at the time of order</li>
              <li>• We accept payments through Razorpay (cards, UPI, net banking, wallets)</li>
              <li>• All payments are processed securely</li>
              <li>• Failed payments may result in order cancellation</li>
            </ul>
          </section>

          {/* Shipping and Delivery */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Shipping and Delivery</h2>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• We ship across India</li>
              <li>• Delivery timeframes are estimates and not guaranteed</li>
              <li>• Shipping costs are calculated at checkout</li>
              <li>• Risk of loss passes to you upon delivery</li>
              <li>• You must inspect products upon delivery</li>
            </ul>
          </section>

          {/* Returns and Refunds */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Returns and Refunds</h2>
            <h3 className="font-serif text-xl text-charcoal mb-4">Return Policy</h3>
            <ul className="font-sans text-charcoal mb-6 space-y-2">
              <li>• Returns accepted within 7 days of delivery</li>
              <li>• Products must be unused, unwashed, and in original packaging</li>
              <li>• Return shipping costs are borne by the customer unless product is defective</li>
              <li>• Refunds processed within 5-7 business days after return verification</li>
            </ul>

            <h3 className="font-serif text-xl text-charcoal mb-4">Non-Returnable Items</h3>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Items damaged by misuse or normal wear</li>
              <li>• Products returned after 7 days</li>
              <li>• Items without original tags or packaging</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">User Accounts</h2>
            <p className="font-sans text-charcoal mb-4">
              You may create an account to enhance your shopping experience. You are responsible for:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Maintaining the confidentiality of your account credentials</li>
              <li>• All activities that occur under your account</li>
              <li>• Providing accurate and current information</li>
              <li>• Notifying us of any unauthorized use</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Intellectual Property</h2>
            <p className="font-sans text-charcoal mb-4">
              All content on our website, including text, graphics, logos, images, and software, 
              is the property of Qadr Fits Private Limited and is protected by intellectual 
              property laws.
            </p>
            <p className="font-sans text-charcoal mb-4">
              You may not reproduce, distribute, modify, or create derivative works without 
              our express written permission.
            </p>
          </section>

          {/* Prohibited Uses */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Prohibited Uses</h2>
            <p className="font-sans text-charcoal mb-4">You may not use our website for:</p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Any unlawful purpose or to solicit unlawful acts</li>
              <li>• Violating any international, federal, provincial, or state regulations or laws</li>
              <li>• Transmitting or procuring malicious code</li>
              <li>• Interfering with or circumventing security features</li>
              <li>• Engaging in any automated use of the system</li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Disclaimers</h2>
            <p className="font-sans text-charcoal mb-4">
              Our website and products are provided "as is" without any representations or 
              warranties, express or implied. We do not warrant that:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• The website will be uninterrupted or error-free</li>
              <li>• Defects will be corrected</li>
              <li>• The website is free of viruses or harmful components</li>
              <li>• Results from use will be accurate or reliable</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Limitation of Liability</h2>
            <p className="font-sans text-charcoal mb-4">
              In no event shall Qadr Fits Private Limited be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including loss of 
              profits, data, or use, arising out of your use of our website or products.
            </p>
            <p className="font-sans text-charcoal mb-4">
              Our total liability shall not exceed the amount paid by you for the specific 
              product or service giving rise to the claim.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Governing Law</h2>
            <p className="font-sans text-charcoal mb-4">
              These Terms are governed by and construed in accordance with the laws of India. 
              Any disputes shall be subject to the exclusive jurisdiction of the courts in 
              Mumbai, Maharashtra.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Changes to Terms</h2>
            <p className="font-sans text-charcoal mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective 
              immediately upon posting on our website. Your continued use of the website 
              constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Contact Us</h2>
            <div className="bg-cool-white p-6 rounded-lg">
              <p className="font-sans text-charcoal mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="font-sans text-charcoal space-y-2">
                <p><strong>Email:</strong> legal@qadr.fits</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong><br />
                Qadr Fits Private Limited<br />
                123 Fashion Street, Textile District<br />
                Mumbai, Maharashtra 400001<br />
                India</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;