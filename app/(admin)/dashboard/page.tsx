'use client'
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Paperclip, 
  Send, 
  Smile, 
  Clock, 
  MoreVertical, 
  Menu, 
  X, 
  ShieldCheck, 
  Sun, 
  Moon,
  CheckCircle2,
  ChevronLeft,
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  Bell,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// --- MOCK DATA ---
const STATS = [
  { id: 1, label: 'Tiket Aktif', value: '124', increase: '+12%', isPositive: false, icon: AlertCircle },
  { id: 2, label: 'Waktu Respon', value: '1.2m', increase: '-15%', isPositive: true, icon: Clock },
  { id: 3, label: 'Kepuasan (CSAT)', value: '4.8/5', increase: '+5%', isPositive: true, icon: Smile },
  { id: 4, label: 'Tiket Selesai', value: '1,842', increase: '+22%', isPositive: true, icon: ShieldCheck },
];

const RECENT_ACTIVITY = [
  { id: 1, user: 'Budi Santoso', action: 'Membuat tiket baru: Gagal Transfer', time: '5 menit lalu', status: 'pending' },
  { id: 2, user: 'Siti Aminah', action: 'Memberikan rating 5 bintang', time: '12 menit lalu', status: 'success' },
  { id: 3, user: 'Reza Rahadian', action: 'Membalas pesan agen', time: '20 menit lalu', status: 'pending' },
  { id: 4, user: 'Sistem', action: 'Otomatis menutup 15 tiket pasif', time: '1 jam lalu', status: 'info' },
];

const INITIAL_CHATS = [
  { id: 1, name: 'Budi Santoso', issue: 'Gagal Transfer Antarbank', lastMessage: 'Saldo saya terpotong tapi tujuan...', time: '10:42 AM', unread: 2, active: true, status: 'Menunggu Balasan' },
  { id: 2, name: 'Siti Aminah', issue: 'Verifikasi KTP', lastMessage: 'Berikut lampiran KTP saya pak.', time: '10:30 AM', unread: 0, active: false, status: 'Sedang Ditinjau' },
  { id: 3, name: 'Andi Wijaya', issue: 'Limit Akun', lastMessage: 'Terima kasih atas bantuannya.', time: 'Kemarin', unread: 0, active: false, status: 'Selesai' },
  { id: 4, name: 'Rina Marlina', issue: 'Lupa PIN', lastMessage: 'Saya sudah reset via email.', time: 'Selasa', unread: 0, active: false, status: 'Selesai' },
];

