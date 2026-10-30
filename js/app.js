/**
 * File: js/app.js
 * Quản lý toàn bộ tương tác DOM:
 * - Theme sáng/tối không nháy, mượt mà, phát sự kiện 'themechange' cho canvas
 * - Ngôn ngữ Việt/Anh tại chỗ (In-place i18n), phát sự kiện 'languagechange' cho typewriter
 * - Quản lý mảng JOURNEY (Hành trình) và render mốc thời gian động theo ngôn ngữ
 * - Menu di động (Hamburger) bật từ <=960px, đủ 3 cách đóng (nút, link, Esc)
 * - Scrollspy tự động đánh dấu 6 mục bằng IntersectionObserver
 * - Kiểm tra hợp lệ (Validation) và xử lý gửi Form liên hệ an toàn (Honeypot, Cooldown, Mailto)
 */

/* ==========================================================================
   1. CẤU HÌNH NGƯỜI DÙNG (LINKS, ENDPOINT, DỮ LIỆU HÀNH TRÌNH & KỸ NĂNG)
   ========================================================================== */

/**
 * Đường dẫn mạng xã hội của bạn.
 * Để trống ("") hoặc không bắt đầu bằng "https://" sẽ tự vô hiệu hóa an toàn kèm tooltip.
 */
const LINKS = {
  github: "https://github.com/Macro4672",   // Điền link GitHub của bạn (ví dụ: "https://github.com/username")
  facebook: "https://www.facebook.com/nguyen.hoai.an.3110200/?locale=vi_VN"  // Điền link Facebook của bạn (ví dụ: "https://facebook.com/username")
};

/**
 * Địa chỉ nhận dữ liệu Form liên hệ (Formspree, Getform, Basin, v.v.).
 * Nếu để trống, hệ thống tự động fallback sang mailto: với dữ liệu mã hóa an toàn.
 */
const CONTACT_ENDPOINT = "";

/**
 * Mảng HÀNH TRÌNH (JOURNEY) - Những gì bạn ĐÃ và ĐANG đi qua.
 * Dễ dàng mở rộng: chỉ cần thêm một phần tử vào mảng và thêm key tương ứng trong i18n.js.
 */
const JOURNEY = [
  {
    id: "journey-1",
    date: "2026-09",
    status: "done",
    titleKey: "journeyM1Title",
    descKey: "journeyM1Desc"
  },
  {
    id: "journey-2",
    date: "", // Để trống -> không hiển thị ngày, chỉ hiện nhãn "Đang diễn ra"
    status: "current",
    titleKey: "journeyM2Title",
    descKey: "journeyM2Desc"
  }
];

/**
 * Danh sách kỹ năng (SKILLS) - Dễ dàng mở rộng trong tương lai.
 */
const SKILLS = [
  {
    titleKey: 'skillPythonTitle',
    levelKey: 'skillPythonLevel',
    scaleType: 'tech',
    activeStep: 1, // 0: Nhập môn, 1: Căn bản, 2: Độc lập
    descKey: 'skillPythonDesc'
  },
  {
    titleKey: 'skillVibeTitle',
    levelKey: 'skillVibeLevel',
    scaleType: 'learn',
    activeStep: 1, // Đang học trong CLB Adley
    descKey: 'skillVibeDesc'
  },
  {
    titleKey: 'skillEnglishTitle',
    levelKey: 'skillEnglishLevel',
    scaleType: 'cefr',
    activeStep: 0, // 0: A1, 1: A2, 2: B1, 3: B2, 4: C1, 5: C2
    targetKey: 'skillEnglishTarget',
    descKey: 'skillEnglishDesc'
  },
  {
    titleKey: 'skillSoftTitle',
    levelKey: 'skillSoftLevel',
    scaleType: 'soft',
    activeStep: 1, // 0: Làm quen, 1: Rèn luyện, 2: Thuần thục
    descKey: 'skillSoftDesc'
  },
  {
    titleKey: 'skillLearnTitle',
    levelKey: 'skillLearnLevel',
    scaleType: 'learn',
    activeStep: 2, // 0: Khởi đầu, 1: Tích cực, 2: Thường xuyên
    descKey: 'skillLearnDesc'
  }
];

/* ==========================================================================
   2. BỘ NHỚ LƯU TRỮ AN TOÀN (FALLBACK KHI LOCALSTORAGE BỊ CHẶN)
   ========================================================================== */
const memoryStorage = {};

const SafeStorage = {
  getItem: function (key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return memoryStorage[key] || null;
    }
  },
  setItem: function (key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      memoryStorage[key] = String(value);
    }
  }
};

