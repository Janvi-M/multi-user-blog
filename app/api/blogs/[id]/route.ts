import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Blog from "@/models/blog"

// GET /api/blogs/[id] - Get a specific blog
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const blog = await Blog.findById(params.id)
      .populate("author", "name avatar bio")

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    // Only show published blogs to non-authors
    const session = await getServerSession()
    if (blog.status === "draft" && (!session || session.user.id !== blog.author._id.toString())) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    // Increment views for published blogs
    if (blog.status === "published") {
      blog.views += 1
      await blog.save()
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Get blog error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// PUT /api/blogs/[id] - Update a blog
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await dbConnect()
    const blog = await Blog.findById(params.id)

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    if (blog.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, content, excerpt, category, tags, coverImage, status } = await req.json()

    if (!title || !content || !excerpt || !category) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      )
    }

    blog.title = title
    blog.content = content
    blog.excerpt = excerpt
    blog.category = category
    blog.tags = tags
    blog.coverImage = coverImage
    blog.status = status
    blog.readTime = Math.ceil(content.split(" ").length / 200)

    await blog.save()

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Update blog error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

// DELETE /api/blogs/[id] - Delete a blog
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await dbConnect()
    const blog = await Blog.findById(params.id)

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    if (blog.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await blog.deleteOne()

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Delete blog error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
} 