import Script from "next/script";

const PIXEL_ID = "417932844179971";

// Código base del píxel de Meta (init + PageView). Se usa en la home y en
// /gracias (nunca en /admin). El id del script es fijo a propósito: Next.js
// deduplica por id, así que si el usuario navega de la home a /gracias sin
// recargar (navegación cliente, p. ej. tras enviar el formulario), este
// script no se vuelve a insertar — por eso el evento Lead NO puede vivir
// aquí dentro (ver FacebookPixelLead más abajo).
export function FacebookPixel() {
  return (
    <>
      <Script id="fb-pixel-base" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height={1}
          width={1}
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

// Evento Lead, exclusivo de /gracias. Va en un script con id propio
// (distinto de "fb-pixel-base") para que Next.js SIEMPRE lo ejecute al
// entrar en /gracias, sea navegación completa o navegación cliente desde
// la home. fbq ya existe en window para ese momento (lo define
// FacebookPixel, que se monta antes en el árbol), pero se comprueba por
// seguridad.
export function FacebookPixelLead() {
  return (
    <Script id="fb-pixel-lead" strategy="afterInteractive">
      {`window.fbq && window.fbq('track', 'Lead');`}
    </Script>
  );
}
