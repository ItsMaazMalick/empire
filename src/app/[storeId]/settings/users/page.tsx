import { getUsers } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { CreateUserModal } from "./create-user-modal";
import { getStoreFromSession, getUserFromSession } from "@/actions/session";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const users = await getUsers();
  const us = await getUserFromSession();

  if (!us) {
    return redirect("/auth/login");
  }

  return (
    <div className="p-4 lg:p-10 h-[calc(100vh-150px)] overflow-y-auto">
      {us.role === "MANAGER" && <CreateUserModal role={us.role} />}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            {us.role === "MANAGER" && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>{user.role}</TableCell>
              {us.role === "MANAGER" && (
                <TableCell className="text-right">
                  <CreateUserModal user={user} role={us.role} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
}
