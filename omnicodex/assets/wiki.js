(() => {
  const topbar = document.querySelector('.topbar');
  const toggle = document.querySelector('.menu-toggle');
  const search = document.querySelector('#wiki-search');
  const sections = [...document.querySelectorAll('.search-item')];
  const navLinks = [...document.querySelectorAll('.nav a')];

  toggle?.addEventListener('click', () => {
    const open = topbar.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach(link => link.addEventListener('click', () => topbar.classList.remove('is-open')));

  document.addEventListener('keydown', event => {
    if (event.key === '/' && document.activeElement !== search && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      search?.focus();
    }
  });

  search?.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    sections.forEach(section => {
      const haystack = `${section.dataset.search || ''} ${section.textContent || ''}`.toLowerCase();
      section.hidden = Boolean(query) && !haystack.includes(query);
    });
  });

  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const code = document.querySelector(`#${button.dataset.copy}`)?.innerText || '';
    try {
      await navigator.clipboard.writeText(code);
      const previous = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = previous; }, 1200);
    } catch {
      button.textContent = 'Select code';
    }
  }));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
  }), { rootMargin: '-38% 0px -56% 0px' });
  ['start', 'discovery', 'authoring', 'rewards', 'reference'].forEach(id => document.querySelector(`#${id}`) && observer.observe(document.querySelector(`#${id}`)));
})();
