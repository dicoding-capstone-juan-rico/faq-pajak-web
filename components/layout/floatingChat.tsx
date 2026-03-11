'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Maximize2, Minimize2, Send, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { messageService } from '@/app/service/message.service'; // Sesuaikan path

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'cs';
  timestamp: Date;
};

// URL Socket backend Anda
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

const FloatingChat = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // State untuk Data Interaktif
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      text: 'Halo! Ada yang bisa kami bantu seputar pajak Anda hari ini?',
      sender: 'cs',
      timestamp: new Date(),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Cleanup Socket saat komponen dibongkar atau di-close
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const handleOpenChat = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return; 
    }
    setIsOpen(true);
  };

  const setupSocketListener = (newSocket: Socket) => {
    newSocket.on('receive_message', (incomingMsg: any) => {
      // Hanya tangkap pesan balasan dari agen/AI (karena pesan user sudah di-push optimistically)
      if (incomingMsg.senderType !== 'USER') {
        const csReply: Message = {
          id: incomingMsg.id,
          text: incomingMsg.content,
          sender: 'cs',
          timestamp: new Date(incomingMsg.createdAt || Date.now()),
        };
        setMessages((prev) => [...prev, csReply]);
      }
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const textToSubmit = inputValue;
    setInputValue('');
    
    // 1. Optimistic Update (Tampilkan di layar user seketika)
    const newUserMsg: Message = {
      id: `temp-${Date.now()}`,
      text: textToSubmit,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMsg]);

    try {
      // 2. LOGIKA PERCABANGAN: Pesan Pertama vs Pesan Lanjutan
      if (!conversationId) {
        // --- A. INI ADALAH PESAN PERTAMA (REST API) ---
        setIsLoading(true);
        const response = await messageService.startConversation(textToSubmit);
        const newConvId = response.data.id;
        setConversationId(newConvId);

        // Langsung Konek ke Socket setelah Room/Conversation terbuat
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);
        
        // Join Room
        newSocket.emit('join_conversation', newConvId);
        
        // Pasang pendengar balasan
        setupSocketListener(newSocket);

      } else {
        // --- B. INI ADALAH PESAN KEDUA DAN SETERUSNYA (WEB SOCKET) ---
        if (socket) {
          const userId = messageService.getUserIdFromToken();
          
          socket.emit('send_message', {
            conversationId: conversationId,
            senderType: 'USER',
            senderId: userId,
            content: textToSubmit
          });
        }
      }
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      // Opsional: Tampilkan notifikasi error ke user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenChat}
            className="fixed bottom-6 right-6 w-16 h-16 bg-[#022c22] dark:bg-[#cdfc4d] text-[#cdfc4d] dark:text-[#022c22] rounded-full flex items-center justify-center shadow-2xl z-50 transition-colors"
          >
            <MessageCircle size={28} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white dark:border-[#022c22] rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed z-50 flex flex-col bg-white dark:bg-[#0a3528] shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden
              ${isFullScreen 
                ? 'inset-0 w-full h-full rounded-none'
                : 'bottom-6 right-6 w-[90vw] sm:w-[400px] h-[600px] max-h-[85vh] rounded-[2rem]'
              }
            `}
          >
            {/* Header (Sama seperti sebelumnya) */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#022c22] text-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-[#cdfc4d] rounded-full flex items-center justify-center text-[#022c22]">
                    <Sparkles size={20} />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#022c22] rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold leading-tight">CS TanyaPajak</h3>
                  <p className="text-xs text-[#cdfc4d]">Online & Siap Membantu</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white">
                  {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-black/10">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-[#022c22]/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                        <Sparkles size={14} className="text-[#022c22] dark:text-[#cdfc4d]" />
                      </div>
                    )}
                    <div className={`p-4 text-sm shadow-sm ${isUser ? 'bg-[#022c22] dark:bg-[#cdfc4d] text-white dark:text-[#022c22] rounded-2xl rounded-tr-sm' : 'bg-white dark:bg-[#022c22]/50 border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm'}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-2 text-right ${isUser ? 'text-white/70 dark:text-black/50' : 'text-gray-400'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-[#0a3528] border-t border-gray-100 dark:border-white/5">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ketik pertanyaan Anda..."
                  disabled={isLoading}
                  className="w-full pl-6 pr-14 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-full text-sm text-[#022c22] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cdfc4d] transition-all disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 p-2.5 bg-[#cdfc4d] text-[#022c22] rounded-full hover:bg-[#b8e83c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;