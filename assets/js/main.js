/**
 * main.js — Mobile menu toggle + header scroll state
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.nav-overlay');

  // ─── Hamburger toggle ───
  if (hamburger && nav && overlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      hamburger.classList.toggle('is-active', isOpen);
      overlay.classList.toggle('is-visible', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    overlay.addEventListener('click', () => {
      nav.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      overlay.classList.remove('is-visible');
      document.body.style.overflow = '';
    });
  }

  // ─── Sticky header border on scroll ───
  if (header) {
    const onScroll = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const CUSDIS_APP_ID = 'cab9356e-39cd-43fb-bbc3-09b30fe0fe27';

  const initCusdis = () => {
    if (!CUSDIS_APP_ID) {
      return;
    }

    if (document.getElementById('cusdis_thread')) {
      return;
    }

    const isHomePage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
    const pageId = isHomePage ? 'home' : (window.location.pathname.split('/').pop() || 'page').replace(/\.html$/, '');
    const pageTitle = document.title || 'D-Insights';
    const pageUrl = window.location.origin && window.location.origin !== 'null'
      ? window.location.href
      : 'https://dinsights.example.com' + window.location.pathname;

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
          data-app-id="${CUSDIS_APP_ID}"
          data-page-id="${pageId}"
          data-page-url="${pageUrl}"
          data-page-title="${pageTitle}"
        ></div>
      </div>
    `;

    const footer = document.querySelector('site-footer');
    if (footer) {
      footer.parentNode.insertBefore(section, footer);
    } else {
      document.body.appendChild(section);
    }

    if (!document.querySelector('script[src="https://cusdis.com/js/cusdis.es.js"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = 'https://cusdis.com/js/cusdis.es.js';
      document.body.appendChild(script);
    }
  };

  initCusdis();
});
