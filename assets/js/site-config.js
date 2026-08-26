window.SITE_CONFIG = {
  domain: 'https://ducinsights.io.vn',
  cusdisAppId: 'cab9356e-39cd-43fb-bbc3-09b30fe0fe27'
};

(function () {
  const cfg = window.SITE_CONFIG || {};
  const configuredDomain = (cfg.domain || 'https://localhost:5000').replace(/\/+$|\/$/, '');
  const appId = cfg.cusdisAppId || 'cab9356e-39cd-43fb-bbc3-09b30fe0fe27';

  function getBaseDomain() {
    const origin = window.location && window.location.origin && window.location.origin !== 'null'
      ? window.location.origin
      : configuredDomain;

    return origin.replace(/\/+$/, '');
  }

  function getPageMeta() {
    const rawPath = (window.location && window.location.pathname) ? window.location.pathname : '/';
    const normalizedPath = rawPath.replace(/^\/+[A-Za-z]:/, '').replace(/\/+$|\/$/, '') || '/';
    const path = normalizedPath === '/' ? '/' : normalizedPath;
    const lastSegment = path.split('/').filter(Boolean).pop();
    const isHomePage = !lastSegment || lastSegment === 'index.html';
    const pageId = isHomePage ? 'home' : (lastSegment || 'home').replace(/\.html$/, '');
    const pageTitle = document.title
      .replace(/\s*[-–]\s*D-Insights.*$/, '')
      .trim() || 'D-Insights';

    const pageUrl = (window.location.protocol === 'file:' ? configuredDomain : getBaseDomain()) + path;

    return { pageId, pageTitle, pageUrl };
  }

  function ensureCusdis() {
    if (document.getElementById('cusdis_thread')) return;

    const meta = getPageMeta();
    const section = document.createElement('section');
    section.className = 'cusdis-section';
    section.innerHTML = `
      <div class="container">
        <div class="cusdis-section__header">
          <h2 class="cusdis-section__title">Bình luận</h2>
        </div>
        <div
          id="cusdis_thread"
          data-host="https://cusdis.com"
          data-app-id="${appId}"
          data-page-id="${meta.pageId}"
          data-page-url="${meta.pageUrl}"
          data-page-title="${meta.pageTitle}"
        ></div>
      </div>
    `;

    const footer = document.querySelector('site-footer') || document.querySelector('.footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(section, footer);
    } else {
      document.body.appendChild(section);
    }

    const existingScript = document.querySelector('script[src="https://cusdis.com/js/cusdis.es.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = 'https://cusdis.com/js/cusdis.es.js';
      document.body.appendChild(script);
    }
  }

  window.ensureCusdis = ensureCusdis;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureCusdis, { once: true });
  } else {
    ensureCusdis();
  }
})();
