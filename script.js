// script.js
// Option C: cycle / random background colors with persistence and contrast handling

const btn = document.getElementById('myButton'); // ensure your button has id="myButton"
const target = document.body; // change to document.querySelector('header') to affect only the header

// Palette: use the dark gray you chose plus a few companions
const colors = ['#2F2F2F', '#1F1F1F', '#3A3A3A', '#444444', '#0B3D91', '#0366d6'];

let index = Number(localStorage.getItem('bgIndex')) || 0;

// Apply initial color on load (if you want to start with stored color)
if (colors[index]) {
  setColor(colors[index], false);
}

// Smooth transition for background changes (also set in CSS is fine)
target.style.transition = 'background-color 350ms ease, color 200ms ease';

// Cycle to next color
function cycleBackground() {
  index = (index + 1) % colors.length;
  setColor(colors[index], true);
  localStorage.setItem('bgIndex', String(index));
}

// Pick a random color
function randomBackground() {
  index = Math.floor(Math.random() * colors.length);
  setColor(colors[index], true);
  localStorage.setItem('bgIndex', String(index));
}

// Central setter: applies color and adjusts text color for contrast
function setColor(hex, withTransition = true) {
  if (!withTransition) {
    // briefly disable transition if caller requested no animation
    const prev = target.style.transition;
    target.style.transition = 'none';
    requestAnimationFrame(() => {
      target.style.backgroundColor = hex;
      target.style.transition = prev;
      adjustTextColor(hex);
    });
  } else {
    target.style.backgroundColor = hex;
    adjustTextColor(hex);
  }
}

// Simple luminance-based contrast check to pick light/dark text
function adjustTextColor(hex) {
  const lum = relativeLuminance(hex);
  // threshold ~0.5 is reasonable; lower lum => use light text
  if (lum < 0.5) {
    document.documentElement.classList.add('bg-dark');
  } else {
    document.documentElement.classList.remove('bg-dark');
  }
}

// Convert hex to relative luminance (0..1)
function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  // convert sRGB to linear RGB
  const srgb = [rgb.r, rgb.g, rgb.b].map(v => v / 255).map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  // Rec. 709 luminance
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

// Event listeners: choose cycleBackground as the primary click handler (you can swap)
if (btn) {
  btn.addEventListener('click', cycleBackground);

  // optional: shift+click for random
  btn.addEventListener('click', (e) => {
    if (e.shiftKey) randomBackground();
  });
} else {
  console.warn('Button with id "myButton" not found. Add id="myButton" to your button or update selector.');
}
