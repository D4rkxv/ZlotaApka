import React, { useState, createContext, useContext, useCallback } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [selectedWidget, setSelectedWidget] = useState("dashboard");
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);

  const switchWidget = (widget) => {
    setSelectedWidget(widget);
  };
  const goToDashboard = useCallback(() => setSelectedWidget("dashboard"), []);
  const goToWater = useCallback(() => setSelectedWidget("water"), []);
  const goToFood = useCallback(() => setSelectedWidget("food"), []);
  const goToWorkouts = useCallback(() => setSelectedWidget("workouts"), []);
  const goToSleep = useCallback(() => setSelectedWidget("sleep"), []);
  const goToProfile = useCallback(() => setSelectedWidget("profile"), []);
  const goToSettings = useCallback(() => setSelectedWidget("settings"), []);

  const logWorkout = (name) => {
    setActivityHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name || "Workout",
        time: new Date().toLocaleString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const [hydrationGoal, setHydrationGoal] = useState(3.0);
  const [currentHydration, setCurrentHydration] = useState(0.5);
  const [workoutsDone, setWorkoutsDone] = useState(0);
  const [workoutGoal, setWorkoutGoal] = useState(5);

  const waterProgressWidth = ((currentHydration / hydrationGoal) * 100).toFixed(
    1
  );
  return (
    <DashboardContext.Provider
      value={{
        selectedWidget,
        switchWidget: switchWidget,
        goToDashboard,
        goToWater,
        goToFood,
        goToWorkouts,
        goToSleep,
        goToProfile,
        goToSettings,
        logWorkout,
        completedWorkouts,
        activityHistory,
        setActivityHistory,
        workoutGoal,
        setWorkoutGoal,
        workoutsDone,
        setWorkoutsDone,
        currentHydration,
        hydrationGoal,
        setCurrentHydration,
        setHydrationGoal,
        waterProgressWidth,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard need to be inside DashboardProvider");
  }
  return context;
};
