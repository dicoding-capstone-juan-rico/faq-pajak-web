/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useRef, useEffect } from 'react';
// import { Search, MoreVertical, CheckCircle2, Paperclip } from 'lucide-react';
import { io, Socket } from "socket.io-client";

type Message = {
  id: string
  sender: 'user' | 'agent'
  text: string
  time: string
}

type Conversation = {
  id: string
  user?: {
    name?: string
  }
  messages?: {
    content: string
  }[]
}

export default function ChatView() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const fetchSidebarRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    fetchSidebarRef.current = fetchSidebar;
  });
  
  const activeConversationIdRef = useRef<string | null>(null);

  const adminId = "admin-demo"; // TODO: ambil dari login

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // =========================
  // INIT SOCKET (Hanya jalan 1 kali)
  // =========================
  useEffect(() => {
    const socket = io("https://tanyapajak.online", {
      path: "/socket.io",
      transports: ["websocket"]
    })

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("CONNECTED:", socket.id);
      socket.emit("join_admin_dashboard");
      
      if (activeConversationIdRef.current) {
        socket.emit("join_conversation", activeConversationIdRef.current);
      }
    });

    socket.on("receive_message", (message) => {
      if (message.conversationId === activeConversationIdRef.current) {
        const newMsg: Message = {
          id: message.id,
          sender: message.senderType === "AGENT" ? "agent" : "user",
          text: message.content,
          time: new Date(message.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
          })
        };
        setMessages(prev => [...prev, newMsg]);
      }

      setConversations(prev => {
        return prev.map(conv => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              messages: [{ content: message.content }, ...(conv.messages || [])]
            };
          }
          return conv;
        });
      });
    });

    socket.on("new_conversation", (conversation) => {
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === conversation.id);
        if (exists) return prev;
        return [conversation, ...prev];
      });
    });

    socket.on("conversation_updated", (data) => {
      setConversations((prev) => {
        const chatExists = prev.find((c) => c.id === data.conversationId);

        if (chatExists) {
          const updated = prev.map((conv) => {
            if (conv.id === data.conversationId) {
              return { ...conv, messages: [{ content: data.lastMessage }] };
            }
            return conv;
          });
          
          const idx = updated.findIndex(c => c.id === data.conversationId);
          const [movedChat] = updated.splice(idx, 1);
          updated.unshift(movedChat);
          return updated;
        } else {
          fetchSidebarRef.current?.();
          return prev;
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []); 

  // =========================
  // OPEN CONVERSATION
  // =========================

  const openConversation = async (conversationId: string) => {
    if (!socketRef.current) return;

    if (activeConversationIdRef.current) {
      socketRef.current.emit("leave_conversation", activeConversationIdRef.current);
    }

    socketRef.current.emit("join_conversation", conversationId);

    setActiveConversation({ id: conversationId });
    activeConversationIdRef.current = conversationId; 

    try {
      const res = await fetch(`/api/admin/conversation/${conversationId}`);
      const data = await res.json();

      const sortedData = (data.data || []).sort((a: any, b: any) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      const mapped: Message[] = sortedData.map((msg: any) => ({
        id: msg.id,
        sender: msg.senderType === "AGENT" ? "agent" : "user",
        text: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit"
        })
      }));

      setMessages(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // LOAD CONVERSATIONS (REST)
  // =========================
  const fetchSidebar = async (isInitial = false) => {
    try {
      const res = await fetch("/api/admin/conversation");
      const data = await res.json();
      const normalized = (data.data || []).map((conv: any) => ({
        ...conv,
        messages: conv.messages || []
      }));

      setConversations(normalized);

      if (isInitial && normalized.length > 0) {
        openConversation(normalized[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSidebar(true);
  }, []);

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim()) return;
    if (!socketRef.current || !activeConversation) return;

    socketRef.current.emit("send_message", {
      conversationId: activeConversation.id,
      senderType: "AGENT",
      senderId: adminId,
      content: messageInput
    });

    setMessageInput(""); 
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex overflow-hidden bg-white border rounded-2xl shadow-sm mx-4 mb-4">
      {/* SIDEBAR */}
      <div className="w-80 border-r bg-gray-50/50 flex flex-col">
        {/* Header Sidebar (Opsional untuk Tab) */}
        <div className="p-4 border-b bg-white">
          <h2 className="text-lg font-bold text-gray-800">Pesan Masuk</h2>
          <div className="flex gap-2 mt-3">
            {['Semua', 'Belum Dibaca'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  activeTab === tab 
                    ? 'bg-[#022c22] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* List Percakapan */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => openConversation(chat.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all border border-transparent ${
                activeConversation?.id === chat.id 
                  ? 'bg-green-50/50 border-green-100 shadow-sm' 
                  : 'hover:bg-white hover:border-gray-100 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-semibold text-sm ${activeConversation?.id === chat.id ? 'text-[#022c22]' : 'text-gray-800'}`}>
                  {chat.user?.name || "Pengguna Anonim"}
                </h3>
              </div>
              <p className="text-xs text-gray-500 truncate pr-4">
                {chat.messages?.[0]?.content || "Tidak ada pesan..."}
              </p>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="text-center text-sm text-gray-400 py-10">
              Belum ada percakapan
            </div>
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Header Chat Area */}
        {activeConversation ? (
          <div className="p-4 border-b flex items-center justify-between bg-white shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                {conversations.find(c => c.id === activeConversation.id)?.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">
                  {conversations.find(c => c.id === activeConversation.id)?.user?.name || "Pengguna Anonim"}
                </h3>
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                  Aktif sekarang
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b h-[73px] bg-white shadow-sm z-10"></div> // Spacer jika belum ada yg dipilih
        )}

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          {!activeConversation && (
            <div className="h-full flex items-center justify-center text-gray-400">
              Pilih percakapan untuk mulai membalas
            </div>
          )}

          {messages.map((msg, index) => {
            const isAdmin = msg.sender === 'agent';
            return (
              <div
                key={msg.id || index}
                className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative p-3.5 rounded-2xl max-w-[75%] shadow-sm ${
                    isAdmin 
                      ? 'bg-[#022c22] text-white rounded-br-sm' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`text-[10px] mt-2 text-right ${isAdmin ? 'text-green-200' : 'text-gray-400'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* INPUT */}
        {activeConversation && (
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 border border-gray-200 bg-gray-50 focus:bg-white rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800"
                placeholder="Ketik balasan untuk pengguna..."
              />
              <button 
                type="submit"
                disabled={!messageInput.trim()}
                className="bg-[#cdfc4d] hover:bg-[#b5e03e] text-[#022c22] font-semibold px-6 py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              >
                Kirim
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}