import React from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  const exploreLinks = [
    { label: 'Home', href: '#' },
    { label: 'Destinations', href: '#' },
    { label: 'Tours', href: '#' },
    { label: 'Activities', href: '#' },
  ];

  const companyLinks = [
    { label: 'About Us', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
  ];

  const supportLinks = [
    { label: 'Help Center', href: '#' },
    { label: 'Safety', href: '#' },
    { label: 'Cancellation', href: '#' },
    // { label: 'COVID-19', href: '#' },
  ];

  const legalLinks = [
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'Youtube' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-52 h-20">
                <Image
                  src="/zenithtravel.png"
                  alt="Zenith Travel"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-sm">
              Discover amazing places and experiences around the world with our expertly curated travel guides and tours.
            </p>
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Subscribe to our newsletter</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-bold mb-4">Explore</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-600 hover:text-black">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-600 hover:text-black">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-600 hover:text-black">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-500 hover:text-black transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                  <a href={link.href} className="hover:text-black">
                    {link.label}
                  </a>
                  {index < legalLinks.length - 1 && 
                    <span className="text-gray-300">|</span>
                  }
                </React.Fragment>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Zenith Travel. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;