import React, { useState, useEffect } from "react";
import "./FoodDiary.css";
import Sidebar from "./Sidebar.jsx";
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
  const [caloriesConsumed, setCaloriesConsumed] = useState(1440);
  const [caloriesGoal, setCaloriesGoal] = useState(3200);
  const [tips, setTips] = useState([
  "Eat regular meals to keep your energy levels stable throughout the day.",
  "Include vegetables or fruit in every meal for essential vitamins and fiber.",
  "Choose whole foods over highly processed products whenever possible.",
  "Start your day with a balanced breakfast containing protein and fiber.",
  "Drink water before meals to support digestion and portion control.",
  "Eat slowly and mindfully to better recognize hunger and fullness cues.",
  "Aim to fill half your plate with vegetables at main meals.",
  "Include a source of protein in every meal to stay full longer.",
  "Limit sugary snacks and opt for fruit, nuts, or yogurt instead.",
  "Plan your meals ahead to avoid unhealthy food choices.",
  "Choose whole grains instead of refined carbohydrates.",
  "Listen to your body’s hunger signals instead of eating out of habit.",
  "Keep healthy snacks available to avoid reaching for junk food.",
  "Include healthy fats like nuts, seeds, and olive oil in your diet.",
  "Avoid skipping meals, as it can lead to overeating later.",
  "Balance your plate with carbohydrates, protein, and fats.",
  "Reduce portion sizes if you often feel overly full after meals.",
  "Limit sugary drinks and choose water or unsweetened beverages.",
  "Eat more home-cooked meals to control ingredients and portions.",
  "Add variety to your meals to ensure a wide range of nutrients.",
  "Choose lean protein sources like fish, chicken, beans, or tofu.",
  "Pay attention to how foods make you feel after eating them.",
  "Avoid eating while distracted, such as while watching TV.",
  "Read food labels to better understand what you are consuming.",
  "Include fiber-rich foods to support digestion and gut health.",
  "Allow yourself occasional treats to maintain a balanced relationship with food.",
  "Stop eating when you feel comfortably full, not stuffed.",
  "Eat meals at consistent times to support metabolism.",
  "Focus on long-term habits instead of quick diet fixes.",
  "Enjoy your food without guilt and appreciate each meal."
    ]);
  const [selectedTip, setSelectedTip] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setSelectedTip(tips[randomIndex]);
  }, []);

  const weightValues = [84, 79.8, 79.5, 76.2, 79, 78.9, 75.7];
  const activityValues = [0, 10, 50, 25, 57, 43, 12];

  const deficit = [0, -50, 120, 80, 0, -30, -100];

  const macrosData = {
    labels: ['Protein', 'Fat', 'Carbs'],
    datasets: [
      {
        data: [900, 8000, 5000],
        backgroundColor: [
          '#5B5FEF', // Protein 
          '#FDB022', // Fat 
          '#22C1A2', // Carbs 
        ],
        borderWidth: 0,
      },
    ],
  };

  const macrosOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'left',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    maintainAspectRatio: false,
  };

  const caloriesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "",
        data: deficit.map((d) => 1000 - d),
        backgroundColor: deficit.map((d) =>
          d <= 0 ? "#00A8FF" : "rgba(0, 168, 255, 0.25)"
        ),
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 34,
      },
    ],
  };

  const caloriesOptions = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#9ca3af",
          font: { size: 12, family: "Poppins" },
        },
      },
      y: {
        display: false,
        min: 800,
        max: 1200,
      },
    },
    datasets: {
      bar: {
        categoryPercentage: 1,
        barPercentage: 1,
      },
    },
  };

  const mealDistributionData = {
    labels: ['B', 'L', 'D', 'S'],
    datasets: [
      {
        data: [18, 30, 25, 20],
        backgroundColor: '#14A3E3',
        borderRadius: 12,
        barThickness: 14,
      },
    ],
  };

  const mealDistributionOptions = {
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw}%`,
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 30,
        grid: {
          display: false,
        },
        ticks: {
          callback: (value) => `${value}%`,
          color: '#8A8FA3',
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#1E1E2F',
          font: {
            weight: '500',
          },
        },
        border: {
          display: true,
          color: '#1E1E2F',
          width: 2,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="foodContainer siteContainer">
      <Sidebar />
      <div className="widgetContainer">
        <p className="siteTitle">Food Diary</p>
        <div className="divider">
          <div className="leftSide">
            <div className="caloriesGoalContainer">
              <p className="sectionTitle">Calories left</p>
              <p className="caloriesCompletion">{caloriesConsumed} / {caloriesGoal} kcal</p>
              <p className="caloriesLeft">{caloriesGoal - caloriesConsumed} kcal left</p>
              <div className="progressTrack">
                <div className="progressFill" />
              </div>
            </div>
            <div className="mealManagerContainer breakfast">
              <div className="mealManagerTop">
                <div className="mealTitleContainer">
                  <p className="mealTitle">Breakfast•</p>
                  <p className="mealCaloriesGoal">450 kcal</p>
                </div>
                <p className="addMeal">Add meal</p>
              </div>
              <div className="mealList">
                <div className="mealItem">
                  <p className="mealName">Kebab</p>
                  <p className="mealDescription">500g • 1000kcal</p>
                </div>
                <div className="mealItem">
                  <p className="mealName">Kebab</p>
                  <p className="mealDescription">500g • 1000kcal</p>
                </div>
                <div className="mealItem">
                  <p className="mealName">Kebab</p>
                  <p className="mealDescription">500g • 1000kcal</p>
                </div>
                <div className="mealItem">
                  <p className="mealName">Kebab</p>
                  <p className="mealDescription">500g • 1000kcal</p>
                </div>
                <div className="mealItem">
                  <p className="mealName">Kebab</p>
                  <p className="mealDescription">500g • 1000kcal</p>
                </div>
              </div>
            </div>
            <div className="mealManagerContainer dinner">
              <div className="mealManagerTop">
                <div className="mealTitleContainer">
                  <p className="mealTitle">Dinner•</p>
                  <p className="mealCaloriesGoal">1150 kcal</p>
                </div>
                <p className="addMeal">Add meal</p>
              </div>
              <div className="mealList">
                <div className="mealItem">
                  <p className="mealName">Kebab</p>
                  <p className="mealDescription">500g • 1000kcal</p>
                </div>
                <div className="mealItem">
                  <p className="mealName">Kebab</p>
                  <p className="mealDescription">500g • 1000kcal</p>
                </div>
                <div className="mealItem">
                  <p className="mealName">Kebab</p>
                  <p className="mealDescription">500g • 1000kcal</p>
                </div>
                <div className="mealItem">
                  <p className="mealName">Kebab</p>
                  <p className="mealDescription">500g • 1000kcal</p>
                </div>
                <div className="mealItem">
                  <p className="mealName">Kebab</p>
                  <p className="mealDescription">500g • 1000kcal</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rightSide">
            <div className="divider">
              <div className="macrosContainer">
                <p className="sectionTitle">Macros</p>
                <div className="chartContainer">
                  <Doughnut data={macrosData} options={macrosOptions} />
                </div>
              </div>
              <div className="coloriesGoalStreakContainer">
                 <Bar data={caloriesData} options={caloriesOptions} />
              </div>
            </div>
            <div className="divider">
              <div className="mealManagerContainer lunch">
                <div className="mealManagerTop">
                  <div className="mealTitleContainer">
                    <p className="mealTitle">Lunch•</p>
                    <p className="mealCaloriesGoal">750 kcal</p>
                  </div>
                  <p className="addMeal">Add meal</p>
                </div>
                <div className="mealList">
                  <div className="mealItem">
                    <p className="mealName">Kebab</p>
                    <p className="mealDescription">500g • 1000kcal</p>
                  </div>
                  <div className="mealItem">
                    <p className="mealName">Kebab</p>
                    <p className="mealDescription">500g • 1000kcal</p>
                  </div>
                  <div className="mealItem">
                    <p className="mealName">Kebab</p>
                    <p className="mealDescription">500g • 1000kcal</p>
                  </div>
                  <div className="mealItem">
                    <p className="mealName">Kebab</p>
                    <p className="mealDescription">500g • 1000kcal</p>
                  </div>
                  <div className="mealItem">
                    <p className="mealName">Kebab</p>
                    <p className="mealDescription">500g • 1000kcal</p>
                  </div>
                </div>
              </div>
              <div className="mealDistributionContainer">
                <p className="sectionTitle">Meal Distribution</p>
                <div className="chartContainer">
                  <Bar data={mealDistributionData} options={mealDistributionOptions} />
                </div>
              </div>
            </div>
            <div className="divider">
              <div className="mealManagerContainer lunch">
                <div className="mealManagerTop">
                  <div className="mealTitleContainer">
                    <p className="mealTitle">Lunch•</p>
                    <p className="mealCaloriesGoal">750 kcal</p>
                  </div>
                  <p className="addMeal">Add meal</p>
                </div>
                <div className="mealList">
                  <div className="mealItem">
                    <p className="mealName">Kebab</p>
                    <p className="mealDescription">500g • 1000kcal</p>
                  </div>
                  <div className="mealItem">
                    <p className="mealName">Kebab</p>
                    <p className="mealDescription">500g • 1000kcal</p>
                  </div>
                  <div className="mealItem">
                    <p className="mealName">Kebab</p>
                    <p className="mealDescription">500g • 1000kcal</p>
                  </div>
                  <div className="mealItem">
                    <p className="mealName">Kebab</p>
                    <p className="mealDescription">500g • 1000kcal</p>
                  </div>
                  <div className="mealItem">
                    <p className="mealName">Kebab</p>
                    <p className="mealDescription">500g • 1000kcal</p>
                  </div>
                </div>
              </div>
              <div className="dailyTipContainer">
                <p className="sectionTitle">Daily tip</p>
                <ul>
                  <li>{selectedTip}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FoodDiary;
