/* ==========================================================================
   reviews.js
   --------------------------------------------------------------------------
   Powers admin/reviews.html (Review Monitoring). Reads review records from
   shared/mock-data.js (`platformReviews` and friends) and shared helpers
   from shared/utils.js. All actions here are dummy/front-end-only,
   mutating an in-memory working copy of the data for the current session.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Current Date ---------- */
  const headerDate = document.getElementById('headerDate');
  if (headerDate) {
    headerDate.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  /* ---------- Working copy of review data for this session ---------- */
  const state = {
    reviews: (typeof platformReviews !== 'undefined') ? platformReviews.map(r => ({ ...r })) : [],
    search: '',
    filter: 'all',
    page: 1,
    perPage: 5
  };

  /* ---------- Animated KPI Counters (identical technique to dashboard.js) ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = (typeof ANIMATION_TIMINGS !== 'undefined') ? ANIMATION_TIMINGS.KPI_COUNTER : 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      const display = decimals > 0
        ? value.toFixed(decimals)
        : Math.round(value).toLocaleString('en-US');
      el.textContent = display + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('.admin-kpi-value[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Navigation tabs ---------- */
  document.querySelectorAll('.admin-nav-tab[data-nav]').forEach(tab => {
    if (tab.tagName === 'BUTTON') {
      tab.addEventListener('click', () => {
        showToast('Coming Soon', { duration: TOAST_DURATION.SHORT });
      });
    }
  });

  /* ---------- Table rendering ---------- */
  const tableBody = document.getElementById('reviewTableBody');
  const emptyState = document.getElementById('reviewEmptyState');
  const pagination = document.getElementById('reviewPagination');

  const reviewStatusClassMap = {
    published: 'admin-review-status-published',
    'pending-sync': 'admin-review-status-pending-sync',
    private: 'admin-review-status-private'
  };

  const aiStatusLabelMap = {
    'ai-generated': '✨ AI Generated',
    manual: '✍️ Manual',
    edited: '📝 Edited',
    'ai-draft': '⏳ AI Draft',
    'ai-failed': '⚠️ AI Failed'
  };

  function getFiltered() {
    const q = state.search.trim().toLowerCase();
    return state.reviews.filter(r => {
      const matchesSearch = !q || [r.reviewId, r.business, r.customer, r.category, r.city, r.text, r.privateFeedback]
        .some(field => String(field || '').toLowerCase().includes(q));

      let matchesFilter = true;
      if (state.filter !== 'all') {
        const [type, value] = state.filter.split(':');
        if (type === 'rating') matchesFilter = r.rating === parseInt(value, 10);
        if (type === 'category') matchesFilter = r.category === value;
        if (type === 'sentiment') {
          matchesFilter = value === 'positive' ? r.rating >= 4 : r.rating <= 3;
        }
      }
      return matchesSearch && matchesFilter;
    });
  }

  function renderTable() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * state.perPage;
    const pageItems = filtered.slice(start, start + state.perPage);

    if (filtered.length === 0) {
      tableBody.innerHTML = '';
      emptyState.classList.add('visible');
      pagination.style.display = 'none';
      return;
    }

    emptyState.classList.remove('visible');
    pagination.style.display = 'flex';

    tableBody.innerHTML = pageItems.map(r => `
      <tr>
        <td>${r.reviewId}</td>
        <td>
          <div class="admin-table-biz-cell">
            <div>
              <div class="admin-table-biz-name">${r.business}</div>
              <div class="admin-table-biz-id">${r.customer}</div>
            </div>
          </div>
        </td>
        <td>${r.category}</td>
        <td class="admin-table-rating">⭐ ${r.rating}</td>
        <td><span class="admin-ai-status-badge ${r.aiStatus === 'ai-failed' ? 'admin-ai-status-ai-failed' : ''}">${aiStatusLabelMap[r.aiStatus] || r.aiStatus}</span></td>
        <td><span class="admin-status-badge ${reviewStatusClassMap[r.reviewStatus] || ''}">${r.reviewStatus.replace('-', ' ')}</span></td>
        <td>${r.date}</td>
        <td>
          <div class="admin-table-actions">
            <button type="button" class="admin-table-action-btn" data-action="view" data-id="${r.id}">View</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* ---------- Search ---------- */
  const searchInput = document.getElementById('reviewSearchInput');
  searchInput.addEventListener('input', (e) => {
    state.search = e.target.value;
    state.page = 1;
    renderTable();
  });

  /* ---------- Filter chips ---------- */
  const chips = document.querySelectorAll('#reviewFilterChips .admin-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.filter = chip.dataset.filter;
      state.page = 1;
      renderTable();
    });
  });

  /* ---------- Pagination (dummy but functional over filtered data) ---------- */
  pagination.addEventListener('click', (e) => {
    const btn = e.target.closest('.admin-page-btn');
    if (!btn || btn.disabled) return;
    const p = btn.dataset.page;
    if (p === 'prev') state.page = Math.max(1, state.page - 1);
    else if (p === 'next') state.page = state.page + 1;
    else state.page = parseInt(p, 10);

    pagination.querySelectorAll('.admin-page-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = pagination.querySelector(`.admin-page-btn[data-page="${state.page}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    renderTable();
  });

  /* ---------- Modal helpers ---------- */
  function openModal(overlay) { overlay.classList.add('visible'); }
  function closeModal(overlay) { overlay.classList.remove('visible'); }

  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      const overlay = document.getElementById(`${el.dataset.close}ModalOverlay`);
      if (overlay) closeModal(overlay);
    });
  });

  document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  /* ---------- View Modal ---------- */
  const viewModalOverlay = document.getElementById('viewModalOverlay');
  const viewGrid = document.getElementById('viewGrid');
  const viewReviewTextWrap = document.getElementById('viewReviewTextWrap');
  const viewReviewText = document.getElementById('viewReviewText');
  let currentViewId = null;

  function openView(id) {
    const r = state.reviews.find(x => x.id === id);
    if (!r) return;
    currentViewId = id;

    document.getElementById('viewAvatar').textContent = r.business.slice(0, 2).toUpperCase();
    document.getElementById('viewBusiness').textContent = r.business;
    document.getElementById('viewReviewId').textContent = r.reviewId;

    const fields = [
      ['Customer', r.customer],
      ['Category', r.category],
      ['City', r.city],
      ['Rating', `⭐ ${r.rating}`],
      ['AI Status', aiStatusLabelMap[r.aiStatus] || r.aiStatus],
      ['Review Status', r.reviewStatus.replace('-', ' ')],
      ['Google Posted', r.googlePosted ? 'Yes' : 'No'],
      ['QR Source', r.qrSource ? 'Yes' : 'No'],
      ['Language', r.language],
      ['Date', r.date]
    ];

    viewGrid.innerHTML = fields.map(([label, value]) => `
      <div class="admin-view-field">
        <span class="admin-view-field-label">${label}</span>
        <span class="admin-view-field-value">${value}</span>
      </div>
    `).join('');

    const text = r.text || r.privateFeedback;
    if (text) {
      viewReviewTextWrap.style.display = '';
      viewReviewText.textContent = text;
    } else {
      viewReviewTextWrap.style.display = 'none';
    }

    openModal(viewModalOverlay);
  }

  /* ---------- Table action delegation ---------- */
  tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.admin-table-action-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = parseInt(btn.dataset.id, 10);
    if (action === 'view') openView(id);
  });

  /* ---------- View Modal: Download ---------- */
  const viewDownloadBtn = document.getElementById('viewDownloadBtn');
  if (viewDownloadBtn) {
    viewDownloadBtn.addEventListener('click', () => {
      if (currentViewId == null) return;
      showToast('Review downloaded successfully.');
    });
  }

  /* ---------- Sidebar: Review Activity Timeline ---------- */
  const timelineList = document.getElementById('reviewTimelineList');
  if (timelineList && typeof reviewTimeline !== 'undefined') {
    timelineList.innerHTML = reviewTimeline.map(item => `
      <div class="admin-timeline-item">
        <div class="admin-timeline-label">${item.label}</div>
        <div class="admin-timeline-time">${item.time}</div>
      </div>
    `).join('');
  }

  /* ---------- Sidebar: Rating Distribution ---------- */
  const ratingDistribution = document.getElementById('ratingDistribution');
  if (ratingDistribution && typeof reviewRatingDistribution !== 'undefined') {
    ratingDistribution.innerHTML = reviewRatingDistribution.map(row => `
      <div class="admin-rating-bar-row">
        <span class="admin-rating-bar-label">${'★'.repeat(row.stars)}${'☆'.repeat(5 - row.stars)}</span>
        <div class="admin-rating-bar-track">
          <div class="admin-rating-bar-fill" data-width="${row.percent}"></div>
        </div>
        <span class="admin-rating-bar-value">${row.percent}%</span>
      </div>
    `).join('');

    const fills = ratingDistribution.querySelectorAll('.admin-rating-bar-fill');
    const ratingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.style.width = `${entry.target.dataset.width}%`;
          });
          ratingObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    fills.forEach(f => ratingObserver.observe(f));
  }

  /* ---------- Sidebar: Businesses Requiring Attention ---------- */
  const attentionTableBody = document.getElementById('attentionTableBody');
  if (attentionTableBody && typeof reviewBusinessesAttention !== 'undefined') {
    attentionTableBody.innerHTML = reviewBusinessesAttention.map(item => `
      <tr>
        <td>${item.business}</td>
        <td>${item.issue}</td>
        <td>${item.reviews}</td>
      </tr>
    `).join('');
  }

  /* ---------- Sidebar: Complaint Categories ---------- */
  const complaintBars = document.getElementById('complaintBars');
  if (complaintBars && typeof complaintCategories !== 'undefined') {
    complaintBars.innerHTML = complaintCategories.map(cat => `
      <div>
        <div class="admin-complaint-bar-row-head">
          <span>${cat.label}</span>
          <span>${cat.percent}%</span>
        </div>
        <div class="admin-complaint-bar-track">
          <div class="admin-complaint-bar-fill" data-width="${cat.percent}"></div>
        </div>
      </div>
    `).join('');

    const fills = complaintBars.querySelectorAll('.admin-complaint-bar-fill');
    const complaintObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.style.width = `${entry.target.dataset.width}%`;
          });
          complaintObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    fills.forEach(f => complaintObserver.observe(f));
  }

  /* ---------- Sidebar: Recent Private Feedback ---------- */
  const privateFeedbackList = document.getElementById('privateFeedbackList');
  if (privateFeedbackList && typeof recentPrivateFeedback !== 'undefined') {
    privateFeedbackList.innerHTML = recentPrivateFeedback.map(item => `
      <div class="admin-feedback-card">
        <div class="admin-feedback-head">
          <span class="admin-feedback-business">${item.business}</span>
          <span class="admin-feedback-rating">⭐ ${item.rating}</span>
        </div>
        <div class="admin-feedback-text">"${item.text}"</div>
      </div>
    `).join('');
  }

  /* ---------- Footer / Header Actions ---------- */
  function wireLoadingButton(id, doneMessage) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-loading')) return;
      const originalHTML = btn.innerHTML;
      btn.classList.add('is-loading');
      btn.innerHTML = `<span class="btn-spinner"></span>Working...`;
      setTimeout(() => {
        btn.classList.remove('is-loading');
        btn.innerHTML = originalHTML;
        showToast(doneMessage, { duration: TOAST_DURATION.LONG });
      }, 1100);
    });
  }

  wireLoadingButton('exportCsvBtn', 'CSV exported successfully.');
  wireLoadingButton('exportCsvFooterBtn', 'CSV exported successfully.');
  wireLoadingButton('exportPdfBtn', 'PDF exported successfully.');
  wireLoadingButton('refreshBtn', 'Review data refreshed.');
  wireLoadingButton('refreshDataBtn', 'Review data refreshed.');

  /* ---------- Logout ---------- */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = ROUTES.ADMIN.LOGIN;
    });
  }

  /* ---------- Reveal-on-scroll ---------- */
  const revealTargets = document.querySelectorAll('.admin-kpi-card, .admin-card, .admin-ai-card');
  revealTargets.forEach(el => el.classList.add('reveal-init'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Initial render ---------- */
  renderTable();

});
