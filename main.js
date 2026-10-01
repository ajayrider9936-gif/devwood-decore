// ==========================================================================
// DEVWOOD DEKOR — Dynamic Data Layer (Supabase)
// --------------------------------------------------------------------------
// Products, Categories, Phone/Address — sab kuch Supabase database se aata
// hai. Admin panel (admin.html) se manage hota hai.
// Is file me koi hardcoded product, photo ya phone number NAHI hai.
// Supabase setup: SUPABASE-SETUP.md dekhein.
// ==========================================================================

let CATEGORIES = [];      // Supabase: categories (sirf active)
let SITE_SETTINGS = {};   // Supabase: settings
let PRODUCTS = [];        // Supabase: products (sirf active, category ke saath)

// chhote HTML-escape helpers
function escHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function escAttr(s) { return escHtml(s); }

// Supabase se saara data load karo — page render se PEHLE call hota hai
async function SiteInit() {
  const DB = window.DevwoodDB;
  if (!DB) throw new Error("js/db.js load nahi hua");
  const results = await Promise.all([
    DB.getSettings(),
    DB.getCategories(true),
    DB.getProducts(true),
  ]);
  SITE_SETTINGS = results[0] || {};
  CATEGORIES = results[1] || [];
  PRODUCTS = results[2] || [];
  STORE_CONFIG = {
    name: SITE_SETTINGS.site_name || "Devwood Dekor",
    phone: SITE_SETTINGS.phone || "",
    whatsappNumber: SITE_SETTINGS.whatsapp || "",
    address: SITE_SETTINGS.address || "",
    currency: "\u20B9",
  };
  applySettingsToPage();
}

// Settings ko page par lagao
// (data-stext / data-shref / data-ssrc / data-sbg / data-stel / data-swa)
function applySettingsToPage() {
  const S = SITE_SETTINGS;
  const get = function (k) { return S[k] || ""; };

  document.querySelectorAll("[data-stext]").forEach(function (el) {
    const key = el.getAttribute("data-stext");
    if (key === "hero_title") return; // neeche special handle hota hai
    const v = get(key);
    if (v) el.textContent = v;
  });

  // hero title: "X & Y" me Y wala hissa gold span me rehta hai
  document.querySelectorAll('[data-stext="hero_title"]').forEach(function (el) {
    const v = get("hero_title");
    if (!v) return;
    const parts = v.split(" & ");
    el.innerHTML = parts.length > 1
      ? escHtml(parts[0]) + ' & <span>' + escHtml(parts.slice(1).join(" & ")) + '</span>'
      : escHtml(v);
  });

  document.querySelectorAll("[data-shref]").forEach(function (el) {
    const v = get(el.getAttribute("data-shref"));
    if (v) el.href = v;
  });
  document.querySelectorAll("[data-ssrc]").forEach(function (el) {
    const v = get(el.getAttribute("data-ssrc"));
    if (v) {
      el.src = v;
      el.classList.remove("hidden-until-set");
    }
  });
  document.querySelectorAll("[data-sbg]").forEach(function (el) {
    const v = get(el.getAttribute("data-sbg"));
    if (v) {
      el.style.backgroundImage =
        "linear-gradient(rgba(18,10,6,0.86), rgba(18,10,6,0.86)), url('" + v.replace(/'/g, "%27") + "')";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
    }
  });
  document.querySelectorAll("[data-stel]").forEach(function (el) {
    const v = get(el.getAttribute("data-stel"));
    if (v) el.href = "tel:" + String(v).replace(/[^+\d]/g, "");
  });
  document.querySelectorAll("[data-swa]").forEach(function (el) {
    const wa = get("whatsapp");
    if (wa) {
      const msg = el.getAttribute("data-swa") || "";
      el.href = "https://wa.me/" + wa + (msg ? "?text=" + encodeURIComponent(msg) : "");
    }
  });

  const ann = document.getElementById("announcementBar");
  if (ann && !get("announcement")) ann.style.display = "none";

  if (S.site_name) document.title = document.title.replace(/Devwood Dekor/g, S.site_name);
}

