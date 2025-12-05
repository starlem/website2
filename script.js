// script.js
// Option C (fixed): cycle / random background colors and apply to full page via a CSS variable.
// Make sure your button has id="myButton" in the HTML.

const btn = document.getElementById('myButton');
const root = document.documentElement; // :root for CSS variable updates

// Palette
const colors = ['#C8F7FF', '#F5C6E7', '#E6FFDA', '#D6C8FF', '#0B3D91', '#0366d6'];
let index = Number(localStorage.getItem('bgIndex')) || 0;

// Apply initial color on load using the CSS variable
if (colors[index]) {
  applyPageBg(colors[index], false);
}

// Cycle to next color
function cycleBackground() {
  index = (index + 1) % colors.length;
  applyPageBg(colors[index], true);
  localStorage.setItem('bgIndex', String(index));
}

// Pick a random color
function randomBackground() {
  index = Math.floor(Math.random() * colors.length);
  applyPageBg(colors[index], true);
  localStorage.setItem('bgIndex', String(index));
}

// Compatibility alias: some code may call toggleDarkBackground (older versions).
// Keep that name working by forwarding it to cycleBackground.
function toggleDarkBackground() {
  cycleBackground();
}

// Apply color by setting a CSS variable on :root and fallback to body background
function applyPageBg(hex, withTransition = true) {
  // Set CSS variable
  root.style.setProperty('--page-bg', hex);

  // fallback: set body inline style (keeps compatibility)
  if (!withTransition) {
    const prev = document.body.style.transition;
    document.body.style.transition = 'none';
    requestAnimationFrame(() => {
      document.body.style.backgroundColor = hex;
      document.body.style.transition = prev;
    });
  } else {
    document.body.style.backgroundColor = hex;
  }

  // Optionally adjust text color for contrast site-wide
  adjustTextColor(hex);
}

// Simple luminance-based contrast check to toggle a class on <html>
function adjustTextColor(hex) {
  const lum = relativeLuminance(hex);
  if (lum < 0.5) {
    root.classList.add('bg-dark');
  } else {
    root.classList.remove('bg-dark');
  }
}

// Convert hex to relative luminance (0..1)
function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  const srgb = [rgb.r, rgb.g, rgb.b].map(v => v / 255).map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function hexToRgb(hex) {
  const m = hex.replace('#', '');
  if (m.length === 3) {
    return {
      r: parseInt(m[0] + m[0], 16),
      g: parseInt(m[1] + m[1], 16),
      b: parseInt(m[2] + m[2], 16)
    };
  } else if (m.length === 6) {
    return {
      r: parseInt(m.slice(0, 2), 16),
      g: parseInt(m.slice(2, 4), 16),
      b: parseInt(m.slice(4, 6), 16)
    };
  }
  return null;
}

// Event listeners: default click cycles; shift+click picks random
if (btn) {
  btn.addEventListener('click', cycleBackground);
  btn.addEventListener('click', (e) => {
    if (e.shiftKey) randomBackground();
  });
} else {
  console.warn('Button with id "myButton" not found. Add id="myButton" or update selector.');
}
