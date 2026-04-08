/* ═══════════════════════════════════════════════════
   NJ SAREE DRAPIST — Multi-Page App Script
   Handles: navigation, scroll effects, animations,
   reviews, instagram grid, portfolio filters, lightbox,
   and bridal gallery (dynamic from Cloudinary).
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Utility ─── */
  function qs(selector, parent) { return (parent || document).querySelector(selector); }
  function qsa(selector, parent) { return Array.from((parent || document).querySelectorAll(selector)); }
  function escapeHtml(text) {
    const el = document.createElement('span');
    el.textContent = text;
    return el.innerHTML;
  }

  /* ─── Smooth Scroll for Anchor Links ─── */
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const navbarHeight = qs('#navbar')?.offsetHeight || 70;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu if open
      const hamburger = qs('#navHamburger');
      const navMenu = qs('#navMenu');
      if (hamburger && navMenu) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('mobile-open');
      }
    }
  });

  /* ─── Active Nav Highlight on Scroll (Home page) ─── */
  const isHome = window.location.pathname === '/' || window.location.pathname === '/home.html';
  if (isHome) {
    const sections = qsa('section[id]');
    const navLinks = qsa('.nav-link');

    function updateActiveNav() {
      const scrollY = window.scrollY + 120;
      let current = '';
      sections.forEach(section => {
        if (section.offsetTop <= scrollY) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}` || (current === 'home' && href === '#home')) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  /* ─── Sticky Navbar ─── */
  const navbar = qs('#navbar');
  if (navbar) {
    if (!isHome) {
      navbar.classList.add('scrolled');
    }
    window.addEventListener('scroll', () => {
      if (isHome) {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      }
    }, { passive: true });

    // Hamburger
    const hamburger = qs('#navHamburger');
    const navMenu = qs('#navMenu');
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('mobile-open');
      });
      // Close on link click
      qsa('.nav-link', navMenu).forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          navMenu.classList.remove('mobile-open');
        });
      });
    }
  }

  /* ─── Scroll Animations ─── */
  const animatedEls = qsa('.animate-on-scroll');
  if (animatedEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animatedEls.forEach(el => observer.observe(el));
  } else {
    animatedEls.forEach(el => el.classList.add('visible'));
  }

  /* ─── Portfolio Filter & Lightbox ─── */
  const portfolioGrid = qs('#portfolioGrid');
  if (portfolioGrid) {
    const formatCategory = (cat) => {
        const map = { 
          'south-indian': 'South Indian', 
          'madisar': 'Madisar', 
          'bengali': 'Bengali', 
          'gujarati': 'Gujarati', 
          'kerala-mundu': 'Kerala Mundu', 
          'half-saree': 'Half Saree', 
          'nauvari': 'Nauvari', 
          'dhoti': 'Dhoti Style', 
          'fusion': 'Fusion', 
          'pre-pleated': 'Pre-Pleated', 
          'dupatta': 'Dupatta Draping', 
          'groom-dhoti': "Groom's Dhoti",
          'guest': 'Guest Draping' 
        };
        return map[cat] || cat;
    };

    const categoryDescriptions = {
      'south-indian': 'Traditional and elegant drapes featuring Kanchipuram and Silk sarees',
      'madisar': 'Authentic Brahmin style 9-yard saree draping for rituals and traditions',
      'bengali': "The iconic 'Atpoure' drape with classic box pleats and a regal look",
      'gujarati': 'Front pallu styles including Seedha Pallu and traditional Gadhwal',
      'kerala-mundu': 'Graceful Kasavu Mundu Neriyathum drapes for a serene ethnic look',
      'half-saree': 'Langa Voni and Dhavani styles for youthful and vibrant celebrations',
      'nauvari': 'Traditional Maharashtrian 9-yard drape for a bold cultural statement',
      'dhoti': 'Modern dhoti-style saree drapes for a trendy fusion appearance',
      'fusion': 'Innovative and contemporary draping for modern brides and fashionistas',
      'pre-pleated': 'Professional pre-pleating and box folding for a stress-free experience',
      'dupatta': 'Creative dupatta and veil draping for Lehengas and festive wear',
      'groom-dhoti': "Specialized dhoti and veshti draping for the elegant groom",
      'guest': 'Elegant saree and lehenga styling for wedding guests and family members'
    };

    // Read category from URL query param
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    // Update page hero title if category is specified
    if (categoryFromUrl) {
      const pageTitle = qs('#portfolioPageTitle');
      const pageSubtitle = qs('#portfolioPageSubtitle');
      const backLink = qs('#portfolioBackLink');

      if (pageTitle) pageTitle.textContent = formatCategory(categoryFromUrl) + ' Collection';
      if (pageSubtitle) pageSubtitle.textContent = categoryDescriptions[categoryFromUrl] || 'Browse our curated collection';
      if (backLink) backLink.style.display = 'block';
    }

    // Filter buttons
    qsa('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        qsa('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        qsa('.portfolio-item').forEach(item => {
          item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
        });

        // Update URL without reload
        const newUrl = filter === 'all' 
          ? window.location.pathname 
          : window.location.pathname + '?category=' + filter;
        window.history.replaceState({}, '', newUrl);

        // Update title
        const pageTitle = qs('#portfolioPageTitle');
        const pageSubtitle = qs('#portfolioPageSubtitle');
        const backLink = qs('#portfolioBackLink');

        if (filter === 'all') {
          if (pageTitle) pageTitle.textContent = 'Bridal Portfolio';
          if (pageSubtitle) pageSubtitle.textContent = 'A curated collection of our finest bridal draping artistry';
          if (backLink) backLink.style.display = 'none';
        } else {
          if (pageTitle) pageTitle.textContent = formatCategory(filter) + ' Collection';
          if (pageSubtitle) pageSubtitle.textContent = categoryDescriptions[filter] || 'Browse our curated collection';
          if (backLink) backLink.style.display = 'block';
        }
      });
    });

    // Load portfolio images dynamically
    async function loadPortfolioGallery() {
        try {
            const res = await fetch('/api/portfolio');
            const data = await res.json();
            
            if (!data.success || !data.images.length) {
                portfolioGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-light);">Portfolio coming soon.</div>';
                return;
            }

            portfolioGrid.innerHTML = data.images.map(img => `
                <div class="portfolio-item animate-on-scroll" data-category="${img.category}">
                    <div class="portfolio-img-wrap">
                        <img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.caption || 'Portfolio image')}" loading="lazy">
                        <div class="portfolio-overlay">
                            <span class="portfolio-category">${escapeHtml(formatCategory(img.category))}</span>
                            <h4>${escapeHtml(img.caption || '')}</h4>
                        </div>
                    </div>
                </div>
            `).join('');

            // Trigger scroll observer for new elements
            qsa('.animate-on-scroll', portfolioGrid).forEach(el => {
                new IntersectionObserver((entries, obs) => {
                    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
                }, { threshold: 0.1 }).observe(el);
            });
            
            // Auto-apply category filter from URL if present
            if (categoryFromUrl) {
              const targetBtn = qs(`.filter-btn[data-filter="${categoryFromUrl}"]`);
              if (targetBtn) targetBtn.click();
            } else {
              // Re-apply current filter if any
              const activeFilterBtn = qs('.filter-btn.active');
              if (activeFilterBtn) activeFilterBtn.click();
            }
            
        } catch (err) {
            console.error('Failed to load portfolio', err);
            portfolioGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-light);">Failed to load portfolio.</div>';
        }
    }
    
    loadPortfolioGallery();

    // Lightbox
    const lightbox = qs('#lightbox');
    const lightboxImg = qs('#lightboxImg');
    const lightboxCaption = qs('#lightboxCaption');
    let currentIndex = 0;
    let portfolioImages = [];

    if (lightbox) {
      function buildPortfolioImages() {
        return qsa('.portfolio-item:not(.hidden) .portfolio-img-wrap').map(wrap => ({
          src: wrap.querySelector('img').src,
          alt: wrap.querySelector('img').alt,
          caption: wrap.querySelector('h4')?.textContent || ''
        }));
      }

      function openLightbox(index) {
        portfolioImages = buildPortfolioImages();
        if (!portfolioImages.length) return;
        currentIndex = Math.max(0, Math.min(index, portfolioImages.length - 1));
        lightboxImg.src = portfolioImages[currentIndex].src;
        lightboxImg.alt = portfolioImages[currentIndex].alt;
        lightboxCaption.textContent = portfolioImages[currentIndex].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
        document.body.style.overflow = '';
      }

      function navigate(dir) {
        currentIndex = (currentIndex + dir + portfolioImages.length) % portfolioImages.length;
        lightboxImg.src = portfolioImages[currentIndex].src;
        lightboxImg.alt = portfolioImages[currentIndex].alt;
        lightboxCaption.textContent = portfolioImages[currentIndex].caption;
      }

      portfolioGrid.addEventListener('click', e => {
        const item = e.target.closest('.portfolio-item');
        if (!item) return;
        const visible = qsa('.portfolio-item:not(.hidden)');
        const idx = visible.indexOf(item);
        if (idx >= 0) openLightbox(idx);
      });

      qs('#lightboxClose')?.addEventListener('click', closeLightbox);
      qs('#lightboxPrev')?.addEventListener('click', () => navigate(-1));
      qs('#lightboxNext')?.addEventListener('click', () => navigate(1));
      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
      document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
      });
    }
  }

  /* ─── Bridal Saree Draping Gallery ─── */
  const bridalGrid = qs('#bridalGalleryGrid');
  if (bridalGrid) {
    const loadingEl = qs('#bridalGalleryLoading');
    const emptyEl = qs('#bridalGalleryEmpty');

    async function loadBridalGallery() {
      try {
        const res = await fetch('/api/portfolio?category=bridal-saree');
        const data = await res.json();
        if (loadingEl) loadingEl.remove();

        if (!data.success || !data.images.length) {
          if (emptyEl) emptyEl.style.display = 'block';
          return;
        }

        // Lightbox images for bridal page
        const bridalImages = data.images;

        data.images.forEach((img, idx) => {
          const item = document.createElement('div');
          item.className = 'bridal-gallery-item animate-on-scroll';
          item.innerHTML = `
            <img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.caption || 'Bridal saree draping')}" loading="lazy">
            <div class="bridal-gallery-item-overlay">
              <span class="bridal-gallery-item-caption">${escapeHtml(img.caption || '')}</span>
            </div>
          `;
          item.addEventListener('click', () => openBridalLightbox(idx, bridalImages));
          bridalGrid.appendChild(item);
        });

        // Trigger scroll observer for new elements
        qsa('.animate-on-scroll').forEach(el => {
          if (!el.classList.contains('visible')) {
            new IntersectionObserver((entries, obs) => {
              entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
            }, { threshold: 0.1 }).observe(el);
          }
        });
      } catch (err) {
        console.error('Failed to load bridal gallery', err);
        if (loadingEl) loadingEl.remove();
        if (emptyEl) emptyEl.style.display = 'block';
      }
    }

    const lightbox = qs('#lightbox');
    const lightboxImg = qs('#lightboxImg');
    const lightboxCaption = qs('#lightboxCaption');
    let bridalCurrentIndex = 0;
    let bridalImages = [];

    function openBridalLightbox(index, images) {
      bridalImages = images;
      bridalCurrentIndex = index;
      lightboxImg.src = bridalImages[bridalCurrentIndex].url;
      lightboxImg.alt = bridalImages[bridalCurrentIndex].caption || 'Bridal image';
      lightboxCaption.textContent = bridalImages[bridalCurrentIndex].caption || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeBridalLightbox() {
      lightbox.classList.remove('active');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    function navigateBridal(dir) {
      bridalCurrentIndex = (bridalCurrentIndex + dir + bridalImages.length) % bridalImages.length;
      lightboxImg.src = bridalImages[bridalCurrentIndex].url;
      lightboxCaption.textContent = bridalImages[bridalCurrentIndex].caption || '';
    }

    if (lightbox) {
      qs('#lightboxClose')?.addEventListener('click', closeBridalLightbox);
      qs('#lightboxPrev')?.addEventListener('click', () => navigateBridal(-1));
      qs('#lightboxNext')?.addEventListener('click', () => navigateBridal(1));
      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeBridalLightbox(); });
      document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeBridalLightbox();
        if (e.key === 'ArrowLeft') navigateBridal(-1);
        if (e.key === 'ArrowRight') navigateBridal(1);
      });
    }

    loadBridalGallery();
  }

  /* ─── Instagram Grid (shimmer tiles linking to profile) ─── */
  const instagramGrid = qs('#instagramGrid');
  if (instagramGrid) {
    const colors = [
      'rgba(201,162,39,0.08)', 'rgba(201,162,39,0.12)',
      'rgba(246,230,230,0.5)', 'rgba(240,235,225,0.6)',
      'rgba(201,162,39,0.06)', 'rgba(250,247,242,0.8)',
      'rgba(201,162,39,0.10)', 'rgba(246,230,230,0.4)',
    ];
    for (let i = 0; i < 8; i++) {
      const a = document.createElement('a');
      a.href = 'https://instagram.com/njsareedrapist';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'insta-item';
      a.setAttribute('aria-label', 'View Instagram post');
      a.innerHTML = `
        <div style="width:100%;height:100%;background:${colors[i]};background-size:200% 100%;animation:shimmer ${1.5 + i * 0.15}s ease-in-out infinite;border-radius:inherit;display:flex;align-items:center;justify-content:center;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="rgba(201,162,39,0.3)"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </div>
        <div class="insta-overlay" style="display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.75rem;letter-spacing:0.5px;">View on Instagram</div>
      `;
      instagramGrid.appendChild(a);
    }
  }


  /* ─── Reviews Carousel ─── */
  function initReviewsCarousel(trackId, dotsId, wrapId) {
    const track = qs('#' + trackId);
    const dotsContainer = qs('#' + dotsId);
    const wrap = qs('#' + wrapId);
    if (!track || !dotsContainer || !wrap) return;

    const slides = Array.from(track.children);
    const total = slides.length;
    let current = 0;
    let autoTimer = null;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function updateDots() {
      qsa('.carousel-dot', dotsContainer).forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      updateDots();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // Arrow buttons inside the wrap
    const btnPrev = wrap.querySelector('.carousel-btn-prev');
    const btnNext = wrap.querySelector('.carousel-btn-next');
    if (btnPrev) btnPrev.addEventListener('click', () => { resetTimer(); prev(); });
    if (btnNext) btnNext.addEventListener('click', () => { resetTimer(); next(); });

    // Auto-play
    function startTimer() {
      autoTimer = setInterval(next, 4000);
    }
    function resetTimer() {
      clearInterval(autoTimer);
      startTimer();
    }
    startTimer();

    // Pause on hover
    wrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrap.addEventListener('mouseleave', startTimer);

    // Touch / swipe support
    let touchStartX = 0;
    wrap.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        resetTimer();
        diff > 0 ? next() : prev();
      }
    }, { passive: true });
  }

  // Init on home page
  initReviewsCarousel('reviewsTrackHome', 'reviewsDotsHome', 'reviewsCarouselHome');
  // Init on reviews page
  initReviewsCarousel('reviewsTrackPage', 'reviewsDotsPage', 'reviewsCarouselPage');

})();
