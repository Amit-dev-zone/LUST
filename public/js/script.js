// Client-side JavaScript for Wanderlust Modern UI & MVP Features

(() => {
  'use strict';

  // Wishlist LocalStorage Manager
  const WISHLIST_KEY = 'wanderlust_wishlist';

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveWishlist(items) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }

  window.toggleWishlist = function(listingId, buttonElement) {
    let wishlist = getWishlist();
    const index = wishlist.indexOf(listingId);
    if (index === -1) {
      wishlist.push(listingId);
      if (buttonElement) buttonElement.classList.add('active');
    } else {
      wishlist.splice(index, 1);
      if (buttonElement) buttonElement.classList.remove('active');
    }
    saveWishlist(wishlist);
  };

  // Sync Wishlist Buttons state on page load
  document.addEventListener("DOMContentLoaded", () => {
    const wishlist = getWishlist();
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
      const id = btn.getAttribute('data-listing-id');
      if (id && wishlist.includes(id)) {
        btn.classList.add('active');
      }
    });
  });

  // Filter Modal Price Slider & Filtering Script
  document.addEventListener("DOMContentLoaded", () => {
    const priceSlider = document.getElementById('priceFilterSlider');
    const priceValLabel = document.getElementById('priceRangeValue');
    const applyBtn = document.getElementById('applyFiltersBtn');
    const resetBtn = document.getElementById('resetFiltersBtn');
    const items = document.querySelectorAll('.listing-grid-item');

    if (priceSlider && priceValLabel) {
      priceSlider.addEventListener('input', () => {
        priceValLabel.innerHTML = 'Up to &#8377;' + parseInt(priceSlider.value).toLocaleString('en-IN');
      });
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const maxPrice = priceSlider ? parseInt(priceSlider.value) : 10000;
        items.forEach(item => {
          const itemPrice = parseInt(item.getAttribute('data-price')) || 0;
          if (itemPrice <= maxPrice) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (priceSlider) priceSlider.value = 10000;
        if (priceValLabel) priceValLabel.innerHTML = 'Up to &#8377;10,000';
        items.forEach(item => item.style.display = 'block');
      });
    }
  });

  // Bootstrap Custom Form Validation
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        const submitBtn = form.querySelector('.btn-form-submit, button[type="submit"]');
        if (submitBtn && !submitBtn.querySelector('.spinner-border')) {
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...`;
          setTimeout(() => {
            if (submitBtn) submitBtn.innerHTML = originalText;
          }, 5000);
        }
      }
      form.classList.add('was-validated');
    }, false);
  });

  // Sticky Navbar Scroll Effect
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Keyboard shortcut '/' to focus search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInput.focus();
      }
    });

    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        window.location.href = '/listings';
      });
    }
  }

  // Auto Dismiss Flash Alerts after 6 seconds
  const alerts = document.querySelectorAll('.alert-custom');
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 6000);
  });

})();