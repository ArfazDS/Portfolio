/* ═══════════════════════════════════════════════
   PORTFOLIO – JavaScript
   Handles: navigation, scroll-reveal, typing
   effect, stat counters, testimonial slider,
   and contact form.
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ─── DOM References ─────────────────────── */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const typedText = document.getElementById('typedText');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    /* ─── 1. Sticky Navigation ──────────────── */
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ─── 2. Mobile Menu Toggle ─────────────── */
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ─── 3. Scroll Reveal (Intersection Observer) */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ─── 4. Typing Effect ──────────────────── */
    const titles = [
        'AI / ML Engineer',
        'Data Scientist',
        'Backend Developer',
        'Problem Solver'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const TYPING_SPEED = 80;
    const DELETING_SPEED = 40;
    const PAUSE_AFTER = 2000;

    function typeWriter() {
        const current = titles[titleIndex];

        if (!isDeleting) {
            typedText.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(typeWriter, PAUSE_AFTER);
                return;
            }
        } else {
            typedText.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
            }
        }

        setTimeout(typeWriter, isDeleting ? DELETING_SPEED : TYPING_SPEED);
    }

    typeWriter();

    /* ─── 5. Stat Counter Animation ─────────── */
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 1500;
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    /* ─── 6. Testimonial Slider ─────────────── */
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsWrap = document.getElementById('testimonialDots');

    if (track) {
        const cards = track.children;
        const total = cards.length;
        let current = 0;
        let autoPlayId = null;

        // Create dots
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('div');
            dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        }

        const dots = dotsWrap.children;

        function goTo(index) {
            current = ((index % total) + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            Array.from(dots).forEach((d, i) =>
                d.classList.toggle('active', i === current)
            );
        }

        prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoPlay(); });
        nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoPlay(); });

        // Auto-play
        function startAutoPlay() {
            autoPlayId = setInterval(() => goTo(current + 1), 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayId);
            startAutoPlay();
        }

        startAutoPlay();
    }

    /* ─── 7. Active Nav Link Highlight ──────── */
    const sections = document.querySelectorAll('section[id]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.querySelectorAll('a').forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === `#${id}`
                    );
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(s => navObserver.observe(s));

    /* ─── 8. Contact Form Handler ───────────── */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showFormStatus('Please fill in all fields.', 'error');
                return;
            }

            // Simulate send (replace with actual endpoint)
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            setTimeout(() => {
                showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;

                setTimeout(() => { formStatus.style.display = 'none'; }, 4000);
            }, 1500);
        });
    }

    function showFormStatus(msg, type) {
        formStatus.textContent = msg;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
    }

    /* ─── 9. Smooth Scroll Polyfill for Safari  */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
