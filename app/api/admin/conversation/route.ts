import { dbCon } from "@/lib/dbConnection"
import { successResponse, errorResponse } from "@/lib/response"
import { ConversationStatus } from "@prisma/client"

const statusMap: Record<string, ConversationStatus[]> = {
  waiting: [ConversationStatus.WAITING_AGENT],
  active: [ConversationStatus.ACTIVE],
  resolved: [ConversationStatus.RESOLVED],
  all: [
    ConversationStatus.WAITING_AGENT,
    ConversationStatus.ACTIVE,
    ConversationStatus.RESOLVED
  ]
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get("cursor")
    const limit = Number(searchParams.get("limit") || 20)

    const statusParam = searchParams.get("status") as keyof typeof statusMap | null
    const filter = statusParam && statusMap[statusParam] ? statusMap[statusParam] : statusMap.all
    const conversations = await dbCon.conversation.findMany({
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor }
      }),
      where:{
        status:{
            in: filter
        }
      },
      orderBy: {
        lastMessageAt: "desc"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

    return successResponse("Conversations fetched", conversations)

  } catch (error) {
    console.error(error)
    return errorResponse("Failed to fetch conversations", 500)
  }
}