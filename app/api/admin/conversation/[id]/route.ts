import { dbCon } from "@/lib/dbConnection"
import { successResponse, errorResponse } from "@/lib/response"

export async function GET(
  req: Request,
  // 1. Tipe datanya sekarang harus berupa Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 2. Await seluruh objek params-nya sebelum diambil id-nya
    const { id } = await params; 
    
    console.log(`=== ID PARAM === ${id}`); // Harus muncul ID yang benar sekarang

    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get("cursor")
    const limit = Number(searchParams.get("limit") || 20)

    const messages = await dbCon.message.findMany({
      where: {
        conversationId: id // 3. Gunakan 'id' yang sudah di-await
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