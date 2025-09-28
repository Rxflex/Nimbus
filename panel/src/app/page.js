'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './components/LoginForm';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If user is authenticated, redirect to dashboard
      router.push('/dashboard');
    }
  }, [router]);

  return <LoginForm />;
}