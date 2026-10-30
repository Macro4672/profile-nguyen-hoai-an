/**
 * File: js/effects.js
 * Tập trung toàn bộ hiệu ứng đặc biệt và nền động Canvas mạng nơ-ron:
 * - Có bảng điều khiển EFFECTS ở đầu file để bật/tắt độc lập từng hiệu ứng.
 * - Tự động nhận diện thiết bị cảm ứng để tắt các hiệu ứng chỉ dành cho chuột.
 * - Tự động giảm tải hạt nếu phát hiện khung hình yếu (FPS thấp).
 * - Tôn trọng tuyệt đối prefers-reduced-motion và tạm dừng khi tab bị ẩn.
 * - Mỗi hiệu ứng được bọc trong try/catch độc lập, lỗi một cái không làm ảnh hưởng phần còn lại.
 */

/* ==========================================================================
   1. BẢNG ĐIỀU KHIỂN BẬT / TẮT HIỆU ỨNG (EFFECTS TOGGLE)
   Người dùng hoặc lập trình viên có thể tùy ý bật (true) hoặc tắt (false) từng mục
   ========================================================================== */
const EFFECTS = {
  scrollProgress: true,   // 1. Thanh tiến độ cuộn mảnh ở đỉnh trang
  typewriter: true,       // 2. Chữ tự gõ xoay vòng ở Hero
  nameGradient: true,     // 3. Gradient chuyển động chậm trên tên
  avatarGlow: true,       // 4. Viền xoay, quầng sáng avatar & parallax ảnh bìa
  cursorGlow: true,       // 5. Vệt sáng mờ theo con trỏ và viền sáng thẻ
  tilt: true,             // 6. Thẻ nghiêng 3D theo chuột
  magneticButtons: true,  // 7. Nút từ tính & vệt sáng hover
  journeyTimeline: true,  // 8. Timeline vẽ đường nối & thang CEFR sáng dần
  backToTop: true,        // 9. Nút lên đầu trang xuất hiện sau 1 màn hình
  neuralCanvas: true      // Nền hạt canvas mạng nơ-ron (Lớp 2)
};

/* ==========================================================================
   2. KHỞI CHẠY KHI DOM SẴN SÀNG
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Kiểm tra thiết bị có chuột (pointer fine + hover) hay chỉ có màn hình cảm ứng
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Thanh tiến độ cuộn trang
  if (EFFECTS.scrollProgress) {
    try { initScrollProgress(); } catch (e) { console.warn('[Effects] Scroll progress error:', e); }
  }

  // 2. Hiệu ứng Typewriter tự gõ chữ
  if (EFFECTS.typewriter) {
    try { initTypewriter(isReducedMotion); } catch (e) { console.warn('[Effects] Typewriter error:', e); }
  }

  // 3. Parallax ảnh bìa & Avatar
  if (EFFECTS.avatarGlow) {
    try { initHeroParallax(isFinePointer && !isReducedMotion); } catch (e) { console.warn('[Effects] Parallax error:', e); }
  }

  // 4. Nền Canvas Mạng nơ-ron (Neural Network)
  if (EFFECTS.neuralCanvas) {
    try { initNeuralCanvas(isReducedMotion); } catch (e) { console.warn('[Effects] Canvas error:', e); }
  }

  // 5, 6, 7. Các hiệu ứng chỉ kích hoạt trên thiết bị có chuột (không kích hoạt trên cảm ứng)
  if (isFinePointer && !isReducedMotion) {
    if (EFFECTS.cursorGlow) {
      try { initCursorGlow(); } catch (e) { console.warn('[Effects] Cursor glow error:', e); }
    }
    if (EFFECTS.tilt) {
      try { initCardTilt(); } catch (e) { console.warn('[Effects] Tilt error:', e); }
    }
    if (EFFECTS.magneticButtons) {
      try { initMagneticButtons(); } catch (e) { console.warn('[Effects] Magnetic error:', e); }
    }
  }

  // 8. Timeline Hành trình & Bậc thang CEFR sáng dần
  if (EFFECTS.journeyTimeline) {
    try { initJourneyVisuals(); } catch (e) { console.warn('[Effects] Journey visuals error:', e); }
    try { initCefrStepperVisuals(); } catch (e) { console.warn('[Effects] CEFR visuals error:', e); }
  }

  // 9. Nút Back to top thông minh
  if (EFFECTS.backToTop) {
    try { initSmartBackToTop(); } catch (e) { console.warn('[Effects] BackToTop error:', e); }
  }
});

/* ==========================================================================
   3. THANH TIẾN ĐỘ CUỘN TRANG (SCROLL PROGRESS)
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const winHeight = window.innerHeight || document.documentElement.clientHeight;

    const progress = AppLogic.calcScrollProgress(scrollY, docHeight, winHeight);
    progressBar.style.transform = `scaleX(${progress})`;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* ==========================================================================
   4. TYPEWRITER CHỮ XOAY VÒNG Ở HERO
   ========================================================================== */
let typewriterTimer = null;

