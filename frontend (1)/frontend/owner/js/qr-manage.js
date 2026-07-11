document.addEventListener('DOMContentLoaded', () => {

  // ===== Business-driven values (replaces hardcoded constants) =====
  const REVIEW_LINK = window.business ? business.reviewLink : 'https://graphura.ai/r/cafe-aroma';
  const QR_FILENAME_BASE = window.business ? business.id.toLowerCase() : 'business';

  function buildQrUrl(size, data) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&color=14141F&bgcolor=FFFFFF&data=${encodeURIComponent(data)}`;
  }

  // ===== Populate business info card + header pill + mockups =====
  const qrImage = document.getElementById('qrImage');

  if (window.business) {
    const bizPill = document.getElementById('bizPill');
    const qrBizName = document.getElementById('qrBizName');
    const qrBizCategory = document.getElementById('qrBizCategory');
    const qrBizId = document.getElementById('qrBizId');
    const qrBizLink = document.getElementById('qrBizLink');
    const mockupPosterBrand = document.getElementById('mockupPosterBrand');

    if (bizPill) bizPill.textContent = `${business.name} · ${business.category}`;
    if (qrBizName) qrBizName.textContent = business.name;
    if (qrBizCategory) qrBizCategory.textContent = business.category;
    if (qrBizId) qrBizId.textContent = business.id;
    if (qrBizLink) qrBizLink.textContent = business.reviewLink;
    if (mockupPosterBrand) mockupPosterBrand.textContent = business.name;

    document.title = `Graphura ReviewFlow | QR Code Management`;
  }

  if (qrImage) qrImage.src = buildQrUrl('280x280', REVIEW_LINK);

  const mockupQr1 = document.getElementById('mockupQr1');
  const mockupQr2 = document.getElementById('mockupQr2');
  const mockupQr3 = document.getElementById('mockupQr3');
  if (mockupQr1) mockupQr1.src = buildQrUrl('90x90', REVIEW_LINK);
  if (mockupQr2) mockupQr2.src = buildQrUrl('110x110', REVIEW_LINK);
  if (mockupQr3) mockupQr3.src = buildQrUrl('70x70', REVIEW_LINK);

  // ===== Generate New QR =====
  const generateQrBtn = document.getElementById('generateQrBtn');
  const qrLoadingOverlay = document.getElementById('qrLoadingOverlay');

  if (generateQrBtn) {
    generateQrBtn.addEventListener('click', () => {
      generateQrBtn.disabled = true;
      qrLoadingOverlay.hidden = false;
      qrImage.style.opacity = '0.15';

      setTimeout(() => {
        const randomSeed = Math.floor(Math.random() * 100000);
        qrImage.src = `${buildQrUrl('280x280', REVIEW_LINK)}&ref=${randomSeed}`;
        qrImage.style.opacity = '1';
        qrLoadingOverlay.hidden = true;
        generateQrBtn.disabled = false;
        showToast('New QR generated successfully.');
      }, 2000);
    });
  }

  // ===== Download PNG (simulated) =====
  const downloadPngBtn = document.getElementById('downloadPngBtn');
  if (downloadPngBtn) {
    downloadPngBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = qrImage.src;
      link.download = `${QR_FILENAME_BASE}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('QR Code downloaded as PNG.');
    });
  }

  // ===== Download SVG (simulated) =====
  const downloadSvgBtn = document.getElementById('downloadSvgBtn');
  if (downloadSvgBtn) {
    downloadSvgBtn.addEventListener('click', () => {
      const label = window.business ? `${business.name} QR Placeholder` : 'QR Placeholder';
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280"><rect width="280" height="280" fill="#FFFFFF"/><text x="50%" y="50%" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#14141F">${label}</text></svg>`;
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${QR_FILENAME_BASE}-qr-code.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('QR Code downloaded as SVG.');
    });
  }

  // ===== Print QR =====
  const printQrBtn = document.getElementById('printQrBtn');
  if (printQrBtn) {
    printQrBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ===== Copy Review Link =====
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      copyToClipboard(REVIEW_LINK).then((success) => {
        showToast(success ? 'Review link copied.' : 'Unable to copy link.');
      });
    });
  }

});