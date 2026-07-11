document.addEventListener('DOMContentLoaded', () => {

  // ---- Populate business brand info ----
  if (window.business) {
    const headerLogo = document.getElementById('headerLogo');
    const headerAvatar = document.getElementById('headerAvatar');
    const headerBusinessName = document.getElementById('headerBusinessName');
    const welcomeBusinessName = document.getElementById('welcomeBusinessName');

    if (headerLogo) headerLogo.textContent = business.logoInitials;
    if (headerAvatar) headerAvatar.textContent = business.logoInitials;
    if (headerBusinessName) headerBusinessName.textContent = business.name;
    if (welcomeBusinessName) welcomeBusinessName.textContent = business.name;

    document.title = `Graphura ReviewFlow | Owner Dashboard`;
  }

  const headerDate = document.getElementById('headerDate');
  if (headerDate) {
    headerDate.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  const actionCards = document.querySelectorAll('.action-card');
  actionCards.forEach((card) => {
    card.addEventListener('click', () => {
      const action = card.dataset.action;

      if (action === 'settings') {
        window.location.href = 'settings.html';
        return;
      }

      if (action === 'download-qr') {
        window.location.href = 'qr-manage.html';
        return;
      }

      if (action === 'view-reviews') {
        window.location.href = 'reviews.html';
        return;
      }

      if (action === 'analytics') {
        window.location.href = 'analytics.html';
        return;
      }

      showToast('Coming Soon', { duration: TOAST_DURATION.SHORT });
    });
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  }

});