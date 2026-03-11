import { dbCon } from "@/lib/dbConnection"
import { successResponse, errorResponse } from "@/lib/response"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {

    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get("cursor")
    const limit = Number(searchParams.get("limit") || 20)

    const messages = await dbCon.message.findMany({
      where: {
        conversationId: params.id
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

    return successResponse("Messages fetched", messages)

  } catch (error) {
    console.error(error)
    return errorResponse("Failed to fetch messages", 500)
  }
}