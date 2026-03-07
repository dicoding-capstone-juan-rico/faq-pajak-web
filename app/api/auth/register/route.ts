import bcrypt from "bcrypt"
import { dbCon } from "@/lib/dbConnection"
import { z } from "zod"
import { successResponse,errorResponse } from "@/lib/response"

const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
  name: z.string().min(2).max(100)
})

type RegisterRequest = z.infer<typeof RegisterSchema>
export async function POST(req: Request) {
  try {
    const parsed = RegisterSchema.safeParse(await req.json())


     if (!parsed.success) {
    return errorResponse(parsed.error.message, 400)
  }
    const { email, password, name } = parsed.data as RegisterRequest

    const existingUser = await dbCon.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return errorResponse("Email already in used", 409)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await dbCon.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })

    return successResponse("User registered successfully", { id: user.id, email: user.email, name: user.name }, 201)

  } catch (error) {
    console.error(error)
    return errorResponse("Internal Server Error", 500)
  }
}