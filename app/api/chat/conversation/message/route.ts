import { dbCon } from "@/lib/dbConnection"
import { successResponse, errorResponse } from "@/lib/response"
import jwt from "jsonwebtoken"

export async function GET(req: Request) {

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

    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get("cursor")
    const limit = Number(searchParams.get("limit") || 20)

    // cari conversation user yang belum expired
    const conversation = await dbCon.conversation.findFirst({
      where: {
        userId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    })

    if (!conversation) {
      return successResponse("No active conversation", null)
    }

    const messages = await dbCon.message.findMany({
      where: {
        conversationId: conversation.id
      },
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor }
      }),
      orderBy: {
        createdAt: "desc"
      }
    })

    return successResponse("Conversation fetched", {
      conversation,
      messages
    })

  } catch (error) {

    console.error(error)
    return errorResponse("Failed to fetch conversation", 500)

  }
}