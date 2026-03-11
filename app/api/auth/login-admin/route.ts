import { dbCon } from "@/lib/dbConnection"
import { successResponse, errorResponse } from "@/lib/response"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return errorResponse("Email and password required", 400)
    }

    const admin = await dbCon.user.findUnique({
      where: { email }
    })

    if (!admin) {
      return errorResponse("Admin not found", 404)
    }

    if (admin.role !== "ADMIN") {
      return errorResponse("Not authorized as admin", 403)
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
      return errorResponse("Invalid password", 401)
    }

    const token = jwt.sign(
      {
        userId: admin.id,
        role: admin.role
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    )

    return successResponse("Login success", {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })

  } catch (error) {
    console.error(error)
    return errorResponse("Internal server error", 500)
  }
}