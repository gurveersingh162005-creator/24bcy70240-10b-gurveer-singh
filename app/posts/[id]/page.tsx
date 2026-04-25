"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import CommentsSection from '../../../components/CommentsSection';

interface Post {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${id}`);
        setPost(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!post) return <div className="text-center py-10 text-gray-500">Post not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white border rounded-2xl p-8 shadow-sm mb-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 leading-relaxed">{post.description}</p>
      </div>
      <CommentsSection postId={id as string} />
    </div>
  );
}