const courseWorkspaces = [
  {
    id: "bigdata",
    code: "IST2510",
    vi: "Phân tích dữ liệu lớn",
    en: "Big Data Analytics",
    teacher: "Thầy Huấn",
    place: "612",
    scheduleVi: "Thứ Hai · 06:45–09:30",
    scheduleEn: "Monday · 06:45–09:30",
    start: "03/08/2026",
    sessionDate: "03/08/2026",
    statusVi: "Đã diễn ra",
    statusEn: "Completed",
    colors: ["#dce9ff", "#eef5ff"]
  },
  {
    id: "decision",
    code: "IST3500",
    vi: "Ra quyết định trong kinh doanh",
    en: "Business Decision Making",
    teacher: "Lewis",
    place: "Online",
    scheduleVi: "Thứ Ba · 06:45–09:30",
    scheduleEn: "Tuesday · 06:45–09:30",
    start: "03/08/2026",
    sessionDate: "04/08/2026",
    statusVi: "Đã diễn ra",
    statusEn: "Completed",
    colors: ["#eee6fb", "#f7f2ff"]
  },
  {
    id: "planning",
    code: "IST4120",
    vi: "Hoạch định & chính sách HTTT",
    en: "IS Planning & Policy",
    teacher: "Shaoyi",
    place: "Online",
    scheduleVi: "Thứ Ba · 09:30–12:30",
    scheduleEn: "Tuesday · 09:30–12:30",
    start: "17/08/2026",
    sessionDate: "18/08/2026",
    statusVi: "Sắp tới",
    statusEn: "Upcoming",
    colors: ["#ffe0d8", "#fff2ee"]
  },
  {
    id: "advanced",
    code: "IST4510",
    vi: "Phân tích dữ liệu nâng cao",
    en: "Advanced Data Analytics",
    teacher: "Mitch",
    place: "Online",
    scheduleVi: "Thứ Hai · 09:30–12:30",
    scheduleEn: "Monday · 09:30–12:30",
    start: "03/08/2026",
    sessionDate: "03/08/2026",
    statusVi: "Đã diễn ra",
    statusEn: "Completed",
    colors: ["#def3e9", "#effaf5"]
  }
];

const sidebarCourses = [
  { id: "bigdata", code: "IST2510", vi: "Phân tích dữ liệu lớn", en: "Big Data Analytics", mark: "BD", color: "#dce9ff" },
  { id: "database", code: "IST2610", vi: "Quản lý CSDL", en: "Database Management", mark: "DB", color: "#dfe9f8" },
  { id: "decision", code: "IST3500", vi: "Ra quyết định KD", en: "Business Decision", mark: "DM", color: "#eee6fb" },
  { id: "planning", code: "IST4120", vi: "Hoạch định HTTT", en: "IS Planning & Policy", mark: "IS", color: "#ffe0d8" },
  { id: "advanced", code: "IST4510", vi: "PT dữ liệu nâng cao", en: "Advanced Analytics", mark: "AA", color: "#def3e9" },
  { id: "mining", code: "IST4520", vi: "Khai thác dữ liệu", en: "Data Mining", mark: "DM", color: "#fff0bd" }
];

Object.assign(labels.vi, {
  bigdata: "Phân tích dữ liệu lớn",
  decision: "Ra quyết định trong kinh doanh",
  planning: "Hoạch định & chính sách HTTT",
  advanced: "Phân tích dữ liệu nâng cao"
});

Object.assign(labels.en, {
  bigdata: "Big Data Analytics",
  decision: "Business Decision Making",
  planning: "IS Planning & Policy",
  advanced: "Advanced Data Analytics"
});

Object.assign(courses[0], { view: "bigdata" });
Object.assign(courses[2], { view: "decision" });
Object.assign(courses[3], { view: "planning" });
Object.assign(courses[4], { view: "advanced" });

function resourceCard(kind, titleVi, titleEn, noteVi, noteEn) {
  return `
    <article class="subject-resource-card is-empty">
      <span class="subject-resource-icon">${kind}</span>
      <div>
        <small data-vi="CHƯA THÊM" data-en="NOT ADDED">CHƯA THÊM</small>
        <h3 data-vi="${titleVi}" data-en="${titleEn}">${titleVi}</h3>
        <p data-vi="${noteVi}" data-en="${noteEn}">${noteVi}</p>
      </div>
      <span class="empty-resource-pill" data-vi="Trống" data-en="Empty">Trống</span>
    </article>`;
}

