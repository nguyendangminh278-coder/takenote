const courses = [
  { code: "IST2510", vi: "Phân tích dữ liệu lớn", en: "Big Data Analytics", teacher: "Thầy Huấn", slot: "MON · 01–02", color: "#7fa4e8" },
  { code: "IST2610", vi: "Quản lý CSDL trong kinh doanh", en: "Database Management in Business", teacher: "Đức Minh", slot: "WED · 03–04", color: "#6079a6", view: "database" },
  { code: "IST3500", vi: "Ra quyết định trong kinh doanh", en: "Business Decision Making", teacher: "Lewis", slot: "TUE · 01–02", color: "#b3a2d6" },
  { code: "IST4120", vi: "Hoạch định & chính sách HTTT", en: "IS Planning & Policy", teacher: "Shaoyi", slot: "TUE · 03–04", color: "#ee9e8d" },
  { code: "IST4510", vi: "Phân tích dữ liệu nâng cao", en: "Advanced Data Analytics", teacher: "Mitch", slot: "WED · 01–02", color: "#8ac9ad" },
  { code: "IST4520", vi: "Khai thác dữ liệu", en: "Data Mining", teacher: "Thầy Nghĩa", slot: "MON · 03–04", color: "#f5c84b", view: "mining" }
];

const state = {
  language: localStorage.getItem("han-study-language") || "vi",
  tasks: JSON.parse(localStorage.getItem("han-study-tasks") || "{}")
};

const labels = {
  vi: { dashboard: "Tổng quan", mining: "Khai thác dữ liệu", database: "Quản lý CSDL", schedule: "Lịch học", vault: "Kho tài liệu" },
  en: { dashboard: "Overview", mining: "Data Mining", database: "Database Management", schedule: "Schedule", vault: "Resource vault" }
};

function renderCourses() {
  const grid = document.querySelector("#courseGrid");
  grid.innerHTML = courses.map(course => `
    <article class="course-card" style="--course-color:${course.color}" ${course.view ? `data-open-view="${course.view}" role="button" tabindex="0"` : ""}>
      <small>${course.code} · 3 CREDITS</small>
      <h3>${course[state.language]}</h3>
      <p>${course.en}</p>
      <footer><b>${course.slot}</b><span>${course.teacher} · A2-612</span></footer>
    </article>
  `).join("");
  bindViewOpeners();
}

function setLanguage(language) {
  state.language = language;
  localStorage.setItem("han-study-language", language);
  document.documentElement.lang = language;
  document.querySelectorAll("[data-vi][data-en]").forEach(node => {
    node.textContent = node.dataset[language];
  });
  document.querySelectorAll("#languageToggle span").forEach(span => span.classList.toggle("active", span.textContent.toLowerCase() === language));
  const activeView = document.querySelector(".page-view.active")?.id || "dashboard";
  document.querySelector("#currentViewLabel").textContent = labels[language][activeView];
  renderCourses();
}

function openView(id) {
  document.querySelectorAll(".page-view").forEach(view => view.classList.toggle("active", view.id === id));
  document.querySelectorAll("[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === id));
  document.querySelector("#currentViewLabel").textContent = labels[state.language][id];
  document.querySelector(".sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
}

function bindViewOpeners() {
  document.querySelectorAll("[data-open-view]").forEach(element => {
    element.onclick = () => openView(element.dataset.openView);
    element.onkeydown = event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openView(element.dataset.openView);
      }
    };
  });
}

function updateProgress() {
  const tasks = [...document.querySelectorAll("[data-task]")];
  const unique = [...new Set(tasks.map(input => input.dataset.task))];
  const done = unique.filter(id => state.tasks[id]).length;
  const percent = unique.length ? Math.round((done / unique.length) * 100) : 0;
  document.querySelector("#progressMetric").textContent = `${percent}%`;
}

function setupTasks() {
  document.querySelectorAll("[data-task]").forEach(input => {
    input.checked = Boolean(state.tasks[input.dataset.task]);
    input.addEventListener("change", () => {
      state.tasks[input.dataset.task] = input.checked;
      localStorage.setItem("han-study-tasks", JSON.stringify(state.tasks));
      document.querySelectorAll(`[data-task="${input.dataset.task}"]`).forEach(copy => { copy.checked = input.checked; });
      updateProgress();
    });
  });
  updateProgress();
}

function setupQuiz() {
  document.querySelectorAll(".quiz-card").forEach(card => {
    card.querySelectorAll("[data-choice]").forEach(button => {
      button.addEventListener("click", () => {
        const correct = button.dataset.choice === card.dataset.answer;
        card.querySelectorAll("[data-choice]").forEach(option => option.classList.remove("correct", "wrong"));
        button.classList.add(correct ? "correct" : "wrong");
        if (!correct) card.querySelector(`[data-choice="${card.dataset.answer}"]`).classList.add("correct");
        card.querySelector(".quiz-feedback").textContent = correct
          ? (state.language === "vi" ? "Chính xác — câu hỏi kinh doanh phải dẫn đường cho toàn bộ dự án." : "Correct — the business question should guide the entire project.")
          : (state.language === "vi" ? "Chưa đúng. Đáp án là Business Understanding." : "Not quite. The answer is Business Understanding.");
      });
    });
  });
}

document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => openView(button.dataset.view)));
document.querySelector("#languageToggle").addEventListener("click", () => setLanguage(state.language === "vi" ? "en" : "vi"));
document.querySelector("#mobileMenu").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));
document.addEventListener("click", event => {
  if (window.innerWidth <= 820 && !event.target.closest(".sidebar") && !event.target.closest("#mobileMenu")) document.querySelector(".sidebar").classList.remove("open");
});

renderCourses();
bindViewOpeners();
setupTasks();
setupQuiz();
setLanguage(state.language);

const requestedView = location.hash.slice(1);
if (labels.vi[requestedView]) openView(requestedView);

window.addEventListener("hashchange", () => {
  const view = location.hash.slice(1);
  if (labels.vi[view] && !document.querySelector(`#${view}`).classList.contains("active")) openView(view);
});
