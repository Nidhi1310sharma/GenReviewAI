/* ==========================================================================
   businesses.js
   --------------------------------------------------------------------------
   Powers admin/businesses.html (Business Management). Reads business
   records from shared/mock-data.js (`businesses`) and shared helpers from
   shared/utils.js. All create/update/suspend/approve/delete actions are
   dummy/front-end-only, mutating an in-memory working copy of the data
   for the current session.
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

  /* ---------- Working copy of business data for this session ---------- */
  const state = {
    businesses: (typeof businesses !== 'undefined') ? businesses.map(b => ({ ...b })) : [],
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
  const tableBody = document.getElementById('bizTableBody');
  const emptyState = document.getElementById('bizEmptyState');
  const pagination = document.getElementById('bizPagination');

  const statusClassMap = {
    active: 'admin-status-active',
    pending: 'admin-status-pending',
    suspended: 'admin-status-suspended'
  };

  function getFiltered() {
    const q = state.search.trim().toLowerCase();
    return state.businesses.filter(b => {
      const matchesSearch = !q || [b.name, b.businessId, b.owner, b.city, b.category]
        .some(field => String(field).toLowerCase().includes(q));

      let matchesFilter = true;
      if (state.filter !== 'all') {
        const [type, value] = state.filter.split(':');
        if (type === 'category') matchesFilter = b.category === value;
        if (type === 'status') matchesFilter = b.status === value;
      }
      return matchesSearch && matchesFilter;
    });
  }

  function actionButtonsFor(b) {
    if (b.status === 'pending') {
      return `
        <button type="button" class="admin-table-action-btn" data-action="approve" data-id="${b.id}">Approve</button>
        <button type="button" class="admin-table-action-btn" data-action="edit" data-id="${b.id}">Edit</button>
        <button type="button" class="admin-table-action-btn danger" data-action="delete" data-id="${b.id}">Delete</button>
      `;
    }
    if (b.status === 'suspended') {
      return `
        <button type="button" class="admin-table-action-btn" data-action="view" data-id="${b.id}">View</button>
        <button type="button" class="admin-table-action-btn" data-action="edit" data-id="${b.id}">Edit</button>
      `;
    }
    return `
      <button type="button" class="admin-table-action-btn" data-action="view" data-id="${b.id}">View</button>
      <button type="button" class="admin-table-action-btn" data-action="edit" data-id="${b.id}">Edit</button>
      <button type="button" class="admin-table-action-btn danger" data-action="suspend" data-id="${b.id}">Suspend</button>
    `;
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

    tableBody.innerHTML = pageItems.map(b => `
      <tr>
        <td>
          <div class="admin-table-biz-cell">
            <div class="admin-table-biz-avatar">${b.logo}</div>
            <div>
              <div class="admin-table-biz-name">${b.name}</div>
              <div class="admin-table-biz-id">${b.city}</div>
            </div>
          </div>
        </td>
        <td>${b.businessId}</td>
        <td>${b.category}</td>
        <td>${b.owner}</td>
        <td>${b.city}</td>
        <td class="admin-table-rating">⭐ ${b.rating.toFixed(1)}</td>
        <td>${b.reviewCount.toLocaleString('en-US')}</td>
        <td><span class="admin-status-badge ${statusClassMap[b.status] || ''}">${b.status}</span></td>
        <td><div class="admin-table-actions">${actionButtonsFor(b)}</div></td>
      </tr>
    `).join('');
  }

  /* ---------- Search ---------- */
  const searchInput = document.getElementById('bizSearchInput');
  searchInput.addEventListener('input', (e) => {
    state.search = e.target.value;
    state.page = 1;
    renderTable();
  });

  /* ---------- Filter chips ---------- */
  const chips = document.querySelectorAll('#bizFilterChips .admin-chip');
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

  function setBtnLoading(btn, loadingText) {
    btn.dataset.originalHtml = btn.innerHTML;
    btn.classList.add('is-loading');
    btn.innerHTML = `<span class="btn-spinner"></span>${loadingText}`;
    btn.disabled = true;
  }

  function clearBtnLoading(btn) {
    btn.classList.remove('is-loading');
    btn.innerHTML = btn.dataset.originalHtml || btn.innerHTML;
    btn.disabled = false;
  }

  /* ---------- View Modal ---------- */
  const viewModalOverlay = document.getElementById('viewModalOverlay');
  const viewGrid = document.getElementById('viewGrid');
  let currentViewId = null;

  function openView(id) {
    const b = state.businesses.find(x => x.id === id);
    if (!b) return;
    currentViewId = id;

    document.getElementById('viewAvatar').textContent = b.logo;
    document.getElementById('viewName').textContent = b.name;
    document.getElementById('viewBusId').textContent = b.businessId;

    const fields = [
      ['Owner', b.owner],
      ['Category', b.category],
      ['City', b.city],
      ['Email', b.email],
      ['Phone', b.phone],
      ['Joined Date', formatDate(new Date(b.joinedDate), { year: 'numeric' })],
      ['Average Rating', `⭐ ${b.rating.toFixed(1)}`],
      ['Total Reviews', b.reviewCount.toLocaleString('en-US')],
      ['QR Scans', b.qrScans.toLocaleString('en-US')],
      ['Google Reviews', b.googleReviews.toLocaleString('en-US')],
      ['Threshold Rating', b.thresholdRating],
      ['Status', b.status]
    ];

    viewGrid.innerHTML = fields.map(([label, value]) => `
      <div class="admin-view-field">
        <span class="admin-view-field-label">${label}</span>
        <span class="admin-view-field-value">${value}</span>
      </div>
    `).join('');

    openModal(viewModalOverlay);
  }

  document.getElementById('viewEditBtn').addEventListener('click', () => {
    closeModal(viewModalOverlay);
    if (currentViewId != null) openEdit(currentViewId);
  });

  /* ---------- Edit Modal ---------- */
  const editModalOverlay = document.getElementById('editModalOverlay');
  let currentEditId = null;

  function openEdit(id) {
    const b = state.businesses.find(x => x.id === id);
    if (!b) return;
    currentEditId = id;

    document.getElementById('editName').value = b.name;
    document.getElementById('editCategory').value = b.category;
    document.getElementById('editCity').value = b.city;
    document.getElementById('editStatus').value = b.status;
    document.getElementById('editThreshold').value = b.thresholdRating;
    document.getElementById('editOwner').value = b.owner;

    openModal(editModalOverlay);
  }

  document.getElementById('saveEditBtn').addEventListener('click', async () => {
    const b = state.businesses.find(x => x.id === currentEditId);
    if (!b) return;
    const btn = document.getElementById('saveEditBtn');
    setBtnLoading(btn, 'Saving...');

    await sleep(900);

    b.name = document.getElementById('editName').value.trim() || b.name;
    b.category = document.getElementById('editCategory').value;
    b.city = document.getElementById('editCity').value.trim() || b.city;
    b.status = document.getElementById('editStatus').value;
    b.thresholdRating = parseFloat(document.getElementById('editThreshold').value) || b.thresholdRating;
    b.owner = document.getElementById('editOwner').value.trim() || b.owner;

    clearBtnLoading(btn);
    closeModal(editModalOverlay);
    renderTable();
    showToast('Business updated successfully.');
  });

  /* ---------- Add Business Modal ---------- */
  const addModalOverlay = document.getElementById('addModalOverlay');
  const addBusinessBtn = document.getElementById('addBusinessBtn');

  addBusinessBtn.addEventListener('click', () => {
    document.getElementById('addForm').reset();
    const nextSeq = state.businesses.length + 1;
    document.getElementById('addBusinessId').value = `BUS-${String(nextSeq).padStart(3, '0')}`;
    openModal(addModalOverlay);
  });

  document.getElementById('createBusinessBtn').addEventListener('click', async () => {
    const name = document.getElementById('addName').value.trim();
    const owner = document.getElementById('addOwner').value.trim();
    const email = document.getElementById('addEmail').value.trim();
    if (!name || !owner || !email) {
      showToast('Please fill in all required fields.', { isError: true });
      return;
    }

    const btn = document.getElementById('createBusinessBtn');
    setBtnLoading(btn, 'Creating...');
    await sleep(1000);

    const newBiz = {
      id: Date.now(),
      businessId: document.getElementById('addBusinessId').value,
      name,
      owner,
      category: document.getElementById('addCategory').value,
      city: document.getElementById('addCity').value.trim() || '—',
      rating: 0,
      reviewCount: 0,
      status: document.getElementById('addStatus').value,
      email,
      phone: document.getElementById('addPhone').value.trim() || '—',
      joinedDate: new Date().toISOString().slice(0, 10),
      qrScans: 0,
      googleReviews: 0,
      thresholdRating: parseFloat(document.getElementById('addThreshold').value) || 4,
      logo: name.slice(0, 2).toUpperCase()
    };

    state.businesses.unshift(newBiz);

    clearBtnLoading(btn);
    closeModal(addModalOverlay);
    state.page = 1;
    renderTable();
    showToast('Business created successfully.');
  });

  /* ---------- Confirm Modal (Suspend / Delete) ---------- */
  const confirmModalOverlay = document.getElementById('confirmModalOverlay');
  const confirmTitle = document.getElementById('confirmTitle');
  const confirmText = document.getElementById('confirmText');
  const confirmActionBtn = document.getElementById('confirmActionBtn');
  const confirmIcon = document.getElementById('confirmIcon');
  let pendingAction = null;
  let pendingId = null;

  function openConfirm(type, id) {
    pendingAction = type;
    pendingId = id;
    if (type === 'suspend') {
      confirmIcon.textContent = '⛔';
      confirmTitle.textContent = 'Suspend Business?';
      confirmText.textContent = 'This business will no longer be able to access Graphura ReviewFlow.';
      confirmActionBtn.textContent = 'Suspend';
    } else if (type === 'delete') {
      confirmIcon.textContent = '🗑️';
      confirmTitle.textContent = 'Delete Business?';
      confirmText.textContent = 'This pending business and its data will be permanently removed.';
      confirmActionBtn.textContent = 'Delete';
    }
    openModal(confirmModalOverlay);
  }

  confirmActionBtn.addEventListener('click', async () => {
    if (pendingId == null) return;
    setBtnLoading(confirmActionBtn, pendingAction === 'suspend' ? 'Suspending...' : 'Deleting...');
    await sleep(900);

    const idx = state.businesses.findIndex(x => x.id === pendingId);
    if (idx !== -1) {
      if (pendingAction === 'suspend') {
        state.businesses[idx].status = 'suspended';
      } else if (pendingAction === 'delete') {
        state.businesses.splice(idx, 1);
      }
    }

    clearBtnLoading(confirmActionBtn);
    closeModal(confirmModalOverlay);
    renderTable();
    showToast(pendingAction === 'suspend' ? 'Business suspended successfully.' : 'Business deleted successfully.');
    pendingAction = null;
    pendingId = null;
  });

  /* ---------- Approve action (inline, no confirm modal per spec) ---------- */
  async function approveBusiness(id, btn) {
    setBtnLoading(btn, 'Approving...');
    await sleep(900);
    const b = state.businesses.find(x => x.id === id);
    if (b) b.status = 'active';
    clearBtnLoading(btn);
    renderTable();
    showToast('Business approved successfully.');
  }

  /* ---------- Table action delegation ---------- */
  tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.admin-table-action-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = parseInt(btn.dataset.id, 10);

    if (action === 'view') openView(id);
    else if (action === 'edit') openEdit(id);
    else if (action === 'suspend') openConfirm('suspend', id);
    else if (action === 'delete') openConfirm('delete', id);
    else if (action === 'approve') approveBusiness(id, btn);
  });

  /* ---------- Sidebar: Business Insights ---------- */
  const insightsList = document.getElementById('bizInsightsList');
  if (insightsList && typeof businessInsights !== 'undefined') {
    const rows = [
      ['Top Category', businessInsights.topCategory],
      ['Highest Rated', businessInsights.highestRated],
      ['Most Reviews', businessInsights.mostReviews],
      ['Fastest Growing', businessInsights.fastestGrowing]
    ];
    insightsList.innerHTML = rows.map(([label, value]) => `
      <div class="admin-insight-row">
        <span class="admin-insight-label">${label}</span>
        <span class="admin-insight-value">${value}</span>
      </div>
    `).join('');
  }

  /* ---------- Sidebar: Category Distribution ---------- */
  const categoryProgress = document.getElementById('bizCategoryProgress');
  if (categoryProgress && typeof categoryDistribution !== 'undefined') {
    categoryProgress.innerHTML = categoryDistribution.map(cat => `
      <div class="admin-progress-row">
        <div class="admin-progress-row-head">
          <span>${cat.category}</span>
          <span>${cat.percent}%</span>
        </div>
        <div class="admin-progress-track">
          <div class="admin-progress-fill" data-width="${cat.percent}"></div>
        </div>
      </div>
    `).join('');

    const fills = categoryProgress.querySelectorAll('.admin-progress-fill');
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.style.width = `${entry.target.dataset.width}%`;
          });
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    fills.forEach(f => progressObserver.observe(f));
  }

  /* ---------- Sidebar: Recent Registrations timeline ---------- */
  const recentRegistrations = document.getElementById('bizRecentRegistrations');
  if (recentRegistrations && typeof recentBusinessRegistrations !== 'undefined') {
    recentRegistrations.innerHTML = recentBusinessRegistrations.map(item => `
      <div class="admin-activity-item">
        <div class="admin-activity-dot">🏢</div>
        <div class="admin-activity-body">
          <div class="admin-activity-message">${item.name}</div>
          <div class="admin-activity-time">${item.time}</div>
        </div>
      </div>
    `).join('');
  }

  /* ---------- Footer Actions ---------- */
  function wireFooterButton(id, doneMessage) {
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

  wireFooterButton('exportCsvBtn', 'CSV exported successfully.');
  wireFooterButton('exportCsvFooterBtn', 'CSV exported successfully.');
  wireFooterButton('exportPdfBtn', 'PDF exported successfully.');
  wireFooterButton('refreshDataBtn', 'Business data refreshed.');

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