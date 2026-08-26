class SiteHeader extends HTMLElement {
  connectedCallback() {
    const rootPath = this.getAttribute('root-path') || '';

    this.innerHTML = `
      <header class="header" id="site-header">
        <div class="container header__inner">
          <a href="${rootPath}index.html" class="logo">D-Insights</a>

          <button type="button" class="header__search-mobile" aria-label="Tìm kiếm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
          </button>

          <div class="hamburger" id="hamburger" aria-label="Mở menu">
            <span class="hamburger__line"></span>
            <span class="hamburger__line"></span>
            <span class="hamburger__line"></span>
          </div>
          <nav class="nav" id="nav">
            <ul class="nav__list">
              <li><a href="${rootPath}index.html" class="nav__link">Trang chủ</a></li>
              <li><a href="${rootPath}category/doi-song.html" class="nav__link">Đời sống</a></li>
              <li><a href="${rootPath}category/cong-nghe.html" class="nav__link">Công nghệ</a></li>
              <li><a href="${rootPath}category/am-thuc.html" class="nav__link">Ẩm thực</a></li>
              <li><a href="${rootPath}category/du-lich.html" class="nav__link">Du lịch</a></li>
              <li><a href="${rootPath}category/tro-choi.html" class="nav__link">Trò chơi</a></li>
              <li><a href="${rootPath}q-a.html" class="nav__link">Hỏi đáp</a></li>
              <li>
                <button type="button" class="nav__search" aria-label="Tìm kiếm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
                </button>
              </li>
            </ul>
          </nav>
          <div class="nav-overlay" id="nav-overlay"></div>
        </div>
      </header>

      <div class="search-modal" id="search-modal" aria-hidden="true">
        <div class="search-modal__inner" role="dialog" aria-modal="true" aria-label="Tìm kiếm bài viết">
          <div class="search-modal__header">
            <input type="text" class="search-modal__input" placeholder="Tìm bài viết, chủ đề, từ khóa..." aria-label="Tìm kiếm bài viết">
            <button type="button" class="search-modal__close" aria-label="Đóng tìm kiếm">✕</button>
          </div>
          <div class="search-modal__results" aria-live="polite"></div>
        </div>
      </div>
    `;

    this.initActiveNav();
    this.initSearch();
  }

  initSearch() {
    const rootPath = this.getAttribute('root-path') || '';
    const searchButtons = this.querySelectorAll('.nav__search, .header__search-mobile');
    const modal = this.querySelector('.search-modal');
    const input = this.querySelector('.search-modal__input');
    const closeButton = this.querySelector('.search-modal__close');
    const resultsContainer = this.querySelector('.search-modal__results');

    if (!searchButtons.length || !modal || !input || !closeButton || !resultsContainer) return;

    const renderResults = (query) => {
      const normalized = query.trim().toLowerCase();
      const posts = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : [];

      if (!normalized) {
        resultsContainer.innerHTML = '<div class="search-result__meta">Nhập từ khóa để tìm bài viết bạn muốn đọc.</div>';
        return;
      }

      const filteredPosts = posts.filter((post) => {
        const searchableText = [
          post.title,
          post.excerpt,
          post.categoryName,
          post.categorySlug,
          post.slug
        ].join(' ').toLowerCase();

        return searchableText.includes(normalized);
      });

      if (!filteredPosts.length) {
        resultsContainer.innerHTML = '<div class="search-result__meta">Không tìm thấy bài viết phù hợp.</div>';
        return;
      }

      resultsContainer.innerHTML = filteredPosts.map(post => `
        <a href="${rootPath}posts/${post.slug}.html" class="search-result">
          <div class="search-result__title">${post.title}</div>
          <div class="search-result__meta">${post.categoryName} • ${post.date} • ${post.readingTime} phút đọc</div>
        </a>
      `).join('');
    };

    const closeModal = () => {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      input.value = '';
      renderResults('');
      input.blur();
    };

    const openModal = () => {
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      setTimeout(() => input.focus(), 50);
      renderResults(input.value);
    };

    searchButtons.forEach((button) => {
      button.addEventListener('click', openModal);
    });

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
    input.addEventListener('input', (event) => {
      renderResults(event.target.value);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    renderResults('');
  }

  initActiveNav() {
    const currentPath = window.location.pathname;
    const links = this.querySelectorAll('.nav__link');

    const isHome = currentPath.endsWith('/') || currentPath.endsWith('index.html');

    if (isHome) {
      links[0].classList.add('nav__link--active');
    } else {
      links.forEach(link => {
        const href = link.getAttribute('href');
        const normalizedHref = href.replace('../', '');
        if (currentPath.endsWith(normalizedHref)) {
          link.classList.add('nav__link--active');
        }
      });
    }
  }

}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const rootPath = this.getAttribute('root-path') || '';

    this.innerHTML = `
      <footer class="footer" id="site-footer">
        <div class="container">
          <div class="footer__grid">
            <div>
              <h4 class="footer__heading">D-Insights</h4>
              <p class="footer__text">Nơi chia sẻ kiến thức, cảm hứng và những câu chuyện thú vị về cuộc sống, công nghệ, ẩm thực và du lịch. Viết bởi Đức Nguyễn.</p>
            </div>
            <div>
              <h4 class="footer__heading">Chuyên mục</h4>
              <ul class="footer__list">
                <li><a href="${rootPath}category/doi-song.html" class="footer__link">Đời sống</a></li>
                <li><a href="${rootPath}category/cong-nghe.html" class="footer__link">Công nghệ</a></li>
                <li><a href="${rootPath}category/am-thuc.html" class="footer__link">Ẩm thực</a></li>
                <li><a href="${rootPath}category/du-lich.html" class="footer__link">Du lịch</a></li>
                <li><a href="${rootPath}category/tro-choi.html" class="footer__link">Trò chơi</a></li>
                <li><a href="${rootPath}q-a.html" class="footer__link">Hỏi đáp</a></li>
              </ul>
            </div>
            <div>
              <h4 class="footer__heading">Kết nối</h4>
              <div class="footer__social">
                <a href="https://www.facebook.com/dinh.duc.5203141/" class="footer__social-link" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></a>
                <a href="https://github.com/ducn03" class="footer__social-link" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg></a>
              </div>
            </div>
          </div>
          <div class="footer__bottom">
            <p>© 2026 D-Insights. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

class PostGrid extends HTMLElement {
  connectedCallback() {
    const rootPath = this.getAttribute('root-path') || '';
    const category = this.getAttribute('category') || 'all';

    let postsToRender = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : [];
    if (category !== 'all') {
      postsToRender = postsToRender.filter(p => p.categorySlug === category);
    }

    if (postsToRender.length === 0) {
      this.innerHTML = `
        <div class="empty-state" aria-live="polite">
          <svg class="empty-state__illustration" viewBox="0 0 160 120" aria-hidden="true">
            <rect x="24" y="20" width="84" height="72" rx="8" fill="none" stroke="currentColor" stroke-width="2.5"/>
            <path d="M48 36h36M48 50h28M48 64h32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="110" cy="52" r="16" fill="none" stroke="currentColor" stroke-width="2.5"/>
            <path d="M110 38v14M103 52h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M110 80l18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M32 94h60" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <h3 class="empty-state__title">Chưa có bài viết nào</h3>
          <p class="empty-state__text">Cùng quay lại sau để xem những chia sẻ mới nhất nhé.</p>
        </div>
      `;
      return;
    }

    const cardsHtml = postsToRender.map(post => {
      // Phần ảnh là optional
      const coverHtml = post.cover
        ? `<div class="card__cover-wrap">
             <span class="pill pill--${post.categorySlug} card__pill">${post.categoryName}</span>
             <img src="${rootPath}${post.cover}" alt="${post.title}" class="card__cover">
           </div>`
        : `<div style="padding: var(--sp-4) var(--sp-5) 0;">
             <span class="pill pill--${post.categorySlug}">${post.categoryName}</span>
           </div>`;

      return `
        <article class="card" id="card-${post.slug}">
          ${coverHtml}
          <div class="card__body">
            <h3 class="card__title"><a href="${rootPath}posts/${post.slug}.html">${post.title}</a></h3>
            <p class="card__excerpt">${post.excerpt}</p>
            <div class="card__meta">
              <span>🕐 ${post.date}</span>
              <span class="card__meta-dot"></span>
              <span>${post.readingTime} phút đọc</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    this.innerHTML = `<div class="card-grid">${cardsHtml}</div>`;
  }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
customElements.define('post-grid', PostGrid);
