const $ = (id) => document.getElementById(id);
let scanReady = false;
let lastScan = null;

function formatBytes(bytes) {
  if (!bytes) return '0 MB';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index >= 2 ? 2 : 1)} ${units[index]}`;
}
function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.style.display = 'block';
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.style.display = 'none', 4500);
}
async function loadSystem() {
  try {
    const info = await window.gameboost.getSystemInfo();
    $('ramTotal').textContent = formatBytes(info.totalMemory);
    $('ramFree').textContent = `Memória disponível: ${formatBytes(info.freeMemory)}`;
  } catch { toast('Não foi possível consultar as informações do sistema.'); }
}
async function scan() {
  $('scanBtn').disabled = true;
  $('scanStatus').textContent = 'Analisando pasta TEMP...';
  $('progressBar').style.width = '35%';
  try {
    lastScan = await window.gameboost.scanTemp();
    scanReady = true;
    $('fileCount').textContent = lastScan.fileCount.toLocaleString('pt-BR');
    $('recoverable').textContent = formatBytes(lastScan.totalBytes);
    $('scanSize').textContent = formatBytes(lastScan.totalBytes);
    $('scanStatus').textContent = 'Análise concluída';
    $('progressBar').style.width = '100%';
    $('cleanBtn').disabled = lastScan.fileCount === 0;
    toast(lastScan.fileCount ? 'Análise concluída. Confira os resultados antes de limpar.' : 'Nenhum arquivo temporário encontrado.');
  } catch { toast('Falha ao analisar os arquivos temporários.'); }
  finally { $('scanBtn').disabled = false; }
}
$('scanBtn').addEventListener('click', scan);
$('nav-clean').addEventListener('click', () => $('cleanupPanel').scrollIntoView({ behavior: 'smooth' }));
$('nav-gamer').addEventListener('click', () => $('gamerPanel').scrollIntoView({ behavior: 'smooth' }));
$('cleanBtn').addEventListener('click', async () => {
  if (!scanReady || !lastScan) return;
  $('cleanBtn').disabled = true;
  try {
    const result = await window.gameboost.cleanTemp();
    if (result.cancelled) toast('Limpeza cancelada. Nenhum arquivo foi removido.');
    else toast(`Limpeza concluída: ${result.deletedCount} arquivos removidos • ${formatBytes(result.freedBytes)} liberados.`);
    await scan();
  } catch { toast('Não foi possível concluir a limpeza.'); }
  finally { $('cleanBtn').disabled = !lastScan || lastScan.fileCount === 0; }
});
$('gamerBtn').addEventListener('click', () => {
  toast('Dica: feche programas que não está usando, conecte o PC à energia e mantenha os drivers atualizados.');
});
loadSystem();
