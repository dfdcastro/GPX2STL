# GPX STL Studio

## English

Web app for turning GPX files into a 3D running model, with a custom base, an elevation-relief route, and editable text. The model can be previewed, rotated in the browser, and exported as STL or 3MF for 3D printing.

### What The Project Does

- Imports `.gpx` files through a button or drag and drop.
- Reads latitude, longitude, elevation, and time points from the GPX.
- Automatically calculates distance, duration, pace, point count, and elevation range.
- Generates an interactive 3D preview with Three.js.
- Creates a raised route using the elevation data from the file.
- Lets you edit the title, distance, time, and pace shown on the model.
- Lets you choose which details appear under the title.
- Lets you adjust map rotation, route trim, base width, base thickness, route height, and route width.
- Offers three base shapes: square, round, and hexagonal.
- Lets you configure base, route, and text colors.
- Exports `.stl` as a single model.
- Exports `.3mf` with separate objects: base, route, and text.

### Export Formats

The project offers two options:

- `STL`: traditional format, ideal for single-color or single-material printing.
- `3MF`: recommended when you want to open the file in a slicer with separated parts and assign different colors to each object.

In the exported file, the objects are separated as:

- `Base`
- `Route`
- `Text`

This makes the model easier to use in slicers such as Bambu Studio, OrcaSlicer, PrusaSlicer, and similar tools.

### Running Locally

This project is static and does not require a build step. It uses CDN imports to load Three.js.

Requirements:

- Python 3 installed
- A modern browser

From the project root, run:

```bash
cd code
npm run dev
```

Then open:

```text
http://localhost:5173/
```

You can also run:

```bash
cd code
npm run serve
```

### How To Use

1. Open `http://localhost:5173/`.
2. Click `Import GPX` or drop a GPX file onto the upload area.
3. Adjust the title, subtitle details, base shape, dimensions, and colors.
4. Rotate the model in the 3D preview to check the result.
5. Click `Export STL` or `Export 3MF`.
6. Open the file in your slicer. If you use `.3mf`, set the color or material for each object.

### File Structure

```text
.
├── README.md
└── code
    ├── index.html
    ├── styles.css
    ├── app.js
    └── package.json
```

### Technologies

- HTML
- CSS
- JavaScript ES Modules
- Three.js
- 3MF generated directly in the browser

### Notes

- The app must be opened through a local server to avoid browser limitations with `file://`.
- The GPX file must contain at least two valid points.
- If the GPX has a `<name>`, that value is used automatically as the initial title.
- The 3MF export keeps objects separated; traditional STL combines everything into a single mesh and is not ideal for multi-color printing.

---

## Português

Aplicação web para transformar arquivos GPX em um modelo 3D de corrida, com base personalizada, trajeto em relevo por elevação e texto editável. O modelo pode ser visualizado, rotacionado no navegador e exportado em STL ou 3MF para impressão 3D.

### O que o projeto faz

- Importa arquivos `.gpx` por botão ou ao arrastar e soltar.
- Lê pontos de latitude, longitude, elevação e tempo do GPX.
- Calcula automaticamente distância, tempo, pace, quantidade de pontos e variação de elevação.
- Gera uma visualização 3D interativa com Three.js.
- Cria o percurso em relevo usando a elevação do arquivo.
- Permite editar título, distância, tempo e pace que aparecem no modelo.
- Permite escolher quais informações aparecem abaixo do título.
- Permite ajustar rotação do mapa, corte do trajeto, largura da base, espessura, altura e largura do percurso.
- Oferece três formatos de base: quadrada, redonda e hexagonal.
- Permite configurar cores da base, do trajeto e do texto.
- Exporta em `.stl` como modelo único.
- Exporta em `.3mf` com objetos separados: base, trajeto e texto.

### Formatos de exportação

O projeto oferece duas opções:

- `STL`: formato tradicional, ideal para impressão em uma única cor ou material.
- `3MF`: formato recomendado quando você quer abrir o arquivo no fatiador com as partes separadas e escolher cores diferentes para cada objeto.

No arquivo exportado, os objetos são separados como:

- `Base`
- `Trajeto`
- `Texto`

Isso facilita o uso em fatiadores como Bambu Studio, OrcaSlicer, PrusaSlicer e similares.

### Como rodar localmente

Este projeto é estático e não precisa de build. Ele usa importações via CDN para carregar o Three.js.

Requisitos:

- Python 3 instalado
- Um navegador moderno

Na raiz do projeto, rode:

```bash
cd code
npm run dev
```

Depois acesse:

```text
http://localhost:5173/
```

Também é possível rodar:

```bash
cd code
npm run serve
```

### Como usar

1. Abra o site em `http://localhost:5173/`.
2. Clique em `Import GPX` ou solte um arquivo GPX na área indicada.
3. Ajuste título, informações do subtítulo, formato da base, dimensões e cores.
4. Rotacione o modelo na visualização 3D para conferir o resultado.
5. Clique em `Export STL` ou `Export 3MF`.
6. Abra o arquivo no fatiador. Se usar `.3mf`, defina a cor ou material de cada objeto.

### Estrutura dos arquivos

```text
.
├── README.md
└── code
    ├── index.html
    ├── styles.css
    ├── app.js
    └── package.json
```

### Tecnologias

- HTML
- CSS
- JavaScript ES Modules
- Three.js
- 3MF gerado diretamente no navegador

### Observações

- O app precisa ser aberto via servidor local para evitar limitações do navegador com `file://`.
- O arquivo GPX precisa ter pelo menos dois pontos válidos.
- Se o GPX tiver `<name>`, esse valor é usado automaticamente como título inicial.
- A exportação em 3MF mantém objetos separados; STL tradicional junta tudo em uma malha única e não é ideal para impressão com cores diferentes.
