// Clicking an Email link copies the address and shows "Copied" for a moment.
// The mailto: href stays as the fallback if copying isn't possible.
(function () {
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  function showCopied(link) {
    if (!link.dataset.label) link.dataset.label = link.textContent;
    link.textContent = 'Copied';
    clearTimeout(link._copyTimer);
    link._copyTimer = setTimeout(function () {
      link.textContent = link.dataset.label;
    }, 1600);
  }

  document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var address = link.getAttribute('href').replace(/^mailto:/, '').split('?')[0];
      e.preventDefault();
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(address).then(
          function () { showCopied(link); },
          function () {
            if (fallbackCopy(address)) showCopied(link);
            else window.location.href = link.href;
          }
        );
      } else if (fallbackCopy(address)) {
        showCopied(link);
      } else {
        window.location.href = link.href;
      }
    });
  });
})();
