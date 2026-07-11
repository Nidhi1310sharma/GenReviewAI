document.addEventListener('DOMContentLoaded', () => {

  // ---- Populate business info from business-config.js ----
  const bizLogo = document.getElementById('bizLogo');
  const bizName = document.getElementById('bizName');
  const bizRating = document.getElementById('bizRating');

  if (window.business) {
    if (bizLogo) bizLogo.textContent = business.logoInitials;
    if (bizName) bizName.textContent = business.name;
    if (bizRating) bizRating.textContent = business.googleRating;
    document.title = `${business.name} | Share Your Experience`;
  }

  // ---- Existing behaviour (unchanged) ----
  const reviewBtn = document.getElementById('leaveReviewBtn');

  reviewBtn.addEventListener('click', () => {
    window.location.href = 'tags.html';
  });
});