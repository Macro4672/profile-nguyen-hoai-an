/**
 * File: tests/logic.test.js
 * Bộ kiểm thử tự động toàn diện cho js/logic.js sử dụng Node.js Test Runner tích hợp (node:test).
 * Chạy bằng lệnh: node --test
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const AppLogic = require('../js/logic.js');
const AppTranslations = require('../js/i18n.js');

test('=== KIỂM THỬ clamp (Giới hạn giá trị trong khoảng) ===', async (t) => {
  await t.test('Giá trị nằm trong khoảng', () => {
    assert.strictEqual(AppLogic.clamp(5, 0, 10), 5);
  });
  await t.test('Giá trị nhỏ hơn min -> trả về min', () => {
    assert.strictEqual(AppLogic.clamp(-3, 0, 10), 0);
  });
  await t.test('Giá trị lớn hơn max -> trả về max', () => {
    assert.strictEqual(AppLogic.clamp(15, 0, 10), 10);
  });
  await t.test('Giá trị không hợp lệ (NaN) -> trả về min an toàn', () => {
    assert.strictEqual(AppLogic.clamp(NaN, 0, 10), 0);
  });
});

test('=== KIỂM THỬ calcAge (Tính tuổi chính xác) ===', async (t) => {
  await t.test('Trước sinh nhật 1 ngày: sinh 31/10/2008, ngày 30/10/2026 -> 17 tuổi', () => {
    const age = AppLogic.calcAge(2008, 10, 31, new Date(2026, 9, 30));
    assert.strictEqual(age, 17);
  });

  await t.test('Đúng ngày sinh nhật: sinh 31/10/2008, ngày 31/10/2026 -> 18 tuổi', () => {
    const age = AppLogic.calcAge(2008, 10, 31, new Date(2026, 9, 31));
    assert.strictEqual(age, 18);
  });

  await t.test('Sau ngày sinh nhật 1 ngày: sinh 31/10/2008, ngày 01/11/2026 -> 18 tuổi', () => {
    const age = AppLogic.calcAge(2008, 10, 31, new Date(2026, 10, 1));
    assert.strictEqual(age, 18);
  });

  await t.test('Đúng ngày vừa chào đời -> 0 tuổi', () => {
    const age = AppLogic.calcAge(2008, 10, 31, new Date(2008, 9, 31));
    assert.strictEqual(age, 0);
  });

  await t.test('Xử lý năm nhuận: sinh 29/02/2004, kiểm tra ngày 28/02/2005 (0 tuổi) và 01/03/2005 (1 tuổi)', () => {
    const ageBefore = AppLogic.calcAge(2004, 2, 29, new Date(2005, 1, 28));
    const ageAfter = AppLogic.calcAge(2004, 2, 29, new Date(2005, 2, 1));
    assert.strictEqual(ageBefore, 0);
    assert.strictEqual(ageAfter, 1);
  });
});

test('=== KIỂM THỬ calcRoadmapProgress (Tiến độ lộ trình 09/2026 -> 10/2030) ===', async (t) => {
  const start = new Date(2026, 8, 1);   // 01/09/2026
  const end = new Date(2030, 9, 31);     // 31/10/2030

  await t.test('Trước ngày bắt đầu (01/08/2026) -> 0%', () => {
    const p = AppLogic.calcRoadmapProgress(start, end, new Date(2026, 7, 1));
    assert.strictEqual(p, 0);
  });

  await t.test('Giữa chặng (01/10/2028) -> khoảng 50%', () => {
    const p = AppLogic.calcRoadmapProgress(start, end, new Date(2028, 9, 1));
    assert.ok(p >= 48 && p <= 52, `Tiến độ kỳ vọng ~50%, nhận được ${p}%`);
  });

  await t.test('Sau ngày kết thúc (01/01/2031) -> luôn bị chặn tối đa 100%', () => {
    const p = AppLogic.calcRoadmapProgress(start, end, new Date(2031, 0, 1));
    assert.strictEqual(p, 100);
  });

  await t.test('Dữ liệu sai (start >= end) -> trả về 0 an toàn', () => {
    const p = AppLogic.calcRoadmapProgress(end, start, new Date(2028, 0, 1));
    assert.strictEqual(p, 0);
  });
});

test('=== KIỂM THỬ calcParticleCount (Số lượng hạt canvas thích ứng) ===', async (t) => {
  await t.test('Màn hình Desktop 1920x1080 -> hạt trong khoảng [15, 90]', () => {
    const count = AppLogic.calcParticleCount(1920, 1080, false);
    assert.ok(count >= 15 && count <= 90, `Hạt desktop nhận được ${count}`);
  });

  await t.test('Màn hình Mobile 360x780 -> hạt trong khoảng [15, 40]', () => {
    const count = AppLogic.calcParticleCount(360, 780, true);
    assert.ok(count >= 15 && count <= 40, `Hạt mobile nhận được ${count}`);
  });

  await t.test('Màn hình cực lớn 4K -> không vượt quá trần cứng 90', () => {
    const count = AppLogic.calcParticleCount(3840, 2160, false);
    assert.strictEqual(count, 90);
  });

  await t.test('Kích thước không hợp lệ (0 hoặc âm) -> trả về 0 an toàn', () => {
    assert.strictEqual(AppLogic.calcParticleCount(0, 0, false), 0);
    assert.strictEqual(AppLogic.calcParticleCount(-100, 500, true), 0);
  });
});

test('=== KIỂM THỬ calcScrollProgress (Thanh tiến độ cuộn đỉnh trang) ===', async (t) => {
  await t.test('Ở đỉnh trang (scrollY = 0) -> trả về 0', () => {
    assert.strictEqual(AppLogic.calcScrollProgress(0, 3000, 1000), 0);
  });

  await t.test('Ở giữa trang (scrollY = 1000, maxScroll = 2000) -> 0.5', () => {
    assert.strictEqual(AppLogic.calcScrollProgress(1000, 3000, 1000), 0.5);
  });

  await t.test('Cuộn chạm đáy (scrollY = 2000) -> 1', () => {
    assert.strictEqual(AppLogic.calcScrollProgress(2000, 3000, 1000), 1);
  });

  await t.test('Trang ngắn hơn màn hình (scrollHeight <= clientHeight) -> không lỗi chia 0, trả về 0', () => {
    assert.strictEqual(AppLogic.calcScrollProgress(0, 800, 1000), 0);
  });

  await t.test('Cuộn đàn hồi (bounce) trên iOS: scrollY âm hoặc vượt quá đáy -> bị chặn [0, 1]', () => {
    assert.strictEqual(AppLogic.calcScrollProgress(-50, 3000, 1000), 0);
    assert.strictEqual(AppLogic.calcScrollProgress(2500, 3000, 1000), 1);
  });
});

test('=== KIỂM THỬ calcTilt (Góc nghiêng 3D thẻ theo chuột) ===', async (t) => {
  const rect = { left: 100, top: 100, width: 200, height: 200 }; // Tâm ở (200, 200)

  await t.test('Chuột ở đúng tâm thẻ -> góc nghiêng (0, 0)', () => {
    const tilt = AppLogic.calcTilt(rect, 200, 200, 8);
    assert.strictEqual(tilt.tiltX, 0);
    assert.strictEqual(tilt.tiltY, 0);
  });

  await t.test('Chuột lệch sang phải -> tiltY dương, không vượt quá maxTilt', () => {
    const tilt = AppLogic.calcTilt(rect, 300, 200, 8);
    assert.strictEqual(tilt.tiltX, 0);
    assert.strictEqual(tilt.tiltY, 8);
  });

  await t.test('Chuột ở ngoài thẻ -> góc nghiêng vẫn bị chặn trần maxTilt 8°', () => {
    const tilt = AppLogic.calcTilt(rect, 500, -100, 8);
    assert.ok(Math.abs(tilt.tiltX) <= 8);
    assert.ok(Math.abs(tilt.tiltY) <= 8);
  });

  await t.test('Rect không hợp lệ -> trả về góc (0, 0) an toàn', () => {
    const tilt = AppLogic.calcTilt(null, 200, 200, 8);
    assert.deepStrictEqual(tilt, { tiltX: 0, tiltY: 0 });
  });
});

test('=== KIỂM THỬ formatJourneyDate (Định dạng ngày tháng Hành trình) ===', async (t) => {
  await t.test('Ngày rỗng "" -> trả về "" (không hiển thị ngày)', () => {
    assert.strictEqual(AppLogic.formatJourneyDate('', 'vi'), '');
    assert.strictEqual(AppLogic.formatJourneyDate('', 'en'), '');
  });

  await t.test('Ngày hợp lệ "2026-09" tiếng Việt -> "Tháng 9, 2026"', () => {
    assert.strictEqual(AppLogic.formatJourneyDate('2026-09', 'vi'), 'Tháng 9, 2026');
  });

  await t.test('Ngày hợp lệ "2026-09" tiếng Anh -> "September 2026"', () => {
    assert.strictEqual(AppLogic.formatJourneyDate('2026-09', 'en'), 'September 2026');
  });

  await t.test('Chuỗi ngày sai định dạng (ví dụ "abc", "2026-99") -> trả về "" an toàn (không Invalid Date)', () => {
    assert.strictEqual(AppLogic.formatJourneyDate('sai-ngay', 'vi'), '');
    assert.strictEqual(AppLogic.formatJourneyDate('2026-99', 'en'), '');
  });
});

test('=== KIỂM THỬ nextTypewriterState (Chuyển trạng thái máy chữ gõ/xóa) ===', async (t) => {
  const phrase = 'Python';

  await t.test('Đang gõ: tăng thêm 1 ký tự', () => {
    const state = AppLogic.nextTypewriterState({ text: 'Py', currentPhrase: phrase, isDeleting: false });
    assert.deepStrictEqual(state, { text: 'Pyt', isDeleting: false, isFinished: false });
  });

  await t.test('Gõ xong cả cụm -> chuyển sang trạng thái chuẩn bị xóa', () => {
    const state = AppLogic.nextTypewriterState({ text: 'Python', currentPhrase: phrase, isDeleting: false });
    assert.deepStrictEqual(state, { text: 'Python', isDeleting: true, isFinished: true });
  });

  await t.test('Đang xóa: bớt đi 1 ký tự', () => {
    const state = AppLogic.nextTypewriterState({ text: 'Python', currentPhrase: phrase, isDeleting: true });
    assert.deepStrictEqual(state, { text: 'Pytho', isDeleting: true, isFinished: false });
  });

  await t.test('Xóa hết chuỗi -> chuyển sang trạng thái sẵn sàng gõ cụm mới', () => {
    const state = AppLogic.nextTypewriterState({ text: '', currentPhrase: phrase, isDeleting: true });
    assert.deepStrictEqual(state, { text: '', isDeleting: false, isFinished: true });
  });
});

test('=== KIỂM THỬ Validation (Họ tên, Email, Tin nhắn) ===', async (t) => {
  // Họ và tên
  assert.strictEqual(AppLogic.validateName('  ').isValid, false);
  assert.strictEqual(AppLogic.validateName('A').isValid, false);
  assert.strictEqual(AppLogic.validateName('Nguyễn Hoài An').isValid, true);
  assert.strictEqual(AppLogic.validateName('A'.repeat(81)).isValid, false);

  // Email
  assert.strictEqual(AppLogic.validateEmail('a@b').isValid, false);
  assert.strictEqual(AppLogic.validateEmail('anguyenhoai670@gmail.com').isValid, true);

  // Tin nhắn
  assert.strictEqual(AppLogic.validateMessage('Ngắn').isValid, false);
  assert.strictEqual(AppLogic.validateMessage('Tin nhắn thử nghiệm có độ dài hợp lệ hơn 10 ký tự').isValid, true);
});

test('=== KIỂM THỬ buildMailtoUrl (Chống Header Injection) ===', async (t) => {
  const url = AppLogic.buildMailtoUrl({
    to: 'anguyenhoai670@gmail.com',
    name: "Hacker\r\nBcc: evil@victim.com\nLine2",
    email: 'hacker@victim.com',
    message: 'Nội dung tin nhắn an toàn'
  });

  const subjectMatch = url.match(/subject=([^&]*)/);
  assert.ok(subjectMatch);
  const rawSubjectEncoded = subjectMatch[1];
  assert.ok(!rawSubjectEncoded.includes('\r'));
  assert.ok(!rawSubjectEncoded.includes('\n'));
  assert.ok(!rawSubjectEncoded.includes('%0D'));
  assert.ok(!rawSubjectEncoded.includes('%0A'));
});

test('=== KIỂM THỬ Từ điển i18n đồng bộ 100% key giữa vi và en ===', async (t) => {
  const viKeys = Object.keys(AppTranslations.vi).sort();
  const enKeys = Object.keys(AppTranslations.en).sort();
  assert.deepStrictEqual(enKeys, viKeys, 'Bộ key tiếng Anh phải khớp hoàn toàn bộ key tiếng Việt');
});
