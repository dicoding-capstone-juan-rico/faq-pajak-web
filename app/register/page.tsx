'use client'
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Lock, Sparkles, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { authService, RegisterRequest } from '../service/auth.service';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data: RegisterRequest = { name, email, password };
            await authService.register(data);
            setSuccess(true);
            // Redirect ke login setelah 2 detik
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full bg-[#f0fdf4] -z-20 lg:rounded-br-[100px]" />
            <div className="absolute top-40 left-20 w-64 h-64 bg-[#cdfc4d] rounded-full blur-[120px] opacity-40 pointer-events-none" />

            <div className="max-w-7xl w-full mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center py-20">
                
                {/* Left Column: Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden lg:block pr-10"
                >
                    <Link href="/" className="inline-flex items-center gap-2 text-[#022c22] mb-12 hover:opacity-70 transition-opacity">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 mb-8 shadow-sm">
                        <Sparkles size={14} className="text-[#022c22]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#022c22]">
                            Join TanyaPajak
                        </span>
                    </div>
                    
                    <h1 className="text-5xl font-bold text-[#022c22] leading-[1.1] tracking-tight mb-6">
                        Start your <br />
                        journey with <br />
                        <span className="relative inline-block">
                            <span className="relative z-10 text-[#022c22] italic">ease.</span>
                            <span className="absolute bottom-2 left-0 w-full h-4 bg-[#cdfc4d] -z-0 -rotate-2 opacity-80" />
                        </span>
                    </h1>
                    
                    <p className="text-lg text-gray-600 max-w-md leading-relaxed">
                        Create an account today and get verified tax answers in seconds. Managing your taxes has never been this simple.
                    </p>
                </motion.div>

                {/* Right Column: Register Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
                >
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-gray-100 relative z-20">
                        
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-[#022c22] mb-2">Create Account</h2>
                            <p className="text-sm text-gray-600">Join 2,000+ freelancers simplifying their tax</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleRegister}>
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="p-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100">
                                    Registration successful! Redirecting to login...
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#022c22] mb-2 ml-1"> Full Name </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User size={18} className="text-gray-400" />
                                        </div>
                                        <input 
                                            onChange={(e) => setName(e.target.value)}
                                            type="text" 
                                            placeholder="John Doe"
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[#022c22] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cdfc4d] transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#022c22] mb-2 ml-1"> Email Address </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-gray-400" />
                                        </div>
                                        <input 
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email" 
                                            placeholder="you@example.com"
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[#022c22] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cdfc4d] transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#022c22] mb-2 ml-1"> Password </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-gray-400" />
                                        </div>
                                        <input 
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password" 
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[#022c22] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cdfc4d] transition-all"
                                            required
                                        />
                                    </div>
                                    <p className="mt-2 text-[10px] text-gray-500 ml-1">Min. 6 characters with a mix of letters & numbers</p>
                                </div>
                            </div>

                            <Button className='w-full h-14 rounded-2xl text-lg font-semibold' disabled={loading}>
                                {loading ? 'Creating Account...' : 'Get Started'} 
                                {!loading && <ArrowRight size={18} className="ml-2" />}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="font-bold text-[#022c22] hover:text-green-700 transition-colors">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;