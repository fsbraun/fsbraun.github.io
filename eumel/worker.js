/* One worker owns the HG exclusively; all C calls and OPFS operations serialize. */
importScripts('eumel.js');
let module, medium, running = false, timer, lastTick;
let input = [], output = [], pendingAction = null;
const send = (type, extra = {}) => postMessage({type, ...extra});
function flushOutput() {
    if (output.length) { send('output', {chunks: output}); output = []; }
}
function report(error) {
    running = false; clearTimeout(timer); flushOutput();
    send('error', {message: String(error.message || error)});
}
function check(code) {
    if (code) throw Error(module.UTF8ToString(module._web_error()));
}
function validate(bytes, clean = false) {
    const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (bytes.length < 139 * 512 || bytes.length > 32768 * 512 || bytes.length % 512 ||
        new TextDecoder().decode(bytes.subarray(0, 6)) !== 'EUMEL-' ||
        v.getUint32(80, true) * 512 !== bytes.length || (clean && bytes[13] !== 0))
        throw Error('Expected a complete, linear EUMEL HG' + (clean ? ' with a clean shutdown marker.' : '.'));
}
async function openMedium() {
    if (!navigator.storage?.getDirectory) throw Error('This browser needs HTTPS (or localhost) and OPFS support.');
    const root = await navigator.storage.getDirectory();
    const file = await root.getFileHandle('EUMEL.HG', {create: true});
    // Default exclusive lock rejects a second tab instead of corrupting the image.
    medium = await file.createSyncAccessHandle();
    try {
        if (!medium.getSize()) {
            send('status', {message: 'Downloading clean EUMEL 1.8.7 HG…'});
            const response = await fetch('clean.HG');
            if (!response.ok) throw Error('Cannot download clean.HG: HTTP ' + response.status);
            const bytes = new Uint8Array(await response.arrayBuffer());
            validate(bytes, true);
            const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes.subarray(5120, 139 * 512)));
            if (Array.from(hash, b => b.toString(16).padStart(2, '0')).join('') !==
                '88cf58e777fe71a1546c63c4339d1b8c3688d85bb0f9ef792af4fbd2dc0ffc90')
                throw Error('clean.HG must contain ERGOS 1.8.7 #1523.');
            // Publish the identifying header only after all initial bytes are durable.
            medium.truncate(bytes.length);
            if (medium.write(bytes.subarray(512), {at: 512}) !== bytes.length - 512) throw Error('Short initial HG write');
            medium.flush();
            if (medium.write(bytes.subarray(0, 512), {at: 0}) !== 512) throw Error('Short HG header write');
            medium.flush();
        }
        const bytes = new Uint8Array(medium.getSize());
        if (medium.read(bytes, {at: 0}) !== bytes.length) throw Error('Short HG read');
        validate(bytes);
    } catch (e) { medium.close(); medium = null; throw e; }
}
async function boot() {
    if (running) return;
    if (!medium) await openMedium();
    if (!module) module = await createEumel({medium,
        output: bytes => output.push(bytes),
        diagnostic: message => send('diagnostic', {message}),
        printErr: message => send('diagnostic', {message})});
    module.medium = medium;
    check(module._web_boot());
    input = []; running = true; lastTick = performance.now();
    send('running'); pump();
}
function save(action) {
    const stop = action !== 'save';
    check(module._web_save(stop ? 1 : 0));
    flushOutput();
    if (stop) { running = false; clearTimeout(timer); }
    send('saved', {stopped: stop, time: new Date().toLocaleTimeString()});
    if (action === 'download') {
        const bytes = new Uint8Array(medium.getSize());
        if (medium.read(bytes, {at: 0}) !== bytes.length) throw Error('Short HG export read');
        postMessage({type: 'download', bytes}, [bytes.buffer]);
    }
}
function pump() {
    if (!running) return;
    try {
        const now = performance.now();
        if (now - lastTick >= 55) { module._web_tick(); lastTick = now; }
        // The command/editor transitions can flush typeahead. Drain execution
        // to its input wait between pasted characters, as the native harness does.
        if (input.length && module._web_pending() < 32 && (module._web_quiet() || input[0] === 7))
            module._web_input(input.shift());
        const error = module._web_run();
        flushOutput();
        if (error) {
            const message = module.UTF8ToString(module._web_error());
            running = false;
            send('stopped', {message});
            return;
        }
        if (!input.length && !module._web_pending() && pendingAction) {
            const action = pendingAction; pendingAction = null; save(action);
        }
        if (running) timer = setTimeout(pump, 8);
    } catch (e) { report(e); }
}
let commands = Promise.resolve();
onmessage = ({data}) => {
    commands = commands.then(async () => {
        if (data.type === 'boot') await boot();
        else if (data.type === 'input' && running) {
            if (input.length + data.bytes.length > 10000) throw Error('Input queue is full; paste smaller pieces.');
            if (data.bytes.length === 1 && data.bytes[0] === 7) input.unshift(7);
            else input.push(...data.bytes);
        } else if (['save', 'stop', 'download'].includes(data.type)) {
            if (running) pendingAction = data.type;
            else if (data.type === 'download' && medium) {
                const bytes = new Uint8Array(medium.getSize());
                medium.read(bytes, {at: 0});
                if (bytes[13] !== 0) throw Error('The halted image is not clean. Resume and save before downloading.');
                postMessage({type: 'download', bytes}, [bytes.buffer]);
            }
        } else if (data.type === 'reset') {
            running = false; clearTimeout(timer);
            if (medium) { medium.close(); medium = null; }
            const root = await navigator.storage.getDirectory();
            await root.removeEntry('EUMEL.HG');
            send('reset');
        }
    }).catch(report);
};