function initTypewriter(isReducedMotion) {
  const textEl = document.getElementById('typewriterText');
  if (!textEl) return;

  // Nếu người dùng bật giảm chuyển động, chỉ giữ cụm đầu tiên tĩnh
  if (isReducedMotion) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function getPhrases() {
    const lang = document.documentElement.getAttribute('lang') || 'vi';
    const dict = (typeof AppTranslations !== 'undefined') ? AppTranslations[lang] : null;
    if (dict) {
      return [
        dict.typewriter1 || 'Sinh viên Trí tuệ nhân tạo',
        dict.typewriter2 || 'Đang học Python & vibe coding',
        dict.typewriter3 || 'Hướng tới du học'
      ];
    }
    return [
      'Sinh viên Trí tuệ nhân tạo',
      'Đang học Python & vibe coding',
      'Hướng tới du học'
    ];
  }

  function tick() {
    const phrases = getPhrases();
    const currentPhrase = phrases[phraseIndex % phrases.length];

    if (!isDeleting) {
      charIndex++;
      textEl.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex >= currentPhrase.length) {
        // Đã gõ xong cụm -> dừng chờ 2.2 giây để người xem kịp đọc
        isDeleting = true;
        typewriterTimer = setTimeout(tick, 2200);
        return;
      }
      typewriterTimer = setTimeout(tick, 70);
    } else {
      charIndex--;
      textEl.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex <= 0) {
        // Đã xóa hết -> chuyển sang cụm tiếp theo, dừng 400ms
        isDeleting = false;
        phraseIndex++;
        typewriterTimer = setTimeout(tick, 400);
        return;
      }
      typewriterTimer = setTimeout(tick, 40);
    }
  }

  // Khởi động
  typewriterTimer = setTimeout(tick, 1000);

  // Lắng nghe sự kiện đổi ngôn ngữ để chuyển cụm mượt mà, không chạy chồng chéo
  window.addEventListener('languagechange', function () {
    clearTimeout(typewriterTimer);
    charIndex = 0;
    isDeleting = false;
    tick();
  });
}

/* ==========================================================================
   5. NỀN CANVAS MẠNG NƠ-RON (NEURAL NETWORK CANVAS)
   ========================================================================== */
