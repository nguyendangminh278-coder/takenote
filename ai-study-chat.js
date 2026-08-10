import { GoogleGenAI } from "./vendor/google-genai.js";

(() => {
  "use strict";

  const API_ROOT = "https://generativelanguage.googleapis.com/v1beta";
  const MODEL = "gemini-3.6-flash";
  const EMBEDDING_MODEL = "models/gemini-embedding-001";
  const SESSION_KEY = "radiant-ai-gemini-key-v1";
  const STORE_KEY = "radiant-ai-file-search-store-v1";
  const STORE_COUNT_KEY = "radiant-ai-file-search-count-v1";
  const HISTORY_KEY = "radiant-ai-chat-history-v1";
  const MAX_HISTORY = 30;
  const MAX_FILE_BYTES = 100 * 1024 * 1024;

  const courses = [
    { id: "bigdata", code: "IST2510", vi: "Phân tích dữ liệu lớn", en: "Big Data Analytics" },
    { id: "database", code: "IST2610", vi: "Quản lý CSDL", en: "Database Management" },
    { id: "decision", code: "IST3500", vi: "Ra quyết định trong kinh doanh", en: "Business Decision Making" },
    { id: "planning", code: "IST4120", vi: "Hoạch định & chính sách HTTT", en: "IS Planning & Policy" },
    { id: "advanced", code: "IST4510", vi: "Phân tích dữ liệu nâng cao", en: "Advanced Data Analytics" },
    { id: "mining", code: "IST4520", vi: "Khai thác dữ liệu", en: "Data Mining" }
  ];

  const copy = {
    vi: {
      launcher: "Hỏi AI",
      title: "Hỏi AI về notes",
      subtitle: "Gemini File Search · có dẫn nguồn",
      close: "Đóng chat AI",
      settings: "Cài đặt Gemini",
      disconnected: "Chưa kết nối Gemini",
      noStore: "Chưa có tài liệu được lập chỉ mục",
      storeReady: count => `${count} tài liệu trong kho File Search`,
      setupTitle: "Kết nối Gemini API",
      setupText: "Nhập API key của riêng bạn để lập chỉ mục notes và hỏi đáp. Key không được ghi vào GitHub.",
      keyLabel: "Gemini API key",
      keyPlaceholder: "Dán auth API key từ Google AI Studio",
      showKey: "Hiện hoặc ẩn API key",
      rememberSession: "Giữ key trong sessionStorage đến khi đóng tab. Không lưu vào localStorage.",
      connect: "Kết nối Gemini",
      updateConnection: "Cập nhật kết nối",
      getKey: "Lấy API key tại Google AI Studio ↗",
      disconnect: "Ngắt kết nối trên tab này",
      deleteStore: "Xóa kho AI trên Google",
      confirmDeleteStore: "Xóa File Search store và toàn bộ tài liệu đã index trên Google? Hành động này không thể hoàn tác.",
      deletingStore: "Đang xóa File Search store…",
      storeDeleted: "Đã xóa kho AI và toàn bộ tài liệu đã index.",
      security: "Bảo mật: key chỉ giữ trong phiên. Dữ liệu đã index nằm trên Google cho đến khi bạn dùng nút Xóa kho AI.",
      indexPage: "Lập chỉ mục notes",
      upload: "Thêm tài liệu",
      clear: "Xóa đoạn chat",
      emptyTitle: "Hỏi sâu hơn khi đang học",
      emptyText: "Lập chỉ mục notes trên trang hoặc thêm PDF/DOCX/Markdown, sau đó đặt câu hỏi. AI sẽ trả lời dựa trên tài liệu và ghi nguồn.",
      placeholder: "Ví dụ: Vì sao diversification làm giảm risk?",
      send: "Gửi câu hỏi",
      you: "Bạn",
      tutor: "AI Tutor",
      source: "Nguồn",
      page: "trang",
      connecting: "Đang kiểm tra API key…",
      connected: "Đã kết nối Gemini trên tab này.",
      disconnectedDone: "Đã xóa API key khỏi tab. Kho và lịch sử local vẫn được giữ.",
      creatingStore: "Đang tạo File Search store…",
      preparingNotes: "Đang gom nội dung bài học và ghi chú local…",
      indexing: (name, current, total) => `Đang chunk → embedding → index: ${name} (${current}/${total})…`,
      indexed: count => `Đã lập chỉ mục ${count} tài liệu. Bạn có thể bắt đầu hỏi.`,
      asking: "Đang tìm các đoạn note liên quan và tạo câu trả lời…",
      noAnswer: "Gemini chưa trả về nội dung trả lời.",
      needStore: "Hãy lập chỉ mục notes hoặc thêm ít nhất một tài liệu trước khi hỏi.",
      needQuestion: "Hãy nhập câu hỏi của bạn.",
      fileTooLarge: name => `${name} lớn hơn giới hạn 100 MB của File Search.`,
      uploadFailed: "Không thể lấy URL upload từ Gemini.",
      operationTimeout: "Gemini vẫn đang lập chỉ mục. Hãy thử lại sau ít phút.",
      genericError: "Có lỗi khi kết nối Gemini. Hãy kiểm tra API key, quota và kết nối mạng.",
      invalidKey: "API key không hợp lệ hoặc chưa được cấp quyền Gemini API.",
      quota: "Gemini đã hết quota hoặc đang giới hạn tốc độ. Hãy chờ rồi thử lại.",
      network: "Trình duyệt không kết nối được Gemini API. Hãy kiểm tra mạng hoặc tiện ích chặn request.",
      confirmClear: "Xóa toàn bộ lịch sử chat lưu trên thiết bị này?",
      notesFileTitle: "Ghi chú Radiant Light",
      noLocalNotes: "Chưa có ghi chú cá nhân nào trên thiết bị.",
      privacyHint: "Chỉ notes/tệp bạn chủ động chọn mới được gửi đến Gemini File Search.",
      fileDialog: "Chọn PDF, DOCX, Markdown, TXT, CSV hoặc tài liệu học tập",
      busy: "Đang xử lý…"
    },
    en: {
      launcher: "Ask AI",
      title: "Ask AI about notes",
      subtitle: "Gemini File Search · cited answers",
      close: "Close AI chat",
      settings: "Gemini settings",
      disconnected: "Gemini is not connected",
      noStore: "No indexed documents yet",
      storeReady: count => `${count} documents in the File Search store`,
      setupTitle: "Connect Gemini API",
      setupText: "Enter your own API key to index notes and ask questions. The key is never committed to GitHub.",
      keyLabel: "Gemini API key",
      keyPlaceholder: "Paste an auth API key from Google AI Studio",
      showKey: "Show or hide API key",
      rememberSession: "Keep the key in sessionStorage until this tab closes. It is not saved to localStorage.",
      connect: "Connect Gemini",
      updateConnection: "Update connection",
      getKey: "Get an API key from Google AI Studio ↗",
      disconnect: "Disconnect this tab",
      deleteStore: "Delete Google AI store",
      confirmDeleteStore: "Delete the File Search store and every indexed document on Google? This cannot be undone.",
      deletingStore: "Deleting the File Search store…",
      storeDeleted: "The AI store and all indexed documents were deleted.",
      security: "Security: the key only lasts for this session. Indexed data stays on Google until you use Delete Google AI store.",
      indexPage: "Index current notes",
      upload: "Add documents",
      clear: "Clear chat",
      emptyTitle: "Ask for a deeper explanation",
      emptyText: "Index notes from this site or add PDF/DOCX/Markdown files, then ask a question. AI answers from your sources and shows citations.",
      placeholder: "Example: Why does diversification reduce risk?",
      send: "Send question",
      you: "You",
      tutor: "AI Tutor",
      source: "Source",
      page: "page",
      connecting: "Checking the API key…",
      connected: "Gemini is connected for this tab.",
      disconnectedDone: "The API key was removed from this tab. Your local store reference and history remain.",
      creatingStore: "Creating a File Search store…",
      preparingNotes: "Collecting lesson content and local notes…",
      indexing: (name, current, total) => `Chunking → embedding → indexing: ${name} (${current}/${total})…`,
      indexed: count => `${count} document(s) indexed. You can start asking questions.`,
      asking: "Finding relevant note passages and drafting an answer…",
      noAnswer: "Gemini returned no answer text.",
      needStore: "Index the current notes or add at least one document before asking.",
      needQuestion: "Enter your question first.",
      fileTooLarge: name => `${name} exceeds File Search's 100 MB document limit.`,
      uploadFailed: "Gemini did not return an upload URL.",
      operationTimeout: "Gemini is still indexing. Try again in a few minutes.",
      genericError: "Gemini could not be reached. Check your API key, quota, and network connection.",
      invalidKey: "The API key is invalid or does not have Gemini API access.",
      quota: "Gemini quota is exhausted or rate-limited. Wait and try again.",
      network: "The browser could not reach Gemini API. Check the network or request-blocking extensions.",
      confirmClear: "Clear all chat history saved on this device?",
      notesFileTitle: "Radiant Light study notes",
      noLocalNotes: "No personal notes are saved on this device yet.",
      privacyHint: "Only notes or files you explicitly choose are sent to Gemini File Search.",
      fileDialog: "Choose PDF, DOCX, Markdown, TXT, CSV, or study documents",
      busy: "Working…"
    }
  };

  const state = {
    key: safeSessionGet(SESSION_KEY),
    storeName: safeLocalGet(STORE_KEY),
    documentCount: Number(safeLocalGet(STORE_COUNT_KEY) || 0),
    history: loadHistory(),
    busy: false,
    setupVisible: false
  };

  document.body.insertAdjacentHTML("beforeend", `
    <button class="ai-study-launcher" id="aiStudyLauncher" type="button" aria-expanded="false" aria-controls="aiStudyPanel">
      <span class="ai-study-launcher-icon" aria-hidden="true">✦</span>
      <span data-ai-i18n="launcher">Hỏi AI</span>
    </button>

    <section class="ai-study-panel" id="aiStudyPanel" role="dialog" aria-modal="false" aria-labelledby="aiStudyTitle" hidden>
      <header class="ai-study-header">
        <div class="ai-study-title">
          <span class="ai-study-logo" aria-hidden="true">✦</span>
          <div>
            <strong id="aiStudyTitle" data-ai-i18n="title">Hỏi AI về notes</strong>
            <small data-ai-i18n="subtitle">Gemini File Search · có dẫn nguồn</small>
          </div>
        </div>
        <div class="ai-study-header-actions">
          <button class="ai-study-icon-button" id="aiStudySettings" type="button" data-ai-label="settings" aria-label="Cài đặt Gemini">⚙</button>
          <button class="ai-study-icon-button" id="aiStudyClose" type="button" data-ai-label="close" aria-label="Đóng chat AI">×</button>
        </div>
      </header>

      <div class="ai-study-store-bar">
        <span class="ai-study-store-state"><i class="ai-study-dot" id="aiStudyDot"></i><span id="aiStudyStoreState">Chưa kết nối Gemini</span></span>
        <span class="ai-study-model">Gemini Flash</span>
      </div>

      <div class="ai-study-setup" id="aiStudySetup">
        <div class="ai-study-setup-card">
          <h3 data-ai-i18n="setupTitle">Kết nối Gemini API</h3>
          <p data-ai-i18n="setupText">Nhập API key của riêng bạn để lập chỉ mục notes và hỏi đáp. Key không được ghi vào GitHub.</p>
          <label class="ai-study-field">
            <span data-ai-i18n="keyLabel">Gemini API key</span>
            <span class="ai-study-key-row">
              <input id="aiStudyKey" type="password" autocomplete="off" spellcheck="false" data-ai-placeholder="keyPlaceholder" placeholder="Dán auth API key từ Google AI Studio" />
              <button id="aiStudyShowKey" type="button" data-ai-label="showKey" aria-label="Hiện hoặc ẩn API key">◉</button>
            </span>
          </label>
          <label class="ai-study-check"><input id="aiStudyRemember" type="checkbox" checked /><span data-ai-i18n="rememberSession">Giữ key trong sessionStorage đến khi đóng tab. Không lưu vào localStorage.</span></label>
          <div class="ai-study-setup-actions">
            <button class="ai-study-primary" id="aiStudyConnect" type="button" data-ai-i18n="connect">Kết nối Gemini</button>
            <a class="ai-study-doc-link" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" data-ai-i18n="getKey">Lấy API key tại Google AI Studio ↗</a>
          </div>
          <div class="ai-study-data-actions">
            <button class="ai-study-ghost" id="aiStudyDisconnect" type="button" data-ai-i18n="disconnect" hidden>Ngắt kết nối trên tab này</button>
            <button class="ai-study-ghost ai-study-danger" id="aiStudyDeleteStore" type="button" data-ai-i18n="deleteStore" hidden>Xóa kho AI trên Google</button>
          </div>
          <p class="ai-study-security-note" data-ai-i18n="security">Bảo mật: key chỉ giữ trong phiên. Dữ liệu đã index nằm trên Google cho đến khi bạn dùng nút Xóa kho AI.</p>
        </div>
      </div>

      <div class="ai-study-main" id="aiStudyMain" hidden>
        <div class="ai-study-tools">
          <button class="ai-study-secondary" id="aiStudyIndexPage" type="button">✦ <span data-ai-i18n="indexPage">Lập chỉ mục notes</span></button>
          <button class="ai-study-secondary" id="aiStudyUpload" type="button">＋ <span data-ai-i18n="upload">Thêm tài liệu</span></button>
          <button class="ai-study-secondary" id="aiStudyClear" type="button">⌫ <span data-ai-i18n="clear">Xóa đoạn chat</span></button>
        </div>
        <div class="ai-study-messages" id="aiStudyMessages" role="log" aria-live="polite"></div>
        <div class="ai-study-progress" id="aiStudyProgress" role="status" aria-live="polite"></div>
        <form class="ai-study-composer" id="aiStudyForm">
          <textarea id="aiStudyQuestion" rows="1" data-ai-placeholder="placeholder" placeholder="Ví dụ: Vì sao diversification làm giảm risk?"></textarea>
          <button class="ai-study-primary ai-study-send" type="submit" data-ai-label="send" aria-label="Gửi câu hỏi">↑</button>
        </form>
      </div>

      <input id="aiStudyFileInput" type="file" multiple hidden accept=".pdf,.doc,.docx,.txt,.md,.markdown,.csv,.html,.htm,.json,.pptx,.xlsx,.sql" />
    </section>`);

  const ui = {
    launcher: document.querySelector("#aiStudyLauncher"),
    panel: document.querySelector("#aiStudyPanel"),
    close: document.querySelector("#aiStudyClose"),
    settings: document.querySelector("#aiStudySettings"),
    dot: document.querySelector("#aiStudyDot"),
    storeState: document.querySelector("#aiStudyStoreState"),
    setup: document.querySelector("#aiStudySetup"),
    main: document.querySelector("#aiStudyMain"),
    key: document.querySelector("#aiStudyKey"),
    showKey: document.querySelector("#aiStudyShowKey"),
    remember: document.querySelector("#aiStudyRemember"),
    connect: document.querySelector("#aiStudyConnect"),
    disconnect: document.querySelector("#aiStudyDisconnect"),
    deleteStore: document.querySelector("#aiStudyDeleteStore"),
    indexPage: document.querySelector("#aiStudyIndexPage"),
    upload: document.querySelector("#aiStudyUpload"),
    clear: document.querySelector("#aiStudyClear"),
    messages: document.querySelector("#aiStudyMessages"),
    progress: document.querySelector("#aiStudyProgress"),
    form: document.querySelector("#aiStudyForm"),
    question: document.querySelector("#aiStudyQuestion"),
    send: document.querySelector(".ai-study-send"),
    fileInput: document.querySelector("#aiStudyFileInput")
  };

  function language() {
    return document.documentElement.lang === "en" ? "en" : "vi";
  }

  function t(key, ...args) {
    const value = copy[language()][key];
    return typeof value === "function" ? value(...args) : value;
  }

  function safeLocalGet(key) {
    try { return localStorage.getItem(key) || ""; } catch (error) { return ""; }
  }

  function safeLocalSet(key, value) {
    try { localStorage.setItem(key, value); } catch (error) { /* local storage is optional */ }
  }

  function safeLocalRemove(key) {
    try { localStorage.removeItem(key); } catch (error) { /* local storage is optional */ }
  }

  function safeSessionGet(key) {
    try { return sessionStorage.getItem(key) || ""; } catch (error) { return ""; }
  }

  function safeSessionSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (error) { /* keep key in memory */ }
  }

  function safeSessionRemove(key) {
    try { sessionStorage.removeItem(key); } catch (error) { /* nothing to remove */ }
  }

  function loadHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(item => item && ["user", "assistant"].includes(item.role) && typeof item.text === "string").slice(-MAX_HISTORY);
    } catch (error) {
      return [];
    }
  }

  function saveHistory() {
    safeLocalSet(HISTORY_KEY, JSON.stringify(state.history.slice(-MAX_HISTORY)));
  }

  function apiKey() {
    return state.key || safeSessionGet(SESSION_KEY);
  }

  function updateTranslations() {
    document.querySelectorAll("[data-ai-i18n]").forEach(node => {
      const key = node.dataset.aiI18n;
      if (copy[language()][key]) node.textContent = t(key);
    });
    document.querySelectorAll("[data-ai-placeholder]").forEach(node => {
      node.placeholder = t(node.dataset.aiPlaceholder);
    });
    document.querySelectorAll("[data-ai-label]").forEach(node => {
      node.setAttribute("aria-label", t(node.dataset.aiLabel));
    });
    ui.fileInput.setAttribute("aria-label", t("fileDialog"));
    updateConnectionView();
    renderHistory();
  }

  function updateConnectionView() {
    const connected = Boolean(apiKey());
    ui.dot.classList.toggle("ready", connected && Boolean(state.storeName));
    if (!connected) {
      ui.storeState.textContent = t("disconnected");
    } else if (!state.storeName) {
      ui.storeState.textContent = t("noStore");
    } else {
      ui.storeState.textContent = t("storeReady", state.documentCount);
    }
    ui.disconnect.hidden = !connected;
    ui.deleteStore.hidden = !connected || !state.storeName;
    ui.connect.textContent = connected ? t("updateConnection") : t("connect");
  }

  function showConnectedView() {
    state.setupVisible = false;
    ui.setup.hidden = true;
    ui.main.hidden = false;
    updateConnectionView();
    renderHistory();
  }

  function showSetupView() {
    state.setupVisible = true;
    ui.setup.hidden = false;
    ui.main.hidden = true;
    ui.key.value = "";
    updateConnectionView();
    window.setTimeout(() => ui.key.focus(), 40);
  }

  function openPanel() {
    ui.panel.hidden = false;
    ui.launcher.setAttribute("aria-expanded", "true");
    if (apiKey() && !state.setupVisible) showConnectedView();
    else showSetupView();
  }

  function closePanel() {
    ui.panel.hidden = true;
    ui.launcher.setAttribute("aria-expanded", "false");
    ui.launcher.focus();
  }

  function setProgress(message = "", tone = "") {
    ui.progress.className = `ai-study-progress${tone ? ` ${tone}` : ""}`;
    ui.progress.textContent = message;
  }

  function setProgressBusy(message) {
    ui.progress.className = "ai-study-progress";
    ui.progress.replaceChildren();
    const spinner = document.createElement("span");
    spinner.className = "ai-study-spinner";
    spinner.setAttribute("aria-hidden", "true");
    ui.progress.append(spinner, document.createTextNode(message));
  }

  function setBusy(busy) {
    state.busy = busy;
    [ui.connect, ui.deleteStore, ui.indexPage, ui.upload, ui.clear, ui.question, ui.send, ui.fileInput].forEach(control => {
      control.disabled = busy;
    });
  }

  function addMessage(role, text, citations = []) {
    state.history.push({
      role,
      text: String(text || "").slice(0, 24000),
      citations: Array.isArray(citations) ? citations.slice(0, 8) : []
    });
    state.history = state.history.slice(-MAX_HISTORY);
    saveHistory();
    renderHistory();
  }

  function renderHistory() {
    if (!ui) return;
    ui.messages.replaceChildren();
    if (!state.history.length) {
      const empty = document.createElement("div");
      empty.className = "ai-study-empty";
      const icon = document.createElement("span");
      icon.textContent = "✦";
      const title = document.createElement("strong");
      title.textContent = t("emptyTitle");
      const description = document.createElement("p");
      description.textContent = t("emptyText");
      empty.append(icon, title, description);
      ui.messages.append(empty);
      return;
    }

    state.history.forEach(item => {
      const message = document.createElement("article");
      message.className = `ai-study-message ${item.role}`;
      const label = document.createElement("span");
      label.className = "ai-study-message-label";
      label.textContent = item.role === "user" ? t("you") : t("tutor");
      const bubble = document.createElement("div");
      bubble.className = "ai-study-bubble";
      bubble.textContent = item.text;
      message.append(label, bubble);

      if (item.role === "assistant" && Array.isArray(item.citations) && item.citations.length) {
        const sources = document.createElement("div");
        sources.className = "ai-study-sources";
        item.citations.forEach((citation, index) => {
          const source = document.createElement("div");
          source.className = "ai-study-source";
          const heading = document.createElement("b");
          const pageLabel = citation.page ? ` · ${t("page")} ${citation.page}` : "";
          heading.textContent = `${t("source")} ${index + 1}: ${citation.name || "Note"}${pageLabel}`;
          source.append(heading);
          if (citation.source) source.append(document.createTextNode(String(citation.source).slice(0, 260)));
          sources.append(source);
        });
        message.append(sources);
      }

      ui.messages.append(message);
    });
    window.requestAnimationFrame(() => { ui.messages.scrollTop = ui.messages.scrollHeight; });
  }

  async function parseApiError(response) {
    let detail = "";
    try {
      const payload = await response.json();
      detail = payload?.error?.message || payload?.message || "";
    } catch (error) {
      try { detail = await response.text(); } catch (readError) { detail = ""; }
    }
    const apiError = new Error(detail || `Gemini API returned HTTP ${response.status}`);
    apiError.status = response.status;
    return apiError;
  }

  function friendlyError(error) {
    if (error?.status === 401 || error?.status === 403) return t("invalidKey");
    if (error?.status === 429) return t("quota");
    if (error instanceof TypeError) return t("network");
    return error?.message || t("genericError");
  }

  async function apiRequest(path, options = {}, key = apiKey()) {
    if (!key) {
      const error = new Error(t("invalidKey"));
      error.status = 401;
      throw error;
    }
    const headers = new Headers(options.headers || {});
    headers.set("x-goog-api-key", key);
    if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    const response = await fetch(`${API_ROOT}${path}`, { ...options, headers });
    if (!response.ok) throw await parseApiError(response);
    if (response.status === 204) return {};
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  function resourcePath(name) {
    return String(name || "").split("/").map(segment => encodeURIComponent(segment)).join("/");
  }

  async function connectGemini() {
    const candidate = ui.key.value.trim() || apiKey();
    if (!candidate) {
      setProgress(t("invalidKey"), "error");
      ui.key.focus();
      return;
    }

    setBusy(true);
    setProgressBusy(t("connecting"));
    try {
      await apiRequest("/fileSearchStores?pageSize=1", { method: "GET" }, candidate);
      state.key = candidate;
      if (ui.remember.checked) safeSessionSet(SESSION_KEY, candidate);
      else safeSessionRemove(SESSION_KEY);
      ui.key.value = "";
      await refreshStoreStatus();
      showConnectedView();
      setProgress(t("connected"), "success");
    } catch (error) {
      state.key = "";
      safeSessionRemove(SESSION_KEY);
      setProgress(friendlyError(error), "error");
    } finally {
      setBusy(false);
      updateConnectionView();
    }
  }

  function disconnectGemini() {
    state.key = "";
    safeSessionRemove(SESSION_KEY);
    showSetupView();
    setProgress(t("disconnectedDone"), "success");
  }

  async function deleteFileSearchStore() {
    if (!state.storeName || !apiKey() || state.busy) return;
    if (!window.confirm(t("confirmDeleteStore"))) return;
    setBusy(true);
    setProgressBusy(t("deletingStore"));
    try {
      await apiRequest(`/${resourcePath(state.storeName)}?force=true`, { method: "DELETE" });
      state.storeName = "";
      state.documentCount = 0;
      safeLocalRemove(STORE_KEY);
      safeLocalRemove(STORE_COUNT_KEY);
      setProgress(t("storeDeleted"), "success");
    } catch (error) {
      setProgress(friendlyError(error), "error");
    } finally {
      setBusy(false);
      updateConnectionView();
    }
  }

  async function refreshStoreStatus() {
    if (!state.storeName || !apiKey()) {
      updateConnectionView();
      return;
    }
    try {
      const result = await apiRequest(`/${resourcePath(state.storeName)}/documents?pageSize=20`, { method: "GET" });
      const documents = result.documents || result.fileSearchDocuments || [];
      if (Array.isArray(documents)) {
        state.documentCount = documents.length;
        safeLocalSet(STORE_COUNT_KEY, String(state.documentCount));
      }
    } catch (error) {
      if (error.status === 404) {
        state.storeName = "";
        state.documentCount = 0;
        safeLocalRemove(STORE_KEY);
        safeLocalRemove(STORE_COUNT_KEY);
      } else {
        throw error;
      }
    }
    updateConnectionView();
  }

  async function ensureStore() {
    if (state.storeName) return state.storeName;
    setProgressBusy(t("creatingStore"));
    const store = await apiRequest("/fileSearchStores", {
      method: "POST",
      body: JSON.stringify({
        displayName: "Radiant Light Notes",
        embeddingModel: EMBEDDING_MODEL
      })
    });
    if (!store.name) throw new Error(t("genericError"));
    state.storeName = store.name;
    state.documentCount = 0;
    safeLocalSet(STORE_KEY, state.storeName);
    safeLocalSet(STORE_COUNT_KEY, "0");
    updateConnectionView();
    return state.storeName;
  }

  function inferMimeType(file) {
    if (file.type) return file.type;
    const extension = file.name.toLowerCase().split(".").pop();
    const types = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain",
      md: "text/markdown",
      markdown: "text/markdown",
      csv: "text/csv",
      html: "text/html",
      htm: "text/html",
      json: "application/json",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      sql: "application/sql"
    };
    return types[extension] || "text/plain";
  }

  async function uploadToStore(file, storeName) {
    if (file.size > MAX_FILE_BYTES) throw new Error(t("fileTooLarge", file.name));
    const mimeType = inferMimeType(file);
    const client = new GoogleGenAI({ apiKey: apiKey() });
    let operation = await client.fileSearchStores.uploadToFileSearchStore({
      fileSearchStoreName: storeName,
      file,
      config: {
        displayName: file.name.slice(0, 500),
        mimeType,
        chunkingConfig: {
          whiteSpaceConfig: {
            maxTokensPerChunk: 300,
            maxOverlapTokens: 40
          }
        }
      }
    });

    for (let attempt = 0; attempt < 30; attempt += 1) {
      if (operation?.done) {
        if (operation.error) {
          const error = new Error(operation.error.message || t("genericError"));
          error.status = operation.error.code;
          throw error;
        }
        return operation;
      }
      await new Promise(resolve => window.setTimeout(resolve, 2000));
      operation = await client.operations.get({ operation });
    }
    throw new Error(t("operationTimeout"));
  }

  async function indexFiles(files) {
    const selected = Array.from(files || []).filter(Boolean);
    if (!selected.length || state.busy) return;
    setBusy(true);
    try {
      const storeName = await ensureStore();
      for (let index = 0; index < selected.length; index += 1) {
        const file = selected[index];
        setProgressBusy(t("indexing", file.name, index + 1, selected.length));
        await uploadToStore(file, storeName);
        state.documentCount += 1;
        safeLocalSet(STORE_COUNT_KEY, String(state.documentCount));
        updateConnectionView();
      }
      setProgress(t("indexed", selected.length), "success");
    } catch (error) {
      setProgress(friendlyError(error), "error");
    } finally {
      setBusy(false);
      ui.fileInput.value = "";
    }
  }

  function collectPageNotes() {
    const lines = [];
    const seen = new Set();
    const main = document.querySelector("main");
    if (main) {
      main.querySelectorAll("h1, h2, h3, h4, p, li, summary, pre").forEach(node => {
        const value = node.textContent.replace(/\s+/g, " ").trim();
        if (value.length < 3 || seen.has(value)) return;
        seen.add(value);
        lines.push(value);
      });
    }

    const localSections = [];
    courses.forEach(course => {
      const liveEditor = document.querySelector(`[data-local-note-course="${course.id}"] textarea`);
      const value = String(liveEditor?.value || safeLocalGet(`han-study-local-note-v1:${course.id}`)).trim();
      if (!value) return;
      localSections.push(`\n[${course.code} · ${course[language()]}]\n${value}`);
    });

    const heading = `${t("notesFileTitle")}\nURL: ${window.location.href.split("#")[0]}\nIndexed: ${new Date().toISOString()}\n${"=".repeat(64)}\n`;
    const lessonContent = lines.join("\n");
    const localContent = localSections.length
      ? `\n\nPERSONAL NOTES ON THIS DEVICE\n${localSections.join("\n")}`
      : `\n\n${t("noLocalNotes")}`;
    return `${heading}\n${lessonContent}${localContent}`;
  }

  async function indexCurrentNotes() {
    if (state.busy) return;
    setProgressBusy(t("preparingNotes"));
    const content = collectPageNotes();
    const date = new Date().toISOString().slice(0, 10);
    const file = new File([content], `radiant-light-notes-${date}.txt`, { type: "text/plain" });
    await indexFiles([file]);
  }

  function extractInteraction(response) {
    const textParts = [];
    const citations = [];
    (response.steps || []).forEach(step => {
      if (step.type !== "model_output") return;
      (step.content || []).forEach(block => {
        if (block.type === "text" && block.text) textParts.push(block.text);
        (block.annotations || []).forEach(annotation => {
          if (annotation.type !== "file_citation") return;
          citations.push({
            name: annotation.file_name || annotation.fileName || "Note",
            page: annotation.page_number || annotation.pageNumber || "",
            source: annotation.source || ""
          });
        });
      });
    });

    if (!textParts.length && response.output_text) textParts.push(response.output_text);
    const uniqueCitations = citations.filter((citation, index, all) => {
      const signature = `${citation.name}|${citation.page}|${citation.source}`;
      return all.findIndex(item => `${item.name}|${item.page}|${item.source}` === signature) === index;
    });
    return { text: textParts.join("\n\n").trim(), citations: uniqueCitations };
  }

  async function askQuestion(event) {
    event.preventDefault();
    if (state.busy) return;
    const question = ui.question.value.trim();
    if (!question) {
      setProgress(t("needQuestion"), "error");
      ui.question.focus();
      return;
    }
    if (!state.storeName) {
      setProgress(t("needStore"), "error");
      return;
    }

    addMessage("user", question);
    ui.question.value = "";
    resizeQuestion();
    setBusy(true);
    setProgressBusy(t("asking"));
    try {
      const prompt = language() === "vi"
        ? `Bạn là gia sư đại học kiên nhẫn cho người mới bắt đầu. Hãy dùng File Search để tìm 3–5 đoạn ghi chú liên quan nhất, giải thích từng bước bằng tiếng Việt đơn giản, định nghĩa thuật ngữ và đưa ví dụ ngắn. Chỉ khẳng định điều có căn cứ trong tài liệu; nếu notes chưa đủ, nói rõ phần còn thiếu. Câu hỏi của sinh viên: ${question}`
        : `You are a patient university tutor for a complete beginner. Use File Search to retrieve the 3–5 most relevant note passages, explain step by step in plain English, define terms, and give a short example. Only make claims grounded in the documents; clearly state when the notes are insufficient. Student question: ${question}`;
      const response = await apiRequest("/interactions", {
        method: "POST",
        body: JSON.stringify({
          model: MODEL,
          input: prompt,
          tools: [{
            type: "file_search",
            file_search_store_names: [state.storeName]
          }]
        })
      });
      const answer = extractInteraction(response);
      if (!answer.text) throw new Error(t("noAnswer"));
      addMessage("assistant", answer.text, answer.citations);
      setProgress(answer.citations.length ? `${answer.citations.length} ${t("source").toLowerCase()}` : "", "success");
    } catch (error) {
      const message = friendlyError(error);
      addMessage("assistant", message);
      setProgress(message, "error");
    } finally {
      setBusy(false);
      ui.question.focus();
    }
  }

  function clearHistory() {
    if (!state.history.length || !window.confirm(t("confirmClear"))) return;
    state.history = [];
    safeLocalRemove(HISTORY_KEY);
    setProgress("");
    renderHistory();
  }

  function resizeQuestion() {
    ui.question.style.height = "auto";
    ui.question.style.height = `${Math.min(ui.question.scrollHeight, 120)}px`;
  }

  ui.launcher.addEventListener("click", () => ui.panel.hidden ? openPanel() : closePanel());
  ui.close.addEventListener("click", closePanel);
  ui.settings.addEventListener("click", showSetupView);
  ui.connect.addEventListener("click", connectGemini);
  ui.disconnect.addEventListener("click", disconnectGemini);
  ui.deleteStore.addEventListener("click", deleteFileSearchStore);
  ui.showKey.addEventListener("click", () => {
    ui.key.type = ui.key.type === "password" ? "text" : "password";
    ui.key.focus();
  });
  ui.indexPage.addEventListener("click", indexCurrentNotes);
  ui.upload.addEventListener("click", () => ui.fileInput.click());
  ui.fileInput.addEventListener("change", () => indexFiles(ui.fileInput.files));
  ui.clear.addEventListener("click", clearHistory);
  ui.form.addEventListener("submit", askQuestion);
  ui.question.addEventListener("input", resizeQuestion);
  ui.question.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      ui.form.requestSubmit();
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !ui.panel.hidden) closePanel();
  });

  const languageObserver = new MutationObserver(updateTranslations);
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  updateTranslations();
  updateConnectionView();
  renderHistory();
  if (apiKey()) {
    showConnectedView();
    refreshStoreStatus().catch(error => setProgress(friendlyError(error), "error"));
  } else {
    showSetupView();
  }

  window.RadiantAIChat = {
    open: openPanel,
    indexCurrentNotes
  };
})();
