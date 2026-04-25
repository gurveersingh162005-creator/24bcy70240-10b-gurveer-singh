"use client";

import Link from 'next/link';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AppHeader() {
  const { user, setUser, setToken } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    setToken(null);
    router.push('/');
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 border-b bg-white shadow-sm">
      <div className="flex gap-6">
        <Link href="/" className="font-bold text-lg">Home</Link>
        {user && (
          <Link href="/my-posts" className="text-gray-600 hover:text-black">
            My Posts
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-600 text-sm">Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}