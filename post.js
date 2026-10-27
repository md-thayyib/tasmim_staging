// Channel post page: turns the fares sheet into a WhatsApp channel message in the usual Tasmim format.
document.addEventListener('DOMContentLoaded', function() {
    const BOOKING_NUMBER = '8281404323';
    const WEBSITE = 'tasmimtravels.com';

    // flags for the cities and countries the channel usually posts; unknown places just get no flag
    const FLAGS = {
        '🇮🇳': ['india', 'mangalore', 'mangaluru', 'bangalore', 'bengaluru', 'chennai', 'kannur', 'kochi', 'cochin', 'calicut', 'kozhikode', 'trivandrum', 'thiruvananthapuram', 'mumbai', 'delhi', 'hyderabad', 'kolkata', 'goa', 'ahmedabad', 'lucknow', 'madurai', 'trichy', 'tiruchirappalli', 'coimbatore', 'kasaragod'],
        '🇦🇪': ['uae', 'abu dhabi', 'abudhabi', 'dubai', 'sharjah', 'ras al khaimah', 'al ain', 'fujairah'],
        '🇸🇦': ['saudi', 'saudi arabia', 'ksa', 'riyadh', 'jeddah', 'dammam', 'madinah', 'medina', 'makkah', 'mecca', 'abha', 'taif'],
        '🇶🇦': ['qatar', 'doha'],
        '🇧🇭': ['bahrain'],
        '🇴🇲': ['oman', 'muscat', 'salalah'],
        '🇰🇼': ['kuwait'],
        '🇪🇬': ['egypt', 'cairo'],
        '🇯🇴': ['jordan', 'amman'],
        '🇲🇦': ['morocco', 'casablanca', 'marrakech'],
        '🇺🇿': ['uzbekistan', 'tashkent', 'samarkand'],
        '🇻🇳': ['vietnam', 'hanoi', 'ho chi minh'],
        '🇹🇷': ['turkey', 'istanbul'],
        '🇲🇾': ['malaysia', 'kuala lumpur'],
    };
    const flagFor = (place) => {
        const name = place.toLowerCase().trim();
        return Object.keys(FLAGS).find((flag) => FLAGS[flag].includes(name)) || '';
    };

    const { formatDate } = window.TasmimFares;
    const textarea = document.querySelector('.post-text');
    const status = document.querySelector('.post-status');

    const setStatus = (html, isError = false) => {
        status.innerHTML = html;
        status.classList.toggle('error', isError);
    };

    // e.g. "28 OCT - 13000/-", matching how prices are written in the channel
    const fareLine = (f) => `${formatDate(f.date, { day: '2-digit', month: 'short' }).toUpperCase()} - ${f.price}/-`;

    const buildPost = (routes) => {
        const lines = ['🔥TASMIM TRAVELS🔥', ''];
        routes.forEach((r) => {
            lines.push(`${flagFor(r.from)}${r.from.toUpperCase()} TO ${r.to.toUpperCase()}${flagFor(r.to)}`);
            const airline = r.airline.toUpperCase();
            const baggage = r.baggage.toUpperCase().replace(/\s+/g, '');
            if (airline || baggage) {
                lines.push(`✈️${[airline, baggage].filter(Boolean).join('-')}${baggage ? '👜' : ''}`);
            }
            r.rows.forEach((f) => lines.push(fareLine(f)));
            lines.push('');
        });
        lines.push('FOR BOOKING', `📲${BOOKING_NUMBER}`, `🌐${WEBSITE}`);
        return lines.join('\n');
    };

    const load = () => {
        setStatus('<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Loading fares from the sheet…');
        window.TasmimFares.load()
            .then(({ routes }) => {
                if (!routes.length) {
                    textarea.value = '';
                    setStatus('<i class="fas fa-circle-exclamation" aria-hidden="true"></i> No fares from today onwards in the sheet.', true);
                    return;
                }
                textarea.value = buildPost(routes);
                const count = routes.reduce((n, r) => n + r.rows.length, 0);
                setStatus(`<i class="fas fa-circle-check" aria-hidden="true"></i> ${count} fares on ${routes.length} routes, loaded ${new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}`);
            })
            .catch(() => setStatus('<i class="fas fa-circle-exclamation" aria-hidden="true"></i> Couldn\'t load the fares. Check your connection and try again.', true));
    };

    const flash = (btn, html) => {
        const original = btn.innerHTML;
        btn.innerHTML = html;
        setTimeout(() => { btn.innerHTML = original; }, 1800);
    };

    document.querySelector('.btn-copy').addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const done = () => flash(btn, '<i class="fas fa-check" aria-hidden="true"></i> Copied');
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textarea.value).then(done);
        } else {
            textarea.select();
            document.execCommand('copy');
            done();
        }
    });

    // phones get the system share sheet (pick WhatsApp); elsewhere fall back to WhatsApp's share link
    document.querySelector('.btn-share').addEventListener('click', () => {
        const text = textarea.value;
        if (navigator.share) {
            navigator.share({ text }).catch(() => {});
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
        }
    });

    document.querySelector('.btn-refresh').addEventListener('click', load);

    load();
});
