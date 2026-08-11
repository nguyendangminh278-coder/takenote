const sqlBaCommands = [
  {
    number: "01",
    keyword: "SELECT",
    vi: "Lấy dữ liệu cần kiểm tra",
    en: "Retrieve the data you need",
    purposeVi: "Liệt kê customer và trạng thái hiện tại để đối chiếu requirement.",
    purposeEn: "List customers and current statuses to validate a requirement.",
    code: `SELECT customer_id,
       customer_name,
       status
FROM customers;`,
    noteVi: "Ưu tiên chọn đúng cột thay vì SELECT * để query dễ đọc và giảm dữ liệu không cần thiết.",
    noteEn: "Prefer named columns over SELECT * so the query is clearer and returns only necessary data."
  },
  {
    number: "02",
    keyword: "WHERE",
    vi: "Lọc theo business rule",
    en: "Filter by a business rule",
    purposeVi: "Kiểm tra giao dịch thành công có giá trị từ 1.000.000 trở lên.",
    purposeEn: "Check successful transactions worth at least 1,000,000.",
    code: `SELECT transaction_id,
       customer_id,
       amount
FROM transactions
WHERE status = 'SUCCESS'
  AND amount >= 1000000;`,
    noteVi: "Dùng AND khi tất cả điều kiện phải đúng; dùng OR khi chỉ cần một điều kiện đúng. Luôn kiểm tra cách xử lý NULL.",
    noteEn: "Use AND when every condition must hold and OR when one is enough. Always confirm how NULL should be handled."
  },
  {
    number: "03",
    keyword: "ORDER BY",
    vi: "Sắp xếp và lấy Top N",
    en: "Sort and return Top N",
    purposeVi: "Tìm 10 giao dịch có giá trị lớn nhất để kiểm tra outlier hoặc nhóm ưu tiên.",
    purposeEn: "Find the ten largest transactions to inspect outliers or priority cases.",
    code: `SELECT transaction_id,
       customer_id,
       amount
FROM transactions
ORDER BY amount DESC
LIMIT 10;`,
    noteVi: "DESC là lớn → nhỏ; ASC là nhỏ → lớn. LIMIT dùng cho MySQL/PostgreSQL, còn SQL Server và Oracle có cú pháp khác.",
    noteEn: "DESC means high to low; ASC means low to high. LIMIT is for MySQL/PostgreSQL; SQL Server and Oracle differ."
  },
  {
    number: "04",
    keyword: "COUNT · SUM · AVG · MIN · MAX",
    vi: "Tính KPI cơ bản",
    en: "Calculate core KPIs",
    purposeVi: "Đếm giao dịch, tính tổng doanh thu, trung bình, nhỏ nhất và lớn nhất.",
    purposeEn: "Count transactions and calculate total, average, minimum, and maximum values.",
    code: `SELECT COUNT(*)    AS transaction_count,
       SUM(amount) AS total_amount,
       AVG(amount) AS avg_amount,
       MIN(amount) AS min_amount,
       MAX(amount) AS max_amount
FROM transactions
WHERE status = 'SUCCESS';`,
    noteVi: "AVG(amount) bỏ qua NULL. COUNT(*) đếm dòng; COUNT(amount) chỉ đếm dòng amount không NULL.",
    noteEn: "AVG(amount) ignores NULL. COUNT(*) counts rows; COUNT(amount) counts only non-NULL amount values."
  },
  {
    number: "05",
    keyword: "GROUP BY",
    vi: "Phân nhóm để phân tích",
    en: "Group data for analysis",
    purposeVi: "Tính doanh thu theo ngày hoặc đếm customer theo tỉnh.",
    purposeEn: "Calculate daily revenue or count customers by province.",
    code: `SELECT transaction_date,
       COUNT(*)    AS transaction_count,
       SUM(amount) AS total_amount
FROM transactions
WHERE status = 'SUCCESS'
GROUP BY transaction_date
ORDER BY transaction_date;`,
    noteVi: "Mọi cột trong SELECT không dùng aggregate phải xuất hiện trong GROUP BY. Xác định đúng grain trước khi nhóm.",
    noteEn: "Every selected non-aggregate column must appear in GROUP BY. Define the intended grain before grouping."
  },
  {
    number: "06",
    keyword: "HAVING",
    vi: "Lọc sau khi phân nhóm",
    en: "Filter after aggregation",
    purposeVi: "Tìm những tỉnh có hơn 1.000 khách hàng.",
    purposeEn: "Find provinces with more than 1,000 customers.",
    code: `SELECT province,
       COUNT(*) AS customer_count
FROM customers
GROUP BY province
HAVING COUNT(*) > 1000;`,
    noteVi: "Nhớ nhanh: WHERE lọc dòng trước GROUP BY; HAVING lọc nhóm sau GROUP BY.",
    noteEn: "Remember: WHERE filters rows before GROUP BY; HAVING filters groups after GROUP BY."
  },
  {
    number: "07",
    keyword: "JOIN",
    vi: "Ghép dữ liệu giữa các bảng",
    en: "Combine related tables",
    purposeVi: "Nối customer với order qua khóa customer_id để biết ai đã mua hàng.",
    purposeEn: "Join customers to orders through customer_id to see who purchased.",
    code: `SELECT c.customer_id,
       c.customer_name,
       o.order_id,
       o.amount
FROM customers AS c
INNER JOIN orders AS o
  ON c.customer_id = o.customer_id;`,
    noteVi: "Kiểm tra cardinality trước khi JOIN. Quan hệ 1:N làm số dòng tăng; JOIN sai khóa có thể nhân đôi KPI.",
    noteEn: "Check cardinality before joining. A 1:N relationship increases rows, and a wrong key can multiply a KPI."
  },
  {
    number: "08",
    keyword: "CASE WHEN",
    vi: "Chuyển business rule thành logic",
    en: "Translate business rules into logic",
    purposeVi: "Phân hạng giao dịch thành VIP, PREMIUM và NORMAL.",
    purposeEn: "Classify transactions as VIP, PREMIUM, or NORMAL.",
    code: `SELECT customer_id,
       amount,
       CASE
         WHEN amount >= 10000000 THEN 'VIP'
         WHEN amount >=  5000000 THEN 'PREMIUM'
         ELSE 'NORMAL'
       END AS customer_segment
FROM transactions;`,
    noteVi: "Điều kiện được xét từ trên xuống. Đặt ngưỡng cao trước để không phân loại sai.",
    noteEn: "Conditions are evaluated top to bottom. Put the highest threshold first to avoid misclassification."
  },
  {
    number: "09",
    keyword: "DISTINCT",
    vi: "Kiểm tra giá trị duy nhất",
    en: "Inspect unique values",
    purposeVi: "Đếm số customer đã từng giao dịch và xem các loại transaction hiện có.",
    purposeEn: "Count customers who ever transacted and inspect available transaction types.",
    code: `SELECT COUNT(DISTINCT customer_id)
       AS transacting_customers
FROM transactions;

SELECT DISTINCT transaction_type
FROM transactions;`,
    noteVi: "DISTINCT có thể che dấu duplicate do JOIN sai. Hãy tìm nguyên nhân trước khi dùng DISTINCT để sửa kết quả.",
    noteEn: "DISTINCT can hide duplicates caused by a wrong join. Investigate the cause before using it as a fix."
  },
  {
    number: "10",
    keyword: "SUBQUERY",
    vi: "Truy vấn lồng",
    en: "Nest one query inside another",
    purposeVi: "Tìm giao dịch có giá trị cao hơn mức trung bình toàn bộ giao dịch.",
    purposeEn: "Find transactions above the overall average transaction value.",
    code: `SELECT transaction_id,
       customer_id,
       amount
FROM transactions
WHERE amount > (
  SELECT AVG(amount)
  FROM transactions
);`,
    noteVi: "Subquery phù hợp khi kết quả của một câu hỏi trở thành điều kiện cho câu hỏi khác.",
    noteEn: "A subquery is useful when the result of one question becomes a condition for another."
  },
  {
    number: "11",
    keyword: "CTE · WITH",
    vi: "Chia query phức tạp thành bước rõ ràng",
    en: "Break a complex query into readable steps",
    purposeVi: "Tách tập giao dịch thành công rồi tính tổng theo customer.",
    purposeEn: "Create a successful-transaction set, then aggregate it by customer.",
    code: `WITH successful_transactions AS (
  SELECT customer_id, amount
  FROM transactions
  WHERE status = 'SUCCESS'
)
SELECT customer_id,
       SUM(amount) AS total_amount
FROM successful_transactions
GROUP BY customer_id;`,
    noteVi: "CTE giúp BA/PO review logic theo từng bước và dễ trao đổi với Developer/Data Analyst hơn.",
    noteEn: "CTEs let BA/POs review logic step by step and discuss it more clearly with developers or analysts."
  },
  {
    number: "12",
    keyword: "WINDOW FUNCTIONS",
    vi: "Phân tích nâng cao mà không làm mất dòng",
    en: "Advanced analysis without collapsing rows",
    purposeVi: "Lấy giao dịch gần nhất của từng customer bằng ROW_NUMBER().",
    purposeEn: "Return each customer's latest transaction with ROW_NUMBER().",
    code: `SELECT *
FROM (
  SELECT t.*,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY transaction_date DESC
         ) AS rn
  FROM transactions AS t
) AS ranked_transactions
WHERE rn = 1;`,
    noteVi: "RANK() xếp hạng và có thể để trống thứ hạng khi đồng điểm; DENSE_RANK() không để trống; LAG() lấy giá trị dòng trước; LEAD() lấy dòng sau. PARTITION BY tạo cửa sổ riêng cho từng nhóm nhưng vẫn giữ từng dòng.",
    noteEn: "RANK() can leave rank gaps after ties; DENSE_RANK() does not; LAG() returns a prior row value; LEAD() returns a following value. PARTITION BY creates per-group windows while preserving rows."
  }
];

