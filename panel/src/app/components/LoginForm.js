'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogin } from '@/hooks/use-auth';

export default function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const loginMutation = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    loginMutation.mutate(formData, {
      onSuccess: (data) => {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify({ username: formData.username }));
        window.location.href = '/dashboard';
      },
      onError: (error) => {
        console.error('Login error:', error);
      }
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold">Nimbus Control Panel</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {loginMutation.error && (
              <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
                {loginMutation.error.message || 'Login failed'}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full"
            >
              {loginMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : null}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
