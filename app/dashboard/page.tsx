"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchUserBlogs()
  }, [user])

  const fetchUserBlogs = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/blogs?author=${user.id}`)
      if (!res.ok) throw new Error("Failed to fetch blogs")
      const data = await res.json()
      setBlogs(data.blogs)
    } catch (err) {
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="text-center py-12">Please log in to view your dashboard.</div>

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">My Blogs</h1>
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">You haven't written any blogs yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <Card key={blog._id} className="bg-white/80 backdrop-blur-sm border-purple-100">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{blog.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{blog.readTime} min read</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{blog.views} views</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 ml-2">{blog.status}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {blog.tags?.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-purple-600 hover:text-purple-700">
                    <Link href={`/blog/${blog._id}`} className="flex items-center space-x-1">
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 