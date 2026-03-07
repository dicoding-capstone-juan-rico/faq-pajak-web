/* eslint-disable react/no-unescaped-entities */
'use client'
import {motion} from 'framer-motion'
import { FileText, MessageSquare, Search, ShieldCheck, Zap } from 'lucide-react'
const OurFeatures = () => {
   return (
        <section id="features" className="py-24 bg-gray-50 dark:bg-[#03150f] transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-4xl font-bold text-[#022c22] dark:text-white mb-6">
                        Beyond basic chat. <br/>
                        <span className="text-gray-400">Built for accuracy.</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Most AI hallucinates. We don't. Our engine is strictly grounded in official Indonesian tax regulation documents.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* Large Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="md:col-span-2 bg-white dark:bg-[#0a271f] rounded-[2.5rem] p-10 relative overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 group"
                    >
                        <div className="relative z-10 max-w-sm">
                            <div className="w-12 h-12 bg-[#e8fce8] dark:bg-[#cdfc4d]/20 text-[#166534] dark:text-[#cdfc4d] rounded-2xl flex items-center justify-center mb-6">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#022c22] dark:text-white mb-4">Real-time Regulatory Updates</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                When the government updates a regulation, TanyaPajak knows it instantly. No outdated advice, ever.
                            </p>
                        </div>
                        {/* Abstract visual decoration */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-gradient-to-br from-[#cdfc4d] to-[#22c55e] rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity" />
                         <img 
                            src="https://images.unsplash.com/photo-1611974765215-fadbf4c90b8c?auto=format&fit=crop&q=80&w=800" 
                            className="absolute right-0 bottom-0 w-1/2 h-full object-cover opacity-10 dark:opacity-20 mix-blend-overlay mask-image-gradient"
                            style={{ maskImage: 'linear-gradient(to left, black, transparent)' }}
                            alt="Graph"
                        />
                    </motion.div>

                    {/* Tall Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="md:row-span-2 bg-[#022c22] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                <ShieldCheck size={24} className="text-[#cdfc4d]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Official Sources Only</h3>
                            <p className="text-gray-300 mb-8">
                                Every answer comes with a citation. Click to read the original PDF straight from the Directorate General of Taxes.
                            </p>
                            
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <FileText size={16} className="text-[#cdfc4d]" />
                                        <div className="h-2 w-24 bg-white/20 rounded-full" />
                                        <div className="h-2 w-8 bg-white/10 rounded-full ml-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Standard Card 1 */}
                    <motion.div 
                         whileHover={{ y: -5 }}
                         className="bg-[#cdfc4d] dark:bg-[#cdfc4d] rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm"
                    >
                        <div>
                            <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center mb-4">
                                <MessageSquare size={20} className="text-[#022c22]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#022c22] mb-2">Human Handoff</h3>
                        </div>
                        <p className="text-[#022c22]/80 text-sm font-medium">
                            Complex case? 1-click to hire an expert.
                        </p>
                        <div className="mt-4 flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-white/40 border border-white/20" />
                            ))}
                            <div className="w-8 h-8 rounded-full bg-[#022c22] flex items-center justify-center text-white text-xs">+</div>
                        </div>
                    </motion.div>

                    {/* Standard Card 2 */}
                    <motion.div 
                         whileHover={{ y: -5 }}
                         className="bg-white dark:bg-[#0a271f] rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                             <Search size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                                <Search size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-[#022c22] dark:text-white mb-2">Semantic Search</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Understands "I bought a laptop" as a "Capital Expense".
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default OurFeatures