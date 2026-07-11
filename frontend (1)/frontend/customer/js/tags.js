document.addEventListener('DOMContentLoaded', () => {

  // ---- Populate business brand info ----
  const bizLogo = document.getElementById('bizLogo');
  const bizName = document.getElementById('bizName');
  const bizRating = document.getElementById('bizRating');

  if (window.business) {
    if (bizLogo) bizLogo.textContent = business.logoInitials;
    if (bizName) bizName.textContent = business.name;
    if (bizRating) bizRating.textContent = business.googleRating;
    document.title = `${business.name} | Tell Us More`;
  }

  // ---- Build the category-specific question groups ----
  // Falls back to "Restaurant" if the business's category has no configured
  // question set yet, so the page never renders empty.
  const category = (window.business && business.category) || 'Restaurant';
  const questions = (window.questionSets && questionSets[category]) || (window.questionSets && questionSets.Restaurant) || [];

  const questionGroupsContainer = document.getElementById('questionGroups');

  questions.forEach((q) => {
    const group = document.createElement('div');
    group.className = 'q-group';
    group.dataset.group = q.key;

    group.innerHTML = `
      <label class="q-label"><span class="q-icon">${q.icon}</span>${q.label}</label>
      <div class="star-rating small" data-key="${q.key}">
        <span class="star" data-value="1">★</span>
        <span class="star" data-value="2">★</span>
        <span class="star" data-value="3">★</span>
        <span class="star" data-value="4">★</span>
        <span class="star" data-value="5">★</span>
      </div>
    `;

    questionGroupsContainer.appendChild(group);
  });

  // ---- Existing behaviour (unchanged), now driven by the generated keys ----
  const form = document.getElementById('tagsForm');
  const validationMsg = document.getElementById('validationMsg');
  const ratingGroups = questions.map((q) => q.key);
  const ratings = {};

  document.querySelectorAll('.star-rating[data-key]').forEach(group => {
    const key = group.dataset.key;
    const stars = group.querySelectorAll('.star');
    ratings[key] = 0;

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
        ratings[key] = parseInt(star.dataset.value);
        highlight(ratings[key], 'selected');
      });
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const missingRating = ratingGroups.some(key => ratings[key] === 0);

    if (missingRating) {
      validationMsg.textContent = 'Please rate all categories before continuing.';
      return;
    }

    validationMsg.textContent = '';

    const feedbackData = {
      ratings,
      loved: document.getElementById('lovedText').value.trim()
    };

    sessionStorage.setItem(STORAGE_KEYS.TAGS_FEEDBACK, JSON.stringify(feedbackData));

    window.location.href = 'rating.html';
  });
});