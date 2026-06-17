# GPX STL Studio

Aplicacao web para transformar arquivos GPX em um modelo 3D de corrida, com base personalizada, trajeto em relevo por elevacao e texto editavel. O modelo pode ser visualizado, rotacionado no navegador e exportado em STL ou 3MF para impressao 3D.

## O que o projeto faz

- Importa arquivos `.gpx` por botao ou arrastar e soltar.
- Le pontos de latitude, longitude, elevacao e tempo do GPX.
- Calcula automaticamente distancia, tempo, pace, quantidade de pontos e variacao de elevacao.
- Gera uma visualizacao 3D interativa com Three.js.
- Cria o percurso em relevo, usando a elevacao do arquivo.
- Permite editar titulo, distancia, tempo e pace que aparecem no modelo.
- Permite escolher quais informacoes aparecem abaixo do titulo.
- Permite ajustar rotacao do mapa, corte do trajeto, largura da base, espessura, altura e largura do percurso.
- Oferece tres formatos de base: quadrada, redonda e hexagonal.
- Permite configurar cores da base, do trajeto e do texto.
- Exporta em `.stl` como modelo unico.
- Exporta em `.3mf` com objetos separados: base, trajeto e texto.

## Formatos de exportacao

O projeto oferece duas opcoes:

- `STL`: formato tradicional, ideal para impressao em uma unica cor/material.
- `3MF`: formato recomendado quando voce quer abrir o arquivo no fatiador com as partes separadas e escolher cores diferentes para cada objeto.

No arquivo exportado, os objetos sao separados como:

- `Base`
- `Trajeto`
- `Texto`

Isso facilita o uso em fatiadores como Bambu Studio, OrcaSlicer, PrusaSlicer e similares.

## Como rodar localmente

Este projeto e estatico e nao precisa de build. Ele usa imports via CDN para carregar o Three.js.

Requisitos:

- Python 3 instalado
- Um navegador moderno

Na raiz do projeto, rode:

```bash
npm run dev
```

Depois acesse:

```text
http://localhost:5173/
```

Tambem e possivel rodar:

```bash
npm run serve
```

## Como usar

1. Abra o site em `http://localhost:5173/`.
2. Clique em `Importar GPX` ou solte um arquivo GPX na area indicada.
3. Ajuste titulo, informacoes do subtitulo, formato da base, dimensoes e cores.
4. Rotacione o modelo na visualizacao 3D para conferir o resultado.
5. Clique em `Exportar STL` ou `Exportar 3MF`.
6. Abra o arquivo no fatiador. Se usar `.3mf`, defina a cor/material de cada objeto.

## Estrutura dos arquivos

```text
.
├── index.html
├── styles.css
├── app.js
├── package.json
└── README.md
```

## Tecnologias

- HTML
- CSS
- JavaScript ES Modules
- Three.js
- 3MF gerado diretamente no navegador

## Observacoes

- O app precisa ser aberto via servidor local para evitar limitacoes do navegador com `file://`.
- O arquivo GPX precisa ter pelo menos dois pontos validos.
- Se o GPX tiver `<name>`, esse valor e usado automaticamente como titulo inicial.
- A exportacao em 3MF mantem objetos separados; STL tradicional junta tudo em uma malha unica e nao e ideal para impressao com cores diferentes.
