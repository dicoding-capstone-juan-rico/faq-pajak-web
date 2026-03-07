import { Sparkles } from "lucide-react"

const Footer = () => {
    return (
        <footer className="bg-[#022c22] text-white pt-24 pb-12 rounded-t-[3rem] mt-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-[#cdfc4d] rounded-lg flex items-center justify-center text-[#022c22]">
                                <Sparkles size={16} strokeWidth={3} />
                            </div>
                            <span className="font-bold text-2xl">TanyaPajak</span>
                        </div>
                        <p className="text-gray-400 max-w-sm">
                            Empowering Indonesians with instant, accurate tax knowledge powered by artificial intelligence.
                        </p>
                    </div>
                    <div className="flex gap-16 flex-wrap">
                        <div>
                            <h4 className="font-bold mb-6 text-[#cdfc4d]">Product</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="hover:text-white cursor-pointer">Features</li>
                                <li className="hover:text-white cursor-pointer">Pricing</li>
                                <li className="hover:text-white cursor-pointer">API</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-[#cdfc4d]">Company</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="hover:text-white cursor-pointer">About</li>
                                <li className="hover:text-white cursor-pointer">Careers</li>
                                <li className="hover:text-white cursor-pointer">Contact</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2024 TanyaPajak AI. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer