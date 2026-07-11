/* ==========================================================================
   analytics.js
   --------------------------------------------------------------------------
   Powers admin/analytics.html (Platform Analytics). Interactivity includes:
   1. Switching periods (Today, 7 days, 30 days, 6 months, Last Year, Custom).
   2. Fetching & binding corresponding mock-data.js dataset from
      `platformAnalyticsFilterData`.
   3. Custom Range date validation and dataset simulation.
   4. Simulating live query loading with CSS masks.
   5. Re-drawing dynamic SVG Trend charts (Platform & Review growth).
   6. Recalculating Funnels, Conic-Gradients, Sentiment metrics and
      Rating distributions with micro-animations.
   7. Rendering Top lists, Category performance, Peak hours and City shares.
   8. Export buttons (CSV, PDF).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header Date ---------- */
  const headerDate = document.getElementById('headerDate');
  if (headerDate) {
    headerDate.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  /* ---------- Check if mock data is loaded ---------- */
  if (typeof platformAnalyticsFilterData === 'undefined') {
    console.error('platformAnalyticsFilterData is not loaded. Please double check mock-data.js paths.');
    return;
  }

  /* ---------- State Tracker ---------- */
  const state = {
    currentPeriod: 'last30days',
    currentData: null,
    animationTimers: []
  };

  /* ---------- Core Binding Methods ---------- */

  // 1. Animated KPI values (uses standard requestAnimationFrame)
  function animateCounter(el, targetValue) {
    const decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = (typeof ANIMATION_TIMINGS !== 'undefined') ? ANIMATION_TIMINGS.KPI_COUNTER : 1000;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Cubic easeOut
      const currentVal = targetValue * eased;

      const display = decimals > 0
        ? currentVal.toFixed(decimals)
        : Math.round(currentVal).toLocaleString('en-US');

      el.textContent = display + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }

  // Bind All KPIs
  function bindKPIs(kpis) {
    const elements = [
      { id: 'kpiBusinessesVal', subId: 'kpiBusinessesSub', key: 'businesses' },
      { id: 'kpiOwnersVal', subId: 'kpiOwnersSub', key: 'owners' },
      { id: 'kpiReviewsVal', subId: 'kpiReviewsSub', key: 'reviews' },
      { id: 'kpiScansVal', subId: 'kpiScansSub', key: 'scans' },
      { id: 'kpiAiVal', subId: 'kpiAiSub', key: 'aiReviews' },
      { id: 'kpiRatingVal', subId: 'kpiRatingSub', key: 'avgRating' }
    ];

    elements.forEach(cfg => {
      const el = document.getElementById(cfg.id);
      const subEl = document.getElementById(cfg.subId);
      const dataObj = kpis[cfg.key];

      if (el && dataObj) {
        animateCounter(el, dataObj.count);
      }
      if (subEl && dataObj) {
        subEl.innerHTML = dataObj.sub;
      }
    });
  }

  // 2. Render SVG Line / Area Trend Charts
  function renderTrendChart(svgId, lineId, areaId, dotsId, chartTitleId, chartTitleText, dataset) {
    const svg = document.getElementById(svgId);
    const line = document.getElementById(lineId);
    const area = document.getElementById(areaId);
    const dots = document.getElementById(dotsId);
    const titleEl = document.getElementById(chartTitleId);

    if (titleEl) {
      titleEl.textContent = chartTitleText;
    }

    if (!svg || !line || !area || !dots) return;

    // Clear previous dots
    dots.innerHTML = '';

    const data = dataset.data || [];
    const labels = dataset.labels || [];

    const w = 600, h = 240, pad = 30;
    const max = Math.max(...data, 10);
    const min = 0;
    const stepX = (w - pad * 2) / Math.max(data.length - 1, 1);

    const points = data.map((val, i) => {
      const x = pad + i * stepX;
      const y = h - pad - ((val - min) / (max - min)) * (h - pad * 2);
      return [x, y];
    });

    const linePoints = points.map(p => p.join(',')).join(' ');
    const areaPoints = `${pad},${h - pad} ` + linePoints + ` ${w - pad},${h - pad}`;

    line.setAttribute('points', linePoints);
    area.setAttribute('points', areaPoints);

    // Trigger SVG path animation
    const lineLength = line.getTotalLength ? line.getTotalLength() : 1000;
    line.style.strokeDasharray = lineLength;
    line.style.strokeDashoffset = lineLength;
    area.style.opacity = '0';

    requestAnimationFrame(() => {
      line.style.transition = 'stroke-dashoffset 1s ease-out';
      line.style.strokeDashoffset = '0';
      area.style.transition = 'opacity 0.8s ease 0.3s';
      area.style.opacity = '1';
    });

    // Spawn dots on intersection points
    points.forEach(([x, y], i) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', 0);
      dot.setAttribute('fill', svgId.includes('platform') ? '#5B4FE8' : '#10B981');
      dot.style.cursor = 'pointer';

      // Simple hover tooltip indicator
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${labels[i] || ''}: ${data[i]}`;
      dot.appendChild(title);

      dots.appendChild(dot);

      setTimeout(() => {
        dot.style.transition = 'r 0.3s ease';
        dot.setAttribute('r', 5.5);
      }, 700 + i * 80);
    });

    // Update X-axis labels
    const labelsWrap = svg.nextElementSibling;
    if (labelsWrap && labelsWrap.classList.contains('admin-growth-x-labels')) {
      labelsWrap.innerHTML = labels.map(lbl => `<span>${lbl}</span>`).join('');
    }
  }

  // 3. Render Google Review Funnel Steps
  function renderFunnel(funnel) {
    const stages = [
      { id: 'funnelBarScans', valId: 'funnelValScans', val: funnel.scans, total: funnel.scans, pct: 100 },
      { id: 'funnelBarStarted', valId: 'funnelValStarted', val: funnel.started, total: funnel.scans, pct: (funnel.started / funnel.scans) * 100 },
      { id: 'funnelBarCompleted', valId: 'funnelValCompleted', val: funnel.completed, total: funnel.scans, pct: (funnel.completed / funnel.scans) * 100 },
      { id: 'funnelBarSent', valId: 'funnelValSent', val: funnel.sentToGoogle, total: funnel.scans, pct: (funnel.sentToGoogle / funnel.scans) * 100 }
    ];

    stages.forEach(s => {
      const bar = document.getElementById(s.id);
      const valEl = document.getElementById(s.valId);
      const pctEl = document.getElementById(s.id.replace('Bar', 'Pct'));

      if (bar) {
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = `${s.pct}%`;
        }, 200);
      }
      if (valEl) {
        valEl.textContent = s.val.toLocaleString('en-US');
      }
      if (pctEl) {
        pctEl.textContent = `${s.pct.toFixed(1)}%`;
      }
    });

    // Set transition ratios in micro-pills
    const sc2St = document.getElementById('conversionScansToStarted');
    if (sc2St) {
      sc2St.textContent = `${((funnel.started / funnel.scans) * 100).toFixed(1)}% conversion rate`;
    }
    const st2Co = document.getElementById('conversionStartedToCompleted');
    if (st2Co) {
      st2Co.textContent = `${((funnel.completed / funnel.started) * 100).toFixed(1)}% form fill rate`;
    }
    const co2Se = document.getElementById('conversionCompletedToSent');
    if (co2Se) {
      co2Se.textContent = `${((funnel.sentToGoogle / funnel.completed) * 100).toFixed(1)}% sync threshold`;
    }
  }

  // 4. Rating Star Distribution (Row Bars)
  function renderRatingDistribution(ratings) {
    ratings.forEach(r => {
      const pctEl = document.getElementById(`star${r.stars}Pct`);
      const fillEl = document.getElementById(`star${r.stars}Fill`);

      if (pctEl) pctEl.textContent = `${r.percent}%`;
      if (fillEl) {
        fillEl.style.width = '0%';
        setTimeout(() => {
          fillEl.style.width = `${r.percent}%`;
        }, 250);
      }
    });
  }

  // 5. Sentiment Donut Conic-Gradient
  function renderSentiment(sentiment) {
    const donut = document.getElementById('sentimentDonut');
    const valPos = document.getElementById('sentimentValPos');
    const valNeu = document.getElementById('sentimentValNeu');
    const valNeg = document.getElementById('sentimentValNeg');

    if (valPos) valPos.textContent = `${sentiment.positive}%`;
    if (valNeu) valNeu.textContent = `${sentiment.neutral}%`;
    if (valNeg) valNeg.textContent = `${sentiment.negative}%`;

    if (donut) {
      // Draw conic-gradient values
      const posEnd = sentiment.positive;
      const neuEnd = posEnd + sentiment.neutral;

      donut.style.background = `conic-gradient(
        var(--success) 0% ${posEnd}%,
        var(--text-faint) ${posEnd}% ${neuEnd}%,
        var(--danger) ${neuEnd}% 100%
      )`;
    }
  }

  // 6. Business Category Performance List
  function renderCategoryPerformance(categories) {
    const list = document.getElementById('categoryPerformanceList');
    if (!list) return;

    list.innerHTML = categories.map(cat => `
      <div class="admin-progress-row">
        <div class="admin-progress-row-head">
          <span style="font-weight:700; color:var(--text-dark);">${cat.name}</span>
          <span style="color:var(--text-muted); font-size:11.5px;">⭐ ${cat.rating.toFixed(1)} · ${cat.count} reviews</span>
        </div>
        <div class="admin-progress-track">
          <div class="admin-progress-fill" style="width: ${cat.rating * 20}%; background: linear-gradient(90deg, var(--accent), var(--accent-deep));"></div>
        </div>
      </div>
    `).join('');
  }

  // 7. AI Adoption and Keyword Cloud
  function renderAIAndKeywords(aiUsage, keywords) {
    const valGen = document.getElementById('aiValGen');
    const valMod = document.getElementById('aiValMod');
    const valRej = document.getElementById('aiValRej');
    const fillGen = document.getElementById('aiFillGen');
    const fillMod = document.getElementById('aiFillMod');
    const fillRej = document.getElementById('aiFillRej');
    const adoptionRate = document.getElementById('aiAdoptionRate');

    if (valGen) valGen.textContent = aiUsage.generated.toLocaleString('en-US');
    if (valMod) valMod.textContent = aiUsage.modified.toLocaleString('en-US');
    if (valRej) valRej.textContent = aiUsage.rejected.toLocaleString('en-US');
    if (adoptionRate) adoptionRate.textContent = `${aiUsage.rate}%`;

    const total = aiUsage.generated + aiUsage.modified + aiUsage.rejected;
    const genPct = (aiUsage.generated / total) * 100;
    const modPct = (aiUsage.modified / total) * 100;
    const rejPct = (aiUsage.rejected / total) * 100;

    if (fillGen) {
      fillGen.style.width = '0%';
      setTimeout(() => fillGen.style.width = `${genPct}%`, 250);
    }
    if (fillMod) {
      fillMod.style.width = '0%';
      setTimeout(() => fillMod.style.width = `${modPct}%`, 250);
    }
    if (fillRej) {
      fillRej.style.width = '0%';
      setTimeout(() => fillRej.style.width = `${rejPct}%`, 250);
    }

    // Keyword Cloud
    const cloud = document.getElementById('keywordCloud');
    if (cloud && keywords) {
      cloud.innerHTML = keywords.map(kw => `
        <span class="admin-keyword-tag ${kw.type}" title="${kw.count} mentions">${kw.text} (${kw.count})</span>
      `).join('');
    }
  }

  // 8. Lists (Top Performing & Attention Needed)
  function renderLists(topList, attentionList) {
    const topWrap = document.getElementById('topPerformingList');
    const attentionWrap = document.getElementById('attentionList');

    if (topWrap && topList) {
      topWrap.innerHTML = topList.map((item, idx) => `
        <div class="admin-list-card-item">
          <div class="admin-list-item-meta">
            <div class="admin-list-item-avatar">${item.logo}</div>
            <div>
              <div class="admin-list-item-name">${item.name}</div>
              <div class="admin-list-item-sub">Rank #${idx + 1} Business</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; color: var(--text-dark); font-size: 13.5px;">⭐ ${item.rating.toFixed(1)}</div>
            <div style="font-size: 11px; color: var(--text-faint); font-weight: 700;">${item.reviews} reviews</div>
          </div>
        </div>
      `).join('');
    }

    if (attentionWrap && attentionList) {
      attentionWrap.innerHTML = attentionList.map((item) => `
        <div class="admin-list-card-item">
          <div class="admin-list-item-meta">
            <div class="admin-list-item-avatar" style="background: rgba(225,72,63,0.1); color: var(--danger); font-size:14px;">⚠</div>
            <div>
              <div class="admin-list-item-name">${item.name}</div>
              <div class="admin-list-item-sub" style="color:var(--danger); font-weight:700;">${item.issue}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <button class="admin-table-action-btn danger" type="button" style="padding:4px 10px; font-size:11px;" onclick="navigate(ROUTES.ADMIN.BUSINESSES)">Fix</button>
          </div>
        </div>
      `).join('');
    }
  }

  // 9. Peak Hours & City Distribution
  function renderHoursAndCities(peakHours, cities) {
    const hoursWrap = document.getElementById('peakHoursList');
    const citiesWrap = document.getElementById('cityDistributionList');

    if (hoursWrap && peakHours) {
      hoursWrap.innerHTML = peakHours.map(ph => `
        <div class="admin-progress-row">
          <div class="admin-progress-row-head">
            <span>${ph.hour}</span>
            <span>${ph.count} submissions</span>
          </div>
          <div class="admin-progress-track">
            <div class="admin-progress-fill" style="width: ${Math.min(100, (ph.count / 420) * 100)}%; background: linear-gradient(90deg, var(--gold), var(--gold-deep));"></div>
          </div>
        </div>
      `).join('');
    }

    if (citiesWrap && cities) {
      citiesWrap.innerHTML = cities.map(c => `
        <div class="admin-progress-row">
          <div class="admin-progress-row-head">
            <span>${c.city}</span>
            <span>${c.reviews} reviews (${c.share}%)</span>
          </div>
          <div class="admin-progress-track">
            <div class="admin-progress-fill" style="width: ${c.share}%;"></div>
          </div>
        </div>
      `).join('');
    }
  }

  // 10. AI Recommendation text & Comparison
  function renderInsightsAndComparison(aiInsights, comp, periodKey) {
    const insightsText = document.getElementById('aiInsightsText');
    if (insightsText) {
      insightsText.innerHTML = aiInsights;
    }

    const labels = {
      today: 'COMPARED TO YESTERDAY',
      last7days: 'COMPARED TO PREVIOUS WEEK',
      last30days: 'COMPARED TO PREVIOUS MONTH',
      last6months: 'COMPARED TO PREVIOUS 6 MONTHS',
      lastyear: 'COMPARED TO PREVIOUS YEAR',
      custom: 'COMPARED TO BASE PERIOD'
    };

    const labelEl = document.getElementById('compPeriodLabel');
    if (labelEl) {
      labelEl.textContent = labels[periodKey] || 'COMPARED TO PREVIOUS PERIOD';
    }

    // Comparison cells
    const fields = ['Scans', 'Reviews', 'Ai', 'Rating'];
    fields.forEach(f => {
      const valEl = document.getElementById(`comp${f}Val`);
      const diffEl = document.getElementById(`comp${f}Diff`);

      if (valEl && state.currentData && state.currentData.kpis) {
        // Map values
        const keyMap = {
          'Scans': state.currentData.kpis.scans.count,
          'Reviews': state.currentData.kpis.reviews.count,
          'Ai': state.currentData.kpis.aiReviews.count,
          'Rating': state.currentData.kpis.avgRating.count
        };
        const val = keyMap[f];
        valEl.textContent = typeof val === 'number' ? val.toLocaleString('en-US') : val;
      }

      if (diffEl && comp) {
        const diffKey = f.toLowerCase() + 'Diff';
        const diffText = comp[diffKey];
        const isDown = diffText.includes('-');

        diffEl.className = `admin-comparison-diff ${isDown ? 'down' : 'up'}`;
        diffEl.innerHTML = `<span>${isDown ? '↓' : '↑'}</span><span>${diffText}</span>`;
      }
    });
  }

  /* ---------- Switch Period Logic with Loader Mask ---------- */
  function loadPeriodData(periodKey, simulatedCustomData = null) {
    state.currentPeriod = periodKey;

    // Show loaders
    const growthLoader = document.getElementById('growthLoader');
    const reviewsLoader = document.getElementById('reviewsLoader');

    if (growthLoader) growthLoader.classList.add('visible');
    if (reviewsLoader) reviewsLoader.classList.add('visible');

    // Extract target dataset
    const data = simulatedCustomData || platformAnalyticsFilterData[periodKey];
    if (!data) return;

    state.currentData = data;

    // Delay visual rendering slightly to mimic server database queries
    setTimeout(() => {
      // Hide loaders
      if (growthLoader) growthLoader.classList.remove('visible');
      if (reviewsLoader) reviewsLoader.classList.remove('visible');

      // Bind all visual blocks
      bindKPIs(data.kpis);

      renderTrendChart(
        'platformGrowthSvg', 'platformGrowthLine', 'platformGrowthArea', 'platformGrowthDots',
        'growthChartTitle', data.platformGrowth.title, data.platformGrowth
      );

      renderTrendChart(
        'reviewsGrowthSvg', 'reviewsGrowthLine', 'reviewsGrowthArea', 'reviewsGrowthDots',
        'reviewsChartTitle', data.reviewsGrowth.title, data.reviewsGrowth
      );

      renderFunnel(data.funnel);
      renderRatingDistribution(data.ratings);
      renderSentiment(data.sentiment);
      renderCategoryPerformance(data.categories);
      renderAIAndKeywords(data.aiUsage, data.keywords);
      renderLists(data.topBusinesses, data.attentionBusinesses);
      renderHoursAndCities(data.peakHours, data.cities);
      renderInsightsAndComparison(data.aiInsights, data.monthlyComparison, periodKey);

    }, 450);
  }

  /* ---------- Time filter chips ---------- */
  const chips = document.querySelectorAll('#timeFilterChips .admin-chip');
  const customRangePicker = document.getElementById('customRangePicker');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const period = chip.dataset.period;
      if (period === 'custom') {
        if (customRangePicker) customRangePicker.classList.add('visible');
      } else {
        if (customRangePicker) customRangePicker.classList.remove('visible');
        loadPeriodData(period);
      }
    });
  });

  /* ---------- Custom Range simulation ---------- */
  const applyBtn = document.getElementById('applyCustomRangeBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const sDateVal = document.getElementById('startDate').value;
      const eDateVal = document.getElementById('endDate').value;

      if (!sDateVal || !eDateVal) {
        showToast('Please specify a valid start and end date.', { isError: true });
        return;
      }

      const start = new Date(sDateVal);
      const end = new Date(eDateVal);

      if (start > end) {
        showToast('Start date cannot exceed the end date.', { isError: true });
        return;
      }

      // Calculate days in range
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      // Simulate a scaled dataset based on the number of days selected
      // We will clone the last30days dataset and multiply stats relative to 30 days
      const base30 = platformAnalyticsFilterData.last30days;
      const scale = diffDays / 30;

      const simulated = {
        kpis: {
          businesses: { count: Math.max(1, Math.round(base30.kpis.businesses.count * scale)), sub: `+${Math.max(1, Math.round(5 * scale))} in range` },
          owners: { count: Math.max(1, Math.round(base30.kpis.owners.count * Math.min(1, scale))), sub: "Custom access active" },
          reviews: { count: Math.max(2, Math.round(base30.kpis.reviews.count * scale)), sub: `Calculated over ${diffDays} days` },
          scans: { count: Math.max(4, Math.round(base30.kpis.scans.count * scale)), sub: "conversion computed" },
          aiReviews: { count: Math.max(2, Math.round(base30.kpis.aiReviews.count * scale)), sub: `${base30.kpis.aiReviews.sub}` },
          avgRating: { count: base30.kpis.avgRating.count, sub: "Stable customer experience" }
        },
        platformGrowth: {
          labels: ['Start', 'Midpoint', 'End'],
          data: [
            Math.max(1, Math.round(base30.platformGrowth.data[0] * scale)),
            Math.max(1, Math.round(base30.platformGrowth.data[2] * scale)),
            Math.max(1, Math.round(base30.platformGrowth.data[5] * scale))
          ],
          title: `Businesses Registered (${diffDays} Days Range)`
        },
        reviewsGrowth: {
          labels: ['Start', 'Midpoint', 'End'],
          data: [
            Math.max(1, Math.round(base30.reviewsGrowth.data[0] * scale)),
            Math.max(1, Math.round(base30.reviewsGrowth.data[2] * scale)),
            Math.max(1, Math.round(base30.reviewsGrowth.data[5] * scale))
          ],
          title: `Reviews Growth (${diffDays} Days Range)`
        },
        funnel: {
          scans: Math.max(4, Math.round(base30.funnel.scans * scale)),
          started: Math.max(3, Math.round(base30.funnel.started * scale)),
          completed: Math.max(2, Math.round(base30.funnel.completed * scale)),
          sentToGoogle: Math.max(1, Math.round(base30.funnel.sentToGoogle * scale))
        },
        ratings: [...base30.ratings],
        sentiment: { ...base30.sentiment },
        categories: base30.categories.map(c => ({ ...c, count: Math.max(1, Math.round(c.count * scale)) })),
        topBusinesses: [...base30.topBusinesses],
        attentionBusinesses: [...base30.attentionBusinesses],
        aiUsage: {
          generated: Math.max(1, Math.round(base30.aiUsage.generated * scale)),
          modified: Math.max(1, Math.round(base30.aiUsage.modified * scale)),
          rejected: Math.max(1, Math.round(base30.aiUsage.rejected * scale)),
          rate: base30.aiUsage.rate
        },
        keywords: [...base30.keywords],
        peakHours: [...base30.peakHours],
        cities: base30.cities.map(c => ({ ...c, reviews: Math.max(1, Math.round(c.reviews * scale)) })),
        aiInsights: `Custom queries executed for dates <strong>${sDateVal}</strong> to <strong>${eDateVal}</strong>. Platform scans totaled <strong>${Math.round(base30.funnel.scans * scale)}</strong> with an average sync conversion of <strong>${base30.aiUsage.rate}%</strong>. Recommend increasing onboarding campaigns in high-adoption sectors like cafes during this range.`,
        monthlyComparison: {
          prevPeriod: 'Previous custom range',
          scansDiff: scale >= 1 ? '+15.2%' : '-12.4%',
          reviewsDiff: scale >= 1 ? '+12.6%' : '-9.1%',
          aiDiff: scale >= 1 ? '+18.1%' : '-8.5%',
          ratingDiff: '+0.02'
        }
      };

      loadPeriodData('custom', simulated);
      showToast(`Custom range loaded successfully: ${diffDays} days.`);
    });
  }

  /* ---------- Page Header / Footer Actions ---------- */
  function wireAction(id, doneText) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => {
      if (el.classList.contains('is-loading')) return;
      const html = el.innerHTML;
      el.classList.add('is-loading');
      el.innerHTML = `<span class="btn-spinner"></span>Generating...`;
      setTimeout(() => {
        el.classList.remove('is-loading');
        el.innerHTML = html;
        showToast(doneText, { duration: TOAST_DURATION.LONG });
      }, 1200);
    });
  }

  wireAction('exportReportBtnHeader', 'Full Platform report generated and ready for print.');
  wireAction('refreshBtnHeader', 'Platform database query cache cleared. All KPIs up to date.');
  wireAction('exportCsvBtn', 'Platform CSV exported. 245 active records downloaded.');
  wireAction('exportPdfBtn', 'Platform PDF Report compiled successfully.');

  // Refresh All Analytics
  const refreshAllBtn = document.getElementById('refreshDataBtn');
  if (refreshAllBtn) {
    refreshAllBtn.addEventListener('click', () => {
      if (refreshAllBtn.classList.contains('is-loading')) return;
      refreshAllBtn.classList.add('is-loading');
      const orig = refreshAllBtn.innerHTML;
      refreshAllBtn.innerHTML = `<span class="btn-spinner"></span>Re-fetching database streams...`;
      setTimeout(() => {
        refreshAllBtn.classList.remove('is-loading');
        refreshAllBtn.innerHTML = orig;
        loadPeriodData(state.currentPeriod);
        showToast('All widgets, SVG trendlines and AI recommendations refreshed.');
      }, 1500);
    });
  }

  /* ---------- Navigation tabs ---------- */
  document.querySelectorAll('.admin-nav-tab[data-nav]').forEach(tab => {
    if (tab.tagName === 'BUTTON') {
      tab.addEventListener('click', () => {
        showToast('Coming Soon', { duration: TOAST_DURATION.SHORT });
      });
    }
  });

  /* ---------- Logout ---------- */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      navigate('dashboard.html');
    });
  }

  /* ---------- Reveal Animation Observer ---------- */
  const cards = document.querySelectorAll('.admin-kpi-card, .admin-card, .admin-ai-card');
  cards.forEach(c => c.classList.add('reveal-init'));

  const revObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-in');
        revObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => revObserver.observe(c));

  /* ---------- Initial execution ---------- */
  loadPeriodData('last30days');

});