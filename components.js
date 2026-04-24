// components.js

function updateDateTime() {
  const dateEl = document.getElementById('currentDate');
  const timeEl = document.getElementById('currentTime');
  if (!dateEl || !timeEl) return;

  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;

  timeEl.textContent = `${String(h).padStart(2, '0')}:${m}:${s} ${ap}`;
}

function initHeaderAndSidebar() {

  // Sidebar Toggle with Mobile Support
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const isMobile = () => window.innerWidth <= 768;

  // Create overlay element for mobile
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.querySelector('.app-wrapper').prepend(overlay);
  }

  // Function to close sidebar on mobile
  function closeSidebarOnMobile() {
    if (isMobile() && sidebar) {
      sidebar.classList.remove('mobile-visible');
      overlay.classList.remove('active');
    }
  }

  // Function to open sidebar on mobile
  function openSidebarOnMobile() {
    if (isMobile() && sidebar) {
      sidebar.classList.add('mobile-visible');
      overlay.classList.add('active');
    }
  }

  // Toggle sidebar function
  function toggleSidebar() {
    if (isMobile()) {
      if (sidebar.classList.contains('mobile-visible')) {
        closeSidebarOnMobile();
      } else {
        openSidebarOnMobile();
      }
    } else {
      // Desktop: use hidden class
      sidebar.classList.toggle('hidden');
      const icon = sidebarToggle.querySelector('i');
      if (icon) {
        icon.className = sidebar.classList.contains('hidden')
          ? 'fas fa-chevron-right'
          : 'fas fa-bars';
      }
    }
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });
  }

  // Close sidebar when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      closeSidebarOnMobile();
    });
  }

  // AUTO-HIDE SIDEBAR ON MOBILE WHEN ANY MENU OPTION IS CLICKED
  const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-item-side');
  
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Only auto-hide on mobile and if it's not a dropdown toggle
      if (isMobile() && !link.classList.contains('dropdown-toggle')) {
        // Small delay to allow navigation to happen
        setTimeout(() => {
          closeSidebarOnMobile();
        }, 150);
      }
    });
  });

  // Also close sidebar when dropdown toggles are clicked on mobile
  const dropdownToggles = document.querySelectorAll('.dropdown-nav .dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (isMobile()) {
        // Don't close sidebar, just let dropdown work
        e.stopPropagation();
      }
    });
  });

  // Handle window resize - reset sidebar state
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      // Desktop: ensure sidebar is visible (remove mobile classes)
      if (sidebar) {
        sidebar.classList.remove('mobile-visible');
        overlay.classList.remove('active');
        // Reset hidden state on desktop if needed
        if (sidebar.classList.contains('hidden')) {
          sidebar.classList.remove('hidden');
          const icon = sidebarToggle?.querySelector('i');
          if (icon) icon.className = 'fas fa-bars';
        }
      }
    } else {
      // Mobile: ensure sidebar is hidden by default when resizing from desktop to mobile
      if (sidebar && !sidebar.classList.contains('mobile-visible')) {
        sidebar.classList.remove('mobile-visible');
        overlay.classList.remove('active');
      }
    }
  });

  // Fullscreen Toggle
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenToggle.querySelector('i').className = 'fas fa-compress';
      } else {
        document.exitFullscreen();
        fullscreenToggle.querySelector('i').className = 'fas fa-expand';
      }
    });
    
    // Update icon when fullscreen changes
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        fullscreenToggle.querySelector('i').className = 'fas fa-compress';
      } else {
        fullscreenToggle.querySelector('i').className = 'fas fa-expand';
      }
    });
  }

  // Header Dropdown (3 dots)
  const threeDotsBtn = document.getElementById('threeDotsBtn');
  const dropdownMenu = document.getElementById('headerDropdown');

  if (threeDotsBtn && dropdownMenu) {
    threeDotsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('active');
    });
  }

  // Date & Time
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // GENERIC SIDEBAR DROPDOWN HANDLER (ACADEMICS + CLASS)
  const dropdowns = document.querySelectorAll('.dropdown-nav');

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');

    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns
        dropdowns.forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });

        // Toggle current
        dropdown.classList.toggle('active');
      });
    }
  });

  // Close all dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-nav')) {
      dropdowns.forEach(d => d.classList.remove('active'));
    }
  });
  
  // Initial setup for mobile - ensure sidebar is hidden
  if (isMobile() && sidebar) {
    sidebar.classList.remove('mobile-visible');
    if (overlay) overlay.classList.remove('active');
  }
}

// Export
window.initHeaderAndSidebar = initHeaderAndSidebar;