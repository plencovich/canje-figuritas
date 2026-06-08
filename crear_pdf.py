from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import argparse
import json
from pathlib import Path

# Nombre del archivo PDF (se define según el tipo seleccionado)

# El JSON es la única fuente de verdad para el PDF y la web.
data_file = Path(__file__).resolve().parent / "data" / "figuritas.json"
with data_file.open(encoding="utf-8") as file:
    figuritas = json.load(file)

dataRepetidas = figuritas["repetidas"]
dataFaltantes = figuritas["faltantes"]


def quitar_repetidos(numbers):
    vistos = set()
    unicos = []

    for number in numbers:
        if number in vistos:
            continue

        vistos.add(number)
        unicos.append(number)

    return unicos


def preparar_datos_para_pdf(data, quitar_duplicados=False):
    datos_pdf = {}

    for country, numbers in data.items():
        if quitar_duplicados:
            datos_pdf[country] = quitar_repetidos(numbers)
        else:
            datos_pdf[country] = sorted(numbers)

    return datos_pdf

# Selección de dataset según argumento CLI
parser = argparse.ArgumentParser(description="Crear PDF listado de países")
parser.add_argument(
    "tipo",
    nargs="?",
    choices=["repetidas", "faltantes"],
    default="repetidas",
    help='Elija "repetidas" o "faltantes" (por defecto: repetidas)',
)
args = parser.parse_args()

if args.tipo == "repetidas":
    data = preparar_datos_para_pdf(dataRepetidas, quitar_duplicados=True)
else:
    data = preparar_datos_para_pdf(dataFaltantes)

# Nombre del archivo PDF según el tipo
pdf_file = f"listado-{args.tipo}.pdf"

# Título dinámico según el tipo
title_text = "Repetidas" if args.tipo == "repetidas" else "Faltantes"

# Crear PDF
c = canvas.Canvas(pdf_file, pagesize=letter)
width, height = letter

# Título
c.setFont("Helvetica-Bold", 16)
c.drawString(180, height - 40, title_text)

# Configuración de columnas
left_x = 50
right_x = 320

start_y = height - 80
line_height = 16

# Ordenar los países alfabéticamente
items = sorted(data.items())
half = (len(items) + 1) // 2

left_column = items[:half]
right_column = items[half:]

# Fuente
c.setFont("Helvetica", 10)

# Columna izquierda
y_left = start_y
for country, numbers in left_column:
    line = f"{country}: {', '.join(map(str, numbers))}"
    c.drawString(left_x, y_left, line)
    y_left -= line_height

# Columna derecha
y_right = start_y
for country, numbers in right_column:
    line = f"{country}: {', '.join(map(str, numbers))}"
    c.drawString(right_x, y_right, line)
    y_right -= line_height

# Guardar PDF
c.save()

print(f"PDF creado correctamente: {pdf_file}")
