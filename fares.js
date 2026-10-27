// Shared flight-fare loader, used by the website (script.js) and the channel post page (post.js).
// Reads the published Google Sheet; fares.json is the backup if the sheet can't be reached.
// Fares dated before today are dropped, and the rest are grouped into routes.
window.TasmimFares = (function() {
    const FARES_SHEET = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTZJwLc7b8YOQrQaFWnuu7AEydzcy6KcB2YARf_KICbV4N_-ctD2I_x4BUs76inWsgZAfzG1nvnZcH/pub?gid=0&single=true&output=csv';
    const FARES_BACKUP = 'fares.json';

    const formatDate = (iso, opts) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', opts);

    const parseCsv = (text) => {
        const rows = text.trim().split(/\r?\n/).map((line) =>
            (line.match(/("([^"]|"")*"|[^,]*)(,|$)/g) || [])
                .map((cell) => cell.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"').trim())
        );
        const header = rows.shift().map((h) => h.toLowerCase());
        return { fares: rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] || '']))) };
    };

    // accept prices typed as "13,000" or "₹13000", and dates typed day-first like 4/11/2026
    const cleanFare = (f) => {
        const price = Number(String(f.price).replace(/[^\d.]/g, ''));
        let date = String(f.date || '').trim();
        const dmy = date.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
        if (dmy) date = `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
        return {
            ...f,
            from: String(f.from || '').trim(),
            to: String(f.to || '').trim(),
            airline: String(f.airline || '').trim(),
            baggage: String(f.baggage || '').trim(),
            date,
            price,
        };
    };

    const toRoutes = ({ updated, fares }) => {
        const now = new Date();
        // local date (not UTC), so fares roll over at the visitor's midnight
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const upcoming = fares
            .map(cleanFare)
            .filter((f) => f.from && f.to && /^\d{4}-\d{2}-\d{2}$/.test(f.date) && f.date >= today && f.price > 0)
            .sort((a, b) => a.date.localeCompare(b.date));

        // one route per from + to + airline + baggage, in the order its first fare appears
        const routes = new Map();
        upcoming.forEach((f) => {
            const key = [f.from, f.to, f.airline, f.baggage].join('|');
            if (!routes.has(key)) routes.set(key, { from: f.from, to: f.to, airline: f.airline, baggage: f.baggage, rows: [] });
            routes.get(key).rows.push(f);
        });
        return { updated, routes: [...routes.values()] };
    };

    const fetchText = (url) => fetch(url, { cache: 'no-cache' }).then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.text();
    });

    const load = () => fetchText(FARES_SHEET)
        .then(parseCsv)
        .catch(() => fetchText(FARES_BACKUP).then(JSON.parse))
        .then(toRoutes);

    return { load, formatDate };
})();
