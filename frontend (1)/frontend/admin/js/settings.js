/* ==========================================================================
   settings.js
   --------------------------------------------------------------------------
   Powers admin/settings.html (Platform Settings). Front-end-only behaviour
   mirroring the structure/conventions of admin/js/owners.js: toggles,
   sliders, dropdowns, dummy save/reset/export/import/backup flows, all
   using the shared toast utility and button-loading helpers.
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

  /* ---------- Shared helpers (mirrors owners.js) ---------- */
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

  /* ---------- Navigation tabs (buttons that aren't real links yet) ---------- */
  document.querySelectorAll('.admin-nav-tab[data-nav]').forEach(tab => {
    if (tab.tagName === 'BUTTON') {
      tab.addEventListener('click', () => {
        showToast('Coming Soon', { duration: TOAST_DURATION.SHORT });
      });
    }
  });

  /* ---------- Field registry: captures initial values for Reset Defaults ---------- */
  const fieldIds = {
    text: [
      'settingPlatformName', 'settingSupportEmail', 'settingContactNumber',
      'limitMaxBusinesses', 'limitMaxOwners', 'limitMaxReviews', 'limitMaxAiRequests', 'limitStorage'
    ],
    select: [
      'settingTimezone', 'settingLanguage', 'settingCurrency',
      'selectMaxReviewLength', 'selectReviewTone',
      'selectSessionTimeout', 'selectMaxLoginAttempts', 'selectPasswordExpiry',
      'selectTheme', 'selectAccent'
    ],
    checkbox: [
      'toggleAiGeneration', 'toggleProfanityFilter', 'toggleAutoRetry',
      'toggleGoogleRedirect',
      'toggleStrongPassword', 'toggleTwoFactor', 'toggleLoginNotification',
      'notifyOwnerRegistration', 'notifyBusinessApproval', 'notifyReviewGenerated',
      'notifyWeeklyReport', 'notifyMonthlyReport', 'notifySystemAlerts',
      'toggleCompactLayout', 'toggleRoundedCorners',
      'toggleMaintenanceMode'
    ],
    range: [
      'sliderMinRating', 'sliderAiCreativity'
    ]
  };

  const initialValues = {};

  function captureInitialValues() {
    fieldIds.text.forEach(id => {
      const el = document.getElementById(id);
      if (el) initialValues[id] = el.value;
    });
    fieldIds.select.forEach(id => {
      const el = document.getElementById(id);
      if (el) initialValues[id] = el.value;
    });
    fieldIds.checkbox.forEach(id => {
      const el = document.getElementById(id);
      if (el) initialValues[id] = el.checked;
    });
    fieldIds.range.forEach(id => {
      const el = document.getElementById(id);
      if (el) initialValues[id] = el.value;
    });
  }
  captureInitialValues();

  function restoreInitialValues() {
    fieldIds.text.forEach(id => {
      const el = document.getElementById(id);
      if (el && id in initialValues) el.value = initialValues[id];
    });
    fieldIds.select.forEach(id => {
      const el = document.getElementById(id);
      if (el && id in initialValues) el.value = initialValues[id];
    });
    fieldIds.checkbox.forEach(id => {
      const el = document.getElementById(id);
      if (el && id in initialValues) el.checked = initialValues[id];
    });
    fieldIds.range.forEach(id => {
      const el = document.getElementById(id);
      if (el && id in initialValues) el.value = initialValues[id];
    });
    updateSliderLabels();
    updateMaintenanceWarning();
  }

  /* ---------- Sliders: live value display ---------- */
  const sliderMinRating = document.getElementById('sliderMinRating');
  const sliderMinRatingValue = document.getElementById('sliderMinRatingValue');
  const sliderAiCreativity = document.getElementById('sliderAiCreativity');
  const sliderAiCreativityValue = document.getElementById('sliderAiCreativityValue');

  function updateSliderLabels() {
    if (sliderMinRating && sliderMinRatingValue) {
      sliderMinRatingValue.textContent = sliderMinRating.value;
    }
    if (sliderAiCreativity && sliderAiCreativityValue) {
      sliderAiCreativityValue.textContent = `${sliderAiCreativity.value}%`;
    }
  }

  if (sliderMinRating) {
    sliderMinRating.addEventListener('input', updateSliderLabels);
  }
  if (sliderAiCreativity) {
    sliderAiCreativity.addEventListener('input', updateSliderLabels);
  }
  updateSliderLabels();

  /* ---------- Dropdowns: acknowledge state changes ---------- */
  fieldIds.select.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        /* state update only — dummy frontend, no backend call */
      });
    }
  });

  /* ---------- Toggles: animate + react ---------- */
  fieldIds.checkbox.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        const row = el.closest('.admin-settings-row');
        if (row) {
          row.classList.add('admin-settings-row-flash');
          setTimeout(() => row.classList.remove('admin-settings-row-flash'), 300);
        }
      });
    }
  });

  /* ---------- Maintenance Mode toggle: show/hide warning ---------- */
  const toggleMaintenanceMode = document.getElementById('toggleMaintenanceMode');
  const maintenanceWarning = document.getElementById('maintenanceWarning');

  function updateMaintenanceWarning() {
    if (!toggleMaintenanceMode || !maintenanceWarning) return;
    maintenanceWarning.style.display = toggleMaintenanceMode.checked ? 'flex' : 'none';
  }

  if (toggleMaintenanceMode) {
    toggleMaintenanceMode.addEventListener('change', () => {
      updateMaintenanceWarning();
      showToast(
        toggleMaintenanceMode.checked ? 'Maintenance mode enabled.' : 'Maintenance mode disabled.',
        { duration: TOAST_DURATION.SHORT, isError: toggleMaintenanceMode.checked }
      );
    });
  }
  updateMaintenanceWarning();

  /* ---------- API Key Show / Hide ---------- */
  const googleApiKeyInput = document.getElementById('googleApiKeyInput');
  const toggleApiKeyBtn = document.getElementById('toggleApiKeyBtn');

  if (toggleApiKeyBtn && googleApiKeyInput) {
    toggleApiKeyBtn.addEventListener('click', () => {
      const isHidden = googleApiKeyInput.type === 'password';
      googleApiKeyInput.type = isHidden ? 'text' : 'password';
      toggleApiKeyBtn.textContent = isHidden ? 'Hide' : 'Show';
    });
  }

  /* ---------- Google Integration: Reconnect / Disconnect ---------- */
  const googleConnectionStatus = document.getElementById('googleConnectionStatus');
  const googleReconnectBtn = document.getElementById('googleReconnectBtn');
  const googleDisconnectBtn = document.getElementById('googleDisconnectBtn');

  if (googleReconnectBtn) {
    googleReconnectBtn.addEventListener('click', async () => {
      setBtnLoading(googleReconnectBtn, 'Connecting...');
      await sleep(900);
      clearBtnLoading(googleReconnectBtn);
      if (googleConnectionStatus) {
        googleConnectionStatus.textContent = 'Connected';
        googleConnectionStatus.classList.remove('admin-status-suspended');
        googleConnectionStatus.classList.add('admin-status-active');
      }
      showToast('Google account reconnected successfully.');
    });
  }

  if (googleDisconnectBtn) {
    googleDisconnectBtn.addEventListener('click', async () => {
      setBtnLoading(googleDisconnectBtn, 'Disconnecting...');
      await sleep(900);
      clearBtnLoading(googleDisconnectBtn);
      if (googleConnectionStatus) {
        googleConnectionStatus.textContent = 'Disconnected';
        googleConnectionStatus.classList.remove('admin-status-active');
        googleConnectionStatus.classList.add('admin-status-suspended');
      }
      showToast('Google account disconnected.', { isError: true });
    });
  }

  /* ---------- Save Changes (header + footer) ---------- */
  function wireSaveButton(id) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', async () => {
      if (btn.classList.contains('is-loading')) return;
      setBtnLoading(btn, 'Saving...');
      await sleep(1000);
      clearBtnLoading(btn);
      showToast('Settings saved successfully.', { duration: TOAST_DURATION.LONG });
    });
  }
  wireSaveButton('saveChangesBtn');
  wireSaveButton('footerSaveChangesBtn');

  /* ---------- Reset Defaults (header + footer) ---------- */
  function wireResetButton(id) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', async () => {
      if (btn.classList.contains('is-loading')) return;
      setBtnLoading(btn, 'Resetting...');
      await sleep(800);
      restoreInitialValues();
      clearBtnLoading(btn);
      showToast('Settings restored to defaults.', { duration: TOAST_DURATION.SHORT });
    });
  }
  wireResetButton('resetDefaultsBtn');
  wireResetButton('footerResetDefaultsBtn');

  /* ---------- Export Configuration ---------- */
  const exportConfigBtn = document.getElementById('exportConfigBtn');
  if (exportConfigBtn) {
    exportConfigBtn.addEventListener('click', async () => {
      if (exportConfigBtn.classList.contains('is-loading')) return;
      setBtnLoading(exportConfigBtn, 'Exporting...');
      await sleep(800);

      const configPayload = {
        platformName: document.getElementById('settingPlatformName') ? document.getElementById('settingPlatformName').value : '',
        supportEmail: document.getElementById('settingSupportEmail') ? document.getElementById('settingSupportEmail').value : '',
        timezone: document.getElementById('settingTimezone') ? document.getElementById('settingTimezone').value : '',
        language: document.getElementById('settingLanguage') ? document.getElementById('settingLanguage').value : '',
        currency: document.getElementById('settingCurrency') ? document.getElementById('settingCurrency').value : '',
        aiGeneration: document.getElementById('toggleAiGeneration') ? document.getElementById('toggleAiGeneration').checked : false,
        minRating: sliderMinRating ? sliderMinRating.value : null,
        aiCreativity: sliderAiCreativity ? sliderAiCreativity.value : null,
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(configPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'graphura-platform-config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      clearBtnLoading(exportConfigBtn);
      showToast('Configuration exported successfully.');
    });
  }

  /* ---------- Import Configuration ---------- */
  const importConfigBtn = document.getElementById('importConfigBtn');
  const importConfigFileInput = document.getElementById('importConfigFileInput');

  if (importConfigBtn && importConfigFileInput) {
    importConfigBtn.addEventListener('click', () => {
      importConfigFileInput.click();
    });

    importConfigFileInput.addEventListener('change', async () => {
      if (!importConfigFileInput.files || !importConfigFileInput.files.length) return;
      setBtnLoading(importConfigBtn, 'Importing...');
      await sleep(900);
      clearBtnLoading(importConfigBtn);
      showToast('Configuration imported successfully.');
      importConfigFileInput.value = '';
    });
  }

  /* ---------- Backup & Recovery ---------- */
  const createBackupBtn = document.getElementById('createBackupBtn');
  const restoreBackupBtn = document.getElementById('restoreBackupBtn');
  const downloadBackupBtn = document.getElementById('downloadBackupBtn');
  const lastBackupValue = document.getElementById('lastBackupValue');

  if (createBackupBtn) {
    createBackupBtn.addEventListener('click', async () => {
      setBtnLoading(createBackupBtn, 'Backing up...');
      await sleep(1100);
      clearBtnLoading(createBackupBtn);
      if (lastBackupValue) {
        lastBackupValue.textContent = new Date().toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric'
        }) + ' — ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      }
      showToast('Backup created successfully.');
    });
  }

  /* ---------- Confirm Modal (Restore Backup / Reset Defaults reuse) ---------- */
  const confirmModalOverlay = document.getElementById('confirmModalOverlay');
  const confirmTitle = document.getElementById('confirmTitle');
  const confirmText = document.getElementById('confirmText');
  const confirmActionBtn = document.getElementById('confirmActionBtn');
  let pendingAction = null;

  function openConfirm(type) {
    pendingAction = type;
    if (type === 'restore') {
      confirmTitle.textContent = 'Restore Backup?';
      confirmText.textContent = 'This will restore the platform to the last saved backup. Recent changes may be lost.';
      confirmActionBtn.textContent = 'Restore';
    }
    openModal(confirmModalOverlay);
  }

  if (restoreBackupBtn) {
    restoreBackupBtn.addEventListener('click', () => openConfirm('restore'));
  }

  if (confirmActionBtn) {
    confirmActionBtn.addEventListener('click', async () => {
      if (!pendingAction) return;
      setBtnLoading(confirmActionBtn, 'Restoring...');
      await sleep(1100);
      clearBtnLoading(confirmActionBtn);
      closeModal(confirmModalOverlay);
      showToast('Platform restored from backup successfully.');
      pendingAction = null;
    });
  }

  if (downloadBackupBtn) {
    downloadBackupBtn.addEventListener('click', async () => {
      setBtnLoading(downloadBackupBtn, 'Preparing...');
      await sleep(900);

      const backupPayload = {
        backupCreated: lastBackupValue ? lastBackupValue.textContent : '',
        note: 'This is a dummy backup file generated from the frontend for demonstration purposes.'
      };
      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'graphura-platform-backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      clearBtnLoading(downloadBackupBtn);
      showToast('Backup downloaded successfully.');
    });
  }

  /* ---------- API Usage progress bars: animate on scroll into view ---------- */
  const apiUsageFills = document.querySelectorAll('#apiUsageProgress .admin-progress-fill');
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
  apiUsageFills.forEach(f => progressObserver.observe(f));

  /* ---------- Logout ---------- */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = ROUTES.ADMIN.LOGIN;
    });
  }

  /* ---------- Reveal-on-scroll ---------- */
  const revealTargets = document.querySelectorAll('.admin-card');
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

});