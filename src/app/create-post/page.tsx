"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function CreatePost() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          id: userId,
          role: (session?.user as any)?.role || "user",
        },
        body: JSON.stringify({ 
          title, 
          content, 
          tags: tags ? tags.split(",").map(tag => tag.trim()) : [] 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccess("Post created successfully!");
      setTitle("");
      setContent("");
      setTags("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 px-4">
      <Card className="w-full max-w-2xl p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold text-white">Create a New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-lg font-medium">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="mt-2 bg-gray-800 border-gray-700 text-white focus:border-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-lg font-medium">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter post content"
                rows={4}
                className="mt-2 bg-gray-800 border-gray-700 text-white focus:border-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="tags" className="text-lg font-medium">Tags (comma-separated)</Label>
              <Input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. tech, programming, react"
                className="mt-2 bg-gray-800 border-gray-700 text-white focus:border-blue-500"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="flex items-center gap-2 bg-red-800 border-red-700 text-white">
                <AlertCircle className="w-5 h-5" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="default" className="flex items-center gap-2 bg-green-800 border-green-700 text-white">
                <CheckCircle className="w-5 h-5" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
