"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";  

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { data: session } = useSession();  
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Auth Buttons */}
      <div className="flex justify-between mb-6">
        {/* Sign In/Sign Out Button */}
        {session ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut()}
            className="px-5 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-transform"
          >
            Sign Out
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signIn()}
            className="px-5 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-transform"
          >
            Sign In
          </motion.button>
        )}

        {/* Create Post Button */}
        {session && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/create-post")}
            className="px-5 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-transform"
          >
            + Create Post
          </motion.button>
        )}
      </div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white text-center py-20 px-6 rounded-lg shadow-lg backdrop-blur-lg bg-opacity-70"
      >
        <h1 className="text-5xl font-extrabold tracking-tight">
          Welcome to our <span className="text-yellow-300">BLOG</span>
        </h1>
        <p className="mt-4 text-lg text-gray-200">
          Discover the latest articles on web development and programming.
        </p>
      </motion.div>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => router.push(`/blog/${post._id}`)}
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {post.content.substring(0, 100)}...
              </p>
              <button className="mt-4 text-blue-500 hover:underline">
                Read More
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No blogs available</p>
        )}
      </div>
    </div>
  );
}
