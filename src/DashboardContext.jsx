import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import profilePic from "./assets/BigProfilePic.png";

const DashboardContext = createContext();

export class Meal {
  constructor(name, grammage, calories, protein, fats, carbs) {
    this.name = name;
    this.grammage = grammage;
    this.calories = calories;
    this.protein = protein;
    this.fats = fats;
    this.carbs = carbs;
  }
}

export const DashboardProvider = ({ children }) => {
  //Welcome popup
  const [showWelcomePopup, setShowWelcomePopup] = useState(() => {
    const saved = localStorage.getItem("showWelcomePopup");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [currentHeight, setCurrentHeight] = useState(() => {
    const saved = localStorage.getItem("currentHeight");
    return saved !== null ? JSON.parse(saved) : null;
  });

  const [currentAge, setCurrentAge] = useState(() => {
    const saved = localStorage.getItem("currentAge");
    return saved !== null ? JSON.parse(saved) : null;
  });

  const [sleepTimeInput, setSleepTimeInput] = useState(() => {
    const saved = localStorage.getItem("sleepTimeInput");
    return saved !== null ? JSON.parse(saved) : 240;
  });

  const [sleepTime, setSleepTime] = useState(() => {
    const saved = localStorage.getItem("sleepTime");
    return saved !== null ? JSON.parse(saved) : [0, 0];
  });

  const [caloriesGoal, setCaloriesGoal] = useState(() => {
    const saved = localStorage.getItem("caloriesGoal");
    return saved !== null ? JSON.parse(saved) : 1000;
  });

  const [dailyActivity, setDailyActivity] = useState(() => {
    const saved = localStorage.getItem("dailyActivity");
    return saved !== null ? JSON.parse(saved) : 10;
  });

  const [weeklyWorkouts, setWeeklyWorkouts] = useState(() => {
    const saved = localStorage.getItem("weeklyWorkouts");
    return saved !== null ? JSON.parse(saved) : 1;
  });

  const [currentWeight, setCurrentWeight] = useState(() => {
    const saved = localStorage.getItem("currentWeight");
    return saved !== null ? JSON.parse(saved) : null;
  });

  const [goalWeight, setGoalWeight] = useState(() => {
    const saved = localStorage.getItem("goalWeight");
    return saved !== null ? JSON.parse(saved) : null;
  });

  const [hydrationGoal, setHydrationGoal] = useState(() => {
    const saved = localStorage.getItem("hydrationGoal");
    return saved !== null ? JSON.parse(saved) : 2;
  });

  const [gender, setGender] = useState(() => {
    const saved = localStorage.getItem("gender");
    return saved !== null ? JSON.parse(saved) : "";
  });

  useEffect(() => {
    localStorage.setItem("gender", JSON.stringify(gender));
  }, [gender]);

  useEffect(() => {
    localStorage.setItem("currentHeight", JSON.stringify(currentHeight));
  }, [currentHeight]);

  useEffect(() => {
    localStorage.setItem("currentAge", JSON.stringify(currentAge));
  }, [currentAge]);

  useEffect(() => {
    localStorage.setItem("showWelcomePopup", JSON.stringify(showWelcomePopup));
  }, [showWelcomePopup]);

  useEffect(() => {
    localStorage.setItem("sleepTimeInput", JSON.stringify(sleepTimeInput));
  }, [sleepTimeInput]);

  useEffect(() => {
    localStorage.setItem("sleepTime", JSON.stringify(sleepTime));
  }, [sleepTime]);

  useEffect(() => {
    localStorage.setItem("caloriesGoal", JSON.stringify(caloriesGoal));
  }, [caloriesGoal]);

  useEffect(() => {
    localStorage.setItem("dailyActivity", JSON.stringify(dailyActivity));
  }, [dailyActivity]);

  useEffect(() => {
    localStorage.setItem("weeklyWorkouts", JSON.stringify(weeklyWorkouts));
  }, [weeklyWorkouts]);

  useEffect(() => {
    localStorage.setItem("currentWeight", JSON.stringify(currentWeight));
  }, [currentWeight]);

  useEffect(() => {
    localStorage.setItem("goalWeight", JSON.stringify(goalWeight));
  }, [goalWeight]);

  useEffect(() => {
    localStorage.setItem("hydrationGoal", JSON.stringify(hydrationGoal));
  }, [hydrationGoal]);

  useEffect(() => {
    if (currentWeight !== null && currentHeight !== null && gender !== null) {
      setShowWelcomePopup(false);
    } else {
      setShowWelcomePopup(true);
    }
  }, []);

  //page Switching
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
  const goToSettings = useCallback(() => setSelectedWidget("settings"), []);

  const getListFromStorage = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  //food
  const EMPTYFOODWEEK = [0, 0, 0, 0, 0, 0, 0];
  const [weekFood, setWeekFood] = useState(EMPTYFOODWEEK);
  //workout Section
  const [activityHistory, setActivityHistory] = useState([]);
  const [workoutsDone, setWorkoutsDone] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(null);
  const [allSeconds, setAllSeconds] = useState(null);
  const [workoutStatus, setWorkoutStatus] = useState("idle");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isChecked, setIsChecked] = useState(Array(6).fill(false));
  const [quickActivities, setQuickActivities] = useState([]);
  const [allCalories, setAllCalories] = useState(null);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [todayKey, setTodayKey] = useState("");
  const EMPTYWORKOUTWEEK = [0, 0, 0, 0, 0, 0, 0];
  const [weekMinutes, setWeekMinutes] = useState(EMPTYWORKOUTWEEK);

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
      { id: "w5-3", name: "Dumbbell rows - 3x10" },
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
  const [currentHydration, setCurrentHydration] = useState(() => {
    try {
      let data = localStorage.getItem("currentHydration");
      return data ? parseFloat(data) : 0.0;
    } catch {
      return 0.0;
    }
  });
  const [waterLog, setWaterLog] = useState(() =>
    getListFromStorage("waterLog")
  );
  useEffect(() => {
    localStorage.setItem("waterLog", JSON.stringify(waterLog));
  }, [waterLog]);

  useEffect(() => {
    localStorage.setItem("currentHydration", currentHydration);
  }, [currentHydration]);

  const waterProgressWidth = ((currentHydration / hydrationGoal) * 100).toFixed(
    1
  );

  //sleep Section
  const [inBedTime, setInBedTime] = useState("");
  const [outOfBedTime, setOutOfBedTime] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [score, setScore] = useState(0);
  const [sleepGoal, setSleepGoal] = useState([8, 0]);
  const [lastNightSleep, setLastNightSleep] = useState([0, 0]);
  const [sleepHistory, setSleepHistory] = useState([]);
  const [profileInBedTime, setProfileInBedTime] = useState("");
  const [profileOutOfBedTime, setProfileOutOfBedTime] = useState("");
  const [profileSleepQuality, setProfileSleepQuality] = useState(null);
  const EMPTYSLEEPWEEK = [0, 0, 0, 0, 0, 0, 0];
  const [sleepWeekMinutes, setSleepWeekMinutes] = useState(EMPTYSLEEPWEEK);

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

  const addWorkoutMinutes = useCallback((minutes) => {
    setWeekMinutes((prev) => {
      const now = new Date();
      let dayIndex = now.getDay();
      dayIndex = (dayIndex + 6) % 7;

      const copy = [...prev];
      copy[dayIndex] += Number(minutes);
      return copy;
    });
  }, []);

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

  const logCustomActivity = useCallback(
    (data) => {
      const durationVal = data.duration || data.time || 0;

      const newQuick = {
        id: Date.now(),
        ...data,
        time: durationVal,
        duration: durationVal,
      };
      if (durationVal > 0) {
        addWorkoutMinutes(durationVal);
      }
      setQuickActivities((prev) => {
        const updated = [
          newQuick,
          ...prev.filter((q) => q.name !== data.name),
        ].slice(0, 5);
        localStorage.setItem("quickActivities", JSON.stringify(updated));
        return updated;
      });
    },
    [addWorkoutMinutes]
  );

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
      "quickActivities",
      setQuickActivities,
      (data) => (Array.isArray(data?.value) ? data.value : []),
      []
    );

    loadWithWeeklyReset(
      "weekMinutes",
      setWeekMinutes,
      (v) => (Array.isArray(v) ? v : EMPTYWORKOUTWEEK),
      EMPTYWORKOUTWEEK
    );

    loadWithWeeklyReset(
      "weekSleepMinutes",
      setSleepWeekMinutes,
      (v) => (Array.isArray(v) ? v : EMPTYSLEEPWEEK),
      EMPTYSLEEPWEEK
    );

    loadWithWeeklyReset(
      "weekFood",
      setWeekFood,
      (v) => (Array.isArray(v) ? v : EMPTYFOODWEEK),
      EMPTYFOODWEEK
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
    saveWithWeeklyReset("weekMinutes", weekMinutes);
  }, [weekMinutes, saveWithWeeklyReset]);

  useEffect(() => {
    saveWithWeeklyReset("weekFood", weekFood);
  }, [weekFood, saveWithWeeklyReset]);

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

  const workoutProgressWidth = ((workoutsDone / weeklyWorkouts) * 100).toFixed(
    1
  );

  //food
  const addFood = useCallback((calories) => {
    setWeekFood((prev) => {
      const now = new Date();
      let dayIndex = now.getDay();
      dayIndex = (dayIndex + 6) % 7;

      const copy = [...prev];
      copy[dayIndex] += Number(calories);
      return copy;
    });
  }, []);

  const [breakfastList, setBreakfastList] = useState(() =>
    getListFromStorage("breakfastList")
  );
  const [lunchList, setLunchList] = useState(() =>
    getListFromStorage("lunchList")
  );
  const [snacksList, setSnacksList] = useState(() =>
    getListFromStorage("snacksList")
  );
  const [dinnerList, setDinnerList] = useState(() =>
    getListFromStorage("dinnerList")
  );
  const [caloriesCount, setCaloriesCount] = useState(0);
  const [fatsCount, setFatsCount] = useState(0);
  const [proteinCount, setProteinCount] = useState(0);
  const [carbsCount, setCarbsCount] = useState(0);

  useEffect(() => {
    localStorage.setItem("breakfastList", JSON.stringify(breakfastList));
  }, [breakfastList]);

  useEffect(() => {
    localStorage.setItem("lunchList", JSON.stringify(lunchList));
  }, [lunchList]);

  useEffect(() => {
    localStorage.setItem("snacksList", JSON.stringify(snacksList));
  }, [snacksList]);

  useEffect(() => {
    localStorage.setItem("dinnerList", JSON.stringify(dinnerList));
  }, [dinnerList]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = localStorage.getItem("lastDate");

    if (lastDate !== today) {
      setBreakfastList([]);
      setLunchList([]);
      setSnacksList([]);
      setDinnerList([]);
      setWaterLog([]);
      setCurrentHydration(0);

      localStorage.setItem("lastDate", today);
    }
  }, []);

  const countCalories = (list) => {
    let calories = 0;
    list.map((meal) => {
      calories += meal.calories;
    });
    return calories;
  };
  const countAllCalories = () => {
    return (
      countCalories(breakfastList) +
      countCalories(lunchList) +
      countCalories(dinnerList) +
      countCalories(snacksList)
    );
  };
  const countAllProtein = () => {
    let protein = 0;
    breakfastList.map((meal) => {
      protein += meal.protein;
    });
    lunchList.map((meal) => {
      protein += meal.protein;
    });
    snacksList.map((meal) => {
      protein += meal.protein;
    });
    dinnerList.map((meal) => {
      protein += meal.protein;
    });
    return protein;
  };
  const countAllFats = () => {
    let fats = 0;
    breakfastList.map((meal) => {
      fats += meal.fats;
    });
    lunchList.map((meal) => {
      fats += meal.fats;
    });
    snacksList.map((meal) => {
      fats += meal.fats;
    });
    dinnerList.map((meal) => {
      fats += meal.fats;
    });
    return fats;
  };
  const countAllCarbs = () => {
    let carbs = 0;
    breakfastList.map((meal) => {
      carbs += meal.carbs;
    });
    lunchList.map((meal) => {
      carbs += meal.carbs;
    });
    snacksList.map((meal) => {
      carbs += meal.carbs;
    });
    dinnerList.map((meal) => {
      carbs += meal.carbs;
    });
    return carbs;
  };
  useEffect(() => {
    setCaloriesCount(countAllCalories);
    setFatsCount(countAllFats);
    setProteinCount(countAllProtein);
    setCarbsCount(countAllCarbs);
  }, [breakfastList, lunchList, dinnerList, snacksList]);

  const addMealsToList = (setList, meal) => {
    addFood(meal.calories);
    setList((prev) => [...prev, meal]);
  };

  //sleep
  const addSleepMinutes = useCallback((minutes) => {
    setSleepWeekMinutes((prev) => {
      const now = new Date();
      let dayIndex = now.getDay();
      dayIndex = (dayIndex + 6) % 7;

      const copy = [...prev];
      copy[dayIndex] = Number(minutes);
      return copy;
    });
  }, []);
  useEffect(() => {
    saveWithWeeklyReset("weekSleepMinutes", sleepWeekMinutes);
  }, [sleepWeekMinutes, saveWithWeeklyReset]);
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const logSleep = useCallback(() => {
    const bedMinutes = timeToMinutes(inBedTime);
    const outMinutes = timeToMinutes(outOfBedTime);

    let sleepMinutes;
    if (outMinutes > bedMinutes) {
      sleepMinutes = outMinutes - bedMinutes;
    } else {
      sleepMinutes = outMinutes + 24 * 60 - bedMinutes;
    }
    const sleepHours = Math.floor(sleepMinutes / 60);
    const sleepMins = sleepMinutes % 60;
    setLastNightSleep([sleepHours, sleepMins]);
    const goalHours = sleepGoal[0] + sleepGoal[1] / 60;
    const durationPct = Math.min(
      ((sleepHours + sleepMins / 60) / goalHours) * 100,
      100
    );
    const qualityNum =
      sleepQuality === "poor"
        ? 1
        : sleepQuality === "average"
        ? 2
        : sleepQuality === "good"
        ? 3
        : sleepQuality === "excellent"
        ? 4
        : 2;
    const qualityPct = ((qualityNum - 1) / 3) * 100;
    const sleepScore = Math.round(0.7 * durationPct + 0.3 * qualityPct);
    console.log(sleepScore);

    addSleepMinutes(sleepMinutes);
    const sleepData = {
      inBedTime,
      outOfBedTime,
      sleepQuality,
      date: new Date().toISOString().split("T")[0],
      sleepHours,
      sleepMins,
      score: sleepScore,
    };
    setProfileInBedTime(inBedTime);
    setProfileOutOfBedTime(outOfBedTime);
    setScore(sleepScore);
    setSleepHistory((prev) => {
      const updated = [sleepData, ...prev.slice(0)];
      try {
        localStorage.setItem("sleepHistory", JSON.stringify(updated));
        console.log(`Saved SLEEP:`, updated);
      } catch (e) {
        console.log("SAVE ERROR:", e);
      }
      setInBedTime("");
      setOutOfBedTime("");
      setSleepQuality("");
      return updated;
    });
  }, [inBedTime, outOfBedTime, sleepQuality, sleepGoal, addSleepMinutes]);

  useEffect(() => {
    try {
      const history = localStorage.getItem("sleepHistory");
      if (history) {
        const parsed = JSON.parse(history);
        setSleepHistory(parsed);

        const today = new Date().toISOString().split("T")[0];
        const todayEntry = parsed.find((entry) => entry.date === today);
        if (todayEntry) {
          setProfileInBedTime(todayEntry.inBedTime);
          setProfileOutOfBedTime(todayEntry.outOfBedTime);
          setProfileSleepQuality(todayEntry.sleepQuality);
          setLastNightSleep([todayEntry.sleepHours, todayEntry.sleepMins]);
          setScore(todayEntry.score);
        }
      }
    } catch (e) {
      console.log("LOAD ERROR:", e);
    }
  }, []);

  const getSleepComparison = useCallback(() => {
    if (sleepHistory.length < 2) {
      return null;
    }
    const sorted = [...sleepHistory].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const today = sorted[0];
    const yesterday = sorted[1];

    const todayMinutes = today.sleepHours * 60 + today.sleepMins;
    const yesterdayMinutes = yesterday.sleepHours * 60 + yesterday.sleepMins;

    const diffMinutes = todayMinutes - yesterdayMinutes;

    const percentChange =
      yesterdayMinutes > 0
        ? ((diffMinutes / yesterdayMinutes) * 100).toFixed(1)
        : 0;
    return {
      todayMinutes,
      yesterdayMinutes,
      diffMinutes,
      percentChange: parseFloat(percentChange),
      isIncrease: diffMinutes > 0,
    };
  }, [sleepHistory]);

  //profile picture
  const [profileImage, setProfileImage] = useState(profilePic);

  useEffect(() => {
  const savedImage = localStorage.getItem("profileImage");

  if (savedImage) {
    setProfileImage(savedImage);
  }
}, []);

  const saveNewProfileImage = (newImageFile) =>{
    const reader = new FileReader();

    reader.onload = () => {
      localStorage.setItem("profileImage", reader.result);
      setProfileImage(reader.result);
    };

    reader.readAsDataURL(newImageFile);
  }


  return (
    <DashboardContext.Provider
      value={{
        //Welcome popup
        sleepTimeInput,
        setSleepTimeInput,
        sleepTime,
        setSleepTime,
        caloriesGoal,
        setCaloriesGoal,
        dailyActivity,
        setDailyActivity,
        weeklyWorkouts,
        setWeeklyWorkouts,
        currentWeight,
        setCurrentWeight,
        goalWeight,
        setGoalWeight,
        gender,
        setGender,
        currentHeight,
        setCurrentHeight,
        currentAge,
        setCurrentAge,
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
        activityHistory,
        setActivityHistory,
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
        weekMinutes,
        setWeekMinutes,
        addWorkoutMinutes,
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
        waterLog,
        setWaterLog,
        //food
        breakfastList,
        setBreakfastList,
        lunchList,
        setLunchList,
        snacksList,
        setSnacksList,
        dinnerList,
        setDinnerList,
        addMealsToList,
        countAllCalories,
        caloriesCount,
        fatsCount,
        proteinCount,
        carbsCount,
        countCalories,
        weekFood,
        setWeekFood,
        //sleep
        inBedTime,
        setInBedTime,
        outOfBedTime,
        setOutOfBedTime,
        score,
        setScore,
        sleepQuality,
        setSleepQuality,
        sleepGoal,
        setSleepGoal,
        lastNightSleep,
        setLastNightSleep,
        logSleep,
        setProfileInBedTime,
        profileInBedTime,
        profileOutOfBedTime,
        setProfileOutOfBedTime,
        profileSleepQuality,
        setProfileSleepQuality,
        sleepWeekMinutes,
        setSleepWeekMinutes,
        addSleepMinutes,
        getSleepComparison,
        showWelcomePopup,
        setShowWelcomePopup,
        //profilePic
        profileImage,
        saveNewProfileImage
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
