export function initActiveSection() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  if (!links.length) return;

  const byId = new Map<string, HTMLAnchorElement>();
  for (const link of links) {
    const href = link.getAttribute('href') ?? '';
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) continue;
    const id = href.slice(hashIndex + 1);
    if (id) byId.set(id, link);
  }
  if (!byId.size) return;

  const setCurrent = (id: string | null) => {
    for (const [key, link] of byId) {
      if (key === id) {
        link.setAttribute('aria-current', 'true');
        link.classList.add('is-current');
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('is-current');
      }
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      }
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
  );

  for (const id of byId.keys()) {
    const target = document.getElementById(id);
    if (target) observer.observe(target);
  }
}
