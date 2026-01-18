import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-charcoal text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Privacy Policy</h1>
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
            <h2 className="font-serif text-3xl text-charcoal mb-6">Company Information</h2>
            <div className="bg-cool-white p-6 rounded-lg mb-6">
              <h3 className="font-serif text-xl text-charcoal mb-4">Qadr Fits Private Limited</h3>
              <div className="space-y-2 font-sans text-charcoal">
                <p><strong>Registered Address:</strong><br />
                4th cross road, Hongasandra<br />
                Bommanahalli, Bangalore<br />
                India</p>
                
                <p><strong>Corporate Identification Number (CIN):</strong> U18101MH2024PTC123456</p>
                <p><strong>Email:</strong> qadr.fits@gmail.com</p>
                <p><strong>Website:</strong> https://qadr.fits</p>
              </div>
            </div>
          </section>

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Introduction</h2>
            <p className="font-sans text-charcoal mb-4">
              Qadr Fits Private Limited ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website qadr.fits and make purchases from us.
            </p>
            <p className="font-sans text-charcoal mb-4">
              We are a legitimate business entity registered in India, specializing in premium quality 
              hoodies and apparel. This policy complies with the Information Technology Act, 2000, 
              and the Personal Data Protection Bill guidelines.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Information We Collect</h2>
            
            <h3 className="font-serif text-xl text-charcoal mb-4">Personal Information</h3>
            <ul className="font-sans text-charcoal mb-6 space-y-2">
              <li>• Name and contact information (email, phone number)</li>
              <li>• Billing and shipping addresses</li>
              <li>• Payment information (processed securely through Razorpay)</li>
              <li>• Order history and preferences</li>
              <li>• Account credentials (username, password)</li>
            </ul>

            <h3 className="font-serif text-xl text-charcoal mb-4">Automatically Collected Information</h3>
            <ul className="font-sans text-charcoal mb-6 space-y-2">
              <li>• IP address and browser information</li>
              <li>• Device information and operating system</li>
              <li>• Website usage patterns and analytics</li>
              <li>• Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">How We Use Your Information</h2>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Process and fulfill your orders</li>
              <li>• Communicate about your purchases and account</li>
              <li>• Provide customer support and respond to inquiries</li>
              <li>• Send promotional materials (with your consent)</li>
              <li>• Improve our website and services</li>
              <li>• Comply with legal obligations and prevent fraud</li>
              <li>• Process payments securely through our payment partners</li>
            </ul>
          </section>

          {/* Payment Processing */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Payment Processing & Security</h2>
            <p className="font-sans text-charcoal mb-4">
              We use Razorpay (Razorpay Software Private Limited) as our primary payment processor. 
              Razorpay is a PCI DSS compliant payment gateway that ensures secure processing of 
              your payment information.
            </p>
            <p className="font-sans text-charcoal mb-4">
              We do not store your complete credit card information on our servers. All payment 
              data is encrypted and processed through Razorpay's secure infrastructure.
            </p>
            <div className="bg-cool-white p-6 rounded-lg">
              <h4 className="font-serif text-lg text-charcoal mb-3">Payment Partner Details:</h4>
              <p className="font-sans text-charcoal">
                <strong>Razorpay Software Private Limited</strong><br />
                CIN: U72200KA2013PTC097389<br />
                Registered Address: SJR Cyber, Laskar Hosur Road, Adugodi, Bengaluru, Karnataka 560030
              </p>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Information Sharing</h2>
            <p className="font-sans text-charcoal mb-4">
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your information only in the following circumstances:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• With payment processors (Razorpay) to complete transactions</li>
              <li>• With shipping partners to deliver your orders</li>
              <li>• With service providers who assist in website operations</li>
              <li>• When required by law or to protect our legal rights</li>
              <li>• In case of business transfer or merger (with prior notice)</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Data Security</h2>
            <p className="font-sans text-charcoal mb-4">
              We implement appropriate technical and organizational security measures to protect 
              your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• SSL encryption for data transmission</li>
              <li>• Secure servers and databases</li>
              <li>• Regular security audits and updates</li>
              <li>• Limited access to personal information</li>
              <li>• Employee training on data protection</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Your Rights</h2>
            <p className="font-sans text-charcoal mb-4">You have the right to:</p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Access your personal information we hold</li>
              <li>• Correct inaccurate or incomplete information</li>
              <li>• Request deletion of your personal information</li>
              <li>• Opt-out of marketing communications</li>
              <li>• Data portability (receive your data in a structured format)</li>
              <li>• Lodge a complaint with relevant authorities</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Cookies and Tracking</h2>
            <p className="font-sans text-charcoal mb-4">
              We use cookies and similar technologies to enhance your browsing experience, 
              analyze website traffic, and personalize content. You can control cookie 
              preferences through your browser settings.
            </p>
          </section>

          {/* International Transfers */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">International Data Transfers</h2>
            <p className="font-sans text-charcoal mb-4">
              Your information is primarily processed and stored in India. If we transfer 
              data internationally, we ensure appropriate safeguards are in place to 
              protect your information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Children's Privacy</h2>
            <p className="font-sans text-charcoal mb-4">
              Our services are not intended for children under 18 years of age. We do not 
              knowingly collect personal information from children under 18.
            </p>
          </section>

          {/* Updates */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Policy Updates</h2>
            <p className="font-sans text-charcoal mb-4">
              We may update this Privacy Policy periodically. We will notify you of any 
              material changes by posting the new policy on our website and updating the 
              "Last updated" date.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Contact Us</h2>
            <div className="bg-cool-white p-6 rounded-lg">
              <p className="font-sans text-charcoal mb-4">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="font-sans text-charcoal space-y-2">
                <p><strong>Data Protection Officer:</strong> qadr.fits@gmail.com</p>
                <p><strong>General Inquiries:</strong> qadr.fits@gmail.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong><br />
                Qadr Fits Private Limited<br />
                Prabhavathi Meghana Towers F4, 4th Main Rd<br />
                Maruthi Layout, Hongasandra<br />
                Bengaluru, Karnataka 560068<br />
                Landmark: Near Dee sports<br />
                India</p>
              </div>
            </div>
          </section>

          {/* Compliance */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-charcoal mb-6">Regulatory Compliance</h2>
            <p className="font-sans text-charcoal mb-4">
              This Privacy Policy complies with:
            </p>
            <ul className="font-sans text-charcoal space-y-2">
              <li>• Information Technology Act, 2000 (India)</li>
              <li>• Information Technology (Reasonable Security Practices) Rules, 2011</li>
              <li>• Personal Data Protection Bill (Draft)</li>
              <li>• RBI Guidelines for Payment System Operators</li>
              <li>• Consumer Protection Act, 2019</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;