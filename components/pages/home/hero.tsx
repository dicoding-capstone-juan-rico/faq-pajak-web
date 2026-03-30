'use client'
import {motion} from 'framer-motion'
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Sparkles, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Elemen Latar Belakang Abstrak */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0fdf4] -z-20 rounded-bl-[100px] transition-colors duration-500" />
      <div className="absolute top-40 right-20 w-64 h-64 bg-[#cdfc4d] rounded-full blur-[120px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#cdfc4d] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#022c22]">
              Stop pusing, start chatting!
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-[#022c22] leading-[1.1] tracking-tight mb-8">
            Tanyapajak<br />
            <span className="relative inline-block">
              <span className="relative z-10 text-[#022c22] italic">jadi simpel.</span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-[#cdfc4d] -z-0 -rotate-2 opacity-80" />
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
            Jangan lagi pusing membaca tumpukan PDF regulasi. Chat dengan TanyaPajak untuk mendapatkan jawaban instan dari AI kami.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="gap-2">
              Mulai Bertanya <ArrowRight size={16} />
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden`}>
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                 {[1,2,3,4,5].map(s => <Sparkles key={s} size={12} className="text-[#022c22] fill-current"/>)}
              </div>
              <p className="text-sm font-medium text-gray-500">Dipercaya oleh 2.000+ Client</p>
            </div>
          </div>
        </motion.div>

        {/* Visual Hero - Kartu Melayang Abstrak */}
        <div className="relative h-[600px] w-full hidden lg:block">
            {/* Kartu 1: Antarmuka Chat */}
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, type: "spring" }}
                className="absolute top-10 left-10 w-80 bg-white rounded-[2rem] p-6 shadow-2xl border border-gray-100 z-20"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#cdfc4d] rounded-full flex items-center justify-center text-[#022c22]">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#022c22]">TanyaPajak AI</h3>
                        <p className="text-xs text-green-600">● Online</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none text-sm text-gray-600">
                        Apakah biaya transportasi ke kantor bisa jadi pengurang pajak?
                    </div>
                    <div className="bg-[#f0fdf4] border border-[#cdfc4d]/30 p-4 rounded-2xl rounded-tr-none text-sm text-[#022c22]">
                        <p className="mb-2">Tidak, biaya transportasi harian umumnya dianggap pengeluaran pribadi.</p>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#166534]">
                            <FileText size={12} /> Sumber: PPh Pasal 21
                        </div>
                    </div>
                </div>
            </motion.div>



             {/* Kartu 3: Gambar */}
             <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute top-1/2 right-0  w-72 h-48 rounded-[2rem] overflow-hidden shadow-2xl z-10"
             >
                <img 
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000" 
                    className="w-full h-full object-cover"
                    alt="Dokumen Pajak" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#022c22]/80 to-transparent flex items-end p-6">
                    <p className="text-white font-medium">Dokumen Terverifikasi</p>
                </div>
             </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;