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
  // Tambahkan | null di tipe data dan berikan null di dalam kurung
const fetchSidebarRef = useRef<(() => Promise<void>) | null>(null);

useEffect(() => {
  fetchSidebarRef.current = fetchSidebar;
});
  
  // Gunakan ref untuk melacak ID percakapan aktif di dalam socket listener
  // tanpa memicu re-render atau re-connect socket
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
    const socket = io("http://localhost:3001", {
      reconnection: true
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("CONNECTED:", socket.id);
      socket.emit("join_admin_dashboard");
      
      // Re-join room jika tiba-tiba reconnect
      if (activeConversationIdRef.current) {
        socket.emit("join_conversation", activeConversationIdRef.current);
      }
    });

    // realtime chat masuk
    socket.on("receive_message", (message) => {
      // 1. Update list pesan JIKA pesan masuk di room yang sedang aktif
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

      // 2. Update cuplikan pesan terakhir di sidebar/list percakapan
      setConversations(prev => {
        return prev.map(conv => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              // Asumsi API mu menggunakan index 0 untuk cuplikan teks terbaru
              messages: [{ content: message.content }, ...(conv.messages || [])]
            };
          }
          return conv;
        });
      });
    });

    socket.on("new_conversation", (conversation) => {
  setConversations((prev) => {
    // Cek duplikasi supaya tidak muncul dua kali
    const exists = prev.find((c) => c.id === conversation.id);
    if (exists) return prev;
    
    // Masukkan ke paling atas sidebar secara real-time
    return [conversation, ...prev];
  });
});

// Listener untuk PESAN BARU (update teks cuplikan)
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
      
      // Pindahkan percakapan yang baru aktif ke paling atas
      const idx = updated.findIndex(c => c.id === data.conversationId);
      const [movedChat] = updated.splice(idx, 1);
      updated.unshift(movedChat);
      return updated;
    } else {
      // Jika karena alasan teknis datanya belum ada di state, 
      // ambil ulang semua sidebar dari API
      fetchSidebarRef.current?.();
      return prev;
    }
  });
});

    // Cleanup saat unmount
    return () => {
      socket.disconnect();
    };
  }, []); // <-- Dependency array KOSONG agar socket tidak disconnect terus

  // =========================
  // OPEN CONVERSATION
  // =========================

  const openConversation = async (conversationId: string) => {
    if (!socketRef.current) return;

    // leave room lama
    if (activeConversationIdRef.current) {
      socketRef.current.emit("leave_conversation", activeConversationIdRef.current);
    }

    // join room baru
    socketRef.current.emit("join_conversation", conversationId);

    setActiveConversation({ id: conversationId });
    activeConversationIdRef.current = conversationId; // Update ref

    try {
      const res = await fetch(`/api/admin/conversation/${conversationId}`);
      const data = await res.json();

      // URUTKAN PESAN (Sort Ascending) agar chat terbaru ada di BAWAH
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
  // 1. TAMBAHKAN FUNGSI INI
  const fetchSidebar = async (isInitial = false) => {
    try {
      const res = await fetch("/api/admin/conversation");
      const data = await res.json();
      const normalized = (data.data || []).map((conv: any) => ({
        ...conv,
        messages: conv.messages || []
      }));

      setConversations(normalized);

      // Hanya buka percakapan pertama otomatis saat pertama kali halaman dibuka (refresh)
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

    // HAPUS ATAU COMMENT BAGIAN INI KE BAWAH:
    /*
    setMessages(prev => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        sender: "agent",
        text: messageInput,
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit"
        })
      }
    ]);
    */

    setMessageInput(""); // Tetap kosongkan input field
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-80 border-r p-3 space-y-2">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => openConversation(chat.id)}
            className={`p-3 rounded-xl cursor-pointer hover:bg-gray-100 ${
              activeConversation?.id === chat.id ? 'bg-gray-100' : ''
            }`}
          >
            <h3 className="font-bold">
              {chat.user?.name || "User"}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {chat.messages?.[0]?.content || "-"}
            </p>
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isAdmin = msg.sender === 'agent';
            return (
              <div
                key={msg.id}
                className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[70%] ${
                    isAdmin ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.text}
                  <div className="text-[10px] opacity-70 mt-1">
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2"
              placeholder="Ketik balasan..."
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded-full">
              send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}