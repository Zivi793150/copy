import React, { useState, useEffect } from "react";
import "./App.css";
import { FaBriefcase, FaChartBar, FaLaptop, FaTools, FaBuilding, FaUserTie, FaStore, FaUtensils, FaCar, FaIndustry, FaClinicMedical, FaGraduationCap, FaRecycle, FaDumbbell, FaPrint, FaHome, FaCogs, FaBoxOpen, FaUserFriends, FaLeaf, FaShippingFast, FaBook, FaSeedling, FaInfoCircle, FaTimes } from "react-icons/fa";

const ICONS = {
  "Автобизнес": <FaCar style={{color: '#181818'}} />,
  "Деревообработка": <FaIndustry style={{color: '#181818'}} />,
  "Гостиничный бизнес": <FaBuilding style={{color: '#181818'}} />,
  "Компьютерный бизнес": <FaLaptop style={{color: '#181818'}} />,
  "Мусоропереработка": <FaRecycle style={{color: '#181818'}} />,
  "Отдых и развлечения": <FaChartBar style={{color: '#181818'}} />,
  "Прочее": <FaInfoCircle style={{color: '#181818'}} />,
  "Спорт": <FaDumbbell style={{color: '#181818'}} />,
  "Торговля": <FaStore style={{color: '#181818'}} />,
  "Строительство": <FaTools style={{color: '#181818'}} />,
  "Коттеджные посёлки": <FaHome style={{color: '#181818'}} />,
  "Ремонт и отделочные услуги": <FaTools style={{color: '#181818'}} />,
  "Медицина": <FaClinicMedical style={{color: '#181818'}} />,
  "Сельское хозяйство": <FaSeedling style={{color: '#181818'}} />,
  "Образование": <FaGraduationCap style={{color: '#181818'}} />,
  "Общепит": <FaUtensils style={{color: '#181818'}} />,
  "Консалтинг": <FaUserTie style={{color: '#181818'}} />,
  "Логистические центры": <FaShippingFast style={{color: '#181818'}} />,
  "Магазины автозапчастей": <FaStore style={{color: '#181818'}} />,
  "Типографии": <FaPrint style={{color: '#181818'}} />,
  "Металлообработка": <FaCogs style={{color: '#181818'}} />,
  "Производство продуктов питания": <FaBoxOpen style={{color: '#181818'}} />,
  "Салоны красоты": <FaUserFriends style={{color: '#181818'}} />,
  "Бытовые услуги": <FaUserFriends style={{color: '#181818'}} />,
  "Добыча полезных ископаемых": <FaLeaf style={{color: '#181818'}} />,
  "Производство стройматериалов": <FaBuilding style={{color: '#181818'}} />,
  "Машиностроение": <FaIndustry style={{color: '#181818'}} />,
  "Финансы": <FaChartBar style={{color: '#181818'}} />,
  "Книги": <FaBook style={{color: '#181818'}} />,
  "Аптеки": <FaClinicMedical style={{color: '#181818'}} />,
  "Арендный бизнес": <FaHome style={{color: '#181818'}} />,
  "Производство пеллет и брикетов": <FaSeedling style={{color: '#181818'}} />
  // ...можно добавить ещё по желанию
};

function Modal({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) {
      setName(""); setPhone(""); setMessage(""); setSent(false);
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FaTimes /></button>
        <h2 className="modal-title">Заполните форму связи</h2>
        {sent ? (
          <div className="modal-success">Спасибо! Мы свяжемся с вами в течение 5 минут.</div>
        ) : (
          <form className="modal-form" onSubmit={e => {e.preventDefault(); setSent(true); onSubmit && onSubmit({name, phone, message});}}>
            <div className="modal-label">Свяжемся с Вами в течение 5 минут</div>
            <input className="modal-input" type="text" placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} required />
            <input className="modal-input" type="tel" placeholder="Номер телефона" value={phone} onChange={e => setPhone(e.target.value)} required />
            <textarea className="modal-input" placeholder="Сообщение" value={message} onChange={e => setMessage(e.target.value)} rows={3} />
            <button className="modal-submit" type="submit">ОТПРАВИТЬ</button>
            <div className="modal-policy">
              Отправляя сообщение я даю <a href="#" target="_blank" rel="noopener noreferrer">Согласие</a> на обработку персональных данных.<br />
              С условиями <a href="#" target="_blank" rel="noopener noreferrer">Политики в отношении обработки персональных данных</a> ознакомлен.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stack, setStack] = useState([]); // стек выбранных уровней
  const [modalOpen, setModalOpen] = useState(false);

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
  const goHome = () => setStack([]);
  const isRoot = stack.length === 0;

  return (
    <div className="main-wrapper">
      <header className="header">
        <div className="logo" style={{ cursor: stack.length ? "pointer" : undefined }} onClick={stack.length ? goBack : undefined}>
          АГРЕГАТОР<br />БИЗНЕС-ПЛАНОВ
        </div>
        <button className="plans-btn" onClick={goHome}>Ещё 1 044 бизнес-плана</button>
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
                <div className="category-icon">{ICONS[item.name] || <FaBriefcase style={{color: '#181818'}} />}</div>
                <div className="category-name">{item.name}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="plans-list">
        {!isRoot && (!current.plans || current.plans.length === 0) && <div className="empty">Нет бизнес-планов в этой категории</div>}
        {current.plans && current.plans.map((plan, idx) => (
          <div className="plan-card" key={idx}>
            <div className="plan-title">{plan.title}</div>
            <div className="plan-desc">{plan.desc}</div>
            <div className="plan-actions">
              {plan.file_url && <a className="download-btn" href={plan.file_url} target="_blank" rel="noopener noreferrer">Скачать бизнес-план</a>}
              <button className="custom-btn" onClick={() => setModalOpen(true)}>Нужен БП под ваш проект</button>
            </div>
          </div>
        ))}
      </section>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default App;
