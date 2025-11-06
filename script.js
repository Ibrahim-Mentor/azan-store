// Wait for the DOM to be fully loaded before running any script
document.addEventListener("DOMContentLoaded", () => {

  // Global state
  let cart = [];

  // --- Element Selectors ---
  const cartBtn = document.getElementById("cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartListContainer = document.getElementById("cart-list-container");
  const subtotalEl = document.getElementById("subtotal");
  const cartItemCountEl = document.getElementById("cart-item-count");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileNav = document.getElementById("mobile-nav");
  const checkoutBtn = document.querySelector(".checkout-btn");

  // --- Cart Functionality ---
  
  /**
   * Opens the cart sidebar and overlay
   */
  function openCart() {
    cartSidebar.classList.add("show");
    cartOverlay.classList.add("show");
  }

  /**
   * Closes the cart sidebar and overlay
   */
  function closeCart() {
    cartSidebar.classList.remove("show");
    cartOverlay.classList.remove("show");
  }

  /**
   * Adds an item to the cart array and updates the UI
   * @param {string} product - The name of the product
   * @param {number} price - The price of the product
   */
  function addToCart(product, price) {
    // Check if item is already in cart
    const existingItemIndex = cart.findIndex(item => item.name === product);
    
    if (existingItemIndex > -1) {
      // For this simple cart, we'll just alert. A real store would add quantity.
      alert("This item is already in your bag!");
    } else {
      cart.push({ name: product, price: price });
    }
    
    updateCart();
    openCart();
  }

  /**
   * Removes an item from the cart array and updates the UI
   * @param {number} index - The index of the item to remove
   */
  function removeFromCart(index) {
    // Remove the item at the specified index
    cart.splice(index, 1);
    updateCart();
  }

  /**
   * Updates the cart UI based on the cart array
   */
  function updateCart() {
    // Clear the current cart list
    cartListContainer.innerHTML = "";
    
    let subtotal = 0;

    if (cart.length === 0) {
      // Show empty cart message
      cartListContainer.innerHTML = '<p id="cart-empty-msg">Your bag is empty.</p>';
      cartItemCountEl.classList.remove("visible");
      cartItemCountEl.textContent = "0";
    } else {
      // Add each item to the cart list
      cart.forEach((item, index) => {
        subtotal += item.price;
        
        // Find the product card to get the image source
        const productBtn = Array.from(addToCartButtons).find(btn => btn.dataset.product === item.name);
        const productCard = productBtn ? productBtn.closest('.product-card') : null;
        let imgSrc = 'https://via.placeholder.com/90'; // Fallback image
        if (productCard) {
            const imgEl = productCard.querySelector('img');
            if (imgEl) imgSrc = imgEl.src;
        }

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
          <img src="${imgSrc}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span class="price">$${item.price.toFixed(2)}</span>
            <button class="remove-item-btn" data-index="${index}">Remove</button>
          </div>
        `;
        cartListContainer.appendChild(cartItem);
      });

      // Update cart count
      cartItemCountEl.textContent = cart.length;
      cartItemCountEl.classList.add("visible");
    }

    // Update subtotal
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  // --- Slider Functionality ---
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".slider-nav.next");
  const prevBtn = document.querySelector(".slider-nav.prev");
  const dots = document.querySelectorAll(".dot");
  
  let currentSlide = 0;
  let slideInterval;

  function showSlide(n) {
    if (slides.length === 0) return; // Guard clause
    
    // Handle wrap-around
    if (n >= slides.length) { currentSlide = 0; }
    if (n < 0) { currentSlide = slides.length - 1; }

    // Hide all slides and deactivate all dots
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    // Animate slide content
    slides.forEach((slide, index) => {
        const content = slide.querySelector('.slide-content');
        if (content) {
            content.removeAttribute('data-animate'); // Remove for reset
            content.classList.remove('is-visible');
        }
    });

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
    
    // Trigger animation for the active slide's content
    const activeContent = slides[currentSlide].querySelector('.slide-content');
    if (activeContent) {
        // Use a tiny timeout to allow the browser to reset the animation
        setTimeout(() => {
            activeContent.setAttribute('data-animate', ''); // Re-add
            activeContent.classList.add('is-visible');
        }, 50);
    }
  }

  function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
  }

  function startSlideShow() {
    // Clear any existing interval
    clearInterval(slideInterval);
    // Start a new one
    slideInterval = setInterval(nextSlide, 5000); // 5 seconds
  }

  // --- Mobile Navigation ---
  function toggleMobileNav() {
    mobileNav.classList.toggle("show");
    // Toggle hamburger icon
    const icon = hamburgerBtn.querySelector("i");
    if (mobileNav.classList.contains("show")) {
      icon.classList.remove("fa-bars-staggered");
      icon.classList.add("fa-xmark");
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars-staggered");
    }
  }

  // --- Event Listeners ---

  // Cart
  cartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  // Add to Cart Buttons
  addToCartButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card click
      const product = button.dataset.product;
      const price = parseFloat(button.dataset.price);
      addToCart(product, price);
    });
  });

  // Remove from Cart (using event delegation)
  cartListContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item-btn")) {
      const index = parseInt(e.target.dataset.index, 10);
      removeFromCart(index);
    }
  });
  
  // Checkout Button (placeholder alert)
  checkoutBtn.addEventListener("click", () => {
    alert("Checkout page coming soon!");
  });

  // Slider
  if (slides.length > 0) {
    nextBtn.addEventListener("click", () => { nextSlide(); startSlideShow(); });
    prevBtn.addEventListener("click", () => { prevSlide(); startSlideShow(); });
    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        currentSlide = parseInt(dot.dataset.slide, 10);
        showSlide(currentSlide);
        startSlideShow();
      });
    });
    showSlide(0); // Show first slide
    startSlideShow(); // Start auto-play
  }
  
  // Mobile Navigation
  hamburgerBtn.addEventListener("click", toggleMobileNav);
  // Close mobile nav when a link is clicked
  mobileNav.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', toggleMobileNav);
  });

  // --- NEW: SCROLL ANIMATION OBSERVER ---
  const animatedElements = document.querySelectorAll("[data-animate]");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add delay if data-delay attribute exists
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, parseInt(delay, 10));
        
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.1 // Trigger when 10% of the element is visible
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });

  // Initialize cart on page load (to show empty message)
  updateCart();

});