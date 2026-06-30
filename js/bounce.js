/* ═══════════════════════════════════════════════════
   Plush Monarch Industries — Bounce Animation
   js/bounce.js
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Timing (must match CSS animation durations) ─── */
  const DELAY      = 300;   // ms before roll starts falling
  const DURATION   = 2200;  // ms total animation
  const TOTAL      = DELAY + DURATION;

  // Impact moments (% of DURATION converted to absolute ms from page load)
  const IMPACT_1   = DELAY + DURATION * 0.50;  // 1410ms
  const IMPACT_2   = DELAY + DURATION * 0.70;  // 1840ms
  const IMPACT_3   = DELAY + DURATION * 0.82;  // 2104ms
  const IMPACT_4   = DELAY + DURATION * 0.91;  // 2302ms
  const SETTLED    = DELAY + DURATION * 1.00;  // 2500ms

  /* ─── Elements ─── */
  const rollDropper   = document.getElementById('rollDropper');
  const rollSquasher  = document.getElementById('rollSquasher');
  const rollSvg       = document.getElementById('rollSvgP');
  const heroShadow    = document.getElementById('heroShadow');
  const heroSpotlight = document.getElementById('heroSpotlight');
  const heroGround    = document.getElementById('heroGround');
  const heroBottom    = document.getElementById('heroBottom');
  const impactRing    = document.getElementById('impactRing');

  const line1 = document.getElementById('hlLine1');
  const line2 = document.getElementById('hlLine2');
  const line3 = document.getElementById('hlLine3');

  /* ─── Guard ─── */
  if (!rollDropper) return;


  /* ════════════════════════════════════════
     1. SHADOW ANIMATION — trigger on load
  ════════════════════════════════════════ */
  if (heroShadow) {
    setTimeout(() => heroShadow.classList.add('animate'), 10);
  }


  /* ════════════════════════════════════════
     2. IMPACT EFFECTS
  ════════════════════════════════════════ */

  /* Particle burst at each impact */
  function spawnParticles (count, sizeMax, speedMax, colorA, colorB) {
    const container = document.getElementById('impactParticles');
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const angle    = Math.random() * Math.PI * 2;
      const speed    = 40 + Math.random() * speedMax;
      const tx       = Math.cos(angle) * speed;
      const ty       = Math.sin(angle) * speed - 30;  // bias upward
      const size     = 3 + Math.random() * sizeMax;
      const color    = Math.random() > 0.5 ? colorA : colorB;
      const duration = 500 + Math.random() * 400;

      const p = document.createElement('div');
      p.className = 'imp-particle';
      p.style.cssText = `
        width:${size}px; height:${size}px;
        background:${color};
        left:0; top:0;
        transition: transform ${duration}ms cubic-bezier(0.22,1,0.36,1),
                    opacity   ${duration}ms ease;
      `;
      container.appendChild(p);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          p.style.transform = `translate(${tx}px, ${ty}px)`;
          p.style.opacity = '0';
        });
      });
      setTimeout(() => p.remove(), duration + 50);
    }
  }

  /* Shockwave ring expansion */
  function triggerRing (scale, opacityPeak, duration) {
    if (!impactRing) return;
    impactRing.style.transition = 'none';
    impactRing.style.transform  = 'translate(50%,0) scale(0.3)';
    impactRing.style.opacity    = String(opacityPeak);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        impactRing.style.transition = `transform ${duration}ms cubic-bezier(0.22,1,0.36,1), opacity ${duration}ms ease`;
        impactRing.style.transform  = `translate(50%,0) scale(${scale})`;
        impactRing.style.opacity    = '0';
      });
    });
  }

  /* Screen micro-jolt on first impact */
  function screenJolt () {
    document.body.style.transition = 'none';
    document.body.style.transform  = 'translateY(-4px)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.transition = 'transform 0.3s cubic-bezier(0.22,1,0.36,1)';
        document.body.style.transform  = 'translateY(0)';
      });
    });
    setTimeout(() => { document.body.style.transition = ''; document.body.style.transform = ''; }, 400);
  }

  /* ── Impact 1 (biggest) ── */
  setTimeout(() => {
    screenJolt();
    triggerRing(1.8, 0.7, 700);
    spawnParticles(18, 6, 100, '#C4952A', '#D4AA4A');
    // Flush of gold light on ground
    if (heroSpotlight) {
      heroSpotlight.style.transition = 'opacity 0.1s ease';
      heroSpotlight.style.opacity = '1';
      setTimeout(() => {
        heroSpotlight.style.transition = 'opacity 0.8s ease';
        heroSpotlight.style.opacity = '0.6';
      }, 120);
    }
  }, IMPACT_1);

  /* ── Impact 2 ── */
  setTimeout(() => {
    triggerRing(1.35, 0.45, 550);
    spawnParticles(10, 4, 70, '#C4952A', '#FAF8F3');
  }, IMPACT_2);

  /* ── Impact 3 ── */
  setTimeout(() => {
    triggerRing(1.1, 0.28, 420);
    spawnParticles(5, 3, 50, '#C4952A', '#C4952A');
  }, IMPACT_3);

  /* ── Impact 4 (micro) ── */
  setTimeout(() => {
    spawnParticles(3, 2, 30, '#C4952A', '#C4952A');
  }, IMPACT_4);


  /* ════════════════════════════════════════
     3. SETTLED — reveal all post-landing elements
  ════════════════════════════════════════ */
  setTimeout(() => {

    /* Spotlight locks in */
    if (heroSpotlight) {
      heroSpotlight.style.transition = 'opacity 1.5s ease';
      heroSpotlight.style.opacity = '1';
      heroSpotlight.classList.add('lit');
    }

    /* Ground line appears */
    if (heroGround) heroGround.classList.add('show');

    /* Roll glows */
    if (rollSvg) rollSvg.classList.add('glowing');

    /* Roll transitions to floating idle */
    if (rollDropper) {
      rollDropper.style.animation = 'none';
      rollDropper.style.transform = 'translateY(0)';
      rollSquasher.style.animation = 'none';
      rollSquasher.style.transform = 'scaleX(1) scaleY(1)';

      /* Start floating with slight delay */
      setTimeout(() => {
        rollDropper.style.animation = 'rollFloat 5s ease-in-out infinite';
      }, 100);
    }

  }, SETTLED);


  /* ════════════════════════════════════════
     4. TEXT REVEAL (staggered after landing)
  ════════════════════════════════════════ */
  function dropLine (el, delay) {
    if (!el) return;
    setTimeout(() => {
      el.querySelector('.hero-line-inner').classList.add('drop');
    }, SETTLED + delay);
  }

  dropLine(line1, 100);
  dropLine(line2, 380);
  dropLine(line3, 620);

  /* Bottom bar */
  setTimeout(() => {
    if (heroBottom) heroBottom.classList.add('show');
  }, SETTLED + 900);


  /* ════════════════════════════════════════
     5. NAV ITEMS STAGGER (page load)
  ════════════════════════════════════════ */
  document.querySelectorAll('.nav-links li, .nav-cta').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-10px)';
    el.style.transition = `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '';
        el.style.transform = '';
      });
    });
  });


  /* ════════════════════════════════════════
     6. SCROLL REVEAL (sections below hero)
  ════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ════════════════════════════════════════
     7. NAV SCROLL BEHAVIOUR
  ════════════════════════════════════════ */
  const nav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id], div[id="products-anchor"]');

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 80);

    let cur = '';
    document.querySelectorAll('section[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) cur = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
  }, { passive: true });


  /* ════════════════════════════════════════
     8. MOBILE MENU
  ════════════════════════════════════════ */
  window.toggleMenu = function () {
    const menu = document.getElementById('mobileMenu');
    const ham  = document.getElementById('hamburger');
    const open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  window.closeMobile = function () {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.body.style.overflow = '';
  };


  /* ════════════════════════════════════════
     9. FORM HANDLING
  ════════════════════════════════════════ */
  const form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const honey = this.querySelector('[name="_honey"]');
      if (honey && honey.value) return;

      const name  = this.querySelector('#f-name').value.trim();
      const email = this.querySelector('#f-email').value.trim();
      const msg   = this.querySelector('#f-msg').value.trim();
      const re    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !msg) { alert('Please fill all required fields.'); return; }
      if (!re.test(email)) { alert('Please enter a valid email address.'); return; }

      /*
        Connect to a form service before going live:
        Example – Formspree:
          fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: new FormData(form) })
            .then(showSuccess);
      */
      showSuccess();
    });
  }

  function showSuccess () {
    form.reset();
    const s = document.getElementById('formSuccess');
    if (s) {
      s.style.display = 'block';
      setTimeout(() => { s.style.display = 'none'; }, 6000);
    }
  }

  /* ════════════════════════════════════════
     10. SUBTLE PARALLAX ON ROLL (post-settle)
  ════════════════════════════════════════ */
  let parallaxReady = false;
  setTimeout(() => { parallaxReady = true; }, SETTLED + 800);

  document.addEventListener('mousemove', (e) => {
    if (!parallaxReady || !rollDropper) return;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    const tX =  dx * 10;
    const tY =  dy * 5;

    // Overlay on the floating animation with translate nudge
    rollDropper.style.setProperty('--nudge-x', tX + 'px');
    rollDropper.style.setProperty('--nudge-y', tY + 'px');
  });

})();
