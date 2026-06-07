# Desarrollo de página HTML5 para canje de figuritas

## Objetivo del documento

Este documento registra el origen funcional y técnico del desarrollo de la página HTML5 para canje de figuritas del álbum del Mundial de Fútbol 2026.

La finalidad es dejar documentado:

- El requerimiento original.
- El criterio funcional esperado.
- La decisión de separar los datos en un archivo JSON.
- El prompt utilizado para generar la implementación inicial con Codex.
- Las recomendaciones técnicas aplicadas al proyecto.

---

## Requerimiento original

El proyecto contaba inicialmente con un archivo Python llamado `crear_pdf.py`.

Ese archivo tenía dos estructuras de datos:

- `dataRepetidas`
- `dataFaltantes`

Cada estructura contenía códigos de países como clave y, dentro de cada país, un array con los números de figuritas correspondientes al álbum del Mundial de Fútbol 2026.

El archivo `crear_pdf.py` se utilizaba para generar un PDF con el listado de figuritas repetidas y faltantes.

El nuevo requerimiento fue crear una página HTML5, con CSS y JavaScript si fuera necesario, para que un usuario pudiera:

1. Acceder a una página web.
2. Seleccionar las figuritas que necesita desde mi listado de repetidas.
3. Seleccionar las figuritas que me ofrece desde mi listado de faltantes.
4. Generar un texto listo para enviar por WhatsApp a mi número de teléfono.

---

## Texto funcional brindado como requerimiento

```txt
Actualmente sólo hay un archivo crear_pdf.py el cual tiene un array de "dataRepetidas" y otro de "dataFaltantes". Cada array tiene código de países, dentro cada código tiene un array con los números de figuritas del álbum del Mundial de fútbol 2026.

Ese archivo actualmente lo utilizo para crear PDF con el listado correspondiente.

Ese archivo debe quedar intacto.

Necesito crear un HTML5 con CSS y JS si es necesario.

La finalidad de ese archivo es que el usuario acceda, seleccione las figuritas que le faltan de mi listado de repetidas; y seleccione las figuritas que me da, de mi listado de faltantes.

La selección debe ser checkbox, con selección múltiple; y un botón de "canjear" que lo que haría se generaría un texto para enviar por WhatsApp a mi número de teléfono.

El texto a generar debe ser:
- Listado de las que el usuario requiere, o sea mis repetidas, ordenadas alfabéticamente por país y luego por número dentro de cada país, con un total.
- Listado de las que el usuario me da a canje por las anteriores, o sea las que yo tengo en mis faltantes, ordenadas alfabéticamente por país y luego por número dentro de cada país, con un total.

Si las figuritas que el usuario requiere es mayor a las que yo le doy, debe aparecer un mensaje que diga:
"El canje se realiza figurita por figurita; si necesitas más figuritas de las que vos me das; el canje se realiza 1 sobre cerrado cada 7 figuritas."

Los arrays dataRepetidas y dataFaltantes podemos abstraerlos del archivo Python y llevarlos a un JSON para que yo lo siga actualizando y se pueda utilizar para generar el PDF como para la página HTML5 a generar.

Realizar un diseño intuitivo y fácil de utilizar, que sea 100% responsive adaptado para mobile.

La idea es hostearlo en GitHub Pages en un repositorio, ya que es gratuito y con facilidad de deployar.

También se aceptan recomendaciones para diseño y disposición. La idea es hacer algo práctico y fácil para el usuario, que genere una lista para enviarme por WhatsApp a mi número.
```

---

## Decisión técnica

Se decidió que el proyecto sea estático para poder publicarlo fácilmente en GitHub Pages.

La estructura recomendada fue:

```txt
/
├── index.html
├── crear_pdf.py
├── data/
│   └── figuritas.json
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
└── README.md
```

La decisión principal fue mover los datos a un archivo JSON compartido:

```txt
data/figuritas.json
```

De esta forma, el JSON pasa a ser la única fuente de verdad para:

