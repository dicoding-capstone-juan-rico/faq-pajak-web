'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Sun, Moon } from 'lucide-react';

interface AdminHeaderProps {
  setMobileMenuOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

export default function AdminHeader({ setMobileMenuOpen, darkMode, setDarkMode }: AdminHeaderProps) {
  const pathname = usePathname();
  
  // Tentukan judul berdasarkan URL saat ini
  const getPageTitle = () => {
    if (pathname.includes('/chat')) return 'Pusat Dukungan';
    return 'Ringkasan Kinerja';
  };

  return (
    <header className="flex-none bg-white/60 dark:bg-[#022c22]/60 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 -ml-2 text-[#022c22] dark:text-[#f0fdf4] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold text-[#022c22] dark:text-white capitalize">
          {getPageTitle()}
        </h2>
      </div>
      {/* ... (Tombol notifikasi dan dark mode tetap sama) */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button className="p-2 text-[#022c22] dark:text-[#f0fdf4] hover:bg-white dark:hover:bg-gray-800 rounded-full relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#cdfc4d] border-2 border-white dark:border-[#022c22] rounded-full"></span>
        </button>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-[#022c22] dark:text-[#f0fdf4] hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}