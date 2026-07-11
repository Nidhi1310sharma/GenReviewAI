document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Time Filter Pills ---------- */
  const timeFilterRow = document.getElementById('timeFilterRow');
  if (timeFilterRow) {
    timeFilterRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.time-pill');
      if (!btn) return;
      timeFilterRow.querySelectorAll('.time-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Showing data for ${btn.textContent.trim()}`, { duration: TOAST_DURATION.LONG });
    });
  }

  /* ---------- Animated KPI Counters ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals > 0 ? value.toFixed(decimals) + suffix : Math.round(value) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('.stat-value[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Review Trend SVG Chart ---------- */
  const trendData = [22, 35, 41, 58, 63, 78];
  const trendSvg = document.getElementById('trendSvg');
  const trendLine = document.getElementById('trendLine');
  const trendArea = document.getElementById('trendArea');
  const trendDots = document.getElementById('trendDots');

  if (trendSvg) {
    const w = 600, h = 240, pad = 20;
    const max = Math.max(...trendData);
    const min = 0;
    const stepX = (w - pad * 2) / (trendData.length - 1);

    const points = trendData.map((val, i) => {
      const x = pad + i * stepX;
      const y = h - pad - ((val - min) / (max - min)) * (h - pad * 2);
      return [x, y];
    });

    const linePoints = points.map(p => p.join(',')).join(' ');
    const areaPoints = `${pad},${h - pad} ` + linePoints + ` ${w - pad},${h - pad}`;

    trendLine.setAttribute('points', linePoints);
    trendArea.setAttribute('points', areaPoints);

    const lineLength = trendLine.getTotalLength ? trendLine.getTotalLength() : 1000;
    trendLine.style.strokeDasharray = lineLength;
    trendLine.style.strokeDashoffset = lineLength;
    trendArea.style.opacity = '0';

    requestAnimationFrame(() => {
      trendLine.style.transition = 'stroke-dashoffset 1.3s ease';
      trendLine.style.strokeDashoffset = '0';
      trendArea.style.transition = 'opacity 1s ease 0.4s';
      trendArea.style.opacity = '1';
    });

    points.forEach(([x, y], i) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', 0);
      dot.setAttribute('fill', '#5B4FE8');
      dot.classList.add('trend-dot');
      trendDots.appendChild(dot);
      setTimeout(() => {
        dot.style.transition = 'r 0.3s ease';
        dot.setAttribute('r', 5);
      }, 900 + i * 90);
    });
  }

  /* ---------- Rating Distribution Bars ---------- */
  const ratingRows = document.querySelectorAll('.rating-bar-row');
  const ratingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const row = entry.target;
        const value = parseFloat(row.getAttribute('data-value'));
        const max = parseFloat(row.getAttribute('data-max'));
        const pct = (value / max) * 100;
        const fill = row.querySelector('.rating-bar-fill');
        requestAnimationFrame(() => { fill.style.width = pct + '%'; });
        ratingObserver.unobserve(row);
      }
    });
  }, { threshold: 0.3 });
  ratingRows.forEach(r => ratingObserver.observe(r));

  /* ---------- Sentiment Ring ---------- */
  const ring = document.querySelector('.sentiment-ring-svg');
  if (ring) {
    const r = 80;
    const circumference = 2 * Math.PI * r;
    const segs = [
      { el: ring.querySelector('.ring-positive'), pct: 88 },
      { el: ring.querySelector('.ring-neutral'), pct: 9 },
      { el: ring.querySelector('.ring-negative'), pct: 3 }
    ];
    let offsetAcc = 0;
    segs.forEach(seg => {
      const segLength = (seg.pct / 100) * circumference;
      seg.el.style.strokeDashoffset = -offsetAcc;
      seg.el.style.strokeDasharray = `0 ${circumference}`;
      seg.el.dataset.target = segLength;
      offsetAcc += segLength;
    });
    setTimeout(() => {
      segs.forEach(seg => {
        seg.el.style.transition = 'stroke-dasharray 1.2s ease';
        seg.el.style.strokeDasharray = `${seg.el.dataset.target} ${circumference}`;
      });
    }, 300);
  }

  /* ---------- Category Performance Bars ---------- */
  const categoryRows = document.querySelectorAll('.category-row');
  const categoryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const row = entry.target;
        const pct = row.getAttribute('data-pct');
        const fill = row.querySelector('.category-fill');
        requestAnimationFrame(() => { fill.style.width = pct + '%'; });
        categoryObserver.unobserve(row);
      }
    });
  }, { threshold: 0.3 });
  categoryRows.forEach(r => categoryObserver.observe(r));

  /* ---------- AI Confidence Fill ---------- */
  const aiConfidenceFill = document.getElementById('aiConfidenceFill');
  if (aiConfidenceFill) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => { aiConfidenceFill.style.width = '96%'; });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(aiConfidenceFill);
  }

  /* ---------- Peak Hours Vertical Bars ---------- */
  const peakBars = document.querySelectorAll('.peak-bar-col');
  const maxPeak = Math.max(...Array.from(peakBars).map(b => parseFloat(b.getAttribute('data-value'))));
  const peakObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const col = entry.target;
        const value = parseFloat(col.getAttribute('data-value'));
        const pct = (value / maxPeak) * 100;
        const bar = col.querySelector('.peak-bar');
        requestAnimationFrame(() => { bar.style.height = pct + '%'; });
        peakObserver.unobserve(col);
      }
    });
  }, { threshold: 0.3 });
  peakBars.forEach(b => peakObserver.observe(b));

  /* ---------- Health Score Ring ---------- */
  const healthRing = document.getElementById('healthRingFill');
  if (healthRing) {
    const r = 68;
    const circumference = 2 * Math.PI * r;
    const pct = parseFloat(healthRing.getAttribute('data-pct'));
    healthRing.style.strokeDasharray = `${circumference} ${circumference}`;
    healthRing.style.strokeDashoffset = circumference;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = circumference - (pct / 100) * circumference;
          requestAnimationFrame(() => {
            healthRing.style.transition = 'stroke-dashoffset 1.3s ease';
            healthRing.style.strokeDashoffset = target;
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(healthRing);
  }

  /* ---------- Download Report Buttons ---------- */
  const downloadButtons = document.querySelectorAll('.download-btn');
  const messages = {
    pdf: 'PDF exported successfully.',
    csv: 'CSV exported successfully.',
    email: 'Report emailed successfully.'
  };
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-loading')) return;
      const type = btn.getAttribute('data-report');
      const originalHTML = btn.innerHTML;
      btn.classList.add('is-loading');
      btn.disabled = true;
      btn.innerHTML = `<span class="btn-spinner"></span>Processing...`;

      setTimeout(() => {
        btn.classList.remove('is-loading');
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        showToast(messages[type] || 'Done.', { duration: TOAST_DURATION.LONG });
      }, 1400);
    });
  });

  /* ---------- Reveal-on-scroll for cards/sections ---------- */
  const revealTargets = document.querySelectorAll(
    '.kpi-card, .trend-card, .rating-dist-card, .sentiment-card, .category-card, .ai-insights-hero, .keywords-card, .peak-hours-card, .qr-funnel-card, .comparison-card, .health-score-card, .download-reports-card'
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