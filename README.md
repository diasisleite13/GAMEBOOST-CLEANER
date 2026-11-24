# GameBoost Cleaner 2.0

- `index.html`: página oficial para GitHub Pages.
- `src/`: aplicativo Electron.

## Testar no Windows
Instale Node.js LTS, abra o terminal nesta pasta e execute `npm install` e depois `npm start`.

## Gerar instalador
Execute `npm run dist`. O EXE será criado em `dist`.

## Publicar no GitHub Pages
Envie o `index.html` da raiz para a raiz do repositório GAMEBOOST-CLEANER e habilite Pages em Settings > Pages, branch publicada, pasta `/ (root)`. O botão de download abre a página Releases. Depois de gerar o EXE, crie uma Release no GitHub e anexe `GameBoost-Cleaner-Setup-2.0.0.exe`.

## Segurança
A limpeza remove somente arquivos regulares dentro de %TEMP%, RECENT e C:\Windows\Temp; não remove pastas nem segue links simbólicos. Arquivos bloqueados/sem permissão são ignorados. RECENT contém atalhos, não os arquivos originais. Processos conhecidos como críticos são excluídos da lista, mas confirme sempre que reconhece o programa antes de encerrar. Não limpa Prefetch, shaders, saves, caches de navegador ou pastas de jogos.
