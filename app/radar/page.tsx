"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import PageContainer from "@/components/layout/PageContainer";
import { fashionResources } from "@/data/fashionRadarData";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: string;
  name: string;
  category: string;
  location: string;
  day: string;
  month: string;
  year: string;
  description: string;
  relevanceScore: number;
  source: string;
  isMocked: boolean;
  createdAt: string;
  updatedAt: string;
}

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const MONTHS = [
  { label: "Enero", short: "Ene" },
  { label: "Febrero", short: "Feb" },
  { label: "Marzo", short: "Mar" },
  { label: "Abril", short: "Abr" },
  { label: "Mayo", short: "May" },
  { label: "Junio", short: "Jun" },
  { label: "Julio", short: "Jul" },
  { label: "Agosto", short: "Ago" },
  { label: "Septiembre", short: "Sep" },
  { label: "Octubre", short: "Oct" },
  { label: "Noviembre", short: "Nov" },
  { label: "Diciembre", short: "Dic" },
];

const SELECTED_YEAR = "2026";

type CalendarCell =
  | {
      type: "empty";
      id: string;
    }
  | {
      type: "day";
      id: string;
      day: string;
      events: Event[];
    };

type ResourceItem = {
  title: string;
  type: "Libro" | "Revista" | "Recurso";
  category: string;
  description: string;
  score: number;
  metrics: {
    relevance: number;
    popularity: number;
    professionalUse: number;
  };
  source: string;
};

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getFirstDayOffset(year: number, monthIndex: number) {
  const jsDay = new Date(year, monthIndex, 1).getDay();

  return jsDay === 0 ? 6 : jsDay - 1;
}

function formatDay(day: number) {
  return String(day).padStart(2, "0");
}

function getRelevanceLabel(score: number) {
  if (score >= 95) return "Clave";
  if (score >= 90) return "Alta";
  if (score >= 85) return "Media";
  return "Nicho";
}

