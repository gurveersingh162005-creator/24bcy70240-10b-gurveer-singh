"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  description: string;
  authorName: string;
  createdAt: string;
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('/api/posts');
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-10">Loading posts...</div>;

  if (posts.length === 0) {
    return <div className="text-center py-10 text-gray-500">No posts found.</div>;
  }

  return (
    <div className="grid gap-4 max-w-2xl mx-auto py-8 px-4">
      {posts.map((post) => (
        <div key={post._id} className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-4">{post.description}</p>
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>By {post.authorName}</span>
            <Link href={`/posts/${post._id}`} className="text-blue-500 hover:underline">
              View Post
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}