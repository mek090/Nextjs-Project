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
import {  updateUser, deleteUser } from '@/actions/actions'
import { format } from 'date-fns'



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
  // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)



  // // สร้าง
  // const handleCreate = async (formData: FormData) => {
  //   const result = await createUser(formData)
  //   if (result.error) {
  //     toast.error(result.error)
  //   } else {
  //     toast.success('User created successfully')
  //     setIsCreateDialogOpen(false)
  //   }
  // }


  //อัพเดต
  const handleUpdate = async (formData: FormData) => {
    const result = await updateUser(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('User updated successfully')
      setIsEditDialogOpen(false)
    }
  }


  //ลบ
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

  return (
    <div className="space-y-4">
      {/* <div className="flex justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" name="firstname" required />
              </div>
              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" name="lastname" required />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" required />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Create User</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div> */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstname} {user.lastname}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{format(new Date(user.createdAt), 'dd/MM/yyyy')}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                    setIsEditDialogOpen(open)
                    if (!open) setSelectedUser(null)
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      <form action={handleUpdate} className="space-y-4">
                        <input type="hidden" name="id" value={user.id} />
                        <div>
                          <Label htmlFor="firstname">First Name</Label>
                          <Input
                            id="firstname"
                            name="firstname"
                            defaultValue={user.firstname}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastname">Last Name</Label>
                          <Input
                            id="lastname"
                            name="lastname"
                            defaultValue={user.lastname}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            defaultValue={user.username}
                            required
                          />
                        </div>
                        <div>
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
                        <Button type="submit">Update User</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 