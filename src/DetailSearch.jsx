import { useState } from "react";

// 상세검색: 포함 키워드(✓) / 제외 키워드(✗) 칩
function DetailSearch({ includeWords, excludeWords, setIncludeWords, setExcludeWords }) {
  const [mode, setMode] = useState("include"); // 지금 추가할 종류
  const [text, setText] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    const word = text.trim();
    if (word === "") return;

    if (mode === "include" && !includeWords.includes(word)) {
      setIncludeWords([...includeWords, word]);
    }
    if (mode === "exclude" && !excludeWords.includes(word)) {
      setExcludeWords([...excludeWords, word]);
    }
    setText("");
  }

  return (
    <div className="detail-search">
      <strong className="detail-search-label">상세 검색</strong>

      {includeWords.map((w) => (
        <button
          key={"in-" + w}
          className="kw-chip include"
          title="누르면 삭제"
          onClick={() => setIncludeWords(includeWords.filter((x) => x !== w))}
        >
          ✓ {w}
        </button>
      ))}
      {excludeWords.map((w) => (
        <button
          key={"ex-" + w}
          className="kw-chip exclude"
          title="누르면 삭제"
          onClick={() => setExcludeWords(excludeWords.filter((x) => x !== w))}
        >
          ✗ {w}
        </button>
      ))}

      <form className="kw-form" onSubmit={handleAdd}>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="include">포함</option>
          <option value="exclude">제외</option>
        </select>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="키워드"
        />
        <button type="submit" className="kw-add">+</button>
      </form>
    </div>
  );
}

export default DetailSearch;