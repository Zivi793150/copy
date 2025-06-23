import React, { useState } from "react";
import "./App.css";
import { FaCar, FaHotel, FaLaptop, FaIndustry, FaRecycle, FaGamepad, FaInfoCircle, FaDumbbell, FaShoppingCart, FaTools, FaHome, FaPaintRoller } from "react-icons/fa";

const data = [
  {
    icon: <FaIndustry />, name: "Деревообработка", subcategories: [
      {
        name: "Пилорамы и столярные мастерские",
        plans: [
          {
            title: "Бизнес-план пилорамы",
            desc: "Бизнес-план по открытию пилорамы с расчетами, оборудованием и анализом рынка."
          },
          {
            title: "Бизнес-план столярной мастерской",
            desc: "Проект по запуску столярной мастерской для производства мебели и изделий из дерева."
          },
          {
            title: "Бизнес-план мини-пилорамы",
            desc: "Мини-производство пиломатериалов для местного рынка."
          }
        ]
      },
      {
        name: "Производство изделий из бумаги",
        plans: [
          {
            title: "Бизнес план по производству бумажной тары и упаковки",
            desc: "Ассортимент продукции: крафт мешки, бумажные пакеты, упаковка с ламинированием и без."
          },
          {
            title: "Бизнес план производства туалетной бумаги",
            desc: "Мини-завод по производству туалетной бумаги с разными вариантами ассортимента."
          },
          {
            title: "Бизнес-план производства салфеток",
            desc: "Производство бумажных салфеток для HoReCa и розницы."
          }
        ]
      },
      {
        name: "Производство мебели",
        plans: [
          {
            title: "Бизнес-план мебельного производства",
            desc: "Производство корпусной и мягкой мебели, расчет инвестиций и окупаемости."
          },
          {
            title: "Бизнес-план производства кухонь",
            desc: "Изготовление кухонной мебели на заказ."
          }
        ]
      },
      {
        name: "Производство посуды",
        plans: [
          {
            title: "Бизнес-план производства одноразовой посуды",
            desc: "Производство биоразлагаемой посуды для мероприятий и кейтеринга."
          },
          {
            title: "Бизнес-план производства стеклянной посуды",
            desc: "Производство стеклянных стаканов и тарелок."
          }
        ]
      },
      {
        name: "Производство пеллет и брикетов",
        plans: [
          {
            title: "Бизнес-план производства пеллет",
            desc: "Производство топливных пеллет из древесных отходов."
          },
          {
            title: "Бизнес-план производства брикетов",
            desc: "Производство топливных брикетов для отопления."
          }
        ]
      }
    ]
  },
  {
    icon: <FaCar />, name: "Автобизнес", subcategories: [
      {
        name: "Автомойки",
        plans: [
          {
            title: "Бизнес-план автомойки",
            desc: "Открытие автомойки самообслуживания с расчетом затрат и прибыли."
          },
          {
            title: "Бизнес-план автоматической автомойки",
            desc: "Проект по запуску автоматической автомойки с современным оборудованием."
          }
        ]
      },
      {
        name: "СТО и автосервисы",
        plans: [
          {
            title: "Бизнес-план автосервиса",
            desc: "Открытие станции технического обслуживания легковых автомобилей."
          },
          {
            title: "Бизнес-план шиномонтажа",
            desc: "Организация шиномонтажной мастерской с расчетом затрат."
          }
        ]
      }
    ]
  }
  // ... другие категории по аналогии
];

function App() {
  const [category, setCategory] = useState(null);
  const [subcatIdx, setSubcatIdx] = useState(0);

  // Главная страница
  if (!category) {
    return (
      <div className="main-wrapper">
        <header className="header">
          <div className="logo">АГРЕГАТОР<br />БИЗНЕС-ПЛАНОВ</div>
          <button className="plans-btn">Ещё 1 044 бизнес-плана</button>
        </header>
        <section className="hero">
          <h1>Готовые бизнес-планы</h1>
        </section>
        <section className="categories">
          <div className="categories-grid">
            {data.map((cat, idx) => (
              <div
                className="category-card"
                key={idx}
                onClick={() => { setCategory(cat); setSubcatIdx(0); }}
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Страница категории с подкатегориями и планами
  const subcategories = category.subcategories;
  const currentSubcat = subcategories[subcatIdx];

  return (
    <div className="main-wrapper">
      <header className="header">
        <div className="logo" style={{ cursor: "pointer" }} onClick={() => setCategory(null)}>
          АГРЕГАТОР<br />БИЗНЕС-ПЛАНОВ
        </div>
        <button className="plans-btn">Ещё 1 044 бизнес-плана</button>
      </header>
      <section className="hero">
        <h1>Примеры бизнес планов по {category.name.toLowerCase()}</h1>
        <div className="category-subtitle">Выберите подкатегорию:</div>
      </section>
      <section className="subcategories-list">
        {subcategories.map((sub, idx) => (
          <button
            className={`subcategory-btn${idx === subcatIdx ? " active" : ""}`}
            key={idx}
            onClick={() => setSubcatIdx(idx)}
          >
            {sub.name}
          </button>
        ))}
      </section>
      <section className="plans-list">
        {currentSubcat.plans.map((plan, idx) => (
          <div className="plan-card" key={idx}>
            <div className="plan-title">{plan.title}</div>
            <div className="plan-desc">{plan.desc}</div>
            <div className="plan-actions">
              <button className="download-btn">Скачать бизнес-план</button>
              <button className="custom-btn">Нужен БП под ваш проект</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
