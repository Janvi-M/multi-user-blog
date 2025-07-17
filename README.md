# Multi-User Blog Platform

A modern, full-stack blog platform built with Next.js, MongoDB, and NextAuth.js. Supports multiple users, authentication, blog CRUD, and a beautiful pastel-themed UI.

## Features

- User authentication (signup, login, logout) with NextAuth.js
- Secure password hashing
- Create, read, update, and delete (CRUD) blog posts
- Each blog post has a title, excerpt, content, category, tags, cover image, and status (draft/published)
- Only published blogs are visible to all users; drafts are private to the author
- Pagination, filtering, and search by topic
- Dashboard for users to view their own blogs
- Professional, pastel-themed UI/UX

## Tech Stack
- Next.js 15 (App Router, TypeScript)
- MongoDB & Mongoose
- NextAuth.js (credentials provider)
- Tailwind CSS

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/multi-user-blog.git
cd multi-user-blog
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/multi-user-blog
JWT_SECRET=your-random-jwt-secret
NEXTAUTH_SECRET=your-random-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```
Generate secrets with:
```bash
openssl rand -base64 32
```

### 4. Start the development server
```bash
pnpm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Sign up for a new account or log in.
- Create new blog posts from the "New Post" page.
- View all blogs on the homepage.
- View your own blogs on the dashboard.
- Click "Read More" to view full blog posts.

## Folder Structure
- `app/` - Next.js app directory (pages, API routes)
- `models/` - Mongoose models for User and Blog
- `lib/` - Database connection logic
- `components/` - Reusable UI components
- `contexts/` - React context for authentication

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE) 