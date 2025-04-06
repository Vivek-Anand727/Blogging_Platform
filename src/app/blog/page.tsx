"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        if (!data.posts) throw new Error("Invalid API response");

        setPosts(data.posts);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center">🚀 Latest Blog Posts</h1>

      {loading ? (
        <p className="text-center text-lg animate-pulse">Loading posts...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post._id}`}>
              <div className="p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
                <p className="text-gray-400 text-sm mb-3">{post.content.substring(0, 100)}...</p>
                <span className="text-blue-400 text-sm">Read More →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg">No blogs available.</p>
      )}
    </div>
  );
};

export default Blog;
