// Mobile menu toggle for smaller screens.
const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Smooth scrolling for anchor links.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (!targetSection) {
      return;
    }

    event.preventDefault();
    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    siteNav?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// Simple contact form validation.
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const whatsappNumber = "917416687074";

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const queryInput = document.getElementById("query");

    const nameError = document.getElementById("name-error");
    const phoneError = document.getElementById("phone-error");
    const queryError = document.getElementById("query-error");

    let isValid = true;
    const phoneValue = phoneInput.value.replace(/[^\d+]/g, "");

    nameError.textContent = "";
    phoneError.textContent = "";
    queryError.textContent = "";
    formStatus.textContent = "";

    if (!nameInput.value.trim()) {
      nameError.textContent = "Please enter your name.";
      isValid = false;
    }

    if (phoneValue.length < 10) {
      phoneError.textContent = "Please enter a valid phone number.";
      isValid = false;
    }

    if (queryInput.value.trim().length < 10) {
      queryError.textContent = "Please enter at least 10 characters.";
      isValid = false;
    }

    if (!isValid) {
      formStatus.textContent = "Please correct the highlighted fields.";
      return;
    }

    const whatsappMessage = [
      "Hello, I would like to enquire about your products.",
      `Name: ${nameInput.value.trim()}`,
      `Phone: ${phoneInput.value.trim()}`,
      `Query: ${queryInput.value.trim()}`
    ].join("\n");

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener");
    formStatus.textContent = "Opening WhatsApp with your message.";
    contactForm.reset();
  });
}

// Fade-in animation as sections enter the viewport.
const revealElements = document.querySelectorAll(".reveal");
const videoEmbed = document.querySelector(".video-embed");

if (videoEmbed && window.location.protocol === "file:") {
  const videoId = videoEmbed.dataset.videoId;
  const videoUrl = videoEmbed.dataset.videoUrl;

  videoEmbed.innerHTML = `
    <a class="video-fallback" href="${videoUrl}" target="_blank" rel="noreferrer">
      <img
        src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg"
        alt="Watch The Dry Fruit Co. journey video on YouTube"
      >
      <span class="video-fallback-overlay">
        <span class="video-play-icon" aria-hidden="true">▶</span>
        <span>Watch on YouTube</span>
      </span>
    </a>
  `;
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Handle product search in shop.html
function searchProducts() {
  const searchInput = document.getElementById('product-search');
  const searchTerm = searchInput.value.toLowerCase().trim();
  const productCards = document.querySelectorAll('.product-card');
  let visibleCount = 0;

  if (!searchTerm) {
    // If search is empty, show all products
    productCards.forEach(card => {
      card.style.display = '';
    });
    return;
  }

  productCards.forEach(card => {
    const productName = card.querySelector('h3').textContent.toLowerCase();
    const productDescription = card.querySelector('p').textContent.toLowerCase();
    
    if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Show message if no products found
  const productGrid = document.querySelector('.product-grid');
  let noResultsMsg = document.querySelector('.no-results-message');
  
  if (visibleCount === 0) {
    if (!noResultsMsg) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.className = 'no-results-message';
      noResultsMsg.textContent = `No products found matching "${searchInput.value}". Try another search!`;
      productGrid.parentElement.appendChild(noResultsMsg);
    } else {
      noResultsMsg.textContent = `No products found matching "${searchInput.value}". Try another search!`;
      noResultsMsg.style.display = '';
    }
  } else {
    if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
  }
}

// Allow Enter key to trigger search
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        searchProducts();
      }
    });
  }
});

// Handle product order via WhatsApp
function orderNow(productName, imageClass) {
  const whatsappNumber = "917416687074";
  const currentUrl = window.location.href.split('?')[0]; // Remove any query params
  const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
  
  // Get the background image URL from the computed style
  const productCard = document.querySelector(`.${imageClass}`);
  let imageUrl = '';
  
  if (productCard) {
    const computedStyle = window.getComputedStyle(productCard);
    const backgroundImage = computedStyle.backgroundImage;
    
    // Extract URL from url("...") format
    if (backgroundImage && backgroundImage !== 'none') {
      imageUrl = backgroundImage.replace(/url\(['"]?([^'"()]+)['"]?\)/g, '$1');
      
      // Make image URL absolute if relative
      if (!imageUrl.startsWith('http')) {
        imageUrl = baseUrl + '/' + imageUrl;
      }
    }
  }
  
  const message = `Hi! I'm interested in ordering:\n\n*${productName}*${imageUrl ? `\n\nImage: ${imageUrl}` : ''}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener");
}

