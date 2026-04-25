"use client";

import { useAuthStore } from '../store/useAuthStore';
import PostsList from '../components/PostsList';

export default function HomePage() {
  const { user, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <PostsList />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
          <h1 className="text-3xl font-bold">Welcome!</h1>
          <p className="text-gray-500">Please log in to see posts.</p>
        </div>
      )}
    </div>
  );
}