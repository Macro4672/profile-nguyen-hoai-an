/**
 * File: js/logic.js
 * Các hàm logic THUẦN (pure functions) - không tương tác với DOM, không hiệu ứng phụ.
 * Có thể chạy độc lập trong môi trường Node.js (để test tự động) hoặc gán vào window.AppLogic trên trình duyệt.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Môi trường Node.js (dành cho bộ test tự động node:test)
    module.exports = factory();
  } else {
    // Môi trường Trình duyệt (dán vào window.AppLogic)
    root.AppLogic = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /**
   * Giới hạn một giá trị số nằm trong khoảng [min, max].
   * Nếu val không phải số hợp lệ (NaN), trả về min an toàn.
   * 
   * @param {number} val - Giá trị cần kiểm tra
   * @param {number} min - Ngưỡng tối thiểu
   * @param {number} max - Ngưỡng tối đa
   * @returns {number}
   */
  function clamp(val, min, max) {
    if (typeof val !== 'number' || isNaN(val)) return min;
    return Math.min(max, Math.max(min, val));
  }

  /**
   * Tính tuổi chính xác từ ngày/tháng/năm sinh đến mốc đối chiếu (mặc định hôm nay).
   * Không dùng chuỗi new Date("YYYY-MM-DD") để tránh lệch múi giờ UTC/Local.
   * 
   * @param {number|Date} birthYearOrDate - Năm sinh (số) hoặc đối tượng Date
   * @param {number} [birthMonth] - Tháng sinh (1 - 12)
   * @param {number} [birthDay] - Ngày sinh trong tháng (1 - 31)
   * @param {Date} [refDate=new Date()] - Ngày đối chiếu
   * @returns {number} Số tuổi nguyên dương (>= 0)
   */
  function calcAge(birthYearOrDate, birthMonth, birthDay, refDate = new Date()) {
    let bYear, bMonth, bDay;

    if (birthYearOrDate instanceof Date) {
      bYear = birthYearOrDate.getFullYear();
      bMonth = birthYearOrDate.getMonth() + 1;
      bDay = birthYearOrDate.getDate();
    } else {
      bYear = Number(birthYearOrDate);
      bMonth = Number(birthMonth);
      bDay = Number(birthDay);
    }

    const rYear = refDate.getFullYear();
    const rMonth = refDate.getMonth() + 1;
    const rDay = refDate.getDate();

    let age = rYear - bYear;

    // Nếu chưa đến tháng sinh, hoặc đúng tháng sinh nhưng chưa tới ngày sinh -> trừ 1 tuổi
    if (rMonth < bMonth || (rMonth === bMonth && rDay < bDay)) {
      age--;
    }

    return Math.max(0, age);
  }

  /**
   * Tính phần trăm tiến độ lộ trình học tập (09/2026 -> 10/2030).
   * Giá trị luôn được giới hạn an toàn trong khoảng [0, 100].
   * 
   * @param {Date|string} startDate - Ngày bắt đầu lộ trình
   * @param {Date|string} endDate - Ngày kết thúc dự kiến
   * @param {Date|string} [currentDate=new Date()] - Ngày hiện tại cần tính
   * @returns {number} Phần trăm nguyên từ 0 đến 100
   */
  function calcRoadmapProgress(startDate, endDate, currentDate = new Date()) {
    const startMs = startDate instanceof Date ? startDate.getTime() : new Date(startDate).getTime();
    const endMs = endDate instanceof Date ? endDate.getTime() : new Date(endDate).getTime();
    const curMs = currentDate instanceof Date ? currentDate.getTime() : new Date(currentDate).getTime();

    if (isNaN(startMs) || isNaN(endMs) || isNaN(curMs) || startMs >= endMs) {
      return 0;
    }

    if (curMs <= startMs) return 0;
    if (curMs >= endMs) return 100;

    const progress = ((curMs - startMs) / (endMs - startMs)) * 100;
    return clamp(Math.round(progress), 0, 100);
  }

  /**
   * Tính số lượng hạt mạng nơ-ron canvas thích ứng với kích thước màn hình.
   * Desktop tối đa 90 hạt, mobile tối đa 40 hạt, tối thiểu 15 hạt (nếu màn hình hợp lệ).
   * 
   * @param {number} width - Chiều rộng viewport
   * @param {number} height - Chiều cao viewport
   * @param {boolean} isMobile - Thiết bị có phải di động hay không
   * @returns {number}
   */
  function calcParticleCount(width, height, isMobile) {
    if (typeof width !== 'number' || typeof height !== 'number' || width <= 0 || height <= 0) {
      return 0;
    }
    const maxCount = isMobile ? 40 : 90;
    const area = width * height;
    const density = isMobile ? 12000 : 25000;
    const count = Math.round(area / density);
    return clamp(count, 15, maxCount);
  }

  /**
   * Tính tỉ lệ tiến độ cuộn trang (0 đến 1) cho thanh chỉ báo đỉnh trang.
   * Xử lý trường hợp trang ngắn hơn màn hình (chia cho 0) và cuộn đàn hồi trên iOS.
   * 
   * @param {number} scrollY - Tọa độ cuộn hiện tại
   * @param {number} scrollHeight - Tổng chiều cao tài liệu
   * @param {number} clientHeight - Chiều cao viewport
   * @returns {number} Giá trị trong khoảng [0, 1]
   */
  function calcScrollProgress(scrollY, scrollHeight, clientHeight) {
    if (typeof scrollY !== 'number' || typeof scrollHeight !== 'number' || typeof clientHeight !== 'number') {
      return 0;
    }
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) return 0;
    const progress = scrollY / maxScroll;
    return clamp(progress, 0, 1);
  }

  /**
   * Tính góc nghiêng 3D (tilt) của thẻ dựa trên vị trí con trỏ chuột.
   * Góc nghiêng tối đa ~8°, luôn bị chặn biên an toàn.
   * 
   * @param {{ left: number, top: number, width: number, height: number }|null} rect - Kích thước & vị trí thẻ
   * @param {number} mouseX - Tọa độ X chuột
   * @param {number} mouseY - Tọa độ Y chuột
   * @param {number} [maxTilt=8] - Góc nghiêng tối đa (độ)
   * @returns {{ tiltX: number, tiltY: number }}
   */
  function calcTilt(rect, mouseX, mouseY, maxTilt = 8) {
    if (!rect || typeof rect.width !== 'number' || rect.width <= 0 || rect.height <= 0) {
      return { tiltX: 0, tiltY: 0 };
    }
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (mouseX - centerX) / (rect.width / 2);
    const dy = (mouseY - centerY) / (rect.height / 2);

    const rawTiltX = clamp(-dy * maxTilt, -maxTilt, maxTilt);
    const rawTiltY = clamp(dx * maxTilt, -maxTilt, maxTilt);

    const roundedX = Math.round(rawTiltX * 10) / 10;
    const roundedY = Math.round(rawTiltY * 10) / 10;

    return {
      tiltX: Object.is(roundedX, -0) ? 0 : roundedX,
      tiltY: Object.is(roundedY, -0) ? 0 : roundedY
    };
  }

  /**
   * Định dạng chuỗi ngày tháng của mốc Hành trình ("YYYY-MM").
   * Nếu date rỗng hoặc sai định dạng: trả về chuỗi rỗng "" (không hiển thị Invalid Date).
   * 
   * @param {string} dateStr - Chuỗi ngày dạng "YYYY-MM" hoặc ""
   * @param {string} [lang='vi'] - Ngôn ngữ hiển thị ('vi' hoặc 'en')
   * @returns {string} Chuỗi hiển thị (ví dụ "Tháng 9, 2026" hoặc "September 2026")
   */
  function formatJourneyDate(dateStr, lang = 'vi') {
    if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') {
      return '';
    }

    const match = dateStr.trim().match(/^(\d{4})-(\d{2})$/);
    if (!match) return '';

    const year = Number(match[1]);
    const month = Number(match[2]);

    if (month < 1 || month > 12 || year < 1900 || year > 2100) {
      return '';
    }

    if (lang === 'en') {
      const enMonths = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${enMonths[month - 1]} ${year}`;
    }

    return `Tháng ${month}, ${year}`;
  }

  /**
   * Hàm chuyển trạng thái thuần túy cho hiệu ứng Typewriter: Gõ -> Dừng -> Xóa -> Đổi cụm.
   * 
   * @param {{ text: string, currentPhrase: string, isDeleting: boolean }} state
   * @returns {{ text: string, isDeleting: boolean, isFinished: boolean }}
   */
  function nextTypewriterState({ text, currentPhrase, isDeleting }) {
    const phrase = currentPhrase || '';
    const currentText = text || '';

    if (!isDeleting) {
      if (currentText.length < phrase.length) {
        return {
          text: phrase.slice(0, currentText.length + 1),
          isDeleting: false,
          isFinished: false
        };
      }
      return {
        text: currentText,
        isDeleting: true,
        isFinished: true
      };
    } else {
      if (currentText.length > 0) {
        return {
          text: currentText.slice(0, -1),
          isDeleting: true,
          isFinished: false
        };
      }
      return {
        text: '',
        isDeleting: false,
        isFinished: true
      };
    }
  }

  /**
   * Kiểm tra tính hợp lệ của Họ và tên (2 - 80 ký tự sau khi trim).
   * 
   * @param {string} name
   * @returns {{ isValid: boolean, errorKey?: string }}
   */
  function validateName(name) {
    if (typeof name !== 'string') {
      return { isValid: false, errorKey: 'nameRequired' };
    }
    const trimmed = name.trim();
    if (trimmed.length === 0) return { isValid: false, errorKey: 'nameRequired' };
    if (trimmed.length < 2) return { isValid: false, errorKey: 'nameTooShort' };
    if (trimmed.length > 80) return { isValid: false, errorKey: 'nameTooLong' };
    return { isValid: true };
  }

  /**
   * Kiểm tra tính hợp lệ của địa chỉ Email (theo tiêu chuẩn RFC).
   * 
   * @param {string} email
   * @returns {{ isValid: boolean, errorKey?: string }}
   */
  function validateEmail(email) {
    if (typeof email !== 'string') {
      return { isValid: false, errorKey: 'emailRequired' };
    }
    const trimmed = email.trim();
    if (trimmed.length === 0) return { isValid: false, errorKey: 'emailRequired' };

    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailPattern.test(trimmed)) {
      return { isValid: false, errorKey: 'emailInvalid' };
    }
    return { isValid: true };
  }

  /**
   * Kiểm tra tính hợp lệ của Nội dung liên hệ (10 - 1000 ký tự sau khi trim).
   * 
   * @param {string} message
   * @returns {{ isValid: boolean, errorKey?: string, length: number }}
   */
  function validateMessage(message) {
    if (typeof message !== 'string') {
      return { isValid: false, errorKey: 'messageRequired', length: 0 };
    }
    const trimmed = message.trim();
    const len = trimmed.length;
    if (len === 0) return { isValid: false, errorKey: 'messageRequired', length: 0 };
    if (len < 10) return { isValid: false, errorKey: 'messageTooShort', length: len };
    if (len > 1000) return { isValid: false, errorKey: 'messageTooLong', length: len };
    return { isValid: true, length: len };
  }

  /**
   * Tạo đường dẫn mailto: an toàn đã lọc sạch CR/LF ở tên và tiêu đề thư.
   * 
   * @param {{ to: string, name: string, email: string, message: string }} params
   * @returns {string}
   */
  function buildMailtoUrl({ to, name, email, message }) {
    const safeName = (name || '').replace(/[\r\n]+/g, ' ').trim();
    const safeEmail = (email || '').replace(/[\r\n]+/g, ' ').trim();
    const safeSubject = `[Portfolio] Tin nhắn từ ${safeName}`;

    const bodyContent = [
      `Họ và tên: ${safeName}`,
      `Email: ${safeEmail}`,
      '----------------------------------------',
      'Nội dung tin nhắn:',
      (message || '').trim()
    ].join('\n');

    const cleanTo = (to || '').replace(/[\r\n]+/g, '').trim();
    const query = `subject=${encodeURIComponent(safeSubject)}&body=${encodeURIComponent(bodyContent)}`;

    return `mailto:${cleanTo}?${query}`;
  }

  /**
   * Quyết định theme: lựa chọn đã lưu -> prefers-color-scheme -> light.
   * 
   * @param {string|null} savedTheme
   * @param {boolean} systemPrefersDark
   * @returns {'light'|'dark'}
   */
  function resolveTheme(savedTheme, systemPrefersDark) {
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return systemPrefersDark ? 'dark' : 'light';
  }

  /**
   * Quyết định ngôn ngữ: lưu trữ -> tiếng Việt mặc định.
   * 
   * @param {string|null} savedLang
   * @param {string} [navigatorLang='vi']
   * @returns {'vi'|'en'}
   */
  function resolveLanguage(savedLang, navigatorLang = 'vi') {
    if (savedLang === 'vi' || savedLang === 'en') {
      return savedLang;
    }
    if (typeof navigatorLang === 'string' && navigatorLang.toLowerCase().startsWith('vi')) {
      return 'vi';
    }
    return 'vi';
  }

  /**
   * Lấy bản dịch an toàn có cơ chế rơi về tiếng Việt khi thiếu key.
   * 
   * @param {Object} translations
   * @param {string} lang
   * @param {string} key
   * @returns {string}
   */
  function getTranslation(translations, lang, key) {
    if (!translations || typeof key !== 'string') {
      return key || '';
    }
    if (translations[lang] && typeof translations[lang][key] === 'string') {
      return translations[lang][key];
    }
    if (translations.vi && typeof translations.vi[key] === 'string') {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(`[i18n] Thiếu bản dịch cho key "${key}" ở ngôn ngữ "${lang}". Rơi về tiếng Việt.`);
      }
      return translations.vi[key];
    }
    return key;
  }

  return {
    clamp,
    calcAge,
    calcRoadmapProgress,
    calcParticleCount,
    calcScrollProgress,
    calcTilt,
    formatJourneyDate,
    nextTypewriterState,
    validateName,
    validateEmail,
    validateMessage,
    buildMailtoUrl,
    resolveTheme,
    resolveLanguage,
    getTranslation
  };
});
