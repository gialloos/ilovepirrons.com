/**
 * cruxxx.js — CRUXXX.gif è ora attaccata direttamente alla box IE in index.html.
 * Il pendolo è stato rimosso.
 */

/* Rimuovi eventuali elementi legacy del pendolo se presenti nel DOM */
document.addEventListener('DOMContentLoaded', () => {
    const rope = document.getElementById('cruxxx-rope');
    const gif  = document.getElementById('cruxxx-gif');
    if (rope) rope.remove();
    if (gif)  gif.remove();
});
