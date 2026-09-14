/**
 * M. Al Fatheena Jameel — Portfolio Script
 * Handles theme toggling, scrollspy, mobile navigation, certificate lightbox, and contact form.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── Lucide Icons Initialization ──
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  // ── Theme Management (Default: Light Mode) ──
  const html = document.documentElement;
  const themeToggleDesktop = document.getElementById('themeToggleDesktop');
  const themeToggleMobile = document.getElementById('themeToggleMobile');

  function getPreferredTheme() {
    const saved = localStorage.getItem('fatheena_theme');
    if (saved) return saved;
    // Default to light theme matching the screenshot
    return 'light';
  }

  function applyTheme(theme, animate = false) {
    if (animate) {
      html.classList.add('theme-transitioning');
    }
    html.setAttribute('data-theme', theme);
    localStorage.setItem('fatheena_theme', theme);

    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }

    if (animate) {
      setTimeout(() => {
        html.classList.remove('theme-transitioning');
      }, 350);
    }
  }

  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme, true);
  }

  // Apply initial theme
  applyTheme(getPreferredTheme(), false);

  if (themeToggleDesktop) {
    themeToggleDesktop.addEventListener('click', toggleTheme);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
  }

  // ── Mobile Sidebar Drawer ──
  const mobileHamburger = document.getElementById('mobileHamburger');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function openSidebar() {
    if (mobileHamburger) mobileHamburger.classList.add('open');
    if (sidebar) sidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (mobileHamburger) mobileHamburger.classList.remove('open');
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (mobileHamburger) {
    mobileHamburger.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close sidebar on link click (mobile)
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    });
  });

  // ── Scrollspy: Active Navigation Highlight ──
  const sections = ['home', 'about', 'education', 'experience', 'portfolio', 'skills', 'certifications', 'contact'];
  const navLinks = document.querySelectorAll('.sidebar-nav a[data-nav]');

  function updateActiveNav() {
    const scrollPos = window.scrollY || window.pageYOffset || 0;
    let activeSection = 'home';
    const offset = window.innerWidth < 1024 ? 120 : 160;

    for (let i = 0; i < sections.length; i++) {
      const el = document.getElementById(sections[i]);
      if (el && scrollPos >= el.offsetTop - offset) {
        activeSection = sections[i];
      }
    }

    // Edge check: near bottom of page highlights Contact
    if (window.innerHeight + scrollPos >= document.documentElement.scrollHeight - 60) {
      activeSection = 'contact';
    }

    navLinks.forEach(link => {
      if (link.getAttribute('data-nav') === activeSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ── Scroll Reveal Intersection Observer ──
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach(el => revealObserver.observe(el));

  // ── Smooth Scroll for In-Page Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = window.innerWidth < 1024 ? 80 : 30;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        if (window.history.pushState) {
          window.history.pushState(null, null, targetId);
        }
      }
    });
  });

  // ── Certificate Lightbox Modal Handlers ──
  const certModal = document.getElementById('certModal');
  const modalCertImg = document.getElementById('modalCertImg');
  const modalCertTitle = document.getElementById('modalCertTitle');
  const modalCertSub = document.getElementById('modalCertSub');
  const modalCertImgLink = document.getElementById('modalCertImgLink');

  window.openCertModal = function (imgSrc, title, sub) {
    if (!certModal) return;
    modalCertImg.src = imgSrc;
    modalCertTitle.textContent = title;
    modalCertSub.textContent = sub;
    modalCertImgLink.href = imgSrc;

    certModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeCertModal = function (e) {
    if (!certModal) return;
    if (!e || e.target === certModal || e.target.closest('.cert-modal-close')) {
      certModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && certModal && certModal.style.display === 'flex') {
      window.closeCertModal();
    }
  });

  // ── Toast Notification ──
  window.showToast = function (msg, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = (type === 'success' ? '✓  ' : '✕  ') + msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
      toast.className = 'toast';
    }, 4000);
  };

  // ── Contact Form Submission Handler ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }

      const submitBtn = document.getElementById('submitBtn');
      const submitText = document.getElementById('submitText');
      const name = (document.getElementById('name')?.value || '').trim();
      const email = (document.getElementById('email')?.value || '').trim();
      const subject = (document.getElementById('subject')?.value || 'Portfolio Inquiry').trim();
      const message = (document.getElementById('message')?.value || '').trim();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
      }
      if (submitText) {
        submitText.textContent = 'Preparing Message...';
      }

      setTimeout(() => {
        // Prepare mailto fallback
        const mailtoUrl = `mailto:fatheenajameel29@gmail.com?subject=${encodeURIComponent(
          subject + ' - From ' + name
        )}&body=${encodeURIComponent(
          `Hi M. Al Fatheena Jameel,\n\n${message}\n\n---\nSender Name: ${name}\nEmail: ${email}`
        )}`;

        showToast('Opening your email client to send message...', 'success');
        window.location.href = mailtoUrl;

        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
        if (submitText) {
          submitText.textContent = 'Send Message';
        }
      }, 700);
    });
  }

  // ── CV Download Handler ──
  window.handleDownloadCV = function () {
    showToast('Preparing M. Al Fatheena Jameel Resume...', 'success');
    // Generates a quick printable view or downloads profile summary
    setTimeout(() => {
      window.print();
    }, 600);
  };
});
