export const CP437 = Array.from({length: 128}, (_, i) => i === 127 ? "⌂" : String.fromCharCode(i)).concat([String.fromCodePoint(0x00C7),String.fromCodePoint(0x00FC),String.fromCodePoint(0x00E9),String.fromCodePoint(0x00E2),String.fromCodePoint(0x00E4),String.fromCodePoint(0x00E0),String.fromCodePoint(0x00E5),String.fromCodePoint(0x00E7),String.fromCodePoint(0x00EA),String.fromCodePoint(0x00EB),String.fromCodePoint(0x00E8),String.fromCodePoint(0x00EF),String.fromCodePoint(0x00EE),String.fromCodePoint(0x00EC),String.fromCodePoint(0x00C4),String.fromCodePoint(0x00C5),String.fromCodePoint(0x00C9),String.fromCodePoint(0x00E6),String.fromCodePoint(0x00C6),String.fromCodePoint(0x00F4),String.fromCodePoint(0x00F6),String.fromCodePoint(0x00F2),String.fromCodePoint(0x00FB),String.fromCodePoint(0x00F9),String.fromCodePoint(0x00FF),String.fromCodePoint(0x00D6),String.fromCodePoint(0x00DC),String.fromCodePoint(0x00A2),String.fromCodePoint(0x00A3),String.fromCodePoint(0x00A5),String.fromCodePoint(0x20A7),String.fromCodePoint(0x0192),String.fromCodePoint(0x00E1),String.fromCodePoint(0x00ED),String.fromCodePoint(0x00F3),String.fromCodePoint(0x00FA),String.fromCodePoint(0x00F1),String.fromCodePoint(0x00D1),String.fromCodePoint(0x00AA),String.fromCodePoint(0x00BA),String.fromCodePoint(0x00BF),String.fromCodePoint(0x2310),String.fromCodePoint(0x00AC),String.fromCodePoint(0x00BD),String.fromCodePoint(0x00BC),String.fromCodePoint(0x00A1),String.fromCodePoint(0x00AB),String.fromCodePoint(0x00BB),String.fromCodePoint(0x2591),String.fromCodePoint(0x2592),String.fromCodePoint(0x2593),String.fromCodePoint(0x2502),String.fromCodePoint(0x2524),String.fromCodePoint(0x2561),String.fromCodePoint(0x2562),String.fromCodePoint(0x2556),String.fromCodePoint(0x2555),String.fromCodePoint(0x2563),String.fromCodePoint(0x2551),String.fromCodePoint(0x2557),String.fromCodePoint(0x255D),String.fromCodePoint(0x255C),String.fromCodePoint(0x255B),String.fromCodePoint(0x2510),String.fromCodePoint(0x2514),String.fromCodePoint(0x2534),String.fromCodePoint(0x252C),String.fromCodePoint(0x251C),String.fromCodePoint(0x2500),String.fromCodePoint(0x253C),String.fromCodePoint(0x255E),String.fromCodePoint(0x255F),String.fromCodePoint(0x255A),String.fromCodePoint(0x2554),String.fromCodePoint(0x2569),String.fromCodePoint(0x2566),String.fromCodePoint(0x2560),String.fromCodePoint(0x2550),String.fromCodePoint(0x256C),String.fromCodePoint(0x2567),String.fromCodePoint(0x2568),String.fromCodePoint(0x2564),String.fromCodePoint(0x2565),String.fromCodePoint(0x2559),String.fromCodePoint(0x2558),String.fromCodePoint(0x2552),String.fromCodePoint(0x2553),String.fromCodePoint(0x256B),String.fromCodePoint(0x256A),String.fromCodePoint(0x2518),String.fromCodePoint(0x250C),String.fromCodePoint(0x2588),String.fromCodePoint(0x2584),String.fromCodePoint(0x258C),String.fromCodePoint(0x2590),String.fromCodePoint(0x2580),String.fromCodePoint(0x03B1),String.fromCodePoint(0x00DF),String.fromCodePoint(0x0393),String.fromCodePoint(0x03C0),String.fromCodePoint(0x03A3),String.fromCodePoint(0x03C3),String.fromCodePoint(0x00B5),String.fromCodePoint(0x03C4),String.fromCodePoint(0x03A6),String.fromCodePoint(0x0398),String.fromCodePoint(0x03A9),String.fromCodePoint(0x03B4),String.fromCodePoint(0x221E),String.fromCodePoint(0x03C6),String.fromCodePoint(0x03B5),String.fromCodePoint(0x2229),String.fromCodePoint(0x2261),String.fromCodePoint(0x00B1),String.fromCodePoint(0x2265),String.fromCodePoint(0x2264),String.fromCodePoint(0x2320),String.fromCodePoint(0x2321),String.fromCodePoint(0x00F7),String.fromCodePoint(0x2248),String.fromCodePoint(0x00B0),String.fromCodePoint(0x2219),String.fromCodePoint(0x00B7),String.fromCodePoint(0x221A),String.fromCodePoint(0x207F),String.fromCodePoint(0x00B2),String.fromCodePoint(0x25A0),String.fromCodePoint(0x00A0)]);
export class Terminal {
    constructor() { this.reset(); }
    reset() {
        this.cells = Array.from({length: 1920}, () => ({text: ' ', reverse: false}));
        this.row = this.col = this.phase = 0; this.reverse = false;
    }
    clear(from, to) {
        for (let i = from; i < to; i++) this.cells[i] = {text: ' ', reverse: this.reverse};
    }
    down() {
        if (++this.row === 24) {
            this.cells.copyWithin(0, 80); this.clear(1840, 1920); this.row = 23;
        }
    }
    put(text) {
        this.cells[this.row * 80 + this.col++] = {text, reverse: this.reverse};
        if (this.col === 80) { this.col = 0; this.down(); }
    }
    write(bytes) {
        for (const b of bytes) {
            if (this.phase === 1) { this.row = Math.min(b, 23); this.phase = 2; continue; }
            if (this.phase === 2) { this.col = Math.min(b, 79); this.phase = 0; continue; }
            switch (b) {
            case 0: break;
            case 1: this.row = this.col = 0; break;
            case 2: this.col = Math.min(this.col + 1, 79); break;
            case 3: this.row = Math.max(0, this.row - 1); break;
            case 4: this.clear(this.row * 80 + Math.min(this.col, 79), 1920); break;
            case 5: this.clear(this.row * 80 + Math.min(this.col, 79), (this.row + 1) * 80); break;
            case 6: this.phase = 1; break;
            case 7: this.bell?.(); break;
            case 8: this.col = Math.max(0, this.col - 1); break;
            case 10: this.down(); break;
            case 13: this.col = 0; break;
            case 14: this.reverse = false; this.put(' '); break;
            case 15: this.reverse = true; this.put(' '); break;
            default: if (b >= 32) this.put(CP437[b]);
            }
        }
    }
    text() {
        return Array.from({length: 24}, (_, row) => this.cells.slice(row * 80, row * 80 + 80).map(c => c.text).join('')).join('\n');
    }
    render(element) {
        const fragment = document.createDocumentFragment();
        for (let row = 0; row < 24; row++) {
            let span, style;
            for (let col = 0; col < 80; col++) {
                const cell = this.cells[row * 80 + col];
                const next = (cell.reverse ? 'reverse ' : '') + (row === this.row && col === Math.min(this.col, 79) ? 'cursor' : '');
                if (!span || next !== style) {
                    span = document.createElement('span'); span.className = next; fragment.append(span); style = next;
                }
                span.append(cell.text);
            }
            if (row < 23) fragment.append('\n');
        }
        element.replaceChildren(fragment);
    }
}

export function encodeText(text) {
    return Array.from(text.replace(/\r\n/g, '\n'), c => {
        if (c === '\n' || c === '\r') return 13;
        const b = CP437.indexOf(c);
        if (b < 32) throw Error('Character cannot be entered in CP437: ' + JSON.stringify(c));
        return b;
    });
}
export function keyBytes(event) {
    if (event.metaKey || event.altKey) return null;
    if (event.ctrlKey) {
        // Preserve browser copy/paste; other control letters map as on local SHard.
        if (['c', 'v', 'x'].includes(event.key.toLowerCase())) return null;
        return /^[a-z]$/i.test(event.key) ? [event.key.toUpperCase().charCodeAt(0) - 64] : null;
    }
    const keys = {ArrowUp: 3, ArrowDown: 10, ArrowRight: 2, ArrowLeft: 8,
        Home: 1, Insert: 11, Delete: 12, Backspace: 12, PageUp: 16,
        F1: 4, F2: 7, F3: 17, F4: 23, F5: 16, F6: 18, Escape: 27, Enter: 13, Tab: 9};
    if (event.key in keys) return [keys[event.key]];
    return event.key.length === 1 ? encodeText(event.key) : null;
}