const sqlCourseBridges = [
  {
    id: "bigdata",
    code: "IST2510",
    vi: "SQL trước Pandas: giảm dữ liệu trước khi đưa vào Python",
    en: "SQL before Pandas: reduce data before Python",
    noteVi: "Dùng WHERE để lấy đúng phạm vi, GROUP BY để tổng hợp và JOIN để tạo dataset phân tích. Với dữ liệu lớn, đẩy phép lọc/tổng hợp về database giúp giảm RAM và thời gian truyền.",
    noteEn: "Use WHERE for scope, GROUP BY for aggregation, and JOIN to build an analysis dataset. With large data, pushing filters and aggregations to the database reduces RAM and transfer time.",
    tags: ["SELECT", "WHERE", "GROUP BY", "JOIN", "CTE"]
  },
  {
    id: "advanced",
    code: "IST4510",
    vi: "SQL cho phân tích nâng cao và cohort KPI",
    en: "SQL for advanced analytics and cohort KPIs",
    noteVi: "Aggregate functions, CASE WHEN, CTE và Window Functions giúp tạo cohort, xếp hạng, so sánh kỳ trước và lấy bản ghi mới nhất trước khi mô hình hóa.",
    noteEn: "Aggregates, CASE WHEN, CTEs, and window functions support cohorts, ranking, period comparisons, and latest-record selection before modeling.",
    tags: ["AVG", "CASE", "CTE", "LAG / LEAD", "PARTITION BY"]
  },
  {
    id: "decision",
    code: "IST3500",
    vi: "SQL để kiểm chứng quyết định và Product KPI",
    en: "SQL for decision validation and product KPIs",
    noteVi: "Chuyển requirement thành WHERE/CASE WHEN, kiểm tra numerator–denominator bằng COUNT/SUM/AVG và phân tích theo nhóm bằng GROUP BY.",
    noteEn: "Translate requirements into WHERE/CASE WHEN, validate KPI numerators and denominators with COUNT/SUM/AVG, and compare segments with GROUP BY.",
    tags: ["WHERE", "COUNT", "SUM", "AVG", "CASE WHEN", "DISTINCT"]
  },
  {
    id: "mining",
    code: "IST4520",
    vi: "SQL để tạo analytical dataset cho Data Mining",
    en: "SQL for a Data Mining analytical dataset",
    noteVi: "Chọn feature cần thiết, JOIN đúng grain, lọc thời gian và kiểm tra duplicate trước khi xuất CSV hoặc đưa dữ liệu vào Orange/Python.",
    noteEn: "Select required features, join at the correct grain, filter the time range, and check duplicates before exporting to CSV or using Orange/Python.",
    tags: ["SELECT", "JOIN", "WHERE", "DISTINCT", "QUALITY CHECK"]
  },
  {
    id: "planning",
    code: "IST4120",
    vi: "SQL trong data governance và chính sách hệ thống",
    en: "SQL in data governance and information-system policy",
    noteVi: "BA/PO chỉ nên dùng quyền read-only trên production, giới hạn PII, ghi rõ mục đích truy vấn và xác nhận retention/audit trước khi đưa dữ liệu ra ngoài hệ thống.",
    noteEn: "BA/POs should use read-only production access, minimize PII, document the query purpose, and confirm retention/audit rules before exporting data.",
    tags: ["READ ONLY", "PII", "AUDIT", "COUNT", "DISTINCT"]
  }
];

