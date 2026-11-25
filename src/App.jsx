import { useState } from "react";
import "./App.css"; // 화면 디자인 가져오기
import { products } from "./products"; //상품 데이터 가져오기
import { formatPrice, getSummary } from "./summary"; //가격을 보기좋은 형태로 변환
import AlertForm from "./AlertForm"; //가격알림 컴포넌트 가져오기
import Header from "./Header"; //헤더 컴포넌트 가져오기

function App() {
  const [isOpen, setIsOpen] = useState(false); // 알림 팝업 열림/닫힘
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

  return ( // JSX 코드 시작
    <>
      <Header
        keyword={keyword}
        onKeywordChange={setKeyword}
        count={filtered.length}
        onAlertClick={() => setIsOpen(true)}
      />

      <div className="page">
        <div className="toolbar">
          <div className="filters">
            {sites.map((site) => ( // 사이트 필터 버튼 생성
              <button
                key={site}
                className={site === selectedSite ? "chip active" : "chip"}
                onClick={() => setSelectedSite(site)}
              >
                {site}
              </button>
            ))}
          </div>

          <label className="sort-wrap">
            정렬
            <select
              className="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">기본순</option>
              <option value="low">가격 낮은순</option>
              <option value="high">가격 높은순</option>
            </select>
          </label>
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

        {isOpen && (
          <div className="modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>가격 알림 설정</h2>
              <AlertForm />
              <button className="modal-close" onClick={() => setIsOpen(false)}>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;