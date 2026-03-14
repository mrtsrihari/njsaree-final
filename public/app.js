/* ═══════════════════════════════════════════════════
   NJ SAREE DRAPIST — Client-Side Application
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar Scroll Effect ─────────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ─── Active Nav Link on Scroll ────────────────────
  const sections = document.querySelectorAll('section[id]');

  function highlightNavLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // ─── Hamburger Menu Toggle ────────────────────────
  const hamburger = document.getElementById('navHamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ─── Scroll-Triggered Animations ──────────────────
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animateElements.forEach(el => scrollObserver.observe(el));

  // ─── Portfolio Filter ─────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ─── Portfolio Lightbox ───────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentLightboxIndex = 0;

  function getVisiblePortfolioItems() {
    return [...document.querySelectorAll('.portfolio-item:not(.hidden)')];
  }

  function openLightbox(index) {
    const items = getVisiblePortfolioItems();
    if (index < 0 || index >= items.length) return;
    currentLightboxIndex = index;

    const item = items[index];
    const img = item.querySelector('img');
    const caption = item.querySelector('h4');

    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    const items = getVisiblePortfolioItems();
    currentLightboxIndex = (currentLightboxIndex + direction + items.length) % items.length;
    openLightbox(currentLightboxIndex);
  }

  portfolioItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const visibleItems = getVisiblePortfolioItems();
      const visibleIndex = visibleItems.indexOf(item);
      openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ─── Star Rating Picker ───────────────────────────
  const starRating = document.getElementById('starRating');
  const ratingInput = document.getElementById('reviewRating');
  const stars = starRating.querySelectorAll('.star');
  let selectedRating = 0;

  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.dataset.rating);
      highlightStars(rating);
    });

    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.rating);
      ratingInput.value = selectedRating;
      highlightStars(selectedRating);
    });
  });

  starRating.addEventListener('mouseleave', () => {
    highlightStars(selectedRating);
  });

  function highlightStars(rating) {
    stars.forEach(star => {
      const starVal = parseInt(star.dataset.rating);
      if (starVal <= rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

  // ─── Review Form Submission ───────────────────────
  const reviewForm = document.getElementById('reviewForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.getElementById('reviewSubmitBtn');

  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewName').value.trim();
    const rating = parseInt(ratingInput.value);
    const message = document.getElementById('reviewMessage').value.trim();

    // Validation
    if (!name || !message) {
      showFormMessage('Please fill in all fields.', 'error');
      return;
    }
    if (rating < 1 || rating > 5) {
      showFormMessage('Please select a star rating.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Submitting...</span>';

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, message })
      });

      const data = await response.json();

      if (data.success) {
        showFormMessage('Thank you! Your review has been submitted and will appear after approval. ✨', 'success');
        reviewForm.reset();
        selectedRating = 0;
        ratingInput.value = 0;
        highlightStars(0);
      } else {
        showFormMessage(data.error || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      showFormMessage('Network error. Please check your connection and try again.', 'error');
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit Review</span>';
  });

  function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = 'form-message ' + type;
    setTimeout(() => {
      formMessage.textContent = '';
      formMessage.className = 'form-message';
    }, 5000);
  }

  // ─── Load Approved Reviews ────────────────────────
  const reviewsGrid = document.getElementById('reviewsGrid');

  async function loadReviews() {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();

      if (data.success && data.reviews.length > 0) {
        reviewsGrid.innerHTML = data.reviews.map(review => `
          <div class="review-card animate-on-scroll visible">
            <div class="review-stars">
              ${generateStars(review.rating)}
            </div>
            <p class="review-text">"${escapeHtml(review.message)}"</p>
            <div class="review-author">${escapeHtml(review.name)}</div>
            <div class="review-date">${formatDate(review.created_at)}</div>
          </div>
        `).join('');
      } else {
        reviewsGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">💬</div>
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        `;
      }
    } catch (err) {
      reviewsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">💬</div>
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      `;
    }
  }

  function generateStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += i <= rating
        ? '<span class="star-filled">★</span>'
        : '<span class="star-empty">★</span>';
    }
    return html;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function escapeHtml(text) {
    const el = document.createElement('span');
    el.textContent = text;
    return el.innerHTML;
  }

  loadReviews();

  // ─── Instagram Gallery (Static Placeholders) ─────
  const instagramGrid = document.getElementById('instagramGrid');

  const instagramPosts = [
    {
      image: '/images/insta-1.webp',
      link: 'https://instagram.com/njsareedrapist',
      alt: 'Bridal saree draping showcase'
    },
    {
      image: '/images/insta-2.webp',
      link: 'https://instagram.com/njsareedrapist',
      alt: 'Lehenga styling session'
    },
    {
      image: '/images/insta-3.webp',
      link: 'https://instagram.com/njsareedrapist',
      alt: 'Pre-pleated saree ready to wear'
    },
    {
      image: '/images/insta-4.webp',
      link: 'https://instagram.com/njsareedrapist',
      alt: 'Wedding event styling'
    },
    {
      image: '/images/insta-5.webp',
      link: 'https://instagram.com/njsareedrapist',
      alt: 'Bridal preparation moment'
    },
    {
      image: '/images/insta-6.webp',
      link: 'https://instagram.com/njsareedrapist',
      alt: 'Reception saree look'
    },
    {
      image: '/images/insta-7.webp',
      link: 'https://instagram.com/njsareedrapist',
      alt: 'Traditional draping art'
    },
    {
      image: '/images/insta-8.webp',
      link: 'https://instagram.com/njsareedrapist',
      alt: 'Engagement ceremony styling'
    }
  ];

  // Render Instagram grid with gradient placeholders when no real images exist
  const instaColors = [
    'linear-gradient(135deg, #C9A227 0%, #8B6914 100%)',
    'linear-gradient(135deg, #1A1A1A 0%, #3D2A10 100%)',
    'linear-gradient(135deg, #E2C561 0%, #C9A227 100%)',
    'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%)',
    'linear-gradient(135deg, #F6E6E6 0%, #C9A227 100%)',
    'linear-gradient(135deg, #2D1F0E 0%, #C9A227 100%)',
    'linear-gradient(135deg, #C9A227 0%, #F6E6E6 100%)',
    'linear-gradient(135deg, #A68518 0%, #E2C561 100%)'
  ];

  const instaLabels = [
    '✨ Bridal Saree', '👗 Lehenga Style', '🪡 Pre-Pleated',
    '🎉 Event Look', '💍 Bridal Prep', '🌸 Reception',
    '🧵 Traditional', '💫 Engagement'
  ];

  instagramGrid.innerHTML = instagramPosts.map((post, i) => `
    <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="insta-item" title="View on Instagram">
      <div style="width:100%;height:100%;background:${instaColors[i]};display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:0.85rem;color:rgba(255,255,255,0.8);text-align:center;padding:16px;">
        ${instaLabels[i]}
      </div>
      <div class="insta-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
      </div>
    </a>
  `).join('');

  // ─── Smooth Scroll for all anchor links ───────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
