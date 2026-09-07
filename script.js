const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('navLinks');

const saved = localStorage.getItem('jj-theme');
if (saved) {
  root.dataset.theme = saved;
}

function updateTheme() {
  themeToggle.textContent = root.dataset.theme === 'light' ? '☀' : '☾';
}

updateTheme();

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('jj-theme', root.dataset.theme);
  updateTheme();
});

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});

const reveal = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        reveal.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

const filterButtons = document.querySelectorAll('.filters button');
const cards = document.querySelectorAll('.project-card.project');

filterButtons.forEach((btn) =>
  btn.addEventListener('click', () => {
    filterButtons.forEach((button) => button.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    cards.forEach((card) => {
      const categories = card.dataset.cat.split(' ');
      card.classList.toggle(
        'is-hidden',
        filter !== 'all' && !categories.includes(filter)
      );
    });
  })
);

const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('#navLinks a')];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((link) =>
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          )
        );
      }
    });
  },
  { rootMargin: '-35% 0px -55% 0px' }
);

sections.forEach((section) => sectionObserver.observe(section));

const canvas = document.getElementById('network-bg');
const ctx = canvas.getContext('2d');
let points = [];

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  points = Array.from(
    { length: Math.min(42, Math.floor(innerWidth / 28)) },
    () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    })
  );
}

function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  const accent =
    getComputedStyle(root).getPropertyValue('--accent').trim() || '#12e6b0';

  points.forEach((point) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < 0 || point.x > innerWidth) point.vx *= -1;
    if (point.y < 0 || point.y > innerHeight) point.vy *= -1;

    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 1.2, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const distance = Math.hypot(dx, dy);

      if (distance < 115) {
        ctx.strokeStyle = accent;
        ctx.globalAlpha = (1 - distance / 115) * 0.055;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

resize();
addEventListener('resize', resize);
draw();
