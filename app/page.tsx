"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

// API route para guardar leads en nuestra base de datos
const LEADS_API_URL = "/api/leads";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "error">(null);

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setStatus(null);

  const form = e.currentTarget;
  const formData = new FormData(form);

  // Extraer los datos del formulario
  const data = {
    name: String(formData.get("name") || ""),
    phone: String(formData.get("phone") || ""),
    email: String(formData.get("email") || ""),
    clinic: String(formData.get("clinic") || ""),
    revenue: String(formData.get("revenue") || ""),
    challenge: String(formData.get("challenge") || ""),
  };

  try {
    const response = await fetch(LEADS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      setStatus("ok");
      form.reset();
    } else {
      setStatus("error");
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    setStatus("error");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="page">
      <header className="header">
        <div className="logo">
          <Image
            src="/fisioreferentes-logo.png"
            alt="fisioreferentes"
            width={170}
            height={40}
            priority
          />
        </div>
        <span className="header-subtitle">
          Playbook 50K · Para dueños de clínica
        </span>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div>
            <div className="badge">
              <span>Playbook GRATUITO</span> ·{" "}
              <span>Para dueños de clínica</span>
            </div>

            <h1>Cómo llevar tu clínica a 50.000€ de facturación real sin quemarte</h1>

            <p className="hero-subtitle">
              Deja de improvisar. Este Playbook te da{" "}
              <strong>19 ejercicios prácticos</strong> para tomar mejores
              decisiones, construir una propuesta que vende, atraer mejores
              pacientes y empezar a ganar dinero con sentido.
            </p>

            <div className="hero-bullets">
              <span>
                ✅ <strong>Claridad brutal</strong> sobre tu situación.
              </span>
              <span>
                ✅ <strong>Pacientes correctos</strong>, no los que caen por azar.
              </span>
              <span>
                ✅ <strong>Propuesta de valor</strong> que permite cobrar mejor.
              </span>
              <span>
                ✅ <strong>Recurrencia responsable</strong>, no esclavitud.
              </span>
              <span>
                ✅ <strong>Mentalidad de dueño</strong>, no de esclavo de la agenda.
              </span>
            </div>

            <div className="hero-badge-secondary">
              Regístrate ↓ y accede gratis a los 5 vídeos y al Playbook en la Academia.
            </div>
          </div>

          <aside className="hero-media">
            <div className="hero-media-inner">
              <div className="playbook-title">Playbook 50K</div>
              <div className="playbook-name">
                19 ejercicios para que tu clínica facture mejor
              </div>
              <ul className="playbook-list">
                <li>Diagnosticar dónde estás y qué falla.</li>
                <li>Elegir mejor a quién ayudas y por qué.</li>
                <li>Construir una propuesta que se paga mejor.</li>
                <li>Dejar de improvisar decisiones clave.</li>
                <li>Empezar a pensar como dueño de negocio.</li>
              </ul>
            </div>
          </aside>
        </section>

        {/* QUÉ ES EL PLAYBOOK */}
        <section className="layout-bottom">
          <div className="what-you-get">
            <h2 className="section-title">Qué es el Playbook 50K</h2>
            <p className="section-sub">
              No es inspiración. No es teoría. Son{" "}
              <strong>19 ejercicios accionables</strong> para que tu clínica
              facture mejor.
            </p>

            <div className="what-grid">
              <div className="what-item">
                <strong>📌 Diagnosticar tu realidad:</strong> qué funciona, qué no
                y qué deberías cambiar ya.
              </div>

              <div className="what-item">
                <strong>📌 Elegir mejor a quién ayudas:</strong> pacientes que
                disfrutas, dejan dinero y recomiendan.
              </div>

              <div className="what-item">
                <strong>📌 Construir una propuesta que vende:</strong> más valor,
                mejores precios y menos dependencia del volumen.
              </div>

              <div className="what-item">
                <strong>📌 Dejar de improvisar decisiones:</strong> criterio, foco
                y dirección, sin humo.
              </div>

              <div className="what-item">
                <strong>📌 Pensar como dueño de negocio:</strong> no más
                clínica-cárcel; un negocio que sostiene tu buena vida.
              </div>
            </div>
          </div>

          {/* FORM */}
          <aside className="form-card">
            <div className="form-title">Accede al Playbook 50K</div>

            <p className="form-sub">
              Déjanos tus datos: te enviaremos un email para crear tu cuenta
              gratuita, ver los 5 vídeos y descargar el Playbook 50K.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group-label">Tus datos</div>
              <input
                className="field"
                type="text"
                placeholder="Nombre y apellidos"
                name="name"
                required
              />
              <input
                className="field field-margin-top"
                type="tel"
                placeholder="Tu teléfono"
                name="phone"
                required
              />
              <input
                className="field field-margin-top"
                type="email"
                placeholder="Tu email"
                name="email"
                required
              />

              <div className="form-group-label">Sobre tu clínica</div>
              <input
                className="field"
                type="text"
                placeholder="Nombre de tu clínica y ciudad"
                name="clinic"
              />

              <select
                className="field field-margin-top"
                name="revenue"
                defaultValue=""
              >
                <option value="">Facturación anual aproximada</option>
                <option value="0-25000">0€ – 25.000€</option>
                <option value="25000-50000">25.000€ – 50.000€</option>
                <option value="50000-100000">50.000€ – 100.000€</option>
                <option value="100000+">Más de 100.000€</option>
              </select>

              <div className="form-group-label">
                Tu mayor reto ahora mismo (sé concreto)
              </div>
              <textarea
                className="field"
                placeholder="Qué te está frenando ahora mismo con tu clínica..."
                name="challenge"
              />
              <p className="hint">
                Si eres claro aquí, avanzarás más rápido con el Playbook.
              </p>

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Quiero acceder al Playbook 50K"}
              </button>

              {status === "ok" && (
                <p className="form-status form-status--ok">
                  ✅ ¡Listo! Revisa tu email — te hemos enviado el enlace para
                  crear tu cuenta gratuita y empezar a ver los 5 vídeos. Al
                  completarlos, podrás descargar tu Playbook.
                </p>
              )}
              {status === "error" && (
                <p className="form-status form-status--error">
                  ⚠️ Ha habido un problema al enviar el formulario. Inténtalo de nuevo.
                </p>
              )}

              <p className="privacy">
                No hacemos spam. Usaremos estos datos para darte acceso al
                Playbook y a contenido útil sobre cómo mejorar tu clínica.
                Puedes darte de baja cuando quieras.
              </p>
            </form>
          </aside>
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} fisioreferentes · Ayudamos a dueños de
        clínicas a vivir mejor gracias a negocios mejor diseñados.
      </footer>
    </div>
  );
}
