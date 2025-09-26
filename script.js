// Initialize search functionality
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const products = document.querySelectorAll('.product');
  const noResults = document.querySelector('.no-results');

  if (!searchInput || !products.length) return;

  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    let matchesFound = false;

    products.forEach(product => {
      if (product.classList.contains('no-results')) return;

      const productName = product.dataset.name.toLowerCase();
      const productPrice = product.dataset.price;

      // Check if search term matches product name or price
      if (productName.includes(searchTerm) ||
          productPrice.includes(searchTerm) ||
          `$${productPrice}`.includes(searchTerm)) {
        product.classList.remove('hidden');
        matchesFound = true;
      } else {
        product.classList.add('hidden');
      }
    });

    // Show/hide no results message
    if (noResults) {
      noResults.style.display = matchesFound ? 'none' : 'block';
    }
  });
}

// Cart functionality
function initCart() {
  // Get DOM elements
  const cartIcon = document.querySelector('.cart-icon');
  const cartDropdown = document.querySelector('.cart-dropdown');
  const cartItemsContainer = document.querySelector('.cart-items');
  const totalAmountElement = document.querySelector('.total-amount');
  const emptyCartElement = document.querySelector('.empty-cart');
  const checkoutBtn = document.querySelector('.checkout-btn');

  // Initialize cart from localStorage
  let cart = JSON.parse(localStorage.getItem('falccart')) || [];

  // Toggle cart dropdown
  cartIcon.addEventListener('click', function(e) {
    e.stopPropagation();
    cartDropdown.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
      cartDropdown.classList.remove('active');
    }
  });

  function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');

    // Calculate total items
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCount.textContent = totalItems;
  }

  function renderCartItems() {
    // Clear current items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      emptyCartElement.style.display = 'block';
      totalAmountElement.textContent = '$0.00';
      return;
    }

    emptyCartElement.style.display = 'none';

    let totalPrice = 0;

    // Add each item to the cart dropdown
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.dataset.id = item.id;

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-size">Size: ${item.size}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-quantity">
            <span>Qty: ${item.quantity}</span>
            <span class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash"></i></span>
          </div>
        </div>
      `;

      cartItemsContainer.appendChild(cartItem);
    });

    // Update total amount
    totalAmountElement.textContent = `$${totalPrice.toFixed(2)}`;

    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        const itemId = parseInt(this.dataset.id);
        removeFromCart(itemId);
      });
    });
  }

  function removeFromCart(itemId) {
    // Filter out the item to remove
    cart = cart.filter(item => item.id !== itemId);

    // Save to localStorage
    localStorage.setItem('falccart', JSON.stringify(cart));

    // Update cart display
    updateCartDisplay();

    // Refresh cart dropdown
    renderCartItems();

    // If cart is empty, hide the dropdown
    if (cart.length === 0) {
      cartDropdown.classList.remove('active');
    }
  }

  // Checkout button
  checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // In a real implementation, this would redirect to checkout page
    alert('Proceeding to checkout...');
    // window.location.href = '/checkout';
  });

  // Initial render
  renderCartItems();
}

// Create 3D Sphere
function initSphere() {
  const sphere = document.getElementById('sphere');
  if (!sphere) return;

  const numPoints = 100;

  for (let i = 0; i < numPoints; i++) {
    const point = document.createElement('div');
    point.classList.add('sphere-point');

    // Spherical coordinates
    const phi = Math.acos(-1 + (2 * i) / numPoints);
    const theta = Math.sqrt(numPoints * Math.PI) * phi;

    // Convert to Cartesian coordinates
    const radius = 350;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    point.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    sphere.appendChild(point);
  }

  // Parallax Effect on Sphere
  document.addEventListener('mousemove', (e) => {
    const sphere = document.getElementById('sphere');
    if (!sphere) return;
    
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    sphere.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  });
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize search functionality
  initSearch();

  // Initialize cart functionality
  initCart();

  // Initialize 3D sphere
  initSphere();
});