"use client"

type User = {
  id: string
  firstname: string
  lastname: string
  username: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

export default function UserManagementTable({ users }: { users: User[] }) {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th>ชื่อ</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>สร้างเมื่อ</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.firstname} {user.lastname}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{new Date(user.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
} 