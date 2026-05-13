import React, { useState, useEffect } from "react";
import "./FoodDiary.css";
import Sidebar from "./Sidebar.jsx";
import { useLanguage } from "./LanguageContext.jsx";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useDashboard } from "./DashboardContext.jsx";
import MealPopup from "./MealPopup.jsx";
import EditBlack from "./assets/Edit_Pencil_02.svg";
import Trashcan from "./assets/Trash_Full.svg";
import MealDescriptionPopup from "./MealDescriptionPopup.jsx";
import EditMealPopup from "./EditMealPopup.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const FoodDiary = () => {
  const {
    breakfastList,
    lunchList,
    snacksList,
    dinnerList,
    addMeal,
    countAllCalories,
    caloriesCount,
    fatsCount,
    proteinCount,
    carbsCount,
    countCalories,
    weekFood,
    caloriesGoal,
    deleteMeal,
    updateMeal,
  } = useDashboard();
  const { t } = useLanguage();
  const f = t.food;

  const foodTips = t.foodTips;
  const [selectedTip, setSelectedTip] = useState("");
  const [popupMealType, setPopupMealType] = useState("");
  const [showEntryViewPopup, setShowEntryViewPopup] = useState(false);
  const [shownMeal, setShownMeal] = useState(null);
  const [modifiedMeal, setModifiedMeal] = useState(null);
  const [showEditMeal, setShowEditMeal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * foodTips.length);
    setSelectedTip(foodTips[randomIndex]);
  }, [foodTips]);

  const macrosData = {
    labels: ["Protein", "Fat", "Carbs"],
    datasets: [
      {
        data: [proteinCount, fatsCount, carbsCount],
        backgroundColor: ["#5B5FEF", "#FDB022", "#22C1A2"],
        borderWidth: 0,
      },
    ],
  };

  const macrosOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "left",
        labels: { usePointStyle: true, pointStyle: "circle" },
      },
    },
    maintainAspectRatio: false,
  };

  const caloriesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "",
        data: weekFood,
        backgroundColor: weekFood.map((val) =>
          val > 3200 ? "#00A8FF" : "rgba(0,168,255,0.25)"
        ),
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 34,
      },
    ],
  };

  const caloriesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af", font: { size: 12, family: "Poppins" } },
      },
      y: { display: false, min: 0, beginAtZero: true, suggestedMax: 3200 },
    },
    datasets: {
      bar: { categoryPercentage: 1, barPercentage: 1 },
    },
  };

  const mealDistributionData = {
    labels: ["B", "L", "D", "S"],
    datasets: [
      {
        data: [
          Math.min(caloriesCount > 0 ? ((countCalories(breakfastList) / caloriesCount) * 100).toFixed(2) : 0, 100),
          Math.min(caloriesCount > 0 ? ((countCalories(lunchList) / caloriesCount) * 100).toFixed(2) : 0, 100),
          Math.min(caloriesCount > 0 ? ((countCalories(dinnerList) / caloriesCount) * 100).toFixed(2) : 0, 100),
          Math.min(caloriesCount > 0 ? ((countCalories(snacksList) / caloriesCount) * 100).toFixed(2) : 0, 100),
        ],
        backgroundColor: "#14A3E3",
        borderRadius: 12,
        barThickness: 14,
      },
    ],
  };

  const mealDistributionOptions = {
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.raw}%` } },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        grid: { display: false },
        ticks: { callback: (value) => `${value}%`, color: "#8A8FA3" },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#1E1E2F", font: { weight: "500" } },
        border: { display: true, color: "#1E1E2F", width: 2 },
      },
    },
    maintainAspectRatio: false,
  };

  const renderMealPopup = () => {
    if (popupMealType === "") return null;
    return (
      <MealPopup
        setPopupMealType={setPopupMealType}
        addMeal={addMeal}
        mealType={popupMealType}
      />
    );
  };

  const selectMeal = (meal) => {
    setShownMeal(meal);
    setShowEntryViewPopup(true);
  };

  const selectMealToEdit = (meal) => {
    setShowEditMeal(true);
    setModifiedMeal(meal);
  };

  const renderEditMealPopup = () => {
    if (!showEditMeal) return null;
    return (
      <EditMealPopup
        setPopupMealType={setShowEditMeal}
        meal={modifiedMeal}
        updateMeal={updateMeal}
      />
    );
  };

  const renderMealList = (list) =>
    list.map((meal) => (
      <div className="mealItem" key={meal.id}>
        <div className="entryDescription" onClick={() => selectMeal(meal)}>
          <p className="mealName">{meal.food_name}</p>
          <p className="mealDescription">
            {meal.grammage}g • {meal.calories}kcal
          </p>
        </div>
        <div className="entryOptions">
          <button onClick={() => selectMealToEdit(meal)}>
            <img src={EditBlack} alt="Edit food" />
          </button>
          <button onClick={() => deleteMeal(meal.id)}>
            <img src={Trashcan} alt="Delete entry" />
          </button>
        </div>
      </div>
    ));

  return (
    <>
      {renderEditMealPopup()}
      {shownMeal && showEntryViewPopup ? (
        <MealDescriptionPopup
          meal={shownMeal}
          setPopupVisibility={setShowEntryViewPopup}
        />
      ) : null}
      {renderMealPopup()}
      <div className="foodContainer siteContainer">
        <Sidebar />
        <div className="widgetContainer">
          <p className="siteTitle">{f.title}</p>
          <div className="mainDivider">
            <div className="leftSide">
              <div className="caloriesGoalContainer">
                <p className="sectionTitle">{f.caloriesLeft}</p>
                <p className="caloriesCompletion">
                  {caloriesCount} / {caloriesGoal} kcal
                </p>
                <p className="caloriesLeft">
                  {caloriesGoal - caloriesCount > 0
                    ? `${caloriesGoal - caloriesCount} ${f.kcalLeft}`
                    : caloriesGoal - caloriesCount === 0
                      ? f.goalMet
                      : `${-1 * (caloriesGoal - caloriesCount)} ${f.kcalOverGoal}`}
                </p>
                <div className="progressTrack">
                  <div
                    className="progressFill"
                    style={{
                      width: `${Math.min(
                        ((caloriesCount / caloriesGoal) * 100).toFixed(0),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div className="mealManagerContainer breakfast">
                <div className="mealManagerTop">
                  <div className="mealTitleContainer">
                    <p className="mealTitle">{f.breakfast}•</p>
                    <p className="mealCaloriesGoal">{countCalories(breakfastList)} kcal</p>
                  </div>
                  <p className="addMeal" onClick={() => setPopupMealType("breakfast")}>{f.addMeal}</p>
                </div>
                <div className="mealList">{renderMealList(breakfastList)}</div>
              </div>
              <div className="mealManagerContainer dinner">
                <div className="mealManagerTop">
                  <div className="mealTitleContainer">
                    <p className="mealTitle">{f.dinner}•</p>
                    <p className="mealCaloriesGoal">{countCalories(dinnerList)} kcal</p>
                  </div>
                  <p className="addMeal" onClick={() => setPopupMealType("dinner")}>{f.addMeal}</p>
                </div>
                <div className="mealList">{renderMealList(dinnerList)}</div>
              </div>
            </div>

            <div className="rightSide">
              <div className="divider macrosRow">
                <div className="macrosContainer">
                  <p className="sectionTitle">{f.macros}</p>
                  <div className="chartContainer">
                    <Doughnut key={`donut-${windowWidth}`} data={macrosData} options={macrosOptions} />
                  </div>
                </div>
                <div className="coloriesGoalStreakContainer">
                  <Bar key={`bar-${windowWidth}`} data={caloriesData} options={caloriesOptions} />
                </div>
              </div>
              <div className="divider lunchRow">
                <div className="mealManagerContainer lunch">
                  <div className="mealManagerTop">
                    <div className="mealTitleContainer">
                      <p className="mealTitle">{f.lunch}•</p>
                      <p className="mealCaloriesGoal">{countCalories(lunchList)} kcal</p>
                    </div>
                    <p className="addMeal" onClick={() => setPopupMealType("lunch")}>{f.addMeal}</p>
                  </div>
                  <div className="mealList">{renderMealList(lunchList)}</div>
                </div>
                <div className="mealDistributionContainer">
                  <p className="sectionTitle">{f.mealDistribution}</p>
                  <div className="chartContainer">
                    <Bar key={`bar-dist-${windowWidth}`} data={mealDistributionData} options={mealDistributionOptions} />
                  </div>
                </div>
              </div>
              <div className="divider snacksRow">
                <div className="mealManagerContainer snacks">
                  <div className="mealManagerTop">
                    <div className="mealTitleContainer">
                      <p className="mealTitle">{f.snacks}•</p>
                      <p className="mealCaloriesGoal">{countCalories(snacksList)} kcal</p>
                    </div>
                    <p className="addMeal" onClick={() => setPopupMealType("snacks")}>{f.addMeal}</p>
                  </div>
                  <div className="mealList">{renderMealList(snacksList)}</div>
                </div>
                <div className="dailyTipContainer">
                  <p className="sectionTitle">{f.dailyTip}</p>
                  <ul>
                    <li>{selectedTip}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodDiary;