import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [selectedWidget, setSelectedWidget] = useState("dashboard");

  //workout Section
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [workoutsDone, setWorkoutsDone] = useState(null);
  const [workoutGoal, setWorkoutGoal] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(null);
  const [allSeconds, setAllSeconds] = useState(null);
  const [workoutStatus, setWorkoutStatus] = useState("idle");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isChecked, setIsChecked] = useState(Array(6).fill(false));

  //water Section
  const [hydrationGoal, setHydrationGoal] = useState(3.0);
  const [currentHydration, setCurrentHydration] = useState(0.5);

  const switchWidget = (widget) => {
    setSelectedWidget(widget);
  };

  //page Switching
  const goToDashboard = useCallback(() => setSelectedWidget("dashboard"), []);
  const goToWater = useCallback(() => setSelectedWidget("water"), []);
  const goToFood = useCallback(() => setSelectedWidget("food"), []);
  const goToWorkouts = useCallback(() => setSelectedWidget("workouts"), []);
  const goToSleep = useCallback(() => setSelectedWidget("sleep"), []);
  const goToProfile = useCallback(() => setSelectedWidget("profile"), []);
  const goToSettings = useCallback(() => setSelectedWidget("settings"), []);

  //workout Logging
  const logWorkout = (name) => {
    const newWorkout = {
      id: Date.now(),
      name: name || "Workout",
      time: new Date().toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toISOString().split("T")[0],
    };

    setActivityHistory((prev) => {
      const updated = [newWorkout, ...prev.slice(0, 100)];
      try {
        localStorage.setItem("fitnessWorkouts", JSON.stringify(updated));
      } catch (e) {
        console.log("SAVE ERROR:", e);
      }
      return updated;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem("workoutsDone", workoutsDone.toString());
    } catch (e) {
      console.log("SAVE workoutsDone ERROR:", e);
    }
    console.log("SAVE workoutsDone ==", workoutsDone);
  }, [workoutsDone]);

  useEffect(() => {
    try {
      localStorage.setItem("allSeconds", allSeconds.toString());
    } catch (e) {
      console.log("SAVE workoutSec ERROR:", e);
    }
    console.log("SAVE workoutsSEC ==", allSeconds);
  }, [allSeconds]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fitnessWorkouts");
      const savedWorkoutCount = localStorage.getItem("workoutsDone");
      const savedWorkoutSeconds = localStorage.getItem("allSeconds");

      if (saved) {
        setActivityHistory(JSON.parse(saved));
      }
      if (savedWorkoutCount !== null) {
        setWorkoutsDone(parseInt(savedWorkoutCount));
      }
      if (savedWorkoutSeconds !== null) {
        setAllSeconds(parseInt(savedWorkoutSeconds));
      }
    } catch (e) {
      console.log("load Error: ", e);
    }
    console.log("LOAD workoutsDone ==", workoutsDone);
    console.log("LOAD workoutsSEC ==", allSeconds);
  }, []);

  const waterProgressWidth = ((currentHydration / hydrationGoal) * 100).toFixed(
    1
  );
  const workoutProgressWidth = ((workoutsDone / workoutGoal) * 100).toFixed(1);
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
        isActive,
        setIsActive,
        seconds,
        setSeconds,
        workoutStatus,
        setWorkoutStatus,
        isChecked,
        setIsChecked,
        isDisabled,
        setIsDisabled,
        allSeconds,
        setAllSeconds,

        currentHydration,
        hydrationGoal,
        setCurrentHydration,
        setHydrationGoal,
        waterProgressWidth,
        workoutProgressWidth,
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
