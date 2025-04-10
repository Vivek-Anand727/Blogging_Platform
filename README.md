# Next.js Blog Project

## 🚀 Overview
This is a fully functional and optimized blog website built with **Next.js**. The project follows best practices and includes features such as authentication, full-text search, caching, infinite scrolling, and dark mode.

## 🎯 Features
- **Next.js 14 with App Router**
- **Server-side Rendering (SSR) & Static Site Generation (SSG)**
- **Authentication with NextAuth**
- **Redux Toolkit for state management**
- **MongoDB with Mongoose ORM**
- **Full-text search using MongoDB text indexing**
- **Optimistic UI updates**
- **Debounced search with dropdown suggestions**
- **Infinite scrolling for posts**
- **Caching with Upstash Redis**
- **Dark mode support with Theme Toggle**
- **Skeleton loading for improved UX**
- **Smooth animations & elegant UI using Tailwind CSS & ShadCN**

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, ShadCN
- **Backend:** Next.js API Routes, MongoDB, Upstash Redis
- **Authentication:** NextAuth.js
- **State Management:** Redux Toolkit
- **Deployment:** Vercel

## 📂 Folder Structure
```
📦 nextjs-blog
├── 📂 app                # Next.js App Router structure
│   ├── 📂 api            # API routes
│   ├── 📂 posts          # Blog pages
│   ├── 📂 auth           # Authentication pages
│   ├── 📂 search         # Search functionality
│   ├── layout.tsx        # Main layout
│   ├── page.tsx         # Homepage
├── 📂 components         # Reusable UI components
│   ├── 📂 shared        # Shared components (Navbar, Footer, DarkModeToggle)
├── 📂 hooks              # Custom hooks (useFetchPosts, useDebounce, etc.)
├── 📂 lib                # Utility functions (caching, fetching, etc.)
├── 📂 store              # Redux store configuration
├── 📂 styles             # Global styles
├── .env.local            # Environment variables
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── README.md             # Project documentation
```

## 🏗️ Setup & Installation
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/nextjs-blog.git
cd nextjs-blog
```

### 2️⃣ Install Dependencies
```sh
npm install
# or
pnpm install
```

### 3️⃣ Setup Environment Variables
Create a `.env.local` file and add the necessary environment variables:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
UPSTASH_REDIS_URL=your_upstash_redis_url
```

### 4️⃣ Run the Development Server
```sh
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ API Routes
| Method | Endpoint            | Description |
|--------|---------------------|-------------|
| `POST` | `/api/posts/like`   | Like a post |
| `POST` | `/api/posts/comments` | Add a comment |
| `GET`  | `/api/search`       | Full-text search |
| `POST` | `/api/auth/signin`  | User login |
| `POST` | `/api/auth/signout` | User logout |

## 📌 Upcoming Features
- **Admin Dashboard** (For managing posts & users)
- **Email Notifications** using Nodemailer
- **Post Categories & Tags**
- **Image Uploads for Blog Posts**

## 📜 License
This project is open-source and available under the MIT License.

## 💡 Contributing
If you have suggestions or improvements, feel free to open an issue or submit a pull request.

---

🚀 **Built with passion and Next.js!**