function initNeuralCanvas(isReducedMotion) {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animId = null;
  let isPaused = false;
  let colorRgb = '99, 102, 241'; // Mặc định indigo

  // Bộ đo hiệu năng (FPS / Frame Time) để tự giảm tải
  let frameTimes = [];
  let isThrottled = false;
  let isCanvasDisabled = false;

  // Tọa độ con trỏ chuột
  const mouse = { x: -1000, y: -1000, radius: 140 };

  function readColor() {
    const computed = getComputedStyle(document.documentElement).getPropertyValue('--particle-rgb');
    if (computed && computed.trim()) {
      colorRgb = computed.trim();
    }
  }

  readColor();

  // Lắng nghe đổi theme để đổi màu hạt mượt mà, KHÔNG tạo lại hạt
  window.addEventListener('themechange', function () {
    readColor();
    if (isReducedMotion) {
      drawStaticFrame();
    }
  });

  function resize() {
    if (isCanvasDisabled) return;
    const isMobile = window.innerWidth <= 768;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);

    // Tính số lượng hạt bằng hàm thuần từ AppLogic
    let targetCount = AppLogic.calcParticleCount(width, height, isMobile);
    if (isThrottled) {
      targetCount = Math.max(10, Math.round(targetCount * 0.5));
    }

    createParticles(targetCount);

    if (isReducedMotion) {
      drawStaticFrame();
    }
  }

  function createParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.5 + 1.2
      });
    }
  }

  function drawStaticFrame() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorRgb}, 0.6)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${colorRgb}, ${0.25 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  let lastTime = performance.now();

  function loop(now) {
    if (isPaused || isCanvasDisabled) return;

    // Đo thời gian khung hình để tự giảm tải nếu thiết bị yếu
    const delta = now - lastTime;
    lastTime = now;
    frameTimes.push(delta);
    if (frameTimes.length > 60) {
      frameTimes.shift();
      const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      if (avg > 24 && !isThrottled) {
        // Giảm 50% số hạt nếu máy giật
        isThrottled = true;
        particles = particles.slice(0, Math.round(particles.length * 0.5));
      } else if (avg > 35 && isThrottled) {
        // Tắt hẳn canvas nếu vẫn quá chậm
        isCanvasDisabled = true;
        canvas.style.display = 'none';
        return;
      }
    }

    ctx.clearRect(0, 0, width, height);

    const maxDist = 120;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Hút / đẩy nhẹ theo con trỏ chuột
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distMouse = Math.hypot(dx, dy);
      if (distMouse < mouse.radius && distMouse > 0) {
        const force = (mouse.radius - distMouse) / mouse.radius;
        p.x -= (dx / distMouse) * force * 1.2;
        p.y -= (dy / distMouse) * force * 1.2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorRgb}, 0.7)`;
      ctx.fill();

      // Nối đường thẳng giữa các hạt gần nhau
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${colorRgb}, ${0.3 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(loop);
  }

  // Lắng nghe chuột
  window.addEventListener('pointermove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('pointerleave', function () {
    mouse.x = -1000;
    mouse.y = -1000;
  }, { passive: true });

  // Tạm dừng khi tab bị ẩn
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      isPaused = true;
      if (animId) cancelAnimationFrame(animId);
    } else {
      isPaused = false;
      lastTime = performance.now();
      frameTimes = [];
      if (!isReducedMotion && !isCanvasDisabled) {
        animId = requestAnimationFrame(loop);
      }
    }
  });

  // Debounce resize
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  }, { passive: true });

  resize();

  if (!isReducedMotion) {
    animId = requestAnimationFrame(loop);
  }
}

/* ==========================================================================
   6. VỆT SÁNG THEO CON TRỎ & VIỀN SÁNG THẺ (CURSOR GLOW)
   ========================================================================== */
function initCursorGlow() {
  const glowEl = document.getElementById('cursorFollowerGlow');
  const cards = document.querySelectorAll('.card');

  let mouseX = -500;
  let mouseY = -500;
  let currentX = -500;
  let currentY = -500;
  let isRunning = false;

  window.addEventListener('pointermove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(renderGlow);
    }
  }, { passive: true });

  function renderGlow() {
    // Di chuyển mềm (lerp) vệt sáng nền
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;

    if (glowEl) {
      glowEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }

    // Cập nhật tọa độ tương đối --mx, --my lên các thẻ để viền sáng chạy theo
    cards.forEach(function (card) {
      const rect = card.getBoundingClientRect();
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });

    if (Math.abs(mouseX - currentX) > 0.5 || Math.abs(mouseY - currentY) > 0.5) {
      requestAnimationFrame(renderGlow);
    } else {
      isRunning = false;
    }
  }
}

/* ==========================================================================
   7. THẺ NGHIÊNG 3D (TILT EFFECT)
   ========================================================================== */
function initCardTilt() {
  const tiltCards = document.querySelectorAll('.card, .hero-banner-card');

  tiltCards.forEach(function (card) {
    let rect = null;

    card.addEventListener('mouseenter', function () {
      rect = card.getBoundingClientRect();
    }, { passive: true });

    card.addEventListener('mousemove', function (e) {
      if (!rect) rect = card.getBoundingClientRect();
      const tilt = AppLogic.calcTilt(rect, e.clientX, e.clientY, 7);
      card.style.transform = `perspective(1000px) rotateX(${tilt.tiltX}deg) rotateY(${tilt.tiltY}deg) translateY(-4px)`;
    }, { passive: true });

    card.addEventListener('mouseleave', function () {
      rect = null;
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   8. NÚT TỪ TÍNH (MAGNETIC BUTTONS)
   ========================================================================== */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .nav-brand');

  buttons.forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Kéo nhẹ tối đa 4px
      const pullX = AppLogic.clamp(x * 0.15, -4, 4);
      const pullY = AppLogic.clamp(y * 0.15, -4, 4);

      btn.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
    }, { passive: true });

    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });
}

/* ==========================================================================
   9. PARALLAX ẢNH BÌA HERO
   ========================================================================== */
function initHeroParallax(canParallax) {
  if (!canParallax) return;

  const coverImg = document.getElementById('heroCoverImg');
  if (!coverImg) return;

  let ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        const scrollY = window.scrollY || 0;
        if (scrollY < 500) {
          coverImg.style.transform = `translate3d(0, ${scrollY * 0.18}px, 0)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   10. TIMELINE HÀNH TRÌNH: ĐƯỜNG NỐI VẼ DẦN & CHẤM MỐC
   ========================================================================== */
function initJourneyVisuals() {
  const journeySection = document.getElementById('journey');
  const lineProgress = document.getElementById('journeyLineProgress');
  if (!journeySection || !lineProgress) return;

  function updateLine() {
    const rect = journeySection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Tính tỉ lệ phần trăm section đã cuộn vào viewport
    const total = rect.height;
    const current = windowHeight - rect.top - 120;
    const progress = AppLogic.clamp(current / total, 0, 1);

    lineProgress.style.height = (progress * 100) + '%';
  }

  window.addEventListener('scroll', updateLine, { passive: true });
  updateLine();
}

/* ==========================================================================
   11. BẬC THANG CEFR SÁNG DẦN THEO THỨ TỰ KHI CUỘN TỚI
   ========================================================================== */
function initCefrStepperVisuals() {
  const cefrStepper = document.getElementById('cefrStepper');
  if (!cefrStepper || !('IntersectionObserver' in window)) return;

  const steps = cefrStepper.querySelectorAll('.scale-step');

  const observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        steps.forEach(function (step, idx) {
          setTimeout(function () {
            step.classList.add('illuminated');
          }, idx * 140);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(cefrStepper);
}

/* ==========================================================================
   12. NÚT BACK TO TOP THÔNG MINH
   ========================================================================== */
function initSmartBackToTop() {
  const btn = document.getElementById('backToTopFloating');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    if (scrollY > window.innerHeight * 0.8) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
