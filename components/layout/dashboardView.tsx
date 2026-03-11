'use client'
import React from 'react';
import { AlertCircle, Clock, Smile, ShieldCheck, TrendingUp } from 'lucide-react';

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

export default function DashboardView() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
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

        {/* Kinerja Agen */}
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
  );
}