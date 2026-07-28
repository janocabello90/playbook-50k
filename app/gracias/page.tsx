import Image from "next/image";
import { FacebookPixel } from "@/components/FacebookPixel";

export default function GraciasPage() {
  return (
    <div className="squeeze">
      <FacebookPixel trackLead />

      <div className="squeeze-top">
        <div className="brand">
          <Image
            src="/fisioreferentes-logo.png"
            alt="fisioreferentes"
            width={130}
            height={30}
            priority
          />
        </div>
      </div>

      <div className="stage">
        <div className="thanks-card">
          <div className="thanks-icon">✅</div>
          <h1>¡Listo!</h1>
          <p>
            Revisa tu email — te hemos enviado tus <strong>credenciales de
            acceso</strong>. Al entrar verás tus 5 vídeos y podrás descargar
            el Playbook.
          </p>
          <p className="thanks-hint">
            Si no lo ves en unos minutos, revisa la carpeta de spam o
            promociones.
          </p>
        </div>
      </div>

      <div className="foot">
        © {new Date().getFullYear()} fisioreferentes · Ayudamos a dueños de
        clínicas a vivir mejor gracias a negocios mejor diseñados.
      </div>
    </div>
  );
}
