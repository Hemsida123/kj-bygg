'use strict';
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
function setTheme(theme) {
  root.dataset.theme = theme;
  const light = theme === 'light';
  themeButton.querySelector('.theme-label').textContent = light ? 'Mörkt tema' : 'Ljust tema';
  themeButton.setAttribute('aria-label', light ? 'Växla till mörkt tema' : 'Växla till ljust tema');
  document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#f6f5ef' : '#232922');
}
setTheme('light');
try { const saved = localStorage.getItem('kj-theme-v2'); if (saved === 'light' || saved === 'dark') setTheme(saved); } catch {}
themeButton.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(next); try { localStorage.setItem('kj-theme-v2', next); } catch {}
});
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-nav');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
function closeMenu(restoreFocus = false) {
  menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false');
  main.inert = false; footer.inert = false;
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const willOpen = menu.hidden;
  if (!willOpen) return closeMenu(true);
  menu.hidden = false; menuButton.setAttribute('aria-expanded', 'true');
  main.inert = true; footer.inert = true;
  menu.querySelector('a').focus();
});
menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => {
  if (menu.hidden) return;
  if (e.key === 'Escape') closeMenu(true);
  if (e.key === 'Tab') {
    const list = [menuButton, ...menu.querySelectorAll('a')];
    if (e.shiftKey && document.activeElement === menuButton) { e.preventDefault(); list.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === list.at(-1)) { e.preventDefault(); menuButton.focus(); }
  }
});
matchMedia('(min-width:851px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab, focus = false) {
  tabs.forEach(t => {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected)); t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', e => {
    let index;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') index = (i + 1) % tabs.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length;
    if (e.key === 'Home') index = 0;
    if (e.key === 'End') index = tabs.length - 1;
    if (index !== undefined) { e.preventDefault(); activateTab(tabs[index], true); }
  });
});
const dialog = document.querySelector('.lightbox');
const galleryButtons = [...document.querySelectorAll('[data-lightbox]')];
let pictureIndex = 0;
function showPicture(index) {
  pictureIndex = (index + galleryButtons.length) % galleryButtons.length;
  const button = galleryButtons[pictureIndex];
  const original = button.querySelector('img');
  dialog.querySelector('img').src = original.src;
  dialog.querySelector('img').alt = original.alt;
  dialog.querySelector('figcaption').textContent = button.dataset.caption;
  dialog.querySelector('.lightbox-counter').textContent = `${pictureIndex + 1} / ${galleryButtons.length}`;
}
galleryButtons.forEach((button, index) => button.addEventListener('click', () => {
  showPicture(index);
  dialog.showModal();
}));
dialog.querySelector('.lightbox-prev').addEventListener('click', () => showPicture(pictureIndex - 1));
dialog.querySelector('.lightbox-next').addEventListener('click', () => showPicture(pictureIndex + 1));
dialog.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { e.preventDefault(); showPicture(pictureIndex + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); showPicture(pictureIndex - 1); }
});
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

// Mobile contact actions appear only after the opening has left the viewport.
const quickContact = document.querySelector('.mobile-contact');
const opening = document.querySelector('.hero, .page-intro');
if (opening && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const pastOpening = !entries[0].isIntersecting && entries[0].boundingClientRect.bottom <= 80;
    if (quickContact) quickContact.hidden = !pastOpening;
    document.querySelector('.site-header').classList.toggle('is-scrolled', pastOpening);
  }, { rootMargin: '-80px 0px 0px 0px' });
  observer.observe(opening);
}
