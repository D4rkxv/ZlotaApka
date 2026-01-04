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
  const [dailyWorkoutMinutes, setDailyWorkoutMinutes] = useState({});
  const [quickActivities, setQuickActivities] = useState([]);
  const [allCalories, setAllCalories] = useState(null);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [todayKey, setTodayKey] = useState("");

  const allWorkouts = [
    [
      { id: "w1-1", name: "Squats - 3x12" },
      { id: "w1-2", name: "Elevated push-ups 3x8" },
      { id: "w1-3", name: "One-arm dumbbell row 3x10" },
      { id: "w1-4", name: "Dumbbell overhead press 3x10" },
      { id: "w1-5", name: "Plank 3x40s" },
      { id: "w1-6", name: "Glute bridge 3x12" },
    ],
    [
      { id: "w2-1", name: "Bodyweight squats - 3x15" },
      { id: "w2-2", name: "Push-ups - 3x10" },
      { id: "w2-3", name: "Superman hold - 3x30s" },
      { id: "w2-4", name: "Pike push-ups - 3x8" },
      { id: "w2-5", name: "Lunges per leg - 3x12" },
      { id: "w2-6", name: "Dead bug - 3x12/side" },
    ],
    [
      { id: "w3-1", name: "Goblet squats - 3x12" },
      { id: "w3-2", name: "Dumbbell bench press- 3x10" },
      { id: "w3-3", name: "Single-arm rows - 3x12/arm" },
      { id: "w3-4", name: "Dumbbell lunges - 3x10/leg" },
      { id: "w3-5", name: "Russian twists - 3x20" },
      { id: "w3-6", name: "Side plank - 3x30s/side" },
    ],
    [
      { id: "w4-1", name: "Bulgarian split squats - 3x10/leg" },
      { id: "w4-2", name: "Diamond push-ups - 3x8" },
      { id: "w4-3", name: "Inverted rows (table) - 3x12" },
      { id: "w4-4", name: "Dumbbell deadlifts - 3x12" },
      { id: "w4-5", name: "Bicycle crunches - 3x15/side" },
      { id: "w4-6", name: "Wall sit - 3x40s" },
    ],
    [
      { id: "w5-1", name: "Reverse lunges - 3x12/leg" },
      { id: "w5-2", name: "Wide push-ups - 3x10" },
      { id: "w5-3", name: "Dumbbell rows both arms - 3x10" },
      { id: "w5-4", name: "Chair dips - 3x12" },
      { id: "w5-5", name: "Leg raises - 3x12" },
      { id: "w5-6", name: "Plank shoulder taps - 3x20" },
    ],
    [
      { id: "w6-1", name: "Sumo squats - 3x15" },
      { id: "w6-2", name: "Floor press dumbbells - 3x12" },
      { id: "w6-3", name: "Bent-over rows - 3x12" },
      { id: "w6-4", name: "Lateral raises - 3x12" },
      { id: "w6-5", name: "Overhead tricep ext - 3x12" },
      { id: "w6-6", name: "Bird dog - 3x10/side" },
    ],
    [
      { id: "w7-1", name: "Air squats - 3x15" },
      { id: "w7-2", name: "Wall push-ups - 3x12" },
      { id: "w7-3", name: "Prone cobra - 3x30s" },
      { id: "w7-4", name: "Step-ups (chair) - 3x12/leg" },
      { id: "w7-5", name: "Seated twists - 3x20" },
      { id: "w7-6", name: "Bridge march - 3x20" },
    ],
    [
      { id: "w8-1", name: "Jump squats - 3x10" },
      { id: "w8-2", name: "Archer push-ups - 3x8/side" },
      { id: "w8-3", name: "Australian rows - 3x12" },
      { id: "w8-4", name: "Pistol squat assist - 3x8/leg" },
      { id: "w8-5", name: "Mountain climbers - 3x30s" },
      { id: "w8-6", name: "Hollow hold - 3x30s" },
    ],
    [
      { id: "w9-1", name: "Single-leg deadlift - 3x10/leg" },
      { id: "w9-2", name: "Incline push-ups - 3x12" },
      { id: "w9-3", name: "Face pulls (band) - 3x15" },
      { id: "w9-4", name: "Calf raises - 3x15" },
      { id: "w9-5", name: "Windmill - 3x10/side" },
      { id: "w9-6", name: "Side plank dips - 3x12/side" },
    ],
    [
      { id: "w10-1", name: "Thrusters (dumbbell) - 3x10" },
      { id: "w10-2", name: "Renegade rows - 3x8/arm" },
      { id: "w10-3", name: "Burpee push-ups - 3x8" },
      { id: "w10-4", name: "Goblet lunges - 3x10/leg" },
      { id: "w10-5", name: "V-ups - 3x12" },
      { id: "w10-6", name: "Bear crawl hold - 3x40s" },
    ],
  ];

  //water Section
  const [hydrationGoal, setHydrationGoal] = useState(3.0);
  const [currentHydration, setCurrentHydration] = useState(0.5);

  const saveWithWeeklyReset = useCallback(
    (key, value, serializer = JSON.stringify) => {
      const now = new Date();
      let daysToSunday = (7 - now.getDay()) % 7;

      if (now.getDay() === 0) {
        daysToSunday = 0;
      } else {
        daysToSunday = daysToSunday || 7;
      }

      const nextSundayMidnight = new Date(now);
      nextSundayMidnight.setDate(now.getDate() + daysToSunday);
      nextSundayMidnight.setHours(24, 0, 0, 0);

      const toSave = {
        value,
        nextReset: nextSundayMidnight.getTime(),
      };
      localStorage.setItem(key, serializer(toSave));
      console.log(
        `DEBUG: Next reset ${key}: ${nextSundayMidnight.toLocaleString(
          "pl-PL"
        )} (days: ${daysToSunday})`
      );
    },
    []
  );

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
  const logWorkout = useCallback(({ name, time, calories, icon }) => {
    const newWorkout = {
      id: Date.now(),
      name: name || "Workout",
      time: new Date().toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      calories: calories || 0,
      icon: icon,
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
  }, []);

  const addCalories = useCallback((calories) => {
    setAllCalories((prev) => {
      const newTotal = (prev || 0) + Number(calories);
      saveWithWeeklyReset("totalCalories", newTotal.toString());
      return newTotal;
    });
  }, []);

  const addTime = useCallback((seconds) => {
    setAllSeconds((prev) => {
      const newTotal = prev + Number(seconds * 60);
      localStorage.setItem("totalTime", newTotal.toString());
      return newTotal;
    });
  }, []);

  const logCustomActivity = useCallback((data) => {
    const newQuick = { id: Date.now(), ...data };
    setQuickActivities((prev) => {
      const updated = [
        newQuick,
        ...prev.filter((q) => q.name !== data.name),
      ].slice(0, 5);
      localStorage.setItem("quickActivities", JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    const loadWithWeeklyReset = (key, setter, parser, defaultValue = null) => {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const data = JSON.parse(saved);
          const now = new Date().getTime();
          if (data.nextReset && now >= data.nextReset) {
            console.log(`DEBUG: Weekly reset: ${key}`);
            localStorage.removeItem(key);
            setter(defaultValue);
            return;
          }
          setter(parser(data.value));
        } else {
          setter(defaultValue);
        }
      } catch (e) {
        console.log(`Load error ${key}:`, e);
        setter(defaultValue);
      }
    };
    loadWithWeeklyReset(
      "totalCalories",
      setAllCalories,
      (v) => parseInt(v) || 0,
      0
    );
    loadWithWeeklyReset(
      "workoutsDone",
      setWorkoutsDone,
      (v) => parseInt(v) || 0,
      0
    );
    loadWithWeeklyReset(
      "allSeconds",
      setAllSeconds,
      (v) => parseInt(v) || 0,
      0
    );
    loadWithWeeklyReset(
      "dailyWorkoutMinutes",
      setDailyWorkoutMinutes,
      JSON.parse,
      {}
    );

    loadWithWeeklyReset(
      "quickActivities",
      setQuickActivities,
      (data) => (Array.isArray(data?.value) ? data.value : []),
      []
    );

    const savedHistory = localStorage.getItem("fitnessWorkouts");
    if (savedHistory) setActivityHistory(JSON.parse(savedHistory));

    const savedCalories = localStorage.getItem("totalCalories");
    if (savedCalories) setAllCalories(parseInt(savedCalories) || 0);
  }, []);

  useEffect(() => {
    if (workoutsDone !== null) {
      saveWithWeeklyReset("workoutsDone", workoutsDone.toString());
    }
  }, [workoutsDone, saveWithWeeklyReset]);

  useEffect(() => {
    if (allSeconds !== null) {
      saveWithWeeklyReset("allSeconds", allSeconds.toString());
      console.log("SAVE workoutsSEC ==", allSeconds);
    }
  }, [allSeconds, saveWithWeeklyReset]);

  useEffect(() => {
    saveWithWeeklyReset("dailyWorkoutMinutes", dailyWorkoutMinutes);
  }, [dailyWorkoutMinutes, saveWithWeeklyReset]);

  useEffect(() => {
    const loadDailyWorkout = () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const savedHistory = localStorage.getItem("fitnessWorkouts");

      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          if (parsedHistory[0]?.date !== today) {
            localStorage.removeItem("fitnessWorkouts");
            setActivityHistory([]);
          }
        } catch (e) {
          console.log("History parse error:", e);
        }
      }

      const saved = localStorage.getItem("dailyWorkout");
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed?.date !== today) {
        const randomWorkout =
          allWorkouts[Math.floor(Math.random() * allWorkouts.length)];
        const toSave = { workout: randomWorkout, date: today };
        localStorage.setItem("dailyWorkout", JSON.stringify(toSave));
        setCurrentWorkout(randomWorkout);
      } else {
        setCurrentWorkout(parsed.workout);
      }
      setTodayKey(today);
    };

    loadDailyWorkout();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeout = midnight.getTime() - Date.now();
    const timer = setTimeout(loadDailyWorkout, timeout);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dailyWorkoutMinutes");
      console.log("LOAD RAW dailyWorkoutMinutes:", saved);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log("LOAD PARSED dailyWorkoutMinutes:", parsed);
        setDailyWorkoutMinutes(parsed);
      }
    } catch (e) {
      console.log("LOAD dailyWorkoutMinutes error:", e);
    }
  }, []);

  const waterProgressWidth = ((currentHydration / hydrationGoal) * 100).toFixed(
    1
  );
  const workoutProgressWidth = ((workoutsDone / workoutGoal) * 100).toFixed(1);
  return (
    <DashboardContext.Provider
      value={{
        //switching
        selectedWidget,
        switchWidget: switchWidget,
        goToDashboard,
        goToWater,
        goToFood,
        goToWorkouts,
        goToSleep,
        goToProfile,
        goToSettings,
        //workout
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
        dailyWorkoutMinutes,
        setDailyWorkoutMinutes,
        quickActivities,
        setQuickActivities,
        logCustomActivity,
        setAllCalories,
        allCalories,
        addCalories,
        addTime,
        currentWorkout,
        todayKey,
        //water
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
