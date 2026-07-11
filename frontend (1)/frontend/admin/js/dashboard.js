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

  /* ---------- Greeting based on time of day ---------- */
  const greetingText = document.getElementById('greetingText');
  if (greetingText) {
    const hour = new Date().getHours();
    let greeting = 'Good Evening';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    greetingText.textContent = greeting;
  }

  /* ---------- Animated KPI Counters ---------- */
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

  /* ---------- Recent Platform Activity ---------- */
  const activityList = document.getElementById('activityList');
  const activityIcons = {
    registration: { icon: '🏢', cls: '' },
    update: { icon: '✏️', cls: '' },
    qr: { icon: '📱', cls: 'gold' },
    owner: { icon: '👤', cls: '' },
    suspended: { icon: '⛔', cls: 'danger' }
  };

  if (activityList && typeof platformActivity !== 'undefined') {
    activityList.innerHTML = platformActivity.map(item => {
      const meta = activityIcons[item.type] || { icon: '•', cls: '' };
      return `
        <div class="admin-activity-item">
          <div class="admin-activity-dot ${meta.cls}">${meta.icon}</div>
          <div class="admin-activity-body">
            <div class="admin-activity-message">${item.message}</div>
            <div class="admin-activity-time">${item.time}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ---------- Platform Growth SVG Chart ---------- */
  const growthData = (typeof platformGrowth !== 'undefined') ? platformGrowth.monthlyRegistrations : [28, 34, 41, 52, 60, 30];
  const growthSvg = document.getElementById('growthSvg');
  const growthLine = document.getElementById('growthLine');
  const growthArea = document.getElementById('growthArea');
  const growthDots = document.getElementById('growthDots');

  if (growthSvg) {
    const w = 600, h = 240, pad = 20;
    const max = Math.max(...growthData);
    const min = 0;
    const stepX = (w - pad * 2) / (growthData.length - 1);

    const points = growthData.map((val, i) => {
      const x = pad + i * stepX;
      const y = h - pad - ((val - min) / (max - min)) * (h - pad * 2);
      return [x, y];
    });

    const linePoints = points.map(p => p.join(',')).join(' ');
    const areaPoints = `${pad},${h - pad} ` + linePoints + ` ${w - pad},${h - pad}`;

    growthLine.setAttribute('points', linePoints);
    growthArea.setAttribute('points', areaPoints);

    const lineLength = growthLine.getTotalLength ? growthLine.getTotalLength() : 1000;
    growthLine.style.strokeDasharray = lineLength;
    growthLine.style.strokeDashoffset = lineLength;
    growthArea.style.opacity = '0';

    requestAnimationFrame(() => {
      growthLine.style.transition = 'stroke-dashoffset 1.3s ease';
      growthLine.style.strokeDashoffset = '0';
      growthArea.style.transition = 'opacity 1s ease 0.4s';
      growthArea.style.opacity = '1';
    });

    points.forEach(([x, y], i) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', 0);
      dot.setAttribute('fill', '#5B4FE8');
      growthDots.appendChild(dot);
      setTimeout(() => {
        dot.style.transition = 'r 0.3s ease';
        dot.setAttribute('r', 5);
      }, 900 + i * 90);
    });

    const growthTotal = document.getElementById('growthTotal');
    const growthPeak = document.getElementById('growthPeak');
    const months = (typeof platformGrowth !== 'undefined') ? platformGrowth.months : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    if (growthTotal) growthTotal.textContent = growthData.reduce((a, b) => a + b, 0).toLocaleString('en-US');
    if (growthPeak) {
      const peakIndex = growthData.indexOf(max);
      growthPeak.textContent = `${months[peakIndex]} · ${max}`;
    }
  }

  /* ---------- Recent Businesses Table ---------- */
  const tableBody = document.getElementById('businessesTableBody');
  const statusClassMap = {
    active: 'admin-status-active',
    pending: 'admin-status-pending',
    inactive: 'admin-status-inactive'
  };

  if (tableBody && typeof recentBusinesses !== 'undefined') {
    tableBody.innerHTML = recentBusinesses.map(biz => `
      <tr>
        <td class="admin-table-business">${biz.name}</td>
        <td>${biz.category}</td>
        <td>${biz.owner}</td>
        <td><span class="admin-status-badge ${statusClassMap[biz.status] || ''}">${biz.status}</span></td>
        <td class="admin-table-rating">⭐ ${biz.rating.toFixed(1)}</td>
        <td>
          <div class="admin-table-actions">
            <button type="button" class="admin-table-action-btn" data-table-action="view" data-business="${biz.name}">View</button>
            <button type="button" class="admin-table-action-btn" data-table-action="edit" data-business="${biz.name}">Edit</button>
            <button type="button" class="admin-table-action-btn danger" data-table-action="suspend" data-business="${biz.name}">Suspend</button>
          </div>
        </td>
      </tr>
    `).join('');

    /* View/Edit/Suspend on this summary table now live in full on the
       Business Management page — send the admin there instead of faking it
       with a toast. */
    tableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.admin-table-action-btn');
      if (!btn) return;
      navigate(ROUTES.ADMIN.BUSINESSES);
    });
  }

  /* ---------- Business Category Distribution Legend ---------- */
  const categoryLegend = document.getElementById('categoryLegend');
  const categoryColors = ['var(--accent)', 'var(--gold)', 'var(--success)', 'var(--text-faint)'];

  if (categoryLegend && typeof categoryDistribution !== 'undefined') {
    categoryLegend.innerHTML = categoryDistribution.map((cat, i) => `
      <div class="admin-donut-legend-row">
        <span class="admin-donut-legend-label">
          <span class="admin-donut-dot" style="background:${categoryColors[i % categoryColors.length]}"></span>
          ${cat.category}
        </span>
        <span class="admin-donut-legend-value">${cat.percent}%</span>
      </div>
    `).join('');
  }

  /* ---------- Quick Action Cards ---------- */
  const actionCards = document.querySelectorAll('.admin-action-card');
  actionCards.forEach((card) => {
    card.addEventListener('click', () => {
      const action = card.dataset.action;

      // Business Management now exists — route straight there.
      if (action === 'business-management') {
        navigate(ROUTES.ADMIN.BUSINESSES);
        return;
      }

      // Owner Management now exists — route straight there.
      if (action === 'owner-management') {
        navigate(ROUTES.ADMIN.OWNERS);
        return;
      }

      // Review Monitoring now exists — route straight there.
      if (action === 'review-monitoring') {
        navigate('reviews.html');
        return;
      }

      // Every other Quick Action's destination page doesn't exist yet.
      showToast('Coming Soon', { duration: TOAST_DURATION.SHORT });
    });
  });

  /* ---------- Logout ---------- */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = ROUTES.ADMIN.LOGIN;
    });
  }

  /* ---------- Footer Actions ---------- */
  const exportReportBtn = document.getElementById('exportReportBtn');
  if (exportReportBtn) {
    exportReportBtn.addEventListener('click', () => {
      showToast('Platform report exported successfully.', { duration: TOAST_DURATION.LONG });
    });
  }

  const downloadCsvBtn = document.getElementById('downloadCsvBtn');
  if (downloadCsvBtn) {
    downloadCsvBtn.addEventListener('click', () => {
      showToast('CSV downloaded successfully.', { duration: TOAST_DURATION.LONG });
    });
  }

  const refreshDataBtn = document.getElementById('refreshDataBtn');
  if (refreshDataBtn) {
    refreshDataBtn.addEventListener('click', () => {
      if (refreshDataBtn.classList.contains('is-loading')) return;
      const originalHTML = refreshDataBtn.innerHTML;
      refreshDataBtn.classList.add('is-loading');
      refreshDataBtn.innerHTML = `<span class="btn-spinner"></span>Refreshing...`;
      setTimeout(() => {
        refreshDataBtn.classList.remove('is-loading');
        refreshDataBtn.innerHTML = originalHTML;
        showToast('Platform data refreshed.', { duration: TOAST_DURATION.DEFAULT });
      }, 1100);
    });
  }

  /* ---------- Reveal-on-scroll for cards/sections ---------- */
  const revealTargets = document.querySelectorAll(
    '.admin-kpi-card, .admin-action-card, .admin-card, .admin-ai-card'
  );
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