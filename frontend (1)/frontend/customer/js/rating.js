document.addEventListener('DOMContentLoaded', () => {

  // ---- Populate business brand info ----
  const bizLogo = document.getElementById('bizLogo');
  const bizName = document.getElementById('bizName');
  const bizRating = document.getElementById('bizRating');

  if (window.business) {
    if (bizLogo) bizLogo.textContent = business.logoInitials;
    if (bizName) bizName.textContent = business.name;
    if (bizRating) bizRating.textContent = business.googleRating;
    document.title = `${business.name} | Almost Done`;
  }

  // ---- Existing behaviour (unchanged) ----
  const form = document.getElementById('ratingForm');
  const validationMsg = document.getElementById('validationMsg');
  let overallRating = 0;

  const group = document.querySelector('.star-rating[data-key="overall"]');
  const stars = group.querySelectorAll('.star');

  const highlight = (value, className) => {
    stars.forEach(star => {
      const starValue = parseInt(star.dataset.value);
      star.classList.toggle(className, starValue <= value);
    });
  };

  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      highlight(parseInt(star.dataset.value), 'hovered');
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hovered'));
    });

    star.addEventListener('click', () => {
      overallRating = parseInt(star.dataset.value);
      highlight(overallRating, 'selected');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const recommendSelected = document.querySelector('input[name="recommend"]:checked');

    if (overallRating === 0 || !recommendSelected) {
      validationMsg.textContent = 'Please select a rating and recommendation.';
      return;
    }

    validationMsg.textContent = '';

    const finalData = {
      businessId: window.business ? business.id : null,
      overall: overallRating,
      recommend: recommendSelected.value
      // NOTE: routing to the AI Review page vs. the Private Feedback page
      // based on business.threshold will be decided by the backend later.
    };

    sessionStorage.setItem(STORAGE_KEYS.FINAL_RATING, JSON.stringify(finalData));

    window.location.href = 'review.html';
  });
});