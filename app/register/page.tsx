"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import Link from 'next/link';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { setUser, setToken } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post('/api/auth/register', data);
      setUser(res.data.user);
      setToken(res.data.token);
      toast.success('Registered successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              {...register('name')}
              className="w-full border rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Jane Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              {...register('email')}
              className="w-full border rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="jane@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full border rounded-lg px-4 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-black font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}