// Home page: category cards dynamic render
function renderHomeCategories() {
  const grid = document.getElementById("homeCategoryGrid");
  if (!grid) return;
  if (!CATEGORIES.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted-text);">' +
      '<i class="fa-solid fa-layer-group" style="font-size:2rem;color:var(--gold-500);"></i>' +
      '<p style="margin-top:10px;">Categories jald aa rahi hain.</p></div>';
    return;
  }
  grid.innerHTML = CATEGORIES.map(function (c) {
    const count = PRODUCTS.filter(function (p) { return p.category === c.slug; }).length;
    const img = c.image_url
      ? '<img src="' + escAttr(c.image_url) + '" alt="' + escAttr(c.name) + '" class="category-img" loading="lazy">'
      : '<div class="category-img" style="display:flex;align-items:center;justify-content:center;background:var(--gold-100);color:var(--gold-600);font-size:2.6rem;"><i class="fa-solid fa-couch"></i></div>';
    return '<a href="shop.html?cat=' + escAttr(c.slug) + '" class="category-card">' + img +
      '<div class="category-card-overlay">' +
      '<h3 class="category-name">' + escHtml(c.name) + '</h3>' +
      '<span class="category-count">' + count + ' products <i class="fa-solid fa-arrow-right"></i></span>' +
      '</div></a>';
  }).join("");
}

// Shop page: category strip + filter tabs dynamic render
function renderShopFilters() {
  const strip = document.querySelector(".shop-category-strip");
  if (strip) {
    strip.innerHTML =
      '<button class="shop-cat-card" onclick="selectShopCategory(\'all\')" title="All Masterpieces">' +
      '<div style="font-size:1.6rem;color:var(--gold-500);margin-bottom:6px;"><i class="fa-solid fa-crown"></i></div>' +
      '<span>All Items</span></button>' +
      CATEGORIES.map(function (c) {
        const media = c.image_url
          ? '<img src="' + escAttr(c.image_url) + '" alt="" style="width:44px;height:44px;border-radius:50%;object-fit:cover;margin-bottom:6px;border:2px solid var(--gold-500);">'
          : '<div style="font-size:1.6rem;color:var(--gold-500);margin-bottom:6px;"><i class="fa-solid fa-couch"></i></div>';
        return '<button class="shop-cat-card" onclick="selectShopCategory(\'' + escAttr(c.slug) + '\')" title="' + escAttr(c.name) + '">' +
          media + '<span>' + escHtml(c.name) + '</span></button>';
      }).join("");
  }
  const tabs = document.querySelector(".filter-tabs");
  if (tabs) {
    tabs.innerHTML = '<button class="filter-tab shop-filter-btn active" data-filter="all">All Masterpieces</button>' +
      CATEGORIES.map(function (c) {
        return '<button class="filter-tab shop-filter-btn" data-filter="' + escAttr(c.slug) + '">' + escHtml(c.name) + '</button>';
      }).join("");
  }
}
/**
 * ==========================================================================
 * DEVWOOD DEKOR - SARDARSHAHAR, RAJASTHAN
 * ==========================================================================
 * APNE PRODUCT KAISE DALEIN / EDIT KAREIN:
 * 1. Naya product add karne ke liye product ki online image URL use karein
 * 2. Neeche diye gaye PRODUCTS array mein naya product add karein ya change karein:
 *    {
 *      id: "prod-11",
 *      name: "Aapke Product Ka Naam",
 *      category: "furniture" ya "antiques",
 *      price: 25000,
 *      originalPrice: 30000,
 *      badge: "New Arrival",
 *      isAntique: false,
 *      woodType: "Solid Sheesham Wood",
 *      dimensions: '60" L x 30" W x 30" H',
 *      finish: "Natural Honey Polish",
 *      image: "https://... (online image link)",
 *      description: "Product ke baare mein jaankari..."
 *    }
 * 3. Ya phir website par "Naya Product Add Karein" button par click karke direct form se bhi add kar sakte hain!
 * ==========================================================================
 */

