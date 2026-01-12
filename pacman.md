# Gerador de Pacman GitHub (SVG Animado)
Este projeto gera uma animação SVG do Pacman devorando seu gráfico de contribuições do GitHub.

## Como Usar
1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Com o terminal nesta pasta, execute:
   ```bash
   node generate_pacman.js
   ```
3. O arquivo `pacman.svg` será criado.
4. Você pode fazer upload deste arquivo no seu repositório e usá-lo no seu profile:
   ```markdown
   ![Pacman](https://raw.githubusercontent.com/seu-usuario/seu-repo/main/pacman.svg)
   ```

## Opção 2: GitHub Action (Automático)
Se você quer que a animação seja atualizada automaticamente com suas contribuições reais:

1. Copie o arquivo `.github/workflows/pacman.yml` para o seu repositório (na mesma estrutura de pastas).
2. O workflow vai rodar automaticamente todos os dias e gerar o arquivo `pacman.svg` na branch `output`.
3. Use o link da branch `output` no seu README:
   ```markdown
   ![Pacman](https://raw.githubusercontent.com/seu-usuario/seu-repo/output/pacman.svg)
   ```

---
Guia Original: Como usar o "Smart Pacman" no GitHub
Você pediu para exportar o Pacman para o seu GitHub. É importante saber que oREADME.md
 do perfil do GitHub NÃO aceita JavaScript ou Canvas, apenas imagens (GIFs, SVGs) estáticas ou pré-animadas.

Isso significa que você tem duas opções:

Opção 1: Usar no GitHub Pages (Recomendado para "Esse" Pacman)
Para usar este código exato com a inteligência artificial que criamos (comendo por cores, movimento Manhattan, etc.), você deve hospedá-lo em uma página web (GitHub Pages).

Passo a Passo:
Crie um arquivo chamado pacman.html no seu repositório.
Cole o código abaixo (que é a versão completa e autônoma do nosso Pacman).
Ative o "GitHub Pages" nas configurações do repositório.
No seu 
README.md
 do perfil, coloque um link:
