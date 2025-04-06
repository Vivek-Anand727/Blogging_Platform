"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
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
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white text-center py-20 px-6 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Welcome to our <span className="text-yellow-300">BLOG</span>
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Discover the latest articles on web development and programming.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => router.push(`/blog/${post._id}`)}
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {post.content.substring(0, 100)}...
              </p>
              <button className="mt-4 text-blue-500 hover:underline">
                Read More
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No blogs available</p>
        )}
      </div>
    </div>
  );
}
