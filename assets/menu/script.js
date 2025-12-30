/* ══════════════════════════════════════════════════════════════════════════
   Kahramana Baghdad — Professional Restaurant PWA Script
   - Dynamic menu + gallery from menu.json
   - Cart with WhatsApp checkout (dynamic branch number)
   - Language switcher (AR/EN) with RTL support
   - Branch selection with dynamic maps, phones, and WhatsApp
   - Image zoom lightbox
   - Mobile-optimized cart experience
   ══════════════════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  // ─────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────
  const $ = (sel, root = document) => {
    if (!sel || typeof sel !== "string") return null;
    const s = sel.trim();
    if (!s || s === "#") return null;
    try {
      return root.querySelector(s);
    } catch {
      return null;
    }
  };

  const $$ = (sel, root = document) => {
    if (!sel || typeof sel !== "string") return [];
    const s = sel.trim();
    if (!s || s === "#") return [];
    try {
      return Array.from(root.querySelectorAll(s));
    } catch {
      return [];
    }
  };

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const formatBD = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "";
    return `BD ${n.toFixed(3)}`;
  };

  const safeText = (v) => (typeof v === "string" ? v : "");

  // ─────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────
  const STORAGE = {
    lang: "kahramana_lang",
    branch: "kahramana_branch",
    theme: "kahramana_theme",
    cart: "kahramana_cart_v2",
  };

  let lang = "ar";
  let branch = "riffa"; // riffa | qalali
  let theme = "dark";

  let menuData = null; // {currency, dishes[], branches[], categories[]}
  let dishIndex = new Map(); // id -> dish
  let branchIndex = new Map(); // id -> branch
  let menuFilter = "all"; // all | main_dishes | grills | qass_and_shawarma

  // Cart model: [{id, qty}]
  let cart = [];

  // ─────────────────────────────────────────────────────────────────────────
  // I18N TRANSLATIONS
  // ─────────────────────────────────────────────────────────────────────────
  const I18N = {
    "skip": { ar: "انتقل إلى المحتوى", en: "Skip to content" },
    
    "nav.story": { ar: "قصتنا", en: "Our Story" },
    "nav.owner": { ar: "صاحب المطعم", en: "The Owner" },
    "nav.menu": { ar: "المنيو", en: "Menu" },
    "nav.mainDishes": { ar: "الأطباق الرئيسية", en: "Main Dishes" },
    "nav.testimonials": { ar: "التقييمات", en: "Reviews" },
    "nav.locations": { ar: "الفروع", en: "Locations" },
    "nav.contact": { ar: "تواصل", en: "Contact" },

    "hero.warning": { ar: "تنبيه:", en: "WARNING:" },
    "hero.subwarning": {
      ar: "هذا ليس مجرد مطعم عادي.",
      en: "THIS ISN'T JUST A TYPICAL RESTAURANT.",
    },
    "hero.title": {
      ar: "كرم عراقي أصيل، يُقدَّم بدفء الضيافة البحرينية",
      en: "AUTHENTIC IRAQI GENEROSITY, SERVED WITH BAHRAINI WARMTH",
    },
    "hero.ctaMenu": { ar: "عرض المنيو", en: "View Menu" },
    "hero.ctaStory": { ar: "قصتنا", en: "Our Story" },
    "hero.scroll": { ar: "تصفح", en: "Explore" },

    "story.kicker": { ar: "🏛️ قصة المطعم", en: "🏛️ Our Story" },
    "story.title": {
      ar: "كهرمانة بغداد: حكاية كرم تُروى على المائدة",
      en: "Kahramana Baghdad: A Story of Generosity Told at the Table",
    },
    "story.subtitle": {
      ar: "حين يلتقي إرث بغداد بدفء الضيافة البحرينية",
      en: "Where Baghdad's heritage meets Bahraini warmth",
    },
    "story.quote": {
      ar: '"كهرمانة بغداد ليس مجرد مطعم — إنه جسر بين حضارتين، ورحلة لذيذة تمزج أصالة المطبخ العراقي بدفء الضيافة البحرينية."',
      en: '"Kahramana Baghdad is not just a restaurant — it\'s a bridge between two cultures, a delicious journey blending Iraqi culinary authenticity with Bahraini warmth."',
    },
    "story.p1": {
      ar: "في قلب البحرين، نحكي قصة عراقية بدأت من شوارع بغداد الحيّة. كل طبق يحمل روح المطبخ العراقي الأصيل، من المسكوف المشوي على الجمر إلى القوزي اللذيذ الذي يذوب في الفم.",
      en: "In the heart of Bahrain, we tell an Iraqi story that began in the lively streets of Baghdad. Each dish carries the soul of authentic Iraqi cuisine, from masgouf grilled over charcoal to tender qozi that melts in your mouth.",
    },
    "story.p2": {
      ar: "منذ افتتاحنا، التزمنا بتقديم نكهات عراقية حقيقية وأصيلة، مستخدمين وصفات عريقة تتوارثها الأجيال، مع لمسة من الابتكار تناسب ذوق عصرنا. هنا، في كهرمانة بغداد، نؤمن بأن الطعام ليس مجرد وجبة — بل تجربة، وذكرى، وحكاية تُروى على مائدة مشتركة.",
      en: "Since our opening, we've committed to delivering authentic Iraqi flavors using time-honored recipes passed down through generations, with a touch of innovation to suit modern tastes. Here at Kahramana Baghdad, we believe food is more than a meal — it's an experience, a memory, and a story told at a shared table.",
    },
    "story.cta": { ar: "استكشف المنيو", en: "Explore Menu" },

    "owner.name": { ar: "عبدالله الجبوري", en: "Abdullah Al-Jubouri" },
    "owner.role": { ar: "المؤسس وصاحب المطعم", en: "Founder & Owner" },
    "owner.p1": {
      ar: "بدأت رحلتي مع الطبخ منذ الصغر في بغداد، حيث كنت أراقب أمي وجدتي وهما تحضران أشهى الأطباق التقليدية. تعلمت منهما سر التوابل، وفن الصبر، ومعنى الكرم الحقيقي.",
      en: "My culinary journey began as a child in Baghdad, watching my mother and grandmother prepare the finest traditional dishes. From them I learned the secrets of spices, the art of patience, and the true meaning of generosity.",
    },
    "owner.quote": {
      ar: '"الطبخ عندي ليس مهنة فقط — إنه رسالة لإحياء تراث بغداد وتقديم أطعمة تُفرح القلوب وتجمع الأحباب."',
      en: '"For me, cooking is not just a profession — it\'s a mission to revive Baghdad\'s heritage and offer food that gladdens hearts and gathers loved ones."',
    },
    "owner.p2": {
      ar: "في كهرمانة بغداد، نحرص على جودة المكونات، ونحترم الوصفة الأصلية، ونضيف لمسة من الحب في كل طبق. هدفنا أن يكون زائرنا ضيفاً عزيزاً يعود دائماً.",
      en: "At Kahramana Baghdad, we prioritize ingredient quality, respect traditional recipes, and add a touch of love to every dish. Our goal is for every visitor to be a cherished guest who always returns.",
    },

    "menu.kicker": { ar: "🍽️ القائمة", en: "🍽️ Menu" },
    "menu.title": { ar: "استكشف منيونا", en: "Explore Our Menu" },
    "menu.subtitle": {
      ar: "أطباق عراقية أصيلة بمكونات طازجة",
      en: "Authentic Iraqi dishes with fresh ingredients",
    },
    "menu.filterAll": { ar: "الكل", en: "All" },
    "menu.filterMainDishes": { ar: "الأطباق الرئيسية", en: "Main Dishes" },
    "menu.filterGrills": { ar: "المشويات", en: "Grills" },
    "menu.filterQass": { ar: "القص والشاورما", en: "Qass & Shawarma" },
    "menu.addToCart": { ar: "أضف للطلب", en: "Add to Cart" },
    "menu.inquire": { ar: "استفسر عن السعر", en: "Inquire Price" },
    "menu.spicy": { ar: "حار", en: "Spicy" },

    "gallery.title": { ar: "الأطباق الرئيسية", en: "Main Dishes" },
    "gallery.subtitle": {
      ar: "تصفح تشكيلتنا من الأطباق الشهيرة",
      en: "Browse our signature dishes collection",
    },

    "testimonials.kicker": { ar: "⭐ التقييمات", en: "⭐ Reviews" },
    "testimonials.title": { ar: "ماذا يقول عملاؤنا", en: "What Our Customers Say" },
    "testimonial1.text": {
      ar: '"المسكوف هنا هو الأفضل في البحرين! طعم أصيل وكأنك في بغداد. الخدمة ممتازة والأجواء رائعة."',
      en: '"The masgouf here is the best in Bahrain! Authentic taste like you\'re in Baghdad. Excellent service and wonderful atmosphere."',
    },
    "testimonial1.name": { ar: "أحمد الكويتي", en: "Ahmed Al-Kuwaiti" },
    "testimonial1.date": { ar: "نوفمبر 2024", en: "November 2024" },
    "testimonial2.text": {
      ar: '"أطباق عراقية حقيقية بنكهة لا تُنسى. القوزي والكباب كانا رائعين. سأعود بالتأكيد!"',
      en: '"Truly Iraqi dishes with unforgettable flavors. The qozi and kebab were amazing. I will definitely return!"',
    },
    "testimonial2.name": { ar: "فاطمة العلوي", en: "Fatima Al-Alawi" },
    "testimonial2.date": { ar: "ديسمبر 2024", en: "December 2024" },
    "testimonial3.text": {
      ar: '"تجربة رائعة! الطعام طازج ولذيذ، والأسعار معقولة. أنصح بتجربة المشاوي المشكلة."',
      en: '"Wonderful experience! Fresh and delicious food, reasonable prices. I recommend trying the mixed grills."',
    },
    "testimonial3.name": { ar: "محمد البحراني", en: "Mohammed Al-Bahrani" },
    "testimonial3.date": { ar: "ديسمبر 2024", en: "December 2024" },

    "contact.kicker": { ar: "📍 الفروع والتواصل", en: "📍 Locations & Contact" },
    "contact.title": { ar: "تعال وزرنا", en: "Come Visit Us" },
    "contact.intro": {
      ar: "نخدمك في فرعين في البحرين. اختر الفرع الأقرب إليك!",
      en: "We serve you at two locations in Bahrain. Choose the nearest branch!",
    },
    "contact.activeBranchLabel": { ar: "الفرع الحالي", en: "Current Branch" },
    "contact.call": { ar: "اتصل", en: "Call" },
    "contact.mapLabel": { ar: "الموقع", en: "Location" },
    "contact.mapBtn": { ar: "عرض على الخريطة", en: "View on Map" },
    "contact.whatsapp": { ar: "واتساب", en: "WhatsApp" },
    "contact.phoneLabel": { ar: "الهاتف", en: "Phone" },
    "contact.selectBranch": { ar: "اختر هذا الفرع", en: "Select This Branch" },
    "contact.hoursLabel": { ar: "ساعات العمل", en: "Hours" },
    "contact.hours": { ar: "11:00 ص – 11:00 م يومياً", en: "11:00 AM – 11:00 PM Daily" },
    "contact.fab": { ar: "واتساب", en: "WhatsApp" },

    "map.title": { ar: "موقعنا على الخريطة", en: "Our Location on Map" },
    "map.getDirections": { ar: "احصل على الاتجاهات", en: "Get Directions" },

    "branch.riffa": { ar: "فرع الرفاع (الحجيات)", en: "Riffa Branch (Hajiyat)" },
    "branch.qalali": { ar: "فرع قلالي (المحرق)", en: "Qalali Branch (Muharraq)" },

    "cart.title": { ar: "طلبك", en: "Your Order" },
    "cart.empty": { ar: "قائمة طلبك فارغة.", en: "Your cart is empty." },
    "cart.noteLabel": { ar: "ملاحظات", en: "Notes" },
    "cart.notePlaceholder": {
      ar: "أضف ملاحظات (بدون بصل، إلخ)",
      en: "Add notes (no onions, etc.)",
    },
    "cart.nameLabel": { ar: "الاسم", en: "Name" },
    "cart.namePlaceholder": { ar: "اسمك", en: "Your name" },
    "cart.addressLabel": { ar: "الموقع/العنوان", en: "Location/Address" },
    "cart.addressPlaceholder": {
      ar: "المنطقة، الشارع، المبنى، الشقة...",
      en: "Area, street, building, apartment...",
    },
    "cart.total": { ar: "الإجمالي", en: "Total" },
    "cart.clear": { ar: "مسح", en: "Clear" },
    "cart.send": { ar: "إرسال عبر واتساب", en: "Send via WhatsApp" },
    "cart.hint": {
      ar: "سيفتح واتساب مع رسالة جاهزة — يمكنك المراجعة والضغط على إرسال.",
      en: "WhatsApp will open with a ready message — you can review and press send.",
    },
    "cart.fab": { ar: "الطلب", en: "Cart" },

    "footer.direction": { ar: "الموقع الجغرافي", en: "Get Directions" },
    "footer.rights": {
      ar: "جميع الحقوق محفوظة © كهرمانة بغداد",
      en: "All Rights Reserved © Kahramana Baghdad",
    },

    "allergens.fish": { ar: "سمك", en: "Fish" },
    "allergens.nuts": { ar: "مكسرات", en: "Nuts" },
    "allergens.dairy": { ar: "ألبان", en: "Dairy" },
    "allergens.sesame": { ar: "سمسم", en: "Sesame" },
    "allergens.gluten": { ar: "جلوتين", en: "Gluten" },
  };

  const t = (key) => {
    const val = I18N[key];
    return val ? val[lang] || val["ar"] || key : key;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // LANGUAGE
  // ─────────────────────────────────────────────────────────────────────────
  const loadLang = () => {
    const saved = localStorage.getItem(STORAGE.lang);
    if (saved === "ar" || saved === "en") lang = saved;
    applyLang();
  };

  const applyLang = () => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    // Update all data-i18n elements
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });

    // Update placeholders
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.placeholder = t(key);
    });

    // Update lang toggle button
    const btn = $("#langToggle");
    if (btn) btn.textContent = lang === "ar" ? "EN" : "عربي";

    renderDynamicSections();
  };

  const toggleLang = () => {
    lang = lang === "ar" ? "en" : "ar";
    localStorage.setItem(STORAGE.lang, lang);
    applyLang();
  };

  const bindLangToggle = () => {
    const btn = $("#langToggle");
    if (btn) btn.addEventListener("click", toggleLang);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // THEME
  // ─────────────────────────────────────────────────────────────────────────
  const loadTheme = () => {
    const saved = localStorage.getItem(STORAGE.theme);
    if (saved === "dark" || saved === "light") theme = saved;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BRANCH MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────
  const loadBranch = () => {
    const saved = localStorage.getItem(STORAGE.branch);
    if (saved === "riffa" || saved === "qalali") branch = saved;
    applyBranchUI();
  };

  const applyBranchUI = () => {
    if (!menuData || !menuData.branches) return;

    const currentBranch = branchIndex.get(branch);
    if (!currentBranch) return;

    // Update active branch title
    const titleEl = $("#activeBranchTitleValue");
    if (titleEl) {
      titleEl.textContent = currentBranch.shortName?.[lang] || currentBranch.name?.[lang] || "";
    }

    // Update phone link
    const phoneLink = $("#activeBranchPhone");
    const phoneValue = $("#activeBranchPhoneValue");
    if (phoneLink && currentBranch.phone) {
      phoneLink.href = `tel:${currentBranch.phone}`;
      if (phoneValue) phoneValue.textContent = currentBranch.phone;
    }

    // Update map link
    const mapLink = $("#activeBranchMap");
    if (mapLink && currentBranch.googleMapsUrl) {
      mapLink.href = currentBranch.googleMapsUrl;
    }

    // Update WhatsApp link
    const waLink = $("#activeBranchWhatsApp");
    if (waLink && currentBranch.whatsapp) {
      waLink.href = `https://wa.me/${currentBranch.whatsapp}`;
    }

    // Update footer direction button
    const footerBtn = $("#footerDirection");
    if (footerBtn && currentBranch.googleMapsUrl) {
      footerBtn.href = currentBranch.googleMapsUrl;
      footerBtn.removeAttribute("aria-disabled");
    }

    // Update WhatsApp FAB
    const whatsappFab = $("#whatsappFab");
    if (whatsappFab && currentBranch.whatsapp) {
      whatsappFab.href = `https://wa.me/${currentBranch.whatsapp}`;
    }

    // Highlight selected branch buttons
    $$("[data-branch]").forEach((btn) => {
      const b = btn.getAttribute("data-branch");
      btn.classList.toggle("active", b === branch);
    });

    // ★ UPDATE DYNAMIC MAP EMBED
    updateBranchMap();
  };

  const updateBranchMap = () => {
    if (!menuData || !menuData.branches) return;

    const currentBranch = branchIndex.get(branch);
    if (!currentBranch) return;

    // Update map iframe
    const mapEmbed = $("#branchMapEmbed");
    if (mapEmbed && currentBranch.embedUrl) {
      mapEmbed.src = currentBranch.embedUrl;
    }

    // Update "Get Directions" button
    const directionsBtn = $("#mapDirectionsBtn");
    if (directionsBtn && currentBranch.googleMapsUrl) {
      directionsBtn.href = currentBranch.googleMapsUrl;
    }
  };

  const bindBranchButtons = () => {
    $$(".branch-select").forEach((btn) => {
      btn.addEventListener("click", () => {
        const b = btn.getAttribute("data-branch");
        if (b !== "riffa" && b !== "qalali") return;
        branch = b;
        localStorage.setItem(STORAGE.branch, branch);
        applyBranchUI();
        showToast(
          lang === "ar"
            ? `تم تغيير الفرع إلى: ${t("branch." + b)}`
            : `Branch changed to: ${t("branch." + b)}`
        );
      });
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // MENU DATA
  // ─────────────────────────────────────────────────────────────────────────
  const buildDishIndex = (dishes) => {
    dishIndex = new Map();
    for (const d of dishes) {
      if (!d || !d.id) continue;
      dishIndex.set(d.id, d);
    }
  };

  const buildBranchIndex = (branches) => {
    branchIndex = new Map();
    for (const b of branches) {
      if (!b || !b.id) continue;
      branchIndex.set(b.id, b);
    }
  };

  const fetchMenuData = async () => {
    try {
      const res = await fetch("./menu.json");
      if (!res.ok) throw new Error("Failed to fetch menu.json");
      const data = await res.json();
      if (!data || !Array.isArray(data.dishes)) {
        throw new Error("Invalid menu data structure");
      }
      return data;
    } catch (err) {
      console.error("[Kahramana] Menu fetch error:", err);
      showToast(
        lang === "ar"
          ? "حدث خطأ في تحميل المنيو. يرجى تحديث الصفحة."
          : "Error loading menu. Please refresh the page."
      );
      return { currency: "BD", dishes: [], branches: [], categories: [] };
    }
  };

  const getDishName = (dish) => {
    if (!dish || !dish.name) return "";
    return dish.name[lang] || dish.name["ar"] || "";
  };

  const getDishDesc = (dish) => {
    if (!dish || !dish.desc) return "";
    return dish.desc[lang] || dish.desc["ar"] || "";
  };

  const getDishPriceText = (dish) => {
    if (!dish) return "";
    if (Number.isFinite(dish.price)) return formatBD(dish.price);
    if (dish.priceLabel) return dish.priceLabel[lang] || dish.priceLabel["ar"] || "";
    return "";
  };

  const dishIsOrderable = (dish) => {
    return dish && Number.isFinite(dish.price) && dish.price > 0;
  };

  const renderGallery = () => {
    const grid = $("#galleryGrid");
    if (!grid || !menuData) return;

    grid.innerHTML = "";

    // Show main dishes category
    const mainDishes = menuData.dishes.filter((d) => d.category === "main_dishes");
    
    for (const dish of mainDishes) {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.role = "listitem";

      const img = document.createElement("img");
      img.src = dish.image || "assets/misc/placeholder.webp";
      img.alt = getDishName(dish);
      img.className = "gallery-img";
      img.loading = "lazy";
      img.decoding = "async";

      // Add click to zoom
      img.addEventListener("click", () => openLightbox(img.src, getDishName(dish)));

      const caption = document.createElement("p");
      caption.className = "gallery-caption";
      caption.textContent = getDishName(dish);

      item.appendChild(img);
      item.appendChild(caption);
      grid.appendChild(item);
    }
  };

  const renderMenuGrid = () => {
    const grid = $("#menuGrid");
    if (!grid || !menuData) return;

    grid.innerHTML = "";

    const filtered =
      menuFilter === "all"
        ? menuData.dishes
        : menuData.dishes.filter((d) => d.category === menuFilter);

    for (const dish of filtered) {
      const card = document.createElement("div");
      card.className = "menu-item card";
      card.role = "listitem";

      const media = document.createElement("div");
      media.className = "menu-item-media";

      const img = document.createElement("img");
      img.src = dish.image || "assets/misc/placeholder.webp";
      img.alt = getDishName(dish);
      img.className = "menu-item-img";
      img.loading = "lazy";
      img.decoding = "async";

      // Add click to zoom
      img.addEventListener("click", () => openLightbox(img.src, getDishName(dish)));

      media.appendChild(img);

      // Tags (Spicy/Allergens)
      if (dish.tags) {
        const tagWrap = document.createElement("div");
        tagWrap.className = "menu-tags";

        if (dish.tags.spicy) {
          const spicyTag = document.createElement("span");
          spicyTag.className = "menu-tag menu-tag-spicy";
          spicyTag.textContent = "🌶️ " + t("menu.spicy");
          tagWrap.appendChild(spicyTag);
        }

        if (Array.isArray(dish.tags.allergens) && dish.tags.allergens.length > 0) {
          dish.tags.allergens.forEach((allergen) => {
            const allergenTag = document.createElement("span");
            allergenTag.className = "menu-tag menu-tag-allergen";
            allergenTag.textContent = t("allergens." + allergen) || allergen;
            allergenTag.title =
              lang === "ar" ? `يحتوي على: ${allergenTag.textContent}` : `Contains: ${allergenTag.textContent}`;
            tagWrap.appendChild(allergenTag);
          });
        }

        if (tagWrap.children.length > 0) {
          media.appendChild(tagWrap);
        }
      }

      // Action buttons
      const actionWrap = document.createElement("div");
      actionWrap.className = "menu-item-actions";

      if (dishIsOrderable(dish)) {
        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "menu-add";
        addBtn.setAttribute("data-action", "add");
        addBtn.setAttribute("data-dish-id", dish.id);
        addBtn.textContent = t("menu.addToCart");
        actionWrap.appendChild(addBtn);
      } else {
        const askBtn = document.createElement("button");
        askBtn.type = "button";
        askBtn.className = "menu-inquire";
        askBtn.setAttribute("data-action", "inquire");
        askBtn.setAttribute("data-dish-id", dish.id);
        askBtn.textContent = t("menu.inquire");
        actionWrap.appendChild(askBtn);
      }

      media.appendChild(actionWrap);

      const body = document.createElement("div");
      body.className = "menu-item-body";

      const titleRow = document.createElement("div");
      titleRow.className = "menu-item-top";

      const name = document.createElement("h4");
      name.className = "menu-item-title";
      name.textContent = getDishName(dish);

      const price = document.createElement("div");
      price.className = "menu-item-price";
      price.textContent = getDishPriceText(dish);

      titleRow.appendChild(name);
      titleRow.appendChild(price);

      const desc = document.createElement("p");
      desc.className = "menu-item-desc";
      desc.textContent = getDishDesc(dish);

      body.appendChild(titleRow);
      body.appendChild(desc);

      card.appendChild(media);
      card.appendChild(body);

      grid.appendChild(card);
    }
  };

  const bindMenuFilters = () => {
    const wrap = $(".menu-filters");
    if (!wrap) return;

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".menu-filter");
      if (!btn) return;

      const filter = btn.getAttribute("data-filter");
      if (!filter) return;

      menuFilter = filter;
      $$(`.menu-filter`, wrap).forEach((b) => b.classList.toggle("active", b === btn));
      renderMenuGrid();
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // LIGHTBOX (IMAGE ZOOM)
  // ─────────────────────────────────────────────────────────────────────────
  const openLightbox = (src, alt) => {
    const existingLightbox = $("#lightbox");
    if (existingLightbox) existingLightbox.remove();

    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", alt || "Image zoom");

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    img.className = "lightbox-img";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "lightbox-close";
    closeBtn.textContent = "×";
    closeBtn.setAttribute("aria-label", lang === "ar" ? "إغلاق" : "Close");

    const closeLightbox = () => lightbox.remove();

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    // Keyboard support
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        closeLightbox();
        document.removeEventListener("keydown", handleKeydown);
      }
    };
    document.addEventListener("keydown", handleKeydown);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // WHATSAPP HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  const openWhatsApp = (message) => {
    const currentBranch = branchIndex.get(branch);
    const number = currentBranch?.whatsapp || "";
    const text = encodeURIComponent(message);
    const url = number
      ? `https://wa.me/${number}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const buildInquiryMessage = (dish) => {
    const dishName = getDishName(dish) || dish?.id || "";
    const br = t("branch." + branch);

    if (lang === "ar") {
      return `مرحباً 🌿\nأود الاستفسار عن سعر: ${dishName}\nالفرع: ${br}`;
    }

    return `Hi 🌿\nI'd like to inquire about the price of: ${dishName}\nBranch: ${br}`;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CART
  // ─────────────────────────────────────────────────────────────────────────
  const loadCart = () => {
    try {
      const raw =
        localStorage.getItem(STORAGE.cart) || localStorage.getItem("kahramana_cart");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      cart = parsed
        .map((it) => ({
          id: it?.id,
          qty: Number.isFinite(it?.qty)
            ? it.qty
            : Number.isFinite(it?.quantity)
            ? it.quantity
            : it?.qty,
        }))
        .filter((it) => typeof it.id === "string" && Number.isFinite(it.qty) && it.qty > 0)
        .map((it) => ({ id: it.id, qty: clamp(it.qty, 1, 99) }));

      saveCart();
    } catch {
      // ignore
    }
  };

  const saveCart = () => {
    try {
      localStorage.setItem(STORAGE.cart, JSON.stringify(cart));
    } catch {
      // ignore
    }
  };

  const cartCount = () => cart.reduce((acc, it) => acc + (it.qty || 0), 0);

  const cartTotal = () => {
    let total = 0;
    for (const it of cart) {
      const dish = dishIndex.get(it.id);
      if (!dish || !Number.isFinite(dish.price)) continue;
      total += dish.price * it.qty;
    }
    return total;
  };

  const addToCart = (dishId) => {
    const dish = dishIndex.get(dishId);
    if (!dish) return;

    if (!dishIsOrderable(dish)) {
      openWhatsApp(buildInquiryMessage(dish));
      return;
    }

    const existing = cart.find((x) => x.id === dishId);
    if (existing) existing.qty = clamp(existing.qty + 1, 1, 99);
    else cart.push({ id: dishId, qty: 1 });

    saveCart();
    renderCart();
    pulseCart();
    showToast(
      lang === "ar" ? `✅ تمت إضافة ${getDishName(dish)}` : `✅ ${getDishName(dish)} added`
    );
  };

  const updateCartQty = (dishId, delta) => {
    const item = cart.find((x) => x.id === dishId);
    if (!item) return;

    item.qty = clamp(item.qty + delta, 1, 99);
    saveCart();
    renderCart();
  };

  const removeFromCart = (dishId) => {
    cart = cart.filter((x) => x.id !== dishId);
    saveCart();
    renderCart();
  };

  const clearCart = () => {
    cart = [];
    saveCart();
    renderCart();
    showToast(lang === "ar" ? "تم مسح الطلب" : "Cart cleared");
  };

  const pulseCart = () => {
    const fab = $("#cartFab");
    if (fab) {
      fab.classList.add("pulse");
      setTimeout(() => fab.classList.remove("pulse"), 500);
    }
  };

  const renderCart = () => {
    const countEl = $("#cartCount");
    const emptyEl = $("#cartEmpty");
    const itemsEl = $("#cartItems");
    const totalEl = $("#cartTotal");

    const count = cartCount();

    if (countEl) {
      countEl.textContent = count;
      countEl.classList.toggle("show", count > 0);
    }

    if (emptyEl) emptyEl.style.display = cart.length ? "none" : "block";
    if (itemsEl) itemsEl.style.display = cart.length ? "block" : "none";

    if (itemsEl) {
      itemsEl.innerHTML = "";
      for (const it of cart) {
        const dish = dishIndex.get(it.id);
        if (!dish) continue;

        const li = document.createElement("li");
        li.className = "cart-item";

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("strong");
        name.className = "cart-item-name";
        name.textContent = getDishName(dish);

        const price = document.createElement("span");
        price.className = "cart-item-price";
        price.textContent = getDishPriceText(dish);

        info.appendChild(name);
        info.appendChild(price);

        const controls = document.createElement("div");
        controls.className = "cart-item-controls";

        const minusBtn = document.createElement("button");
        minusBtn.type = "button";
        minusBtn.className = "cart-qty-btn";
        minusBtn.textContent = "−";
        minusBtn.setAttribute("aria-label", lang === "ar" ? "تقليل الكمية" : "Decrease quantity");
        minusBtn.addEventListener("click", () => {
          if (it.qty <= 1) removeFromCart(it.id);
          else updateCartQty(it.id, -1);
        });

        const qtySpan = document.createElement("span");
        qtySpan.className = "cart-qty";
        qtySpan.textContent = it.qty;

        const plusBtn = document.createElement("button");
        plusBtn.type = "button";
        plusBtn.className = "cart-qty-btn";
        plusBtn.textContent = "+";
        plusBtn.setAttribute("aria-label", lang === "ar" ? "زيادة الكمية" : "Increase quantity");
        plusBtn.addEventListener("click", () => updateCartQty(it.id, 1));

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "cart-remove-btn";
        removeBtn.textContent = "✕";
        removeBtn.setAttribute("aria-label", lang === "ar" ? "حذف من الطلب" : "Remove from cart");
        removeBtn.addEventListener("click", () => removeFromCart(it.id));

        controls.appendChild(minusBtn);
        controls.appendChild(qtySpan);
        controls.appendChild(plusBtn);
        controls.appendChild(removeBtn);

        li.appendChild(info);
        li.appendChild(controls);
        itemsEl.appendChild(li);
      }
    }

    if (totalEl) totalEl.textContent = formatBD(cartTotal());

    // Update WhatsApp checkout link
    const cartSendWA = $("#cartSendWA");
    if (cartSendWA) {
      cartSendWA.addEventListener("click", (e) => {
        e.preventDefault();
        handleCartCheckout();
      });
    }
  };

  const buildOrderMessage = () => {
    const currentBranch = branchIndex.get(branch);
    const brName = currentBranch?.name?.[lang] || t("branch." + branch);
    const brPhone = currentBranch?.phone || "";

    const customerName = $("#customerName")?.value?.trim() || "";
    const customerAddress = $("#customerAddress")?.value?.trim() || "";
    const orderNotes = $("#cartNote")?.value?.trim() || "";

    const now = new Date();
    const dateStr = now.toLocaleDateString(lang === "ar" ? "ar-BH" : "en-US");
    const timeStr = now.toLocaleTimeString(lang === "ar" ? "ar-BH" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!cart.length) {
      return lang === "ar" ? "مرحباً، أود الطلب." : "Hi, I'd like to order.";
    }

    const lines = [];
    if (lang === "ar") {
      lines.push("🍽️ *طلب جديد - كهرمانة بغداد*");
      lines.push("━━━━━━━━━━━━━━━━━━━━━");
      lines.push("");
      lines.push("📋 *الطلب:*");

      for (const it of cart) {
        const dish = dishIndex.get(it.id);
        const name = dish ? getDishName(dish) : it.id;
        const price =
          dish && Number.isFinite(dish.price) ? formatBD(dish.price) : getDishPriceText(dish);
        lines.push(`• ${name} × ${it.qty} _(${price})_`);
      }

      lines.push("");
      lines.push(`💰 *الإجمالي التقريبي:* ${formatBD(cartTotal())}`);
      lines.push("");

      if (customerName || customerAddress) {
        lines.push("👤 *بيانات العميل:*");
        if (customerName) lines.push(`الاسم: ${customerName}`);
        if (customerAddress) lines.push(`العنوان: ${customerAddress}`);
        lines.push("");
      }

      if (orderNotes) {
        lines.push(`📝 *ملاحظات:* ${orderNotes}`);
        lines.push("");
      }

      lines.push(`🏠 *الفرع:* ${brName}`);
      lines.push(`📞 *للتواصل:* ${brPhone}`);
      lines.push("");
      lines.push(`⏰ *وقت الطلب:* ${dateStr} - ${timeStr}`);
      lines.push("");
      lines.push("_يرجى تأكيد التوفر ووقت التحضير المتوقع. شكراً_");

      return lines.join("\n");
    }

    // English version
    lines.push("🍽️ *New Order - Kahramana Baghdad*");
    lines.push("━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");
    lines.push("📋 *Order Details:*");

    for (const it of cart) {
      const dish = dishIndex.get(it.id);
      const name = dish ? getDishName(dish) : it.id;
      const price =
        dish && Number.isFinite(dish.price) ? formatBD(dish.price) : getDishPriceText(dish);
      lines.push(`• ${name} × ${it.qty} _(${price})_`);
    }

    lines.push("");
    lines.push(`💰 *Estimated Total:* ${formatBD(cartTotal())}`);
    lines.push("");

    if (customerName || customerAddress) {
      lines.push("👤 *Customer Info:*");
      if (customerName) lines.push(`Name: ${customerName}`);
      if (customerAddress) lines.push(`Address: ${customerAddress}`);
      lines.push("");
    }

    if (orderNotes) {
      lines.push(`📝 *Notes:* ${orderNotes}`);
      lines.push("");
    }

    lines.push(`🏠 *Branch:* ${brName}`);
    lines.push(`📞 *Contact:* ${brPhone}`);
    lines.push("");
    lines.push(`⏰ *Order Time:* ${dateStr} - ${timeStr}`);
    lines.push("");
    lines.push("_Please confirm availability and estimated preparation time. Thank you_");

    return lines.join("\n");
  };

  const handleCartCheckout = () => {
    if (!cart.length) {
      showToast(lang === "ar" ? "الطلب فارغ!" : "Cart is empty!");
      return;
    }

    // Simple validation
    const customerName = $("#customerName")?.value?.trim() || "";
    const customerAddress = $("#customerAddress")?.value?.trim() || "";

    if (!customerName || customerName.length < 2) {
      showToast(lang === "ar" ? "يرجى إدخال اسمك" : "Please enter your name");
      $("#customerName")?.focus();
      return;
    }

    if (!customerAddress || customerAddress.length < 10) {
      showToast(lang === "ar" ? "يرجى إدخال عنوان التوصيل" : "Please enter delivery address");
      $("#customerAddress")?.focus();
      return;
    }

    openWhatsApp(buildOrderMessage());
  };

  const bindCartUI = () => {
    const modal = $("#cartModal");
    const fab = $("#cartFab");

    const openCart = () => {
      if (!modal) return;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    };

    const closeCart = () => {
      if (!modal) return;
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    };

    fab?.addEventListener("click", openCart);

    $$("[data-cart-close]").forEach((btn) => {
      btn.addEventListener("click", closeCart);
    });

    $("#cartClear")?.addEventListener("click", () => {
      if (
        confirm(
          lang === "ar"
            ? "هل تريد مسح كل العناصر من الطلب؟"
            : "Clear all items from cart?"
        )
      ) {
        clearCart();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal?.classList.contains("open")) {
        closeCart();
      }
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CLICK HANDLERS FOR DISHES
  // ─────────────────────────────────────────────────────────────────────────
  const bindDishActions = () => {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action][data-dish-id]");
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-dish-id");
      if (!id) return;

      if (action === "add") {
        addToCart(id);
      } else if (action === "inquire") {
        const dish = dishIndex.get(id);
        if (dish) openWhatsApp(buildInquiryMessage(dish));
      }
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // DYNAMIC SECTION RE-RENDER ON LANG/BRANCH CHANGE
  // ─────────────────────────────────────────────────────────────────────────
  const renderDynamicSections = () => {
    if (menuData) {
      renderGallery();
      renderMenuGrid();
    }
    renderCart();
    applyBranchUI();
  };

  // ─────────────────────────────────────────────────────────────────────────
  // TOAST NOTIFICATIONS
  // ─────────────────────────────────────────────────────────────────────────
  const showToast = (message) => {
    const container = $("#toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");

    container.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SERVICE WORKER
  // ─────────────────────────────────────────────────────────────────────────
  const registerSW = async () => {
    if (!("serviceWorker" in navigator)) return;
    try {
      await navigator.serviceWorker.register("./sw.js");
    } catch {
      // ignore
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // LOADER
  // ─────────────────────────────────────────────────────────────────────────
  const hideLoader = () => {
    const loader = $("#pageLoader");
    if (loader) loader.classList.add("is-hidden");
  };

  // ─────────────────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────────────────
  const init = async () => {
    try {
      loadTheme();
      loadLang();
      loadBranch();
      bindLangToggle();
      bindBranchButtons();
      bindMenuFilters();

      // Load menu + build indices
      menuData = await fetchMenuData();
      if (menuData) {
        buildDishIndex(menuData.dishes || []);
        buildBranchIndex(menuData.branches || []);
        renderGallery();
        renderMenuGrid();
        applyBranchUI();
      }

      // Cart
      loadCart();
      bindCartUI();
      bindDishActions();
      renderCart();

      // Smooth anchor scroll
      document.addEventListener("click", (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute("href") || "";
        if (!href || href === "#") return;
        const el = $(href);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      // Scroll to Top Button
      const scrollTopBtn = $("#scrollTop");
      if (scrollTopBtn) {
        const toggleScrollTop = () => {
          if (window.scrollY > 400) {
            scrollTopBtn.classList.add("visible");
          } else {
            scrollTopBtn.classList.remove("visible");
          }
        };

        window.addEventListener("scroll", toggleScrollTop, { passive: true });

        scrollTopBtn.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }

      // Mobile menu toggle
      const navToggle = $("#navToggle");
      if (navToggle) {
        document.addEventListener("click", (e) => {
          if (
            navToggle.checked &&
            !e.target.closest(".nav") &&
            !e.target.closest(".burger")
          ) {
            navToggle.checked = false;
          }
        });
      }

      registerSW();
    } catch (err) {
      console.error("[Kahramana] Init failed:", err);
    } finally {
      setTimeout(hideLoader, 350);
    }
  };

  document.addEventListener("DOMContentLoaded", init);
})();
