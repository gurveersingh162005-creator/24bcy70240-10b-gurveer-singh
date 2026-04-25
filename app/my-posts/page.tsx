"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';

interface Post {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuthStore();

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/api/posts/mine');
      setPosts(data.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/posts', { title, description });
      setTitle('');
      setDescription('');
      toast.success('Post created!');
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/posts/${id}`);
      toast.success('Post deleted!');
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-10 text-gray-500">
        Please log in to manage your posts.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Posts</h1>

      <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex flex-col gap-4">
        <h2 className="font-semibold">Create New Post</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={3}
          className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
        <button
          type="submit"
          className="bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Create Post
        </button>
      </form>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No posts yet. Create one!</div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <button
                onClick={() => handleDelete(post._id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}