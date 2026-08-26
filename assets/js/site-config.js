window.SITE_CONFIG = {
  domain: 'https://ducinsights.io.vn',
  commentBoxProjectId: ''
};

(function () {
  const cfg = window.SITE_CONFIG || {};
  const configuredDomain = (cfg.domain || 'https://ducinsights.io.vn').replace(/\/+$/, '');

  window.getConfiguredDomain = function getConfiguredDomain() {
    return configuredDomain;
  };
})();
