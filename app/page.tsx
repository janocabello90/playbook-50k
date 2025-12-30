"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwaQjE_ZYohQg4aZZALVOStyXUk6ktpWD2pfI4o77j94ObLudCzuuC6j7d2nnAbBxyQzQ/exec"; // <- pon aquí la URL de tu Apps Script

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "ok" | "error">(null);

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setStatus(null);

  const form = e.currentTarget;
  const formData = new FormData(form);

  // Estos nombres coinciden con los parámetros que espera Apps Script
  formData.set("name", String(formData.get("name") || ""));
  formData.set("email", String(formData.get("email") || ""));
  formData.set("hasClinic", String(formData.get("clinic") || ""));
  formData.set("billing", String(formData.get("revenue") || ""));
  formData.set("mainBlock", String(formData.get("challenge") || ""));

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors", // evitamos líos de CORS y preflight
    });

    // Si no ha petado la red, damos por bueno el envío
    setStatus("ok");
    form.reset();

    // Descarga automática del Playbook
    window.location.href = "/Playbook-50K.pdf";
  } catch (error) {
    console.error("Error al enviar al Google Script:", error);
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
              Mira los vídeos ↓ y cuando lo tengas claro, descarga el Playbook y aplícalo.
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

        {/* VIDEOS */}
        <section>
          <h2 className="section-title">
            5 vídeos → claridad, criterio y dirección
          </h2>
          <p className="section-sub">
            Míralos en orden. Cada uno te prepara para aplicar el Playbook y no
            perder el tiempo en acciones que no mueven la aguja.
          </p>

          <div className="steps-grid">
            {/* VIDEO 1 */}
            <article className="step-card">
              <div className="step-label">Vídeo 1</div>
              <div className="step-title">
                Poner rumbo: tus primeros 50K con cabeza
              </div>
              <p className="step-text">
                Entender hacia dónde vas y por qué. Definir tu “buena vida”,
                traducirla a números y dejar de hacer cosas sin dirección.
              </p>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/_ru04hMa_As"
                  title="Video 1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </article>

            {/* VIDEO 2 */}
            <article className="step-card">
              <div className="step-label">Vídeo 2</div>
              <div className="step-title">
                Family, Friends &amp; Fools: tus primeros pacientes correctos
              </div>
              <p className="step-text">
                Quién te conoce, quién confía en ti, quién encaja y quién no.
                Deja de aceptar a cualquiera y empieza a elegir mejor a quién ayudas.
              </p>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/WNuAfg4DXSc"
                  title="Video 2"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </article>

            {/* VIDEO 3 */}
            <article className="step-card">
              <div className="step-label">Vídeo 3</div>
              <div className="step-title">
                Propuesta de valor: recurrencia y seguridad
              </div>
              <p className="step-text">
                Diseñar servicios que aportan tanto valor que el precio deja de
                ser el problema. Más valor, mejores precios, menos estrés.
              </p>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/w3xP1okApKw"
                  title="Video 3"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </article>

            {/* VIDEO 4 */}
            <article className="step-card">
              <div className="step-label">Vídeo 4</div>
              <div className="step-title">
                El Iceberg de problemas: dejar de parchear
              </div>
              <p className="step-text">
                Problemas explícitos, implícitos, funcionales y emocionales.
                Si entiendes esto, dejas de competir por precio y empiezas a
                competir por valor real.
              </p>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/Wb61RYnp3rQ"
                  title="Video 4"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </article>

            {/* VIDEO 5 */}
            <article className="step-card">
              <div className="step-label">Vídeo 5</div>
              <div className="step-title">
                Matriz MERCI: escalar con señal y autoridad
              </div>
              <p className="step-text">
                Reputación, entorno, reseñas, contenido e información. Cómo
                construir señal de “referente” en tu zona sin postureo ni humo.
              </p>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/XmJ6y9eRj9w"
                  title="Video 5"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </article>
          </div>
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
            <div className="form-title">Descarga el Playbook 50K</div>

            <p className="form-sub">
              Déjanos tus datos y te enviamos el Playbook 50K a tu correo para que
              puedas empezar a aplicarlo hoy mismo.
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
                type="email"
                placeholder="Tu mejor email"
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
                {loading ? "Enviando..." : "Descargar Playbook 50K"}
              </button>

              {status === "ok" && (
                <p className="form-status form-status--ok">
                  ✅ Todo correcto. Revisa tu correo en unos minutos.
                </p>
              )}
              {status === "error" && (
                <p className="form-status form-status--error">
                  ⚠️ Ha habido un problema al enviar el formulario. Inténtalo de nuevo.
                </p>
              )}

              <p className="privacy">
                No hacemos spam. Usaremos estos datos para enviarte el Playbook y
                contenido útil sobre cómo mejorar tu clínica. Puedes darte de baja
                cuando quieras.
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
