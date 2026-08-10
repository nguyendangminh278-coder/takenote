# Radiant Light AI Chat / Hỏi đáp AI theo notes

## Cách dùng nhanh

1. Mở website và bấm **Hỏi AI** ở góc dưới bên phải.
2. Mở [Google AI Studio](https://aistudio.google.com/app/apikey), tạo **auth API key** và giới hạn key cho Gemini API.
3. Dán key vào hộp kết nối. Key chỉ được giữ trong `sessionStorage` đến khi đóng tab, không được ghi vào GitHub hay `localStorage`.
4. Bấm **Lập chỉ mục notes** để gửi nội dung học và ghi chú local hiện tại, hoặc **Thêm tài liệu** để chọn PDF, DOCX, Markdown, TXT, CSV và các file học tập khác.
5. Đặt câu hỏi. Gemini File Search sẽ tìm đoạn liên quan, Gemini Flash giải thích và widget hiển thị citation từ tài liệu.
6. Vào biểu tượng bánh răng và bấm **Xóa kho AI trên Google** khi muốn xóa toàn bộ tài liệu đã index.

## Quick start

1. Open the site and select **Ask AI** in the bottom-right corner.
2. Create an **auth API key** in [Google AI Studio](https://aistudio.google.com/app/apikey) and restrict it to the Gemini API.
3. Paste the key into the connection form. It stays in `sessionStorage` until the tab closes and is never committed to GitHub or written to `localStorage`.
4. Select **Index current notes** or **Add documents**.
5. Ask a question. File Search retrieves relevant passages, Gemini Flash explains them, and the widget renders document citations.
6. Use **Delete Google AI store** in settings to remove all indexed documents.

## MVP architecture

```text
Local note / uploaded document
        ↓
Gemini File Search
(chunk → embedding → index)
        ↓
Student question
        ↓
Semantic retrieval
        ↓
Gemini Flash
        ↓
Answer + file citation
```

The public repository contains no Gemini API key. This is a personal BYOK MVP. For a multi-user production application, move Gemini requests behind a backend proxy and keep credentials in a server-side secret manager.

Official references:

- [Gemini File Search](https://ai.google.dev/gemini-api/docs/file-search)
- [Gemini API key security](https://ai.google.dev/gemini-api/docs/api-key)
- [Google Gen AI JavaScript SDK](https://googleapis.github.io/js-genai/)
