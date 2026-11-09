/**
 * STEEL UTENSILS & KITCHENWARE STORE - MAIN JAVASCRIPT
 * Premium multi-page e-commerce frontend
 * Handles cart, wishlist, search, quickview, theme, animations, and modals
 */

(function () {
  'use strict';

  // --- Global State & Storage Keys ---
  const STORAGE_KEYS = {
    THEME: 'steel_utensils_theme',
    CART: 'steel_utensils_cart',
    WISHLIST: 'steel_utensils_wishlist'
  };

  // Default initial demo cart item if storage is empty
  const DEFAULT_CART = [
    {
      id: 'prod-111',
      title: 'Triply Stainless Steel Kadai with Glass Lid (2.5L)',
      price: 1899,
      image: 'images/image-111.png',
      qty: 1
    }
  ];

  let cart = [];
  let wishlist = [];

  // --- Initializer ---
  function init() {
    loadTheme();
    loadRTL();
    loadStorage();
    initNavbar();
    initBackToTop();
    initThemeToggle();
    initRTLToggle();
    initCartDrawer();
    initWishlist();
    initSearchModal();
    initQuickView();
    initCheckoutModal();
    initContactAndNewsletterForms();
    initPageSpecificInteractions();
    initFaqAccordion();
    renderCart();
    updateBadges();
  }

  // --- RTL Management ---
  function loadRTL() {
    const savedDir = localStorage.getItem('steel_utensils_dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
  }

  function initRTLToggle() {
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        document.documentElement.setAttribute('dir', newDir);
        localStorage.setItem('steel_utensils_dir', newDir);
        showToast(newDir === 'rtl' ? 'Right-to-Left (RTL) mode enabled' : 'Left-to-Right (LTR) mode enabled', 'info');
      });
    });
  }

  // --- Theme Management ---
  function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function initThemeToggle() {
    const toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
        updateThemeIcon(newTheme);
        showToast(newTheme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled');
      });
    });
  }

  function updateThemeIcon(theme) {
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
      if (theme === 'dark') {
        icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      } else {
        icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      }
    });
  }

  // --- Storage Management ---
  function loadStorage() {
    try {
      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      cart = storedCart ? JSON.parse(storedCart) : DEFAULT_CART;
      const storedWish = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      wishlist = storedWish ? JSON.parse(storedWish) : ['prod-113', 'prod-120'];
    } catch (e) {
      cart = DEFAULT_CART;
      wishlist = [];
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    renderCart();
    updateBadges();
  }

  function saveWishlist() {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    updateBadges();
  }

  function updateBadges() {
    const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartBadges = document.querySelectorAll('.cart-badge');
    cartBadges.forEach(b => {
      b.textContent = totalCartQty;
      b.style.display = totalCartQty > 0 ? 'flex' : 'none';
    });

    const wishBadges = document.querySelectorAll('.wishlist-badge');
    wishBadges.forEach(b => {
      b.textContent = wishlist.length;
      b.style.display = wishlist.length > 0 ? 'flex' : 'none';
    });
  }

  // --- Navbar & Sticky Scroll ---
  function initNavbar() {
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });

    // Mobile Hamburger & Drawer
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const navOverlay = document.querySelector('.nav-overlay');
    const closeMobileNav = document.querySelector('.mobile-nav-close');

    function openMobileMenu() {
      mobileDrawer?.classList.add('active');
      navOverlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      mobileDrawer?.classList.remove('active');
      navOverlay?.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburgerBtn?.addEventListener('click', openMobileMenu);
    closeMobileNav?.addEventListener('click', closeMobileMenu);
    navOverlay?.addEventListener('click', closeMobileMenu);

    // Close on mobile link click
    document.querySelectorAll('.mobile-nav-links .nav-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // --- Drop / Back to Top Button ---
  function initBackToTop() {
    let btn = document.getElementById('backToTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'backToTop';
      btn.className = 'back-to-top-btn';
      btn.setAttribute('aria-label', 'Drop to top');
      btn.setAttribute('title', 'Back to top');
      btn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      document.body.appendChild(btn);
    }

    const handleScroll = () => {
      if (window.scrollY > 280) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Cart Drawer Implementation ---
  function initCartDrawer() {
    const cartToggles = document.querySelectorAll('.cart-toggle-btn');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartOverlay = document.querySelector('.cart-overlay') || document.querySelector('.nav-overlay');
    const closeCartBtn = document.querySelector('.cart-close-btn');
    const continueBtn = document.querySelector('.cart-continue-btn');

    function openCart() {
      const mobileDrawer = document.querySelector('.mobile-nav-drawer');
      if (mobileDrawer) mobileDrawer.classList.remove('active');
      cartDrawer?.classList.add('active');
      if (cartOverlay) cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderCart();
    }

    function closeCart() {
      cartDrawer?.classList.remove('active');
      if (cartOverlay) cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    cartToggles.forEach(b => b.addEventListener('click', openCart));
    closeCartBtn?.addEventListener('click', closeCart);
    continueBtn?.addEventListener('click', closeCart);

    // Global Add to Cart listener for buttons
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-add-cart, .btn-buy-now');
      if (!btn) return;

      const id = btn.getAttribute('data-id') || 'prod-' + Math.floor(Math.random() * 1000);
      const title = btn.getAttribute('data-title') || 'Stainless Steel Culinary Vessel';
      const price = parseFloat(btn.getAttribute('data-price')) || 999;
      const image = btn.getAttribute('data-image') || 'images/image-111.png';

      addToCart({ id, title, price, image, qty: 1 });
      showToast(`Added to Cart: ${title}`);
      openCart();
    });
  }

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty: product.qty || 1
      });
    }
    saveCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    showToast('Item removed from cart');
  }

  function updateCartQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
    }
  }

  function renderCart() {
    const cartBody = document.querySelector('.cart-body');
    const cartFooter = document.querySelector('.cart-footer');
    const subtotalEl = document.querySelector('.cart-subtotal-amount');
    const shippingBar = document.querySelector('.shipping-bar-fill');
    const shippingText = document.querySelector('.shipping-threshold-text');

    if (!cartBody) return;

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h3>Your cart is empty</h3>
          <p>Discover our stainless steel cookware, dinner thali sets and kitchen essentials.</p>
          <a href="products.html" class="btn btn-primary btn-sm">Explore Products</a>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }

    if (cartFooter) cartFooter.style.display = 'flex';

    let html = '';
    let subtotal = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      html += `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4>${item.title}</h4>
            <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            <div class="cart-item-controls">
              <button class="qty-btn btn-qty-minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn btn-qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" title="Remove item" aria-label="Remove item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;
    });

    cartBody.innerHTML = html;

    if (subtotalEl) {
      subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }

    // Free shipping threshold at ₹1,999
    const freeShippingGoal = 1999;
    if (shippingBar && shippingText) {
      if (subtotal >= freeShippingGoal) {
        shippingBar.style.width = '100%';
        shippingText.innerHTML = `<strong>Congratulations!</strong> You qualify for <strong>FREE Delivery</strong> across India!`;
      } else {
        const pct = Math.min(100, Math.round((subtotal / freeShippingGoal) * 100));
        shippingBar.style.width = `${pct}%`;
        const diff = freeShippingGoal - subtotal;
        shippingText.innerHTML = `Add <strong>₹${diff.toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong>!`;
      }
    }

    // Attach quantity & remove listeners
    cartBody.querySelectorAll('.btn-qty-minus').forEach(b => {
      b.addEventListener('click', () => updateCartQty(b.getAttribute('data-id'), -1));
    });
    cartBody.querySelectorAll('.btn-qty-plus').forEach(b => {
      b.addEventListener('click', () => updateCartQty(b.getAttribute('data-id'), 1));
    });
    cartBody.querySelectorAll('.cart-item-remove').forEach(b => {
      b.addEventListener('click', () => removeFromCart(b.getAttribute('data-id')));
    });
  }

  // --- Wishlist Interaction ---
  function initWishlist() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-wishlist');
      if (!btn) return;
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      if (!id) return;

      const idx = wishlist.indexOf(id);
      if (idx > -1) {
        wishlist.splice(idx, 1);
        btn.classList.remove('active-wishlist');
        showToast('Removed from Wishlist');
      } else {
        wishlist.push(id);
        btn.classList.add('active-wishlist');
        showToast('Added to Wishlist ❤️');
      }
      saveWishlist();
    });

    // Sync button state on load
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
      const id = btn.getAttribute('data-id');
      if (wishlist.includes(id)) {
        btn.classList.add('active-wishlist');
      }
    });

    // Wishlist navbar button click
    document.querySelectorAll('.wishlist-toggle-btn').forEach(b => {
      b.addEventListener('click', () => {
        showToast(`You have ${wishlist.length} item(s) saved in your Wishlist.`);
      });
    });
  }

  // --- Search Overlay ---
  function initSearchModal() {
    const searchModal = document.querySelector('.search-modal');
    const searchOpenBtns = document.querySelectorAll('.search-toggle-btn');
    const searchCloseBtn = document.querySelector('.search-close-btn');
    const searchInput = document.querySelector('.search-input');
    const resultsContainer = document.querySelector('.search-results-list');
    const searchTags = document.querySelectorAll('.search-tag');

    function openSearch() {
      searchModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput?.focus(), 150);
    }

    function closeSearch() {
      searchModal?.classList.remove('active');
      document.body.style.overflow = '';
      if (searchInput) searchInput.value = '';
      if (resultsContainer) resultsContainer.innerHTML = '';
    }

    searchOpenBtns.forEach(b => b.addEventListener('click', openSearch));
    searchCloseBtn?.addEventListener('click', closeSearch);

    searchModal?.addEventListener('click', e => {
      if (e.target === searchModal) closeSearch();
    });

    // Sample searchable catalogue
    const searchableItems = [
      { id: 'prod-111', title: 'Stainless Steel Kadai with Lid', category: 'Cookware', price: '₹1,899', image: 'images/image-111.png' },
      { id: 'prod-113', title: 'Stainless Steel Pressure Cooker', category: 'Cookware', price: '₹2,499', image: 'images/image-113.png' },
      { id: 'prod-114', title: 'Brushed Stockpot Casserole', category: 'Cookware', price: '₹1,699', image: 'images/image-114.png' },
      { id: 'prod-9', title: '28-Piece Stainless Dinner Set', category: 'Dinner Sets', price: '₹3,999', image: 'images/image-9.png' },
      { id: 'prod-70', title: '4-Piece Airtight Canister Jars', category: 'Storage', price: '₹1,249', image: 'images/image-70.png' },
      { id: 'prod-71', title: 'Traditional Indian Masala Dabba', category: 'Storage', price: '₹799', image: 'images/image-71.png' },
      { id: 'prod-120', title: 'Honeycomb Non-Stick Dosa Tawa', category: 'Cookware', price: '₹1,299', image: 'images/image-120.png' },
      { id: 'prod-131', title: '4-Tier Multi Food Steamer', category: 'Cookware', price: '₹1,999', image: 'images/image-131.png' },
      { id: 'prod-126', title: 'Classic Royal Wedding Thali Set', category: 'Wedding Sets', price: '₹8,999', image: 'images/image-126.png' },
      { id: 'prod-143', title: 'Executive Silverware Trunk Box', category: 'Wedding Sets', price: '₹6,499', image: 'images/image-143.png' }
    ];

    function handleSearch(query) {
      if (!resultsContainer) return;
      const q = query.trim().toLowerCase();
      if (!q) {
        resultsContainer.innerHTML = '';
        return;
      }

      const filtered = searchableItems.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );

      if (filtered.length === 0) {
        resultsContainer.innerHTML = `<p style="padding: 1rem; color: var(--text-muted); text-align: center;">No utensils found matching "${query}". Try searching for 'Kadai', 'Thali' or 'Cooker'.</p>`;
        return;
      }

      resultsContainer.innerHTML = filtered.map(item => `
        <a href="products.html" class="search-result-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.title}" />
          <div>
            <div style="font-size: 0.75rem; color: var(--fresh-green); font-weight: 700;">${item.category}</div>
            <div style="font-weight: 700; font-size: 0.95rem;">${item.title}</div>
            <div style="color: var(--emerald-green); font-weight: 700; font-size: 0.9rem;">${item.price}</div>
          </div>
        </a>
      `).join('');
    }

    searchInput?.addEventListener('input', e => handleSearch(e.target.value));

    searchTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const val = tag.textContent.trim();
        if (searchInput) {
          searchInput.value = val;
          handleSearch(val);
        }
      });
    });
  }

  // --- Quick View Modal ---
  function initQuickView() {
    const qvModal = document.querySelector('.modal-quickview');
    const closeBtn = qvModal?.querySelector('.modal-close');

    function closeQuickView() {
      qvModal?.classList.remove('active');
      document.body.style.overflow = '';
    }

    closeBtn?.addEventListener('click', closeQuickView);
    qvModal?.addEventListener('click', e => {
      if (e.target === qvModal) closeQuickView();
    });

    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-quick-view');
      if (!btn) return;
      e.preventDefault();

      const title = btn.getAttribute('data-title') || 'Premium Stainless Steel Kitchenware';
      const price = btn.getAttribute('data-price') || '1,499';
      const mrp = btn.getAttribute('data-mrp') || '2,299';
      const discount = btn.getAttribute('data-discount') || '35% OFF';
      const image = btn.getAttribute('data-image') || 'images/image-111.png';
      const desc = btn.getAttribute('data-desc') || 'Crafted with premium food-grade stainless steel with mirror polished finish and heavy thermal base for uniform heat distribution.';
      const category = btn.getAttribute('data-category') || 'Cookware';
      const id = btn.getAttribute('data-id') || 'prod-qv';

      if (!qvModal) return;

      qvModal.querySelector('.qv-title').textContent = title;
      qvModal.querySelector('.qv-category').textContent = category;
      qvModal.querySelector('.qv-img').src = image;
      qvModal.querySelector('.qv-img').alt = title;
      qvModal.querySelector('.qv-price').textContent = `₹${parseFloat(price).toLocaleString('en-IN')}`;
      qvModal.querySelector('.qv-mrp').textContent = `₹${parseFloat(mrp).toLocaleString('en-IN')}`;
      qvModal.querySelector('.qv-discount').textContent = discount;
      qvModal.querySelector('.qv-desc').textContent = desc;

      const addBtn = qvModal.querySelector('.qv-add-btn');
      if (addBtn) {
        addBtn.setAttribute('data-id', id);
        addBtn.setAttribute('data-title', title);
        addBtn.setAttribute('data-price', price);
        addBtn.setAttribute('data-image', image);
      }

      qvModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // --- Checkout / Order Enquiry Modal ---
  function initCheckoutModal() {
    const checkoutModal = document.querySelector('.modal-checkout');
    const orderTriggers = document.querySelectorAll('.open-order-modal-btn, .btn-proceed-order');
    const closeBtn = checkoutModal?.querySelector('.modal-close');
    const checkoutForm = document.querySelector('.checkout-form');
    let selectedPackage = { name: '3-Piece Triply Induction Cookware Set', price: 4499 };

    function openCheckout() {
      renderCheckoutSummary();
      checkoutModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeCheckout() {
      checkoutModal?.classList.remove('active');
      document.body.style.overflow = '';
    }

    orderTriggers.forEach(b => b.addEventListener('click', (e) => {
      e.preventDefault();
      openCheckout();
    }));

    closeBtn?.addEventListener('click', closeCheckout);

    checkoutModal?.addEventListener('click', e => {
      if (e.target === checkoutModal) closeCheckout();
    });

    // Package pill selector listeners
    const pills = document.querySelectorAll('.package-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedPackage = {
          name: pill.getAttribute('data-name'),
          price: parseInt(pill.getAttribute('data-price'), 10)
        };
        renderCheckoutSummary();
      });
    });

    function renderCheckoutSummary() {
      const summaryBox = document.querySelector('.checkout-items-summary');
      const totalBox = document.querySelector('.checkout-total-price');
      const packageSelector = document.querySelector('.quick-package-selector');
      if (!summaryBox) return;

      if (cart.length > 0) {
        if (packageSelector) packageSelector.style.display = 'none';
        let subtotal = 0;
        let html = `<ul style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 180px; overflow-y: auto; padding-right: 0.5rem;">`;
        cart.forEach(item => {
          const lineTotal = item.price * item.qty;
          subtotal += lineTotal;
          html += `
            <li style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.35rem;">
              <span>${item.title} <strong style="color: var(--emerald-green);">(x${item.qty})</strong></span>
              <strong>₹${lineTotal.toLocaleString('en-IN')}</strong>
            </li>
          `;
        });
        html += `</ul>`;
        summaryBox.innerHTML = html;

        if (totalBox) {
          totalBox.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        }
      } else {
        if (packageSelector) packageSelector.style.display = 'block';
        summaryBox.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; padding: 0.25rem 0;">
            <span>${selectedPackage.name} <strong style="color: var(--emerald-green);">(x1 Selection)</strong></span>
            <strong>₹${selectedPackage.price.toLocaleString('en-IN')}</strong>
          </div>
        `;
        if (totalBox) {
          totalBox.textContent = `₹${selectedPackage.price.toLocaleString('en-IN')}`;
        }
      }
    }

    checkoutForm?.addEventListener('submit', e => {
      e.preventDefault();
      const orderRef = 'ST-' + Math.floor(100000 + Math.random() * 900000);
      const name = checkoutForm.querySelector('#cust-name')?.value || 'Valued Customer';
      const phone = checkoutForm.querySelector('#cust-phone')?.value || 'Provided';
      const city = checkoutForm.querySelector('#cust-city')?.value || 'Your Location';

      // Show confirmation
      const content = checkoutModal.querySelector('.checkout-modal-content');
      if (content) {
        content.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 72px; height: 72px; background: var(--soft-mint); color: var(--emerald-green); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="section-badge">Order Enquiry Confirmed</span>
            <h2 style="margin: 0.75rem 0 0.5rem;">Thank You, ${name}!</h2>
            <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem; line-height: 1.6;">
              Your kitchenware order enquiry has been registered under reference <strong>#${orderRef}</strong>. Our kitchen specialist will contact you at <strong>${phone}</strong> (${city}) to confirm custom laser engravings and dispatch tracking.
            </p>
            <div style="background: var(--bg-body); padding: 1rem 1.5rem; border-radius: var(--radius-sm); margin-bottom: 2rem; border: 1.5px solid var(--border-silver); display: inline-block;">
              Order Reference: <strong style="color: var(--emerald-green); font-size: 1.25rem;">#${orderRef}</strong>
            </div>
            <div>
              <button class="btn btn-primary" onclick="window.location.reload()">Done / Close</button>
            </div>
          </div>
        `;
      }

      // Clear cart
      cart = [];
      saveCart();
      renderCart();
      updateBadges();
      showToast(`Order enquiry #${orderRef} submitted successfully!`);
    });
  }

  // --- Forms Validation & Submission ---
  function initContactAndNewsletterForms() {
    const contactForm = document.querySelector('.contact-form-element');
    contactForm?.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.querySelector('#contact-name')?.value || 'Customer';
      contactForm.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem;">
          <div style="width: 60px; height: 60px; background: var(--soft-mint); color: var(--emerald-green); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3>Message Received, ${name}!</h3>
          <p style="margin-top: 0.5rem; color: var(--text-muted);">Thank you for reaching out to STEEL UTENSILS. Our kitchenware consultant will get back to you within 24 hours.</p>
        </div>
      `;
      showToast('Thank you! Your message has been sent.');
    });

    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('.newsletter-input');
        if (input && input.value) {
          showToast('Thank you for subscribing to Steel Utensils updates!');
          input.value = '';
        }
      });
    });

    const bulkForm = document.querySelector('.bulk-order-form');
    bulkForm?.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Bulk enquiry submitted! Our wholesale manager will contact you.');
      bulkForm.reset();
    });
  }

  // --- Page Specific Interactive Elements ---
  function initPageSpecificInteractions() {
    // 1. Home 2: Kitchen Need Selector
    const needTabs = document.querySelectorAll('.selector-tab, .selector-card-btn');
    const needResultCard = document.querySelector('.selector-result-card');
    const needData = {
      'daily': {
        title: 'Daily Cooking Essentials',
        desc: 'Engineered for high-heat Indian cooking with heavy sandwich bases, durable loop handles, and quick thermal response for curries, dal, and boiling.',
        rec: 'Triply Kadai, Pressure Cooker & Topes',
        price: 'From ₹899',
        image: 'images/image-31.png'
      },
      'dining': {
        title: 'Family Dining Sets',
        desc: 'Complete mirror-finished stainless steel thali sets designed for comfortable daily family meals and hygienic dining.',
        rec: '16 to 24-Piece Dinner Thali Collections',
        price: 'From ₹2,499',
        image: 'images/image-12.png'
      },
      'storage': {
        title: 'Kitchen Organization & Canisters',
        desc: 'Airtight, insect-proof stainless steel canisters with clear view acrylic windows for pulses, grains, spices, and snacks.',
        rec: 'Graduated Airtight Canister Sets',
        price: 'From ₹1,199',
        image: 'images/image-81.png'
      },
      'serving': {
        title: 'Serving & Hosting Delights',
        desc: 'Handcrafted hammered handis, copper-rimmed bowls, and serving casseroles designed to keep dishes piping warm at the dining table.',
        rec: 'Hammered Handis & Covered Serving Dishes',
        price: 'From ₹1,499',
        image: 'images/image-32.png'
      },
      'wedding': {
        title: 'Wedding & Dowry Collections',
        desc: 'Comprehensive multi-piece steel kitchenware trunks featuring complete cookware, dining sets, storage drums, and pooja sets for bride gifting.',
        rec: '51 to 101-Piece Shagun Vivah Sets',
        price: 'From ₹11,999',
        image: 'images/image-149.png'
      },
      'gifting': {
        title: 'Gift Collections & Cutlery Sets',
        desc: 'Executive gift boxes with laser-cut velvet lining, gold-accented cutlery, and presentation packaging suitable for festivals and housewarmings.',
        rec: '24-Piece Gift Boxed Flatware Collections',
        price: 'From ₹1,299',
        image: 'images/image-66.png'
      }
    };

    needTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        needTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const key = tab.getAttribute('data-need');
        const info = needData[key];
        if (info && needResultCard) {
          needResultCard.style.opacity = '0';
          setTimeout(() => {
            needResultCard.querySelector('.need-result-title').textContent = info.title;
            needResultCard.querySelector('.need-result-desc').textContent = info.desc;
            needResultCard.querySelector('.need-result-rec').textContent = info.rec;
            needResultCard.querySelector('.need-result-price').textContent = info.price;
            needResultCard.querySelector('.need-result-img').src = info.image;
            needResultCard.style.opacity = '1';
          }, 200);
        }
      });
    });

    // 2. Home 2: Product Quality Hotspots
    const pins = document.querySelectorAll('.hotspot-pin');
    const infoItems = document.querySelectorAll('.hotspot-info-item');
    pins.forEach(pin => {
      pin.addEventListener('click', () => {
        const spot = pin.getAttribute('data-spot');
        pins.forEach(p => p.classList.remove('active'));
        pin.classList.add('active');
        infoItems.forEach(item => {
          if (item.getAttribute('data-spot') === spot) {
            item.classList.add('active');
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            item.classList.remove('active');
          }
        });
      });
    });

    // 3. Products Page: Filters & Sorting
    const catCheckboxes = document.querySelectorAll('.filter-cat-checkbox');
    const catPills = document.querySelectorAll('.cat-pill');
    const sortSelect = document.querySelector('.sort-select');
    const productGrid = document.querySelector('.catalogue-products-grid');
    const clearFilterBtn = document.querySelector('.btn-clear-filters');
    const priceMin = document.querySelector('.price-range-min');
    const priceMax = document.querySelector('.price-range-max');

    function filterCatalogue() {
      if (!productGrid) return;
      const selectedCats = Array.from(catCheckboxes)
        .filter(c => c.checked)
        .map(c => c.value);

      const activePill = document.querySelector('.cat-pill.active')?.getAttribute('data-cat') || 'all';
      const items = Array.from(productGrid.querySelectorAll('.product-card'));
      let visibleCount = 0;

      items.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        const cardPrice = parseFloat(card.getAttribute('data-price')) || 0;

        let matchesCat = true;
        if (activePill !== 'all' && cardCat !== activePill) {
          matchesCat = false;
        }
        if (selectedCats.length > 0 && !selectedCats.includes(cardCat)) {
          matchesCat = false;
        }

        if (matchesCat) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const countEl = document.querySelector('.catalogue-count-num');
      if (countEl) countEl.textContent = visibleCount;
    }

    catCheckboxes.forEach(c => c.addEventListener('change', filterCatalogue));
    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterCatalogue();
      });
    });

    sortSelect?.addEventListener('change', e => {
      if (!productGrid) return;
      const val = e.target.value;
      const items = Array.from(productGrid.querySelectorAll('.product-card'));

      items.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price')) || 0;
        const priceB = parseFloat(b.getAttribute('data-price')) || 0;
        if (val === 'price-low') return priceA - priceB;
        if (val === 'price-high') return priceB - priceA;
        if (val === 'rating') return (parseFloat(b.getAttribute('data-rating')) || 0) - (parseFloat(a.getAttribute('data-rating')) || 0);
        return 0;
      });

      items.forEach(item => productGrid.appendChild(item));
    });

    clearFilterBtn?.addEventListener('click', () => {
      catCheckboxes.forEach(c => c.checked = false);
      catPills.forEach(p => p.classList.remove('active'));
      catPills[0]?.classList.add('active');
      filterCatalogue();
    });

    // Handle incoming URL category parameter (e.g. products.html?category=Cookware)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam && catPills.length > 0) {
      const cleanParam = catParam.toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetPill = Array.from(catPills).find(p => {
        const cat = (p.getAttribute('data-cat') || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return cat === cleanParam || cat.includes(cleanParam) || cleanParam.includes(cat);
      });
      if (targetPill) {
        catPills.forEach(p => p.classList.remove('active'));
        targetPill.classList.add('active');
        filterCatalogue();
        const catalogueGrid = document.querySelector('.catalogue-products-grid');
        if (catalogueGrid) {
          setTimeout(() => {
            catalogueGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 200);
        }
      }
    }

    // 4. Wedding Builder Dynamic Calculation
    const weddingTypeSelect = document.querySelector('.wedding-builder-type');
    const weddingGuests = document.querySelector('.wedding-builder-pieces');
    const weddingPriceDisplay = document.querySelector('.wedding-estimate-price');
    const weddingSummaryItems = document.querySelector('.wedding-estimate-items');

    function updateWeddingEstimate() {
      if (!weddingTypeSelect || !weddingPriceDisplay) return;
      const basePrices = {
        'classic': 8999,
        'royal': 15999,
        'heritage': 24999
      };
      const type = weddingTypeSelect.value || 'classic';
      const pieces = parseInt(weddingGuests?.value) || 51;
      const multiplier = pieces === 101 ? 1.8 : (pieces === 75 ? 1.4 : 1.0);
      const estTotal = Math.round(basePrices[type] * multiplier);

      weddingPriceDisplay.textContent = `₹${estTotal.toLocaleString('en-IN')}`;
      if (weddingSummaryItems) {
        weddingSummaryItems.textContent = `${pieces} Stainless Steel Utensils (Dinner Thalis, Handis, Storage & Cutlery)`;
      }
    }

    weddingTypeSelect?.addEventListener('change', updateWeddingEstimate);
    weddingGuests?.addEventListener('change', updateWeddingEstimate);

    // 5. Service Expandable Modal
    const serviceViewBtns = document.querySelectorAll('.btn-service-view');
    const serviceModal = document.querySelector('.modal-service-details');
    serviceViewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        const desc = btn.getAttribute('data-desc');
        if (serviceModal) {
          serviceModal.querySelector('.service-modal-title').textContent = title;
          serviceModal.querySelector('.service-modal-desc').textContent = desc;
          serviceModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    serviceModal?.querySelector('.modal-close')?.addEventListener('click', () => {
      serviceModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // --- FAQ Accordion System ---
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    faqItems.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          faqItems.forEach(other => {
            if (other !== item && other.open) {
              other.open = false;
            }
          });
        }
      });
    });
  }

  // --- Toast System ---
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // Expose toast to global scope
  window.showToast = showToast;

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
