"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  clinic: string | null;
  revenue: string | null;
  challenge: string | null;
  created_at: string;
  status?: string;
  notes?: string | null;
}

const STATUSES = [
  "LEAD",
  "CONTACTADO",
  "VIDEOLLAMADA",
  "CONVERSACIÓN WHATSAPP",
  "INTERESADO",
  "TEMPLADO",
  "FRÍO",
  "RESERVA",
  "CONVERTIDO",
];

// Estados que NO se muestran en KANBAN ni en TABLA
const HIDDEN_STATUSES = ["NO INTERESA"];

const STATUS_COLORS: Record<string, string> = {
  LEAD: "#3b82f6",
  CONTACTADO: "#8b5cf6",
  VIDEOLLAMADA: "#ec4899",
  "CONVERSACIÓN WHATSAPP": "#10b981",
  INTERESADO: "#f59e0b",
  TEMPLADO: "#6366f1",
  FRÍO: "#6b7280",
  RESERVA: "#ef4444",
  CONVERTIDO: "#16a34a",
  "NO INTERESA": "#dc2626",
};

function LeadCard({ lead, onNotesChange, onNotesSave }: { lead: Lead; onNotesChange: (leadId: number, notes: string) => void; onNotesSave: (leadId: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        ...style,
        backgroundColor: "rgba(2, 6, 23, 0.8)",
        border: "1px solid rgba(148, 163, 184, 0.3)",
        borderRadius: "10px",
        padding: "0.75rem",
        marginBottom: "0.5rem",
        transition: "all 0.2s",
        position: "relative",
        cursor: "grab",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.3)";
      }}
    >
      {/* Área arrastrable - header */}
      <div
        {...listeners}
        style={{
          marginBottom: "0.5rem",
        }}
      >
        <div style={{ fontWeight: "600", color: "#e5e7eb", marginBottom: "0.25rem", fontSize: "0.875rem" }}>
          {lead.name}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#cbd5f5", marginBottom: "0.25rem" }}>
          {lead.email}
        </div>
        {lead.clinic && (
          <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.25rem" }}>
            📍 {lead.clinic}
          </div>
        )}
      </div>

      {/* Área de notas - no arrastrable */}
      <div
        style={{
          borderTop: "1px solid rgba(148, 163, 184, 0.2)",
          paddingTop: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        <textarea
          value={lead.notes || ""}
          onChange={(e) => onNotesChange(lead.id, e.target.value)}
          onBlur={() => onNotesSave(lead.id)}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          placeholder="Escribe notas aquí..."
          style={{
            width: "100%",
            minHeight: "60px",
            maxHeight: "120px",
            padding: "0.5rem",
            backgroundColor: "#020617",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            borderRadius: "6px",
            color: "#e5e7eb",
            fontSize: "0.75rem",
            fontFamily: "inherit",
            resize: "vertical",
            boxSizing: "border-box",
            cursor: "text",
          }}
        />
      </div>
    </div>
  );
}

function StatusColumn({ status, leads, onLeadClick, onNotesChange, onNotesSave, isDragging }: { status: string; leads: Lead[]; onLeadClick: (lead: Lead) => void; onNotesChange: (leadId: number, notes: string) => void; onNotesSave: (leadId: number) => void; isDragging: boolean }) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      data-status-column={status}
      style={{
        minWidth: "250px",
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        borderRadius: "12px",
        padding: "1rem",
        border: "1px solid rgba(148, 163, 184, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: STATUS_COLORS[status] || "#e5e7eb",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {status}
        </h3>
        <span
          style={{
            backgroundColor: "rgba(148, 163, 184, 0.2)",
            color: "#cbd5f5",
            borderRadius: "999px",
            padding: "0.25rem 0.5rem",
            fontSize: "0.75rem",
            fontWeight: "600",
          }}
        >
          {leads.length}
        </span>
      </div>
      <SortableContext items={leads.map((l) => l.id.toString())} strategy={verticalListSortingStrategy}>
        <div>
          {leads.map((lead) => (
            <div 
              key={lead.id} 
              onClick={(e) => {
                // Solo abrir modal si no se está haciendo drag
                if (!isDragging) {
                  onLeadClick(lead);
                }
              }}
            >
              <LeadCard 
                lead={lead} 
                onNotesChange={onNotesChange}
                onNotesSave={onNotesSave}
              />
            </div>
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requiere mover 8px antes de activar el drag
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/leads");
      if (response.ok) {
        setIsAuthenticated(true);
        fetchLeads();
      } else {
        setIsAuthenticated(false);
        router.push("/admin");
      }
    } catch (err) {
      setIsAuthenticated(false);
      router.push("/admin");
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/leads");
      const data = await response.json();
      if (data.success) {
        // Filtrar leads ocultos al cargar
        const allLeads = data.leads || [];
        const filteredLeads = allLeads.filter((lead: Lead) => {
          const leadStatus = lead.status || "LEAD";
          return !HIDDEN_STATUSES.includes(leadStatus);
        });
        setLeads(filteredLeads);
      }
    } catch (err) {
      console.error("Error al cargar leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setIsDragging(false);

    if (!over) return;

    const leadId = active.id as string;
    
    // Detectar la columna de destino
    let newStatus: string | null = null;
    
    // Estrategia 1: Si over.id es directamente un status (columna)
    if (STATUSES.includes(over.id as string)) {
      newStatus = over.id as string;
    } 
    // Estrategia 2: Si over.id es un lead, usar su status actual
    else {
      const targetLead = leads.find((l) => l.id.toString() === over.id);
      if (targetLead) {
        newStatus = targetLead.status || "LEAD";
      }
    }

    // Estrategia 3: Buscar el droppable contenedor desde el DOM
    if (!newStatus) {
      // Buscar el elemento que tiene el id del over en el DOM
      let overElement = document.querySelector(`[data-rbd-droppable-id="${over.id}"], [data-droppable-id="${over.id}"]`);
      
      // Si no encontramos directamente, buscar cualquier elemento con ese id
      if (!overElement) {
        overElement = document.getElementById(over.id as string);
      }
      
      if (overElement) {
        // Buscar la columna padre más cercana
        const columnElement = overElement.closest('[data-status-column]');
        if (columnElement) {
          newStatus = columnElement.getAttribute('data-status-column');
        }
      }
    }
    
    // Estrategia 4: Si aún no tenemos status, buscar desde el elemento activo
    // encontrar en qué columna estábamos y buscar la columna más cercana visualmente
    if (!newStatus) {
      // Esta es una estrategia de último recurso
      // Podríamos usar getBoundingClientRect para encontrar la columna más cercana
      // Por ahora, simplemente retornamos sin hacer nada
    }

    // Estrategia 4: Buscar desde el elemento activo - encontrar la columna más cercana
    if (!newStatus) {
      // Buscar todos los elementos con data-status-column y encontrar el más cercano
      const allColumns = document.querySelectorAll('[data-status-column]');
      // Por simplicidad, si no encontramos el status, no hacemos nada
      // En producción, podrías usar getBoundingClientRect para encontrar el más cercano
    }

    if (!newStatus || !STATUSES.includes(newStatus)) {
      console.log("No se pudo determinar la columna de destino.");
      console.log("over.id:", over.id);
      console.log("over.data:", (over as any).data);
      console.log("active.id:", active.id);
      // Intentar encontrar el status desde el DOM del elemento activo
      const activeElement = document.querySelector(`[data-sortable-id="${active.id}"]`);
      if (activeElement) {
        const currentColumn = activeElement.closest('[data-status-column]');
        if (currentColumn) {
          console.log("Columna actual del lead:", currentColumn.getAttribute('data-status-column'));
        }
      }
      return;
    }

    const lead = leads.find((l) => l.id.toString() === leadId);
    if (!lead || (lead.status || "LEAD") === newStatus) return;
    
    console.log("Movimiento detectado: lead", leadId, "de", lead.status || "LEAD", "a", newStatus);

    // Optimistic update
    const updatedLeads = leads.map((l) =>
      l.id.toString() === leadId ? { ...l, status: newStatus } : l
    );
    setLeads(updatedLeads);

    // Update in backend
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Revert on error
        setLeads(leads);
        console.error("Error del servidor:", result);
        alert(`Error al actualizar el estado del lead: ${result.error || "Error desconocido"}`);
      }
    } catch (error: any) {
      // Revert on error
      setLeads(leads);
      console.error("Error al actualizar lead:", error);
      alert(`Error al actualizar el estado del lead: ${error?.message || "Error de conexión"}`);
    }
  };

  const getLeadsByStatus = (status: string) => {
    return leads.filter((lead) => (lead.status || "LEAD") === status);
  };


  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleNotesChange = (leadId: number, newNotes: string) => {
    // Actualización optimista inmediata
    const updatedLeads = leads.map((l) =>
      l.id === leadId ? { ...l, notes: newNotes } : l
    );
    setLeads(updatedLeads);
  };

  const handleNotesSave = async (leadId: number) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const previousNotes = lead.notes || "";

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: lead.notes || null }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Revert on error
        const revertedLeads = leads.map((l) =>
          l.id === leadId ? { ...l, notes: previousNotes } : l
        );
        setLeads(revertedLeads);
        console.error("Error al guardar notas:", result.error);
      }
    } catch (error: any) {
      // Revert on error
      const revertedLeads = leads.map((l) =>
        l.id === leadId ? { ...l, notes: previousNotes } : l
      );
      setLeads(revertedLeads);
      console.error("Error al guardar notas:", error);
    }
  };

  const activeLead = activeId ? leads.find((l) => l.id.toString() === activeId) : null;

  // Redirigir inmediatamente si no está autenticado
  if (isAuthenticated === false) {
    router.push("/admin");
    return null;
  }

  if (isAuthenticated === null || loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at top, #142647 0, #050816 45%, #020309 100%)",
          color: "#e5e7eb",
        }}
      >
        Cargando...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #142647 0, #050816 45%, #020309 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#f9fafb",
      }}
    >
      <header
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          borderBottom: "1px solid rgba(148, 163, 184, 0.4)",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#e5e7eb" }}>
            Pipeline Comercial
          </h1>
          <a
            href="/admin"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "rgba(148, 163, 184, 0.2)",
              color: "#cbd5f5",
              borderRadius: "999px",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            Ver Tabla
          </a>
          <a
            href="/admin/no-interesados"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "rgba(220, 38, 38, 0.2)",
              color: "#fca5a5",
              borderRadius: "999px",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            Ver NO INTERESADOS
          </a>
        </div>
        <button
          onClick={() => {
            document.cookie = "admin-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/admin";
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dc2626",
            color: "#f9fafb",
            border: "none",
            borderRadius: "999px",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
        >
          Cerrar sesión
        </button>
      </header>

      <main style={{ padding: "2rem", overflowX: "auto" }}>
        <DndContext
          sensors={sensors}
          collisionDetection={(args) => {
            // Primero intentar pointerWithin para detectar áreas vacías
            const pointerCollisions = pointerWithin(args);
            if (pointerCollisions.length > 0) {
              return pointerCollisions;
            }
            // Si no hay colisión con pointer, usar closestCorners
            return closestCorners(args);
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              minWidth: "fit-content",
            }}
          >
            {STATUSES.map((status) => {
              const statusLeads = getLeadsByStatus(status).filter((lead) => {
                const leadStatus = lead.status || "LEAD";
                return !HIDDEN_STATUSES.includes(leadStatus);
              });
              return (
                <SortableContext
                  key={status}
                  items={statusLeads.map((l) => l.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <StatusColumn
                    status={status}
                    leads={statusLeads}
                    onLeadClick={handleLeadClick}
                    onNotesChange={handleNotesChange}
                    onNotesSave={handleNotesSave}
                    isDragging={isDragging}
                  />
                </SortableContext>
              );
            })}
          </div>
          <DragOverlay>
            {activeLead ? (
              <div
                style={{
                  backgroundColor: "rgba(2, 6, 23, 0.95)",
                  border: "2px solid #1d7ff3",
                  borderRadius: "10px",
                  padding: "0.75rem",
                  width: "200px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ fontWeight: "600", color: "#e5e7eb", marginBottom: "0.25rem" }}>
                  {activeLead.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#cbd5f5" }}>
                  {activeLead.email}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {selectedLead && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              borderRadius: "18px",
              padding: "2rem",
              maxWidth: "600px",
              width: "90%",
              border: "1px solid rgba(148, 163, 184, 0.4)",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#e5e7eb" }}>
                Detalles del Lead
              </h2>
              <button
                onClick={() => setSelectedLead(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#cbd5f5",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase" }}>
                  Nombre
                </label>
                <div style={{ color: "#e5e7eb", fontSize: "1rem", marginTop: "0.25rem" }}>
                  {selectedLead.name}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase" }}>
                  Email
                </label>
                <div style={{ color: "#e5e7eb", fontSize: "1rem", marginTop: "0.25rem" }}>
                  {selectedLead.email}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase" }}>
                  Teléfono
                </label>
                <div style={{ color: "#e5e7eb", fontSize: "1rem", marginTop: "0.25rem" }}>
                  {selectedLead.phone}
                </div>
              </div>
              {selectedLead.clinic && (
                <div>
                  <label style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase" }}>
                    Clínica
                  </label>
                  <div style={{ color: "#e5e7eb", fontSize: "1rem", marginTop: "0.25rem" }}>
                    {selectedLead.clinic}
                  </div>
                </div>
              )}
              {selectedLead.revenue && (
                <div>
                  <label style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase" }}>
                    Facturación
                  </label>
                  <div style={{ color: "#e5e7eb", fontSize: "1rem", marginTop: "0.25rem" }}>
                    {selectedLead.revenue}
                  </div>
                </div>
              )}
              {selectedLead.challenge && (
                <div>
                  <label style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase" }}>
                    Reto
                  </label>
                  <div style={{ color: "#cbd5f5", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    {selectedLead.challenge}
                  </div>
                </div>
              )}
              <div>
                <label style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase" }}>
                  Estado Actual
                </label>
                <div style={{ marginTop: "0.25rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "999px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      backgroundColor: `${STATUS_COLORS[selectedLead.status || "LEAD"]}20`,
                      color: STATUS_COLORS[selectedLead.status || "LEAD"],
                    }}
                  >
                    {selectedLead.status || "LEAD"}
                  </span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase", marginBottom: "0.5rem", display: "block" }}>
                  Comentarios / Notas
                </label>
                <textarea
                  value={selectedLead.notes || ""}
                  onChange={(e) => {
                    const updatedLead = { ...selectedLead, notes: e.target.value };
                    setSelectedLead(updatedLead);
                    handleNotesChange(selectedLead.id, e.target.value);
                  }}
                  onBlur={() => handleNotesSave(selectedLead.id)}
                  placeholder="Añade comentarios o notas sobre este lead..."
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "0.75rem",
                    backgroundColor: "#020617",
                    border: "1px solid rgba(148, 163, 184, 0.4)",
                    borderRadius: "10px",
                    color: "#e5e7eb",
                    fontSize: "0.875rem",
                    fontFamily: "inherit",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
