/* eslint-disable @typescript-eslint/no-explicit-any */
import { dbCon } from "@/lib/dbConnection"
import { successResponse, errorResponse } from "@/lib/response"
import jwt from "jsonwebtoken"
import { ConversationStatus, SenderType } from "@prisma/client"

export async function POST(req: Request) {
  const AI_API_URL = process.env.AI_API_URL
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse("Unauthorized", 401)
    }

    const token = authHeader.replace("Bearer ", "")
    let userId: string

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { userId: string }

      userId = payload.userId
    } catch {
      return errorResponse("Invalid token", 401)
    }

    const body = await req.json()
    const { content } = body

    if (!content) {
      return errorResponse("Message content is required", 400)
    }
    console.log(`sending to ai: ${content},url: ${AI_API_URL}/chat`)
    let aiReply: string | null = null
    let conversationStatus:ConversationStatus = ConversationStatus.BOT_HANDLING
    try {

  const aiRes = await fetch(`${AI_API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question: content
    })
  })

  if (!aiRes.ok) {
    throw new Error("AI service error")
  }

  const aiData = await aiRes.json()

  aiReply = aiData.answer

} catch (error) {

  console.error("AI error:", error)

  aiReply =
    "Mohon tunggu sebentar, pertanyaan Anda sedang kami teruskan ke agent."

  conversationStatus = ConversationStatus.WAITING_AGENT
}
    
    if (!aiReply) {
      aiReply = "Maaf, saya belum bisa menjawab pertanyaan tersebut."
    }
    // console.log("AI response:", aiData)
  

    const conversation = await dbCon.$transaction(async (tx) => {
      const conv = await tx.conversation.create({
        data: {
          userId,
          status: conversationStatus,
          lastMessageAt: new Date(),
          expiresAt: new Date(Date.now() + 5 * 60 * 1000)// expired in 5 minutes
        }
      })

      const userMessage = await tx.message.create({
        data: {
          conversationId: conv.id,
          senderType: SenderType.USER,
          senderId: userId,
          content
        }
      })

      const aiMessage = await tx.message.create({
        data: {
          conversationId: conv.id,
          senderType: SenderType.AI,
          content: aiReply
        }
      })

      return {
        ...conv,
        messages: [userMessage, aiMessage]
      }
    })

   const payloadToFe = {
    conversationId: conversation.id,
    status: conversation.status,

    userMessage: {
        id: conversation.messages[0].id,
        content: conversation.messages[0].content,
        createdAt: conversation.messages[0].createdAt
    },
  
    aiReply: {
        id: conversation.messages[1]?.id,
        content: aiReply,
        createdAt: new Date()
    }
};
    return successResponse("Conversation created", 
      payloadToFe
    )

  } catch (error) {
    console.error(error)
    return errorResponse("Failed to create conversation", 500)
  }
}