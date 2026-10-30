/**
 * File: js/i18n.js
 * Toàn bộ từ điển song ngữ (Tiếng Việt & Tiếng Anh).
 * Giữ nguyên 100% sự thật từ thông tin cung cấp, không bịa thêm thành tích hay số liệu.
 * Cấu trúc key đối xứng hoàn toàn giữa hai ngôn ngữ 'vi' và 'en'.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AppTranslations = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return {
    vi: {
      // Tiêu đề & Thông tin trang
      pageTitle: 'Nguyễn Hoài An | Portfolio Cá Nhân',
      metaDescription: 'Trang cá nhân của Nguyễn Hoài An - Sinh viên ngành Trí tuệ nhân tạo, Trường Đại học Lạc Hồng. Tìm hiểu về kỹ năng, hành trình, lộ trình học tập và thông tin liên hệ.',

      // Thanh điều hướng (Navbar 6 mục)
      navHome: 'Trang chủ',
      navAbout: 'Về tôi',
      navSkills: 'Kỹ năng',
      navJourney: 'Hành trình',
      navRoadmap: 'Lộ trình',
      navContact: 'Liên hệ',
      navMenuAria: 'Mở danh mục điều hướng',
      themeToggleAria: 'Chuyển đổi giao diện sáng/tối',
      langToggleAria: 'Chuyển sang tiếng Anh',

      // Hero Section & Typewriter
      heroGreeting: 'Xin chào, tôi là',
      heroName: 'Nguyễn Hoài An',
      heroTagline: 'Sinh viên Trí tuệ nhân tạo · Đại học Lạc Hồng',
      heroBio: 'Đang trong quá trình khám phá tri thức, rèn luyện kỹ năng và từng bước xây dựng nền tảng vững chắc trong ngành Trí tuệ nhân tạo.',
      typewriter1: 'Sinh viên Trí tuệ nhân tạo',
      typewriter2: 'Đang học Python & vibe coding',
      typewriter3: 'Hướng tới du học',
      btnAbout: 'Về tôi',
      btnContact: 'Liên hệ ngay',
      avatarAlt: 'Ảnh đại diện Nguyễn Hoài An',
      coverAlt: 'Ảnh bìa trang cá nhân Nguyễn Hoài An',

      // 5 Thẻ tổng quan dưới Hero (Overview Cards)
      overviewAboutTitle: 'Về tôi',
      overviewAboutDesc: 'Sinh viên năm nhất ngành AI tại Đại học Lạc Hồng, yêu thích học hỏi và ước mơ vươn ra thế giới.',
      overviewSkillsTitle: 'Kỹ năng',
      overviewSkillsDesc: 'Nền tảng Python căn bản, vibe coding trong CLB Adley, trau dồi tiếng Anh A1 lên IELTS 7.0+ và kỹ năng mềm.',
      overviewJourneyTitle: 'Hành trình',
      overviewJourneyDesc: 'Những bước đi thực tế đã và đang diễn ra từ mốc 09/2026 tại Đại học Lạc Hồng và CLB Adley.',
      overviewRoadmapTitle: 'Lộ trình',
      overviewRoadmapDesc: 'Kế hoạch học tập 2026 - 2030 với mục tiêu tốt nghiệp ổn định và tự xây dựng mô hình AI.',
      overviewContactTitle: 'Liên hệ',
      overviewContactDesc: 'Sẵn sàng kết nối qua Email, điện thoại hoặc biểu mẫu tin nhắn tại khu vực Đồng Nai.',
      cardViewMore: 'Xem chi tiết',

      // Phần Về tôi (About)
      aboutSectionTitle: 'Về tôi',
      aboutSectionSubtitle: 'Thông tin cá nhân & định hướng phát triển bản thân',
      aboutLabelName: 'Họ và tên:',
      aboutLabelDob: 'Ngày sinh:',
      aboutLabelAge: 'Tuổi:',
      aboutLabelEducation: 'Trường học:',
      aboutLabelMajor: 'Chuyên ngành:',
      aboutLabelLocation: 'Khu vực:',
      aboutDobValue: '31/10/2008',
      aboutEducationValue: 'Trường Đại học Lạc Hồng (Sinh viên năm nhất)',
      aboutMajorValue: 'Trí tuệ nhân tạo (AI)',
      aboutLocationValue: 'Biên Hòa, Trảng Bom, Đồng Nai',
      aboutGoalTitle: 'Mục tiêu ngành học',
      aboutGoalContent: 'Tốt nghiệp ra trường tìm kiếm được một công việc ổn định và tự tay xây dựng được 1 mô hình AI phục vụ bản thân và cuộc sống.',
      aboutDreamTitle: 'Ước mơ dài hạn',
      aboutDreamContent: 'Có cơ hội đi du học và sinh sống ở nước ngoài.',

      // Phần Kỹ năng (Skills)
      skillsSectionTitle: 'Kỹ năng & Rèn luyện',
      skillsSectionSubtitle: 'Đánh giá trung thực theo từng cấp bậc chuẩn, nói không với số liệu ảo',
      skillsIntro: 'Tôi là người đang trong quá trình tìm tòi và phát triển bản thân. Kỹ năng cốt lõi là học hỏi và khám phá nhiều điều mới.',
      skillsScaleNote: 'Thang đo: A1 → C2 (CEFR cho ngoại ngữ) | Nhập môn → Căn bản → Độc lập (Chuyên môn)',

      skillPythonTitle: 'Lập trình Python',
      skillPythonLevel: 'Mức căn bản',
      skillPythonDesc: 'Nắm vững cú pháp cơ bản, rèn luyện tư duy thuật toán nền tảng phục vụ nhập môn Trí tuệ nhân tạo.',

      skillVibeTitle: 'Python Vibe Coding',
      skillVibeLevel: 'Đang học',
      skillVibeDesc: 'Đang học và thực hành lập trình trong CLB Adley để nâng cao tư duy xây dựng ứng dụng thực tế.',

      skillEnglishTitle: 'Tiếng Anh',
      skillEnglishLevel: 'Mức A1 (Khung CEFR)',
      skillEnglishTarget: 'Mục tiêu: Đạt IELTS trên 7.0',
      skillEnglishDesc: 'Đang tích cực rèn luyện từ vựng, ngữ pháp và phát âm nền tảng để từng bước chinh phục mục tiêu IELTS trên 7.0.',

      skillSoftTitle: 'Kỹ năng mềm đang rèn luyện',
      skillSoftLevel: 'Đang rèn luyện',
      skillSoftDesc: 'Tập trung rèn luyện phong thái giao tiếp tự tin, nói trước đám đông, thuyết trình và các kỹ năng mềm khác.',

      skillLearnTitle: 'Học hỏi & Khám phá mới',
      skillLearnLevel: 'Thường xuyên trau dồi',
      skillLearnDesc: 'Chủ động tìm tòi công nghệ mới, duy trì thói quen đọc tài liệu và ứng dụng vào thực tế mỗi ngày.',

      // Tùy chọn từng bậc của thang đo kỹ năng (Skill Stepper Steps)
      stepIntro: 'Nhập môn',
      stepBasic: 'Căn bản',
      stepIndependent: 'Độc lập',

      stepStart: 'Khởi đầu',
      stepLearningAdley: 'Đang học (CLB Adley)',
      stepDeepApp: 'Ứng dụng sâu',

      stepFamiliar: 'Làm quen',
      stepTraining: 'Rèn luyện',
      stepMaster: 'Thuần thục',

      stepActive: 'Tích cực',
      stepFrequent: 'Thường xuyên',

      // Phần Hành trình (Journey - MỤC MỚI)
      journeySectionTitle: 'Hành trình của tôi',
      journeySectionSubtitle: 'Những gì tôi đã và đang đi qua trên con đường học tập',
      journeyStatusDone: 'Đã qua',
      journeyStatusCurrent: 'Đang diễn ra',
      journeyM1Title: 'Bước chân đầu tiên đến giảng đường',
      journeyM1Desc: 'Bắt đầu đặt chân đến Trường Đại học Lạc Hồng, bước đầu tiên của hành trình sinh viên ngành Trí tuệ nhân tạo.',
      journeyM2Title: 'Học hỏi Python & Vibe Coding',
      journeyM2Desc: 'Tìm hiểu Python và vibe coding trong CLB Adley.',

      // Phần Lộ trình (Roadmap)
      roadmapSectionTitle: 'Lộ trình học tập & Phát triển',
      roadmapSectionSubtitle: 'Kế hoạch tương lai 2026 - 2030 tính theo thời gian thực',
      roadmapProgressLabel: 'Tiến độ hoàn thành chặng đại học (09/2026 → 10/2030):',
      roadmapStage1Time: '09/2026',
      roadmapStage1Title: 'Bắt đầu năm nhất đại học',
      roadmapStage1Desc: 'Bắt đầu chặng đường đại học, làm quen môi trường học thuật và xây dựng nền tảng toán học, lập trình.',
      roadmapStage2Time: 'Trong thời gian học',
      roadmapStage2Title: 'Rèn luyện kỹ năng & Ngoại ngữ',
      roadmapStage2Desc: 'Trong thời gian học: nỗ lực đạt IELTS trên 7.0; học thêm các kỹ năng mềm như giao tiếp, thuyết trình, tự tin đứng trước đám đông ( điều mà tôi rất muốn rèn luyện ).',
      roadmapStage3Time: '10/2030',
      roadmapStage3Title: 'Tốt nghiệp & Việc làm ổn định',
      roadmapStage3Desc: 'Tốt nghiệp và có công việc ổn định, tự xây dựng được 1 mô hình AI phục vụ bản thân và cuộc sống.',
      roadmapStage4Time: 'Ước mơ dài hạn',
      roadmapStage4Title: 'Du học & Định cư nước ngoài',
      roadmapStage4Desc: 'Chuẩn bị đầy đủ hành trang tri thức và ngoại ngữ để thực hiện ước mơ đi du học và sinh sống ở nước ngoài.',

      // Phần Liên hệ (Contact)
      contactSectionTitle: 'Liên hệ',
      contactSectionSubtitle: 'Gửi tin nhắn hoặc liên lạc trực tiếp với tôi qua các kênh bên dưới',
      contactInfoHeading: 'Thông tin kết nối',
      contactAddressLabel: 'Địa chỉ:',
      contactAddressValue: 'Biên Hòa, Trảng Bom, Đồng Nai',
      contactEmailLabel: 'Email:',
      contactPhoneLabel: 'Điện thoại:',
      contactSocialHeading: 'Mạng xã hội & Mã nguồn',
      contactFormHeading: 'Gửi tin nhắn trực tiếp',
      formNameLabel: 'Họ và tên *',
      formNamePlaceholder: 'Ví dụ: Nguyễn Văn A',
      formEmailLabel: 'Địa chỉ Email *',
      formEmailPlaceholder: 'an12345@gmail.com',
      formMessageLabel: 'Nội dung tin nhắn *',
      formMessagePlaceholder: 'Nhập nội dung bạn muốn trao đổi (tối thiểu 10 ký tự)...',
      formSubmitBtn: 'Gửi tin nhắn',
      formSubmittingBtn: 'Đang gửi...',

      // Thông báo phản hồi Form
      nameRequired: 'Vui lòng nhập họ và tên của bạn.',
      nameTooShort: 'Họ và tên phải có ít nhất 2 ký tự.',
      nameTooLong: 'Họ và tên không được vượt quá 80 ký tự.',
      emailRequired: 'Vui lòng nhập địa chỉ email để tôi có thể phản hồi.',
      emailInvalid: 'Địa chỉ email chưa đúng định dạng (ví dụ: ten@mien.com).',
      messageRequired: 'Vui lòng nhập nội dung tin nhắn.',
      messageTooShort: 'Nội dung quá ngắn (cần ít nhất 10 ký tự).',
      messageTooLong: 'Nội dung không được vượt quá 1000 ký tự.',
      formSuccess: 'Cảm ơn bạn! Tin nhắn đã được gửi thành công. Tôi sẽ phản hồi sớm nhất.',
      formError: 'Có lỗi xảy ra trong quá trình gửi. Vui lòng thử lại hoặc gửi qua Email trực tiếp.',
      formFallbackMailto: 'Đã mở ứng dụng gửi thư (Email) trên thiết bị của bạn với nội dung đã điền sẵn.',
      formCooldown: 'Bạn vừa gửi tin nhắn. Vui lòng chờ 30 giây trước khi gửi tiếp.',
      comingSoon: 'Sắp cập nhật',

      // Footer
      footerCopyright: '© {year} Nguyễn Hoài An. Thiết kế với HTML, CSS & JavaScript thuần.',
      footerBackToTop: 'Lên đầu trang'
    },

    en: {
      // Titles & Meta
      pageTitle: 'Nguyen Hoai An | Personal Portfolio',
      metaDescription: 'Personal portfolio of Nguyen Hoai An - Artificial Intelligence freshman at Lac Hong University. Discover my skills, journey, learning roadmap, and contact details.',

      // Navbar (6 items)
      navHome: 'Home',
      navAbout: 'About Me',
      navSkills: 'Skills',
      navJourney: 'My Journey',
      navRoadmap: 'Roadmap',
      navContact: 'Contact',
      navMenuAria: 'Toggle navigation menu',
      themeToggleAria: 'Toggle light/dark theme',
      langToggleAria: 'Switch to Vietnamese',

      // Hero Section & Typewriter
      heroGreeting: "Hello, I'm",
      heroName: 'Nguyen Hoai An',
      heroTagline: 'Artificial Intelligence Student · Lac Hong University',
      heroBio: 'Currently exploring knowledge, honing practical abilities, and step by step building a strong foundation in Artificial Intelligence.',
      typewriter1: 'Artificial Intelligence Student',
      typewriter2: 'Learning Python & vibe coding',
      typewriter3: 'Aspiring to study abroad',
      btnAbout: 'About Me',
      btnContact: 'Get in Touch',
      avatarAlt: 'Portrait avatar of Nguyen Hoai An',
      coverAlt: 'Cover background of Nguyen Hoai An profile',

      // 5 Overview Cards
      overviewAboutTitle: 'About Me',
      overviewAboutDesc: 'AI freshman at Lac Hong University, eager to learn and dreaming of exploring the world.',
      overviewSkillsTitle: 'Skills',
      overviewSkillsDesc: 'Basic Python foundation, vibe coding in Adley Club, improving English from A1 to IELTS 7.0+, and soft skills.',
      overviewJourneyTitle: 'My Journey',
      overviewJourneyDesc: 'Real milestones taken and currently ongoing starting from 09/2026 at Lac Hong University and Adley Club.',
      overviewRoadmapTitle: 'Roadmap',
      overviewRoadmapDesc: 'Future plans for 2026 - 2030 with clear goals: stable graduation and building personal AI models.',
      overviewContactTitle: 'Contact',
      overviewContactDesc: 'Ready to connect via Email, phone, or direct contact message based in Dong Nai.',
      cardViewMore: 'View more',

      // About Section
      aboutSectionTitle: 'About Me',
      aboutSectionSubtitle: 'Personal background & personal growth goals',
      aboutLabelName: 'Full Name:',
      aboutLabelDob: 'Date of Birth:',
      aboutLabelAge: 'Age:',
      aboutLabelEducation: 'University:',
      aboutLabelMajor: 'Major:',
      aboutLabelLocation: 'Location:',
      aboutDobValue: '31/10/2008',
      aboutEducationValue: 'Lac Hong University (Freshman)',
      aboutMajorValue: 'Artificial Intelligence (AI)',
      aboutLocationValue: 'Bien Hoa, Trang Bom, Dong Nai',
      aboutGoalTitle: 'Academic & Career Goal',
      aboutGoalContent: 'Graduate to secure a stable job, and independently build an AI model that serves personal needs and daily life.',
      aboutDreamTitle: 'Long-term Aspiration',
      aboutDreamContent: 'Have the opportunity to study abroad and live and work overseas.',

      // Skills Section
      skillsSectionTitle: 'Skills & Development',
      skillsSectionSubtitle: 'Honest assessment based on recognized benchmarks, without fabricated numbers',
      skillsIntro: 'I am actively exploring and dedicated to personal self-development. My core strength is eager learning and continuous discovery of new things.',
      skillsScaleNote: 'Scale: A1 → C2 (CEFR for languages) | Novice → Foundational → Competent (Technical)',

      skillPythonTitle: 'Python Programming',
      skillPythonLevel: 'Basic level',
      skillPythonDesc: 'Solid understanding of fundamental syntax and algorithmic thinking for introductory AI studies.',

      skillVibeTitle: 'Python Vibe Coding',
      skillVibeLevel: 'In training',
      skillVibeDesc: 'Currently learning and practicing coding in the Adley Club to expand practical software development skills.',

      skillEnglishTitle: 'English Language',
      skillEnglishLevel: 'A1 Level (CEFR framework)',
      skillEnglishTarget: 'Goal: Achieve IELTS score above 7.0',
      skillEnglishDesc: 'Actively building core vocabulary, grammar, and pronunciation toward achieving an IELTS score above 7.0.',

      skillSoftTitle: 'Soft Skills in Training',
      skillSoftLevel: 'In progress',
      skillSoftDesc: 'Focusing on building confident communication, public speaking, presentation, and other soft skills.',

      skillLearnTitle: 'Self-Learning & Exploration',
      skillLearnLevel: 'Continuous practice',
      skillLearnDesc: 'Curious about emerging technologies, regularly reading documentation, and applying new knowledge.',

      // Skill Stepper Steps
      stepIntro: 'Novice',
      stepBasic: 'Foundational',
      stepIndependent: 'Competent',

      stepStart: 'Starting',
      stepLearningAdley: 'In training (Adley Club)',
      stepDeepApp: 'Advanced',

      stepFamiliar: 'Familiar',
      stepTraining: 'Practicing',
      stepMaster: 'Proficient',

      stepActive: 'Active',
      stepFrequent: 'Continuous',

      // Journey Section (NEW)
      journeySectionTitle: 'My Journey',
      journeySectionSubtitle: 'What I have experienced and am currently pursuing',
      journeyStatusDone: 'Completed',
      journeyStatusCurrent: 'In Progress',
      journeyM1Title: 'First Step into University',
      journeyM1Desc: 'Began stepping into Lac Hong University, the first milestone of my journey as an Artificial Intelligence student.',
      journeyM2Title: 'Exploring Python & Vibe Coding',
      journeyM2Desc: 'Learning Python and vibe coding in the Adley Club.',

      // Roadmap Section
      roadmapSectionTitle: 'Learning & Growth Roadmap',
      roadmapSectionSubtitle: 'Future 2026 - 2030 journey computed in real-time',
      roadmapProgressLabel: 'University journey completion (09/2026 → 10/2030):',
      roadmapStage1Time: '09/2026',
      roadmapStage1Title: 'First Year at University',
      roadmapStage1Desc: 'Start university life, adapt to the academic environment, and establish foundational math and programming principles.',
      roadmapStage2Time: 'During Studies',
      roadmapStage2Title: 'Skills & Language Mastery',
      roadmapStage2Desc: 'During university studies: achieve IELTS above 7.0; communicate fluently and confidently in public; develop soft skills such as presentation and public speaking.',
      roadmapStage3Time: '10/2030',
      roadmapStage3Title: 'Graduation & Stable Career',
      roadmapStage3Desc: 'Graduate with a stable career and independently build an AI model that serves personal needs and daily life.',
      roadmapStage4Time: 'Long-term Aspiration',
      roadmapStage4Title: 'Study Abroad & Overseas Living',
      roadmapStage4Desc: 'Prepare intellectual capabilities and international language skills to pursue study abroad and living overseas.',

      // Contact Section
      contactSectionTitle: 'Contact',
      contactSectionSubtitle: 'Leave a message or reach out to me directly through the channels below',
      contactInfoHeading: 'Contact Information',
      contactAddressLabel: 'Address:',
      contactAddressValue: 'Bien Hoa, Trang Bom, Dong Nai',
      contactEmailLabel: 'Email:',
      contactPhoneLabel: 'Phone:',
      contactSocialHeading: 'Social Links & Code',
      contactFormHeading: 'Send a Direct Message',
      formNameLabel: 'Full Name *',
      formNamePlaceholder: 'e.g. John Doe',
      formEmailLabel: 'Email Address *',
      formEmailPlaceholder: 'name@example.com',
      formMessageLabel: 'Message *',
      formMessagePlaceholder: 'Write your message here (at least 10 characters)...',
      formSubmitBtn: 'Send Message',
      formSubmittingBtn: 'Sending...',

      // Form Status & Error Messages
      nameRequired: 'Please enter your full name.',
      nameTooShort: 'Full name must contain at least 2 characters.',
      nameTooLong: 'Full name cannot exceed 80 characters.',
      emailRequired: 'Please provide an email address so I can reply.',
      emailInvalid: 'Please enter a valid email address (e.g. name@domain.com).',
      messageRequired: 'Please enter your message.',
      messageTooShort: 'Message is too short (at least 10 characters required).',
      messageTooLong: 'Message cannot exceed 1000 characters.',
      formSuccess: 'Thank you! Your message has been sent successfully. I will get back to you soon.',
      formError: 'An error occurred while sending. Please try again or email me directly.',
      formFallbackMailto: 'Opened your default email application with prefilled message content.',
      formCooldown: 'You have just sent a message. Please wait 30 seconds before sending another.',
      comingSoon: 'Coming soon',

      // Footer
      footerCopyright: '© {year} Nguyen Hoai An. Built with vanilla HTML, CSS & JavaScript.',
      footerBackToTop: 'Back to Top'
    }
  };
});