function workspaceTemplate(course) {
  return `
    <section class="page-view subject-workspace" id="${course.id}" aria-labelledby="${course.id}Title">
      <div class="course-hero simple-course-hero" style="--course-start:${course.colors[0]};--course-end:${course.colors[1]}">
        <div>
          <p class="eyebrow">${course.code} · FALL 2026</p>
          <h1 id="${course.id}Title" data-vi="${course.vi}" data-en="${course.en}">${course.vi}</h1>
          <p><span data-vi="Không gian tài nguyên môn học" data-en="Course resource workspace">Không gian tài nguyên môn học</span> · ${course.teacher}</p>
        </div>
        <div class="course-meta">
          <span><small data-vi="Lịch" data-en="Schedule">Lịch</small><b data-vi="${course.scheduleVi}" data-en="${course.scheduleEn}">${course.scheduleVi}</b></span>
          <span><small data-vi="Phòng / Hình thức" data-en="Room / Mode">Phòng / Hình thức</small><b>${course.place}</b></span>
          <span><small data-vi="Tín chỉ" data-en="Credits">Tín chỉ</small><b>03</b></span>
        </div>
      </div>

      <div class="subject-layout">
        <aside class="session-sidebar">
          <div class="session-sidebar-head">
            <p data-vi="CÁC BUỔI HỌC" data-en="CLASS SESSIONS">CÁC BUỔI HỌC</p>
            <span>01</span>
          </div>
          <button class="session-button active" type="button">
            <span>01</span>
            <div><b data-vi="Buổi 01" data-en="Session 01">Buổi 01</b><small>${course.sessionDate}</small></div>
          </button>
          <div class="session-coming-soon">
            <span>02–15</span>
            <p data-vi="Thêm buổi học mới tại đây khi có tài liệu." data-en="Add new sessions here when materials are available.">Thêm buổi học mới tại đây khi có tài liệu.</p>
          </div>
        </aside>

        <div class="session-content">
          <div class="session-title-row">
            <div>
              <p class="eyebrow">SESSION 01 · ${course.sessionDate}</p>
              <h2 data-vi="Tài nguyên Buổi 01" data-en="Session 01 resources">Tài nguyên Buổi 01</h2>
              <p data-vi="Tất cả slide, ghi chú và bài tập của buổi học được gom tại đây." data-en="Slides, notes and assignments for this class stay together here.">Tất cả slide, ghi chú và bài tập của buổi học được gom tại đây.</p>
            </div>
            <span class="session-status" data-vi="${course.statusVi}" data-en="${course.statusEn}">${course.statusVi}</span>
          </div>

          <div class="subject-resource-grid">
            ${resourceCard("PDF", "Slide bài giảng", "Lecture slides", "Chưa có file slide cho buổi này.", "No slide file has been added for this session.")}
            ${resourceCard("NOTE", "Ghi chú buổi học", "Class notes", "Chưa có ghi chú được lưu.", "No class notes have been saved.")}
            ${resourceCard("TASK", "Bài tập & yêu cầu", "Assignments & tasks", "Chưa có bài tập được giao.", "No assignment has been added.")}
            ${resourceCard("LINK", "Liên kết tham khảo", "Reference links", "Chưa có liên kết tham khảo.", "No reference link has been added.")}
          </div>

          <div class="subject-folder-note">
            <span>↳</span>
            <div>
              <b data-vi="Cấu trúc lưu trữ đề xuất" data-en="Suggested storage structure">Cấu trúc lưu trữ đề xuất</b>
              <code>docs/${course.code}/session-01/</code>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

const scheduleView = document.querySelector("#schedule");
scheduleView.insertAdjacentHTML("beforebegin", courseWorkspaces.map(workspaceTemplate).join(""));

document.querySelector(".main-nav").innerHTML = sidebarCourses.map(course => `
  <button class="nav-item course-nav-item" type="button" data-view="${course.id}" style="--nav-color:${course.color}">
    <span class="course-nav-mark">${course.mark}</span>
    <span><b data-vi="${course.vi}" data-en="${course.en}">${course.vi}</b><small>${course.code}</small></span>
  </button>`).join("");

document.querySelector(".mobile-nav").innerHTML = sidebarCourses.map(course => `
  <button type="button" data-view="${course.id}"><span>${course.mark}</span><small>${course.code.replace("IST", "")}</small></button>`).join("");

const brandHome = document.querySelector(".brand");
brandHome.setAttribute("role", "button");
brandHome.setAttribute("tabindex", "0");
brandHome.setAttribute("aria-label", "Mở trang Tổng quan / Open dashboard");
brandHome.addEventListener("click", () => openView("dashboard"));
brandHome.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openView("dashboard");
  }
});

document.querySelectorAll("[data-view]").forEach(button => {
  button.addEventListener("click", () => openView(button.dataset.view));
});

renderCourses();
setLanguage(state.language);

const extensionRequestedView = location.hash.slice(1);
if (labels.vi[extensionRequestedView]) openView(extensionRequestedView);
