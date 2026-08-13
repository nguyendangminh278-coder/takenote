const CALENDAR_SUPABASE_URL = "https://dafylvuvlknoebamxxvr.supabase.co";
const CALENDAR_SUPABASE_KEY = "sb_publishable_uwRT04UOyTMJzFb551dOrQ_mj0oHUzA";

const weeklyClassSchedule = [
  { weekday: 1, slot: "01–02", code: "IST2510", vi: "Phân tích dữ liệu lớn", en: "Big Data Analytics", starts: "2026-08-03", color: "#3f9c74" },
  { weekday: 1, slot: "03–04", code: "IST4520", vi: "Khai thác dữ liệu", en: "Data Mining", starts: "2026-08-10", color: "#3f9c74" },
  { weekday: 2, slot: "01–02", code: "IST3500", vi: "Ra quyết định trong kinh doanh", en: "Business Decision Making", starts: "2026-08-03", color: "#3f9c74" },
  { weekday: 2, slot: "03–04", code: "IST4120", vi: "Hoạch định & chính sách HTTT", en: "IS Planning & Policy", starts: "2026-08-17", color: "#3f9c74" },
  { weekday: 3, slot: "01–02", code: "IST4510", vi: "Phân tích dữ liệu nâng cao", en: "Advanced Data Analytics", starts: "2026-08-03", color: "#3f9c74" },
  { weekday: 3, slot: "03–04", code: "IST2610", vi: "Quản lý CSDL trong kinh doanh", en: "Database Management in Business", starts: "2026-08-03", color: "#3f9c74" }
];

const supabaseCalendarState = {
  month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  deadlines: [],
  groups: [],
  members: [],
  status: "loading",
  filters: { classes: true, general: true, private: true }
};

function calendarLanguage() {
  return document.documentElement.lang === "en" ? "en" : "vi";
}

function calendarText(vi, en) {
  return calendarLanguage() === "en" ? en : vi;
}

function escapeCalendarHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeCalendarColor(value, fallback = "#3b82f6") {
  return /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;
}

