/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Maximize2, Minimize2, Send, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { messageService } from '@/app/service/message.service'
import { set } from 'zod'

type Message = {
  id: string
  text: string
  sender: 'user' | 'cs'
  timestamp: Date
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"

const FloatingChat = () => {

  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isAgent, setIsAgent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect()
    }
  }, [socket])

  // =========================
  // LOAD CONVERSATION
  // =========================


const loadConversation = async () => {
  try {
    const res = await messageService.getConversation()
    
    if (res === 'Unauthorized') {
      router.push("/login")
      return
    }

    if (!res.data) {
      // User baru (belum ada conversation di DB)
      setMessages([{
        id: "welcome",
        text: "Halo 👋 Selamat datang di FAQ Pajak...",
        sender: "cs",
        timestamp: new Date()
      }])
      return
    }

    const { conversation, messages: historyMessages } = res.data
    setConversationId(conversation.id)

    // 1. KONEKSI SOCKET SEGERA: Agar Admin tahu user standby
    // Tidak perlu cek status WAITING_AGENT di sini, 
    // biar Admin bisa lihat "User Online" kapan saja.
    connectSocket(conversation.id)

    // 2. Mapping history pesan
    const mappedMessages: Message[] = historyMessages
      .reverse()
      .map((msg: any) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.senderType === "USER" ? "user" : "cs",
        timestamp: new Date(msg.createdAt),
      }))

    setMessages(mappedMessages)

    // 3. Set mode agent jika statusnya memang sudah menunggu agent
    if (conversation.status === "WAITING_AGENT") {
      setIsAgent(true)
    }

  } catch (error) {
    console.error("Load conversation error", error)
  }
}
  // =========================
  // CONNECT SOCKET
  // =========================

  const connectSocket = (conversationId: string) => {

    const newSocket = io(SOCKET_URL)

    newSocket.emit("join_conversation", conversationId)

    newSocket.on("receive_message", (incomingMsg: any) => {

      if (incomingMsg.senderType !== "USER") {

        const csReply: Message = {
          id: incomingMsg.id,
          text: incomingMsg.content,
          sender: "cs",
          timestamp: new Date(incomingMsg.createdAt),
        }

        setMessages(prev => [...prev, csReply])
      }

    })

    setSocket(newSocket)
  }

  // =========================
  // OPEN CHAT
  // =========================

  const handleOpenChat = async () => {

    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    setIsOpen(true)

    await loadConversation()
  }

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSendMessage = async (e: React.FormEvent) => {

  e.preventDefault()

  if (!inputValue.trim()) return

  const textToSubmit = inputValue

  setInputValue("")

  const newUserMsg: Message = {
    id: `temp-${Date.now()}`,
    text: textToSubmit,
    sender: "user",
    timestamp: new Date(),
  }

  setMessages(prev => [...prev, newUserMsg])

  try {

    setIsLoading(true)

    // =========================
    // AGENT MODE (SOCKET)
    // =========================

    if (isAgent && socket && conversationId) {

      const senderId = messageService.getUserIdFromToken()

      socket.emit("send_message", {
        conversationId,
        senderType: "USER",
        senderId,
        content: textToSubmit
      })

      return
    }

    // =========================
    // FIRST MESSAGE
    // =========================

    if (!conversationId) {

      const res = await messageService.startConversation(textToSubmit)
      if (res === 'Unauthorized') {
        router.push("/login")
        return
      }

      const newConvId = res.data.conversationId

      setConversationId(newConvId)

      const aiReply = res.data.aiReply

      if (aiReply) {

        const aiMsg: Message = {
          id: aiReply.id,
          text: aiReply.content,
          sender: "cs",
          timestamp: new Date(aiReply.createdAt)
        }

        setMessages(prev => [...prev, aiMsg])
      }

      if (res.data.status === "WAITING_AGENT") {

        setIsAgent(true)

        connectSocket(newConvId)

      }

      return
    }

    // =========================
    // NORMAL MESSAGE (AI REST)
    // =========================

    const res = await messageService.sendMessage(
      conversationId,
      textToSubmit
    )

    const aiReply = res.data.aiReply

    const aiMsg: Message = {
      id: aiReply.id,
      text: aiReply.content,
      sender: "cs",
      timestamp: new Date(aiReply.createdAt)
    }

    setMessages(prev => [...prev, aiMsg])

  } catch (error) {

    console.error("Send message error", error)

  } finally {

    setIsLoading(false)

  }
}

  return (
    <>
      <AnimatePresence>

        {!isOpen && (
          <motion.button
            onClick={handleOpenChat}
            className="fixed bottom-6 right-6 w-16 h-16 bg-[#022c22] text-[#cdfc4d] rounded-full flex items-center justify-center shadow-2xl z-50"
          >
            <MessageCircle size={28} />
          </motion.button>
        )}

      </AnimatePresence>

      <AnimatePresence>

        {isOpen && (

          <motion.div
            className={`fixed z-50 flex flex-col bg-white shadow-2xl overflow-hidden
            ${isFullScreen
                ? "inset-0 w-full h-full"
                : "bottom-6 right-6 w-[400px] h-[600px] rounded-[2rem]"
              }`}
          >

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-4 bg-[#022c22] text-white">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 bg-[#cdfc4d] rounded-full flex items-center justify-center text-[#022c22]">
                  <Sparkles size={20} />
                </div>

                <div>
                  <h3 className="font-bold">CS TanyaPajak</h3>
                  <p className="text-xs text-[#cdfc4d]">Online</p>
                </div>

              </div>

              <div className="flex gap-2">

                <button onClick={() => setIsFullScreen(!isFullScreen)}>
                  {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>

                <button onClick={() => setIsOpen(false)}>
                  <X size={18} />
                </button>

              </div>

            </div>

            {/* CHAT AREA */}

            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {messages.map(msg => {

                const isUser = msg.sender === "user"

                return (

                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >

                    <div
                      className={`p-3 text-sm max-w-[75%] rounded-xl
                        ${isUser
                          ? "bg-[#022c22] text-white"
                          : "bg-gray-100"
                        }`}
                    >

                      <p className="whitespace-pre-line">{msg.text}</p>

                      <div className="text-[10px] opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                    </div>

                  </div>
                )

              })}

              <div ref={messagesEndRef} />

            </div>

            {/* INPUT */}

            <div className="p-4 border-t">

              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ketik pertanyaan..."
                  disabled={isLoading}
                  className="flex-1 border rounded-full px-4 py-2 text-sm"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#cdfc4d] text-[#022c22] p-2 rounded-full"
                >
                  <Send size={18} />
                </button>

              </form>

            </div>

          </motion.div>

        )}

      </AnimatePresence>
    </>
  )
}

export default FloatingChat