// index.js
// This script replaces every character in the blog post with an asterisk, then reveals the true character within 50px of the mouse.

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  if (!container) return;

  // Slider setup
  let circleSize = 150;
  const slider = document.getElementById('slider');
  const sliderValue = document.getElementById('slider-value');
  if (slider && sliderValue) {
    slider.addEventListener('input', (e) => {
      circleSize = parseInt(slider.value, 10);
      sliderValue.textContent = circleSize;
    });
  }

  // Store the original text and positions
  let charData = [];

  // Helper to wrap each character in a span
  function wrapChars(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < node.textContent.length; i++) {
        const ch = node.textContent[i];
        const span = document.createElement('span');
        if (ch === '\n') {
          span.textContent = ch;
        } else if (ch === ' ') {
          span.textContent = ' ';
        } else {
          span.textContent = '*';
        }
        span.dataset.trueChar = ch;
        frag.appendChild(span);
        charData.push({ span, ch });
      }
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
      Array.from(node.childNodes).forEach(wrapChars);
    }
  }

  wrapChars(container);

  // Position cache for each span
  let positions = [];
  function updatePositions() {
    positions = charData.map(({ span }) => {
      const rect = span.getBoundingClientRect();
      // Add scrollY to y to get document coordinates
      return {
        span,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2 + window.scrollY,
      };
    });
  }
  updatePositions();
  window.addEventListener('resize', updatePositions);

  // Mouse move handler
  document.addEventListener('mousemove', (e) => {
    const mx = e.clientX;
    const my = e.clientY + window.scrollY;
    positions.forEach(({ span, x, y }, i) => {
      const dist = Math.hypot(mx - x, my - y);
      if (dist < circleSize && charData[i].ch !== '\n' && charData[i].ch !== ' ') {
        span.textContent = charData[i].ch;
      } else if (charData[i].ch !== '\n' && charData[i].ch !== ' ') {
        span.textContent = '*';
      } else if (charData[i].ch === ' ') {
        span.textContent = ' ';
      }
    });
  });
});
