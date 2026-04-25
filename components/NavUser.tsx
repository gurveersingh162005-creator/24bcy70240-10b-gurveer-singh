"use client";

import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const NavUser: React.FC = () => {
  const { user, setUser, setToken } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    setToken(null);
    router.push('/');
  };

  return (
    <div className="nav-user">
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hello, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default NavUser;