/* Dragon Boat Canada Level 1 manual reference. */
(() => {
  const createLinks = () => {
    const links = document.createElement('div');
    links.className = 'dbc-source-reference';
    links.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:16px 0;padding:16px;border:1px solid currentColor;border-radius:10px';
    const label = document.createElement('strong');
    label.textContent = 'Dragon Boat Canada Level 1 manual';
    links.appendChild(label);
    for (const [href, text, download] of [
      ['dbc-reference.html', 'Browse original drill reference ↗', false],
      ['Dragon_Boat_Canada_Coach_Reference.pdf', 'Download PDF', true]
    ]) {
      const link = document.createElement('a');
      link.href = href; link.textContent = text; link.style.color = 'inherit';
      if (download) link.download = 'Dragon_Boat_Canada_Coach_Reference.pdf';
      else { link.target = '_blank'; link.rel = 'noopener'; }
      links.appendChild(link);
    }
    return links;
  };
  document.querySelectorAll('[data-library-view="drills"],[data-library-view="technique"]').forEach(section => {
    if (section.querySelector('.dbc-source-reference')) return;
    const heading = section.querySelector('.library-heading13');
    if (heading) heading.insertAdjacentElement('afterend', createLinks());
  });
})();
