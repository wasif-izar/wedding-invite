/**
 * Wedding Invitation — script.js
 * Pure vanilla JS: seal interaction, countdown timer, scroll reveal
 */

/* ─────────────────────────────────────────
   1.  DOM references
───────────────────────────────────────── */
const openingScreen  = document.getElementById('opening-screen');
const invitation     = document.getElementById('invitation');
const sealBtn        = document.getElementById('seal-btn');

/* Countdown elements */
const cdDays    = document.getElementById('cd-days');
const cdHours   = document.getElementById('cd-hours');
const cdMinutes = document.getElementById('cd-minutes');
const cdSeconds = document.getElementById('cd-seconds');

/* ─────────────────────────────────────────
   2.  Wedding date  (5 June 2026, 13:30 local)
───────────────────────────────────────── */
const WEDDING_DATE = new Date('2026-06-05T13:30:00');

/* ─────────────────────────────────────────
   3.  Seal — idle glow after short delay
───────────────────────────────────────── */
setTimeout(() => {
  sealBtn.classList.add('idle-glow');
}, 2000);

/* ─────────────────────────────────────────
   4.  Seal click → open invitation
───────────────────────────────────────── */
let opened = false;

function openInvitation() {
  if (opened) return;
  opened = true;

  /* Remove idle glow, play press animation */
  sealBtn.classList.remove('idle-glow');
  sealBtn.classList.add('pressed');

  /* After press animation, fade out opening screen */
  setTimeout(() => {
    openingScreen.classList.add('exit');

    /* Show invitation behind the exit animation */
    invitation.classList.remove('hidden');
    invitation.classList.add('entering');

    /* Remove the opening screen from the DOM after transition */
    openingScreen.addEventListener('animationend', () => {
      openingScreen.style.display = 'none';

      /* Trigger initial reveal for hero section */
      triggerReveal();
    }, { once: true });

  }, 350); // slight delay so press animation is felt
}

sealBtn.addEventListener('click', openInvitation);

/* Keyboard accessibility */
sealBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openInvitation();
  }
});

/* ─────────────────────────────────────────
   5.  Countdown Timer
───────────────────────────────────────── */
function pad(n) {
  return String(n).padStart(2, '0');
}

function updateCountdown() {
  const now  = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    /* Wedding day or past — show celebratory message */
    cdDays.textContent    = '00';
    cdHours.textContent   = '00';
    cdMinutes.textContent = '00';
    cdSeconds.textContent = '00';

    const label = document.querySelector('.countdown-label');
    if (label) label.textContent = '🌙 The blessed day is here — Mabrook!';
    clearInterval(countdownInterval);
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600)  / 60);
  const seconds = totalSeconds % 60;

  cdDays.textContent    = pad(days);
  cdHours.textContent   = pad(hours);
  cdMinutes.textContent = pad(minutes);
  cdSeconds.textContent = pad(seconds);
}

// Run immediately then every second
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);

/* ─────────────────────────────────────────
   6.  Scroll-reveal (IntersectionObserver)
───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

function triggerReveal() {
  const elements = document.querySelectorAll('.reveal');
  elements.forEach((el) => revealObserver.observe(el));
}

/* Also call on DOMContentLoaded for any pre-visible elements
   (e.g., if invitation is shown without animation in some edge cases) */
document.addEventListener('DOMContentLoaded', () => {
  if (!invitation.classList.contains('hidden')) {
    triggerReveal();
  }
});

/* ─────────────────────────────────────────
   7.  Lightweight parallax on hero
───────────────────────────────────────── */
const hero = document.querySelector('.hero');

function onScroll() {
  if (!hero) return;
  const scrollY = window.scrollY;
  /* Move background very slightly for depth */
  hero.style.backgroundPositionY = `calc(50% + ${scrollY * 0.25}px)`;
}

// Only apply if user hasn't requested reduced motion
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', onScroll, { passive: true });
}


