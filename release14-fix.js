/* Release 1.4 polish */

function polishRelease14() {
  const officialLogo = 'https://raw.githubusercontent.com/rselibiomd/dragon-boat-training-builder/main/public/kdbc-logo-official.svg';

  const headerLogo = document.querySelector('.kdbc-logo');
  if (headerLogo) {
    headerLogo.src = officialLogo;
    headerLogo.style.objectFit = 'contain';
    headerLogo.style.background = '#ffffff';
  }

  if (typeof exportState14 !== 'undefined') {
    exportState14.logoUrl = officialLogo;
  }

  const originalDownload = document.getElementById('downloadOriginal14');
  if (originalDownload) originalDownload.remove();

  const loopHeading = document.querySelector('#strokeLoop14 .stroke-loop-heading14 span:not(.beta-badge14)');
  if (loopHeading) loopHeading.textContent = 'Loop one stroke or export only the reviewed range at normal or slow speed.';

  const status = document.getElementById('clipExportStatus14');
  if (status && status.textContent.includes('Video export is encoded')) {
    status.textContent = 'Reviewed-range export is encoded locally in your browser. Support depends on the device/browser.';
  }
}

polishRelease14();
