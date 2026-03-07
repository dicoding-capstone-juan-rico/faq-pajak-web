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
  ChevronLeft
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_CHATS = [
  { id: 1, name: 'AI Support Assistant', lastMessage: 'Your transaction has been verified.', time: 'Just now', unread: 1, active: true },
  { id: 2, name: 'Account Verification', lastMessage: 'Please upload your ID document.', time: '10:42 AM', unread: 0, active: false },
  { id: 3, name: 'Billing Inquiry', lastMessage: 'Your invoice #4920 has been paid.', time: 'Yesterday', unread: 0, active: false },
  { id: 4, name: 'Technical Support', lastMessage: 'The API rate limit has been increased.', time: 'Tue', unread: 0, active: false },
];

const INITIAL_MESSAGES = [
  { id: 1, sender: 'agent', text: 'Hello! I am your AI Support Assistant. How can I help you with your account today?', time: '10:00 AM', isVerified: true },
  { id: 2, sender: 'user', text: 'Hi, I recently made a transfer to a new beneficiary, but it is still pending. Can you check its status?', time: '10:02 AM' },
  { id: 3, sender: 'agent', text: 'I can certainly help with that. Let me look up your recent transactions.', time: '10:02 AM', isVerified: false },
  { id: 4, sender: 'agent', text: 'I found the transaction. The transfer of $4,500.00 to "Tech Solutions Inc" is currently undergoing standard security screening. This usually takes about 15-30 minutes for new international payees.', time: '10:03 AM', isVerified: true },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle system dark mode preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!messageInput.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setMessageInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const newAgentMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        text: 'I have expedited the review process for you. The transaction should be cleared in the next 5 minutes. Is there anything else you need assistance with?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isVerified: true,
      };
      setMessages((prev) => [...prev, newAgentMsg]);
    }, 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? 'dark' : ''}`}>
      {/* Background with subtle animated blurs */}
      <div className="fixed inset-0 bg-[#f0fdf4] dark:bg-[#01140e] transition-colors duration-500 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#cdfc4d]/20 dark:bg-[#cdfc4d]/5 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#022c22]/10 dark:bg-[#022c22]/40 rounded-full mix-blend-multiply blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>

      {/* Main Layout Container */}
      <div className="relative z-10 h-screen max-w-[1600px] mx-auto p-0 sm:p-4 lg:p-6 flex flex-col">
        
        {/* TOP NAVIGATION BAR */}
        <header className="flex-none bg-white/60 dark:bg-[#022c22]/60 backdrop-blur-xl border-b sm:border border-white/40 dark:border-white/5 sm:rounded-full px-4 sm:px-6 py-3 mb-0 sm:mb-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 -ml-2 text-[#022c22] dark:text-[#f0fdf4] hover:bg-[#cdfc4d]/20 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center justify-center w-10 h-10 bg-[#022c22] text-[#cdfc4d] rounded-2xl shadow-lg shadow-[#022c22]/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-[#022c22] dark:text-[#f0fdf4] font-bold text-lg leading-tight tracking-tight">Chat Support</h1>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cdfc4d] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b5e043]"></span>
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Online & Verified</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 text-[#022c22] dark:text-[#f0fdf4] hover:bg-white dark:hover:bg-[#022c22] rounded-full transition-all shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#cdfc4d] to-[#022c22] p-0.5 shadow-md cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-[#022c22] rounded-full border-2 border-white dark:border-[#022c22] overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=32" alt="User Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN WORKSPACE: Floating Card */}
        <main className="flex-1 flex overflow-hidden bg-white/70 dark:bg-[#011a14]/70 backdrop-blur-2xl sm:border border-white/50 dark:border-white/5 sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(2,44,34,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative">
          
          {/* SIDEBAR (Responsive) */}
          <aside className={`
            absolute lg:relative z-20 h-full w-80 max-w-full bg-white/50 dark:bg-[#022c22]/30 backdrop-blur-xl border-r border-gray-100 dark:border-[#f0fdf4]/10 flex flex-col transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Sidebar Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <span className="font-semibold text-[#022c22] dark:text-[#f0fdf4]">Conversations</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-[#022c22] dark:hover:text-[#f0fdf4] bg-gray-100 dark:bg-gray-800 rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {/* Search */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400 group-focus-within:text-[#022c22] dark:group-focus-within:text-[#cdfc4d] transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#01140e] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#cdfc4d]/50 shadow-inner dark:text-gray-200 dark:placeholder-gray-500 transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex p-1 bg-gray-100/80 dark:bg-[#01140e]/80 rounded-2xl">
                {['All', 'Open', 'Closed'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                      activeTab === tab 
                        ? 'bg-white dark:bg-[#022c22] text-[#022c22] dark:text-[#cdfc4d] shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-[#022c22] dark:hover:text-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
              {INITIAL_CHATS.map((chat) => (
                <div 
                  key={chat.id} 
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 flex items-start gap-3 border border-transparent
                    ${chat.active 
                      ? 'bg-white dark:bg-[#022c22]/50 shadow-sm border-gray-100 dark:border-[#cdfc4d]/20' 
                      : 'hover:bg-white/50 dark:hover:bg-[#022c22]/30 hover:border-gray-50 dark:hover:border-transparent'}
                  `}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f0fdf4] to-emerald-100 dark:from-[#022c22] dark:to-emerald-900 flex items-center justify-center text-[#022c22] dark:text-[#cdfc4d] font-bold border border-[#022c22]/10 dark:border-[#cdfc4d]/20">
                      {chat.name.charAt(0)}
                    </div>
                    {chat.active && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#cdfc4d] rounded-full border-2 border-white dark:border-[#022c22]"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="text-sm font-semibold text-[#022c22] dark:text-gray-100 truncate pr-2">{chat.name}</h3>
                      <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">{chat.time}</span>
                    </div>
                    <p className={`text-xs truncate ${chat.unread ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-[#cdfc4d] text-[#022c22] text-[10px] font-bold flex items-center justify-center mt-1">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* Overlay for mobile sidebar */}
          {mobileMenuOpen && (
            <div 
              className="absolute inset-0 bg-[#022c22]/20 dark:bg-black/40 backdrop-blur-sm z-10 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* CHAT PANEL */}
          <section className="flex-1 flex flex-col h-full bg-white/40 dark:bg-transparent relative z-0">
            
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-white/40 dark:bg-[#022c22]/20 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <button 
                  className="lg:hidden p-1.5 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#022c22] flex items-center justify-center text-[#cdfc4d] shadow-lg shadow-[#022c22]/10 border-2 border-[#f0fdf4] dark:border-[#01140e]">
                    <Sparkles size={24} />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#cdfc4d] rounded-full border-2 border-white dark:border-[#022c22]"></div>
                </div>
                <div>
                  <h2 className="text-[#022c22] dark:text-[#f0fdf4] font-bold text-base sm:text-lg tracking-tight">AI Support Assistant</h2>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#022c22]/60 dark:text-[#f0fdf4]/60 font-medium">Fintech Virtual Agent</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <div className="flex items-center text-[#022c22]/60 dark:text-[#f0fdf4]/60 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      <Clock size={10} className="mr-1" />
                      <span>Avg response: 2.4s</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-[#022c22] dark:hover:text-[#f0fdf4] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
              
              <div className="flex justify-center mb-6">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800/50 px-3 py-1 rounded-full">Today</span>
              </div>

              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col group`}>
                      
                      {/* Message Bubble */}
                      <div 
                        className={`relative px-5 py-3.5 text-sm sm:text-base shadow-sm
                          ${isUser 
                            ? 'bg-gray-100 dark:bg-gray-800 text-[#022c22] dark:text-gray-100 rounded-[1.5rem] rounded-tr-[0.25rem]' 
                            : 'bg-[#f0fdf4] dark:bg-[#022c22]/40 text-[#022c22] dark:text-[#f0fdf4] border border-[#cdfc4d]/40 dark:border-[#cdfc4d]/20 rounded-[1.5rem] rounded-tl-[0.25rem] shadow-[#cdfc4d]/5 dark:shadow-none'
                          }
                        `}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>

                      {/* Meta info below bubble */}
                      <div className={`flex items-center gap-2 mt-1.5 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{msg.time}</span>
                        
                        {!isUser && msg.isVerified && (
                          <div className="flex items-center text-[#022c22] dark:text-[#cdfc4d] text-[11px] font-semibold bg-[#cdfc4d]/10 dark:bg-[#cdfc4d]/5 px-1.5 py-0.5 rounded-full">
                            <ShieldCheck size={12} className="mr-1 text-[#cdfc4d] dark:text-[#cdfc4d]" />
                            Verified Answer
                          </div>
                        )}
                        
                        {isUser && (
                          <CheckCircle2 size={12} className="text-gray-300 dark:text-gray-600" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="bg-[#f0fdf4] dark:bg-[#022c22]/40 border border-[#cdfc4d]/40 dark:border-[#cdfc4d]/20 rounded-[1.5rem] rounded-tl-[0.25rem] px-5 py-4 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 bg-[#cdfc4d] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#cdfc4d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#cdfc4d] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-6 bg-white/60 dark:bg-[#01140e]/60 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 relative z-10 rounded-b-[2.5rem]">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-900 p-2 pl-4 sm:pl-5 rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 focus-within:ring-2 focus-within:ring-[#cdfc4d]/50 focus-within:border-transparent transition-all"
              >
                <button type="button" className="text-gray-400 hover:text-[#022c22] dark:hover:text-[#cdfc4d] transition-colors">
                  <Smile size={20} />
                </button>
                <button type="button" className="text-gray-400 hover:text-[#022c22] dark:hover:text-[#cdfc4d] transition-colors">
                  <Paperclip size={20} />
                </button>
                
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[#022c22] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm sm:text-base py-2 px-2"
                />
                
                <button 
                  type="submit"
                  disabled={!messageInput.trim()}
                  className={`flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-300 shadow-md ${
                    messageInput.trim() 
                      ? 'bg-[#cdfc4d] text-[#022c22] hover:bg-[#b5e043] hover:scale-105 shadow-[#cdfc4d]/30' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 shadow-none cursor-not-allowed'
                  }`}
                >
                  <Send size={18} className={messageInput.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                </button>
              </form>
              <div className="text-center mt-3">
                <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center justify-center gap-1.5">
                  <Sparkles size={10} className="text-[#cdfc4d]" /> 
                  Secured by AI-grade encryption
                </span>
              </div>
            </div>
            
          </section>
        </main>
      </div>
    </div>
  );
}