export function formatPrice(value) {
  return Math.round(value).toLocaleString("ko-KR") + "원";
}

export function getSummary(items) {
  const prices = items.map((p) => p.price);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);

  let sum = 0;
  for (const price of prices) {
    sum = sum + price;
  }
  const average = sum / prices.length;

  const sorted = [...prices].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  let median;
  if (sorted.length % 2 === 0) {
    median = (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    median = sorted[middle];
  }

  return { lowest, highest, average, median };
}

// ---- 시세 게이지용 (추가) ----

// 게이지 범위: 너무 싼/비싼 값(33원, 250만원 등)이 바를 망치지 않게 하위 5% ~ 상위 5% 제외
export function getGaugeRange(items) {
  const prices = items.map((p) => p.price).sort((a, b) => a - b);
  const pick = (q) => prices[Math.floor((prices.length - 1) * q)];
  const { median } = getSummary(items);
  return { min: pick(0.05), max: pick(0.95), median };
}

// 가격이 게이지 어디쯤인지 0~100 (범위 밖은 양 끝에 붙임)
export function getPercent(price, range) {
  if (range.max === range.min) return 50;
  const pct = ((price - range.min) / (range.max - range.min)) * 100;
  return Math.max(0, Math.min(100, pct));
}

// 위치(0~100) -> 색 (싼 매물 초록 -> 비싼 매물 빨강). 바 배경과 동그라미가 같은 함수를 써서 색이 일치
export function gaugeColor(percent) {
  const hue = 150 - (145 * percent) / 100;
  return `hsl(${hue}, 70%, 72%)`;
}