- La página HTML5.
- La generación del PDF.
- El mantenimiento manual de figuritas repetidas y faltantes.

Ejemplo de estructura esperada:

```json
{
  "repetidas": {
    "ARG": [1, 5, 10],
    "BRA": [3, 8]
  },
  "faltantes": {
    "ARG": [2, 7],
    "FRA": [4, 9]
  }
}
```

---

## Prompt utilizado para Codex

```txt
Actuá como experto en HTML5, CSS responsive, JavaScript vanilla, Python y generación de PDFs.

Contexto actual del proyecto:

Actualmente existe un archivo llamado crear_pdf.py.

Ese archivo contiene dos estructuras de datos:

- dataRepetidas
- dataFaltantes

Cada estructura contiene códigos de países como clave, y dentro de cada país hay un array con los números de figuritas del álbum del Mundial de Fútbol 2026.

Actualmente crear_pdf.py se usa para generar un PDF con el listado correspondiente de figuritas repetidas y faltantes.

Objetivo general:

Crear una página HTML5 responsive para que otra persona pueda seleccionar:

1. Las figuritas que quiere pedirme, usando mi listado de dataRepetidas.
2. Las figuritas que me ofrece a cambio, usando mi listado de dataFaltantes.

Luego, al presionar un botón “Canjear”, se debe generar un mensaje listo para enviar por WhatsApp a mi número de teléfono.

Regla importante sobre crear_pdf.py:

- El archivo crear_pdf.py debe quedar intacto en cuanto a su funcionalidad actual.
- No romper la generación actual del PDF.
- No eliminar lógica existente sin validar compatibilidad.
- Si se modifica, debe ser solo para leer datos desde un JSON externo manteniendo exactamente el mismo resultado de PDF.
- Si existe riesgo de romperlo, crear un nuevo archivo Python auxiliar y dejar crear_pdf.py sin cambios.

Nueva arquitectura de datos recomendada:

Abstraer los datos de dataRepetidas y dataFaltantes a un archivo JSON compartido, para que pueda ser usado tanto por:

- La generación del PDF.
- La nueva página HTML5.

Crear un archivo, por ejemplo:

data/figuritas.json

Con una estructura clara como esta:

{
  "repetidas": {
    "ARG": [1, 5, 10],
    "BRA": [3, 8]
  },
  "faltantes": {
    "ARG": [2, 7],
    "FRA": [4, 9]
  }
}

Requisitos técnicos:

1. Crear una página estática usando:
   - index.html
   - assets/css/styles.css
   - assets/js/app.js
   - data/figuritas.json

2. Usar HTML5 semántico.
3. Usar CSS propio, sin frameworks obligatorios.
4. Usar JavaScript vanilla.
5. La página debe funcionar correctamente en GitHub Pages.
6. No usar backend.
7. No usar base de datos.
8. El JSON debe cargarse desde data/figuritas.json.
9. El diseño debe ser 100% responsive y mobile-first.
10. Debe funcionar bien en celulares, ya que la mayoría de los usuarios van a acceder desde WhatsApp o navegador móvil.

Funcionalidad principal:

La pantalla debe mostrar dos secciones principales:

Sección 1: “Figuritas que necesitás”

Esta sección debe mostrar mis figuritas repetidas, es decir, los datos de repetidas.

Cada figurita debe poder seleccionarse con checkbox.

La selección debe permitir múltiples figuritas.

La información debe estar agrupada por país.

Los países deben mostrarse ordenados alfabéticamente por código.

Dentro de cada país, los números de figuritas deben mostrarse ordenados de menor a mayor.

Sección 2: “Figuritas que me das a cambio”

Esta sección debe mostrar mis figuritas faltantes, es decir, los datos de faltantes.

Cada figurita debe poder seleccionarse con checkbox.

La selección debe permitir múltiples figuritas.

La información debe estar agrupada por país.

Los países deben mostrarse ordenados alfabéticamente por código.

Dentro de cada país, los números de figuritas deben mostrarse ordenados de menor a mayor.

Botón principal:

Crear un botón principal con el texto:

Canjear

Al hacer clic en “Canjear”, el sistema debe:

1. Tomar las figuritas seleccionadas por el usuario en la sección “Figuritas que necesitás”.
2. Tomar las figuritas seleccionadas por el usuario en la sección “Figuritas que me das a cambio”.
3. Ordenar ambos listados alfabéticamente por país y luego por número.
4. Generar un texto listo para enviar por WhatsApp.
5. Abrir WhatsApp usando un link compatible con mobile y desktop.

Configurar el número de WhatsApp en una constante dentro de assets/js/app.js, por ejemplo:

const WHATSAPP_PHONE = "549XXXXXXXXXX";

Dejar un comentario claro indicando que se debe reemplazar por el número real en formato internacional, sin +, sin espacios y sin guiones.

Formato del mensaje de WhatsApp:

El mensaje generado debe tener esta estructura:

Hola, quiero hacer un canje de figuritas.

Figuritas que necesito:
ARG: 1, 5, 10
BRA: 3, 8
Total que necesito: 5

Figuritas que te doy:
ARG: 2, 7
FRA: 4, 9
Total que te doy: 4

Regla de canje:

Si la cantidad total de figuritas que el usuario requiere, es decir, las seleccionadas desde mis repetidas, es mayor que la cantidad total de figuritas que el usuario me da, es decir, las seleccionadas desde mis faltantes, debe aparecer un mensaje visual en pantalla con este texto exacto:

"El canje se realiza figurita por figurita; si necesitas más figuritas de las que vos me das; el canje se realiza 1 sobre cerrado cada 7 figuritas."

También incluir este mismo mensaje al final del texto de WhatsApp cuando aplique.

Validaciones:

1. Si el usuario no selecciona ninguna figurita de mis repetidas, mostrar un mensaje:
   - “Seleccioná al menos una figurita que necesitás.”

2. Si el usuario no selecciona ninguna figurita de mis faltantes, permitir continuar, pero mostrar una advertencia:
   - “No seleccionaste figuritas para dar a cambio.”

3. El botón “Canjear” debe estar visible y ser fácil de tocar en mobile.

4. Evitar que el mensaje generado quede desordenado.

5. Evitar duplicados si en el JSON hubiera números repetidos dentro de un mismo país. En ese caso, normalizar o mostrar una sola vez cada número.

Diseño UX/UI:

Crear un diseño simple, intuitivo y práctico.

Debe incluir:

1. Header con título:
   - “Canje de figuritas Mundial 2026”

2. Texto breve introductorio:
   - “Seleccioná las figuritas que necesitás y las que me das a cambio. Después tocá Canjear para enviarme el listado por WhatsApp.”

3. Dos bloques/secciones diferenciadas:
   - “Figuritas que necesitás”
   - “Figuritas que me das a cambio”

4. Cada sección debe tener:
   - Buscador por país o número.
   - Contador de seleccionadas.
   - Botón chico para limpiar selección.
   - Agrupación por país.

5. Diseño mobile-first:
   - En mobile, las secciones deben ir una debajo de la otra.
   - En desktop, pueden ir en dos columnas.

6. Los checkboxes deben ser grandes y fáciles de tocar.

7. Los códigos de país deben destacarse visualmente.

8. Las figuritas seleccionadas deben tener un estado visual claro.

9. El botón “Canjear” debe ser prominente.

10. Agregar un resumen fijo o visible antes de canjear:
   - Total que necesitás.
   - Total que me das.
   - Diferencia, si existe.

Recomendaciones de estructura del proyecto:

/
├── index.html
├── crear_pdf.py
├── data/
│   └── figuritas.json
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
└── README.md

README.md:

Crear o actualizar un README.md con:

1. Descripción del proyecto.
2. Cómo actualizar el archivo data/figuritas.json.
3. Cómo abrir la web localmente.
4. Cómo publicar en GitHub Pages.
5. Cómo configurar el número de WhatsApp.
6. Cómo generar el PDF.
7. Aclaración de que crear_pdf.py debe seguir funcionando.

Python / PDF:

Analizar crear_pdf.py.

Si es seguro, refactorizarlo para que lea desde data/figuritas.json en lugar de tener los arrays hardcodeados.

Condiciones para esta refactorización:

1. El PDF generado debe mantenerse igual o equivalente al actual.
2. No cambiar nombres de salida salvo que sea necesario.
3. Mantener compatibilidad con el flujo actual.
4. Si no es seguro modificarlo, dejar crear_pdf.py intacto y crear un nuevo archivo, por ejemplo:
   - crear_pdf_desde_json.py

Ese nuevo archivo debe generar el PDF usando data/figuritas.json.

Criterios de aceptación:

1. La página carga correctamente desde index.html.
2. La página carga los datos desde data/figuritas.json.
3. Se muestran las figuritas repetidas en la sección “Figuritas que necesitás”.
4. Se muestran las figuritas faltantes en la sección “Figuritas que me das a cambio”.
5. Los países están ordenados alfabéticamente.
6. Los números están ordenados de menor a mayor.
7. Se puede seleccionar múltiples figuritas con checkbox.
8. Se muestra el total de figuritas seleccionadas en cada sección.
9. El botón “Canjear” genera correctamente el texto para WhatsApp.
10. El mensaje de WhatsApp respeta el formato solicitado.
11. Si el total de figuritas que el usuario necesita es mayor que el total de figuritas que me da, se muestra el mensaje obligatorio de regla de canje.
12. El diseño es responsive y usable en mobile.
13. El proyecto puede publicarse en GitHub Pages sin backend.
14. crear_pdf.py no queda roto.
15. El README explica cómo mantener los datos y publicar el sitio.

Importante:

Antes de modificar archivos, hacer un análisis breve de la estructura actual y proponer el plan de cambios.

Luego implementar los cambios.

Al finalizar, informar:

1. Archivos creados.
2. Archivos modificados.
3. Cómo probar localmente.
4. Cómo configurar el número de WhatsApp.
5. Cómo publicar en GitHub Pages.
6. Si crear_pdf.py fue modificado o si se creó un nuevo script alternativo.
```

