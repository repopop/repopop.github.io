/* RepoPop · catalogue des kits : plus récents en premier + bouton « Voir plus ».
   Ne modifie pas le HTML source (les générateurs continuent d'ajouter leurs cartes
   avant <div class="soon"> / <div class="bientot">). Sans JavaScript, tout reste affiché. */
(function () {
  var PAR_PAGE = 5;

  var css =
    '.kit.cache{display:none}' +
    '.plus{font:inherit;font-family:var(--display);font-size:16px;letter-spacing:.03em;cursor:pointer;' +
    'color:var(--ink);border:3px solid var(--ink);border-radius:14px;box-shadow:5px 5px 0 var(--ink);' +
    'padding:12px 16px;width:100%;display:flex;justify-content:center;align-items:center;gap:10px;' +
    'transition:transform .12s,box-shadow .12s}' +
    '.plus:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 var(--ink)}' +
    '.plus:active{transform:translate(3px,3px);box-shadow:2px 2px 0 var(--ink)}' +
    '.plus small{font-family:inherit;font-size:12px;font-weight:700;background:#fff;border:2px solid var(--ink);' +
    'border-radius:999px;padding:1px 9px}' +
    '#decouverte .plus{background:#FFD60A}#expert .plus{background:#FFB27A}#decode .plus{background:#C6F432}' +
    '.kit.arrive{animation:kitIn .35s ease-out both}' +
    '@keyframes kitIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){.kit.arrive{animation:none}}';

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var listes = document.querySelectorAll('main section .list');
    Array.prototype.forEach.call(listes, function (liste) {
      var kits = Array.prototype.filter.call(liste.children, function (el) {
        return el.classList.contains('kit');
      });
      var attente = liste.querySelector(':scope > .soon, :scope > .bientot');

      // Plus récents en premier (les générateurs les rangent du plus ancien au plus récent).
      kits.reverse().forEach(function (k) { liste.appendChild(k); });
      if (attente) liste.insertBefore(attente, liste.firstChild);

      if (kits.length <= PAR_PAGE) return;

      var visibles = PAR_PAGE;
      kits.forEach(function (k, i) { if (i >= visibles) k.classList.add('cache'); });

      var bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.className = 'plus';
      liste.appendChild(bouton);

      function majTexte() {
        var reste = kits.length - visibles;
        bouton.innerHTML = 'VOIR PLUS DE KITS <small>encore ' + reste + '</small>';
        bouton.setAttribute('aria-label', 'Afficher ' + Math.min(reste, PAR_PAGE) +
          ' kits de plus (' + reste + ' restants)');
      }
      majTexte();

      bouton.addEventListener('click', function () {
        var fin = Math.min(visibles + PAR_PAGE, kits.length);
        for (var i = visibles; i < fin; i++) {
          kits[i].classList.remove('cache');
          kits[i].classList.add('arrive');
        }
        if (kits[visibles]) kits[visibles].focus({ preventScroll: true });
        visibles = fin;
        if (visibles >= kits.length) bouton.remove(); else majTexte();
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
