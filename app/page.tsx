"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FacebookPixel } from "@/components/FacebookPixel";

// API route para guardar leads en nuestra base de datos
const LEADS_API_URL = "/api/leads";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "error">(null);

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
        form.reset();
        router.push("/gracias");
      } else {
        setStatus("error");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setStatus("error");
      setLoading(false);
    }
  };

  return (
    <div className="squeeze">
      <FacebookPixel />

      <div className="squeeze-top">
        <div className="brand">
          <Image
            src="/fisioreferentes-logo.png"
            alt="fisioreferentes"
            width={150}
            height={72}
            priority
          />
        </div>
      </div>

      <div className="stage">
        <div className="grid">
          {/* Mensaje */}
          <div className="copy">
            <span className="eyebrow">Gratis · Para dueños de clínica</span>
            <h1>
              Lleva tu clínica a <span>hasta 150.000&nbsp;€</span> al año,
              rentables y sin quemarte
            </h1>
            <p className="sub">
              No es facturar por facturar:{" "}
              <strong>
                hasta 150.000 € al año con un margen de beneficio sano
              </strong>
              . Descárgate el <strong>Playbook 150K</strong>, 19 ejercicios
              prácticos para llegar ahí atrayendo a los pacientes correctos y
              sin vivir pegado a la agenda.
            </p>
            <ul className="checks">
              <li>
                <em>✓</em>
                <span>
                  <strong>19 ejercicios</strong> accionables desde el primer
                  día.
                </span>
              </li>
              <li>
                <em>✓</em>
                <span>
                  <strong>+ 5 vídeos</strong> formativos incluidos.
                </span>
              </li>
              <li>
                <em>✓</em>
                <span>
                  Acceso inmediato, <strong>100% gratis</strong>.
                </span>
              </li>
            </ul>
            <p className="chips-label">Lo que vas a trabajar</p>
            <div className="chips">
              <span>Diagnóstico real</span>
              <span>Paciente ideal</span>
              <span>Cobrar mejor</span>
              <span>Decisiones de dueño</span>
              <span>Recurrencia sana</span>
            </div>
          </div>

          {/* Tarjeta de descarga con formulario */}
          <div className="card">
            <h2>Descárgalo ahora</h2>
            <p className="mini">
              Rellena y accede al instante a los 5 vídeos + el Playbook en
              PDF.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  name="name"
                  required
                />
              </div>

              <div className="field">
                <label>Móvil</label>
                <input
                  type="tel"
                  placeholder="Tu móvil"
                  name="phone"
                  required
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  name="email"
                  required
                />
              </div>

              <div className="field">
                <label>Facturación aproximada de tu clínica</label>
                <select name="revenue" defaultValue="">
                  <option value="">Selecciona…</option>
                  <option value="0-50000">0 – 50.000 €</option>
                  <option value="50000-100000">50.000 – 100.000 €</option>
                  <option value="100000-150000">100.000 – 150.000 €</option>
                  <option value="mas-150000">Más de 150.000 €</option>
                </select>
              </div>

              <div className="field">
                <label>Tu mayor reto ahora mismo (sé concreto)</label>
                <input
                  type="text"
                  placeholder="Ej: dependo demasiado de mi agenda"
                  name="challenge"
                />
              </div>

              <button className="cta" type="submit" disabled={loading}>
                {loading ? "Enviando…" : "Quiero acceder al Playbook 150K"}
              </button>

              {status === "error" && (
                <p className="form-status form-status--error">
                  ⚠️ Ha habido un problema al enviar el formulario. Inténtalo
                  de nuevo.
                </p>
              )}

              <div className="reassure">
                <span>🔒 Sin spam</span>
                <span>✓ Gratis</span>
                <span>⚡ Acceso inmediato</span>
              </div>
              <div className="author">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://s.w.org/images/core/emoji/17.0.2/svg/2b50.svg"
                  alt="⭐"
                  width={28}
                  height={28}
                />{" "}
                Por Fisioreferentes — ayudamos a dueños de clínicas a vivir
                mejor.
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="trust">
        <div className="item">
          <span className="stars">★★★★★</span>{" "}
          <span>
            <strong>+200 clínicas</strong> ya lo están aplicando
          </span>
        </div>
        <div className="sep"></div>
        <div className="item">
          <span className="quote">
            “Subí precios sin perder pacientes y por fin descansé los fines de
            semana.” — Laura, fisioterapeuta
          </span>
        </div>
      </div>

      <div className="foot">
        © {new Date().getFullYear()} fisioreferentes · Ayudamos a dueños de
        clínicas a vivir mejor gracias a negocios mejor diseñados.
      </div>
    </div>
  );
}