function sqlCommandCard(command) {
  return `
    <article class="sql-command-card">
      <div class="sql-command-head">
        <span class="sql-command-number">${command.number}</span>
        <div>
          <h4>${command.keyword}</h4>
          <p data-vi="${command.purposeVi}" data-en="${command.purposeEn}">${command.purposeVi}</p>
        </div>
      </div>
      <div class="sql-code-wrap">
        <button class="sql-copy" type="button" data-copy-sql data-vi="Sao chép" data-en="Copy">Sao chép</button>
        <pre><code>${command.code}</code></pre>
      </div>
      <p class="sql-command-note"><b data-vi="BA/PO cần nhớ:" data-en="BA/PO note:">BA/PO cần nhớ:</b> <span data-vi="${command.noteVi}" data-en="${command.noteEn}">${command.noteVi}</span></p>
    </article>`;
}

function sqlSectionTitle(number, titleVi, titleEn, noteVi, noteEn) {
  return `
    <div class="sql-ba-section-title">
      <div>
        <p class="eyebrow">${number}</p>
        <h3 data-vi="${titleVi}" data-en="${titleEn}">${titleVi}</h3>
      </div>
      <p data-vi="${noteVi}" data-en="${noteEn}">${noteVi}</p>
    </div>`;
}

function sqlBaNotebookTemplate() {
  return `
    <section class="sql-ba-notebook" id="sql-ba-notebook" aria-labelledby="sqlBaTitle">
      <header class="sql-ba-hero">
        <div class="sql-ba-hero-top">
          <div>
            <p class="eyebrow">IST2610 · SQL FOR BA/PO</p>
            <h2 id="sqlBaTitle" data-vi="SQL thực chiến để kiểm chứng requirement và KPI" data-en="Practical SQL for validating requirements and KPIs">SQL thực chiến để kiểm chứng requirement và KPI</h2>
            <p data-vi="BA/PO không cần trở thành Developer hay Data Engineer, nhưng cần đủ khả năng tự truy vấn để kiểm tra logic nghiệp vụ, chất lượng dữ liệu và câu hỏi mà business đặt ra." data-en="A BA/PO does not need to become a developer or data engineer, but should be able to query data independently to validate business logic, data quality, and business questions.">BA/PO không cần trở thành Developer hay Data Engineer, nhưng cần đủ khả năng tự truy vấn để kiểm tra logic nghiệp vụ, chất lượng dữ liệu và câu hỏi mà business đặt ra.</p>
          </div>
          <span class="sql-ba-badge">12 CORE SKILLS</span>
        </div>
        <div class="sql-ba-tags"><span>Requirement validation</span><span>Product KPI</span><span>Data quality</span><span>Analytics</span><span>Read-only mindset</span></div>
        <a class="sql-ba-source" href="https://digitalschool.vn/courses/khoa-hoc-business-analyst-thuc-chien/" target="_blank" rel="noreferrer"><span data-vi="Nguồn cập nhật tham khảo: Digital School" data-en="Reference updates: Digital School">Nguồn cập nhật tham khảo: Digital School</span> ↗</a>
      </header>

      <section class="sql-ba-section">
        ${sqlSectionTitle("ROADMAP", "Lộ trình học theo ba cấp độ", "Three-level learning path", "Đi từ truy vấn đọc đơn giản đến tư duy phân tích theo cửa sổ. Chỉ chuyển cấp khi bạn giải thích được output của câu lệnh trước.", "Move from simple read queries to window-based analysis. Advance only when you can explain the previous query's output.")}
        <div class="sql-learning-path">
          <article class="sql-learning-level"><span>01</span><h4 data-vi="Nền tảng" data-en="Foundation">Nền tảng</h4><p>SELECT · WHERE · ORDER BY · DISTINCT</p></article>
          <article class="sql-learning-level"><span>02</span><h4 data-vi="Phân tích KPI" data-en="KPI analysis">Phân tích KPI</h4><p>COUNT/SUM/AVG · GROUP BY · HAVING · JOIN · CASE</p></article>
          <article class="sql-learning-level"><span>03</span><h4 data-vi="Nâng cao" data-en="Advanced">Nâng cao</h4><p>Subquery · CTE · ROW_NUMBER · RANK · LAG · LEAD</p></article>
        </div>
      </section>

      <section class="sql-ba-section" id="sql-command-library">
        ${sqlSectionTitle("01–12", "Bộ câu lệnh SQL BA/PO nên biết", "SQL commands every BA/PO should know", "Mỗi thẻ trả lời ba câu hỏi: dùng khi nào, query viết ra sao và cần lưu ý gì khi kiểm chứng business rule.", "Each card answers when to use the command, how to write it, and what to watch when validating a business rule.")}
        <div class="sql-command-grid">${sqlBaCommands.map(sqlCommandCard).join("")}</div>
      </section>

      <section class="sql-ba-section">
        ${sqlSectionTitle("DBMS", "Cùng một yêu cầu, cú pháp Top 10 khác nhau", "Same Top-10 requirement, different DBMS syntax", "Luôn xác nhận hệ quản trị cơ sở dữ liệu trước khi copy query. Không mặc định mọi hệ thống đều dùng LIMIT.", "Confirm the database system before copying a query. Do not assume every system supports LIMIT.")}
        <div class="sql-dialect-table-wrap">
          <table class="sql-dialect-table">
            <thead><tr><th>DBMS</th><th data-vi="Cú pháp" data-en="Syntax">Cú pháp</th><th data-vi="Lưu ý" data-en="Note">Lưu ý</th></tr></thead>
            <tbody>
              <tr><td>MySQL</td><td><code>ORDER BY amount DESC LIMIT 10</code></td><td data-vi="LIMIT đặt cuối query." data-en="LIMIT goes at the end.">LIMIT đặt cuối query.</td></tr>
              <tr><td>PostgreSQL</td><td><code>ORDER BY amount DESC LIMIT 10</code></td><td data-vi="Có thể thêm OFFSET để phân trang." data-en="OFFSET can be added for pagination.">Có thể thêm OFFSET để phân trang.</td></tr>
              <tr><td>SQL Server</td><td><code>SELECT TOP 10 ... ORDER BY amount DESC</code></td><td data-vi="TOP nằm ngay sau SELECT." data-en="TOP follows SELECT.">TOP nằm ngay sau SELECT.</td></tr>
              <tr><td>Oracle</td><td><code>ORDER BY amount DESC FETCH FIRST 10 ROWS ONLY</code></td><td data-vi="Bản cũ có thể dùng ROWNUM." data-en="Older versions may use ROWNUM.">Bản cũ có thể dùng ROWNUM.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="sql-ba-section">
        ${sqlSectionTitle("JOIN", "Hiểu output của bốn loại JOIN", "Understand the output of four JOIN types", "Đừng chỉ nhớ hình tròn giao nhau. Hãy hỏi bảng nào là bảng chính, khóa nào dùng để nối và dòng không match có cần giữ lại không.", "Do not memorize only overlap diagrams. Ask which table is primary, which key joins them, and whether unmatched rows must remain.")}
        <div class="sql-join-grid">
          <article class="sql-join-card"><strong>INNER JOIN</strong><p data-vi="Chỉ giữ dòng match ở cả hai bảng. Phù hợp khi chỉ quan tâm customer đã có order." data-en="Keep rows matched in both tables. Use it when only customers with orders matter.">Chỉ giữ dòng match ở cả hai bảng. Phù hợp khi chỉ quan tâm customer đã có order.</p></article>
          <article class="sql-join-card"><strong>LEFT JOIN</strong><p data-vi="Giữ toàn bộ bảng trái, kể cả không match. Rất hữu ích để tìm customer chưa có order." data-en="Keep every left-table row, including unmatched ones. Useful for customers without orders.">Giữ toàn bộ bảng trái, kể cả không match. Rất hữu ích để tìm customer chưa có order.</p></article>
          <article class="sql-join-card"><strong>RIGHT JOIN</strong><p data-vi="Giữ toàn bộ bảng phải. Thường có thể viết lại thành LEFT JOIN bằng cách đổi thứ tự bảng." data-en="Keep every right-table row. It can often be rewritten as LEFT JOIN by swapping table order.">Giữ toàn bộ bảng phải. Thường có thể viết lại thành LEFT JOIN bằng cách đổi thứ tự bảng.</p></article>
          <article class="sql-join-card"><strong>FULL OUTER JOIN</strong><p data-vi="Giữ match và không match của cả hai bảng. MySQL phải mô phỏng bằng UNION của LEFT JOIN và RIGHT JOIN." data-en="Keep matched and unmatched rows from both tables. MySQL requires a UNION of LEFT and RIGHT JOIN.">Giữ match và không match của cả hai bảng. MySQL phải mô phỏng bằng UNION của LEFT JOIN và RIGHT JOIN.</p></article>
        </div>
      </section>

      <section class="sql-ba-section">
        ${sqlSectionTitle("QUALITY", "Bốn quality checks trước khi tin vào KPI", "Four quality checks before trusting a KPI", "Query chạy thành công không có nghĩa kết quả đúng. BA/PO cần kiểm tra NULL, duplicate, orphan key và grain.", "A successful query is not necessarily correct. Check NULLs, duplicates, orphan keys, and grain.")}
        <div class="sql-quality-grid">
          <article class="sql-quality-card"><strong data-vi="1. Thiếu dữ liệu / NULL" data-en="1. Missing data / NULL">1. Thiếu dữ liệu / NULL</strong><p data-vi="Đếm dòng thiếu customer_id trước khi tính customer KPI." data-en="Count missing customer_id values before calculating a customer KPI.">Đếm dòng thiếu customer_id trước khi tính customer KPI.</p><pre><code>SELECT COUNT(*) AS total_rows,
       SUM(CASE WHEN customer_id IS NULL
                THEN 1 ELSE 0 END) AS missing_id
FROM transactions;</code></pre></article>
          <article class="sql-quality-card"><strong data-vi="2. Khóa bị trùng" data-en="2. Duplicate keys">2. Khóa bị trùng</strong><p data-vi="Primary key kỳ vọng một dòng nhưng có nhiều hơn một occurrence." data-en="A primary key expected once appears more than once.">Primary key kỳ vọng một dòng nhưng có nhiều hơn một occurrence.</p><pre><code>SELECT transaction_id, COUNT(*) AS occurrences
FROM transactions
GROUP BY transaction_id
HAVING COUNT(*) &gt; 1;</code></pre></article>
          <article class="sql-quality-card"><strong data-vi="3. Foreign key không match" data-en="3. Unmatched foreign keys">3. Foreign key không match</strong><p data-vi="Tìm transaction không có customer tương ứng." data-en="Find transactions without a corresponding customer.">Tìm transaction không có customer tương ứng.</p><pre><code>SELECT t.*
FROM transactions AS t
LEFT JOIN customers AS c
  ON t.customer_id = c.customer_id
WHERE c.customer_id IS NULL;</code></pre></article>
          <article class="sql-quality-card"><strong data-vi="4. Grain không đúng kỳ vọng" data-en="4. Unexpected grain">4. Grain không đúng kỳ vọng</strong><p data-vi="Nếu grain là một customer mỗi ngày, nhóm hai cột này phải có COUNT = 1." data-en="If the grain is one customer per day, this pair should have COUNT = 1.">Nếu grain là một customer mỗi ngày, nhóm hai cột này phải có COUNT = 1.</p><pre><code>SELECT customer_id, transaction_date, COUNT(*)
FROM transactions
GROUP BY customer_id, transaction_date
HAVING COUNT(*) &gt; 1;</code></pre></article>
        </div>
      </section>

      <section class="sql-ba-section">
        ${sqlSectionTitle("FLOW", "Quy trình BA/PO từ câu hỏi đến quyết định", "BA/PO workflow from question to decision", "SQL chỉ là bước kiểm chứng ở giữa; đầu vào phải là câu hỏi business rõ ràng và đầu ra phải giải thích được giới hạn của dữ liệu.", "SQL is the validation step in the middle; begin with a clear business question and explain data limitations at the end.")}
        <div class="sql-business-flow">
          <article class="sql-flow-step"><span>01</span><strong data-vi="Business question" data-en="Business question">Business question</strong><p data-vi="KPI hoặc rule nào cần xác nhận?" data-en="Which KPI or rule needs validation?">KPI hoặc rule nào cần xác nhận?</p></article>
          <article class="sql-flow-step"><span>02</span><strong data-vi="Hiểu schema" data-en="Understand schema">Hiểu schema</strong><p data-vi="Bảng, PK/FK và grain là gì?" data-en="What are the tables, PK/FK, and grain?">Bảng, PK/FK và grain là gì?</p></article>
          <article class="sql-flow-step"><span>03</span><strong data-vi="Query read-only" data-en="Read-only query">Query read-only</strong><p data-vi="SELECT, filter, join và aggregate." data-en="SELECT, filter, join, and aggregate.">SELECT, filter, join và aggregate.</p></article>
          <article class="sql-flow-step"><span>04</span><strong data-vi="Quality check" data-en="Quality check">Quality check</strong><p data-vi="NULL, duplicate, outlier, join count." data-en="NULL, duplicates, outliers, join counts.">NULL, duplicate, outlier, join count.</p></article>
          <article class="sql-flow-step"><span>05</span><strong data-vi="Explain & decide" data-en="Explain & decide">Explain & decide</strong><p data-vi="Kết luận, giả định và giới hạn." data-en="Conclusion, assumptions, and limits.">Kết luận, giả định và giới hạn.</p></article>
        </div>
      </section>

      <section class="sql-ba-section">
        ${sqlSectionTitle("PRACTICE", "Bài luyện tập theo tình huống BA/PO", "Scenario-based BA/PO practice", "Tự viết trước, sau đó mở đáp án. Hãy giải thích output dự kiến bằng lời trước khi chạy query.", "Write your own query first, then reveal the answer. Explain the expected output before running it.")}
        <div class="sql-practice-grid">
          <details><summary data-vi="01 · Liệt kê customer ACTIVE theo tên A → Z" data-en="01 · List ACTIVE customers from A to Z">01 · Liệt kê customer ACTIVE theo tên A → Z</summary><pre><code>SELECT customer_id, customer_name
FROM customers
WHERE status = 'ACTIVE'
ORDER BY customer_name ASC;</code></pre></details>
          <details><summary data-vi="02 · Tính doanh thu SUCCESS theo ngày" data-en="02 · Calculate daily SUCCESS revenue">02 · Tính doanh thu SUCCESS theo ngày</summary><pre><code>SELECT transaction_date,
       SUM(amount) AS total_revenue
FROM transactions
WHERE status = 'SUCCESS'
GROUP BY transaction_date
ORDER BY transaction_date;</code></pre></details>
          <details><summary data-vi="03 · Tìm tỉnh có hơn 1.000 customer" data-en="03 · Find provinces with over 1,000 customers">03 · Tìm tỉnh có hơn 1.000 customer</summary><pre><code>SELECT province, COUNT(*) AS customer_count
FROM customers
GROUP BY province
HAVING COUNT(*) &gt; 1000;</code></pre></details>
          <details><summary data-vi="04 · Tìm customer chưa từng có order" data-en="04 · Find customers with no orders">04 · Tìm customer chưa từng có order</summary><pre><code>SELECT c.customer_id, c.customer_name
FROM customers AS c
LEFT JOIN orders AS o
  ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;</code></pre></details>
          <details><summary data-vi="05 · Lấy giao dịch mới nhất của mỗi customer" data-en="05 · Return each customer's latest transaction">05 · Lấy giao dịch mới nhất của mỗi customer</summary><pre><code>WITH ranked AS (
  SELECT t.*,
         ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY transaction_date DESC
         ) AS rn
  FROM transactions AS t
)
SELECT * FROM ranked WHERE rn = 1;</code></pre></details>
          <details><summary data-vi="06 · Phân nhóm customer theo tổng chi tiêu" data-en="06 · Segment customers by total spend">06 · Phân nhóm customer theo tổng chi tiêu</summary><pre><code>WITH spend AS (
  SELECT customer_id, SUM(amount) AS total_spend
  FROM transactions
  WHERE status = 'SUCCESS'
  GROUP BY customer_id
)
SELECT customer_id, total_spend,
       CASE
         WHEN total_spend &gt;= 10000000 THEN 'VIP'
         WHEN total_spend &gt;=  5000000 THEN 'PREMIUM'
         ELSE 'NORMAL'
       END AS segment
FROM spend;</code></pre></details>
        </div>
      </section>

      <section class="sql-ba-section">
        ${sqlSectionTitle("SAFE SQL", "Checklist an toàn trước khi chạy query", "Safety checklist before running a query", "BA/PO ưu tiên truy vấn đọc. Không thử lệnh thay đổi dữ liệu trên production nếu không có quy trình và quyền rõ ràng.", "BA/POs should prioritize read queries. Never test data-changing statements in production without an explicit process and permission.")}
        <ul class="sql-safety-list">
          <li data-vi="Dùng tài khoản read-only, replica hoặc sandbox khi có thể." data-en="Use a read-only account, replica, or sandbox whenever possible.">Dùng tài khoản read-only, replica hoặc sandbox khi có thể.</li>
          <li data-vi="Không chạy INSERT, UPDATE, DELETE, DROP hay TRUNCATE trên production." data-en="Do not run INSERT, UPDATE, DELETE, DROP, or TRUNCATE in production.">Không chạy INSERT, UPDATE, DELETE, DROP hay TRUNCATE trên production.</li>
          <li data-vi="Lấy mẫu nhỏ trước bằng LIMIT/TOP/FETCH FIRST." data-en="Start with a small sample using LIMIT/TOP/FETCH FIRST.">Lấy mẫu nhỏ trước bằng LIMIT/TOP/FETCH FIRST.</li>
          <li data-vi="Xác nhận timezone, đơn vị tiền tệ, trạng thái hợp lệ và khoảng thời gian." data-en="Confirm timezone, currency, valid statuses, and date range.">Xác nhận timezone, đơn vị tiền tệ, trạng thái hợp lệ và khoảng thời gian.</li>
          <li data-vi="So sánh COUNT trước và sau JOIN để phát hiện nhân dòng." data-en="Compare row counts before and after a JOIN to detect multiplication.">So sánh COUNT trước và sau JOIN để phát hiện nhân dòng.</li>
          <li data-vi="Giảm dữ liệu PII; không export dữ liệu cá nhân khi chưa được phép." data-en="Minimize PII and do not export personal data without permission.">Giảm dữ liệu PII; không export dữ liệu cá nhân khi chưa được phép.</li>
          <li data-vi="Ghi lại định nghĩa KPI, numerator, denominator và điều kiện loại trừ." data-en="Document the KPI definition, numerator, denominator, and exclusions.">Ghi lại định nghĩa KPI, numerator, denominator và điều kiện loại trừ.</li>
          <li data-vi="Nhờ Developer/Data Engineer review query phức tạp hoặc query chạy lâu." data-en="Ask a developer or data engineer to review complex or long-running queries.">Nhờ Developer/Data Engineer review query phức tạp hoặc query chạy lâu.</li>
        </ul>
      </section>
    </section>`;
}

