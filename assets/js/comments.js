(function () {
  const config = window.SITE_CONFIG || {};
  const projectId = String(config.commentBoxProjectId || '').trim();

  function getPageBoxId() {
    const path = window.location.pathname.replace(/\/+$/, '');
    const pageName = path.split('/').pop() || 'home';
    return pageName.replace(/\.html$/i, '') || 'home';
  }

  function loadCommentBox() {
    const footer = document.querySelector('site-footer');
    if (!document.querySelector('.comments-section')) {
      const section = document.createElement('section');
      section.className = 'comments-section';
      section.setAttribute('aria-labelledby', 'comments-title');
      section.innerHTML = `
        <div class="container">
          <h2 id="comments-title" class="comments-section__title">Góc bình luận</h2>
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
      window.commentBox(projectId, {
        defaultBoxId: getPageBoxId(),
        sortOrder: 'newest',
        backgroundColor: 'transparent',
        textColor: '#302b38',
        subtextColor: '#6c6472',
        tlcParam: 'comment'
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/commentbox.io/dist/commentBox.min.js';
    script.async = true;
    script.onload = function () {
      if (typeof window.commentBox === 'function') {
        window.commentBox(projectId, {
          defaultBoxId: getPageBoxId(),
          sortOrder: 'newest',
          backgroundColor: 'transparent',
          textColor: '#302b38',
          subtextColor: '#6c6472',
          tlcParam: 'comment'
        });
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
