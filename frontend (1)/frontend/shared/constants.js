/* ==========================================================================
   constants.js
   --------------------------------------------------------------------------
   Centralized, reusable constants shared across customer, owner, and admin
   pages: page routes, role names, status enums, and shared timing values.
   Nothing here is page-specific business data (that lives in mock-data.js)
   or config for the current business (that lives in business-config.js).
   ========================================================================== */

/* ---------- Routes ----------
   Filenames only (each role's HTML files all live in that role's own
   folder, so pages within a role link to each other with a bare filename,
   e.g. window.location.href = ROUTES.OWNER.SETTINGS). */
const ROUTES = {
  CUSTOMER: {
    LANDING: 'landing.html',
    TAGS: 'tags.html',
    RATING: 'rating.html',
    REVIEW: 'review.html',
    FEEDBACK: 'feedback.html',
    THANKYOU: 'thankyou.html'
  },
  OWNER: {
    LOGIN: 'login.html',
    DASHBOARD: 'dashboard.html',
    SETTINGS: 'settings.html',
    QR_MANAGE: 'qr-manage.html',
    REVIEWS: 'reviews.html',
    ANALYTICS: 'analytics.html'
  },
  ADMIN: {
    LOGIN: 'login.html',
    DASHBOARD: 'dashboard.html',
    BUSINESSES: 'businesses.html',
    OWNERS: 'owners.html',
    REVIEWS: 'reviews.html'
  }
};

/* ---------- Role Names ---------- */
const ROLES = {
  CUSTOMER: 'customer',
  OWNER: 'owner',
  ADMIN: 'admin'
};

/* ---------- Business Status ---------- */
const BUSINESS_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
};

/* ---------- Review Status / Sentiment ---------- */
const REVIEW_SENTIMENT = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative'
};

const REVIEW_STATUS = {
  PUBLISHED: 'published',
  REPLIED: 'replied',
  DELETED: 'deleted'
};

/* ---------- Rating Threshold ----------
   Matches business.threshold in business-config.js: reviews at or above
   this star rating are routed to the public AI review flow, below it to
   private feedback. Kept here as the documented default/fallback. */
const DEFAULT_RATING_THRESHOLD = 4;

/* ---------- Colors ----------
   Source of truth for color values is shared/shared.css (CSS custom
   properties on :root). This map only documents which CSS variable to
   reach for — it intentionally does not hardcode hex values so the two
   never drift out of sync. Use getComputedStyle if a color is ever
   needed from JS. */
const CSS_COLOR_VARS = {
  ACCENT: '--accent',
  GOLD: '--gold',
  SUCCESS: '--success',
  DANGER: '--danger',
  TEXT_DARK: '--text-dark',
  TEXT_MUTED: '--text-muted'
};

/* ---------- Storage Keys ---------- */
const STORAGE_KEYS = {
  FINAL_RATING: 'finalRating',
  TAGS_FEEDBACK: 'tagsFeedback'
};

/* ---------- Toast Duration (ms) ----------
   Defaults match what each page already used before centralization. */
const TOAST_DURATION = {
  DEFAULT: 2600,
  SHORT: 2400,
  LONG: 2800
};

/* ---------- Animation Timings (ms) ---------- */
const ANIMATION_TIMINGS = {
  KPI_COUNTER: 1400,
  TREND_LINE_DRAW: 1300,
  TREND_DOT_STAGGER: 90,
  TOAST_FADE: 300
};

// Expose globally since the project currently has no bundler/module system.
window.ROUTES = ROUTES;
window.ROLES = ROLES;
window.BUSINESS_STATUS = BUSINESS_STATUS;
window.REVIEW_SENTIMENT = REVIEW_SENTIMENT;
window.REVIEW_STATUS = REVIEW_STATUS;
window.DEFAULT_RATING_THRESHOLD = DEFAULT_RATING_THRESHOLD;
window.CSS_COLOR_VARS = CSS_COLOR_VARS;
window.STORAGE_KEYS = STORAGE_KEYS;
window.TOAST_DURATION = TOAST_DURATION;
window.ANIMATION_TIMINGS = ANIMATION_TIMINGS;
