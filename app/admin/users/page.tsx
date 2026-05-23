"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  plan: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    plan: null as string | null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Error al cargar usuarios");
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role,
      plan: user.plan,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar usuario");
      }

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser.user : u)));
      setSuccess("Usuario actualizado correctamente");
      setEditingUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (userId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
      return;
    }
    handleDeleteUser(userId);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setSubmitting(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar usuario");
      }

      setUsers(users.filter((u) => u.id !== userId));
      setSuccess("Usuario eliminado correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === "admin") return "bg-purple-100 text-purple-800 border-purple-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getPlanBadgeColor = (plan: string | null) => {
    if (plan === "premium") return "bg-amber-100 text-amber-800 border-amber-200";
    if (plan === "pro") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <main className="min-h-screen bg-[#fffdf9] p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/admin"
          className="text-[#8a2638] hover:text-[#d8a7b1] font-semibold mb-6 inline-block"
        >
          ← Volver al panel
        </Link>

        <h1 className="text-4xl font-bold text-[#151111] mb-4">Gestión de Usuarios</h1>
        <p className="text-[#b8a9a6] text-lg mb-8">
          Administra usuarios, roles y permisos. Gestiona suscripciones y consultoras asociadas.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a2638] mx-auto mb-4"></div>
            <p className="text-[#b8a9a6]">Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#eadbd4] p-12 text-center">
            <p className="text-[#8a9099]">No hay usuarios registrados.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#eadbd4] overflow-hidden">
            {/* Tabla responsive */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f5ebe0] border-b border-[#eadbd4]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#151111]">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#151111]">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#151111]">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#151111]">
                      Suscripción
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#151111]">
                      Registro
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#151111]">
                      Última actualización
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#151111]">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`border-b border-[#eadbd4] hover:bg-[#faf5f1] transition ${
                        idx % 2 === 0 ? "bg-white" : "bg-[#fefaf6]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#151111]">
                          {user.name || "Sin nombre"}
                        </p>
                        <p className="text-xs text-[#8a9099] mt-1">{user.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[#151111]">{user.email || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role === "admin" ? "ADMIN" : "USER"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPlanBadgeColor(
                            user.plan
                          )}`}
                        >
                          {user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : "Basic"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#8a9099]">
                        {new Date(user.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#8a9099]">
                        {new Date(user.updatedAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200 font-medium transition disabled:opacity-50"
                            disabled={submitting}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user.id)}
                            className="px-3 py-1 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200 font-medium transition disabled:opacity-50"
                            disabled={submitting}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resumen */}
            <div className="bg-[#f5ebe0] border-t border-[#eadbd4] px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#8a9099]">
                    Total de usuarios: <span className="font-semibold text-[#151111]">{users.length}</span>
                  </p>
                </div>
                <div className="text-xs text-[#8a9099]">
                  <span className="font-semibold">
                    {users.filter((u) => u.role === "admin").length}
                  </span>
                  {" administrador(es) - "}
                  <span className="font-semibold">
                    {users.filter((u) => u.plan !== null).length}
                  </span>
                  {" usuario(s) de pago"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg border border-[#eadbd4] p-8 max-w-md w-full shadow-lg">
              <h2 className="text-2xl font-bold text-[#151111] mb-6">Editar Usuario</h2>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#151111] mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638] text-[#151111]"
                    placeholder="Nombre del usuario"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#151111] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638] text-[#151111]"
                    placeholder="email@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#151111] mb-2">
                    Rol
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638] text-[#151111]"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#151111] mb-2">
                    Suscripción
                  </label>
                  <select
                    value={formData.plan ?? "basic"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        plan: e.target.value === "basic" ? null : e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638] text-[#151111]"
                  >
                    <option value="basic">Basic (sin plan)</option>
                    <option value="pro">Pro</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#8a2638] text-white rounded-lg font-semibold hover:bg-[#6b1f2f] transition disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