// Official Store Details
let STORE_CONFIG = {
  name: "Devwood Dekor",
  phone: "+91 9783656009",
  whatsappNumber: "919783656009",
  address: "Taranagar Road, 1 KM from Sardarshahar Circle, Sardarshahar, Rajasthan",
  currency: "₹"
};

// ==========================================================================
// ==========================================================================
// ADMIN BRIDGE (Supabase Auth)
// --------------------------------------------------------------------------
// Admin login ab Supabase Authentication se hota hai — admin.html par.
// Yahan sirf: admin panel par bhejna + login state ke hisaab se header
// buttons dikhana/chhupana. Koi password is file me NAHI hai.
// ==========================================================================

function goToAdminPanel() {
  window.location.href = "admin.html";
}
window.goToAdminPanel = goToAdminPanel;

// Product add/edit/delete ab SIRF admin panel se hota hai (admin.html)

async function logoutAdmin() {
  try { await window.DevwoodDB.signOut(); } catch (e) {}
  showToast("Admin logout ho gaye");
  updateAdminUI();
}
window.logoutAdmin = logoutAdmin;

// Login hai ya nahi — us hisaab se admin buttons dikhao/chhupao
async function updateAdminUI() {
  let isAdmin = false;
  try {
    const user = await window.DevwoodDB.currentUser();
    isAdmin = !!user;
  } catch (e) { isAdmin = false; }
  document.querySelectorAll(".admin-only").forEach(function (el) { el.style.display = isAdmin ? "" : "none"; });
  document.querySelectorAll(".admin-login-btn").forEach(function (el) { el.style.display = isAdmin ? "none" : ""; });
  document.querySelectorAll(".admin-logout-btn").forEach(function (el) { el.style.display = isAdmin ? "" : "none"; });
  document.querySelectorAll(".admin-panel-link").forEach(function (el) { el.style.display = isAdmin ? "inline-flex" : "none"; });
}
window.updateAdminUI = updateAdminUI;


function getCategoryIcon(cat) {
  if (!cat) return "fa-solid fa-couch";
  const c = cat.toLowerCase();
  if (c.includes("dining")) return "fa-solid fa-utensils";
  if (c.includes("bed")) return "fa-solid fa-bed";
  if (c.includes("mandir") || c.includes("temple")) return "fa-solid fa-place-of-worship";
  if (c.includes("living") || c.includes("sofa") || c.includes("diwan")) return "fa-solid fa-couch";
  if (c.includes("table") || c.includes("coffee") || c.includes("desk")) return "fa-solid fa-table";
  if (c.includes("wardrobe") || c.includes("storage") || c.includes("almirah") || c.includes("box")) return "fa-solid fa-warehouse";
  if (c.includes("wall") || c.includes("decor") || c.includes("jharokha")) return "fa-solid fa-archway";
  if (c.includes("door")) return "fa-solid fa-door-closed";
  if (c.includes("brass") || c.includes("chest") || c.includes("antique")) return "fa-solid fa-box-archive";
  if (c.includes("office") || c.includes("study")) return "fa-solid fa-briefcase";
  return "fa-solid fa-crown";
}

// Default Products List - High quality Sheesham & Antique catalog
const BASE_PRODUCTS = [];




// ==========================================================================
// CART STATE MANAGEMENT
// ==========================================================================
let cart = [];

function initCart() {
  try {
    const savedCart = localStorage.getItem("devwood_cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (e) {
    console.error("Could not load cart from localStorage", e);
    cart = [];
  }
  updateCartBadge();
  renderCartDrawer();
}

function saveCart() {
  try {
    localStorage.setItem("devwood_cart", JSON.stringify(cart));
  } catch (e) {
    if (e.name === "QuotaExceededError" || e.code === 22) {
      showToast("Cart storage full! Kuch items hata de.");
      return;
    }
    console.error("Cart save error:", e);
  }
  updateCartBadge();
  renderCartDrawer();
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      woodType: product.woodType,
      qty: 1
    });
  }

  saveCart();
  showToast(`Added "${product.name}" to cart!`);
  openCartDrawer();
}

