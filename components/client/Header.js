import React, { useState } from 'react';
import Image from 'next/image';
import { Menu, Globe, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const navItems = [
    { label: 'Discover', href: '#' },
    { label: 'Trips', href: '#' },
    { label: 'Review', href: '#' },
    { label: 'More', href: '#' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sq', name: 'Albanian' },
    { code: 'es', name: 'Spanish' },
    { code: 'pl', name: 'Polish' }
  ];

  return (
    <header className=" top-0 left-0 right-0 bg-white mt-4  z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-1">
              <div className="relative w-52 h-52">
                <Image
                  src="/zenithtravel.png"
                  alt="Zenith Travel"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-600 hover:text-black font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button 
                className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <Globe className="w-5 h-5" />
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown */}
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsLanguageOpen(false)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="p-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="relative w-40 h-40">
                  <Image
                    src="/zenithtravel.png"
                    alt="Zenith Travel"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-lg font-medium text-gray-900"
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500 mb-2">Select Language</div>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Click outside to close language dropdown */}
      {isLanguageOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsLanguageOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;