"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye } from "lucide-react"

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/blogs/${id}`)
        if (!res.ok) throw new Error("Blog not found")
        const data = await res.json()
        setBlog(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchBlog()
  }, [id])

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>
  if (!blog) return <div className="text-center py-12">Blog not found.</div>

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
        {blog.coverImage && (
          <img src={blog.coverImage} alt={blog.title} className="w-full h-64 object-cover rounded-t-lg" />
        )}
        <CardHeader>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {blog.title}
          </h1>
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={blog.author?.avatar || "/placeholder.svg"} alt={blog.author?.name} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {blog.author?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-700 font-medium">{blog.author?.name}</span>
            <span className="text-gray-400 text-sm">{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime} min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views} views</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {blog.tags?.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </CardContent>
      </Card>
    </div>
  )
} 