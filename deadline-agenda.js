supabaseCalendarState.selectedDate = null;

function visibleAgendaDeadlines(date) {
  return supabaseCalendarState.deadlines.filter(deadline => {
    const filterOn = deadline.category === "general"
      ? supabaseCalendarState.filters.general
      : supabaseCalendarState.filters.private;
    return filterOn && isSameCalendarDay(deadline.date, date);
  });
}

function chooseAgendaDate() {
  const month = supabaseCalendarState.month;
  const selected = supabaseCalendarState.selectedDate;
  const selectedInMonth = selected
    && selected.getFullYear() === month.getFullYear()
    && selected.getMonth() === month.getMonth();
  if (selectedInMonth) return selected;
  if (!selected && supabaseCalendarState.status !== "live") return new Date(month.getFullYear(), month.getMonth(), 1);

  const today = new Date();
  const monthDeadlines = supabaseCalendarState.deadlines
    .filter(deadline => deadline.date.getFullYear() === month.getFullYear() && deadline.date.getMonth() === month.getMonth())
    .sort((left, right) => left.date - right.date);
  const nextDeadline = monthDeadlines.find(deadline => deadline.date >= new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  supabaseCalendarState.selectedDate = nextDeadline?.date || monthDeadlines[0]?.date || new Date(month.getFullYear(), month.getMonth(), 1);
  return supabaseCalendarState.selectedDate;
}

function agendaDateLabel(date) {
  const locale = calendarLanguage() === "en" ? "en-GB" : "vi-VN";
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
  const numeric = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }).format(date);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${numeric}`;
}

function deadlineDetailCard(deadline) {
  const isGeneral = deadline.category === "general";
  const group = supabaseCalendarState.groups.find(item => item.id === deadline.groupId);
  const category = isGeneral ? calendarText("Chung", "Public") : (group?.name || calendarText("Cá nhân / Nhóm", "Personal / Group"));
  const creator = deadline.createdBy ? `${calendarText("Tạo", "By")}: ${deadline.createdBy}` : calendarText("Không rõ người tạo", "Creator unknown");
  const link = deadline.link
    ? `<a href="${escapeCalendarHtml(deadline.link)}" target="_blank" rel="noreferrer" aria-label="${calendarText("Mở bài tập", "Open assignment")}">↗</a>`
    : "";
  const linkText = deadline.link
    ? `<a class="deadline-detail-link" href="${escapeCalendarHtml(deadline.link)}" target="_blank" rel="noreferrer">${escapeCalendarHtml(deadline.link)}</a>`
    : "";

  return `
    <article class="deadline-detail-card" style="--deadline-color:${safeCalendarColor(deadline.color)}">
      <div class="deadline-card-heading"><h4>${escapeCalendarHtml(deadline.title)}</h4>${link}</div>
      ${linkText}
      <div class="deadline-card-tags"><span>${escapeCalendarHtml(category)}</span><span>${escapeCalendarHtml(creator)}</span></div>
    </article>`;
}

function renderDeadlineAgenda() {
  const heading = document.querySelector("#deadlineAgendaDate");
  const count = document.querySelector("#deadlineAgendaCount");
  const list = document.querySelector("#deadlineAgendaList");
  if (!heading || !count || !list) return;

  const selected = chooseAgendaDate();
  const deadlines = visibleAgendaDeadlines(selected);
  heading.textContent = agendaDateLabel(selected);
  count.textContent = String(deadlines.length);

  if (!deadlines.length) {
    list.innerHTML = `<div class="deadline-agenda-empty">${calendarText("Không có deadline trong ngày này. Chọn ngày có thanh màu xanh hoặc tím trên lịch.", "No deadlines on this date. Select a date with a blue or purple calendar item.")}</div>`;
    return;
  }

  list.innerHTML = deadlines.map(deadlineDetailCard).join("");
}

function decorateSelectedCalendarDay() {
  const grid = document.querySelector("#calendarGrid");
  if (!grid) return;
  const selectedKey = calendarDateKey(chooseAgendaDate());
  grid.querySelectorAll(".calendar-day").forEach(day => {
    const dateKey = day.querySelector("time")?.getAttribute("datetime") || "";
    day.dataset.calendarDate = dateKey;
    day.tabIndex = 0;
    day.classList.toggle("is-selected", dateKey === selectedKey);
  });
}

const renderSupabaseCalendarWithoutAgenda = renderSupabaseCalendar;
renderSupabaseCalendar = function renderCalendarWithAgenda() {
  renderSupabaseCalendarWithoutAgenda();
  renderDeadlineAgenda();
  decorateSelectedCalendarDay();
};

function selectAgendaDate(event) {
  const day = event.target.closest(".calendar-day");
  if (!day || event.target.closest("a")) return;
  if (event.type === "keydown" && !["Enter", " "].includes(event.key)) return;
  if (event.type === "keydown") event.preventDefault();
  const dateKey = day.dataset.calendarDate;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey || "")) return;
  supabaseCalendarState.selectedDate = localCalendarDate(dateKey);
  renderDeadlineAgenda();
  decorateSelectedCalendarDay();
}

function initDeadlineAgenda() {
  const grid = document.querySelector("#calendarGrid");
  if (!grid) return;
  grid.addEventListener("click", selectAgendaDate);
  grid.addEventListener("keydown", selectAgendaDate);
  renderDeadlineAgenda();
  decorateSelectedCalendarDay();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDeadlineAgenda, { once: true });
} else {
  initDeadlineAgenda();
}
