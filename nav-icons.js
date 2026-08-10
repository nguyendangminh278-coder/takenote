const courseNavIcons = {
  bigdata: {
    vi: "Dữ liệu lớn",
    en: "Big Data",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V10M10 19V5M16 19v-7M22 19H2"/></svg>'
  },
  database: {
    vi: "Quản lý CSDL",
    en: "Database",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>'
  },
  decision: {
    vi: "Ra quyết định",
    en: "Decision",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8.5 6h7M7.5 8l3.3 7.5M16.5 8l-3.3 7.5"/></svg>'
  },
  planning: {
    vi: "Hoạch định HTTT",
    en: "IS Planning",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h3M8 17h6"/></svg>'
  },
  advanced: {
    vi: "PT nâng cao",
    en: "Advanced",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19h18M5 16l4-5 4 3 6-8M16 6h3v3"/></svg>'
  },
  mining: {
    vi: "Khai thác DL",
    en: "Data Mining",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 5 5M7 10h6M10 7v6"/></svg>'
  }
};

document.querySelectorAll(".main-nav .course-nav-item").forEach(button => {
  const item = courseNavIcons[button.dataset.view];
  if (!item) return;
  const mark = button.querySelector(".course-nav-mark");
  const label = button.querySelector("span:last-child b");
  const code = button.querySelector("span:last-child small");
  mark.innerHTML = item.svg;
  label.dataset.vi = item.vi;
  label.dataset.en = item.en;
  label.textContent = item[state.language];
  if (code) code.remove();
});

document.querySelectorAll(".mobile-nav [data-view]").forEach(button => {
  const item = courseNavIcons[button.dataset.view];
  if (!item) return;
  button.innerHTML = `<span class="mobile-course-icon">${item.svg}</span><small data-vi="${item.vi}" data-en="${item.en}">${item[state.language]}</small>`;
});

setLanguage(state.language);
