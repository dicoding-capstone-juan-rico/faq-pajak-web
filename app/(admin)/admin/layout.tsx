'use client'
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/layout/adminSidebar';
import AdminHeader from '@/components/layout/adminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       setDarkMode(true);
//     }
//   }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? 'dark' : ''}`}>
      {/* Background Dinamis */}
      <div className="fixed inset-0 bg-[#f0fdf4] dark:bg-[#01140e] transition-colors duration-500 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#cdfc4d]/20 dark:bg-[#cdfc4d]/5 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#022c22]/10 dark:bg-[#022c22]/40 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>

      <div className="relative z-10 h-screen w-full flex overflow-hidden">
        <AdminSidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <AdminHeader setMobileMenuOpen={setMobileMenuOpen} darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* Di sinilah Next.js akan menyuntikkan halaman (Dashboard/Chat) berdasarkan URL */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}