function updateQuantity(productId, delta) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;

  cart[itemIndex].qty += delta;
  if (cart[itemIndex].qty <= 0) {
    cart.splice(itemIndex, 1);
  }
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  showToast("Item removed from cart.");
}

function updateCartBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const badges = document.querySelectorAll(".cart-count-badge");
  badges.forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "flex" : "none";
  });
}

function renderCartDrawer() {
  const container = document.getElementById("cartItemsList");
  const subtotalEl = document.getElementById("cartSubtotalAmount");
  if (!container || !subtotalEl) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-couch"></i>
        <h4>Your cart is empty</h4>
        <p>Explore our handcrafted furniture and rare antique collection.</p>
        <a href="shop.html" class="btn btn-gold" style="margin-top: 15px;">Browse Shop</a>
      </div>
    `;
    subtotalEl.textContent = `${STORE_CONFIG.currency}0`;
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    return `
      <div class="cart-item">
        ${item.image
          ? `<img src="${item.image}" alt="${item.name}" class="cart-item-img">`
          : `<div class="cart-item-placeholder"><i class="fa-solid fa-crown"></i></div>`
        }
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${STORE_CONFIG.currency}${item.price.toLocaleString('en-IN')}</div>
          <div class="cart-qty-control">
            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)" title="Decrease">
              <i class="fa-solid fa-minus"></i>
            </button>
            <span class="qty-number">${item.qty}</span>
            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)" title="Increase">
              <i class="fa-solid fa-plus"></i>
            </button>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove Item">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  subtotalEl.textContent = `${STORE_CONFIG.currency}${subtotal.toLocaleString('en-IN')}`;
}

// ==========================================================================
// WHATSAPP ENQUIRY & CHECKOUT INTEGRATION
// ==========================================================================
function checkoutViaWhatsApp() {
  if (cart.length === 0) {
    showToast("Cart is empty! Add products first.");
    return;
  }

  let totalAmount = 0;
  let orderItemsText = "";

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    totalAmount += itemTotal;
    orderItemsText += `${index + 1}. *${item.name}*\n   Qty: ${item.qty} | Price: â‚¹${item.price.toLocaleString('en-IN')}\n`;
  });

  const message = 
`*à¤¨à¤®à¤¸à¥à¤¤à¥‡ Devwood Dekor!* ðŸª‘
Main aapki website se furniture / antique items ka order confirm karna chahta hoon:

*ORDER ITEMS:*
${orderItemsText}
*TOTAL ORDER VALUE:* â‚¹${totalAmount.toLocaleString('en-IN')}

*Delivery Address:* Sardarshahar / Other City
Kripya stock availability, dispatch time aur delivery process share karein.
Dhanyawaad!`;

  const encodedUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, "_blank");
}

function enquireOnWhatsApp(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const message = 
`*à¤¨à¤®à¤¸à¥à¤¤à¥‡ Devwood Dekor!* ðŸª‘
Mujhe aapke iss product mein interest hai:

*Product:* ${product.name}
*Price:* â‚¹${product.price.toLocaleString('en-IN')}
*Wood / Material:* ${product.woodType}
*Dimensions:* ${product.dimensions}

Kripya iska availability, photo/video aur delivery details Sardarshahar se share karein.
Dhanyawaad!`;

  const encodedUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, "_blank");
}

