'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, X, LayoutDashboard, MessageSquare, Users, Settings } from 'lucide-react';

interface AdminSidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function AdminSidebar({ mobileMenuOpen, setMobileMenuOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside className={`
        absolute lg:relative z-30 h-full w-64 bg-[#022c22] dark:bg-[#011a14] text-[#f0fdf4] flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header Sidebar */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-[#cdfc4d] text-[#022c22] rounded-xl shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-tight text-white">Admin Hub</h1>
              <p className="text-[#cdfc4d] text-xs font-medium">Fintech Support</p>
            </div>
          </div>
          <button className="lg:hidden text-white hover:text-[#cdfc4d]" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigasi (MENGGUNAKAN LINK NEXT.JS) */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link 
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${pathname === '/admin' ? 'bg-[#cdfc4d] text-[#022c22] font-semibold shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            href="/admin/chat"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${pathname === '/admin/chat' ? 'bg-[#cdfc4d] text-[#022c22] font-semibold shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={20} />
              <span>Pesan</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pathname === '/admin/chat' ? 'bg-[#022c22] text-[#cdfc4d]' : 'bg-[#cdfc4d] text-[#022c22]'}`}>12</span>
          </Link>
          
          {/* Menu Lainnya */}
          <Link href="#" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
            <Users size={20} />
            <span>Pengguna</span>
          </Link>
        </nav>
      </aside>

      {/* Overlay Mobile */}
      {mobileMenuOpen && (
        <div className="absolute inset-0 bg-[#022c22]/50 backdrop-blur-sm z-20 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  );
}