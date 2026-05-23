"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  day: string;
  month: string;
  year: string;
  relevanceScore: number;
  source: string;
  isMocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    day: "1",
    month: "1",
    year: new Date().getFullYear().toString(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [pagination.page, search]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/events?${params}`);
      if (!response.ok) throw new Error("Error al cargar eventos");

      const data = await response.json();
      setEvents(data.data);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.location) {
      setError("Nombre, categoría y ubicación son requeridos");
      return;
    }

    try {
      setSubmitting(true);
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/events/${editingId}` : "/api/admin/events";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorData.error || errorData.details || "Error al guardar evento");
      }

      handleCloseForm();
      await fetchEvents();
      setSuccess(editingId ? "Evento actualizado" : "Evento creado");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      name: event.name,
      description: event.description,
      category: event.category,
      location: event.location,
      day: event.day,
      month: event.month,
      year: event.year,
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("¿Eliminar este evento?")) return;

    try {
      setDeleting(eventId);
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorData.error || errorData.details || "Error al eliminar evento");
      }
      setEvents(events.filter((e) => e.id !== eventId));
      setSuccess("Evento eliminado");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      category: "",
      location: "",
      day: "1",
      month: "1",
      year: new Date().getFullYear().toString(),
    });
  };

  const formatDate = (day: string, month: string, year: string) => {
    const monthIndex = parseInt(month) - 1;
    const monthName = MONTHS[monthIndex] || "Mes";
    return `${day} de ${monthName} de ${year}`;
  };

  return (
    <main className="min-h-screen bg-[#fffdf9] p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/admin"
          className="text-[#8a2638] hover:text-[#d8a7b1] font-semibold mb-6 inline-block"
        >
          ← Volver al panel
        </Link>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#151111] mb-4">Gestión de Eventos</h1>
            <p className="text-[#b8a9a6] text-lg">
              Crea, edita y controla eventos del calendario de la industria de la moda.
            </p>
          </div>
          <button
            onClick={() => {
              handleCloseForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-[#8a2638] text-white rounded-lg hover:bg-[#a0364e] font-medium transition"
          >
            + Nuevo evento
          </button>
        </div>

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

        {/* Formulario */}
        {showForm && (
          <div className="mb-8 bg-white rounded-lg border border-[#eadbd4] p-6">
            <h2 className="text-xl font-bold text-[#151111] mb-4">
              {editingId ? "Editar evento" : "Nuevo evento"}
            </h2>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre del evento"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-2 px-3 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                  required
                />

                <input
                  type="text"
                  placeholder="Categoría"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-3 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                  required
                />

                <input
                  type="text"
                  placeholder="Ubicación"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="px-3 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                  required
                />

                <textarea
                  placeholder="Descripción"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-2 px-3 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                  rows={3}
                />

                <div className="col-span-2 grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Día"
                    min="1"
                    max="31"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="px-3 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                    required
                  />

                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="px-3 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                    required
                  >
                    {MONTHS.map((m, idx) => (
                      <option key={m} value={(idx + 1).toString()}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Año"
                    min="2020"
                    max="2100"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="px-3 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-[#eadbd4]">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 border border-[#eadbd4] text-[#151111] rounded-lg hover:bg-[#f5f1f0] font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#8a2638] text-white rounded-lg hover:bg-[#a0364e] font-medium transition disabled:opacity-50"
                >
                  {submitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, categoría, ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-[#eadbd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a2638]"
          />
        </div>

        {/* Lista de eventos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a2638] mx-auto mb-4"></div>
            <p className="text-[#b8a9a6]">Cargando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#eadbd4] p-12 text-center">
            <p className="text-[#8a9099]">No hay eventos para mostrar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-[#8a9099] mb-6">
              Total: <span className="font-semibold text-[#151111]">{pagination.total}</span> eventos
            </div>

            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg border border-[#eadbd4] p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#151111] mb-2">
                      {event.name}
                    </h3>

                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-200">
                        {event.category}
                      </span>
                      {event.isMocked && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-semibold rounded border border-gray-200">
                          Simulado
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[#6d6260] mb-3">
                      {event.description}
                    </p>

                    <div className="text-xs text-[#8a9099] space-y-1">
                      <p>
                        <span className="font-semibold">📅 Fecha:</span>{" "}
                        {formatDate(event.day, event.month, event.year)}
                      </p>
                      <p>
                        <span className="font-semibold">📍 Ubicación:</span> {event.location}
                      </p>
                      <p>
                        <span className="font-semibold">📌 Fuente:</span> {event.source}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200 font-medium transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deleting === event.id}
                      className="px-3 py-1 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200 font-medium transition disabled:opacity-50"
                    >
                      {deleting === event.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="flex gap-2 justify-center mt-8">
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })
                  }
                  disabled={pagination.page === 1}
                  className="px-3 py-2 border border-[#eadbd4] rounded-lg hover:bg-[#f5f1f0] disabled:opacity-50 font-medium"
                >
                  ← Anterior
                </button>

                <div className="flex items-center gap-2 px-4 py-2">
                  <span className="text-[#8a9099]">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: Math.min(pagination.totalPages, pagination.page + 1),
                    })
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-2 border border-[#eadbd4] rounded-lg hover:bg-[#f5f1f0] disabled:opacity-50 font-medium"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
