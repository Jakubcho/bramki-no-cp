"use client";

type User = {
  id: string;
  email: string;
  role: "ADMIN" | "EDITOR";
};

export default function UsersTable({
  users,
  currentUserId,
  isAdmin,
}: {
  users: User[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  async function deleteUser(id: string) {
    if (!confirm("Na pewno usunąć użytkownika?")) return;

    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
    });

    location.reload();
  }

  async function toggleRole(id: string, role: User["role"]) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: role === "ADMIN" ? "EDITOR" : "ADMIN",
      }),
    });

    location.reload();
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b">
            <th className="px-6 py-3 text-xs font-bold uppercase text-slate-400">
              Email
            </th>
            <th className="px-6 py-3 text-xs font-bold uppercase text-slate-400">
              Rola
            </th>
            <th className="px-6 py-3 text-xs font-bold uppercase text-slate-400 text-right">
              Akcje
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium">{u.email}</td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black ${u.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-amber-100 text-amber-700"
                    }`}
                >
                  {u.role}
                </span>
              </td>

              <td className="px-6 py-4 text-right space-x-2">
                {isAdmin && u.id !== currentUserId && (
                  <>
                    <button
                      onClick={() => toggleRole(u.id, u.role)}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Zmień rolę
                    </button>

                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="p-12 text-center text-slate-400 italic">
          Brak użytkowników
        </div>
      )}
    </div>
  );
}
