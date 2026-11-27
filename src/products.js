import watchData from "./data/182858_072_갤럭시워치8.json";
import cdData from "./data/182948_549_백넘버_back_number_cd.json";
import switchData from "./data/182822_078_닌텐도_스위치2.json";

const rawDatasets = [watchData, cdData, switchData];

function flattenDataset(dataset) {
  const category = dataset?.keyword ?? ""; // 데이터 수집 때 쓴 검색어 (예: "닌텐도 스위치2")

  const daangnList = (dataset?.sites?.daangn ?? []).map((item) => ({
    title: item.title,
    price: item.price,
    site: "당근마켓",
    url: item.url,
    image: item.image || "",
    date: item.posted_at ? item.posted_at.slice(0, 10) : "",
    region: item.region || "",
    status: item.status || "판매중",
    category,
  }));

  const bunjangList = (dataset?.sites?.bunjang ?? []).map((item) => ({
    title: item.title,
    price: item.price,
    site: "번개장터",
    url: item.url,
    image: item.image || "",
    date: item.posted_at ? item.posted_at.slice(0, 10) : "",
    region: item.region || "",
    status: item.status || "판매중",
    category,
  }));

  return [...daangnList, ...bunjangList];
}

export const products = rawDatasets.flatMap(flattenDataset);