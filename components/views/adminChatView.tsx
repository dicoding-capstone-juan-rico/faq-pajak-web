'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, CheckCircle2, Paperclip } from 'lucide-react';
import { io, Socket } from "socket.io-client";

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

export default function ChatView() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const conversationId = "demo-conversation"; // TODO: replace with real conversation id
  const adminId = "admin-demo"; // TODO: replace with logged in admin id

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[CLIENT] connected:", socket.id);
      socket.emit("join_conversation", conversationId);
    });

    socket.on("receive_message", (message) => {
      console.log("[CLIENT] receive_message", message);

      const newMsg = {
        id: message.id,
        sender: message.senderType === "AGENT" ? "agent" : "user",
        text: message.content,
        time: new Date(message.createdAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit"
        })
      };

      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    if (!socketRef.current) return;

    socketRef.current.emit("send_message", {
      conversationId,
      senderType: "AGENT",
      senderId: adminId,
      content: messageInput
    });

    setMessageInput("");
  };

  return (
    <div className="h-[calc(100vh-6rem)] bg-white/60 dark:bg-[#022c22]/30 backdrop-blur-2xl rounded-[2.5rem] shadow-sm border border-white/50 dark:border-white/5 flex overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      
      {/* Sidebar Daftar Tiket */}
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

      {/* Area Chat Utama */}
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
                placeholder="Ketik balasan Anda..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-[#022c22] dark:text-gray-100 text-sm py-2 px-2 placeholder:text-gray-400 focus:outline-none"
              />
              <button 
                type="submit"
                disabled={!messageInput.trim()}
                className={`flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  messageInput.trim() ? 'bg-[#cdfc4d] text-[#022c22] shadow-[0_4px_15px_-3px_rgba(205,252,77,0.4)] hover:scale-105' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                }`}
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}