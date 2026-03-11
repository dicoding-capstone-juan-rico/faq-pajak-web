

import { dbCon } from "@/lib/dbConnection"
import { successResponse, errorResponse } from "@/lib/response"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password) {
      return errorResponse("Email and password are required", 400)
    }

    const existingAdmin = await dbCon.user.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      return errorResponse("Admin already exists", 409)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await dbCon.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "ADMIN"
      }
    })

    return successResponse("Admin registered successfully", {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    })
  } catch (error) {
    console.error(error)
    return errorResponse("Internal server error", 500)
  }
}