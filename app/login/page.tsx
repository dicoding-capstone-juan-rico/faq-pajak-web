/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Lock, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { authService,LoginRequest } from '../service/auth.service';

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data: LoginRequest = { email, password };
      await authService.login(data);
      
    } catch (err: any) {
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white dark:bg-[#022c22]">
      {/* Abstract Background Elements (Consistant with Hero) */}
      <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full bg-[#f0fdf4] dark:bg-[#0a3528] -z-20 transition-colors duration-500 lg:rounded-br-[100px]" />
      <div className="absolute top-40 left-20 w-64 h-64 bg-[#cdfc4d] rounded-full blur-[120px] opacity-40 dark:opacity-20 pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-20">
        
        {/* Left Column: Branding & Welcome Back */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block pr-10"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-[#022c22] dark:text-white mb-12 hover:opacity-70 transition-opacity">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 mb-8 shadow-sm">
            <Sparkles size={14} className="text-[#022c22] dark:text-[#cdfc4d]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#022c22] dark:text-white">
              Welcome Back
            </span>
          </div>
          
          <h1 className="text-5xl font-bold text-[#022c22] dark:text-white leading-[1.1] tracking-tight mb-6">
            Pick up right kiggg <br />
            where you{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#022c22] dark:text-white italic">left off.</span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-[#cdfc4d] -z-0 -rotate-2 opacity-80" />
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
            Log in to access your previous tax chats, saved documents, and continue simplifying your tax season.
          </p>
        </motion.div>

        {/* Right Column: Login Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
        >
          <div className="bg-white dark:bg-[#0a3528] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-gray-100 dark:border-white/5 relative z-20">
            
            {/* Mobile Only Greeting */}
            <div className="block lg:hidden mb-8 text-center">
              <h2 className="text-3xl font-bold text-[#022c22] dark:text-white mb-2">Welcome Back</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Log in to your TanyaPajak account</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
                {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl">
          {error}
        </div>
      )}
              <div className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#022c22] dark:text-white mb-2 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input 
                    onChange={(e) => setEmail(e.target.value)}
                      type="email" 
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl text-[#022c22] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cdfc4d] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <label className="block text-sm font-semibold text-[#022c22] dark:text-white">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs font-medium text-green-700 dark:text-[#cdfc4d] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input 
                    onChange={(e) => setPassword(e.target.value)}
                      type="password" 
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl text-[#022c22] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cdfc4d] transition-all"
                      required
                    />
                  </div>
                </div>
              </div>\

              {/* Submit Button */}
              <Button className='w-full'>{loading ? 'Loading...' : 'Login'} <ArrowRight size={18} /></Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dont have an account?{' '}
                <Link href="/register" className="font-bold text-[#022c22] dark:text-white hover:text-green-700 dark:hover:text-[#cdfc4d] transition-colors">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default LoginPage;