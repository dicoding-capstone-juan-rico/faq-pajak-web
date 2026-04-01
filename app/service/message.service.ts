/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { ConversationStatus } from '@prisma/client'

const API_URL = '/api/chat/conversation'

export interface StartConversationResponse {
  message: string
  data: {
    conversationId: string
    status: ConversationStatus
    userMessage: {
      id: string
      content: string
      createdAt: string
    }
    aiReply: {
      id: string
      content: string
      createdAt: string
    }
  }
}

export interface GetConversationResponse {
  message: string
  data: {
    conversation: {
      id: string
      userId: string
      status: string
      expiresAt: string
    }
    messages: {
      id: string
      content: string
      senderType: string
      createdAt: string
    }[]
  } | null
}

export interface SendMessageResponse {
  message: string
  data: {
    conversationId: string
    status: ConversationStatus
    userMessage: {
      id: string
      content: string
      createdAt: string
    }
    aiReply: {
      id: string
      content: string
      createdAt: string
    }
  }
}

export const messageService = {

  /**
   * START CONVERSATION (tetap ada)
   */
  startConversation: async (
    content: string
  ): Promise<StartConversationResponse | 'Unauthorized'> => {
    try {
        const token = localStorage.getItem('token_faqpajak')
    if (!token) throw new Error('Token tidak ditemukan')

    const response = await axios.post<StartConversationResponse>(
      API_URL,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  
    return response.data
    } catch (e:any) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        // localStorage.removeItem('token')
        return 'Unauthorized'
      }
      throw e
    }
  },
  

  /**
   * GET ACTIVE CONVERSATION
   */
  getConversation: async (): Promise<GetConversationResponse | 'Unauthorized'> => {
    try {
         const token = localStorage.getItem('token_faqpajak')
    if (!token) throw new Error('Token tidak ditemukan')

    const response = await axios.get<GetConversationResponse>(
      `${API_URL}/message`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // localStorage.removeItem('token')
        return 'Unauthorized'
      }
      throw error
    }
 
  },

  /**
   * SEND MESSAGE
   */
  sendMessage: async (
    conversationId: string,
    content: string
  ): Promise<SendMessageResponse> => {

    const token = localStorage.getItem('token_faqpajak')
    if (!token) throw new Error('Token tidak ditemukan')

    const response = await axios.post<SendMessageResponse>(
      `${API_URL}/message/${conversationId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return response.data
  },

  /**
   * Decode JWT
   */
  getUserIdFromToken: (): string | null => {

    const token = localStorage.getItem('token_faqpajak')
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.userId || null
    } catch {
      return null
    }
  }
}