import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-warm-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl mb-4">Qadr.fits</h3>
            <p className="font-sans text-warm-grey mb-6 max-w-md">
              Premium quality hoodies crafted with attention to detail. 
              Destiny in every stitch, comfort in every wear.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-sans">
                <span className="font-medium">Address:</span><br />
                Qadr Fits Private Limited<br />
                Prabhavathi Meghana Towers F4, 4th Main Rd<br />
                Maruthi Layout, Hongasandra<br />
                Bengaluru, Karnataka 560068<br />
                Landmark: Near Dee sports<br />
                India
              </p>
              <p className="font-sans">
                <span className="font-medium">Email:</span> qadr.fits@gmail.com
              </p>
              <p className="font-sans">
                <span className="font-medium">Phone:</span> +91 98765 43210
              </p>
              <p className="font-sans">
                <span className="font-medium">GST:</span> 27AABCQ1234F1Z5
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="font-sans text-warm-grey hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="font-sans text-warm-grey hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="font-sans text-warm-grey hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="font-sans text-warm-grey hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="font-sans text-warm-grey hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warm-grey/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="font-sans text-sm text-warm-grey">
              © {new Date().getFullYear()} Qadr Fits Private Limited. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy-policy" className="font-sans text-warm-grey hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms-of-service" className="font-sans text-warm-grey hover:text-white transition-colors">
                Terms
              </Link>
              <span className="font-sans text-warm-grey">Made in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;