// ==========================================================================
// QUICK VIEW MODAL
// ==========================================================================
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modalBackdrop = document.getElementById("quickViewModal");
  const modalContent = document.getElementById("quickViewContent");
  if (!modalBackdrop || !modalContent) return;

  modalContent.innerHTML = `
    <div class="modal-img-col">
      ${product.image
        ? `<img src="${product.image}" alt="${escAttr(product.name)}">`
        : `<div class="quickview-placeholder-box">
             <i class="${getCategoryIcon(product.subcategory || product.category)}"></i>
             <h4>DEVWOOD DEKOR</h4>
             <p>Solid Sheesham & Royal Antiques</p>
           </div>`
      }
    </div>
    <div class="modal-body-col">
      ${product.badge ? `<div style="margin-bottom: 12px;">
        <span class="product-badge ${product.isAntique ? 'antique' : ''}">${escHtml(product.badge)}</span>
      </div>` : ""}
      <h2 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--wood-900); margin-bottom: 10px;">${escHtml(product.name)}</h2>
      ${product.woodType ? `<div style="font-size: 0.85rem; color: var(--gold-600); font-weight: 700; text-transform: uppercase; margin-bottom: 14px;">
        ${escHtml(product.woodType)}
      </div>` : ""}
      <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px;">
        <span style="font-size: 1.6rem; font-weight: 800; color: var(--wood-900);">
          ${STORE_CONFIG.currency}${product.price.toLocaleString('en-IN')}
        </span>
        <span style="font-size: 1rem; color: #998a82; text-decoration: line-through;">
          ${product.originalPrice ? STORE_CONFIG.currency + product.originalPrice.toLocaleString('en-IN') : ""}
        </span>
      </div>
      ${product.description ? `<p style="font-size: 0.95rem; color: var(--muted-text); line-height: 1.65; margin-bottom: 20px;">
        ${escHtml(product.description)}
      </p>` : ""}
      <div style="background: var(--cream-100); padding: 14px; border-radius: 8px; margin-bottom: 24px; font-size: 0.85rem; line-height: 1.6;">
        ${product.dimensions ? `<div><strong>Dimensions:</strong> ${escHtml(product.dimensions)}</div>` : ""}
        ${product.finish ? `<div><strong>Finish:</strong> ${escHtml(product.finish)}</div>` : ""}
        <div><strong>Origin:</strong> Sardarshahar, Rajasthan</div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <button class="btn btn-primary" onclick="addToCart('${product.id}')">
          <i class="fa-solid fa-cart-shopping"></i> Add to Cart
        </button>
        <button class="btn btn-whatsapp-order" onclick="enquireOnWhatsApp('${product.id}')">
          <i class="fa-brands fa-whatsapp"></i> WhatsApp Enquiry
        </button>
      </div>
    </div>
  `;

  modalBackdrop.classList.add("active");
}

function closeQuickView() {
  const modalBackdrop = document.getElementById("quickViewModal");
  if (modalBackdrop) {
    modalBackdrop.classList.remove("active");
  }
}

// ==========================================================================
// DRAWER TOGGLES & NOTIFICATIONS
// ==========================================================================
function openCartDrawer() {
  document.getElementById("cartDrawer")?.classList.add("active");
  document.getElementById("cartBackdrop")?.classList.add("active");
}

function closeCartDrawer() {
  document.getElementById("cartDrawer")?.classList.remove("active");
  document.getElementById("cartBackdrop")?.classList.remove("active");
}

function toggleMobileMenu() {
  const drawer = document.getElementById("mobileNavDrawer");
  drawer?.classList.toggle("active");
}

