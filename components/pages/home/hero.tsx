'use client'
import {motion} from 'framer-motion'
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Sparkles, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f0fdf4] dark:bg-[#022c22] -z-20 rounded-bl-[100px] transition-colors duration-500" />
      <div className="absolute top-40 right-20 w-64 h-64 bg-[#cdfc4d] rounded-full blur-[120px] opacity-40 dark:opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#cdfc4d] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#022c22] dark:text-white">
              New: Tax Season 2024 Ready
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-[#022c22] dark:text-white leading-[1.1] tracking-tight mb-8">
            Tax questions, <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-[#022c22] dark:text-white italic">simplified.</span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-[#cdfc4d] -z-0 -rotate-2 opacity-80" />
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-lg leading-relaxed">
            Stop drowning in regulation PDFs. Chat with TanyaPajak to get instant, verified answers sourced directly from official tax documents.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" rightIcon={<ArrowRight size={16} />}>
              Start Asking
            </Button>
         
            
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-14 px-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#022c22] dark:text-white rounded-full font-semibold text-lg flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10"
            >
              View Demo
            </motion.button> */}
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-[#022c22] bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden`}>
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                 {[1,2,3,4,5].map(s => <Sparkles key={s} size={12} className="text-[#022c22] dark:text-[#cdfc4d] fill-current"/>)}
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Trusted by 2,000+ freelancers</p>
            </div>
          </div>
        </motion.div>

        {/* Hero Visual - Abstract Floating Cards */}
        <div className="relative h-[600px] w-full hidden lg:block">
            {/* Card 1: The Chat Interface */}
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, type: "spring" }}
                className="absolute top-10 left-10 w-80 bg-white dark:bg-[#0a3528] rounded-[2rem] p-6 shadow-2xl border border-gray-100 dark:border-white/5 z-20"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#cdfc4d] rounded-full flex items-center justify-center text-[#022c22]">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#022c22] dark:text-white">TanyaPajak AI</h3>
                        <p className="text-xs text-green-600 dark:text-[#cdfc4d]">● Online & Verified</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-2xl rounded-tl-none text-sm text-gray-600 dark:text-gray-300">
                        Is my chaotic commute to work deductible? 
                    </div>
                    <div className="bg-[#f0fdf4] dark:bg-[#cdfc4d]/10 border border-[#cdfc4d]/30 p-4 rounded-2xl rounded-tr-none text-sm text-[#022c22] dark:text-white">
                        <p className="mb-2">No, commuting is generally a personal expense.</p>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#166534] dark:text-[#cdfc4d]">
                            <FileText size={12} /> Source: PPh Article 21
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Card 2: The Stat */}
            <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 right-0 w-64 bg-[#022c22] text-white p-6 rounded-[2rem] shadow-xl z-30"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white/10 rounded-xl">
                        <TrendingUp size={24} className="text-[#cdfc4d]" />
                    </div>
                    <span className="text-[#cdfc4d] font-mono text-xs">+24%</span>
                </div>
                <div className="text-3xl font-bold mb-1">2.4s</div>
                <div className="text-sm text-gray-400">Avg. Response Time</div>
            </motion.div>

             {/* Card 3: The Image */}
             <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute bottom-10 left-20 w-72 h-48 rounded-[2rem] overflow-hidden shadow-2xl z-10"
             >
                <img 
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000" 
                    className="w-full h-full object-cover"
                    alt="Tax documents" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#022c22]/80 to-transparent flex items-end p-6">
                    <p className="text-white font-medium">Verified Docs</p>
                </div>
             </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection