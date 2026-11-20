import { useState } from "react";
import "./App.css";
import { products } from "./products";
import { formatPrice, getSummary } from "./summary";
import AlertForm from "./AlertForm";

function App() {
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedSite, setSelectedSite] = useState("전체");

  const sites = ["전체", ...new Set(products.map((p) => p.site))];

  const filtered = products.filter((p) => {
    const matchKeyword = p.title.toLowerCase().includes(keyword.toLowerCase());
    const matchSite = selectedSite === "전체" || p.site === selectedSite;
    return matchKeyword && matchSite;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "low") return a.price - b.price;
    if (sortOrder === "high") return b.price - a.price;
    return 0;
  });

  const summary = filtered.length > 0 ? getSummary(filtered) : null;

  return (
    <div className="page">
      <h1>중고 시세 비교</h1>

      <input
        className="search"
        type="text"
        placeholder="상품명을 검색하세요 (예: 아이폰)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <div className="filters">
        {sites.map((site) => (
          <button
            key={site}
            className={site === selectedSite ? "chip active" : "chip"}
            onClick={() => setSelectedSite(site)}
          >
            {site}
          </button>
        ))}
      </div>

      {summary ? (
        <section className="summary">
          <div className="stat">
            <span className="label">최저가</span>
            <strong>{formatPrice(summary.lowest)}</strong>
          </div>
          <div className="stat">
            <span className="label">최고가</span>
            <strong>{formatPrice(summary.highest)}</strong>
          </div>
          <div className="stat">
            <span className="label">평균</span>
            <strong>{formatPrice(summary.average)}</strong>
          </div>
          <div className="stat">
            <span className="label">중앙값</span>
            <strong>{formatPrice(summary.median)}</strong>
          </div>
        </section>
      ) : (
        <p>검색 결과가 없어요.</p>
      )}

      <p>검색 결과 {filtered.length}개</p>

      <select
        className="sort"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="default">기본순</option>
        <option value="low">가격 낮은순</option>
        <option value="high">가격 높은순</option>
      </select>

      <div className="grid">
        {sorted.map((p, i) => (
          <a className="card" key={i} href={p.url} target="_blank" rel="noreferrer">
            {p.image ? (
              <img src={p.image} alt={p.title} />
            ) : (
              <div className="noimg">이미지 준비 중</div>
            )}
            <div className="info">
              <span className="site">{p.site}</span>
              <h3 title={p.title}>{p.title}</h3>
              <p className="price">{formatPrice(p.price)}</p>
              <span>{p.date}</span>
            </div>
          </a>
        ))}
      </div>
      <AlertForm />
    </div>
  );
}

export default App;