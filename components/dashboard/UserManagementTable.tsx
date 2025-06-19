"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { updateUser, deleteUser } from '@/actions/actions'
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import { Shield, User, Trash2, Edit } from 'lucide-react'

interface User {
  id: string
  firstname: string
  lastname: string
  username: string
  email: string
  role: string
  createdAt: Date
}

interface UserManagementTableProps {
  users: User[]
}

export default function UserManagementTable({ users }: UserManagementTableProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleUpdate = async (formData: FormData) => {
    const result = await updateUser(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('User updated successfully')
      setIsEditDialogOpen(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await deleteUser(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('User deleted successfully')
      }
    }
  }

  const admins = users.filter(u => u.role === 'admin')
  const normalUsers = users.filter(u => u.role !== 'admin')

  return (
    <div className="space-y-8">
      {/* Admin Table */}
      <div>
        <div className="flex items-center mb-4 p-4">
          <Shield className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-blue-700">Administrators</h2>
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
            {admins.length} users
          </Badge>
        </div>
        <div className="rounded-lg border p-4 border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[25%]">Name</TableHead>
                <TableHead className="w-[15%]">Username</TableHead>
                <TableHead className="w-[25%]">Email</TableHead>
                <TableHead className="w-[15%]">Role</TableHead>
                <TableHead className="w-[15%]">Created At</TableHead>
                <TableHead className="w-[15%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium">
                    {user.firstname} {user.lastname}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="flex items-center w-fit">
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setSelectedUser(null)
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                              Edit
                            </span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Edit className="h-5 w-5 mr-2" />
                              Edit User
                            </DialogTitle>
                          </DialogHeader>
                          <form action={handleUpdate} className="space-y-4">
                            <input type="hidden" name="id" value={user.id} />
                            <div className="grid gap-2">
                              <Label htmlFor="firstname">First Name</Label>
                              <Input
                                id="firstname"
                                name="firstname"
                                defaultValue={user.firstname}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="lastname">Last Name</Label>
                              <Input
                                id="lastname"
                                name="lastname"
                                defaultValue={user.lastname}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                name="username"
                                defaultValue={user.username}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="role">Role</Label>
                              <Select name="role" defaultValue={user.role} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">Save Changes</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Delete
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Normal Users Table */}
      <div>
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 text-green-600 mr-2 p-4" />
          <h2 className="text-lg font-semibold text-green-700">Regular Users</h2>
          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
            {normalUsers.length} users
          </Badge>
        </div>
        <div className="rounded-lg border p-4 border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[25%]">Name</TableHead>
                <TableHead className="w-[15%]">Username</TableHead>
                <TableHead className="w-[25%]">Email</TableHead>
                <TableHead className="w-[15%]">Role</TableHead>
                <TableHead className="w-[15%]">Created At</TableHead>
                <TableHead className="w-[15%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {normalUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium">
                    {user.firstname} {user.lastname}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center w-fit">
                      <User className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setSelectedUser(null)
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                              Edit
                            </span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Edit className="h-5 w-5 mr-2" />
                              Edit User
                            </DialogTitle>
                          </DialogHeader>
                          <form action={handleUpdate} className="space-y-4">
                            <input type="hidden" name="id" value={user.id} />
                            <div className="grid gap-2">
                              <Label htmlFor="firstname">First Name</Label>
                              <Input
                                id="firstname"
                                name="firstname"
                                defaultValue={user.firstname}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="lastname">Last Name</Label>
                              <Input
                                id="lastname"
                                name="lastname"
                                defaultValue={user.lastname}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                name="username"
                                defaultValue={user.username}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="role">Role</Label>
                              <Select name="role" defaultValue={user.role} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">Save Changes</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Delete
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}