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

});
