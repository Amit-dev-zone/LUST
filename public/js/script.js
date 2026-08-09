// Client-side JavaScript for Wanderlust Modern UI

(() => {
  'use strict';

  // Bootstrap Custom Form Validation
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        // Add loading state to submit buttons
        const submitBtn = form.querySelector('.btn-form-submit, button[type="submit"]');
        if (submitBtn && !submitBtn.querySelector('.spinner-border')) {
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...`;
          // Reset button text after 5s if navigation doesn't happen immediately
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

    // Clear search button functionality
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