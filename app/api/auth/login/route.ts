import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { dbCon } from "@/lib/dbConnection"
import z from "zod"
import { successResponse, errorResponse } from "@/lib/response"

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

type LoginRequest = z.infer<typeof LoginSchema>

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = LoginSchema.safeParse(body)

    if (!parsed.success) {
        return errorResponse(parsed.error.message, 400)
    }

    const { email, password } = parsed.data as LoginRequest

    const user = await dbCon.user.findUnique({
      where: { email }
    })

    if (!user) {
      return errorResponse("Email not registered", 401)
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        return errorResponse("Invalid Password", 401)
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    )

    return successResponse("Login success", {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}