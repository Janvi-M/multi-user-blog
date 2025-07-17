
# 📝 Multi-User Blog Platform

A modern, full-stack **MNRN (MongoDB, Next.js, React, Node.js)** blog platform supporting multiple users, robust authentication, and full blog post management — all wrapped in a clean, pastel-themed UI.

---

## 🚀 Features

- 🔐 **User Authentication** with NextAuth.js (sign up, log in, log out)
- 🔒 **Secure Password Hashing** using bcrypt
- ✍️ **Blog CRUD Operations** (create, read, update, delete) for authenticated users
- 📚 Rich blog post schema including: `title`, `excerpt`, `content`, `category`, `tags`, `cover image`, and `status` (draft/published)
- 🌐 **Drafts** are private to the author; **published posts** are visible to all
- 🔍 **Search, Filter, and Pagination** by tags and categories
- 📊 Personalized **Dashboard** to manage your own posts
- 🎨 Fully responsive, pastel-themed UI for a clean reading and writing experience

---

## 🧠 Tech Stack (MNRN)

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React (via Next.js App Router)|
| Backend   | Node.js + Next.js API Routes  |
| Database  | MongoDB with Mongoose         |
| Auth      | NextAuth.js (Credentials Provider) |
| Styling   | Tailwind CSS                  |

---

## 📸 Screenshots

<div align="center">
  <img src="/Users/janvimunshi/Downloads/multi-user-blog/public/homescreen.png" alt="HomeScreen" width="700px">
</div>

---

## 🛠️ Getting Started

 1. Clone the Repository
 ```
git clone https://github.com/yourusername/multi-user-blog.git
cd multi-user-blog 
```

2. Install Dependencies
 ```
pnpm install
```

3. Set Up Environment Variables
Create a .env.local file in the root directory and add the following:

```
MONGODB_URI=mongodb://localhost:27017/multi-user-blog
JWT_SECRET=your-random-jwt-secret
NEXTAUTH_SECRET=your-random-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```
Generate secure secrets using:
```
openssl rand -base64 32
```
4. Start the Development Server
 ```
pnpm run dev
Visit: http://localhost:3000
```

## 🧪 Usage Guide


Register or log in with your credentials
Create blogs from the New Post page
View all published posts on the homepage
Manage your posts (edit/delete) via the Dashboard
Use search, filter, and pagination to explore blogs by topic or tag

## 📁 Project Structure

multi-user-blog/
├── app/           # Next.js App Router - pages, layouts, API routes
├── models/        # Mongoose schemas (User, Blog)
├── lib/           # MongoDB connection logic
├── components/    # Reusable UI components
├── contexts/      # Auth context for session handling
├── public/        # Static assets (images, screenshots)
└── styles/        # Tailwind and global styles

## 🔐 Security Practices

Passwords are hashed using bcrypt
Session management via NextAuth.js
.env.local is gitignored — secrets stay private
Never commit environment secrets to version control

## 📦 API Endpoints

Method	Route	Description
POST	/api/auth/signup	Register new user
GET	/api/blogs	Get all published blogs
POST	/api/blogs	Create new blog post
GET	/api/blogs/:id	Get blog by ID
PUT	/api/blogs/:id	Update blog (author only)
DELETE	/api/blogs/:id	Delete blog (author only)

## 💡 Core Logic Breakdown

### 🔐 Authentication
Email/password-based login with NextAuth.js
Passwords hashed with bcryptjs
JWT-based session tokens secured via JWT_SECRET and NEXTAUTH_SECRET

### ✍️ Blog Management
Only logged-in users can create, edit, or delete their posts
Blogs include structured fields: title, excerpt, content, tags, category, coverImage, and status
Drafts are private to the author
Published posts are public and searchable