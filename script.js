// Compteur de jours ensemble depuis le 27 septembre 2022
(function () {
  const start = new Date(2022, 8, 27); // mois 0-indexé : 8 = septembre
  const now = new Date();
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const el = document.getElementById('counter');
  if (el) {
    el.textContent = days.toLocaleString('fr-FR') + ' jours à tes côtés depuis le 27 septembre 2022';
  }
})();

// Photos en fond, rebondissant sur les bords de l'écran (style écran de veille)
(function () {
  const container = document.getElementById('photoBg');
  if (!container) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const photoFiles = Array.from({ length: 36 }, (_, i) => `photo${i + 1}.jpeg`);
  const squareCount = 16;
  const squares = [];

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function assignRandomPhoto(el) {
    const file = photoFiles[Math.floor(Math.random() * photoFiles.length)];
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = `url(photos/${file})`;
      el.classList.remove('missing');
    };
    img.onerror = () => { el.classList.add('missing'); };
    img.src = `photos/${file}`;
  }

  function scheduleRotation(el) {
    setTimeout(() => {
      assignRandomPhoto(el);
      scheduleRotation(el);
    }, randomBetween(8000, 18000));
  }

  for (let i = 0; i < squareCount; i++) {
    const el = document.createElement('div');
    el.className = 'photo-square';
    const size = randomBetween(55, 110);
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    container.appendChild(el);

    assignRandomPhoto(el);
    if (!prefersReducedMotion) scheduleRotation(el);

    const maxX = Math.max(window.innerWidth - size, 0);
    const maxY = Math.max(window.innerHeight - size, 0);
    const speed = randomBetween(18, 34);
    const angle = randomBetween(0, Math.PI * 2);

    squares.push({
      el,
      size,
      x: randomBetween(0, maxX),
      y: randomBetween(0, maxY),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    });
  }

  function paint() {
    squares.forEach((s) => {
      s.el.style.transform = `translate(${s.x}px, ${s.y}px)`;
    });
  }
  paint();

  if (prefersReducedMotion) return;

  let lastTime = performance.now();

  function tick(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    const maxX = window.innerWidth;
    const maxY = window.innerHeight;

    squares.forEach((s) => {
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      if (s.x <= 0) { s.x = 0; s.vx *= -1; }
      else if (s.x + s.size >= maxX) { s.x = maxX - s.size; s.vx *= -1; }

      if (s.y <= 0) { s.y = 0; s.vy *= -1; }
      else if (s.y + s.size >= maxY) { s.y = maxY - s.size; s.vy *= -1; }
    });

    paint();
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  window.addEventListener('resize', () => {
    const maxX = window.innerWidth;
    const maxY = window.innerHeight;
    squares.forEach((s) => {
      s.x = Math.min(s.x, Math.max(maxX - s.size, 0));
      s.y = Math.min(s.y, Math.max(maxY - s.size, 0));
    });
    paint();
  });
})();

// Animation d'apparition au scroll
(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((t) => observer.observe(t));
})();
