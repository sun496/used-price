import { formatPrice } from "./summary";

function DetailModal({ product, median, onClose }) {
  const diff = median ? Math.round(((product.price - median) / median) * 100) : null;

  let diffText = "";
  if (diff !== null) {
    if (diff < 0) diffText = `중앙값보다 ${Math.abs(diff)}% 저렴해요`;
    else if (diff > 0) diffText = `중앙값보다 ${diff}% 비싸요`;
    else diffText = "중앙값과 같아요";
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal detail" onClick={(e) => e.stopPropagation()}>
        {product.image ? (
          <img className="detail-img" src={product.image} alt={product.title} />
        ) : (
          <div className="noimg">이미지 준비 중</div>
        )}

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
        <button className="modal-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default DetailModal;