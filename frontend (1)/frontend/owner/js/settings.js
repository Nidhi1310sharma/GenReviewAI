/* ==========================================================================
   owner-settings-init.js
   --------------------------------------------------------------------------
   settings.html previously had every field's initial value hardcoded
   (business name, address, AI preferences, etc). This script fills those
   same fields from business-config.js instead, BEFORE owner-settings.js
   (which owns save/reset/validation behaviour and was not part of this
   refactor) attaches its listeners.

   Nothing about the visual state changes: the defaults set here match
   exactly what was previously hardcoded in the HTML.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.business) return;

  const setValue = (id, value) => {
    const el = document.getElementById(id);
    if (el != null && value != null) el.value = value;
  };

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el != null && value != null) el.textContent = value;
  };

  // ---- Header ----
  setText('bizPill', business.name);

  // ---- Section 1: Business Information ----
  setValue('bizName', business.name);
  setValue('bizCategory', business.category);
  setValue('bizDescription', business.description);
  setValue('bizPhone', business.phone);
  setValue('bizEmail', business.email);
  setValue('bizWebsite', business.website);

  // ---- Section 2: Business Address ----
  if (business.address) {
    setValue('addrLine', business.address.line);
    setValue('addrCity', business.address.city);
    setValue('addrState', business.address.state);
    setValue('addrPin', business.address.pin);
    setValue('addrCountry', business.address.country);
  }

  // ---- Section 3: Branding preview ----
  setText('logoPreview', business.logoInitials);
  setText('previewLogo', business.logoInitials);
  setText('previewName', business.name);
  setText('previewCategory', business.category);
  const previewStars = document.getElementById('previewStars');
  if (previewStars) {
    const rounded = Math.round(business.googleRating);
    previewStars.textContent = '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  }

  // ---- Section 4: Google Review Integration ----
  setValue('googleUrl', business.googleReviewUrl);
  setValue('googlePlaceId', business.googlePlaceId);

  // ---- Section 5: AI Review Preferences ----
  const prefs = business.aiPreferences || {};

  const toneInput = document.querySelector(`input[name="reviewTone"][value="${prefs.tone}"]`);
  if (toneInput) toneInput.checked = true;

  const lengthSegment = document.querySelector(`#lengthSegmentedControl .segment[data-value="${prefs.length}"]`);
  if (lengthSegment) {
    document.querySelectorAll('#lengthSegmentedControl .segment').forEach(s => s.classList.remove('active'));
    lengthSegment.classList.add('active');
  }
  setValue('reviewLength', prefs.length);

  const emojiToggle = document.getElementById('emojiToggle');
  if (emojiToggle) emojiToggle.checked = !!prefs.emoji;

  setValue('aiLanguage', prefs.language);

  document.title = `Graphura ReviewFlow | Business Settings`;
});