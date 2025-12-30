import React, { useState, createContext, useContext, useCallback } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [selectedWidget, setSelectedWidget] = useState("dashboard");
  const switchWidget = (widget) => {
    setSelectedWidget(widget);
  };
  const goToDashboard = useCallback(() => setSelectedWidget("dashboard"), []);
  const goToWater = useCallback(() => setSelectedWidget("water"), []);
  const goToFood = useCallback(() => setSelectedWidget("food"), []);
  const goToWorkouts = useCallback(() => setSelectedWidget("workouts"), []);
  const goToSleep = useCallback(() => setSelectedWidget("sleep"), []);
  const goToProfile = useCallback(() => setSelectedWidget("profile"), []);

  const [hydrationGoal, setHydrationGoal] = useState(3.0);
  const [currentHydration, setCurrentHydration] = useState(0.5);
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
