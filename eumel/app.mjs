import {Terminal, keyBytes, encodeText} from './terminal.mjs';
const $ = id => document.getElementById(id);
const terminal = new Terminal();
terminal.render($('terminal'));
let running = false, painting = false, busy = false, hasMedium = false;
const worker = new Worker('worker.js');
const send = (type, extra = {}) => worker.postMessage({type, ...extra});
function controls() {
    $('start').disabled = running || busy;
    for (const id of ['sv', 'save', 'stop']) $(id).disabled = !running || busy;
    $('download').disabled = busy || !hasMedium;
    $('reset').disabled = busy;
}
function log(message) {
    $('errors').textContent = ($('errors').textContent + message + '\n').slice(-16000);
    console.error(message);
}
function paint() {
    if (!painting) { painting = true; requestAnimationFrame(() => { terminal.render($('terminal')); painting = false; }); }
}
terminal.bell = () => { $('terminal').animate([{opacity: .65}, {opacity: 1}], {duration: 120}); };
worker.onmessage = ({data}) => {
    if (data.type === 'output') { for (const bytes of data.chunks) terminal.write(bytes); paint(); }
    else if (data.type === 'diagnostic') log(data.message);
    else if (data.type === 'status') $('status').textContent = data.message;
    else if (data.type === 'running') {
        busy = false; running = hasMedium = true; controls(); $('status').textContent = 'Running locally'; $('terminal').focus();
    } else if (data.type === 'saved') {
        busy = false; running = !data.stopped; controls();
        $('saved').textContent = 'Fixpoint saved ' + data.time;
        $('status').textContent = data.stopped ? 'Saved and stopped. Safe to close.' : 'Running locally';
    } else if (data.type === 'download') {
        busy = false; controls();
        const url = URL.createObjectURL(new Blob([data.bytes], {type: 'application/octet-stream'}));
        const a = document.createElement('a'); a.href = url; a.download = 'EUMEL.HG'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
    } else if (data.type === 'stopped' || data.type === 'error') {
        busy = running = false; controls(); $('status').textContent = data.message;
        if (data.type === 'error') { log(data.message); $('errors').parentElement.open = true; }
    } else if (data.type === 'reset') location.reload();
};
worker.onerror = event => { busy = running = false; controls(); log(event.message); $('status').textContent = 'Worker failed; see error console.'; };
$('start').onclick = async () => {
    busy = true; controls(); $('status').textContent = 'Opening Hintergrund…'; terminal.reset(); paint();
    try {
        const persistent = await navigator.storage?.persist?.();
        $('storage').textContent = (persistent ? 'Persistent storage granted.' : 'Storage is best effort; keep HG backups.') + ' EUMEL schedules its own fixpoints every 15 minutes.';
        send('boot');
    } catch (e) { busy = false; controls(); log(String(e)); }
};
for (const id of ['save', 'stop', 'download']) $(id).onclick = () => {
    busy = true; controls(); $('status').textContent = 'Saving fixpoint…'; send(id);
};
$('sv').onclick = () => { send('input', {bytes: [7]}); $('terminal').focus(); };
$('reset').onclick = () => {
    if (confirm('Discard the stored Hintergrund and all edits? Download a backup first if you need them.')) {
        busy = true; controls(); send('reset');
    }
};
$('terminal').onkeydown = event => {
    if (!running || busy || event.isComposing) return;
    try { const bytes = keyBytes(event); if (bytes) { event.preventDefault(); send('input', {bytes}); } }
    catch (e) { log(String(e)); }
};
$('terminal').onpaste = event => {
    if (!running || busy) return;
    event.preventDefault();
    try { send('input', {bytes: encodeText(event.clipboardData.getData('text/plain'))}); }
    catch (e) { log(String(e)); }
};
window.addEventListener('beforeunload', event => {
    if (running || busy) { event.preventDefault(); event.returnValue = ''; }
});
