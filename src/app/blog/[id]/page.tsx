"use client";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  tags?: string[];
  likes?: number;
  comments?: string[];
  likedBy?: string[];
}

interface Comment {
  _id: string;
  content: string;
  author: string;
  post: string;
  createdAt: string;
}

const getPost = async (id: string): Promise<Post | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
  if (!res.ok) return null;
  return res.json();
};

const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch comments:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    return data.success && data.comments ? data.comments : [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};



const BlogPost = () => {
  const params = useParams();
  const postId = params.id as string;

  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [post, setPost] = useState<Post | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  
  const fetchUpdatedPost = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`);
      const updatedPost = await res.json();
  
      if (updatedPost.success) {
        setLikes(updatedPost.post.likes);
        setHasLiked(updatedPost.post.likedBy.includes(userId));
      }
    } catch (error) {
      console.error("Error fetching updated post:", error);
    }
  };
  

  const fetchPost = async (): Promise<void> => {
    const data = await getPost(postId);
    if (!data) return;
    setPost(data);
    setLikes(data.likes || 0);

    if (userId && data.likedBy) {
      const likedByStrings = data.likedBy.map((id: any) => id.toString());
      setHasLiked(likedByStrings.includes(userId.toString()));
    }
  };

  const fetchComments = async (): Promise<void> => {
    if (!postId) return;
    const commentsData = await getComments(postId);
    setComments(commentsData);
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId, userId]);

  const handleLikeToggle = async (): Promise<void> => {
    if (!userId) {
      alert("Please log in first!");
      return;
    }
  
    try {
      setIsLoading(true);
  
      const method = hasLiked ? "DELETE" : "PATCH";
      console.log("Sending like request:", { method, userId, postId });
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            id: userId,
          },
          body: JSON.stringify({ postId, userId }),
        }
      );
  
      const data = await res.json();
      console.log("Like response:", data);
  
      if (data.success) {
        // Refetch the post to get updated likes
        fetchUpdatedPost();
      } else {
        console.error("Like error:", data.message);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleComment = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!userId) {
      alert("Please log in first!");
      return;
    }

    if (!commentText.trim()) return;

    try {
      setIsLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            id: userId,
          },
          body: JSON.stringify({
            postId,
            comment: commentText,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setCommentText("");
        fetchComments();
      } else {
        console.error("Failed to add comment:", data.message);
        alert(`Failed to add comment: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Error adding comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string): Promise<void> => {
    if (!userId) {
      alert("Please log in first!");
      return;
    }

    try {
      setDeleteCommentId(commentId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            id: userId,
          },
          body: JSON.stringify({ postId, commentId }),
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchComments();
      } else {
        console.error("Failed to delete comment:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setDeleteCommentId(null);
    }
  };

  if (!post)
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading post...</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 animate-fade-in">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 text-white">{post.title}</h1>
      <p className="text-gray-400 mb-6 text-sm italic">
        Published on {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* Content */}
      <div className="text-lg leading-relaxed text-gray-300 mb-8">
        {post.content}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Like Button */}
      {userId ? (
        <button
          onClick={handleLikeToggle}
          disabled={isLoading}
          className={`mt-4 px-4 py-2 ${
            hasLiked
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-blue-500 hover:bg-blue-600"
          } transition-all text-white rounded-md shadow-md ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Processing..." : hasLiked ? "Unlike" : "Like"} ({likes})
        </button>
      ) : (
        <p className="mt-4 text-gray-400">Login to like this post</p>
      )}

      {/* Comments Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Comments ({comments.length})
        </h3>

        {/* Comment Input */}
        {userId && (
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500 text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !commentText.trim()}
              className={`mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 transition-all text-white rounded-md shadow-md ${
                isLoading || !commentText.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? "Posting..." : "Post Comment"}
            </button>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="p-4 bg-gray-800 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-300">{comment.content}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Delete Comment Button - only shown for comment author */}
                  {userId === comment.author && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      disabled={deleteCommentId === comment._id}
                      className="text-red-400 hover:text-red-300 text-sm ml-2"
                    >
                      {deleteCommentId === comment._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