[🎮 Jogue meu Pacman de Contribuições](https://seu-usuario.github.io/seu-repo/pacman.html)

Código do pacman.html (Standalone)
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Philip Lima - GitHub Pacman</title>
    <style>
        body { background: #0d1117; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .snake-container { padding: 20px; border: 1px solid #30363d; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
    </style>
</head>
<body>
    <div class="snake-container">
        <canvas id="pacman-canvas" width="800" height="150"></canvas>
    </div>
    <script>
        // --- Pacman GitHub Animation (Real Data + Smart Rotation) ---
        const canvas = document.getElementById('pacman-canvas');
        const ctx = canvas.getContext('2d');
        const boxSize = 12; 
        const gap = 4;
        const cols = 53; 
        const rows = 7;
        const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
        
        // Dados REAIS (Extraídos do seu perfil)
        const realGrid = [
            [0,0,0,0,0,0,4], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,1], [4,1,2,0,0,0,0], [4,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], [4,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], [0,2,0,0,0,0,0], [4,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0]
        ];
        let grid = [];
        let targets = [];
        
        for (let i = 0; i < cols; i++) {
            let col = [];
            for (let j = 0; j < rows; j++) {
                let level = realGrid[i] ? realGrid[i][j] : 0;
                let isActive = level > 0;
                col.push({
                    x: i * (boxSize + gap),
                    y: j * (boxSize + gap),
                    color: colors[level],
                    active: isActive,
                    initialActive: isActive,
                    level: level
                });
                if (isActive) targets.push({ x: i, y: j, level: level });
            }
            grid.push(col);
        }
        let sortedPath = [];
        let currentPos = {x: 0, y: 3};
        let levelsTargets = [[], [], [], [], []];
        targets.forEach(t => levelsTargets[t.level].push(t));
        
        for (let l = 1; l <= 4; l++) {
            let group = levelsTargets[l];
            while (group.length > 0) {
                let closestIdx = -1;
                let minDist = Infinity;
                for (let i = 0; i < group.length; i++) {
                    let d = Math.abs(group[i].x - currentPos.x) + Math.abs(group[i].y - currentPos.y);
                    if (d < minDist) { minDist = d; closestIdx = i; }
                }
                let nextTarget = group[closestIdx];
                sortedPath.push(nextTarget);
                currentPos = nextTarget;
                group.splice(closestIdx, 1);
            }
        }
        let path = [...sortedPath];
        let pacman = {
            pixelX: -20, pixelY: grid[0][3].y + 6,
            radius: 6, mouthOpen: 0.2, mouthSpeed: 0.1, dir: 1, angle: 0,
            speed: 1.5, targetIndex: 0
        };
        function update() {
            if (pacman.targetIndex < path.length) {
                let target = path[pacman.targetIndex];
                let targetPixelX = grid[target.x][target.y].x + 6;
                let targetPixelY = grid[target.x][target.y].y + 6;
                let dx = targetPixelX - pacman.pixelX;
                let dy = targetPixelY - pacman.pixelY;
                
                if (Math.abs(dx) > pacman.speed) {
                    pacman.pixelX += Math.sign(dx) * pacman.speed;
                    pacman.angle = Math.sign(dx) > 0 ? 0 : Math.PI;
                } else if (Math.abs(dy) > pacman.speed) {
                    if (Math.abs(dx) > 0) pacman.pixelX = targetPixelX;
                    pacman.pixelY += Math.sign(dy) * pacman.speed;
                    pacman.angle = Math.sign(dy) > 0 ? Math.PI/2 : -Math.PI/2;
                } else {
                    pacman.pixelX = targetPixelX;
                    pacman.pixelY = targetPixelY;
                    if (grid[target.x][target.y].active) grid[target.x][target.y].active = false;
                    pacman.targetIndex++;
                }
            } else {
                pacman.pixelX += pacman.speed;
                if (pacman.pixelX > canvas.width + 20) {
                    pacman.pixelX = -20; pacman.targetIndex = 0;
                    path.forEach(p => grid[p.x][p.y].active = true);
                }
            }
            
            // Draw
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i=0; i<cols; i++) for (let j=0; j<rows; j++) {
                let b = grid[i][j];
                ctx.fillStyle = b.active ? b.color : (b.initialActive ? '#1b2028' : colors[0]);
                ctx.fillRect(b.x, b.y, boxSize, boxSize);
            }
            
            ctx.save();
            ctx.translate(pacman.pixelX, pacman.pixelY);
            ctx.rotate(pacman.angle);
            ctx.fillStyle = '#FFD700';
            pacman.mouthOpen += pacman.mouthSpeed * pacman.dir;
            if (pacman.mouthOpen > 0.25 || pacman.mouthOpen < 0.05) pacman.dir *= -1;
            ctx.beginPath();
            ctx.arc(0, 0, pacman.radius, pacman.mouthOpen * Math.PI, (2 - pacman.mouthOpen) * Math.PI);
            ctx.lineTo(0, 0);
            ctx.fill();
            ctx.restore();
            
            requestAnimationFrame(update);
        }
        update();
    </script>
</body>
</html>
Opção 2: Imagem SVG no Perfil (Padrão do GitHub)
Se você quer que a animação apareça direto na página inicial do seu perfil (aquele arquivo 
README.md
 principal do seu usuário), você não pode usar o código acima. Você deve usar um "GitHub Action" que gera um SVG.

Recomendo o Platane/snk.

Como configurar o snk:
No seu repositório de perfil (philipxlima/philipxlima), crie a pasta .github/workflows.
Crie um arquivo snake.yml lá dentro.
Cole o seguinte conteúdo:
name: Generate Snake
on:
  schedule:
    - cron: "0 */6 * * *" # roda a cada 6 horas
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: Platane/snk@v2
        with:
          github_user_name: philipxlima
          outputs: |
            dist/github-contribution-grid-snake.svg
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark
      - uses: crazy-max/ghaction-github-pages@v2.1.3
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
Isso vai gerar a "Cobrinha" tradicional padrão do GitHub. O nosso Pacman Inteligente personal só funciona na Opção 1 (via site/HTML).