const INITIAL_MESSAGES = [
  { id: 1, sender: 'user', text: 'Halo min, saya baru saja melakukan transfer ke bank lain sebesar Rp 5.000.000.', time: '10:40 AM' },
  { id: 2, sender: 'user', text: 'Saldo saya sudah terpotong, tapi statusnya masih pending dan dana belum masuk ke penerima.', time: '10:42 AM' },
];

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'messages'
  const [activeTab, setActiveTab] = useState('Semua');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll ke pesan terbawah
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeView === 'messages') {
      scrollToBottom();
    }
  }, [messages, isTyping, activeView]);

  // Deteksi preferensi dark mode sistem
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!messageInput.trim()) return;

    // Tambah pesan agen (admin)
    const newAgentMsg = {
      id: Date.now(),
      sender: 'agent',
      text: messageInput,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isVerified: true, // Agen resmi
    };

    setMessages((prev) => [...prev, newAgentMsg]);
    setMessageInput('');
    setIsTyping(true);

    // Simulasi balasan dari pengguna setelah 3 detik
    setTimeout(() => {
      setIsTyping(false);
      const newUserMsg = {
        id: Date.now() + 1,
        sender: 'user',
        text: 'Baik, saya tunggu proses pengecekannya. Terima kasih ya.',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newUserMsg]);
    }, 3000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? 'dark' : ''}`}>
      {/* Background Dinamis */}
      <div className="fixed inset-0 bg-[#f0fdf4] dark:bg-[#01140e] transition-colors duration-500 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#cdfc4d]/20 dark:bg-[#cdfc4d]/5 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#022c22]/10 dark:bg-[#022c22]/40 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>

      <div className="relative z-10 h-screen w-full flex overflow-hidden">
        
        {/* SIDEBAR NAVIGASI ADMIN */}
        <aside className={`
          absolute lg:relative z-30 h-full w-64 bg-[#022c22] dark:bg-[#011a14] text-[#f0fdf4] flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
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

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <button 
              onClick={() => { setActiveView('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${activeView === 'dashboard' ? 'bg-[#cdfc4d] text-[#022c22] font-semibold shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => { setActiveView('messages'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${activeView === 'messages' ? 'bg-[#cdfc4d] text-[#022c22] font-semibold shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={20} />
                <span>Pesan</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeView === 'messages' ? 'bg-[#022c22] text-[#cdfc4d]' : 'bg-[#cdfc4d] text-[#022c22]'}`}>12</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
              <Users size={20} />
              <span>Pengguna</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
              <Settings size={20} />
              <span>Pengaturan</span>
            </button>
          </nav>

          <div className="p-4 mt-auto">
            <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#cdfc4d] to-white p-0.5">
                <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-full h-full object-cover rounded-full border-2 border-[#022c22]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Diana Admin</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#cdfc4d] animate-pulse"></span>
                  <span className="text-[10px] text-white/70">Online</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay untuk mobile sidebar */}
        {mobileMenuOpen && (
          <div className="absolute inset-0 bg-[#022c22]/50 backdrop-blur-sm z-20 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Top Header */}
          <header className="flex-none bg-white/60 dark:bg-[#022c22]/60 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 -ml-2 text-[#022c22] dark:text-[#f0fdf4] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-[#022c22] dark:text-white capitalize">
                {activeView === 'dashboard' ? 'Ringkasan Kinerja' : 'Pusat Dukungan'}
              </h2>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="p-2 text-[#022c22] dark:text-[#f0fdf4] hover:bg-white dark:hover:bg-gray-800 rounded-full relative transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#cdfc4d] border-2 border-white dark:border-[#022c22] rounded-full"></span>
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-[#022c22] dark:text-[#f0fdf4] hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </header>

          {/* VIEW RENDERER */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            
            {/* --- DASHBOARD VIEW --- */}
            {activeView === 'dashboard' && (
              <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {STATS.map((stat) => (
                    <div key={stat.id} className="bg-white/80 dark:bg-[#022c22]/50 backdrop-blur-xl p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-[#f0fdf4] dark:bg-[#01140e] text-[#022c22] dark:text-[#cdfc4d] rounded-2xl">
                          <stat.icon size={24} />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stat.isPositive ? 'text-[#022c22] bg-[#cdfc4d]/50' : 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400'}`}>
                          <TrendingUp size={12} className={!stat.isPositive ? 'rotate-180' : ''} />
                          {stat.increase}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-[#022c22] dark:text-white mb-1">{stat.value}</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Aktivitas Terbaru */}
                  <div className="lg:col-span-2 bg-white/80 dark:bg-[#022c22]/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-[#022c22] dark:text-white mb-6">Aktivitas Terbaru</h3>
                    <div className="space-y-4">
                      {RECENT_ACTIVITY.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-[#01140e]/50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                            ${activity.status === 'pending' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 
                              activity.status === 'success' ? 'bg-[#cdfc4d]/30 text-[#022c22] dark:text-[#cdfc4d]' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}
                          `}>
                            {activity.user.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-[#022c22] dark:text-gray-200">{activity.user}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.action}</p>
                          </div>
                          <span className="text-xs font-medium text-gray-400">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 py-3 text-sm font-semibold text-[#022c22] dark:text-[#cdfc4d] bg-gray-50 dark:bg-[#01140e]/50 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                      Lihat Semua Aktivitas
                    </button>
                  </div>

                  {/* Kinerja Agen (Placeholder) */}
                  <div className="bg-[#022c22] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-[#cdfc4d]/20 rounded-full blur-2xl"></div>
                    <h3 className="text-lg font-bold text-white mb-2 relative z-10">Target Kinerja Harian</h3>
                    <p className="text-white/70 text-sm mb-6 relative z-10">Anda hampir mencapai target penyelesaian tiket hari ini!</p>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-[#cdfc4d]">85%</span>
                        <span className="text-white/50">100 Tiket</span>
                      </div>
                      <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
                        <div className="h-full bg-[#cdfc4d] rounded-full w-[85%] relative">
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full mt-8 py-3 bg-[#cdfc4d] text-[#022c22] font-bold rounded-xl shadow-[0_0_20px_rgba(205,252,77,0.3)] hover:scale-[1.02] transition-transform">
                      Mulai Sesi Chat
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- MESSAGES VIEW --- */}
            {activeView === 'messages' && (
              <div className="h-full bg-white/60 dark:bg-[#022c22]/30 backdrop-blur-2xl rounded-[2.5rem] shadow-sm border border-white/50 dark:border-white/5 flex overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                
                {/* List Tiket (Kiri) */}
                <div className="w-full md:w-80 border-r border-gray-100 dark:border-white/5 flex flex-col bg-white/40 dark:bg-transparent">
                  <div className="p-4 border-b border-gray-100 dark:border-white/5">
                    <div className="relative mb-4">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Cari pengguna atau tiket..." 
                        className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#01140e] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#cdfc4d] shadow-sm dark:text-gray-200 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="flex gap-1 bg-gray-100 dark:bg-[#01140e]/50 p-1 rounded-xl">
                      {['Semua', 'Menunggu', 'Selesai'].map((tab) => (
                        <button 
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeTab === tab ? 'bg-white dark:bg-[#022c22] text-[#022c22] dark:text-[#cdfc4d] shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700">
                    {INITIAL_CHATS.map((chat) => (
                      <div key={chat.id} className={`p-3 rounded-2xl cursor-pointer transition-all flex flex-col gap-2 border border-transparent ${chat.active ? 'bg-white dark:bg-[#022c22] shadow-sm border-gray-100 dark:border-[#cdfc4d]/20' : 'hover:bg-white/50 dark:hover:bg-[#022c22]/50'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f0fdf4] to-emerald-100 dark:from-emerald-900 dark:to-[#01140e] flex items-center justify-center text-[#022c22] dark:text-[#cdfc4d] font-bold text-sm">
                                {chat.name.charAt(0)}
                              </div>
                              {chat.active && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#cdfc4d] rounded-full border-2 border-white dark:border-[#022c22]"></div>}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-[#022c22] dark:text-gray-100">{chat.name}</h3>
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{chat.issue}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-400">{chat.time}</span>
                        </div>
                        <div className="flex justify-between items-center pl-11">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate pr-2">{chat.lastMessage}</p>
                          {chat.unread > 0 && (
                            <div className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                              {chat.unread}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Area Chat Utama (Kanan) */}
                <div className="hidden md:flex flex-1 flex-col relative bg-transparent">
                  {/* Header Chat */}
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-white/40 dark:bg-transparent backdrop-blur-md flex justify-between items-center z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f0fdf4] to-emerald-100 dark:from-emerald-900 dark:to-[#01140e] flex items-center justify-center text-[#022c22] dark:text-[#cdfc4d] font-bold text-lg">
                        B
                      </div>
                      <div>
                        <h2 className="text-[#022c22] dark:text-white font-bold tracking-tight">Budi Santoso</h2>
                        <div className="flex items-center gap-2 text-xs mt-0.5">
                          <span className="text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">Menunggu Balasan</span>
                          <span className="text-gray-400 dark:text-gray-500">• ID Tiket: #89420</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 bg-[#f0fdf4] dark:bg-[#01140e] text-[#022c22] dark:text-[#cdfc4d] text-sm font-semibold rounded-xl hover:bg-[#cdfc4d] hover:text-[#022c22] transition-colors border border-transparent dark:border-[#cdfc4d]/20">
                        Selesaikan Tiket
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#022c22] dark:hover:text-white rounded-full">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Bubble Messages */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700">
                    <div className="flex justify-center mb-6">
                      <span className="text-xs font-semibold text-gray-400 bg-white dark:bg-[#01140e]/50 shadow-sm px-3 py-1 rounded-full border border-gray-100 dark:border-white/5">Hari ini</span>
                    </div>

                    {messages.map((msg) => {
                      // Di sisi admin, 'user' adalah pelanggan (kiri), 'agent' adalah admin sendiri (kanan)
                      const isAdmin = msg.sender === 'agent';
                      return (
                        <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                          <div className={`max-w-[75%] flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                            <div 
                              className={`px-5 py-3.5 text-sm sm:text-base shadow-sm
                                ${isAdmin 
                                  ? 'bg-[#022c22] text-[#f0fdf4] rounded-[1.5rem] rounded-tr-[0.25rem]' 
                                  : 'bg-white dark:bg-gray-800 text-[#022c22] dark:text-gray-200 rounded-[1.5rem] rounded-tl-[0.25rem] border border-gray-100 dark:border-white/5'
                                }
                              `}
                            >
                              <p className="leading-relaxed">{msg.text}</p>
                            </div>
                            <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                              <span className="text-[10px] font-medium text-gray-400">{msg.time}</span>
                              {isAdmin && <CheckCircle2 size={12} className="text-[#cdfc4d]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="flex justify-start animate-in fade-in">
                        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 rounded-[1.5rem] rounded-tl-[0.25rem] px-5 py-4 flex items-center gap-1.5 shadow-sm">
                          <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Chat Admin */}
                  <div className="p-4 bg-white/60 dark:bg-[#01140e]/80 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 relative z-10">
                    <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        {['Permintaan Dokumen', 'Template: Menunggu', 'Eskalasi Lanjutan'].map((chip) => (
                          <button type="button" key={chip} className="text-[10px] font-semibold text-[#022c22] dark:text-[#cdfc4d] bg-[#f0fdf4] dark:bg-[#cdfc4d]/10 px-2.5 py-1 rounded-full border border-[#cdfc4d]/30 hover:bg-[#cdfc4d] hover:text-[#022c22] transition-colors">
                            {chip}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-2 pl-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-[#cdfc4d]/50 transition-all">
                        <button type="button" className="text-gray-400 hover:text-[#022c22] dark:hover:text-[#cdfc4d]">
                          <Paperclip size={20} />
                        </button>
                        <input 
                          type="text" 
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Ketik balasan Anda (sebagai agen pendukung)..." 
                          className="flex-1 bg-transparent border-none focus:ring-0 text-[#022c22] dark:text-gray-100 text-sm py-2 px-2 placeholder:text-gray-400"
                        />
                        <button 
                          type="submit"
                          disabled={!messageInput.trim()}
                          className={`flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                            messageInput.trim() ? 'bg-[#cdfc4d] text-[#022c22] shadow-[0_4px_15px_-3px_rgba(205,252,77,0.4)] hover:scale-105' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Kirim Balasan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}