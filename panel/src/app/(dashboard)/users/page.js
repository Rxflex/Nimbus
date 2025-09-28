'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/use-users';

export default function UsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: ''
  });

  const { data: users = [], isLoading } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingUser) {
      updateUserMutation.mutate(
        { id: editingUser._id, data: formData },
        {
          onSuccess: () => {
            setShowModal(false);
            setEditingUser(null);
            resetForm();
          }
        }
      );
    } else {
      createUserMutation.mutate(formData, {
        onSuccess: () => {
          setShowModal(false);
          resetForm();
        }
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    deleteUserMutation.mutate(id);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email || '',
      role: user.role,
      password: ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      role: 'user',
      password: ''
    });
  };

  if (isLoading && !users.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Users</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage system users and permissions</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
          ➕ Add User
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {user.email || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => (
          <Card key={user._id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{user.username}</h3>
                    <p className="text-sm text-muted-foreground">{user.email || 'N/A'}</p>
                  </div>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                    {user.role}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Created</p>
                  <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user details' : 'Create a new system user'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password {editingUser && '(leave empty to keep current)'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!editingUser}
                placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
              />
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setEditingUser(null);
                  resetForm();
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createUserMutation.isPending || updateUserMutation.isPending}
                className="w-full sm:w-auto"
              >
                {createUserMutation.isPending || updateUserMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
