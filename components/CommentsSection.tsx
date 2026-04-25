"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
  _id: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await axios.post(`/api/posts/${postId}/comments`, { content });
      setContent('');
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Comments</h3>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          Post
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div key={comment._id} className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-800">{comment.content}</p>
              <span className="text-xs text-gray-400 mt-1 block">By {comment.authorName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}