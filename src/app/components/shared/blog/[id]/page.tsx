"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useSession } from "next-auth/react";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

const BlogPage = () => {
  const { id } = useParams() as { id?: string };
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || null;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingLike,setProcessingLike] = useState(false);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch the post!");
      }
      const data = await res.json();
      setBlog(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    
    if(!blog || !userId || processingLike) return;

    setProcessingLike(true);
    try{
        setBlog((prev) => prev? 
        {
            ...prev,
            isLiked : !prev.isLiked,
            likes : prev.isLiked ? prev.likes-1 : prev.likes+1
        } : prev);

        const res = await fetch(`/api/posts/like`,{
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({postId : blog.id, userId})
        })
        if (!res.ok) {
            throw new Error("Failed to update like status!");
          }
    }catch(err){
        console.error(err);

        setBlog((prev) => prev? 
        {
            ...prev,
            isLiked : !prev.isLiked, 
            likes : !prev.isLiked ? prev.likes - 1 : prev.likes + 1 
        } : prev);
    }finally{
        setProcessingLike(false);
    }
  };

  const goBack = () => window.history.back();

  useEffect(() => {
    if (!id) return;
    fetchBlogPost();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  //--CHECK ON SKELETON--
  if (loading)
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4 rounded-lg" />
          <Skeleton className="h-6 w-1/2 rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-5/6 rounded-lg" />
            <Skeleton className="h-5 w-4/6 rounded-lg" />
            <Skeleton className="h-5 w-3/6 rounded-lg" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 text-center bg-gray-900 text-white rounded-lg shadow-lg">
        <p className="text-red-500 mb-4 text-lg font-semibold">{error}</p>
        <Button onClick={fetchBlogPost} variant="outline">
          Retry
        </Button>
      </div>
    );

  if (!blog)
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 text-center bg-gray-900 text-white rounded-lg shadow-lg">
        <p className="text-lg">No blog found.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <Button variant="outline" className="mb-4" onClick={goBack}>
        ← Back
      </Button>
      <h1 className="text-4xl font-bold mb-3">{blog.title}</h1>
      <p className="text-gray-400 text-sm mb-5">
        By <span className="font-semibold">{blog.author}</span> |{" "}
        {formatDate(blog.createdAt)}
      </p>
      <Card className="bg-gray-800 p-5 rounded-lg">
        <CardContent>
          <p className="text-lg mb-3 font-semibold">{blog.description}</p>
          <p className="text-gray-300 leading-relaxed">{blog.content}</p>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center gap-4">
        <Button
          variant="outline"
          className={`px-4 py-2 rounded-lg ${
            blog.isLiked ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={toggleLike}
          disabled={!userId || processingLike}
        >
          {blog.isLiked ? "Unlike" : "Like"} ({blog.likes})
        </Button>
      </div>
    </div>
  );
};

export default BlogPage;