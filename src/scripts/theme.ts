const currentTheme = (): 'light' | 'dark' => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

const syncLabel = (btn: HTMLButtonElement) => {
  btn.setAttribute(
    'aria-label',
    currentTheme() === 'dark' ? (btn.dataset.labelDark ?? '') : (btn.dataset.labelLight ?? ''),
  );
};

export function initTheme() {
  // Enable colour transitions only after first paint to avoid a theme flash.
  const ready = () => document.body.classList.add('theme-ready');
  if (document.readyState === 'complete') {
    ready();
  } else {
    window.addEventListener('load', ready, { once: true });
  }

  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    syncLabel(btn);
  }

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const btn = target?.closest<HTMLButtonElement>('[data-theme-toggle]');
    if (!btn) return;
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable */
    }
    syncLabel(btn);
  });
}
