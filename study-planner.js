const STUDY_PLANNER_SUPABASE_URL = "https://dafylvuvlknoebamxxvr.supabase.co";
const STUDY_PLANNER_SUPABASE_KEY = "sb_publishable_uwRT04UOyTMJzFb551dOrQ_mj0oHUzA";

const plannerCourseColors = {
  IST2510: "#7fa4e8",
  IST2610: "#6079a6",
  IST3500: "#b3a2d6",
  IST4120: "#ee9e8d",
  IST4510: "#8ac9ad",
  IST4520: "#f5c84b"
};

const fallbackWeeklyClasses = [
  { weekday: 1, slot: "01–02", hour: 8, code: "IST2510", vi: "Phân tích dữ liệu lớn", en: "Big Data Analytics", details: "Thầy Huấn · A2-612", starts: "2026-08-03" },
  { weekday: 1, slot: "03–04", hour: 13, code: "IST4520", vi: "Khai thác dữ liệu", en: "Data Mining", details: "Thầy Nghĩa · A2-612", starts: "2026-08-10" },
  { weekday: 2, slot: "01–02", hour: 8, code: "IST3500", vi: "Ra quyết định trong kinh doanh", en: "Business Decision Making", details: "Lewis · A2-612", starts: "2026-08-03" },
  { weekday: 2, slot: "03–04", hour: 13, code: "IST4120", vi: "Hoạch định & chính sách HTTT", en: "IS Planning & Policy", details: "Shaoyi · A2-612", starts: "2026-08-17" },
  { weekday: 3, slot: "01–02", hour: 8, code: "IST4510", vi: "Phân tích dữ liệu nâng cao", en: "Advanced Data Analytics", details: "Mitch · A2-612", starts: "2026-08-03" },
  { weekday: 3, slot: "03–04", hour: 13, code: "IST2610", vi: "Quản lý CSDL trong kinh doanh", en: "Database Management in Business", details: "Đức Minh · A2-612", starts: "2026-08-03" }
];

const plannerState = {
  classes: [],
  deadlines: [],
  status: "loading",
  syncedAt: null
};

function plannerLanguage() {
  return document.documentElement.lang === "en" ? "en" : "vi";
}

function plannerText(vi, en) {
  return plannerLanguage() === "en" ? en : vi;
}

function escapePlannerHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safePlannerColor(value, courseCode) {
  if (/^#[0-9a-f]{6}$/i.test(value || "")) return value;
  return plannerCourseColors[courseCode] || "#7fa4e8";
}

function dateAtLocalMidnight(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function buildFallbackClasses() {
  const now = new Date();
  const semesterEnd = dateAtLocalMidnight("2026-11-29");
  const events = [];

  for (let offset = 0; offset <= 28; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    if (date > semesterEnd) break;

    fallbackWeeklyClasses.forEach(course => {
      if (date.getDay() !== course.weekday || date < dateAtLocalMidnight(course.starts)) return;
      const startAt = new Date(date);
      startAt.setHours(course.hour, 0, 0, 0);
      if (startAt.getTime() < now.getTime() - (3 * 60 * 60 * 1000)) return;
      events.push({
        id: `fallback-${course.code}-${startAt.toISOString()}`,
        kind: "class",
        courseCode: course.code,
        titleVi: course.vi,
        titleEn: course.en,
        detailsVi: course.details,
        detailsEn: course.details,
        startAt,
        slotLabel: course.slot,
        room: "A2-612",
        color: plannerCourseColors[course.code],
        source: "fallback"
      });
    });
  }

  return events.sort((a, b) => a.startAt - b.startAt);
}

function normalizeSupabaseEvent(event) {
  const startAt = new Date(event.start_at);
  if (Number.isNaN(startAt.getTime())) return null;

  return {
    id: event.id,
    kind: event.kind,
    courseCode: event.course_code || "STUDY",
    titleVi: event.title_vi || event.title_en || "Sự kiện học tập",
    titleEn: event.title_en || event.title_vi || "Study event",
    detailsVi: event.details_vi || event.details_en || "",
    detailsEn: event.details_en || event.details_vi || "",
    startAt,
    endAt: event.end_at ? new Date(event.end_at) : null,
    slotLabel: event.slot_label || "",
    room: event.room || "",
    color: safePlannerColor(event.color, event.course_code),
    priority: event.priority || "normal",
    source: "supabase"
  };
}

async function fetchPlannerEvents() {
  const endpoint = new URL(`${STUDY_PLANNER_SUPABASE_URL}/rest/v1/study_events`);
  endpoint.searchParams.set("select", "id,kind,course_code,title_vi,title_en,details_vi,details_en,start_at,end_at,slot_label,room,color,priority,is_completed");
  endpoint.searchParams.set("is_completed", "eq.false");
  endpoint.searchParams.set("order", "start_at.asc");
  endpoint.searchParams.set("limit", "60");

  const response = await fetch(endpoint, {
    headers: {
      apikey: STUDY_PLANNER_SUPABASE_KEY,
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`Supabase ${response.status}`);
    error.isSetupRequired = response.status === 404 || body.includes("PGRST205") || body.includes("study_events");
    throw error;
  }

  const rows = await response.json();
  return Array.isArray(rows) ? rows.map(normalizeSupabaseEvent).filter(Boolean) : [];
}

function plannerDateParts(date) {
  const locale = plannerLanguage() === "en" ? "en-GB" : "vi-VN";
  return {
    day: new Intl.DateTimeFormat(locale, { day: "2-digit" }).format(date),
    label: new Intl.DateTimeFormat(locale, { weekday: "short", month: "2-digit" }).format(date).replace(",", " ·")
  };
}

function plannerLongDate(date) {
  const locale = plannerLanguage() === "en" ? "en-GB" : "vi-VN";
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function deadlineBadge(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((dueDay - today) / 86400000);

  if (days < 0) return { text: plannerText(`Quá hạn ${Math.abs(days)} ngày`, `${Math.abs(days)}d overdue`), className: "is-overdue" };
  if (days === 0) return { text: plannerText("Hôm nay", "Today"), className: "is-urgent" };
  if (days === 1) return { text: plannerText("Ngày mai", "Tomorrow"), className: "is-urgent" };
  if (days <= 7) return { text: plannerText(`Còn ${days} ngày`, `${days} days left`), className: "is-soon" };
  return { text: plannerText(`Còn ${days} ngày`, `${days} days left`), className: "" };
}

function plannerItem(event) {
  const date = plannerDateParts(event.startAt);
  const title = plannerLanguage() === "en" ? event.titleEn : event.titleVi;
  const details = plannerLanguage() === "en" ? event.detailsEn : event.detailsVi;
  const meta = [event.courseCode, details, event.room].filter(Boolean).join(" · ");
  const badge = event.kind === "deadline"
    ? deadlineBadge(event.startAt)
    : { text: event.slotLabel || plannerText("Buổi học", "Class"), className: "" };

  return `
    <article class="planner-item" style="--planner-color:${safePlannerColor(event.color, event.courseCode)}">
      <time class="planner-date-box" datetime="${event.startAt.toISOString()}">
        <strong>${escapePlannerHtml(date.day)}</strong>
        <small>${escapePlannerHtml(date.label)}</small>
      </time>
      <div class="planner-item-copy">
        <strong title="${escapePlannerHtml(title)}">${escapePlannerHtml(title)}</strong>
        <small title="${escapePlannerHtml(meta)}">${escapePlannerHtml(meta)}</small>
      </div>
      <span class="planner-badge ${badge.className}">${escapePlannerHtml(badge.text)}</span>
    </article>`;
}

function plannerEmpty(kind) {
  if (kind === "class") {
    return `<div class="planner-empty"><b>✓</b><span>${plannerText("Không còn buổi học nào trong học kỳ.", "No more classes remain this semester.")}</span></div>`;
  }

  return `
    <div class="planner-empty">
      <b>＋</b>
      <span>${plannerText("Chưa có deadline trong Supabase.", "No deadlines in Supabase yet.")} <a class="planner-setup-link" href="supabase-study-events.sql" target="_blank" rel="noreferrer">${plannerText("Mở tệp thiết lập", "Open setup file")}</a>.</span>
    </div>`;
}

function renderStudyPlanner() {
  const classList = document.querySelector("#plannerClassList");
  const deadlineList = document.querySelector("#plannerDeadlineList");
  if (!classList || !deadlineList) return;

  const now = new Date();
  const classes = plannerState.classes.filter(event => event.startAt.getTime() >= now.getTime() - 10800000).slice(0, 3);
  const deadlines = plannerState.deadlines.slice(0, 3);
  classList.innerHTML = classes.length ? classes.map(plannerItem).join("") : plannerEmpty("class");
  deadlineList.innerHTML = deadlines.length ? deadlines.map(plannerItem).join("") : plannerEmpty("deadline");

  document.querySelector("#plannerClassCount").textContent = plannerText(`${classes.length} buổi tới`, `${classes.length} upcoming`);
  document.querySelector("#plannerDeadlineCount").textContent = plannerText(`${deadlines.length} mốc`, `${deadlines.length} due`);
  document.querySelector("#plannerToday").textContent = plannerLongDate(now);

  const status = document.querySelector("#plannerStatus");
  status.classList.toggle("is-live", plannerState.status === "live");
  if (plannerState.status === "loading") status.textContent = plannerText("Đang kết nối lịch...", "Connecting calendar...");
  if (plannerState.status === "live") status.textContent = plannerText("Đã đồng bộ Supabase", "Synced with Supabase");
  if (plannerState.status === "setup") status.textContent = plannerText("Lịch mặc định · cần tạo bảng", "Default timetable · table needed");
  if (plannerState.status === "offline") status.textContent = plannerText("Lịch mặc định · chưa thể đồng bộ", "Default timetable · sync unavailable");

  const refresh = document.querySelector("#refreshStudyPlanner");
  refresh.setAttribute("aria-label", plannerText("Làm mới lịch học và deadline", "Refresh classes and deadlines"));
  refresh.title = plannerText("Làm mới", "Refresh");

  const heroDate = document.querySelector(".hero-kicker b");
  if (heroDate) {
    const viDate = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "long" }).format(now).toUpperCase();
    const enDate = new Intl.DateTimeFormat("en-US", { weekday: "long", day: "2-digit", month: "long" }).format(now).toUpperCase();
    heroDate.dataset.vi = viDate;
    heroDate.dataset.en = enDate;
    heroDate.textContent = plannerLanguage() === "en" ? enDate : viDate;
  }
}

async function loadStudyPlanner() {
  const refresh = document.querySelector("#refreshStudyPlanner");
  if (refresh) refresh.disabled = true;
  plannerState.status = "loading";
  plannerState.classes = buildFallbackClasses();
  renderStudyPlanner();

  try {
    const events = await fetchPlannerEvents();
    const supabaseClasses = events.filter(event => event.kind === "class");
    plannerState.classes = supabaseClasses.length ? supabaseClasses : buildFallbackClasses();
    plannerState.deadlines = events.filter(event => event.kind === "deadline");
    plannerState.status = "live";
    plannerState.syncedAt = new Date();
  } catch (error) {
    plannerState.classes = buildFallbackClasses();
    plannerState.deadlines = [];
    plannerState.status = error.isSetupRequired ? "setup" : "offline";
  } finally {
    if (refresh) refresh.disabled = false;
    renderStudyPlanner();
  }
}

function initStudyPlanner() {
  const refresh = document.querySelector("#refreshStudyPlanner");
  if (!refresh) return;
  refresh.addEventListener("click", loadStudyPlanner);

  new MutationObserver(mutations => {
    if (mutations.some(mutation => mutation.attributeName === "lang")) renderStudyPlanner();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  loadStudyPlanner();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStudyPlanner, { once: true });
} else {
  initStudyPlanner();
}

window.studyPlanner = { refresh: loadStudyPlanner };
