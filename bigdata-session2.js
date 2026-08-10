const bigDataCourse = document.querySelector("#bigdata");

if (bigDataCourse) {
  const sessionList = bigDataCourse.querySelector(".session-sidebar");
  const sessionContent = bigDataCourse.querySelector(".session-content");
  const sessionOneButton = sessionList.querySelector(".session-button");
  const sessionOneMarkup = sessionContent.innerHTML;
  const sessionCount = sessionList.querySelector(".session-sidebar-head span");
  const comingSoon = sessionList.querySelector(".session-coming-soon");

  sessionCount.textContent = "02";
  comingSoon.querySelector("span").textContent = "03–15";
  sessionOneButton.classList.remove("active");
  sessionOneButton.insertAdjacentHTML("afterend", `
    <button class="session-button active" type="button" data-bigdata-session="2">
      <span>02</span>
      <div><b data-vi="Buổi 02" data-en="Session 02">Buổi 02</b><small>10/08/2026</small></div>
    </button>`);
  sessionOneButton.dataset.bigdataSession = "1";

  const explainCommand = (command, vi, en) => `
    <article class="command-card">
      <code>${command}</code>
      <p data-vi="${vi}" data-en="${en}">${vi}</p>
    </article>`;

  const sessionTwoMarkup = () => `
    <div class="bigdata-notebook">
      <header class="notebook-hero">
        <div>
          <p class="eyebrow">IST2510 · SESSION 02 · 10/08/2026</p>
          <h2 data-vi="MovieLens 25M: từ file dữ liệu đến quyết định" data-en="MovieLens 25M: from data files to decisions">MovieLens 25M: từ file dữ liệu đến quyết định</h2>
          <p data-vi="Sổ notes dành cho người bắt đầu Python từ số 0. Mỗi lệnh đều trả lời ba câu hỏi: dùng để làm gì, nhận dữ liệu gì và tạo ra kết quả gì." data-en="A notebook for complete Python beginners. Every command answers three questions: what it does, what it receives and what it produces.">Sổ notes dành cho người bắt đầu Python từ số 0. Mỗi lệnh đều trả lời ba câu hỏi: dùng để làm gì, nhận dữ liệu gì và tạo ra kết quả gì.</p>
        </div>
        <span class="notebook-level">PYTHON · LEVEL 0</span>
      </header>

      <section class="beginner-contract">
        <span>0</span>
        <div>
          <h3 data-vi="Quy ước của sổ notes" data-en="How to read this notebook">Quy ước của sổ notes</h3>
          <ul>
            <li data-vi="Tên bên trái dấu = là một chiếc hộp lưu kết quả. Ví dụ ratings là hộp chứa bảng ratings.csv." data-en="A name on the left of = is a box that stores a result. For example, ratings stores the ratings.csv table.">Tên bên trái dấu <code>=</code> là một chiếc hộp lưu kết quả. Ví dụ <code>ratings</code> là hộp chứa bảng <code>ratings.csv</code>.</li>
            <li data-vi="Dấu chấm nghĩa là dùng một công cụ thuộc đối tượng đứng trước nó. ratings.head() dùng công cụ head của bảng ratings." data-en="A dot means using a tool that belongs to the object before it. ratings.head() uses the head tool of the ratings table.">Dấu chấm nghĩa là dùng một công cụ thuộc đối tượng đứng trước nó. <code>ratings.head()</code> dùng công cụ <code>head</code> của bảng <code>ratings</code>.</li>
            <li data-vi="Dấu ngoặc () là nơi truyền tùy chọn cho hàm. Nếu để trống, hàm dùng thiết lập mặc định." data-en="Parentheses () contain options passed to a function. Empty parentheses use the default settings.">Dấu ngoặc <code>()</code> là nơi truyền tùy chọn cho hàm. Nếu để trống, hàm dùng thiết lập mặc định.</li>
          </ul>
        </div>
      </section>

      <nav class="notebook-toc" aria-label="Mục lục Buổi 02">
        <a href="#bd2-flow">01 <span data-vi="Quy trình lớn" data-en="Big workflow">Quy trình lớn</span></a>
        <a href="#bd2-data">02 <span data-vi="Data & mục tiêu" data-en="Data & target">Data & mục tiêu</span></a>
        <a href="#bd2-read">03 <span data-vi="Đọc bằng pandas" data-en="Read with pandas">Đọc bằng pandas</span></a>
        <a href="#bd2-clean">04 <span data-vi="Quality check" data-en="Quality check">Quality check</span></a>
        <a href="#bd2-analysis">05 <span data-vi="Phân tích & merge" data-en="Analyze & merge">Phân tích & merge</span></a>
        <a href="#bd2-visual">06 <span data-vi="Biểu đồ" data-en="Charts">Biểu đồ</span></a>
        <a href="#bd2-large">07 <span data-vi="Dữ liệu lớn" data-en="Large data">Dữ liệu lớn</span></a>
      </nav>

      <section class="notebook-section" id="bd2-flow">
        <div class="notebook-section-head"><span>01</span><div><p class="eyebrow" data-vi="BỨC TRANH LỚN" data-en="THE BIG PICTURE">BỨC TRANH LỚN</p><h3 data-vi="Phân tích bắt đầu từ quyết định, không bắt đầu từ code" data-en="Analytics begins with a decision, not with code">Phân tích bắt đầu từ quyết định, không bắt đầu từ code</h3></div></div>
        <div class="analytics-flow">
          <article><span>01</span><b>Business Problem</b><small data-vi="Doanh nghiệp cần quyết định gì?" data-en="What decision must the business make?">Doanh nghiệp cần quyết định gì?</small></article>
          <i>→</i><article><span>02</span><b>Questions</b><small data-vi="Câu hỏi phân tích cụ thể" data-en="Specific analytical questions">Câu hỏi phân tích cụ thể</small></article>
          <i>→</i><article><span>03</span><b>Data</b><small data-vi="Cần file và cột nào?" data-en="Which files and columns are needed?">Cần file và cột nào?</small></article>
          <i>→</i><article><span>04</span><b>Analysis</b><small data-vi="Clean, tính toán, so sánh" data-en="Clean, calculate, compare">Clean, tính toán, so sánh</small></article>
          <i>→</i><article><span>05</span><b>Reporting</b><small data-vi="Trình bày logic, cơ bản, dễ hiểu" data-en="Explain clearly and logically">Trình bày logic, cơ bản, dễ hiểu</small></article>
          <i>→</i><article><span>06</span><b>Decision</b><small data-vi="Chọn hành động dựa trên bằng chứng" data-en="Choose an evidence-based action">Chọn hành động dựa trên bằng chứng</small></article>
        </div>
        <div class="business-example">
          <b data-vi="Ví dụ xuyên suốt" data-en="Running example">Ví dụ xuyên suốt</b>
          <p data-vi="Một nền tảng phim muốn chọn 10 phim nổi bật để đặt ở trang chủ. Ta phải định nghĩa rõ “nổi bật”: được đánh giá nhiều nhất, hay điểm trung bình cao nhất nhưng phải có tối thiểu 1.000 lượt đánh giá?" data-en="A movie platform wants ten titles for its homepage. We must define “top”: most rated, or highest average rating with at least 1,000 ratings?">Một nền tảng phim muốn chọn 10 phim nổi bật để đặt ở trang chủ. Ta phải định nghĩa rõ “nổi bật”: được đánh giá nhiều nhất, hay điểm trung bình cao nhất nhưng phải có tối thiểu 1.000 lượt đánh giá?</p>
        </div>
      </section>

      <section class="notebook-section" id="bd2-data">
        <div class="notebook-section-head"><span>02</span><div><p class="eyebrow">DATA & TARGET</p><h3 data-vi="Giữ bản gốc, hiểu README, rồi mới phân tích" data-en="Preserve raw data, understand the README, then analyze">Giữ bản gốc, hiểu README, rồi mới phân tích</h3></div></div>
        <div class="file-safety-grid">
          <article><span>RAW</span><b data-vi="File gốc — chỉ đọc" data-en="Raw files — read only">File gốc — chỉ đọc</b><p data-vi="Giữ nguyên file tải về để luôn có thể quay lại điểm bắt đầu." data-en="Keep downloaded files unchanged so you can always restart.">Giữ nguyên file tải về để luôn có thể quay lại điểm bắt đầu.</p></article>
          <article><span>BACKUP</span><b data-vi="Bản sao dự phòng" data-en="Backup copy">Bản sao dự phòng</b><p data-vi="Lưu riêng trước khi clean hoặc chuẩn hóa." data-en="Store separately before cleaning or standardizing.">Lưu riêng trước khi clean hoặc chuẩn hóa.</p></article>
          <article><span>WORK</span><b data-vi="Bản làm việc" data-en="Working copy">Bản làm việc</b><p data-vi="Code chỉ đọc và biến đổi bản này; ghi lại từng bước." data-en="Code reads and transforms this copy; every step is recorded.">Code chỉ đọc và biến đổi bản này; ghi lại từng bước.</p></article>
        </div>
        <div class="dataset-facts">
          <div><small>MovieLens 25M</small><strong>25,000,095</strong><span data-vi="lượt đánh giá" data-en="ratings">lượt đánh giá</span></div>
          <div><small>MOVIES</small><strong>62,423</strong><span data-vi="bộ phim" data-en="movies">bộ phim</span></div>
          <div><small>USERS</small><strong>162,541</strong><span data-vi="người dùng ẩn danh" data-en="anonymous users">người dùng ẩn danh</span></div>
        </div>
        <div class="dataset-links">
          <a href="https://grouplens.org/datasets/movielens/25m/" target="_blank" rel="noreferrer"><span data-vi="Tải MovieLens 25M" data-en="Download MovieLens 25M">Tải MovieLens 25M</span> ↗</a>
          <a href="https://files.grouplens.org/datasets/movielens/ml-25m-README.html" target="_blank" rel="noreferrer"><span data-vi="Đọc README trước" data-en="Read the README first">Đọc README trước</span> ↗</a>
        </div>
        <div class="file-map">
          <article><code>ratings.csv</code><p><b>userId</b> · <b>movieId</b> · <b>rating</b> · <b>timestamp</b></p><small data-vi="Mỗi dòng = một người đánh giá một phim. Rating từ 0,5 đến 5,0." data-en="Each row is one user rating one movie. Ratings range from 0.5 to 5.0.">Mỗi dòng = một người đánh giá một phim. Rating từ 0,5 đến 5,0.</small></article>
          <article><code>movies.csv</code><p><b>movieId</b> · <b>title</b> · <b>genres</b></p><small data-vi="Mỗi dòng = thông tin mô tả của một phim." data-en="Each row contains descriptive information for one movie.">Mỗi dòng = thông tin mô tả của một phim.</small></article>
        </div>
        <div class="target-card">
          <div><small data-vi="TARGET A · ĐỘ PHỔ BIẾN" data-en="TARGET A · POPULARITY">TARGET A · ĐỘ PHỔ BIẾN</small><b data-vi="Top 10 theo số lượt rating" data-en="Top 10 by number of ratings">Top 10 theo số lượt rating</b><p><code>num_ratings</code> <span data-vi="càng lớn → càng phổ biến" data-en="larger → more popular">càng lớn → càng phổ biến</span></p></div>
          <div><small data-vi="TARGET B · CHẤT LƯỢNG" data-en="TARGET B · QUALITY">TARGET B · CHẤT LƯỢNG</small><b data-vi="Top 10 theo điểm trung bình" data-en="Top 10 by average rating">Top 10 theo điểm trung bình</b><p><code>avg_rating</code> <span data-vi="cao và num_ratings ≥ 1.000" data-en="high with num_ratings ≥ 1,000">cao và <code>num_ratings ≥ 1.000</code></span></p></div>
        </div>
      </section>

      <section class="notebook-section" id="bd2-read">
        <div class="notebook-section-head"><span>03</span><div><p class="eyebrow">PYTHON + PANDAS</p><h3 data-vi="Đọc file và nhìn dữ liệu lần đầu" data-en="Read files and inspect the data">Đọc file và nhìn dữ liệu lần đầu</h3></div></div>
        <div class="plain-definition"><b>pandas</b><p data-vi="là thư viện Python chuyên làm việc với dữ liệu dạng bảng. Một bảng pandas gọi là DataFrame — gần giống một worksheet Excel nhưng có thể xử lý bằng lệnh và lặp lại chính xác." data-en="is a Python library for tabular data. A pandas table is called a DataFrame — similar to an Excel worksheet, but controlled by reproducible commands.">là thư viện Python chuyên làm việc với dữ liệu dạng bảng. Một bảng pandas gọi là <b>DataFrame</b> — gần giống một worksheet Excel nhưng có thể xử lý bằng lệnh và lặp lại chính xác.</p></div>
        <div class="code-lesson">
          <div class="code-header"><span>01 · LOAD DATA</span><small>Python</small></div>
          <pre><code>import pandas as pd

ratings = pd.read_csv("ratings.csv")
movies = pd.read_csv("movies.csv")

print(ratings.head())
print(movies.head())</code></pre>
        </div>
        <div class="command-grid">
          ${explainCommand("import pandas as pd", "Nạp thư viện pandas và đặt tên ngắn là pd. Các lệnh pandas sau đó bắt đầu bằng pd.", "Loads pandas and gives it the short name pd. Later pandas commands begin with pd.")}
          ${explainCommand('ratings = pd.read_csv("ratings.csv")', "Đọc file CSV thành DataFrame và lưu trong biến ratings. File phải nằm đúng thư mục chạy code hoặc cần ghi đủ đường dẫn.", "Reads the CSV into a DataFrame named ratings. The file must be in the working folder or use a full path.")}
          ${explainCommand("ratings.head()", "Xem 5 dòng đầu mặc định. Dùng head(10) để xem 10 dòng. Không làm thay đổi dữ liệu.", "Shows the first 5 rows by default. Use head(10) for 10 rows. It does not change the data.")}
          ${explainCommand("ratings.tail()", "Xem 5 dòng cuối để kiểm tra phần cuối file có đọc đầy đủ và hợp lý hay không.", "Shows the last 5 rows to check whether the end of the file was read correctly.")}
        </div>
        <div class="inspect-table">
          <article><code>ratings.shape</code><b data-vi="Kích thước bảng" data-en="Table dimensions">Kích thước bảng</b><p data-vi="Trả về (số dòng, số cột). Không có dấu ngoặc vì shape là thông tin sẵn có, không phải hàm." data-en="Returns (rows, columns). There are no parentheses because shape is stored information, not a function.">Trả về <code>(số dòng, số cột)</code>. Không có dấu ngoặc vì <code>shape</code> là thông tin sẵn có, không phải hàm.</p></article>
          <article><code>ratings.info()</code><b data-vi="Cấu trúc và chất lượng sơ bộ" data-en="Structure and initial quality">Cấu trúc và chất lượng sơ bộ</b><p data-vi="In tên cột, số giá trị không rỗng, kiểu dữ liệu và bộ nhớ. Dùng để phát hiện cột thiếu dữ liệu hoặc sai kiểu." data-en="Prints columns, non-null counts, data types and memory use. It helps spot missing values and wrong types.">In tên cột, số giá trị không rỗng, kiểu dữ liệu và bộ nhớ. Dùng để phát hiện cột thiếu dữ liệu hoặc sai kiểu.</p></article>
          <article><code>ratings.describe()</code><b data-vi="Thống kê cột số" data-en="Numeric summary">Thống kê cột số</b><p data-vi="Cho count, mean, std, min, 25%, 50%, 75%, max. Mục tiêu là hiểu phân bố rating và phát hiện giá trị bất thường." data-en="Returns count, mean, std, min, quartiles and max. Use it to understand rating distribution and detect unusual values.">Cho <code>count, mean, std, min, 25%, 50%, 75%, max</code>. Mục tiêu là hiểu phân bố rating và phát hiện giá trị bất thường.</p></article>
          <article><code>ratings.sample(5)</code><b data-vi="Xem 5 dòng ngẫu nhiên" data-en="Show 5 random rows">Xem 5 dòng ngẫu nhiên</b><p data-vi="Khác head vì không chỉ nhìn phần đầu file; hữu ích để quan sát dữ liệu đa dạng hơn." data-en="Unlike head, this does not only inspect the beginning; it gives a broader random view.">Khác <code>head</code> vì không chỉ nhìn phần đầu file; hữu ích để quan sát dữ liệu đa dạng hơn.</p></article>
        </div>
      </section>

      <section class="notebook-section" id="bd2-clean">
        <div class="notebook-section-head"><span>04</span><div><p class="eyebrow">QUALITY CHECK</p><h3 data-vi="Clean dữ liệu: cần kiểm tra những gì?" data-en="Data cleaning: what should be checked?">Clean dữ liệu: cần kiểm tra những gì?</h3></div></div>
        <div class="quality-checklist">
          <span data-vi="Thiếu dữ liệu" data-en="Missing values">Thiếu dữ liệu</span><span data-vi="Dòng trùng" data-en="Duplicate rows">Dòng trùng</span><span data-vi="Trùng khóa nghiệp vụ" data-en="Duplicate business keys">Trùng khóa nghiệp vụ</span><span data-vi="Sai kiểu dữ liệu" data-en="Wrong data types">Sai kiểu dữ liệu</span><span data-vi="Rating ngoài 0,5–5" data-en="Ratings outside 0.5–5">Rating ngoài 0,5–5</span><span data-vi="movieId không tồn tại" data-en="Unknown movieId">movieId không tồn tại</span>
        </div>
        <div class="code-lesson">
          <div class="code-header"><span>02 · QUALITY CHECK</span><small>Python</small></div>
          <pre><code># 1. Đếm ô trống theo từng cột
print(ratings.isna().sum())
print(movies.isna().sum())

# 2. Đếm dòng giống nhau hoàn toàn
print(ratings.duplicated().sum())

# 3. Kiểm tra cùng một user và movie có nhiều dòng không
print(ratings.duplicated(subset=["userId", "movieId"]).sum())

# 4. Tất cả rating có nằm trong khoảng hợp lệ không?
print(ratings["rating"].between(0.5, 5.0).all())

# 5. Có movieId nào trong ratings nhưng không có trong movies?
unknown_movies = (~ratings["movieId"].isin(movies["movieId"])).sum()
print(unknown_movies)</code></pre>
        </div>
        <div class="command-grid">
          ${explainCommand("ratings.isna().sum()", "isna() đánh dấu ô trống bằng True; sum() cộng số True theo từng cột. Kết quả là số ô thiếu của mỗi cột.", "isna() marks missing cells as True; sum() counts True values by column. The result is missing values per column.")}
          ${explainCommand("ratings.duplicated().sum()", "Đếm các dòng giống hoàn toàn với một dòng trước đó. Đây là duplicate kỹ thuật.", "Counts rows identical to an earlier row. This is a technical duplicate.")}
          ${explainCommand('duplicated(subset=["userId", "movieId"])', "Chỉ dùng hai cột làm khóa kiểm tra. Đây là duplicate nghiệp vụ: cùng người và cùng phim xuất hiện nhiều lần.", "Uses only two columns as the check key. This is a business duplicate: the same user and movie appear more than once.")}
          ${explainCommand('ratings["rating"].between(0.5, 5.0).all()', "between kiểm tra từng rating; all chỉ trả True khi tất cả đều hợp lệ.", "between checks every rating; all returns True only if every value is valid.")}
        </div>
        <div class="duplicate-note">
          <div><b data-vi="Nếu một người rate cùng phim nhiều lần thì sao?" data-en="What if one user rates the same movie more than once?">Nếu một người rate cùng phim nhiều lần thì sao?</b><p data-vi="Không xóa ngay. Trước tiên xác định quy tắc nghiệp vụ. Nếu timestamp thể hiện các lần cập nhật, có thể giữ lần mới nhất. README MovieLens cho biết file được sắp theo userId rồi movieId; vẫn nên chạy kiểm tra để xác nhận dữ liệu thực tế." data-en="Do not delete immediately. Define the business rule first. If timestamps represent updates, keep the latest row. The MovieLens README says rows are ordered by userId then movieId; still run the check on your actual files.">Không xóa ngay. Trước tiên xác định quy tắc nghiệp vụ. Nếu <code>timestamp</code> thể hiện các lần cập nhật, có thể giữ lần mới nhất. README MovieLens cho biết file được sắp theo <code>userId</code> rồi <code>movieId</code>; vẫn nên chạy kiểm tra để xác nhận dữ liệu thực tế.</p></div>
          <pre><code>ratings = (
    ratings
    .sort_values("timestamp")
    .drop_duplicates(["userId", "movieId"], keep="last")
)</code></pre>
        </div>
      </section>

      <section class="notebook-section" id="bd2-analysis">
        <div class="notebook-section-head"><span>05</span><div><p class="eyebrow">ANALYSIS + MERGE</p><h3 data-vi="Đếm rating, tính mean đúng cột, rồi nối tên phim" data-en="Count ratings, calculate the correct mean, then add movie titles">Đếm rating, tính mean đúng cột, rồi nối tên phim</h3></div></div>
        <div class="mean-warning"><b>mean()</b><p data-vi="Luôn chỉ rõ cột cần tính: ratings.groupby('movieId')['rating'].mean(). Nếu không chọn ['rating'], pandas có thể cố tính trung bình cả userId, movieId hoặc timestamp — những con số đó không trả lời câu hỏi của ta." data-en="Always specify the target column: ratings.groupby('movieId')['rating'].mean(). Without ['rating'], pandas may average userId, movieId or timestamp — values that do not answer our question.">Luôn chỉ rõ cột cần tính: <code>ratings.groupby("movieId")["rating"].mean()</code>. Nếu không chọn <code>["rating"]</code>, pandas có thể cố tính trung bình cả <code>userId</code>, <code>movieId</code> hoặc <code>timestamp</code> — những con số đó không trả lời câu hỏi của ta.</p></div>
        <div class="code-lesson">
          <div class="code-header"><span>03 · AGGREGATE + MERGE</span><small>Python</small></div>
          <pre><code>movie_stats = (
    ratings
    .groupby("movieId")["rating"]
    .agg(num_ratings="size", avg_rating="mean")
    .reset_index()
)

popular_movies = movie_stats.merge(
    movies,
    on="movieId",
    how="left",
    validate="one_to_one"
)

most_rated = popular_movies.sort_values(
    "num_ratings",
    ascending=False
).head(10)

best_rated = (
    popular_movies[popular_movies["num_ratings"] &gt;= 1000]
    .sort_values(["avg_rating", "num_ratings"], ascending=[False, False])
    .head(10)
)</code></pre>
        </div>
        <div class="command-grid">
          ${explainCommand('groupby("movieId")', "Gom tất cả dòng có cùng movieId vào một nhóm — tức gom mọi rating của cùng một phim.", "Groups all rows sharing the same movieId — all ratings for one movie.")}
          ${explainCommand('agg(num_ratings="size", avg_rating="mean")', "Trong mỗi nhóm: size đếm số dòng; mean tính trung bình đúng cột rating. Hai kết quả được đặt tên rõ ràng.", "Within each group: size counts rows; mean averages the rating column. Both outputs receive clear names.")}
          ${explainCommand("reset_index()", "Đưa movieId từ vị trí index trở lại thành cột bình thường để dễ merge và xuất báo cáo.", "Moves movieId from the index back into a normal column for merging and reporting.")}
          ${explainCommand('ascending=False', "Sắp xếp giảm dần: số lớn đứng trước số nhỏ. ascending=True mới là tăng dần.", "Sorts descending: larger values first. ascending=True means ascending order.")}
        </div>
        <div class="merge-explainer">
          <div class="merge-visual"><span>ratings</span><i>movieId · FK</i><b>∞</b><em>→</em><b>1</b><i>movieId · PK</i><span>movies</span></div>
          <div><h4 data-vi="Merge = nối hai bảng qua cột chung" data-en="Merge = join two tables through a shared column">Merge = nối hai bảng qua cột chung</h4><p data-vi="movieId là khóa chính (PK) trong movies và khóa ngoại (FK) trong ratings. Nối trực tiếp ratings → movies là many_to_one; sau khi groupby, movie_stats còn một dòng mỗi phim nên nối movie_stats → movies là one_to_one." data-en="movieId is the primary key in movies and a foreign key in ratings. Joining ratings to movies is many_to_one; after grouping, movie_stats has one row per movie, so movie_stats to movies is one_to_one.">movieId là khóa chính (PK) trong <code>movies</code> và khóa ngoại (FK) trong <code>ratings</code>. Nối trực tiếp <code>ratings → movies</code> là <code>many_to_one</code>; sau khi <code>groupby</code>, <code>movie_stats</code> còn một dòng mỗi phim nên nối <code>movie_stats → movies</code> là <code>one_to_one</code>.</p></div>
        </div>
        <div class="merge-types">
          <article><b>inner</b><p data-vi="Chỉ giữ khóa có ở cả hai bảng." data-en="Keep keys found in both tables.">Chỉ giữ khóa có ở cả hai bảng.</p></article>
          <article><b>left</b><p data-vi="Giữ toàn bộ bảng bên trái; thiếu bên phải sẽ thành NaN." data-en="Keep every left-table row; missing right values become NaN.">Giữ toàn bộ bảng bên trái; thiếu bên phải sẽ thành <code>NaN</code>.</p></article>
          <article><b>right</b><p data-vi="Giữ toàn bộ bảng bên phải." data-en="Keep every right-table row.">Giữ toàn bộ bảng bên phải.</p></article>
          <article><b>outer</b><p data-vi="Giữ mọi khóa từ cả hai bảng." data-en="Keep every key from both tables.">Giữ mọi khóa từ cả hai bảng.</p></article>
        </div>
        <details class="all-in-one" open>
          <summary data-vi="Toàn bộ quy trình trong một đoạn code" data-en="The complete workflow in one code block">Toàn bộ quy trình trong một đoạn code</summary>
          <pre><code>import pandas as pd

# Bước 1 — Đọc dữ liệu
ratings = pd.read_csv("ratings.csv")
movies = pd.read_csv("movies.csv")

# Bước 2 — Kiểm tra và giữ rating mới nhất nếu trùng user-phim
ratings = (
    ratings
    .dropna(subset=["userId", "movieId", "rating"])
    .sort_values("timestamp")
    .drop_duplicates(["userId", "movieId"], keep="last")
)

# Bước 3 — Tính số lượt và điểm trung bình của từng phim
movie_stats = (
    ratings.groupby("movieId")["rating"]
    .agg(num_ratings="size", avg_rating="mean")
    .reset_index()
)

# Bước 4 — Nối tên phim, lọc tối thiểu 1.000 lượt và lấy Top 10
top_10 = (
    movie_stats
    .merge(movies, on="movieId", how="left", validate="one_to_one")
    .query("num_ratings &gt;= 1000")
    .sort_values(["avg_rating", "num_ratings"], ascending=[False, False])
    .head(10)
)

print(top_10[["title", "genres", "num_ratings", "avg_rating"]])</code></pre>
        </details>
      </section>

      <section class="notebook-section" id="bd2-visual">
        <div class="notebook-section-head"><span>06</span><div><p class="eyebrow">VISUALIZATION</p><h3 data-vi="Chọn biểu đồ theo câu hỏi, không chọn theo sở thích" data-en="Choose charts for the question, not personal taste">Chọn biểu đồ theo câu hỏi, không chọn theo sở thích</h3></div></div>
        <div class="chart-guide">
          <article><span>BAR</span><b data-vi="So sánh Top 10" data-en="Compare a Top 10">So sánh Top 10</b><p data-vi="Dùng bar ngang khi tên phim dài. Sắp xếp trước khi vẽ." data-en="Use horizontal bars for long movie titles. Sort before plotting.">Dùng bar ngang khi tên phim dài. Sắp xếp trước khi vẽ.</p></article>
          <article><span>HIST</span><b data-vi="Phân bố rating" data-en="Rating distribution">Phân bố rating</b><p data-vi="Cho biết rating tập trung ở mức nào và có lệch không." data-en="Shows where ratings concentrate and whether the distribution is skewed.">Cho biết rating tập trung ở mức nào và có lệch không.</p></article>
          <article><span>LINE</span><b data-vi="Xu hướng theo thời gian" data-en="Trend over time">Xu hướng theo thời gian</b><p data-vi="Dùng khi trục X là ngày/tháng/năm có thứ tự." data-en="Use when the X axis is an ordered date or time period.">Dùng khi trục X là ngày/tháng/năm có thứ tự.</p></article>
          <article><span>SCATTER</span><b data-vi="Quan hệ hai biến số" data-en="Relationship between two numbers">Quan hệ hai biến số</b><p data-vi="Ví dụ num_ratings so với avg_rating để thấy phim phổ biến và phim được đánh giá cao." data-en="For example, num_ratings versus avg_rating to compare popularity and quality.">Ví dụ <code>num_ratings</code> so với <code>avg_rating</code> để thấy phim phổ biến và phim được đánh giá cao.</p></article>
        </div>
        <div class="palette-card">
          <div><p class="eyebrow" data-vi="BỘ MÀU RIÊNG · MOVIELENS PASTEL" data-en="CUSTOM PALETTE · MOVIELENS PASTEL">BỘ MÀU RIÊNG · MOVIELENS PASTEL</p><h4 data-vi="Một màu chính, các màu còn lại tạo ngữ cảnh" data-en="One primary color, supporting colors provide context">Một màu chính, các màu còn lại tạo ngữ cảnh</h4></div>
          <div class="palette-swatches"><span style="--swatch:#7AA7E8"><b>#7AA7E8</b><small data-vi="Chính · dữ liệu" data-en="Primary · data">Chính · dữ liệu</small></span><span style="--swatch:#8FD3B6"><b>#8FD3B6</b><small data-vi="Tốt · đạt chuẩn" data-en="Good · qualified">Tốt · đạt chuẩn</small></span><span style="--swatch:#F4A896"><b>#F4A896</b><small data-vi="Cảnh báo" data-en="Warning">Cảnh báo</small></span><span style="--swatch:#B8A7D9"><b>#B8A7D9</b><small data-vi="Nhóm phụ" data-en="Secondary group">Nhóm phụ</small></span><span style="--swatch:#F1CD73"><b>#F1CD73</b><small data-vi="Điểm nhấn" data-en="Highlight">Điểm nhấn</small></span><span style="--swatch:#667085"><b>#667085</b><small data-vi="Chữ / trục" data-en="Text / axes">Chữ / trục</small></span></div>
        </div>
        <div class="code-lesson">
          <div class="code-header"><span>04 · TOP 10 BAR CHART</span><small>Python</small></div>
          <pre><code>import matplotlib.pyplot as plt

chart_data = most_rated.sort_values("num_ratings", ascending=True)

plt.figure(figsize=(10, 6))
plt.barh(chart_data["title"], chart_data["num_ratings"], color="#7AA7E8")
plt.title("Top 10 phim có nhiều lượt đánh giá nhất")
plt.xlabel("Số lượt đánh giá")
plt.ylabel("Tên phim")
plt.tight_layout()
plt.show()</code></pre>
        </div>
        <p class="chart-color-note" data-vi="Vì sao dùng xanh pastel? Màu xanh trung tính, dễ đọc trên nền trắng và không ngụ ý tốt/xấu. Chỉ dùng màu mint để nhấn phim đạt điều kiện ≥ 1.000 rating; dùng coral cho cảnh báo hoặc dữ liệu lỗi, không dùng tùy tiện." data-en="Why pastel blue? It is neutral, readable on white and does not imply good or bad. Reserve mint for movies meeting the ≥1,000 threshold and coral for warnings or data errors.">Vì sao dùng xanh pastel? Màu xanh trung tính, dễ đọc trên nền trắng và không ngụ ý tốt/xấu. Chỉ dùng màu mint để nhấn phim đạt điều kiện ≥ 1.000 rating; dùng coral cho cảnh báo hoặc dữ liệu lỗi, không dùng tùy tiện.</p>
      </section>

      <section class="notebook-section" id="bd2-large">
        <div class="notebook-section-head"><span>07</span><div><p class="eyebrow">LARGE DATA · CHUNKS</p><h3 data-vi="Khi file lớn hơn RAM: đọc từng phần" data-en="When a file exceeds RAM: read it in chunks">Khi file lớn hơn RAM: đọc từng phần</h3></div></div>
        <div class="chunk-definition">
          <div><strong>chunksize = 100_000</strong><span data-vi="Mỗi lần pandas đưa 100.000 dòng vào một DataFrame nhỏ." data-en="pandas loads 100,000 rows into a small DataFrame at a time.">Mỗi lần pandas đưa 100.000 dòng vào một DataFrame nhỏ.</span></div>
          <p data-vi="Điều này giảm RAM nhưng vẫn chạy tuần tự trên một máy. chunksize không tự động chia việc cho nhiều máy." data-en="This reduces memory use but still runs sequentially on one machine. chunksize does not automatically distribute work across machines.">Điều này giảm RAM nhưng vẫn chạy tuần tự trên <b>một máy</b>. <code>chunksize</code> không tự động chia việc cho nhiều máy.</p>
        </div>
        <div class="code-lesson">
          <div class="code-header"><span>05 · COUNT ALL ROWS</span><small>Python</small></div>
          <pre><code>import pandas as pd

total_ratings = 0

for chunk in pd.read_csv("ratings.csv", chunksize=100_000):
    total_ratings += len(chunk)

print(total_ratings)</code></pre>
        </div>
        <div class="line-by-line">
          <article><code>total_ratings = 0</code><p data-vi="Tạo bộ đếm bắt đầu từ 0." data-en="Creates a counter starting at zero.">Tạo bộ đếm bắt đầu từ 0.</p></article>
          <article><code>for chunk in ...</code><p data-vi="Lặp qua từng DataFrame 100.000 dòng cho đến hết file." data-en="Loops through each 100,000-row DataFrame until the file ends.">Lặp qua từng DataFrame 100.000 dòng cho đến hết file.</p></article>
          <article><code>len(chunk)</code><p data-vi="Đếm số dòng thực tế trong chunk; chunk cuối có thể ít hơn 100.000." data-en="Counts actual rows in the chunk; the last chunk may be smaller than 100,000.">Đếm số dòng thực tế trong chunk; chunk cuối có thể ít hơn 100.000.</p></article>
          <article><code>+=</code><p data-vi="Lấy giá trị cũ cộng thêm giá trị mới rồi lưu lại." data-en="Adds a new value to the stored total.">Lấy giá trị cũ cộng thêm giá trị mới rồi lưu lại.</p></article>
        </div>
        <div class="weighted-warning"><b data-vi="Không lấy trung bình của các trung bình chunk" data-en="Do not average chunk averages">Không lấy trung bình của các trung bình chunk</b><p data-vi="Mỗi chunk hoặc mỗi phim có số rating khác nhau. Trọng số (weight) chính là số rating. Trung bình đúng = tổng điểm / tổng số rating." data-en="Chunks and movies may contain different rating counts. The weight is the number of ratings. Correct average = total rating sum / total rating count.">Mỗi chunk hoặc mỗi phim có số rating khác nhau. <b>Trọng số (weight)</b> chính là số rating. Trung bình đúng = <b>tổng điểm / tổng số rating</b>.</p></div>
        <div class="code-lesson">
          <div class="code-header"><span>06 · WEIGHTED AGGREGATION BY MOVIE</span><small>Python</small></div>
          <pre><code>import pandas as pd

rating_count = pd.Series(dtype="int64")
rating_sum = pd.Series(dtype="float64")

for chunk in pd.read_csv(
    "ratings.csv",
    usecols=["movieId", "rating"],
    chunksize=100_000
):
    chunk_stats = chunk.groupby("movieId")["rating"].agg(["count", "sum"])

    rating_count = rating_count.add(chunk_stats["count"], fill_value=0)
    rating_sum = rating_sum.add(chunk_stats["sum"], fill_value=0)

movie_stats = pd.DataFrame({
    "num_ratings": rating_count,
    "rating_sum": rating_sum
})

movie_stats["avg_rating"] = (
    movie_stats["rating_sum"] / movie_stats["num_ratings"]
)

movie_stats = movie_stats.reset_index()</code></pre>
        </div>
        <div class="command-grid">
          ${explainCommand('usecols=["movieId", "rating"]', "Chỉ đọc hai cột cần dùng, giúp giảm RAM và tăng tốc.", "Reads only the two required columns, reducing memory and improving speed.")}
          ${explainCommand('agg(["count", "sum"])', "Trong từng chunk và từng phim: đếm số rating và cộng tổng điểm. Hai đại lượng này có thể cộng chính xác giữa các chunk.", "Within each chunk and movie: count ratings and sum scores. These quantities combine correctly across chunks.")}
          ${explainCommand("Series.add(..., fill_value=0)", "Cộng theo movieId. Nếu phim chưa xuất hiện ở chunk trước, xem giá trị cũ là 0.", "Adds values by movieId. If a movie did not appear in earlier chunks, its previous value is treated as zero.")}
          ${explainCommand('rating_sum / num_ratings', "Tính weighted average cuối cùng. Phim có nhiều rating tự động có trọng số lớn hơn trong tổng của chính phim đó.", "Calculates the final weighted average. Rating counts provide the correct weight.")}
        </div>
        <div class="distributed-card">
          <div><span>ADVANCED</span><h4 data-vi="Nhiều máy tính xử lý như thế nào?" data-en="How does multi-machine processing work?">Nhiều máy tính xử lý như thế nào?</h4></div>
          <div class="distributed-flow"><span data-vi="Chia file thành partitions" data-en="Split into partitions">Chia file thành partitions</span><i>→</i><span data-vi="Mỗi worker tính count + sum" data-en="Each worker computes count + sum">Mỗi worker tính count + sum</span><i>→</i><span data-vi="Máy điều phối cộng kết quả" data-en="Coordinator combines results">Máy điều phối cộng kết quả</span><i>→</i><span data-vi="Tính avg = sum / count" data-en="Calculate avg = sum / count">Tính avg = sum / count</span></div>
          <p data-vi="Pandas phù hợp một máy. Khi dữ liệu lớn hơn khả năng một máy hoặc cần chạy song song, có thể dùng Dask DataFrame hoặc Apache Spark. Ý tưởng vẫn giống đoạn code chunks: xử lý từng partition rồi reduce bằng cách cộng count và sum." data-en="pandas is designed for one machine. When data exceeds one machine or parallel execution is needed, use Dask DataFrame or Apache Spark. The idea remains similar: process each partition, then reduce by combining count and sum.">Pandas phù hợp <b>một máy</b>. Khi dữ liệu lớn hơn khả năng một máy hoặc cần chạy song song, có thể dùng <b>Dask DataFrame</b> hoặc <b>Apache Spark</b>. Ý tưởng vẫn giống đoạn code chunks: xử lý từng partition rồi <i>reduce</i> bằng cách cộng <code>count</code> và <code>sum</code>.</p>
        </div>
      </section>

      <section class="session-finish">
        <div><p class="eyebrow" data-vi="SAU BUỔI 02" data-en="AFTER SESSION 02">SAU BUỔI 02</p><h3 data-vi="Checklist trước buổi thực hành Big Data" data-en="Checklist before the Big Data practice">Checklist trước buổi thực hành Big Data</h3></div>
        <div class="task-list" data-task-group="bigdata-session2">
          <label><input type="checkbox" data-task="bd2-readme" /><span><b data-vi="Đã đọc README MovieLens 25M" data-en="Read the MovieLens 25M README">Đã đọc README MovieLens 25M</b><small>ratings.csv · movies.csv</small></span></label>
          <label><input type="checkbox" data-task="bd2-load" /><span><b data-vi="Đọc được hai file bằng pandas" data-en="Loaded both files with pandas">Đọc được hai file bằng pandas</b><small>read_csv · head · shape · info</small></span></label>
          <label><input type="checkbox" data-task="bd2-quality" /><span><b data-vi="Chạy đủ quality check" data-en="Completed quality checks">Chạy đủ quality check</b><small>isna · duplicated · range · FK</small></span></label>
          <label><input type="checkbox" data-task="bd2-top10" /><span><b data-vi="Tạo được hai danh sách Top 10" data-en="Created both Top 10 lists">Tạo được hai danh sách Top 10</b><small>most rated · best rated ≥ 1,000</small></span></label>
          <label><input type="checkbox" data-task="bd2-chart" /><span><b data-vi="Vẽ được bar chart" data-en="Created the bar chart">Vẽ được bar chart</b><small>MovieLens Pastel palette</small></span></label>
          <label><input type="checkbox" data-task="bd2-chunks" /><span><b data-vi="Hiểu chunks và weighted average" data-en="Understand chunks and weighted average">Hiểu chunks và weighted average</b><small>count + sum → mean</small></span></label>
        </div>
      </section>
    </div>`;

  function showBigDataSession(number) {
    sessionList.querySelectorAll("[data-bigdata-session]").forEach(button => {
      button.classList.toggle("active", button.dataset.bigdataSession === String(number));
    });
    sessionContent.innerHTML = number === 2 ? sessionTwoMarkup() : sessionOneMarkup;
    setLanguage(state.language);
    if (number === 2) {
      sessionContent.querySelectorAll("[data-task]").forEach(input => {
        input.checked = Boolean(state.tasks[input.dataset.task]);
        input.addEventListener("change", () => {
          state.tasks[input.dataset.task] = input.checked;
          localStorage.setItem("han-study-tasks", JSON.stringify(state.tasks));
          updateProgress();
        });
      });
      updateProgress();
    }
  }

  sessionList.querySelectorAll("[data-bigdata-session]").forEach(button => {
    button.addEventListener("click", () => showBigDataSession(Number(button.dataset.bigdataSession)));
  });

  showBigDataSession(2);
}