/* ==========================================================================
   3. KHỞI CHẠY CHÍNH KHI TẢI TRANG (DOM CONTENT LOADED)
   ========================================================================== */
let activeLang = 'vi';

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Đánh dấu trình duyệt có JavaScript hỗ trợ Progressive Enhancement
  document.documentElement.classList.add('js');

  // Khởi tạo các module lõi
  initThemeManager();
  initLanguageManager();
  initDynamicCalculations();
  renderJourneyTimeline();
  initSocialLinks();
  initMobileMenu();
  initScrollspy();
  initScrollReveal();
  initContactForm();
  initBackToTopFooter();
});

/* ==========================================================================
   4. QUẢN LÝ THEME SÁNG / TỐI (THEME MANAGER)
   ========================================================================== */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const iconSun = document.getElementById('iconSun');
  const iconMoon = document.getElementById('iconMoon');
  const metaThemeColor = document.getElementById('metaThemeColor');

  const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = SafeStorage.getItem('portfolio_theme');
  let currentTheme = AppLogic.resolveTheme(savedTheme, mediaQueryDark.matches);

  applyThemeUI(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setThemeWithTransition(nextTheme);
    });
  }

  mediaQueryDark.addEventListener('change', function (e) {
    const userChoice = SafeStorage.getItem('portfolio_theme');
    if (!userChoice) {
      const autoTheme = e.matches ? 'dark' : 'light';
      setThemeWithTransition(autoTheme);
    }
  });

  function setThemeWithTransition(theme) {
    currentTheme = theme;
    SafeStorage.setItem('portfolio_theme', theme);

    document.documentElement.classList.add('theme-transition');
    applyThemeUI(theme);

    // Phát sự kiện tùy biến 'themechange' để canvas đổi màu hạt mà không khởi tạo lại
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));

    setTimeout(function () {
      document.documentElement.classList.remove('theme-transition');
    }, 350);
  }

  function applyThemeUI(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }

    if (theme === 'dark') {
      if (iconSun) iconSun.style.display = 'block';
      if (iconMoon) iconMoon.style.display = 'none';
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#0b0f19');
    } else {
      if (iconSun) iconSun.style.display = 'none';
      if (iconMoon) iconMoon.style.display = 'block';
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#f8fafc');
    }
  }
}

/* ==========================================================================
   5. QUẢN LÝ ĐA NGÔN NGỮ (LANGUAGE MANAGER)
   ========================================================================== */
function initLanguageManager() {
  const langToggleBtn = document.getElementById('langToggleBtn');

  const savedLang = SafeStorage.getItem('portfolio_lang');
  activeLang = AppLogic.resolveLanguage(savedLang, navigator.language);

  applyLanguage(activeLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      const nextLang = activeLang === 'vi' ? 'en' : 'vi';
      activeLang = nextLang;
      SafeStorage.setItem('portfolio_lang', nextLang);
      applyLanguage(nextLang);

      // Phát sự kiện tùy biến 'languagechange' để typewriter xoay cụm mới
      window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: nextLang } }));
    });
  }
}

function applyLanguage(lang) {
  if (typeof AppTranslations === 'undefined') return;

  document.documentElement.setAttribute('lang', lang);

  const langLabel = document.getElementById('langLabel');
  if (langLabel) {
    langLabel.textContent = lang === 'vi' ? 'EN' : 'VI';
  }

  // Cập nhật văn bản các thẻ data-i18n
  const textNodes = document.querySelectorAll('[data-i18n]');
  textNodes.forEach(function (el) {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const text = AppLogic.getTranslation(AppTranslations, lang, key);
      if (key === 'footerCopyright') {
        const currentYear = new Date().getFullYear();
        el.textContent = text.replace('{year}', currentYear);
      } else {
        el.textContent = text;
      }
    }
  });

  // Cập nhật các thuộc tính placeholder, aria-label, alt qua data-i18n-attr
  const attrNodes = document.querySelectorAll('[data-i18n-attr]');
  attrNodes.forEach(function (el) {
    const mappings = el.getAttribute('data-i18n-attr').split(';');
    mappings.forEach(function (item) {
      if (!item.trim()) return;
      const parts = item.split(':');
      if (parts.length === 2) {
        const attrName = parts[0].trim();
        const key = parts[1].trim();
        const translated = AppLogic.getTranslation(AppTranslations, lang, key);
        el.setAttribute(attrName, translated);
      }
    });
  });

  // Cập nhật title trang
  const pageTitle = AppLogic.getTranslation(AppTranslations, lang, 'pageTitle');
  if (pageTitle) {
    document.title = pageTitle;
  }

  // Cập nhật lại Timeline hành trình
  renderJourneyTimeline();

  // Cập nhật tooltip mạng xã hội
  updateSocialTooltips(lang);

  // Đồng bộ lại lỗi form đang hiển thị
  updateFormMessagesOnLangChange(lang);
}

