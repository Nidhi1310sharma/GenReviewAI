/* ==========================================================================
   utils.js
   --------------------------------------------------------------------------
   Centralized, reusable helper functions shared across customer, owner and
   admin pages. Nothing here is page-specific — if a helper only makes sense
   on one page, it should stay in that page's own JS file.

   Every page that needs one of these should include this file (after
   business-config.js, before its own page script) instead of redefining
   the helper locally.
   ========================================================================== */

/**
 * Show a toast message using the page's #toast element.
 * Every page already renders <div id="toast" class="toast"></div>, and
 * toggles a "visible" class on it — this just centralizes that behavior.
 *
 * @param {string} message - Text to display.
 * @param {Object} [options]
 * @param {boolean} [options.isError=false] - Adds a "toast-error" class while visible.
 * @param {number} [options.duration=2600] - Milliseconds before the toast hides.
 */
function showToast(message, options = {}) {
  const defaultDuration = (typeof TOAST_DURATION !== 'undefined') ? TOAST_DURATION.DEFAULT : 2600;
  const { isError = false, duration = defaultDuration } = options;
  const toast = document.getElementById('toast');
  if (!toast) return;

  if (!showToast._timers) showToast._timers = new WeakMap();
  clearTimeout(showToast._timers.get(toast));

  toast.textContent = message;
  toast.classList.toggle('toast-error', isError);
  toast.classList.remove('visible');
  void toast.offsetWidth; // restart CSS transition if toast is triggered again quickly
  toast.classList.add('visible');

  const timer = setTimeout(() => toast.classList.remove('visible'), duration);
  showToast._timers.set(toast, timer);
}

/**
 * Navigate the browser to another page.
 * @param {string} url - Relative or absolute URL to go to.
 */
function navigate(url) {
  window.location.href = url;
}

/**
 * Copy text to the clipboard.
 * @param {string} text
 * @returns {Promise<boolean>} resolves true on success, false on failure.
 */
function copyToClipboard(text) {
  return navigator.clipboard.writeText(text).then(
    () => true,
    () => false
  );
}

/**
 * Trigger a browser download for a Blob/URL.
 * @param {string} url - Object URL or direct link to download.
 * @param {string} filename - Suggested filename for the download.
 */
function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format a Date object into a readable string.
 * @param {Date} date
 * @param {Object} [options] - Overrides for Intl.DateTimeFormat options.
 * @returns {string}
 */
function formatDate(date, options = {}) {
  const defaults = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', { ...defaults, ...options });
}

/**
 * Generate a placeholder business ID in the BUSxxx format used across
 * the mock data (e.g. "BUS001", "BUS002").
 * @param {number} [n] - Sequence number. Random if omitted.
 * @returns {string}
 */
function generateBusinessId(n) {
  const seq = n != null ? n : Math.floor(Math.random() * 900) + 100;
  return `BUS${String(seq).padStart(3, '0')}`;
}

/**
 * Await for a given number of milliseconds. Useful for simulating
 * network/API latency in front-end-only mock flows.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Expose globally since the project currently has no bundler/module system.
window.showToast = showToast;
window.navigate = navigate;
window.copyToClipboard = copyToClipboard;
window.downloadFile = downloadFile;
window.formatDate = formatDate;
window.generateBusinessId = generateBusinessId;
window.sleep = sleep;
