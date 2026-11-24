# GameBoost Cleaner — versão inicial

Aplicativo Windows com Electron, interface HTML/CSS/JavaScript e instalador NSIS.

## Requisitos
- Windows 10 ou 11
- Node.js LTS instalado (https://nodejs.org/)
- Conexão com a internet na primeira instalação das dependências

## Executar para testar
1. Extraia o ZIP.
2. Abra a pasta `GameBoost-Cleaner` no terminal.
3. Execute:
   ```bash
   npm install
   npm start
   ```

## Gerar o instalador EXE
No terminal, dentro da pasta do projeto:
```bash
npm run dist
```
O instalador será criado na pasta `dist`, com nome semelhante a `GameBoost-Cleaner-Setup-1.0.0.exe`.

## Escopo de segurança desta versão
- A limpeza atua somente em arquivos regulares dentro da pasta TEMP do usuário atual (`%TEMP%`).
- Não segue links simbólicos.
- Não apaga pastas inteiras, saves, documentos, cache de shaders, pastas de jogos ou dados de navegadores.
- Arquivos em uso, sem permissão ou que desapareçam durante a operação são ignorados.
- O aplicativo pede confirmação antes de apagar.
- Não requer execução como administrador.

## Limitações
A limpeza de temporários pode liberar espaço, mas não garante aumento de FPS. O "Modo Gamer" desta versão oferece orientações e não encerra processos nem altera configurações do Windows. A estimativa de análise pode mudar se programas criarem/removerem temporários durante a verificação.
