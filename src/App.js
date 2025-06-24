import React, { useState, useEffect } from "react";
import "./App.css";
import { FaCar, FaHotel, FaLaptop, FaIndustry, FaRecycle, FaGamepad, FaInfoCircle, FaDumbbell, FaShoppingCart, FaTools, FaHome, FaPaintRoller } from "react-icons/fa";

const ICONS = {
  "Автобизнес": <FaCar />,
  "Деревообработка": <FaIndustry />,
  // ...добавьте иконки для других категорий по желанию
};

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stack, setStack] = useState([]); // стек выбранных уровней

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/api/categories")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        setError("Ошибка загрузки данных с сервера");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="main-wrapper"><div className="loader">Загрузка...</div></div>;
  }
  if (error) {
    return <div className="main-wrapper"><div className="error">{error}</div></div>;
  }

  // Получаем текущий уровень данных
  let current = { list: data, title: "Готовые бизнес-планы" };
  for (const idx of stack) {
    if (!current.list || !current.list[idx]) break;
    const item = current.list[idx];
    current = {
      list: item.subcategories || [],
      plans: item.plans || [],
      title: item.name
    };
  }

  // Навигация назад
  const goBack = () => setStack(stack.slice(0, -1));

  return (
    <div className="main-wrapper">
      <header className="header">
        <div className="logo" style={{ cursor: stack.length ? "pointer" : undefined }} onClick={stack.length ? goBack : undefined}>
          АГРЕГАТОР<br />БИЗНЕС-ПЛАНОВ
        </div>
        <button className="plans-btn">Ещё 1 044 бизнес-плана</button>
      </header>
      <section className="hero">
        <h1>{current.title}</h1>
      </section>
      {current.list && current.list.length > 0 && (
        <section className="categories">
          <div className="categories-grid">
            {current.list.map((item, idx) => (
              <div
                className="category-card"
                key={idx}
                onClick={() => setStack([...stack, idx])}
              >
                <div className="category-icon">{ICONS[item.name] || <FaIndustry />}</div>
                <div className="category-name">{item.name}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="plans-list">
        {(!current.plans || current.plans.length === 0) && <div className="empty">Нет бизнес-планов в этой категории</div>}
        {current.plans && current.plans.map((plan, idx) => (
          <div className="plan-card" key={idx}>
            <div className="plan-title">{plan.title}</div>
            <div className="plan-desc">{plan.desc}</div>
            <div className="plan-actions">
              {plan.file_url && <a className="download-btn" href={plan.file_url} target="_blank" rel="noopener noreferrer">Скачать бизнес-план</a>}
              <button className="custom-btn">Нужен БП под ваш проект</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
