export function initMenu() {
  const menus = Array.from(document.querySelectorAll<HTMLDetailsElement>('[data-menu]'));
  for (const details of menus) {
    const summary = details.querySelector('summary');
    details.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && details.open) {
        details.open = false;
        summary?.focus();
      }
    });
    details.addEventListener('click', (event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('a')) {
        details.open = false;
      }
    });
  }
}