/* ==========================================================================
   6. RENDER MỤC HÀNH TRÌNH (JOURNEY TIMELINE)
   ========================================================================== */
function renderJourneyTimeline() {
  const container = document.getElementById('journeyTimelineList');
  if (!container) return;

  if (!JOURNEY || JOURNEY.length === 0) {
    container.innerHTML = '<p class="text-muted" style="text-align: center;">Chưa có mốc hành trình nào.</p>';
    return;
  }

  const existingItems = container.querySelectorAll('.timeline-item');
  if (existingItems.length === JOURNEY.length) {
    // Cập nhật tại chỗ (In-place update) để bảo tồn DOM node, tránh mất class is-visible và ngắt kết nối Observer
    JOURNEY.forEach(function (item, index) {
      const itemEl = existingItems[index];
      if (!itemEl) return;

      itemEl.id = item.id;
      const isCurrent = item.status === 'current';
      const formattedDate = AppLogic.formatJourneyDate(item.date, activeLang);
      const statusText = isCurrent
        ? AppLogic.getTranslation(AppTranslations, activeLang, 'journeyStatusCurrent')
        : AppLogic.getTranslation(AppTranslations, activeLang, 'journeyStatusDone');

      const title = AppLogic.getTranslation(AppTranslations, activeLang, item.titleKey);
      const desc = AppLogic.getTranslation(AppTranslations, activeLang, item.descKey);

      // Cập nhật dot pulse
      const dotEl = itemEl.querySelector('.timeline-dot');
      if (dotEl) {
        if (isCurrent) {
          dotEl.classList.add('timeline-dot-pulse');
        } else {
          dotEl.classList.remove('timeline-dot-pulse');
        }
      }

      // Cập nhật badges (ngày tháng và trạng thái)
      const badgesContainer = itemEl.querySelector('.timeline-badges');
      if (badgesContainer) {
        let dateBadge = badgesContainer.querySelector('.timeline-date-badge');
        if (formattedDate) {
          if (!dateBadge) {
            dateBadge = document.createElement('span');
            dateBadge.className = 'timeline-date-badge';
            badgesContainer.insertBefore(dateBadge, badgesContainer.firstChild);
          }
          dateBadge.textContent = formattedDate;
        } else if (dateBadge) {
          dateBadge.remove();
        }

        const statusBadge = badgesContainer.querySelector('.timeline-status-badge');
        if (statusBadge) {
          statusBadge.className = 'timeline-status-badge ' + (isCurrent ? 'current' : 'done');
          statusBadge.textContent = statusText;
        }
      }

      // Cập nhật tiêu đề & nội dung mô tả
      const titleEl = itemEl.querySelector('.timeline-title');
      if (titleEl) titleEl.textContent = title;

      const descEl = itemEl.querySelector('.timeline-desc');
      if (descEl) descEl.textContent = desc;
    });
    return;
  }

  // Trường hợp mở rộng số lượng mốc hành trình: render lại và gắn is-visible để không bao giờ bị ẩn
  let html = '';
  JOURNEY.forEach(function (item, index) {
    const sideClass = (index % 2 === 0) ? 'left' : 'right';
    const isCurrent = item.status === 'current';
    const dotPulseClass = isCurrent ? 'timeline-dot-pulse' : '';

    const formattedDate = AppLogic.formatJourneyDate(item.date, activeLang);
    const statusText = isCurrent
      ? AppLogic.getTranslation(AppTranslations, activeLang, 'journeyStatusCurrent')
      : AppLogic.getTranslation(AppTranslations, activeLang, 'journeyStatusDone');

    const title = AppLogic.getTranslation(AppTranslations, activeLang, item.titleKey);
    const desc = AppLogic.getTranslation(AppTranslations, activeLang, item.descKey);

    html += `
      <div class="timeline-item ${sideClass} reveal-on-scroll is-visible" id="${item.id}">
        <div class="timeline-dot ${dotPulseClass}" aria-hidden="true"></div>
        <div class="card timeline-card">
          <div class="timeline-badges">
            ${formattedDate ? `<span class="timeline-date-badge">${formattedDate}</span>` : ''}
            <span class="timeline-status-badge ${isCurrent ? 'current' : 'done'}">${statusText}</span>
          </div>
          <h3 class="timeline-title">${title}</h3>
          <p class="timeline-desc">${desc}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ==========================================================================
   7. TÍNH TOÁN DỮ LIỆU ĐỘNG (TUỔI & TIẾN ĐỘ LỘ TRÌNH)
   ========================================================================== */
function initDynamicCalculations() {
  const ageDisplay = document.getElementById('calcAgeDisplay');
  if (ageDisplay) {
    const age = AppLogic.calcAge(2008, 10, 31);
    ageDisplay.textContent = age;
  }

  const startDate = new Date(2026, 8, 1);
  const endDate = new Date(2030, 9, 31);
  const progressPercent = AppLogic.calcRoadmapProgress(startDate, endDate);

  const progressPercentText = document.getElementById('roadmapProgressPercent');
  const progressFill = document.getElementById('roadmapProgressFill');
  const progressBar = document.getElementById('roadmapProgressBar');

  if (progressPercentText) {
    progressPercentText.textContent = progressPercent + '%';
  }
  if (progressFill) {
    progressFill.style.width = progressPercent + '%';
  }
  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', progressPercent);
  }
}

/* ==========================================================================
   8. CẤU HÌNH LIÊN KẾT MẠNG XÃ HỘI
   ========================================================================== */
function initSocialLinks() {
  const linkGithub = document.getElementById('linkGithub');
  const linkFacebook = document.getElementById('linkFacebook');

  setupSocialLink(linkGithub, LINKS.github);
  setupSocialLink(linkFacebook, LINKS.facebook);
}

function setupSocialLink(linkEl, url) {
  if (!linkEl) return;

  const isValidUrl = typeof url === 'string' && url.trim().startsWith('https://');

  if (isValidUrl) {
    linkEl.setAttribute('href', url.trim());
    linkEl.setAttribute('target', '_blank');
    linkEl.setAttribute('rel', 'noopener noreferrer');
    linkEl.removeAttribute('aria-disabled');
  } else {
    linkEl.setAttribute('href', '#');
    linkEl.setAttribute('aria-disabled', 'true');
    linkEl.addEventListener('click', function (e) {
      e.preventDefault();
    });
  }
}

function updateSocialTooltips(lang) {
  const comingSoonText = AppLogic.getTranslation(AppTranslations, lang, 'comingSoon');
  const linkGithub = document.getElementById('linkGithub');
  const linkFacebook = document.getElementById('linkFacebook');

  if (linkGithub && linkGithub.getAttribute('aria-disabled') === 'true') {
    linkGithub.setAttribute('data-tooltip', comingSoonText);
  }
  if (linkFacebook && linkFacebook.getAttribute('aria-disabled') === 'true') {
    linkFacebook.setAttribute('data-tooltip', comingSoonText);
  }
}

/* ==========================================================================
   9. TRÌNH ĐƠN DI ĐỘNG (HAMBURGER MENU <= 960px)
   ========================================================================== */
function initMobileMenu() {
  const navToggleBtn = document.getElementById('navToggleBtn');
  const navLinks = document.getElementById('navLinks');

  if (!navToggleBtn || !navLinks) return;

  navToggleBtn.addEventListener('click', function () {
    const isOpened = navLinks.classList.contains('open');
    if (isOpened) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      navToggleBtn.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 960 && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  function openMenu() {
    navLinks.classList.add('open');
    navToggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggleBtn.setAttribute('aria-expanded', 'false');
  }
}

/* ==========================================================================
   10. SCROLLSPY (6 MỤC ĐIỀU HƯỚNG)
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!('IntersectionObserver' in window)) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(function (sec) {
    observer.observe(sec);
  });
}

/* ==========================================================================
   11. PROGRESSIVE ENHANCEMENT: SCROLL REVEAL
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });
}

/* ==========================================================================
   12. FORM LIÊN HỆ: VALIDATION, CHỐNG SPAM & GỬI THƯ
   ========================================================================== */
let lastFormSubmitTime = 0;
let currentFormState = {
  nameErrorKey: null,
  emailErrorKey: null,
  messageErrorKey: null,
  statusKey: null,
  statusType: null
};

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const charCounter = document.getElementById('charCounter');
  const botField = document.getElementById('formBotField');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (messageInput && charCounter) {
    messageInput.addEventListener('input', function () {
      const len = messageInput.value.length;
      charCounter.textContent = len + '/1000';
      if (len > 1000) {
        charCounter.style.color = 'var(--color-error)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', function () {
      clearFieldError(nameInput, 'nameError');
      currentFormState.nameErrorKey = null;
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', function () {
      clearFieldError(emailInput, 'emailError');
      currentFormState.emailErrorKey = null;
    });
  }
  if (messageInput) {
    messageInput.addEventListener('input', function () {
      clearFieldError(messageInput, 'messageError');
      currentFormState.messageErrorKey = null;
    });
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (botField && botField.value.trim() !== '') {
      showFormStatus('formSuccess', 'success');
      form.reset();
      return;
    }

    const now = Date.now();
    if (now - lastFormSubmitTime < 30000) {
      showFormStatus('formCooldown', 'error');
      return;
    }

    const valName = AppLogic.validateName(nameInput.value);
    const valEmail = AppLogic.validateEmail(emailInput.value);
    const valMsg = AppLogic.validateMessage(messageInput.value);

    let hasError = false;

    if (!valName.isValid) {
      showFieldError(nameInput, 'nameError', valName.errorKey);
      currentFormState.nameErrorKey = valName.errorKey;
      hasError = true;
    }

    if (!valEmail.isValid) {
      showFieldError(emailInput, 'emailError', valEmail.errorKey);
      currentFormState.emailErrorKey = valEmail.errorKey;
      hasError = true;
    }

    if (!valMsg.isValid) {
      showFieldError(messageInput, 'messageError', valMsg.errorKey);
      currentFormState.messageErrorKey = valMsg.errorKey;
      hasError = true;
    }

    if (hasError) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    setSubmitting(true);

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim()
    };

    if (CONTACT_ENDPOINT && CONTACT_ENDPOINT.trim().startsWith('http')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(function () { controller.abort(); }, 10000);

        const response = await fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          lastFormSubmitTime = Date.now();
          showFormStatus('formSuccess', 'success');
          form.reset();
          if (charCounter) charCounter.textContent = '0/1000';
        } else {
          showFormStatus('formError', 'error');
        }
      } catch (err) {
        showFormStatus('formError', 'error');
      } finally {
        setSubmitting(false);
      }
    } else {
      const mailtoUrl = AppLogic.buildMailtoUrl({
        to: 'anguyenhoai670@gmail.com',
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      window.location.href = mailtoUrl;

      lastFormSubmitTime = Date.now();
      showFormStatus('formFallbackMailto', 'success');
      setSubmitting(false);
    }
  });

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    const submitText = document.getElementById('formSubmitText');
    if (submitText) {
      submitText.textContent = isSubmitting
        ? AppLogic.getTranslation(AppTranslations, activeLang, 'formSubmittingBtn')
        : AppLogic.getTranslation(AppTranslations, activeLang, 'formSubmitBtn');
    }
  }

  function showFieldError(inputEl, errorId, errorKey) {
    inputEl.setAttribute('aria-invalid', 'true');
    const errEl = document.getElementById(errorId);
    if (errEl) {
      errEl.textContent = AppLogic.getTranslation(AppTranslations, activeLang, errorKey);
      errEl.classList.add('visible');
    }
  }

  function clearFieldError(inputEl, errorId) {
    inputEl.setAttribute('aria-invalid', 'false');
    const errEl = document.getElementById(errorId);
    if (errEl) {
      errEl.textContent = '';
      errEl.classList.remove('visible');
    }
  }

  function showFormStatus(statusKey, type) {
    currentFormState.statusKey = statusKey;
    currentFormState.statusType = type;

    const statusBox = document.getElementById('formStatusBox');
    if (!statusBox) return;

    statusBox.textContent = AppLogic.getTranslation(AppTranslations, activeLang, statusKey);
    statusBox.className = 'form-status ' + type;
  }
}

function updateFormMessagesOnLangChange(lang) {
  if (currentFormState.nameErrorKey) {
    const errEl = document.getElementById('nameError');
    if (errEl) errEl.textContent = AppLogic.getTranslation(AppTranslations, lang, currentFormState.nameErrorKey);
  }
  if (currentFormState.emailErrorKey) {
    const errEl = document.getElementById('emailError');
    if (errEl) errEl.textContent = AppLogic.getTranslation(AppTranslations, lang, currentFormState.emailErrorKey);
  }
  if (currentFormState.messageErrorKey) {
    const errEl = document.getElementById('messageError');
    if (errEl) errEl.textContent = AppLogic.getTranslation(AppTranslations, lang, currentFormState.messageErrorKey);
  }
  if (currentFormState.statusKey && currentFormState.statusType) {
    const statusBox = document.getElementById('formStatusBox');
    if (statusBox) {
      statusBox.textContent = AppLogic.getTranslation(AppTranslations, lang, currentFormState.statusKey);
    }
  }
}

/* ==========================================================================
   13. FOOTER BACK TO TOP
   ========================================================================== */
function initBackToTopFooter() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
