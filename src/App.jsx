import { useState, useEffect } from "react";
import "./App.css"; // 화면 디자인 가져오기
import { products } from "./products"; //상품 데이터 가져오기
import { formatPrice, getSummary, getGaugeRange } from "./summary"; //가격 변환 + 시세 계산
import AlertForm from "./AlertForm"; //가격알림 컴포넌트 가져오기
import Header from "./Header"; //헤더 컴포넌트 가져오기
import DetailSearch from "./DetailSearch"; //상세검색 칩 (포함/제외)
import PriceGauge from "./PriceGauge"; //시세 게이지
import DetailView from "./DetailView"; //상품 상세 화면 (카드 클릭 시)

// 띄어쓰기·대소문자 무시하고 비교하기 위한 함수 ("닌텐 도 스위 치2" -> "닌텐도스위치2")
const norm = (s) => s.toLowerCase().replace(/\s+/g, "");

function App() {
  const [isOpen, setIsOpen] = useState(false); // 알림 팝업 열림/닫힘
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedSite, setSelectedSite] = useState("전체");
  const [includeWords, setIncludeWords] = useState([]); // 포함 키워드
  const [excludeWords, setExcludeWords] = useState([]); // 제외 키워드
  const [focused, setFocused] = useState(null); // 게이지에 표시할 상품 (마우스 올림/클릭)
  const [selected, setSelected] = useState(null); // 상세 모달에 띄울 상품

  const sites = ["전체", ...new Set(products.map((p) => p.site))];

  const filtered = products.filter((p) => {
    const hasKeyword = keyword.trim() !== "";
    const matchKeyword = !hasKeyword || norm(p.title + p.category).includes(norm(keyword));
    const matchSite = selectedSite === "전체" || p.site === selectedSite;
    const title = norm(p.title);
    const matchInclude = includeWords.every((w) => title.includes(norm(w)));
    const matchExclude = excludeWords.every((w) => !title.includes(norm(w)));
    return matchKeyword && matchSite && matchInclude && matchExclude;
  });

  // 추천순(default)은 원래 순서 그대로
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "low") return a.price - b.price;
    if (sortOrder === "high") return b.price - a.price;
    return 0;
  });

  // 검색어가 있고 결과가 있을 때만 게이지 표시
  const hasKeyword = keyword.trim() !== "";
  const range = hasKeyword && filtered.length > 0 ? getGaugeRange(filtered) : null;
  const median = filtered.length > 0 ? getSummary(filtered).median : null;

  // 스크롤하면 화면 가운데에 걸친 카드의 가격 위치로 게이지 동그라미를 이동
  useEffect(() => {
    if (selected || !range) return; // 상세 화면이거나 게이지가 없으면 안 함

    const cards = document.querySelectorAll(".grid .card");
    const visible = new Set(); // 화면 가운데 띠에 걸쳐 있는 카드 번호들

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const i = Number(entry.target.dataset.index);
          if (entry.isIntersecting) visible.add(i);
          else visible.delete(i);
        });
        if (visible.size > 0) {
          setFocused(sorted[Math.min(...visible)]); // 같은 줄이면 가장 왼쪽 카드
        }
      },
      { rootMargin: "-45% 0px -45% 0px" } // 화면 세로 가운데 10%만 감지
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect(); // 목록이 바뀌면 정리
  }, [selected, keyword, sortOrder, selectedSite, includeWords, excludeWords]);

  function handleSearch(value) {
    setKeyword(value);
    setFocused(null);
  }

  function handleCardClick(p) {
    setFocused(p);
    setSelected(p);
  }

  return (
    <>
      <Header
        onSearch={handleSearch}
        count={filtered.length}
        onAlertClick={() => setIsOpen(true)}
      />

      <div className="page">
        <DetailSearch
          includeWords={includeWords}
          excludeWords={excludeWords}
          setIncludeWords={setIncludeWords}
          setExcludeWords={setExcludeWords}
        />

        {!selected && (
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
              <option value="default">추천순</option>
              <option value="low">가격 낮은순</option>
              <option value="high">가격 높은순</option>
            </select>
          </label>
        </div>
        )}

        {range ? (
          <PriceGauge range={range} focused={focused} />
        ) : (
          <p className="gauge-empty">
            {hasKeyword ? "검색 결과가 없어요." : "검색어를 입력하면 시세 게이지가 표시돼요."}
          </p>
        )}

        {!selected && (
        <div className="grid">
          {sorted.map((p, i) => (
            <div
              className="card"
              data-index={i}
              key={p.url}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(p)}
              onKeyDown={(e) => e.key === "Enter" && handleCardClick(p)}
            >
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
            </div>
          ))}
        </div>
        )}

        {selected && (
          <DetailView
            product={selected}
            list={sorted}
            median={median}
            onSelect={handleCardClick}
            onClose={() => setSelected(null)}
          />
        )}

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