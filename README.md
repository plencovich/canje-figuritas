# Canje de figuritas Mundial 2026

Sitio estático responsive para seleccionar figuritas repetidas y faltantes, armar una propuesta de
canje y enviarla por WhatsApp. El mismo archivo JSON alimenta la web y la generación de PDFs.

## Fuente de datos

`data/figuritas.json` es la única fuente de verdad:

```json
{
  "repetidas": {
    "ARG": [1, 5, 10]
  },
  "faltantes": {
    "ARG": [2, 7]
  }
}
```

Para actualizar los listados, editá únicamente ese archivo. Usá códigos de país como claves y
arrays de números. La web ordena países y números y elimina duplicados al mostrarlos. El PDF
conserva los datos del JSON, incluidos los duplicados.

La web agrega automáticamente un parámetro de versión al solicitar el JSON y desactiva la caché
del navegador para que los cambios publicados se carguen sin reutilizar una copia anterior.

## Probar localmente

La web usa `fetch`, por lo que no conviene abrir `index.html` directamente con `file://`. Desde la
raíz del proyecto ejecutá:

```bash
python3 -m http.server 8000
```

Luego abrí `http://localhost:8000`.

## Configurar WhatsApp

En `assets/js/app.js`, reemplazá:

```js
const WHATSAPP_PHONE = "549XXXXXXXXXX"
```

por el número real en formato internacional, sin `+`, espacios ni guiones. Para Argentina, el
formato habitual para WhatsApp incluye `54` y `9` antes del código de área.

## Generar los PDFs

Instalá ReportLab si todavía no está disponible:

```bash
python3 -m pip install reportlab
```

Generá cada listado con:

```bash
python3 crear_pdf.py repetidas
python3 crear_pdf.py faltantes
```

Sin argumento se genera `listado-repetidas.pdf`, igual que en el flujo original. `crear_pdf.py`
sigue usando el mismo diseño, argumentos y nombres de salida; solamente lee los datos desde
`data/figuritas.json`.

## Publicar en GitHub Pages

1. Subí el proyecto a un repositorio de GitHub.
2. En el repositorio, abrí **Settings > Pages**.
3. En **Build and deployment**, elegí **Deploy from a branch**.
4. Seleccioná la rama principal (`main`) y la carpeta raíz (`/ root`).
5. Guardá y esperá a que GitHub publique la URL.

No se requiere backend, base de datos ni proceso de compilación.

## Documentación técnica

- [Desarrollo HTML para canje de figuritas](docs/prompts/desarrollo-html-canje-figuritas.md)