---

## Criterios de aceptación documentados

El desarrollo se considera correcto si cumple con los siguientes puntos:

- La página carga desde `index.html`.
- Los datos se leen desde `data/figuritas.json`.
- Las figuritas repetidas se muestran como las que el usuario puede pedir.
- Las figuritas faltantes se muestran como las que el usuario puede ofrecer.
- Las selecciones se realizan con checkboxes.
- El usuario puede seleccionar múltiples figuritas.
- El listado generado se ordena por país y número.
- El mensaje se genera correctamente para WhatsApp.
- Se muestra el total de figuritas solicitadas.
- Se muestra el total de figuritas ofrecidas.
- Se aplica la regla de canje cuando corresponde.
- El sitio es responsive y usable desde mobile.
- El proyecto puede publicarse en GitHub Pages.
- La generación del PDF no se rompe.

---

## Recomendación de mantenimiento

Para mantener el proyecto simple, se recomienda que `data/figuritas.json` sea la única fuente de verdad.

Cada vez que cambien las figuritas repetidas o faltantes, actualizar únicamente ese archivo.

Luego validar:

1. Que la página web muestre correctamente los cambios.
2. Que el PDF se genere correctamente.
3. Que el mensaje de WhatsApp siga respetando el formato esperado.

---

## Deploy recomendado

El sitio puede publicarse en GitHub Pages desde la rama `main`.

Recomendación de flujo:

```bash
git checkout -b dev
git add .
git commit -m "Crear página de canje de figuritas"
git push origin dev
```

Luego crear un Pull Request desde `dev` hacia `main`.

La rama `main` debería mantenerse protegida para evitar cambios accidentales.