function safeCalendarLink(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function localCalendarDate(value) {
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function calendarDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameCalendarDay(left, right) {
  return calendarDateKey(left) === calendarDateKey(right);
}

async function supabaseCalendarGet(table, params) {
  const endpoint = new URL(`${CALENDAR_SUPABASE_URL}/rest/v1/${table}`);
  Object.entries(params).forEach(([name, value]) => endpoint.searchParams.set(name, value));
  const response = await fetch(endpoint, {
    headers: { apikey: CALENDAR_SUPABASE_KEY, Accept: "application/json" },
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`${table}: HTTP ${response.status}`);
  const rows = await response.json();
  return Array.isArray(rows) ? rows : [];
}

function normalizeDeadline(row) {
  if (!row.due_date || !row.title) return null;
  const dueDate = localCalendarDate(row.due_date);
  if (Number.isNaN(dueDate.getTime())) return null;
  const category = row.type === "general" && !row.group_id && !row.assignee ? "general" : "private";

  return {
    id: row.id,
    date: dueDate,
    title: row.title,
    link: safeCalendarLink(row.link),
    category,
    type: row.type || "general",
    groupId: row.group_id || "",
    assignee: row.assignee || "",
    createdBy: row.created_by || "",
    color: safeCalendarColor(row.color, category === "general" ? "#3b82f6" : "#9b51e0")
  };
}

async function loadSupabaseCalendar() {
  const refresh = document.querySelector("#refreshStudyPlanner");
  if (refresh) refresh.disabled = true;
  supabaseCalendarState.status = "loading";
  renderSupabaseCalendar();

  try {
    const [deadlineRows, groupRows, memberRows] = await Promise.all([
      supabaseCalendarGet("deadlines", {
        select: "id,group_id,title,due_date,link,type,assignee,created_by,created_at,color",
        order: "due_date.asc",
        limit: "500"
      }),
      supabaseCalendarGet("groups", { select: "id,name,created_by,created_at", order: "created_at.asc", limit: "200" }),
      supabaseCalendarGet("group_members", { select: "id,group_id,member_name,role,created_at", order: "created_at.asc", limit: "500" })
    ]);

    supabaseCalendarState.deadlines = deadlineRows.map(normalizeDeadline).filter(Boolean);
    supabaseCalendarState.groups = groupRows;
    supabaseCalendarState.members = memberRows;
    supabaseCalendarState.status = "live";
  } catch (error) {
    supabaseCalendarState.status = "error";
    console.warn("Could not load the Supabase calendar.", error);
  } finally {
    if (refresh) refresh.disabled = false;
    renderSupabaseCalendar();
  }
}

function classesOnDate(date) {
  if (!supabaseCalendarState.filters.classes) return [];
  const semesterEnd = localCalendarDate("2026-11-29");

  return weeklyClassSchedule
    .filter(course => date.getDay() === course.weekday && date >= localCalendarDate(course.starts) && date <= semesterEnd)
    .map(course => ({
      id: `class-${course.code}-${calendarDateKey(date)}`,
      date,
      title: `${course.slot} · ${course[calendarLanguage()]}`,
      category: "class",
      color: course.color,
      link: "",
      meta: course.code
    }));
}

function deadlinesOnDate(date) {
  return supabaseCalendarState.deadlines.filter(deadline => {
    const filterOn = deadline.category === "general"
      ? supabaseCalendarState.filters.general
      : supabaseCalendarState.filters.private;
    return filterOn && isSameCalendarDay(deadline.date, date);
  });
}

function calendarEventMarkup(event) {
  const className = event.category === "class" ? "class-event" : event.category === "private" ? "private-event" : "general-event";
  const group = supabaseCalendarState.groups.find(item => item.id === event.groupId);
  const details = [event.title, group?.name, event.assignee, event.createdBy].filter(Boolean).join(" · ");
  const content = escapeCalendarHtml(event.title);
  const style = `--event-color:${safeCalendarColor(event.color)}`;

  if (event.link) {
    return `<a class="calendar-event ${className}" style="${style}" href="${escapeCalendarHtml(event.link)}" target="_blank" rel="noreferrer" title="${escapeCalendarHtml(details)}">${content}</a>`;
  }

  return `<span class="calendar-event ${className}" style="${style}" title="${escapeCalendarHtml(details)}">${content}</span>`;
}

function renderGroupList() {
  const list = document.querySelector("#plannerGroupList");
  const count = document.querySelector("#plannerGroupCount");
  if (!list || !count) return;
  count.textContent = String(supabaseCalendarState.groups.length);

  if (!supabaseCalendarState.groups.length) {
    list.innerHTML = `<p>${calendarText("Chưa có nhóm nào.", "No groups yet.")}</p>`;
    return;
  }

  list.innerHTML = supabaseCalendarState.groups.map(group => {
    const members = supabaseCalendarState.members.filter(member => member.group_id === group.id);
    const names = members.map(member => member.member_name).filter(Boolean).join(", ");
    return `<div class="calendar-group" title="${escapeCalendarHtml(names)}"><span></span><b>${escapeCalendarHtml(group.name)}</b><small>${members.length}</small></div>`;
  }).join("");
}

function renderCalendarWeekdays() {
  const node = document.querySelector("#calendarWeekdays");
  if (!node) return;
  const labels = calendarLanguage() === "en"
    ? ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    : ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  node.innerHTML = labels.map(label => `<span>${label}</span>`).join("");
}

function renderCalendarGrid() {
  const grid = document.querySelector("#calendarGrid");
  if (!grid) return;

  if (supabaseCalendarState.status === "error") {
    grid.innerHTML = `<p class="calendar-error">${calendarText("Không thể tải deadlines từ Supabase. Hãy kiểm tra kết nối hoặc RLS rồi bấm làm mới.", "Could not load deadlines from Supabase. Check connectivity or RLS, then refresh.")}</p>`;
    return;
  }

  const year = supabaseCalendarState.month.getFullYear();
  const month = supabaseCalendarState.month.getMonth();
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - mondayOffset);
  const today = new Date();
  const cells = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    const inMonth = date.getMonth() === month;
    const events = inMonth ? [...classesOnDate(date), ...deadlinesOnDate(date)] : [];
    const visibleEvents = events.slice(0, 4);
    const more = events.length - visibleEvents.length;
    const classNames = ["calendar-day", inMonth ? "" : "is-other-month", isSameCalendarDay(date, today) ? "is-today" : ""].filter(Boolean).join(" ");

    cells.push(`
      <article class="${classNames}" role="gridcell" aria-label="${escapeCalendarHtml(date.toLocaleDateString(calendarLanguage() === "en" ? "en-GB" : "vi-VN"))}">
        <time class="calendar-day-number" datetime="${calendarDateKey(date)}">${date.getDate()}</time>
        <div class="calendar-day-events">${visibleEvents.map(calendarEventMarkup).join("")}${more > 0 ? `<span class="calendar-more">+${more} ${calendarText("mốc", "more")}</span>` : ""}</div>
      </article>`);
  }

  grid.innerHTML = cells.join("");
}

function renderSupabaseCalendar() {
  const calendar = document.querySelector("#studyPlanner");
  if (!calendar) return;
  const language = calendarLanguage();
  const locale = language === "en" ? "en-US" : "vi-VN";
  const monthLabel = document.querySelector("#calendarMonthLabel");
  const todayLabel = document.querySelector("#plannerToday");
  const status = document.querySelector("#plannerStatus");
  const summary = document.querySelector("#plannerEventSummary");
  const monthDeadlines = supabaseCalendarState.deadlines.filter(item => item.date.getFullYear() === supabaseCalendarState.month.getFullYear() && item.date.getMonth() === supabaseCalendarState.month.getMonth());

  monthLabel.textContent = language === "en"
    ? new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(supabaseCalendarState.month)
    : `Tháng ${String(supabaseCalendarState.month.getMonth() + 1).padStart(2, "0")} ${supabaseCalendarState.month.getFullYear()}`;
  todayLabel.textContent = new Intl.DateTimeFormat(locale, { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  status.classList.toggle("is-live", supabaseCalendarState.status === "live");
  if (supabaseCalendarState.status === "loading") status.textContent = calendarText("Đang tải Supabase...", "Loading Supabase...");
  if (supabaseCalendarState.status === "live") status.textContent = calendarText(`${supabaseCalendarState.deadlines.length} deadline từ Supabase`, `${supabaseCalendarState.deadlines.length} Supabase deadlines`);
  if (supabaseCalendarState.status === "error") status.textContent = calendarText("Không thể đồng bộ", "Sync unavailable");

  summary.textContent = calendarText(`${monthDeadlines.length} deadline trong tháng`, `${monthDeadlines.length} deadlines this month`);
  document.querySelector("#calendarPrevious").setAttribute("aria-label", calendarText("Tháng trước", "Previous month"));
  document.querySelector("#calendarNext").setAttribute("aria-label", calendarText("Tháng sau", "Next month"));
  document.querySelector("#refreshStudyPlanner").setAttribute("aria-label", calendarText("Làm mới lịch", "Refresh calendar"));

  renderCalendarWeekdays();
  renderGroupList();
  renderCalendarGrid();

  const heroDate = document.querySelector(".hero-kicker b");
  if (heroDate) {
    const vi = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "long" }).format(new Date()).toUpperCase();
    const en = new Intl.DateTimeFormat("en-US", { weekday: "long", day: "2-digit", month: "long" }).format(new Date()).toUpperCase();
    heroDate.dataset.vi = vi;
    heroDate.dataset.en = en;
    heroDate.textContent = language === "en" ? en : vi;
  }
}

function shiftCalendarMonth(offset) {
  supabaseCalendarState.month = new Date(
    supabaseCalendarState.month.getFullYear(),
    supabaseCalendarState.month.getMonth() + offset,
    1
  );
  renderSupabaseCalendar();
}

function initSupabaseCalendar() {
  if (!document.querySelector("#studyPlanner")) return;

  document.querySelector("#refreshStudyPlanner").addEventListener("click", loadSupabaseCalendar);
  document.querySelector("#calendarPrevious").addEventListener("click", () => shiftCalendarMonth(-1));
  document.querySelector("#calendarNext").addEventListener("click", () => shiftCalendarMonth(1));
  document.querySelector("#calendarToday").addEventListener("click", () => {
    const today = new Date();
    supabaseCalendarState.month = new Date(today.getFullYear(), today.getMonth(), 1);
    renderSupabaseCalendar();
  });

  [
    ["#filterClasses", "classes"],
    ["#filterGeneral", "general"],
    ["#filterPrivate", "private"]
  ].forEach(([selector, key]) => {
    const input = document.querySelector(selector);
    input.addEventListener("change", () => {
      supabaseCalendarState.filters[key] = input.checked;
      renderSupabaseCalendar();
    });
  });

  new MutationObserver(mutations => {
    if (mutations.some(mutation => mutation.attributeName === "lang")) renderSupabaseCalendar();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  renderSupabaseCalendar();
  loadSupabaseCalendar();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSupabaseCalendar, { once: true });
} else {
  initSupabaseCalendar();
}

window.supabaseCalendar = { refresh: loadSupabaseCalendar, state: supabaseCalendarState };
