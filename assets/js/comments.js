(function () {
  const config = window.SITE_CONFIG || {};
  const projectId = String(config.commentBoxProjectId || '').trim();

  function getPageBoxId() {
    const path = window.location.pathname.replace(/\/+$/, '');
    const pageName = path.split('/').pop() || 'home';
    return pageName.replace(/\.html$/i, '') || 'home';
  }

  function getSectionTitle() {
    return getPageBoxId() === 'q-a' ? 'Góc hỏi đáp' : 'Góc bình luận';
  }

  function updateCommentCount(count) {
    const countElement = document.querySelector('.comments-section__count');
    if (countElement) countElement.textContent = `(${count})`;
  }

  function updateCardCommentCount(slug, count) {
    const countElement = document.querySelector(`[data-comment-count-for="${slug}"]`);
    if (countElement) countElement.textContent = `${count} bình luận`;
  }

  function getCanonicalUrl(slug, boxId, pageLocation) {
    const configuredDomain = String(config.domain || window.location.origin).replace(/\/+$/, '');
    const canonicalUrl = new URL(pageLocation.href);
    const configuredUrl = new URL(configuredDomain + `/posts/${slug}.html`);
    configuredUrl.hash = boxId;
    return configuredUrl.href;
  }

  function loadCardCommentCounts() {
    document.querySelectorAll('[data-comment-count-for]').forEach((countElement) => {
      const slug = countElement.getAttribute('data-comment-count-for');
      const source = document.createElement('div');
      const sourceClass = `commentbox-count-${slug}`;
      source.className = `commentbox-count-source ${sourceClass}`;
      source.setAttribute('aria-hidden', 'true');
      document.body.appendChild(source);
      window.commentBox(projectId, {
        className: sourceClass,
        defaultBoxId: slug,
        sortOrder: 'newest',
        backgroundColor: '#FFFBFE',
        textColor: '#241F2B',
        subtextColor: '#4A4552',
        onCommentCount: (count) => updateCardCommentCount(slug, count),
        createBoxUrl: (boxId, pageLocation) => getCanonicalUrl(slug, boxId, pageLocation)
      });
    });
  }

  function getCommentBoxOptions() {
    return {
      defaultBoxId: getPageBoxId(),
      sortOrder: 'newest',
      backgroundColor: '#FFFBFE',
      textColor: '#241F2B',
      subtextColor: '#4A4552',
      tlcParam: 'comment',
      onCommentCount: updateCommentCount,
      createBoxUrl(boxId, pageLocation) {
        const configuredDomain = String(config.domain || window.location.origin).replace(/\/+$/, '');
        const canonicalUrl = new URL(pageLocation.href);
        const configuredUrl = new URL(configuredDomain + canonicalUrl.pathname);
        configuredUrl.hash = boxId;
        return configuredUrl.href;
      }
    };
  }

  function loadCommentBox() {
    const footer = document.querySelector('site-footer');
    if (!document.querySelector('.comments-section')) {
      const section = document.createElement('section');
      section.className = 'comments-section';
      section.setAttribute('aria-labelledby', 'comments-title');
      section.innerHTML = `
        <div class="container">
          <h2 id="comments-title" class="comments-section__title">
            ${getSectionTitle()} <span class="comments-section__count" aria-live="polite"></span>
          </h2>
          <div class="commentbox"></div>
        </div>
      `;

      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(section, footer);
      } else {
        document.body.appendChild(section);
      }
    }

    if (!projectId || projectId === 'YOUR_COMMENTBOX_PROJECT_ID') {
      const box = document.querySelector('.commentbox');
      if (box) {
        box.innerHTML = '<p class="comments-section__notice">CommentBox chưa được cấu hình. Hãy thêm Project ID vào assets/js/site-config.js.</p>';
      }
      return;
    }

    if (typeof window.commentBox === 'function') {
      loadCardCommentCounts();
      window.commentBox(projectId, getCommentBoxOptions());
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/commentbox.io/dist/commentBox.min.js';
    script.async = true;
    script.onload = function () {
      if (typeof window.commentBox === 'function') {
        loadCardCommentCounts();
        window.commentBox(projectId, getCommentBoxOptions());
      }
    };
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCommentBox, { once: true });
  } else {
    loadCommentBox();
  }
})();
