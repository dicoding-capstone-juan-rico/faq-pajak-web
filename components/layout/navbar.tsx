'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Menu, Sparkles, X } from 'lucide-react';
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-4 bg-white/80 dark:bg-[#051c14]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#cdfc4d] rounded-xl flex items-center justify-center text-[#022c22] transform rotate-3">
            <Sparkles size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#022c22] dark:text-white">
            TanyaPajak
          </span>
        </div>

        {/* Desktop Menu */}
        {/* <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Pricing', 'About'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#022c22] dark:hover:text-[#cdfc4d] transition-colors"
            >
              {item}
            </a>
          ))}
        </div> */}

        <div className="hidden md:flex items-center gap-4">
          {/* <button 
            // onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-[#cdfc4d] hover:scale-105 transition-transform"
          >
          Togle
          </button> */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-[#022c22] dark:bg-[#cdfc4d] text-white dark:text-[#022c22] text-sm font-semibold rounded-full flex items-center gap-2"
          >
            Get Started <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
             <button 
                // onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-[#cdfc4d]"
              >
                togle
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="text-[#022c22] dark:text-white" /> : <Menu className="text-[#022c22] dark:text-white" />}
            </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar