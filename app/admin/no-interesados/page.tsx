"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function NoInteresadosPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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
        // Filtrar solo los leads con estado "NO INTERESA"
        const noInteresados = (data.leads || []).filter((lead: Lead) => {
          const leadStatus = lead.status || "LEAD";
          return leadStatus === "NO INTERESA";
        });
        setLeads(noInteresados);
      }
    } catch (err) {
      console.error("Error al cargar leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "admin-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
    setLeads([]);
    router.push("/admin");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        // Si cambia de "NO INTERESA" a otro estado, eliminarlo de la lista
        if (newStatus !== "NO INTERESA") {
          setLeads(leads.filter((lead) => lead.id !== leadId));
        } else {
          // Actualizar el estado local
          setLeads(leads.map((lead) =>
            lead.id === leadId ? { ...lead, status: newStatus } : lead
          ));
        }
      } else {
        alert(`Error al actualizar el estado: ${result.error}`);
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado del lead");
    }
  };

  if (isAuthenticated === false) {
    return null; // El router.push ya redirige
  }

  if (isAuthenticated === null) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "radial-gradient(circle at top, #142647 0, #050816 45%, #020309 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#e5e7eb"
      }}>
        Cargando...
      </div>
    );
  }

  const statusColors: Record<string, string> = {
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

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "radial-gradient(circle at top, #142647 0, #050816 45%, #020309 100%)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#f9fafb"
    }}>
      <header style={{
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.4)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#e5e7eb" }}>Leads NO INTERESADOS</h1>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <a
              href="/admin"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "rgba(148, 163, 184, 0.2)",
                color: "#cbd5f5",
                borderRadius: "999px",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "500"
              }}
            >
              Ver Tabla
            </a>
            <a
              href="/admin/kanban"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "rgba(148, 163, 184, 0.2)",
                color: "#cbd5f5",
                borderRadius: "999px",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "500"
              }}
            >
              Ver Kanban
            </a>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dc2626",
            color: "#f9fafb",
            border: "none",
            borderRadius: "999px",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500"
          }}
        >
          Cerrar sesión
        </button>
      </header>

      <main style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          borderRadius: "18px",
          border: "1px solid rgba(148, 163, 184, 0.4)",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.85)",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "1.5rem",
            borderBottom: "1px solid rgba(148, 163, 184, 0.4)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#e5e7eb" }}>
              Leads NO INTERESADOS ({leads.length})
            </h2>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", color: "#cbd5f5" }}>
                  Mostrar:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "#020617",
                    border: "1px solid rgba(148, 163, 184, 0.4)",
                    borderRadius: "6px",
                    color: "#e5e7eb",
                    fontSize: "0.875rem",
                    cursor: "pointer"
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <button
                onClick={fetchLeads}
                disabled={loading}
                style={{
                  padding: "0.5rem 1rem",
                  background: loading ? "#9ca3af" : "linear-gradient(135deg, #1d7ff3, #2563eb)",
                  color: "#f9fafb",
                  border: "none",
                  borderRadius: "999px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  boxShadow: loading ? "none" : "0 8px 20px rgba(37, 99, 235, 0.4)"
                }}
              >
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </div>

          {leads.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#cbd5f5" }}>
              No hay leads con estado "NO INTERESA".
            </div>
          ) : (
            <>
              <div style={{ 
                padding: "1rem 1.5rem", 
                borderBottom: "1px solid rgba(148, 163, 184, 0.4)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div style={{ fontSize: "0.875rem", color: "#cbd5f5" }}>
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, leads.length)} de {leads.length} leads
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: "0.5rem 1rem",
                      background: currentPage === 1 ? "#9ca3af" : "rgba(148, 163, 184, 0.2)",
                      color: "#f9fafb",
                      border: "none",
                      borderRadius: "6px",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      fontSize: "0.875rem",
                      fontWeight: "500"
                    }}
                  >
                    ← Anterior
                  </button>
                  <span style={{ fontSize: "0.875rem", color: "#cbd5f5" }}>
                    Página {currentPage} de {Math.ceil(leads.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(leads.length / itemsPerPage), prev + 1))}
                    disabled={currentPage >= Math.ceil(leads.length / itemsPerPage)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: currentPage >= Math.ceil(leads.length / itemsPerPage) ? "#9ca3af" : "rgba(148, 163, 184, 0.2)",
                      color: "#f9fafb",
                      border: "none",
                      borderRadius: "6px",
                      cursor: currentPage >= Math.ceil(leads.length / itemsPerPage) ? "not-allowed" : "pointer",
                      fontSize: "0.875rem",
                      fontWeight: "500"
                    }}
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#020617", borderBottom: "1px solid rgba(148, 163, 184, 0.4)" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#FFD54A" }}>Fecha</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#FFD54A" }}>Nombre</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#FFD54A" }}>Email</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#FFD54A" }}>Teléfono</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#FFD54A" }}>Clínica</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#FFD54A" }}>Facturación</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#FFD54A" }}>Reto</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#FFD54A" }}>Estado</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#FFD54A" }}>Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((lead) => {
                        const currentStatus = lead.status || "LEAD";
                        const statusColor = statusColors[currentStatus] || "#9ca3af";
                        
                        return (
                          <tr key={lead.id} style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
                            <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#cbd5f5" }}>
                              {formatDate(lead.created_at)}
                            </td>
                            <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "500", color: "#e5e7eb" }}>
                              {lead.name}
                            </td>
                            <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#e5e7eb" }}>
                              {lead.email}
                            </td>
                            <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#e5e7eb" }}>
                              {lead.phone}
                            </td>
                            <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#cbd5f5" }}>
                              {lead.clinic || "-"}
                            </td>
                            <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#cbd5f5" }}>
                              {lead.revenue || "-"}
                            </td>
                            <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#cbd5f5", maxWidth: "300px" }}>
                              {lead.challenge || "-"}
                            </td>
                            <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                              <select
                                value={currentStatus}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                style={{
                                  padding: "0.25rem 0.75rem",
                                  borderRadius: "999px",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                  backgroundColor: `${statusColor}20`,
                                  color: statusColor,
                                  border: `1px solid ${statusColor}40`,
                                  cursor: "pointer",
                                  outline: "none",
                                }}
                              >
                                <option value="LEAD">LEAD</option>
                                <option value="CONTACTADO">CONTACTADO</option>
                                <option value="VIDEOLLAMADA">VIDEOLLAMADA</option>
                                <option value="CONVERSACIÓN WHATSAPP">CONVERSACIÓN WHATSAPP</option>
                                <option value="INTERESADO">INTERESADO</option>
                                <option value="TEMPLADO">TEMPLADO</option>
                                <option value="FRÍO">FRÍO</option>
                                <option value="RESERVA">RESERVA</option>
                                <option value="CONVERTIDO">CONVERTIDO</option>
                                <option value="NO INTERESA">NO INTERESA</option>
                              </select>
                            </td>
                            <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#cbd5f5", maxWidth: "250px" }}>
                              {lead.notes ? (
                                <span title={lead.notes} style={{ 
                                  display: "block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}>
                                  💬 {lead.notes}
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
