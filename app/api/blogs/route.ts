import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/mongodb"
import Blog from "@/models/blog"

// GET /api/blogs - Get all published blogs with pagination and filtering
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const author = searchParams.get("author")

    await dbConnect()

    const query: any = {}
    if (category) query.category = category
    if (author) query.author = author
    if (search) {
      query.$text = { $search: search }
    }

    const skip = (page - 1) * limit
    const blogs = await Blog.find(query)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Blog.countDocuments(query)

    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Get blogs error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// POST /api/blogs - Create a new blog
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, content, excerpt, category, tags, coverImage } = await req.json()

    if (!title || !content || !excerpt || !category) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      )
    }

    await dbConnect()

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      category,
      tags,
      coverImage,
      author: session.user.id,
      readTime: Math.ceil(content.split(" ").length / 200) // Assuming 200 words per minute
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error("Create blog error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
