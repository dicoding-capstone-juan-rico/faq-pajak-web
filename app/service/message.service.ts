import axios from 'axios';

// Sesuaikan URL ini dengan endpoint API Anda yang sebenarnya
const API_URL = '/api/chat/conversation'; 

export interface StartConversationResponse {
  message: string;
  data: {
    id: string; // Ini adalah conversationId
    userId: string;
    status: string;
    messages: {
      id: string;
      content: string;
      senderType: string;
      createdAt: string;
    }[];
  };
}

export const messageService = {
  /**
   * Memulai percakapan baru (mengirim pesan pertama)
   */
  startConversation: async (content: string): Promise<StartConversationResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');

      const response = await axios.post<StartConversationResponse>(
        API_URL, // Asumsi endpoint POST Anda ada di route ini
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Gagal memulai percakapan');
      }
      throw error;
    }
  },

  /**
   * Helper untuk mendecode JWT secara sederhana di sisi klien 
   * (Digunakan untuk mendapatkan userId dari token)
   */
  getUserIdFromToken: (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (e) {
      return null;
    }
  }
};