const localNoteCourses = [
  { id: "bigdata", code: "IST2510", vi: "Phân tích dữ liệu lớn", en: "Big Data Analytics" },
  { id: "database", code: "IST2610", vi: "Quản lý CSDL", en: "Database Management" },
  { id: "decision", code: "IST3500", vi: "Ra quyết định trong kinh doanh", en: "Business Decision Making" },
  { id: "planning", code: "IST4120", vi: "Hoạch định & chính sách HTTT", en: "IS Planning & Policy" },
  { id: "advanced", code: "IST4510", vi: "Phân tích dữ liệu nâng cao", en: "Advanced Data Analytics" },
  { id: "mining", code: "IST4520", vi: "Khai thác dữ liệu", en: "Data Mining" }
];

const localNotePrefix = "han-study-local-note-v1:";

function localNoteTime(language) {
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date());
}

function downloadLocalNote(course, value) {
  const language = document.documentElement.lang === "en" ? "en" : "vi";
  const heading = language === "vi" ? "Ghi chú cá nhân" : "Personal notes";
  const content = `${heading} · ${course.code} · ${course[language]}\n${"=".repeat(48)}\n\n${value}`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${course.code.toLowerCase()}-ghi-chu-local.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function createLocalNote(course) {
  const page = document.querySelector(`#${course.id}`);
  if (!page || page.querySelector(".local-note-panel")) return;

  page.insertAdjacentHTML("beforeend", `
    <section class="panel local-note-panel" data-local-note-course="${course.id}">
      <div class="local-note-heading">
        <div class="local-note-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 3h11l3 3v15H5z"></path><path d="M15 3v4h4M8 11h8M8 15h8M8 19h5"></path></svg>
        </div>
        <div>
          <p class="eyebrow" data-vi="SỔ TAY CỤC BỘ · ${course.code}" data-en="LOCAL NOTEBOOK · ${course.code}">SỔ TAY CỤC BỘ · ${course.code}</p>
          <h2 data-vi="Ghi chú cá nhân trên thiết bị này" data-en="Personal notes on this device">Ghi chú cá nhân trên thiết bị này</h2>
          <p data-vi="Tự động lưu riêng cho môn ${course.vi}. Không tải lên mạng và không tự đồng bộ sang máy khác." data-en="Saved automatically for ${course.en}. Nothing is uploaded and it does not automatically sync to another device.">Tự động lưu riêng cho môn ${course.vi}. Không tải lên mạng và không tự đồng bộ sang máy khác.</p>
        </div>
      </div>
      <label class="local-note-editor">
        <span class="sr-only" data-vi="Nội dung ghi chú cá nhân" data-en="Personal note content">Nội dung ghi chú cá nhân</span>
        <textarea rows="8" spellcheck="true"></textarea>
      </label>
      <div class="local-note-footer">
        <div class="local-save-status" role="status" aria-live="polite">
          <span class="local-save-dot" aria-hidden="true"></span>
          <span data-local-save-message></span>
        </div>
        <button class="local-note-export" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M8 11l4 4 4-4M5 20h14"></path></svg>
          <span data-vi="Xuất bản sao .txt" data-en="Export .txt backup">Xuất bản sao .txt</span>
        </button>
      </div>
      <p class="local-storage-tip" data-vi="Lưu ý: dữ liệu thuộc trình duyệt hiện tại. Nếu xóa dữ liệu website hoặc đổi trình duyệt, hãy dùng nút Xuất bản sao trước." data-en="Note: data belongs to this browser. Before clearing site data or switching browsers, use Export backup.">Lưu ý: dữ liệu thuộc trình duyệt hiện tại. Nếu xóa dữ liệu website hoặc đổi trình duyệt, hãy dùng nút Xuất bản sao trước.</p>
    </section>`);

  const panel = page.querySelector(".local-note-panel");
  const textarea = panel.querySelector("textarea");
  const status = panel.querySelector("[data-local-save-message]");
  const exportButton = panel.querySelector(".local-note-export");
  const storageKey = `${localNotePrefix}${course.id}`;
  let saveTimer;

  try {
    textarea.value = localStorage.getItem(storageKey) || "";
  } catch (error) {
    panel.classList.add("storage-error");
  }

  function updateLocalNoteLanguage() {
    const language = document.documentElement.lang === "en" ? "en" : "vi";
    textarea.placeholder = language === "vi"
      ? `Viết ghi chú riêng cho môn ${course.vi}… Nội dung sẽ tự động lưu trên máy này.`
      : `Write private notes for ${course.en}… Content is saved automatically on this device.`;

    if (panel.classList.contains("storage-error")) {
      status.textContent = language === "vi" ? "Không thể dùng bộ nhớ local" : "Local storage is unavailable";
    } else if (textarea.value) {
      const savedAt = panel.dataset.savedAt;
      status.textContent = savedAt
        ? (language === "vi" ? `Đã lưu trên máy này · ${savedAt}` : `Saved on this device · ${savedAt}`)
        : (language === "vi" ? "Đã tải ghi chú từ máy này" : "Loaded from this device");
    } else {
      status.textContent = language === "vi" ? "Chưa có ghi chú · sẵn sàng tự lưu" : "No notes yet · autosave ready";
    }
  }

  function saveLocalNote() {
    try {
      localStorage.setItem(storageKey, textarea.value);
      panel.dataset.savedAt = localNoteTime(document.documentElement.lang === "en" ? "en" : "vi");
      panel.classList.remove("storage-error");
      updateLocalNoteLanguage();
    } catch (error) {
      panel.classList.add("storage-error");
      updateLocalNoteLanguage();
    }
  }

  textarea.addEventListener("input", () => {
    const language = document.documentElement.lang === "en" ? "en" : "vi";
    status.textContent = language === "vi" ? "Đang chờ lưu…" : "Waiting to save…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveLocalNote, 450);
  });

  textarea.addEventListener("blur", () => {
    clearTimeout(saveTimer);
    saveLocalNote();
  });

  exportButton.addEventListener("click", () => downloadLocalNote(course, textarea.value));

  const languageObserver = new MutationObserver(updateLocalNoteLanguage);
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  updateLocalNoteLanguage();
}

localNoteCourses.forEach(createLocalNote);
setLanguage(state.language);
