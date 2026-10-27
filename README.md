# Básico Peluqueros — prototipo independiente

Propuesta conceptual basada en la dirección visual del export de Google Stitch. No es una web oficial ni está autorizada por el establecimiento. No existe envío de reservas, agenda conectada ni almacenamiento de datos.

## Desarrollo

Requiere Node.js 20.19+ o 22.12+. El cargador `runner` de Vite evita usar el empaquetador de configuración esbuild en entornos restringidos.

```sh
npm install
npm run dev
npm run build
npm run preview
```

Vite compila la web estática a `dist/`. En Vercel, importa el proyecto como Vite, usa `npm run build` y `dist` como directorio de salida. No requiere configuración SPA ni secretos.

## Rendimiento

- GSAP y ScrollTrigger se cargan como chunks dinámicos durante un periodo ocioso, después del JavaScript de interfaz esencial. El contenido permanece visible si no se cargan.
- La hoja de Google Fonts usa preload no bloqueante, `display=swap` y fuentes de reserva. Requiere conexión externa para mostrar las tipografías de marca; sin ella se usan Georgia y sans serif del sistema.
- Hero y galería usan siete fotografías del salón suministradas por el usuario, guardadas localmente en `public/images/` como WebP. El hero tiene prioridad alta y las seis imágenes de galería usan lazy loading; el mapa conceptual sigue siendo CSS.
- Vercel aplica caché inmutable de un año a `/assets/` con hash, revalidación inmediata a HTML y un día con revalidación al favicon.
- Build local observado: CSS 15,60 KB (4,60 KB gzip); entrada JS 6,77 KB (2,89 KB gzip); chunks dinámicos GSAP 70,43 KB (27,68 KB gzip) y ScrollTrigger 43,55 KB (18,11 KB gzip). La compilación anterior empaquetaba 119,53 KB de JS inicial (47,28 KB gzip); la nueva entrada inicial transfiere ~94% menos JavaScript comprimido. Los chunks de animación se cargan después, así que esta comparación mide el camino inicial, no el total de recursos de una sesión completa.
- No se ejecutó Lighthouse ni una simulación de red lenta: este entorno no tiene Lighthouse ni un binario Chrome/Edge local. No hay resultados de LCP, CLS, TBT, INP, Speed Index ni puntuaciones que puedan afirmarse. La respuesta local se comprobó por HTTP; faltan mediciones de navegador y cabeceras en un despliegue real.

## Edición

- Cambia los datos centrales en `src/data.js`. Los servicios, duraciones y precios actuales son ejemplos sin confirmar.
- Las fotografías actuales proceden de los archivos suministrados `10.PNG` a `16.PNG`; los originales no se modificaron. Los WebP son derivados optimizados locales.
- Los textos, dirección y teléfono deben confirmarse antes de cualquier publicación comercial.
- Las opiniones y la valoración 4,9 no se han publicado porque no se verificaron.

## Qué está simulado

El flujo local permite elegir un servicio, una fecha y una hora ficticias, introducir datos de prueba, revisar un resumen y mostrar una finalización inequívoca como demostración. No hace peticiones de reserva ni guarda los campos en `localStorage`, analytics o servidor. Usa solamente datos ficticios.

## Antes de convertirlo en una web real

Se requiere autorización del titular, confirmación del nombre comercial, contacto, ubicación, servicios, precios, duraciones, imágenes con derechos, horario y reseñas verificables. También se deberá acordar el aviso de privacidad y la gestión de los datos antes de pedir información a clientes.

## Futura integración de Google Calendar

No existe conexión ni backend en este proyecto. La versión real necesita autorización del negocio sobre su cuenta, credenciales OAuth guardadas exclusivamente en servidor, backend para consultar disponibilidad y crear eventos, zona horaria `Europe/Madrid`, validación de disponibilidad al confirmar, control de concurrencia para evitar dobles reservas, reintentos y cancelaciones, manejo de errores y medidas de privacidad. Nunca deben exponerse credenciales en JavaScript público o variables `VITE_`. La confirmación solo debe mostrarse después de que el servidor confirme la creación del evento.
