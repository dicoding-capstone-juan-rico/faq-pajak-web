import { dbCon } from "@/lib/dbConnection"
import { successResponse, errorResponse } from "@/lib/response"
import jwt from "jsonwebtoken"
import { SenderType } from "@prisma/client"
import { ConversationStatus } from "@/app/generated/prisma/client"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const AI_API_URL = process.env.AI_API_URL
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

    const { conversationId } = await params

    const conversation = await dbCon.conversation.findUnique({
      where: { id: conversationId }
    })

  

    if (!conversation) {
      return errorResponse("Conversation not found", 404)
    }
     await dbCon.conversation.update({
    where: { 
      id: conversationId 
    },
    data: {
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
    },
})
    
    const userMessage = await dbCon.message.create({
      data: {
        conversationId,
        senderType: SenderType.USER,
        senderId: userId,
        content
      }
    })
    console.log("sending to ai:", content)
    let aiReply: string
    let conversationStatus = conversation.status

    try {

      const aiRes = await fetch(
        AI_API_URL + "/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: content
          })
        }
      )
      if (!aiRes.ok) {
        throw new Error("AI service error")
      }

      const aiData = await aiRes.json()
      console.log("AI response:", aiData)
          aiReply =
        aiData.answer ||
        "[205]"
      const isHumanAgent = aiReply.includes("[205]")
      if (isHumanAgent) {
        aiReply = "Mohon tunggu sebentar, pertanyaan Anda sedang kami teruskan ke agent."
        conversationStatus = ConversationStatus.WAITING_AGENT
      }
  

    } catch (error) {

      console.error("AI error:", error)

      aiReply =
        "Mohon tunggu sebentar, Anda sedang diarahkan ke agent."

      conversationStatus = ConversationStatus.WAITING_AGENT
    }

    const aiMessage = await dbCon.message.create({
      data: {
        conversationId,
        senderType: SenderType.AI,
        content: aiReply
      }
    })

    await dbCon.conversation.update({
      where: { id: conversationId },
      data: {
        status: conversationStatus,
        lastMessageAt: new Date()
      }
    })
    const payloadToFe = {
      conversationId: conversation.id,
      status: conversation.status,
      userMessage:{
        id : userMessage.id,
        content: userMessage.content,
        createdAt: userMessage.createdAt
      },
      aiReply:{
        id: aiMessage.id,
        content: aiMessage.content,
        createdAt: aiMessage.createdAt
      }
    }

    return successResponse("Message sent", 
      payloadToFe
    )

  } catch (error) {
    console.error(error)
    return errorResponse("Failed to send message", 500)
  }
}

