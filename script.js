window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('hidden');
    setTimeout(() => { splash.style.display = 'none'; }, 1100);
  }, 4000);
});
 
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}
if (localStorage.getItem('theme') === 'light') {
  document.documentElement.classList.add('light');
}
 
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function ani() {
  dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
  rx += (mx - rx) * .14;       ry += (my - ry) * .14;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(ani);
})();
document.querySelectorAll('a, button, [onclick]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.transform  = 'translate(-50%,-50%) scale(2.5)';
    ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
    ring.style.opacity   = '.25';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.transform  = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.opacity   = '1';
  });
});
 
const nav     = document.getElementById('nav');
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  nav.classList.toggle('compact', window.scrollY > 60);
  backTop.classList.toggle('show', window.scrollY > 400);
});
 
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
reveals.forEach(r => io.observe(r));
 
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let W, H;
const mouse = { x: -999, y: -999 };
const TOTAL = 90;
const particles = [];
 
function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
document.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
 
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r  = Math.random() * 2.5 + 1;
    this.alpha = Math.random() * 0.45 + 0.1;
  }
  update() {
    const dx = mouse.x - this.x, dy = mouse.y - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 160) { this.vx += (dx/dist)*.15; this.vy += (dy/dist)*.15; }
    const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    if (speed > 3) { this.vx = (this.vx/speed)*3; this.vy = (this.vy/speed)*3; }
    this.vx *= 0.96; this.vy *= 0.96;
    this.x  += this.vx; this.y  += this.vy;
    if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
  }
  draw() {
    const isLight = document.documentElement.classList.contains('light');
    const color   = isLight ? '99,68,212' : '184,146,255';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color},${this.alpha})`;
    ctx.fill();
  }
}
 
for (let i = 0; i < TOTAL; i++) particles.push(new Particle());
 
function drawLines() {
  const isLight = document.documentElement.classList.contains('light');
  const color   = isLight ? '99,68,212' : '184,146,255';
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${color},${0.15*(1-dist/120)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}
 
function loop() {
  ctx.clearRect(0, 0, W, H);
  drawLines();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(loop);
}
loop();
 