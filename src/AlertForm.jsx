import { useState } from "react";
import { formatPrice } from "./summary";

function AlertForm() {
  const [name, setName] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [alerts, setAlerts] = useState([]);

  function handleAdd() {
    if (name.trim() === "" || targetPrice === "") return;
    const newAlert = { name: name.trim(), price: Number(targetPrice) };
    setAlerts([...alerts, newAlert]);
    setName("");
    setTargetPrice("");
  }

  function handleRemove(index) {
    setAlerts(alerts.filter((_, i) => i !== index));
  }

  return (
    <section className="alert-box">

      <div className="alert-inputs">
        <input
          className="alert-input"
          type="text"
          placeholder="상품명"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="alert-input"
          type="number"
          placeholder="목표 가격 (원)"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
        />
        <button className="alert-btn" onClick={handleAdd}>
          알림 등록
        </button>
      </div>

      {alerts.length === 0 ? (
        <p className="alert-empty">등록된 알림이 없어요.</p>
      ) : (
        <ul className="alert-list">
          {alerts.map((a, i) => (
            <li key={i}>
              <span>
                {a.name} · {formatPrice(a.price)} 이하
              </span>
              <button className="alert-del" onClick={() => handleRemove(i)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AlertForm;