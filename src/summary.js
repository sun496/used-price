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