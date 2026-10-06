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

  const visible = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      if (visible.size === 0) {
        setCurrent(null);
        return;
      }
      const first = [...byId.keys()].find((id) => visible.has(id));
      setCurrent(first ?? null);
    },
    { rootMargin: '-35% 0px -60% 0px', threshold: 0 },
  );

  for (const id of byId.keys()) {
    const target = document.getElementById(id);
    if (target) observer.observe(target);
  }
}
