(() => {
  const sidebar = document.querySelector('.subject-sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  const mobileToggle = document.querySelector('.sidebar-mobile-toggle');
  const overlay = document.querySelector('.sidebar-overlay');
  if (!sidebar || !toggle) return;

  const setCollapsed = (collapsed) => {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
  };

  toggle.addEventListener('click', () => setCollapsed(!document.body.classList.contains('sidebar-collapsed')));
  mobileToggle?.addEventListener('click', () => document.body.classList.toggle('sidebar-open'));
  overlay?.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
})();