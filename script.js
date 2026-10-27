document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function() {
    const WHATSAPP_NUMBER = '918281404323';
    const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    // WhatsApp links: every [data-wa] element opens a chat with its prefilled message
    document.querySelectorAll('[data-wa]').forEach((el) => {
        el.href = waLink(el.dataset.wa);
        el.target = '_blank';
        el.rel = 'noopener';
    });

    // Header: solid background once the page scrolls past the top
    const header = document.querySelector('.site-header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    const setMenu = (open) => {
        header.classList.toggle('menu-open', open);
        hamburger.setAttribute('aria-expanded', open);
        hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        hamburger.innerHTML = `<i class="fas fa-${open ? 'xmark' : 'bars'}" aria-hidden="true"></i>`;
    };

    hamburger.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
    navLinks.addEventListener('click', (e) => {
        if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });

    // Highlight the nav link for the section in view
    const navAnchors = [...navLinks.querySelectorAll('a[href^="#"]')];
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

    // Scroll reveal
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    // View More functionality
    const viewMoreBtn = document.querySelector('.view-more-btn');
    const destinationsGrid = document.querySelector('.destinations-grid');

    viewMoreBtn.addEventListener('click', () => {
        const showAll = destinationsGrid.classList.toggle('show-all');
        viewMoreBtn.setAttribute('aria-expanded', showAll);
        viewMoreBtn.textContent = showAll ? 'Show less' : 'View more destinations';
        if (!showAll) destinationsGrid.scrollIntoView({ block: 'start' });
    });

    // Offer poster lightbox
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');

    document.querySelectorAll('[data-lightbox]').forEach((btn) => {
        btn.addEventListener('click', () => {
            lightboxImg.src = btn.dataset.lightbox;
            lightboxImg.alt = btn.querySelector('img').alt;
            lightbox.showModal();
        });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.close();
    });

    // Hero planner: turns the two choices into a WhatsApp message
    const planner = document.querySelector('.planner');
    planner.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(planner);
        const choice = data.get('service');
        const need = choice.charAt(0).toLowerCase() + choice.slice(1);
        const destination = data.get('destination').trim();
        window.open(waLink(`Hello Tasmim Travels, I need ${need}${destination ? ` for ${destination}` : ''}.`), '_blank', 'noopener');
    });

    // Flight fares: loaded by fares.js (Google Sheet, with fares.json as backup), one card per route
    const faresGrid = document.querySelector('.fares-grid');
    const faresEmpty = document.querySelector('.fares-empty');
    const faresUpdated = document.querySelector('.fares-updated');
    const rupees = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    const { formatDate } = window.TasmimFares;

    const renderFares = ({ updated, routes }) => {
        faresGrid.replaceChildren();
        routes.forEach((route) => {
            const card = document.createElement('article');
            card.className = 'fare-card';

            const title = document.createElement('h3');
            title.className = 'fare-route';
            title.append(route.from, Object.assign(document.createElement('i'), { className: 'fas fa-plane', ariaHidden: 'true' }), route.to);
            card.append(title);

            const meta = document.createElement('div');
            meta.className = 'fare-meta';
            [route.airline, route.baggage && `Baggage ${route.baggage}`].filter(Boolean).forEach((text) => {
                meta.append(Object.assign(document.createElement('span'), { textContent: text }));
            });
            card.append(meta);

            const list = document.createElement('ul');
            list.className = 'fare-rows';
            route.rows.forEach((f) => {
                const li = document.createElement('li');
                li.append(
                    Object.assign(document.createElement('span'), { className: 'fare-date', textContent: formatDate(f.date, { weekday: 'short', day: 'numeric', month: 'short' }) }),
                    Object.assign(document.createElement('span'), { className: 'fare-price', textContent: rupees.format(Number(f.price)) })
                );
                list.append(li);
            });
            card.append(list);

            // only name a date when the route has just one, otherwise let the customer say which
            const when = route.rows.length === 1 ? ` on ${formatDate(route.rows[0].date, { day: 'numeric', month: 'short' })}` : '';
            const book = document.createElement('a');
            book.className = 'offer-cta';
            book.href = waLink(`Hello Tasmim Travels, I'd like to book ${route.from} to ${route.to}${route.airline ? ` (${route.airline})` : ''}${when}.`);
            book.target = '_blank';
            book.rel = 'noopener';
            book.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i> Book on WhatsApp';
            card.append(book);

            faresGrid.append(card);
        });

        faresEmpty.hidden = routes.length > 0;
        if (updated) {
            faresUpdated.textContent = `Last updated ${formatDate(updated, { day: 'numeric', month: 'long', year: 'numeric' })}`;
            faresUpdated.hidden = false;
        }
    };

    window.TasmimFares.load()
        .then(renderFares)
        .catch(() => {
            faresEmpty.hidden = false;
        });

    // Contact form: no backend, so the enquiry is sent as a WhatsApp message
    const form = document.querySelector('.contact-form');
    const note = form.querySelector('.form-note');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const required = [...form.querySelectorAll('[required]')];
        required.forEach((f) => f.classList.toggle('invalid', !f.value.trim()));
        const firstEmpty = required.find((f) => !f.value.trim());
        if (firstEmpty) {
            note.textContent = 'Please add your name and a short message.';
            firstEmpty.focus();
            return;
        }

        const data = new FormData(form);
        const destination = data.get('destination').trim();
        const lines = [
            `Hello Tasmim Travels, I'm ${data.get('name').trim()}.`,
            `I need: ${data.get('service')}`,
        ];
        if (destination) lines.push(`Destination: ${destination}`);
        lines.push('', data.get('message').trim());

        window.open(waLink(lines.join('\n')), '_blank', 'noopener');
        note.textContent = 'Opening WhatsApp with your message…';
        form.reset();
    });

    document.getElementById('year').textContent = new Date().getFullYear();
});
