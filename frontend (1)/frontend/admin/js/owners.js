/* ==========================================================================
   owners.js
   --------------------------------------------------------------------------
   Powers admin/owners.html (Owner Management). Reads owner records from
   shared/mock-data.js (`owners`) and shared helpers from shared/utils.js.
   All create/update/suspend/approve/resend/reset actions are dummy/
   front-end-only, mutating an in-memory working copy of the data for the
   current session — mirrors the structure of admin/js/businesses.js so
   the two pages feel like one product.
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

  /* ---------- Working copy of owner data for this session ---------- */
  const state = {
    owners: (typeof owners !== 'undefined') ? owners.map(o => ({ ...o })) : [],
    search: '',
    filter: 'all',
    page: 1,
    perPage: 5
  };

  /* ---------- Animated KPI Counters (identical technique to businesses.js) ---------- */
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
  const tableBody = document.getElementById('ownerTableBody');
  const emptyState = document.getElementById('ownerEmptyState');
  const pagination = document.getElementById('ownerPagination');

  const statusClassMap = {
    active: 'admin-status-active',
    pending: 'admin-status-pending',
    suspended: 'admin-status-suspended'
  };

  const accessClassMap = {
    active: 'admin-access-active',
    pending: 'admin-access-pending',
    suspended: 'admin-access-suspended'
  };

  const accessLabelMap = {
    active: 'Active',
    pending: 'Pending',
    suspended: 'Suspended'
  };

  function getFiltered() {
    const q = state.search.trim().toLowerCase();
    return state.owners.filter(o => {
      const matchesSearch = !q || [o.fullName, o.ownerId, o.businessName, o.email, o.phone]
        .some(field => String(field).toLowerCase().includes(q));

      let matchesFilter = true;
      if (state.filter !== 'all') {
        const [type, value] = state.filter.split(':');
        if (type === 'category') matchesFilter = o.category === value;
        if (type === 'status') matchesFilter = o.status === value;
      }
      return matchesSearch && matchesFilter;
    });
  }

  function actionButtonsFor(o) {
    if (o.status === 'pending') {
      return `
        <button type="button" class="admin-table-action-btn" data-action="approve" data-id="${o.ownerId}">Approve</button>
        <button type="button" class="admin-table-action-btn" data-action="resend" data-id="${o.ownerId}">Resend Invite</button>
      `;
    }
    if (o.status === 'suspended') {
      return `
        <button type="button" class="admin-table-action-btn" data-action="view" data-id="${o.ownerId}">View</button>
        <button type="button" class="admin-table-action-btn" data-action="edit" data-id="${o.ownerId}">Edit</button>
      `;
    }
    return `
      <button type="button" class="admin-table-action-btn" data-action="view" data-id="${o.ownerId}">View</button>
      <button type="button" class="admin-table-action-btn" data-action="edit" data-id="${o.ownerId}">Edit</button>
      <button type="button" class="admin-table-action-btn danger" data-action="suspend" data-id="${o.ownerId}">Suspend</button>
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

    tableBody.innerHTML = pageItems.map(o => `
      <tr>
        <td>
          <div class="admin-table-biz-cell">
            <div class="admin-table-biz-avatar admin-owner-avatar">${o.avatar}</div>
            <div>
              <div class="admin-table-biz-name">${o.fullName}</div>
              <div class="admin-table-biz-id">${o.role}</div>
            </div>
          </div>
        </td>
        <td>${o.ownerId}</td>
        <td>${o.businessName}</td>
        <td>${o.category}</td>
        <td>${o.email}</td>
        <td>${o.lastLogin}</td>
        <td><span class="admin-access-badge ${accessClassMap[o.access] || ''}">${accessLabelMap[o.access] || o.access}</span></td>
        <td><span class="admin-status-badge ${statusClassMap[o.status] || ''}">${o.status}</span></td>
        <td><div class="admin-table-actions">${actionButtonsFor(o)}</div></td>
      </tr>
    `).join('');
  }

  /* ---------- Search ---------- */
  const searchInput = document.getElementById('ownerSearchInput');
  searchInput.addEventListener('input', (e) => {
    state.search = e.target.value;
    state.page = 1;
    renderTable();
  });

  /* ---------- Filter chips ---------- */
  const chips = document.querySelectorAll('#ownerFilterChips .admin-chip');
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
    const o = state.owners.find(x => x.ownerId === id);
    if (!o) return;
    currentViewId = id;

    document.getElementById('viewAvatar').textContent = o.avatar;
    document.getElementById('viewName').textContent = o.fullName;
    document.getElementById('viewOwnerId').textContent = o.ownerId;

    const fields = [
      ['Email', o.email],
      ['Phone', o.phone],
      ['Assigned Business', o.businessName],
      ['Business Category', o.category],
      ['City', o.city],
      ['Joined Date', formatDate(new Date(o.joinedDate), { year: 'numeric' })],
      ['Last Login', o.lastLogin],
      ['Account Status', o.status],
      ['Businesses Managed', 1],
      ['Role', o.role],
      ['Google Connected', o.googleConnected ? 'Yes' : 'No'],
      ['QR Generated', o.qrGenerated]
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
    const o = state.owners.find(x => x.ownerId === id);
    if (!o) return;
    currentEditId = id;

    document.getElementById('editName').value = o.fullName;
    document.getElementById('editEmail').value = o.email;
    document.getElementById('editPhone').value = o.phone;
    document.getElementById('editBusinessName').value = o.businessName;
    document.getElementById('editStatus').value = o.status;
    document.getElementById('editRole').value = o.role;

    openModal(editModalOverlay);
  }

  document.getElementById('saveEditBtn').addEventListener('click', async () => {
    const o = state.owners.find(x => x.ownerId === currentEditId);
    if (!o) return;
    const btn = document.getElementById('saveEditBtn');
    setBtnLoading(btn, 'Saving...');

    await sleep(900);

    o.fullName = document.getElementById('editName').value.trim() || o.fullName;
    o.email = document.getElementById('editEmail').value.trim() || o.email;
    o.phone = document.getElementById('editPhone').value.trim() || o.phone;
    o.businessName = document.getElementById('editBusinessName').value.trim() || o.businessName;
    o.status = document.getElementById('editStatus').value;
    o.access = o.status;
    o.role = document.getElementById('editRole').value;

    clearBtnLoading(btn);
    closeModal(editModalOverlay);
    renderTable();
    showToast('Owner updated successfully.');
  });

  /* ---------- Add Owner Modal ---------- */
  const addModalOverlay = document.getElementById('addModalOverlay');
  const addOwnerBtn = document.getElementById('addOwnerBtn');
  const addBusinessSelect = document.getElementById('addBusiness');

  function populateBusinessOptions() {
    const list = (typeof businesses !== 'undefined') ? businesses : [];
    addBusinessSelect.innerHTML = list.map(b => `<option value="${b.businessId}">${b.name}</option>`).join('');
  }

  addOwnerBtn.addEventListener('click', () => {
    document.getElementById('addForm').reset();
    populateBusinessOptions();
    const nextSeq = state.owners.length + 1;
    document.getElementById('addOwnerId').value = `OWN-${String(nextSeq).padStart(3, '0')}`;
    openModal(addModalOverlay);
  });

  document.getElementById('createOwnerBtn').addEventListener('click', async () => {
    const fullName = document.getElementById('addName').value.trim();
    const email = document.getElementById('addEmail').value.trim();
    if (!fullName || !email) {
      showToast('Please fill in all required fields.', { isError: true });
      return;
    }

    const btn = document.getElementById('createOwnerBtn');
    setBtnLoading(btn, 'Creating...');
    await sleep(1000);

    const businessList = (typeof businesses !== 'undefined') ? businesses : [];
    const selectedBusiness = businessList.find(b => b.businessId === addBusinessSelect.value);
    const status = document.getElementById('addStatus').value;
    const sendInvite = document.getElementById('addSendInvite').checked;

    const newOwner = {
      ownerId: document.getElementById('addOwnerId').value,
      fullName,
      email,
      phone: document.getElementById('addPhone').value.trim() || '—',
      businessId: selectedBusiness ? selectedBusiness.businessId : '—',
      businessName: selectedBusiness ? selectedBusiness.name : '—',
      category: selectedBusiness ? selectedBusiness.category : '—',
      city: selectedBusiness ? selectedBusiness.city : '—',
      role: document.getElementById('addRole').value,
      status,
      access: status,
      lastLogin: 'Never',
      joinedDate: new Date().toISOString().slice(0, 10),
      avatar: fullName.slice(0, 2).toUpperCase(),
      googleConnected: false,
      qrGenerated: 0
    };

    state.owners.unshift(newOwner);

    clearBtnLoading(btn);
    closeModal(addModalOverlay);
    state.page = 1;
    renderTable();
    showToast(sendInvite ? 'Invitation sent successfully.' : 'Owner created successfully.');
  });

  /* ---------- Confirm Modal (Suspend) ---------- */
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
      confirmTitle.textContent = 'Suspend Owner?';
      confirmText.textContent = 'This owner will no longer be able to access Graphura ReviewFlow.';
      confirmActionBtn.textContent = 'Suspend';
    }
    openModal(confirmModalOverlay);
  }

  confirmActionBtn.addEventListener('click', async () => {
    if (pendingId == null) return;
    setBtnLoading(confirmActionBtn, 'Suspending...');
    await sleep(900);

    const o = state.owners.find(x => x.ownerId === pendingId);
    if (o) {
      o.status = 'suspended';
      o.access = 'suspended';
    }

    clearBtnLoading(confirmActionBtn);
    closeModal(confirmModalOverlay);
    renderTable();
    showToast('Owner suspended successfully.');
    pendingAction = null;
    pendingId = null;
  });

  /* ---------- Approve action (inline, no confirm modal per spec) ---------- */
  async function approveOwner(id, btn) {
    setBtnLoading(btn, 'Approving...');
    await sleep(900);
    const o = state.owners.find(x => x.ownerId === id);
    if (o) {
      o.status = 'active';
      o.access = 'active';
      o.lastLogin = 'Today';
    }
    clearBtnLoading(btn);
    renderTable();
    showToast('Owner approved successfully.');
  }

  /* ---------- Resend Invitation action (inline) ---------- */
  async function resendInvite(id, btn) {
    setBtnLoading(btn, 'Sending...');
    await sleep(900);
    clearBtnLoading(btn);
    showToast('Invitation email sent successfully.');
  }

  /* ---------- Table action delegation ---------- */
  tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.admin-table-action-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'view') openView(id);
    else if (action === 'edit') openEdit(id);
    else if (action === 'suspend') openConfirm('suspend', id);
    else if (action === 'approve') approveOwner(id, btn);
    else if (action === 'resend') resendInvite(id, btn);
  });

  /* ---------- Reset Password flow (from View or Edit modal) ---------- */
  const resetPasswordModalOverlay = document.getElementById('resetPasswordModalOverlay');
  const confirmResetPasswordBtn = document.getElementById('confirmResetPasswordBtn');

  document.getElementById('viewResetPasswordBtn').addEventListener('click', () => {
    openModal(resetPasswordModalOverlay);
  });
  document.getElementById('editResetPasswordBtn').addEventListener('click', () => {
    openModal(resetPasswordModalOverlay);
  });

  confirmResetPasswordBtn.addEventListener('click', async () => {
    setBtnLoading(confirmResetPasswordBtn, 'Sending...');
    await sleep(900);
    clearBtnLoading(confirmResetPasswordBtn);
    closeModal(resetPasswordModalOverlay);
    showToast('Password reset email sent.');
  });

  /* ---------- Sidebar: Owner Activity ---------- */
  const ownerActivityList = document.getElementById('ownerActivityList');
  if (ownerActivityList && typeof ownerActivity !== 'undefined') {
    const rows = [
      ['Owners Online', ownerActivity.ownersOnline],
      ['Average Session', ownerActivity.averageSession],
      ['Businesses Managed', ownerActivity.businessesManaged],
      ['Inactive Accounts', ownerActivity.inactiveAccounts]
    ];
    ownerActivityList.innerHTML = rows.map(([label, value]) => `
      <div class="admin-insight-row">
        <span class="admin-insight-label">${label}</span>
        <span class="admin-insight-value">${value}</span>
      </div>
    `).join('');
  }

  /* ---------- Sidebar: Role Distribution ---------- */
  const roleProgress = document.getElementById('ownerRoleProgress');
  if (roleProgress && typeof roleDistribution !== 'undefined') {
    roleProgress.innerHTML = roleDistribution.map(r => `
      <div class="admin-progress-row">
        <div class="admin-progress-row-head">
          <span>${r.role}</span>
          <span>${r.percent}%</span>
        </div>
        <div class="admin-progress-track">
          <div class="admin-progress-fill" data-width="${r.percent}"></div>
        </div>
      </div>
    `).join('');

    const fills = roleProgress.querySelectorAll('.admin-progress-fill');
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

  /* ---------- Sidebar: Recent Logins timeline ---------- */
  const recentLoginsList = document.getElementById('ownerRecentLogins');
  if (recentLoginsList && typeof recentLogins !== 'undefined') {
    recentLoginsList.innerHTML = recentLogins.map(item => `
      <div class="admin-activity-item">
        <div class="admin-activity-dot">👤</div>
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
  wireFooterButton('refreshDataBtn', 'Owner data refreshed.');

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

  /* ---------- Deep-link: auto-open Add Owner modal ----------
     Lets other pages (e.g. the Dashboard's "Add Owner" quick action)
     link straight into the modal via owners.html?action=add-owner */
  const params = new URLSearchParams(window.location.search);
  if (params.get('action') === 'add-owner') {
    addOwnerBtn.click();
    window.history.replaceState({}, '', window.location.pathname);
  }

});