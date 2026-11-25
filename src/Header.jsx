import "./Header.css";

function Header({ keyword, onKeywordChange, count, onAlertClick }) {
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <header className="topbar">
        <div className="header-inner topbar-row">
          <div className="brand">
            <h1 className="logo">중고시세</h1>
            <span className="divider" />
            <span className="tagline">중고 가격 비교</span>
          </div>
          <button className="header-alert-btn" onClick={onAlertClick}>
            가격 알림 설정
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="header-inner">
          <h2>중고 상품 가격 비교</h2>

          <form className="search-form" onSubmit={handleSubmit}>
            <div className="search-box">
              <svg
                 className="search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
  <circle cx="11" cy="11" r="7" />
  <line x1="20" y1="20" x2="16.5" y2="16.5" />
</svg>
              <input
                type="text"
                value={keyword}
                onChange={(e) => onKeywordChange(e.target.value)}
                placeholder="상품명을 검색하세요"
              />
            </div>
            <button type="submit" className="search-btn">검색</button>
          </form>

          <div className="result-info">
            <div>
              <p className="result-count">
                검색 결과 <strong>{count}개</strong>
              </p>
              <p className="result-desc">
                여러 플랫폼의 상품 가격을 한눈에 비교하세요.
              </p>
            </div>
            <button className="preview-link">예시 상품 미리보기</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Header;