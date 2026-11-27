import { formatPrice, getPercent, gaugeColor } from "./summary";

// 시세 게이지: 왼쪽 싼 매물 ~ 오른쪽 비싼 매물, 선택한 상품 위치에 동그라미
function PriceGauge({ range, focused }) {
  // 바 배경 그라데이션 (0%, 10%, ... 100% 색을 이어붙임)
  const stops = Array.from({ length: 11 }, (_, i) => i * 10)
    .map((p) => `${gaugeColor(p)} ${p}%`)
    .join(", ");

  const medianPct = getPercent(range.median, range);
  const pct = focused ? getPercent(focused.price, range) : null;

  return (
    <div className="gauge-wrap">
      <div className="gauge-labels">
        <span>싼 매물 {formatPrice(range.min)}</span>
        <span>중앙값 {formatPrice(range.median)}</span>
        <span>비싼 매물 {formatPrice(range.max)}</span>
      </div>

      <div className="gauge-bar" style={{ background: `linear-gradient(90deg, ${stops})` }}>
        <span className="gauge-median" style={{ left: `${medianPct}%` }} />
        {pct !== null && (
          <span
            className="gauge-marker"
            style={{ left: `${pct}%`, background: gaugeColor(pct) }}
          />
        )}
      </div>

      <p className="gauge-hint">
        {focused
          ? `현재 상품 ${formatPrice(focused.price)}`
          : "스크롤하거나 상품을 누르면 가격 위치가 표시돼요"}
        <span className="gauge-note"> · 너무 싼/비싼 값(하위·상위 5%)은 범위에서 제외</span>
      </p>
    </div>
  );
}

export default PriceGauge;