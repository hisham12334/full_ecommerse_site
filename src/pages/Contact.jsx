import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-charcoal text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Contact Us</h1>
          <p className="font-sans text-warm-grey text-lg">
            Get in touch with us. We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div>
            <h2 className="font-serif text-3xl text-charcoal mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="bg-charcoal p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-charcoal mb-2">Visit Our Store</h3>
                  <p className="font-sans text-warm-grey">
                    Qadr Fits Private Limited<br />
                    4th cross road, Hongasandra<br />
                    Bommanahalli, Bangalore<br />
                    India
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="bg-charcoal p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-charcoal mb-2">Email Us</h3>
                  <div className="font-sans text-warm-grey space-y-1">
                    <p>General: qadr.fits@gmail.com</p>
                    <p>Orders: qadr.fits@gmail.com</p>
                    <p>Support: qadr.fits@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start space-x-4">
                <div className="bg-charcoal p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-charcoal mb-2">Business Hours</h3>
                  <div className="font-sans text-warm-grey space-y-1">
                    <p>Monday - Friday: 10:00 AM - 7:00 PM</p>
                    <p>Saturday: 10:00 AM - 6:00 PM</p>
                    <p>Sunday: Closed</p>
                    <p className="text-sm mt-2">All times are in IST (Indian Standard Time)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-cool-white p-6 rounded-lg">
              <h3 className="font-serif text-xl text-charcoal mb-4">Business Information</h3>
              <div className="font-sans text-charcoal space-y-2 text-sm">
              
                <p><strong>Website:</strong> https://qadr.fits</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-3xl text-charcoal mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-sans text-sm font-medium text-charcoal mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-warm-grey/30 rounded-lg focus:ring-2 focus:ring-charcoal focus:border-transparent font-sans"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-sans text-sm font-medium text-charcoal mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-warm-grey/30 rounded-lg focus:ring-2 focus:ring-charcoal focus:border-transparent font-sans"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block font-sans text-sm font-medium text-charcoal mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-warm-grey/30 rounded-lg focus:ring-2 focus:ring-charcoal focus:border-transparent font-sans"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="product">Product Question</option>
                  <option value="return">Return/Exchange</option>
                  <option value="complaint">Complaint</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block font-sans text-sm font-medium text-charcoal mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-warm-grey/30 rounded-lg focus:ring-2 focus:ring-charcoal focus:border-transparent font-sans resize-vertical"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-charcoal text-white py-3 px-6 rounded-lg font-sans font-medium hover:bg-charcoal/90 transition-colors"
              >
                Send Message
              </button>
            </form>

            <div className="mt-8 p-4 bg-cool-white rounded-lg">
              <p className="font-sans text-sm text-charcoal">
                <strong>Response Time:</strong> We typically respond to all inquiries within 24 hours during business days. 
                For urgent matters, please call us directly at +91 98765 43210.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="font-serif text-3xl text-charcoal mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-cool-white p-6 rounded-lg">
              <h3 className="font-serif text-lg text-charcoal mb-3">How can I track my order?</h3>
              <p className="font-sans text-warm-grey text-sm">
                Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account dashboard.
              </p>
            </div>

            <div className="bg-cool-white p-6 rounded-lg">
              <h3 className="font-serif text-lg text-charcoal mb-3">What is your return policy?</h3>
              <p className="font-sans text-warm-grey text-sm">
                We offer a 7-day return policy for unused items in original packaging. Please see our Refund Policy page for complete details.
              </p>
            </div>

            <div className="bg-cool-white p-6 rounded-lg">
              <h3 className="font-serif text-lg text-charcoal mb-3">Do you ship internationally?</h3>
              <p className="font-sans text-warm-grey text-sm">
                Currently, we only ship within India. We're working on expanding our shipping to other countries soon.
              </p>
            </div>

            <div className="bg-cool-white p-6 rounded-lg">
              <h3 className="font-serif text-lg text-charcoal mb-3">How do I choose the right size?</h3>
              <p className="font-sans text-warm-grey text-sm">
                Please refer to our size guide available on each product page. If you're between sizes, we recommend sizing up for a comfortable fit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;