export default function RadarPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [monthDirection, setMonthDirection] = useState<"next" | "previous">(
    "next"
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEventDetail, setSelectedEventDetail] = useState<Event | null>(null);

  const selectedMonth = MONTHS[selectedMonthIndex];

  // Cargar eventos
  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      toast.error("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  }

  const books = fashionResources.filter((item) => item.type === "Libro");
  const magazines = fashionResources.filter((item) => item.type === "Revista");
  const recommendedResources = fashionResources.filter(
    (item) => item.type === "Recurso"
  );

  const monthEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.month === selectedMonth.short && event.year === SELECTED_YEAR
    );
  }, [events, selectedMonth.short]);

  const calendarCells = useMemo<CalendarCell[]>(() => {
    const yearNumber = Number(SELECTED_YEAR);
    const totalDays = getDaysInMonth(yearNumber, selectedMonthIndex);
    const firstDayOffset = getFirstDayOffset(yearNumber, selectedMonthIndex);

    const emptyCells: CalendarCell[] = Array.from(
      { length: firstDayOffset },
      (_, index) => ({
        type: "empty",
        id: `empty-${selectedMonth.short}-${index}`,
      })
    );

    const dayCells: CalendarCell[] = Array.from(
      { length: totalDays },
      (_, index) => {
        const day = formatDay(index + 1);

        const dayEvents = events.filter(
          (event) =>
            event.day === day &&
            event.month === selectedMonth.short &&
            event.year === SELECTED_YEAR
        );

        return {
          type: "day",
          id: `${selectedMonth.short}-${day}`,
          day,
          events: dayEvents,
        };
      }
    );

    return [...emptyCells, ...dayCells];
  }, [events, selectedMonth.short, selectedMonthIndex]);

  function goToPreviousMonth() {
    setMonthDirection("previous");
    setSelectedMonthIndex((currentMonth) =>
      currentMonth === 0 ? MONTHS.length - 1 : currentMonth - 1
    );
  }

  function goToNextMonth() {
    setMonthDirection("next");
    setSelectedMonthIndex((currentMonth) =>
      currentMonth === MONTHS.length - 1 ? 0 : currentMonth + 1
    );
  }

  async function handleDeleteEvent(eventId: string) {
    if (!confirm("¿Eliminar este evento?")) return;

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setEvents(events.filter((e) => e.id !== eventId));
      toast.success("Evento eliminado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar evento");
    }
  }

  return (
    <PageContainer>
      <section className="py-14 md:py-20">
        <div className="mb-14">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
            Fashion Radar
          </p>

          <h1 className="max-w-[1200px] font-serif text-4xl font-bold leading-[1.05] text-[#151111] sm:text-5xl md:text-[3.9rem] xl:text-[4.4rem]">
            <span className="block md:whitespace-nowrap">
              Recursos de moda seleccionados
            </span>
            <span className="block md:whitespace-nowrap">
              con enfoque analítico.
            </span>
          </h1>

          <p className="mt-7 max-w-[980px] text-pretty text-base leading-8 text-[#6d6260] md:text-lg">
            Calendario de eventos, libros, revistas y recursos relevantes para
            entender el ecosistema moda desde una perspectiva profesional,
            editorial y basada en datos.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#8a2638]">
              Calendario
            </p>

            <h2 className="font-serif text-3xl font-bold text-[#151111] md:text-4xl">
              Próximos eventos de moda
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-[#6d6260]">
            Calendario visual con eventos destacados del sector moda,
            organizados por fecha y seleccionados según relevancia editorial,
            presencia internacional y utilidad para análisis de tendencias.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-[#eadbd4] bg-white shadow-sm md:rounded-[34px]">
          <div className="flex flex-col gap-5 border-b border-[#f0e3de] bg-[#fbf5f2] px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                Agenda de moda
              </p>

              <h3 className="mt-1 font-serif text-2xl font-bold text-[#151111] sm:text-3xl">
                {selectedMonth.label} {SELECTED_YEAR}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="rounded-full border border-[#d8c7b8] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#151111] transition hover:bg-[#151111] hover:text-white"
              >
                ←
              </button>

              <span className="rounded-full bg-[#151111] px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
                {monthEvents.length} eventos
              </span>

              <button
                type="button"
                onClick={goToNextMonth}
                className="rounded-full border border-[#d8c7b8] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#151111] transition hover:bg-[#151111] hover:text-white"
              >
                →
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setShowCreateModal(true);
                  }}
                  className="rounded-full bg-[#8a2638] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#6a1f2a] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              )}
            </div>
          </div>

          {loading && (
            <div className="border-b border-[#f0e3de] bg-[#fffdf9] px-4 py-3 text-sm text-[#6d6260]">
              Cargando eventos...
            </div>
          )}

          {/* Vista móvil: lista de eventos limpia */}
          <div className="md:hidden">
            {monthEvents.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="font-serif text-2xl font-bold text-[#151111]">
                  Sin eventos este mes
                </p>
                <p className="mt-3 text-sm leading-6 text-[#6d6260]">
                  Cuando se añadan eventos al calendario, aparecerán aquí
                  ordenados por fecha.
                </p>
              </div>
            ) : (
              <div className="space-y-4 px-4 py-5">
                {[...monthEvents]
                  .sort((a, b) => Number(a.day) - Number(b.day))
                  .map((event) => (
                    <article
                      key={event.id}
                      className="rounded-[24px] border border-[#eadbd4] bg-[#fffdf9] p-4 shadow-sm"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#151111] text-white">
                          <span className="text-xl font-bold leading-none">
                            {event.day}
                          </span>
                          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em]">
                            {selectedMonth.short}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#f7ece8] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a2638]">
                              {event.category}
                            </span>

                            {event.relevanceScore > 0 && (
                              <span className="rounded-full bg-[#151111] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                                {getRelevanceLabel(event.relevanceScore)}
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif text-xl font-bold leading-tight text-[#151111]">
                            {event.name}
                          </h4>

                          <p className="mt-2 text-sm font-semibold leading-6 text-[#8a2638]">
                            {event.location}
                          </p>
                        </div>
                      </div>

                      {event.description && (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6d6260]">
                          {event.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedEventDetail(event)}
                          className="w-full rounded-full border border-[#eadbd4] bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638] transition hover:bg-[#8a2638] hover:text-white"
                        >
                          Ver detalles
                        </button>

                        {isAdmin && !event.isMocked && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEvent(event);
                                setShowCreateModal(true);
                              }}
                              className="rounded-full border border-[#eadbd4] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#151111]"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-600"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </div>

          {/* Vista escritorio: calendario completo */}
          <div className="hidden md:block">
            <div className="grid grid-cols-7 border-b border-[#f0e3de] bg-white">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="border-r border-[#f0e3de] px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a2638] last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            <div
              key={`${selectedMonth.short}-${selectedMonthIndex}`}
              className={`grid grid-cols-7 ${
                monthDirection === "next"
                  ? "radar-month-transition-next"
                  : "radar-month-transition-previous"
              }`}
            >
              {calendarCells.map((cell, index) => {
                const isLastColumn = (index + 1) % 7 === 0;

                if (cell.type === "empty") {
                  return (
                    <div
                      key={cell.id}
                      className={`min-h-[180px] border-t border-[#f0e3de] bg-[#fffafa] p-3 xl:min-h-[220px] ${
                        isLastColumn ? "" : "border-r border-[#f0e3de]"
                      }`}
                    />
                  );
                }

                const isEmpty = cell.events.length === 0;

                return (
                  <div
                    key={cell.id}
                    className={`min-h-[180px] border-t border-[#f0e3de] bg-white p-3 xl:min-h-[220px] ${
                      isLastColumn ? "" : "border-r border-[#f0e3de]"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          cell.events.length > 0
                            ? "bg-[#151111] text-white"
                            : "bg-[#f7ece8] text-[#8a2638]"
                        }`}
                      >
                        {cell.day}
                      </span>

                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a2638]/70">
                        {selectedMonth.short}
                      </span>
                    </div>

                    {isEmpty ? (
                      <div className="h-full rounded-2xl border border-dashed border-[#eadbd4] bg-[#fffdf9] p-3 text-[11px] leading-5 text-[#b39a94]">
                        Sin eventos destacados
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cell.events.map((event) => (
                          <div
                            key={event.id}
                            className="group relative rounded-2xl border border-[#eadbd4] bg-[#f7ece8] p-3 shadow-sm"
                          >
                            <div className="mb-1 flex items-center justify-between gap-2">
                              <div className="flex-1">
                                <span className="rounded-full bg-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#8a2638]">
                                  {event.category}
                                </span>

                                {event.relevanceScore > 0 && (
                                  <span className="ml-1 rounded-full bg-[#151111] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white">
                                    {getRelevanceLabel(event.relevanceScore)}
                                  </span>
                                )}
                              </div>

                              {isAdmin && !event.isMocked && (
                                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                                  <button
                                    onClick={() => {
                                      setEditingEvent(event);
                                      setShowCreateModal(true);
                                    }}
                                    className="rounded p-1 hover:bg-[#8a2638] hover:text-white"
                                    title="Editar"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="rounded p-1 hover:bg-red-600 hover:text-white"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <h4 className="font-serif text-[12px] font-bold leading-normal text-[#151111]">
                              {event.name}
                            </h4>

                            <p className="text-[10px] font-semibold leading-5 text-[#8a2638]">
                              {event.location}
                            </p>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEventDetail(event);
                              }}
                              className="mt-2 w-full rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a2638] transition hover:bg-[#f0e3de]"
                            >
                              Ver detalles
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <EventModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingEvent(null);
        }}
        onSuccess={() => {
          fetchEvents();
          setShowCreateModal(false);
          setEditingEvent(null);
        }}
        editingEvent={editingEvent}
      />

      <EventDetailModal
        event={selectedEventDetail}
        onClose={() => setSelectedEventDetail(null)}
      />

      <section className="pb-24">
        <div className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#8a2638]">
            Recursos
          </p>

          <h2 className="font-serif text-4xl font-bold text-[#151111]">
            Libros, revistas y recursos mejor valorados
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d6260]">
            La puntuación combina relevancia temática, popularidad estimada y
            utilidad profesional dentro del ecosistema moda.
          </p>
        </div>

        <div className="space-y-10">
          <ResourceShowcase
            title="Libros destacados"
            subtitle="Selección editorial con obras relevantes para cultura, historia, estilo y sostenibilidad."
            image="/images/radar/radar-boks.jpg"
            imageAlt="Selección de libros y recursos editoriales de moda"
            items={books}
          />

          <ResourceShowcase
            title="Revistas y fuentes"
            subtitle="Medios editoriales y profesionales con fuerte relevancia en moda, lujo y análisis de industria."
            image="/images/radar/radar-revistas.jpg"
            imageAlt="Revistas y editoriales de moda"
            items={magazines}
            reverse
          />

          <ResourceShowcase
            title="Recursos recomendados"
            subtitle="Cursos, plataformas creativas y herramientas útiles para aprender, diseñar, inspirarse y trabajar dentro del sector moda."
            image="/images/radar/radar-cursos.jpg"
            imageAlt="Recursos, cursos y herramientas creativas de moda"
            items={recommendedResources}
          />
        </div>
      </section>
    </PageContainer>
  );
}

function ResourceShowcase({
  title,
  subtitle,
  image,
  imageAlt,
  items,
  reverse = false,
}: {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  items: ResourceItem[];
  reverse?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardDirection, setCardDirection] = useState<"next" | "previous">(
    "next"
  );
  const [imageError, setImageError] = useState(false);

  const currentItem = items[currentIndex];

  function goToPrevious() {
    setCardDirection("previous");

    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  }

  function goToNext() {
    setCardDirection("next");

    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  }

  function goToCard(index: number) {
    if (index === currentIndex) return;

    setCardDirection(index > currentIndex ? "next" : "previous");
    setCurrentIndex(index);
  }

  if (!currentItem) {
    return null;
  }

  return (
    <section
      className={`grid items-start gap-6 overflow-hidden rounded-[34px] border border-[#e6cfc8] bg-gradient-to-br from-[#fff8f4] via-[#fffdf9] to-[#f7ece8] p-6 shadow-[0_24px_70px_rgba(90,45,35,0.08)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8 ${
        reverse
          ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
          : ""
      }`}
    >
      <div className="relative self-start overflow-hidden rounded-[28px] bg-[#f7ece8] shadow-sm">
        <div className="relative h-[340px] overflow-hidden rounded-[28px] sm:h-[420px] lg:h-[500px]">
          <img
            src={imageError ? "/images/radar/radar-revistas.jpg" : image}
            alt={imageAlt}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/80">
              Fashion Radar
            </p>

            <h3 className="max-w-lg font-serif text-3xl font-bold leading-tight text-white md:text-4xl">
              {title}
            </h3>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/85">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-[500px] flex-col justify-center">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
            Selección destacada
          </p>

          <p className="mt-1 text-xs text-[#6d6260]">
            {currentIndex + 1} de {items.length}
          </p>
        </div>

        <div className="overflow-hidden rounded-[26px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={currentItem.title}
              initial={{
                opacity: 0,
                x: cardDirection === "next" ? 90 : -90,
                scale: 0.985,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: cardDirection === "next" ? -90 : 90,
                scale: 0.985,
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-[26px] border border-[#e6cfc8] bg-[#fffdf9]/90 p-6 shadow-sm"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-[#f7ece8] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                  {currentItem.type}
                </span>

                <span className="rounded-full bg-[#151111] px-4 py-2 text-xs font-bold text-white">
                  {currentItem.score}/100
                </span>
              </div>

              <h4 className="font-serif text-3xl font-bold leading-tight text-[#151111]">
                {currentItem.title}
              </h4>

              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a2638]">
                {currentItem.category}
              </p>

              <p className="mt-5 min-h-[84px] text-sm leading-7 text-[#6d6260]">
                {currentItem.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <MiniMetric
                  label="Relevancia"
                  value={currentItem.metrics.relevance}
                />

                <MiniMetric
                  label="Popularidad"
                  value={currentItem.metrics.popularity}
                />

                <MiniMetric
                  label="Uso profesional"
                  value={currentItem.metrics.professionalUse}
                />
              </div>

              <div className="mt-6 border-t border-[#f0e3de] pt-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a2638]">
                  Fuente: {currentItem.source}
                </p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            {items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => goToCard(index)}
                className={`h-2.5 rounded-full transition ${
                  index === currentIndex
                    ? "w-8 bg-[#151111]"
                    : "w-2.5 bg-[#d9c3bc] hover:bg-[#8a2638]"
                }`}
                aria-label={`Ver recurso ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 sm:justify-end">
            <button
              type="button"
              onClick={goToPrevious}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c7b8] bg-white text-lg text-[#151111] shadow-sm transition hover:-translate-x-0.5 hover:bg-[#151111] hover:text-white"
              aria-label="Ver recurso anterior"
            >
              ←
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#151111] text-lg text-white shadow-sm transition hover:translate-x-0.5 hover:bg-[#2a2020]"
              aria-label="Ver recurso siguiente"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#fbf5f2] p-3">
      <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-[#6d6260]">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#ecdeda]">
        <div
          className="h-full rounded-full bg-[#8a2638]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function EventModal({
  isOpen,
  onClose,
  onSuccess,
  editingEvent,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingEvent: Event | null;
}) {
  const [formData, setFormData] = useState({
    name: editingEvent?.name || "",
    category: editingEvent?.category || "Fashion Week",
    location: editingEvent?.location || "",
    day: editingEvent?.day || "01",
    month: editingEvent?.month || "Feb",
    year: editingEvent?.year || "2026",
    description: editingEvent?.description || "",
    relevanceScore: editingEvent?.relevanceScore || 85,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        name: editingEvent.name,
        category: editingEvent.category,
        location: editingEvent.location,
        day: editingEvent.day,
        month: editingEvent.month,
        year: editingEvent.year,
        description: editingEvent.description || "",
        relevanceScore: editingEvent.relevanceScore,
      });
    }
  }, [editingEvent]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error");
      }

      toast.success(
        editingEvent ? "Evento actualizado" : "Evento creado"
      );
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al guardar evento"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-lg sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#151111]">
            {editingEvent ? "Editar evento" : "Nuevo evento"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#8a2638] hover:text-[#6a1f2a]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#151111]">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1 w-full rounded-lg border border-[#eadbd4] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#151111]">
              Categoría
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-[#eadbd4] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#151111]">
              Localización
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
              className="mt-1 w-full rounded-lg border border-[#eadbd4] px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-[#151111]">
                Día
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={parseInt(formData.day) || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    day: e.target.value ? String(parseInt(e.target.value)).padStart(2, "0") : "",
                  })
                }
                className="mt-1 w-full rounded-lg border border-[#eadbd4] px-2 py-2 text-sm"
                placeholder="1-31"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#151111]">
                Mes
              </label>
              <select
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-[#eadbd4] px-2 py-2 text-sm"
              >
                {MONTHS.map((m) => (
                  <option key={m.short} value={m.short}>
                    {m.short}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#151111]">
                Año
              </label>
              <input
                type="number"
                min="2020"
                max="2030"
                value={parseInt(formData.year) || ""}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value || "2026" })
                }
                className="mt-1 w-full rounded-lg border border-[#eadbd4] px-2 py-2 text-sm"
                placeholder="2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#151111]">
              Puntuación de relevancia ({formData.relevanceScore})
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.relevanceScore}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  relevanceScore: Number(e.target.value),
                })
              }
              className="mt-1 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#151111]">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="mt-1 w-full rounded-lg border border-[#eadbd4] px-3 py-2 text-sm resize-none"
              placeholder="Describe los detalles del evento..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#eadbd4] px-4 py-2 font-semibold text-[#151111] hover:bg-[#fffdf9]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-[#8a2638] px-4 py-2 font-semibold text-white hover:bg-[#6a1f2a] disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EventDetailModal({
  event,
  onClose,
}: {
  event: Event | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (event) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
              Detalles del evento
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#151111] sm:text-4xl">
              {event.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f0e3de] text-[#8a2638] transition"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 border-t border-[#f0e3de] pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                Fecha
              </p>
              <p className="mt-2 text-lg font-semibold text-[#151111]">
                {event.day} de {MONTHS.find((m) => m.short === event.month)?.label} {event.year}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                Localización
              </p>
              <p className="mt-2 text-lg font-semibold text-[#151111]">
                {event.location}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                Categoría
              </p>
              <p className="mt-2 text-lg font-semibold text-[#151111]">
                {event.category}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                Relevancia
              </p>
              <p className="mt-2 text-lg font-semibold text-[#151111]">
                {event.relevanceScore}/100
              </p>
            </div>
          </div>

          {event.description && (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                Descripción
              </p>
              <p className="mt-3 text-base leading-7 text-[#6d6260]">
                {event.description}
              </p>
            </div>
          )}

          <div className="border-t border-[#f0e3de] pt-6">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a2638]">
              Fuente: {event.source}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-[#f0e3de] px-4 py-3 font-semibold text-[#151111] transition hover:bg-[#e6cfc8]"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
}