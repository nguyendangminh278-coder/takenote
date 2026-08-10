const databaseSummaryForMerge = document.querySelector("#database .database-summary");

if (databaseSummaryForMerge && !databaseSummaryForMerge.querySelector(".bigdata-database-link")) {
  databaseSummaryForMerge.insertAdjacentHTML("beforeend", `
    <section class="panel bigdata-database-link">
      <div class="database-link-head">
        <span>PK · FK · JOIN</span>
        <div>
          <p class="eyebrow" data-vi="LIÊN HỆ VỚI PHÂN TÍCH DỮ LIỆU LỚN · BUỔI 02" data-en="LINK TO BIG DATA ANALYTICS · SESSION 02">LIÊN HỆ VỚI PHÂN TÍCH DỮ LIỆU LỚN · BUỔI 02</p>
          <h2 data-vi="Vì sao ratings có thể nối đúng với movies?" data-en="Why can ratings be joined correctly to movies?">Vì sao ratings có thể nối đúng với movies?</h2>
        </div>
      </div>
      <div class="database-link-grid">
        <article><b>Primary Key · PK</b><p data-vi="movies.movieId nhận diện duy nhất một phim. Một movieId không được lặp trong bảng movies." data-en="movies.movieId uniquely identifies one movie. A movieId must not repeat in the movies table."><code>movies.movieId</code> nhận diện duy nhất một phim. Một <code>movieId</code> không được lặp trong bảng <code>movies</code>.</p></article>
        <article><b>Foreign Key · FK</b><p data-vi="ratings.movieId tham chiếu đến movies.movieId. Nhiều dòng rating có thể cùng trỏ đến một phim." data-en="ratings.movieId references movies.movieId. Many rating rows can point to one movie."><code>ratings.movieId</code> tham chiếu đến <code>movies.movieId</code>. Nhiều dòng rating có thể cùng trỏ đến một phim.</p></article>
        <article><b>Relationship</b><p data-vi="ratings → movies là quan hệ nhiều-một (N:1). Sau groupby, movie_stats → movies là một-một (1:1)." data-en="ratings → movies is many-to-one (N:1). After groupby, movie_stats → movies is one-to-one (1:1)."><code>ratings → movies</code> là quan hệ nhiều-một (N:1). Sau <code>groupby</code>, <code>movie_stats → movies</code> là một-một (1:1).</p></article>
      </div>
      <div class="join-bridge">
        <div><small>pandas</small><code>left.merge(right, on="movieId", how="left")</code></div>
        <span>⇄</span>
        <div><small>SQL</small><code>LEFT JOIN movies USING (movieId)</code></div>
      </div>
      <div class="join-type-row">
        <span><b>INNER</b><small data-vi="chỉ khóa khớp" data-en="matching keys only">chỉ khóa khớp</small></span>
        <span><b>LEFT</b><small data-vi="giữ toàn bộ bảng trái" data-en="keep all left rows">giữ toàn bộ bảng trái</small></span>
        <span><b>RIGHT</b><small data-vi="giữ toàn bộ bảng phải" data-en="keep all right rows">giữ toàn bộ bảng phải</small></span>
        <span><b>FULL / OUTER</b><small data-vi="giữ khóa của cả hai" data-en="keep keys from both">giữ khóa của cả hai</small></span>
      </div>
      <p class="database-link-note" data-vi="Trong môn Cơ sở dữ liệu sẽ học sâu hơn về ràng buộc PK/FK, tính toàn vẹn tham chiếu, cardinality và cách JOIN ảnh hưởng đến số dòng kết quả." data-en="Database Management will go deeper into PK/FK constraints, referential integrity, cardinality and how JOIN operations affect result row counts.">Trong môn Cơ sở dữ liệu sẽ học sâu hơn về ràng buộc PK/FK, tính toàn vẹn tham chiếu, cardinality và cách <code>JOIN</code> ảnh hưởng đến số dòng kết quả.</p>
    </section>`);

  setLanguage(state.language);
}
