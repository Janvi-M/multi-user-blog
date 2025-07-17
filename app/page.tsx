"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Clock, Eye, ArrowRight } from "lucide-react"

interface Blog {
  _id: string
  title: string
  excerpt: string
  author: {
    _id: string
    name: string
    avatar?: string
  }
  tags: string[]
  category: string
  coverImage?: string
  readTime: number
  views: number
  createdAt: string
}

interface BlogResponse {
  blogs: Blog[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  useEffect(() => {
    fetchBlogs()
  }, [currentPage, searchTerm])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "6",
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/blogs?${params}`)
      if (response.ok) {
        const data: BlogResponse = await response.json()
        setBlogs(data.blogs)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchBlogs()
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Welcome to BlogSpace
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover amazing stories, share your thoughts, and connect with writers from around the world.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400"
            />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Search
          </Button>
        </form>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-white/80 backdrop-blur-sm border-purple-100 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <Card
              key={blog._id}
              className="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300 group"
            >
              {blog.coverImage && (
                <div className="h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={blog.coverImage || "/placeholder.svg"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={blog.author.avatar || "/placeholder.svg"} alt={blog.author.name} />
                    <AvatarFallback className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {blog.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{blog.author.name}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
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
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {blog.tags.slice(0, 2).map((tag) => (
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
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found. Be the first to write one!</p>
            <Button
              asChild
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Link href="/write">Write Your First Blog</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border-purple-200 hover:bg-purple-50"
          >
            Previous
          </Button>

          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={() => setCurrentPage(pageNum)}
                className={
                  currentPage === pageNum
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "border-purple-200 hover:bg-purple-50"
                }
              >
                {pageNum}
              </Button>
            )
          })}

          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))}
            disabled={currentPage === pagination.pages}
            className="border-purple-200 hover:bg-purple-50"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
