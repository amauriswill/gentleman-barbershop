// src/ui/icons.js
// Export SVG strings so they can be inlined in the UI for better performance and styling.
export const scissors = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M19.5 4.5L11 12" />
  <path d="M11 12l8.5 7.5" />
  <circle cx="6" cy="6" r="3" />
  <circle cx="6" cy="18" r="3" />
</svg>`;

export const remove = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M3 6h18" />
  <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
  <path d="M10 11v6M14 11v6" />
</svg>`;

export default {
  scissors,
  remove
};
