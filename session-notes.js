const sessionNoteCourses = [
  { id: "bigdata", code: "IST2510", vi: "Phân tích dữ liệu lớn", en: "Big Data Analytics" },
  { id: "database", code: "IST2610", vi: "Quản lý CSDL", en: "Database Management" },
  { id: "decision", code: "IST3500", vi: "Ra quyết định trong kinh doanh", en: "Business Decision Making" },
  { id: "planning", code: "IST4120", vi: "Hoạch định & chính sách HTTT", en: "IS Planning & Policy" },
  { id: "advanced", code: "IST4510", vi: "Phân tích dữ liệu nâng cao", en: "Advanced Data Analytics" },
  { id: "mining", code: "IST4520", vi: "Khai thác dữ liệu", en: "Data Mining" }
];

const SESSION_NOTE_STORAGE_PREFIX = "takenote-session-notes-v1:";

function sessionNoteLanguage() {
  return document.documentElement.lang === "en" ? "en" : "vi";
}

function sessionNoteText(vi, en) {
  return sessionNoteLanguage() === "en" ? en : vi;
}

function todaySessionNoteKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function formatSessionNoteDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(sessionNoteLanguage() === "en" ? "en-GB" : "vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function readSessionNotes(courseId) {
  try {
    const parsed = JSON.parse(localStorage.getItem(`${SESSION_NOTE_STORAGE_PREFIX}${courseId}`) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(note => note && typeof note === "object" && /^\d{4}-\d{2}-\d{2}$/.test(note.date || "") && typeof note.content === "string")
      .map(note => ({
        id: String(note.id || `${note.date}-${Math.random().toString(36).slice(2)}`),
        date: note.date,
        title: typeof note.title === "string" ? note.title.slice(0, 120) : "",
        content: note.content,
        updatedAt: typeof note.updatedAt === "string" ? note.updatedAt : ""
      }));
  } catch {
    return [];
  }
}

function writeSessionNotes(courseId, notes) {
  localStorage.setItem(`${SESSION_NOTE_STORAGE_PREFIX}${courseId}`, JSON.stringify(notes));
}

function makeSessionNoteId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `note-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function downloadSessionNotes(course, notes) {
  const language = sessionNoteLanguage();
  const heading = language === "vi" ? "Ghi chú theo buổi" : "Session notes";
  const emptyTitle = language === "vi" ? "Buổi học" : "Class session";
  const body = notes
    .slice()
    .sort((left, right) => left.date.localeCompare(right.date))
    .map(note => `${formatSessionNoteDate(note.date)} · ${note.title || emptyTitle}\n${"-".repeat(48)}\n${note.content}`)
    .join("\n\n");
  const content = `${heading} · ${course.code} · ${course[language]}\n${"=".repeat(56)}\n\n${body}`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${course.code.toLowerCase()}-ghi-chu-theo-buoi.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildSessionNotePanel(course) {
  const page = document.querySelector(`#${course.id}`);
  if (!page || page.querySelector(".session-note-panel")) return;

  const panel = document.createElement("section");
  panel.className = "panel session-note-panel";
  panel.dataset.sessionNoteCourse = course.id;
  panel.innerHTML = `
    <div class="session-note-heading">
      <div class="session-note-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 4h14v16H5z"></path><path d="M8 2v4M16 2v4M8 10h8M8 14h8M8 18h5"></path></svg>
      </div>
      <div>
        <p class="eyebrow">SESSION NOTES · ${course.code}</p>
        <h2 data-vi="Ghi chú theo từng buổi học" data-en="Notes for each class session">Ghi chú theo từng buổi học</h2>
        <p data-vi="Chọn ngày học, tự ghi nội dung và lưu thành từng buổi riêng. Tất cả chỉ được lưu trên thiết bị này." data-en="Choose the class date, write your own notes, and save each session separately. Everything stays on this device.">Chọn ngày học, tự ghi nội dung và lưu thành từng buổi riêng. Tất cả chỉ được lưu trên thiết bị này.</p>
      </div>
      <span class="session-local-badge" data-vi="Lưu local" data-en="Local only">Lưu local</span>
    </div>
    <form class="session-note-form">
      <div class="session-note-fields">
        <label>
          <span data-vi="Ngày học" data-en="Class date">Ngày học</span>
          <input class="session-note-date" type="date" required />
        </label>
        <label>
          <span data-vi="Chủ đề buổi học (không bắt buộc)" data-en="Session topic (optional)">Chủ đề buổi học (không bắt buộc)</span>
          <input class="session-note-title" type="text" maxlength="120" />
        </label>
      </div>
      <label class="session-note-content-label">
        <span data-vi="Nội dung tự ghi" data-en="Your session notes">Nội dung tự ghi</span>
        <textarea class="session-note-content" rows="9" required spellcheck="true"></textarea>
      </label>
      <div class="session-note-actions">
        <p class="session-note-status" role="status" aria-live="polite"></p>
        <div>
          <button class="session-note-secondary session-note-reset" type="button" data-vi="Tạo ghi chú mới" data-en="New note">Tạo ghi chú mới</button>
          <button class="session-note-primary" type="submit" data-vi="Lưu buổi học" data-en="Save session">Lưu buổi học</button>
        </div>
      </div>
    </form>
    <div class="session-note-archive">
      <div class="session-note-archive-heading">
        <div><h3 data-vi="Các buổi đã lưu" data-en="Saved sessions">Các buổi đã lưu</h3><span class="session-note-count">0</span></div>
        <button class="session-note-export" type="button" data-vi="Xuất tất cả .txt" data-en="Export all .txt">Xuất tất cả .txt</button>
      </div>
      <div class="session-note-list"></div>
    </div>`;

  page.appendChild(panel);

  const form = panel.querySelector(".session-note-form");
  const dateInput = panel.querySelector(".session-note-date");
  const titleInput = panel.querySelector(".session-note-title");
  const contentInput = panel.querySelector(".session-note-content");
  const status = panel.querySelector(".session-note-status");
  const saveButton = panel.querySelector(".session-note-primary");
  const resetButton = panel.querySelector(".session-note-reset");
  const exportButton = panel.querySelector(".session-note-export");
  const count = panel.querySelector(".session-note-count");
  const list = panel.querySelector(".session-note-list");
  let activeId = "";
  let notes = readSessionNotes(course.id);

  function clearEditor() {
    activeId = "";
    form.reset();
    dateInput.value = todaySessionNoteKey();
    status.textContent = sessionNoteText("Sẵn sàng tạo ghi chú mới.", "Ready for a new session note.");
    saveButton.textContent = sessionNoteText("Lưu buổi học", "Save session");
    contentInput.focus({ preventScroll: true });
  }

  function renderList() {
    const sorted = notes.slice().sort((left, right) => right.date.localeCompare(left.date) || String(right.updatedAt).localeCompare(String(left.updatedAt)));
    count.textContent = String(sorted.length);
    exportButton.disabled = sorted.length === 0;
    list.replaceChildren();

    if (!sorted.length) {
      const empty = document.createElement("p");
      empty.className = "session-note-empty";
      empty.textContent = sessionNoteText("Chưa có buổi nào. Viết nội dung phía trên rồi bấm “Lưu buổi học”.", "No sessions yet. Write above, then select “Save session”.");
      list.appendChild(empty);
      return;
    }

    sorted.forEach(note => {
      const item = document.createElement("article");
      item.className = "session-note-item";
      item.dataset.noteId = note.id;

      const meta = document.createElement("div");
      meta.className = "session-note-item-meta";
      const date = document.createElement("time");
      date.dateTime = note.date;
      date.textContent = formatSessionNoteDate(note.date);
      const title = document.createElement("h4");
      title.textContent = note.title || sessionNoteText("Buổi học", "Class session");
      meta.append(date, title);

      const content = document.createElement("p");
      content.className = "session-note-item-content";
      content.textContent = note.content;

      const actions = document.createElement("div");
      actions.className = "session-note-item-actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.dataset.action = "edit";
      edit.textContent = sessionNoteText("Sửa", "Edit");
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.action = "delete";
      remove.textContent = sessionNoteText("Xóa", "Delete");
      actions.append(edit, remove);

      item.append(meta, content, actions);
      list.appendChild(item);
    });
  }

  function updateSessionNoteLanguage() {
    titleInput.placeholder = sessionNoteText("Ví dụ: Buổi 03 · GROUP BY và JOIN", "Example: Session 03 · GROUP BY and JOIN");
    contentInput.placeholder = sessionNoteText("Tự ghi nội dung đã học, ví dụ, câu hỏi còn chưa hiểu, việc cần làm sau buổi học…", "Write what you learned, examples, open questions, and follow-up tasks…");
    saveButton.textContent = activeId ? sessionNoteText("Cập nhật buổi học", "Update session") : sessionNoteText("Lưu buổi học", "Save session");
    status.textContent = activeId
      ? sessionNoteText("Đang sửa buổi đã lưu.", "Editing a saved session.")
      : notes.length
        ? sessionNoteText(`${notes.length} buổi đang được lưu trên thiết bị này.`, `${notes.length} sessions are saved on this device.`)
        : sessionNoteText("Chưa có ghi chú · sẵn sàng lưu buổi học đầu tiên.", "No notes yet · ready to save the first session.");
    renderList();
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const date = dateInput.value;
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!date || !content) {
      status.textContent = sessionNoteText("Hãy chọn ngày và nhập nội dung ghi chú.", "Choose a date and enter your notes.");
      return;
    }

    const now = new Date().toISOString();
    const didUpdate = Boolean(activeId);
    if (didUpdate) {
      notes = notes.map(note => note.id === activeId ? { ...note, date, title, content, updatedAt: now } : note);
    } else {
      notes.push({ id: makeSessionNoteId(), date, title, content, updatedAt: now });
    }

    try {
      writeSessionNotes(course.id, notes);
      activeId = "";
      form.reset();
      dateInput.value = todaySessionNoteKey();
      status.textContent = didUpdate
        ? sessionNoteText("Đã cập nhật và lưu trên thiết bị này.", "Updated and saved on this device.")
        : sessionNoteText("Đã lưu buổi học trên thiết bị này.", "Session saved on this device.");
      saveButton.textContent = sessionNoteText("Lưu buổi học", "Save session");
      renderList();
    } catch {
      status.textContent = sessionNoteText("Không thể lưu. Hãy kiểm tra quyền lưu dữ liệu của trình duyệt.", "Could not save. Check the browser's storage permission.");
    }
  });

  resetButton.addEventListener("click", clearEditor);
  exportButton.addEventListener("click", () => downloadSessionNotes(course, notes));

  list.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    const item = event.target.closest("[data-note-id]");
    if (!button || !item) return;
    const note = notes.find(candidate => candidate.id === item.dataset.noteId);
    if (!note) return;

    if (button.dataset.action === "edit") {
      activeId = note.id;
      dateInput.value = note.date;
      titleInput.value = note.title;
      contentInput.value = note.content;
      status.textContent = sessionNoteText("Đang sửa buổi đã lưu.", "Editing a saved session.");
      saveButton.textContent = sessionNoteText("Cập nhật buổi học", "Update session");
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      contentInput.focus({ preventScroll: true });
      return;
    }

    if (button.dataset.action === "delete") {
      const confirmed = window.confirm(sessionNoteText("Xóa ghi chú buổi học này khỏi thiết bị?", "Delete this session note from this device?"));
      if (!confirmed) return;
      notes = notes.filter(candidate => candidate.id !== note.id);
      try {
        writeSessionNotes(course.id, notes);
        if (activeId === note.id) clearEditor();
        status.textContent = sessionNoteText("Đã xóa ghi chú khỏi thiết bị này.", "Note deleted from this device.");
        renderList();
      } catch {
        status.textContent = sessionNoteText("Không thể xóa ghi chú.", "Could not delete the note.");
      }
    }
  });

  dateInput.value = todaySessionNoteKey();
  updateSessionNoteLanguage();
  new MutationObserver(mutations => {
    if (mutations.some(mutation => mutation.attributeName === "lang")) updateSessionNoteLanguage();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
}

sessionNoteCourses.forEach(buildSessionNotePanel);
if (typeof setLanguage === "function" && typeof state !== "undefined") setLanguage(state.language);