function sqlCourseBridgeTemplate(bridge) {
  return `
    <section class="sql-course-bridge" data-sql-bridge="${bridge.id}">
      <span class="sql-bridge-icon" aria-hidden="true">SQL</span>
      <div>
        <p class="eyebrow">${bridge.code} · SQL CONNECTION</p>
        <h3 data-vi="${bridge.vi}" data-en="${bridge.en}">${bridge.vi}</h3>
        <p data-vi="${bridge.noteVi}" data-en="${bridge.noteEn}">${bridge.noteVi}</p>
        <div class="sql-bridge-tags">${bridge.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
      </div>
      <button class="sql-bridge-button" type="button" data-jump-sql><span data-vi="Mở sổ SQL" data-en="Open SQL notebook">Mở sổ SQL</span> →</button>
    </section>`;
}

const sqlDatabasePage = document.querySelector("#database");
if (sqlDatabasePage && !document.querySelector("#sql-ba-notebook")) {
  sqlDatabasePage.insertAdjacentHTML("beforeend", sqlBaNotebookTemplate());
}

sqlCourseBridges.forEach(bridge => {
  const page = document.querySelector(`#${bridge.id}`);
  if (!page || page.querySelector(`[data-sql-bridge="${bridge.id}"]`)) return;
  page.insertAdjacentHTML("beforeend", sqlCourseBridgeTemplate(bridge));
});

function copySqlText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  return Promise.resolve();
}

document.querySelectorAll("[data-copy-sql]").forEach(button => {
  button.addEventListener("click", async () => {
    const code = button.closest(".sql-code-wrap")?.querySelector("code")?.textContent || "";
    const language = document.documentElement.lang === "en" ? "en" : "vi";
    try {
      await copySqlText(code);
      button.textContent = language === "vi" ? "Đã sao chép" : "Copied";
    } catch (error) {
      button.textContent = language === "vi" ? "Không thể sao chép" : "Copy failed";
    }
    window.setTimeout(() => {
      button.textContent = document.documentElement.lang === "en" ? "Copy" : "Sao chép";
    }, 1400);
  });
});

document.querySelectorAll("[data-jump-sql]").forEach(button => {
  button.addEventListener("click", () => {
    openView("database");
    window.setTimeout(() => {
      document.querySelector("#sql-ba-notebook")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  });
});

setLanguage(state.language);