function showToast(message) {
  let toast = document.getElementById("devwoodToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "devwoodToast";
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--gold-400);"></i> <span>${message}</span>`;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// ==========================================================================
// PRODUCT CARD RENDERER
// ==========================================================================
function createProductCardHTML(product) {
  return `
    <div class="product-card" data-category="${product.category}" data-price="${product.price}">
      ${product.badge ? `<div class="product-badge-wrap">
        <span class="product-badge ${product.isAntique ? 'antique' : ''}">${escHtml(product.badge)}</span>
      </div>` : ""}
      <div class="product-img-wrap">
        ${product.image
          ? `<img src="${product.image}" alt="${escAttr(product.name)}" class="product-img" loading="lazy">`
          : `<div class="product-placeholder-card">
               <div class="placeholder-icon-wrap">
                 <i class="${getCategoryIcon(product.subcategory || product.category)}"></i>
               </div>
               <span class="placeholder-brand">DEVWOOD DEKOR</span>
               <span class="placeholder-tag">Solid Sheesham Woodcraft</span>
             </div>`
        }
        <div class="product-quick-actions">
          <button class="quick-view-btn" onclick="openQuickView('${product.id}')">
            <i class="fa-solid fa-eye"></i> Quick View
          </button>
        </div>
      </div>
      <div class="product-details">
        <div class="product-category-row">
          <span class="product-category">${escHtml(product.categoryName || "Solid Wood")}</span>
          ${product.reviewsCount > 0 ? `<div class="product-rating">
            <i class="fa-solid fa-star"></i>
            <span>${product.rating}</span>
            <span style="color: var(--muted-text); font-size: 0.72rem;">(${product.reviewsCount})</span>
          </div>` : ""}
        </div>
        <h3 class="product-title">${escHtml(product.name)}</h3>
        ${product.woodType ? `<div class="product-spec">
          <i class="fa-solid fa-shield-halved"></i>
          <span>${escHtml(product.woodType.split('(')[0])}</span>
        </div>` : ""}
        <div class="product-pricing">
          <span class="price-current">${STORE_CONFIG.currency}${product.price.toLocaleString('en-IN')}</span>
          ${product.originalPrice ? `<span class="price-old">${STORE_CONFIG.currency}${product.originalPrice.toLocaleString('en-IN')}</span>` : ""}
        </div>
        <div class="product-btn-group">
          <button class="btn-add-cart" onclick="addToCart('${product.id}')">
            <i class="fa-solid fa-plus"></i> Add to Cart
          </button>
          <button class="btn-whatsapp-order" onclick="enquireOnWhatsApp('${product.id}')" title="Direct WhatsApp Enquiry">
            <i class="fa-brands fa-whatsapp"></i> Enquire
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// PAGE INITIALIZATIONS
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  initCart();
  try {
    await SiteInit();
  } catch (e) {
    console.error("Supabase data load fail:", e);
    showToast("Website ka data load nahi ho paya. Internet check karke page refresh karein.");
  }
  renderHomeCategories();
  renderShopFilters();
  updateAdminUI();

  // Scroll Header Effect
  const header = document.querySelector(".main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  });

  // Render Featured Products on Home Page
  const featuredContainer = document.getElementById("featuredProductsGrid");
  if (featuredContainer) {
    if (PRODUCTS.length === 0) {
      featuredContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 24px; background: #fff; border-radius: 14px; border: 2px dashed var(--gold-500); box-shadow: var(--shadow-sm);">
          <i class="fa-solid fa-couch" style="font-size: 3rem; color: var(--gold-500); margin-bottom: 16px;"></i>
          <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--wood-900);">Abhi Koi Product Upload Nahi Hai</h3>
          <p style="color: var(--muted-text); margin: 8px 0 22px 0;">Apni gallery se photos ke sath naye products add karne ke liye neeche diye button par click karein.</p>
          <a href="admin.html" class="btn btn-gold">
            <i class="fa-solid fa-plus-circle"></i> + Naya Product Dalein
          </a>
        </div>
      `;
    } else {
      const featuredItems = PRODUCTS.slice(0, 6);
      featuredContainer.innerHTML = featuredItems.map(createProductCardHTML).join('');
    }
  }

  // Shop Page Catalog & Live Filtering
  const shopGrid = document.getElementById("shopProductsGrid");
  if (shopGrid) {
    let currentCategory = "all";
    let searchQuery = "";
    let sortMode = "default";

    function filterAndRender() {
      let filtered = PRODUCTS.filter(item => {
        const matchesCategory = currentCategory === "all" || item.category === currentCategory || item.subcategory === currentCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.woodType.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      if (sortMode === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortMode === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortMode === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      if (filtered.length === 0) {
        shopGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 24px; background: #fff; border-radius: 14px; border: 2px dashed var(--gold-500); box-shadow: var(--shadow-sm);">
            <i class="fa-solid fa-plus-circle" style="font-size: 3.2rem; color: var(--gold-500); margin-bottom: 16px;"></i>
            <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--wood-900);">Abhi Koi Product Upload Nahi Hai</h3>
            <p style="color: var(--muted-text); margin: 8px 0 22px 0;">Apna pehla product gallery photo ke sath yahan publish karein.</p>
            <a href="admin.html" class="btn btn-gold">
              <i class="fa-solid fa-plus"></i> + Naya Product Dalein
            </a>
          </div>
        `;
      } else {
        shopGrid.innerHTML = filtered.map(createProductCardHTML).join('');
      }

      const countEl = document.getElementById("shopResultsCount");
      if (countEl) countEl.textContent = `Showing ${filtered.length} creations`;
    }

    window.refreshShopProducts = filterAndRender;

    // Filter Tabs
    const filterButtons = document.querySelectorAll(".shop-filter-btn");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.getAttribute("data-filter") || "all";
        filterAndRender();
      });
    });

    // Search Input
    const searchInput = document.getElementById("shopSearchInput");
    searchInput?.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      filterAndRender();
    });

    // Sort Select
    const sortSelect = document.getElementById("shopSortSelect");
    sortSelect?.addEventListener("change", (e) => {
      sortMode = e.target.value;
      filterAndRender();
    });

    // Check URL parameters for category filter (e.g. shop.html?cat=dining)
    const urlParams = new URLSearchParams(window.location.search);
    const catFromUrl = urlParams.get("cat");
    if (catFromUrl) {
      const matchingBtn = Array.from(filterButtons).find(btn => btn.getAttribute("data-filter") === catFromUrl);
      if (matchingBtn) {
        filterButtons.forEach(b => b.classList.remove("active"));
        matchingBtn.classList.add("active");
        currentCategory = catFromUrl;
      }
    }

    // Helper for visual category cards strip
    window.selectShopCategory = function(catKey) {
      const btn = document.querySelector(`.shop-filter-btn[data-filter="${catKey}"]`);
      if (btn) {
        btn.click();
      }
    };

    // Initial render
    filterAndRender();
  }

  // Contact Form Submission
  const contactForm = document.getElementById("devwoodContactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contactName")?.value;
      const phone = document.getElementById("contactPhone")?.value;
      const city = document.getElementById("contactCity")?.value;
      const interest = document.getElementById("contactInterest")?.value;
      const message = document.getElementById("contactMessage")?.value;

      const whatsappText = 
`*à¤¨à¤®à¤¸à¥à¤¤à¥‡ Devwood Dekor (Website Enquiry)*
*Name:* ${name}
*Phone:* ${phone}
*City:* ${city}
*Looking For:* ${interest}
*Message / Requirements:*
${message}

Sardarshahar showroom se enquiry details aur catalogue send karein.`;

      const encodedUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
      window.open(encodedUrl, "_blank");
      showToast("Thank you! Opening WhatsApp to send your inquiry.");
      contactForm.reset();
    });
  }

  // Keyboard Accessibility: Close modals/drawers with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeQuickView();
      closeCartDrawer();
      const mobileDrawer = document.getElementById("mobileNavDrawer");
      if (mobileDrawer?.classList.contains("active")) {
        toggleMobileMenu();
      }
      const adminModal = document.getElementById("devwoodAdminPinModal");
      if (adminModal?.classList.contains("active")) {
        adminModal.classList.remove("active");
      }
    }
  });

  // Close modals when clicking backdrop
  document.getElementById("quickViewModal")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeQuickView();
  });
  document.getElementById("cartBackdrop")?.addEventListener("click", closeCartDrawer);

  // Newsletter Form
  const newsletterForms = document.querySelectorAll(".newsletter-form");
  newsletterForms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Thank you for subscribing to Devwood Dekor updates!");
      form.reset();
    });
  });
});

