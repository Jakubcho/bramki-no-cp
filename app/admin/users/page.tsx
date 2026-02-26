import { prismaCore } from "@/lib/prisma-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UsersTable from "./UsersTable";
import NewUserForm from "./NewUserForm";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const users = await prismaCore.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-800">
          Użytkownicy
        </h1>
        <p className="text-slate-500 text-sm">
          Zarządzanie dostępem do panelu
        </p>
      </div>

      {session.user.role === "ADMIN" && (
        <div className="max-w-4xl">
          <h2 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
            Nowy użytkownik
          </h2>
          <NewUserForm />
        </div>
      )}

      <UsersTable
        users={users}
        currentUserId={session.user.id}
        isAdmin={session.user.role === "ADMIN"}
      />
    </div>
  );
}
