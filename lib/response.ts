import { NextResponse } from "next/server"

interface ApiResponse<T = unknown> {
  message: string
  data?: T
}

export function successResponse<T>(
  message: string,
  data?: T,
  status: number = 200
) {
  const body: ApiResponse<T> = {
    message,
    data
  }

  return NextResponse.json(body, { status })
}

export function errorResponse(
  message: string,
  status: number = 500
) {
  const body: ApiResponse<null> = {
    message
  }

  return NextResponse.json(body, { status })
}