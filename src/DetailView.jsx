import { useEffect, useRef } from "react";
import { formatPrice } from "./summary";

// 카드를 누르면 목록 대신 나오는 상세 화면 (왼쪽: 다른 상품 / 가운데: 큰 사진 / 오른쪽: 정보)
function DetailView({ product, list, median, onSelect, onClose }) {
  const topRef = useRef(null);

  // 열릴 때 상세 화면이 보이는 위치로 부드럽게 스크롤
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const diff = median ? Math.round(((product.price - median) / median) * 100) : null;
  let diffText = "";
  if (diff !== null) {
    if (diff < 0) diffText = `중앙값보다 ${Math.abs(diff)}% 저렴해요`;
    else if (diff > 0) diffText = `중앙값보다 ${diff}% 비싸요`;
    else diffText = "중앙값과 같아요";
  }

  return (
    <div className="dv" ref={topRef}>
      {/* 왼쪽: 다른 상품 목록 */}
      <aside className="dv-list">
        {list.map((p) => (
          <button
            key={p.url}
            className={p.url === product.url ? "dv-item active" : "dv-item"}
            onClick={() => onSelect(p)}
          >
            {p.image ? (
              <img src={p.image} alt="" loading="lazy" />
            ) : (
              <div className="dv-noimg">이미지 없음</div>
            )}
            <span className="dv-item-title">{p.title}</span>
          </button>
        ))}
      </aside>

      {/* 가운데: 사진 확대 (key가 바뀌면 애니메이션 다시 재생) */}
      <section className="dv-photo" key={"photo-" + product.url}>
        {product.image ? (
          <img src={product.image} alt={product.title} />
        ) : (
          <div className="noimg">이미지 준비 중</div>
        )}
      </section>

      {/* 오른쪽: 상세 정보 */}
      <section className="dv-info" key={"info-" + product.url}>
        <span className="site">{product.site}</span>
        <h3 className="detail-title">{product.title}</h3>
        <p className="detail-price">{formatPrice(product.price)}</p>
        {diffText && <p className="detail-diff">{diffText}</p>}
        <p className="detail-meta">
          {[product.region, product.date, product.status].filter(Boolean).join(" · ")}
        </p>

        <a className="go-site" href={product.url} target="_blank" rel="noreferrer">
          사이트로 이동
        </a>
        <button className="dv-back" onClick={onClose}>
          ← 목록으로
        </button>
      </section>
    </div>
  );
}

export default DetailView;