import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/user"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    await dbConnect()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const user = await User.create({
      name,
      email,
      password
    })

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    )
  }
}
