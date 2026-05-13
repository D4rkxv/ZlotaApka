import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import profilePic from "./assets/BigProfilePic.png";
import { AuthContext, api } from "./AuthContext.jsx";
import { useLanguage } from "./LanguageContext.jsx";
import { getLocalDateString } from "./utils/date.js";

const DashboardContext = createContext();

export class Meal {
  constructor(food_name, grammage, calories, protein, fats, carbs) {
    this.food_name = food_name;
    this.grammage = grammage;
    this.calories = calories;
    this.protein = protein;
    this.fats = fats;
    this.carbs = carbs;
  }
}

export const DashboardProvider = ({ children }) => {
  const { userProfile, updateUserProfile, token } = useContext(AuthContext);
  const { t } = useLanguage();

  const getCurrentWeekKey = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(now.getDate() - daysFromMonday);
    return getLocalDateString(monday);
  };

  //Welcome popup
  const [isChecked2, setIsChecked2] = useState(Array(6).fill(false));
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [currentHeight, setCurrentHeight] = useState(null);
  const [currentAge, setCurrentAge] = useState(null);
  const [sleepTimeInput, setSleepTimeInput] = useState(240);
  const [sleepTime, setSleepTime] = useState([0, 0]);
  const [caloriesGoal, setCaloriesGoal] = useState(1000);
  const [dailyActivity, setDailyActivity] = useState(50);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(1);
  const [currentWeight, setCurrentWeight] = useState(null);
  const [goalWeight, setGoalWeight] = useState(null);
  const [hydrationGoal, setHydrationGoal] = useState(2);
  const [gender, setGender] = useState("");

  const saveProfileData = useCallback(async () => {
    const profileData = {
      current_weight: currentWeight,
      goal_weight: goalWeight,
      gender: gender,
      current_height: currentHeight,
      current_age: currentAge,
      hydration_goal: hydrationGoal,
      calories_goal: caloriesGoal,
      sleep_goal_hours: sleepTime[0],
      sleep_goal_minutes: sleepTime[1],
      daily_activity: dailyActivity,
      weekly_workouts: weeklyWorkouts,
      onboarding_completed: 1,
    };

    console.log("Saving profile data:", profileData);
    const result = await updateUserProfile(profileData);

    if (result.success) {
      console.log("Profile data saved successfully");
      return { success: true };
    } else {
      console.error("Error saving profile data:", result.message);
      return { success: false, error: result.error };
    }
  }, [
    currentWeight,
    goalWeight,
    gender,
    currentHeight,
    currentAge,
    hydrationGoal,
    caloriesGoal,
    sleepTime,
    dailyActivity,
    weeklyWorkouts,
    updateUserProfile,
  ]);

  useEffect(() => {
    if (userProfile) {
      console.log("Synchronizing with backend profile:", userProfile);

      if (
        userProfile.current_weight !== null &&
        userProfile.current_weight !== undefined
      ) {
        setCurrentWeight(userProfile.current_weight);
      }
      if (
        userProfile.goal_weight !== null &&
        userProfile.goal_weight !== undefined
      ) {
        setGoalWeight(userProfile.goal_weight);
      }
      if (userProfile.gender) {
        setGender(userProfile.gender);
      }
      if (
        userProfile.current_height !== null &&
        userProfile.current_height !== undefined
      ) {
        setCurrentHeight(userProfile.current_height);
      }
      if (
        userProfile.current_age !== null &&
        userProfile.current_age !== undefined
      ) {
        setCurrentAge(userProfile.current_age);
      }
      if (
        userProfile.hydration_goal !== null &&
        userProfile.hydration_goal !== undefined
      ) {
        setHydrationGoal(userProfile.hydration_goal);
      }
      if (
        userProfile.calories_goal !== null &&
        userProfile.calories_goal !== undefined
      ) {
        setCaloriesGoal(userProfile.calories_goal);
      }
      if (
        userProfile.sleep_goal_hours !== null &&
        userProfile.sleep_goal_hours !== undefined
      ) {
        setSleepTime([
          userProfile.sleep_goal_hours,
          userProfile.sleep_goal_minutes || 0,
        ]);
        setSleepTimeInput(
          userProfile.sleep_goal_hours * 60 +
            (userProfile.sleep_goal_minutes || 0),
        );
      }
      if (
        userProfile.daily_activity !== null &&
        userProfile.daily_activity !== undefined
      ) {
        setDailyActivity(userProfile.daily_activity);
      }
      if (
        userProfile.weekly_workouts !== null &&
        userProfile.weekly_workouts !== undefined
      ) {
        setWeeklyWorkouts(userProfile.weekly_workouts);
      }

      if (userProfile.onboarding_completed === 1) {
        setShowWelcomePopup(false);
      } else {
        setShowWelcomePopup(true);
      }
    }
  }, [userProfile]);

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
  const goToHelp = useCallback(() => setSelectedWidget("help"), []);

  const getListFromStorage = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

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
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [todayKey, setTodayKey] = useState("");
  const EMPTYWORKOUTWEEK = [0, 0, 0, 0, 0, 0, 0];
  const [weekMinutes, setWeekMinutes] = useState(EMPTYWORKOUTWEEK);

  const fetchWorkoutData = useCallback(async () => {
    try {
      if (!token) return;
      const today = getLocalDateString();

      const response = await api.get(`/workouts?date=${today}&limit=1000`);
      if (response.data.status === "success") {
        const workouts = response.data.data;
        setActivityHistory(workouts);
      }

      const statsResponse = await api.get("/workouts/stats");
      if (statsResponse.data.status === "success") {
        const { weekly } = statsResponse.data.data;

        const orderedWeek = [0, 0, 0, 0, 0, 0, 0];

        let totalWeekMinutes = 0;
        let totalWeekCalories = 0;
        let totalWeekCount = 0;

        weekly.forEach((dayData) => {
          const date = new Date(dayData.date);
          const dayIndex = date.getDay();
          const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
          orderedWeek[mappedIndex] = dayData.minutes;
          totalWeekMinutes += dayData.minutes;
          totalWeekCalories += dayData.calories;
          totalWeekCount += dayData.count;
        });
        setWeekMinutes(orderedWeek);
        setAllSeconds(totalWeekMinutes * 60);
        setAllCalories(totalWeekCalories);
        setWorkoutsDone(totalWeekCount);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  }, [token]);

  const allWorkouts = t.allWorkouts;

  const dailyChallenges = t.challenges;

  //water Section backend
  const [currentHydration, setCurrentHydration] = useState(0);
  const [waterLog, setWaterLog] = useState([]);
  const [water12Day, setWater12Day] = useState(Array(12).fill(0));
  const [waterWeek, setWaterWeek] = useState(Array(7).fill(0));

  const [cycleStart, setCycleStart] = useState(null);

  const fetchWaterData = async () => {
    if (!token) return;

    try {
      const currentDate = getLocalDateString();

      const logsResponse = await api.get(
        `/water?date=${currentDate}&limit=1000`,
      );
      if (logsResponse.data.status === "success") {
        const logs = logsResponse.data.data;
        setWaterLog(
          logs.map((log) => ({
            id: log.id,
            amount: log.amount,
            time: log.time,
          })),
        );

        const total = logs.reduce((sum, log) => sum + log.amount, 0);
        setCurrentHydration(total);
      }

      const today = getLocalDateString();
      const statsResponse = await api.get(`/water/stats?currentDate=${today}`);
      if (statsResponse.data.status === "success") {
        const { weekly, twelve_day, cycle_start } = statsResponse.data.data;

        setCycleStart(cycle_start);
        setWaterWeek(weekly.map((d) => d.amount));
        setWater12Day(twelve_day.map((d) => d.amount));
      }
    } catch (error) {
      console.error("Error fetching water data:", error);
    }
  };

  const addWater = async (amount) => {
    try {
      const newEntry = {
        amount: amount,
        date: getLocalDateString(),
        time: new Date().toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const response = await api.post("/water", newEntry);
      if (response.data.status === "success") {
        await fetchWaterData();
      }
    } catch (error) {
      console.error("Error adding water:", error);
    }
  };
  const deleteWaterEntry = async (index) => {
    try {
      const entry = waterLog[index];
      if (!entry || !entry.id) {
        console.error("Entry not found or missing ID");
        return;
      }

      await api.delete(`/water/${entry.id}`);
      await fetchWaterData();
    } catch (error) {
      console.error("Error deleting water entry:", error);
    }
  };

  const waterProgressWidth = ((currentHydration / hydrationGoal) * 100).toFixed(
    1,
  );

  //sleep Section
  const [inBedTime, setInBedTime] = useState("");
  const [outOfBedTime, setOutOfBedTime] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [score, setScore] = useState(0);
  const [sleepGoal, setSleepGoal] = useState([8, 0]);
  const [lastNightSleep, setLastNightSleep] = useState([0, 0]);
  const [todaySleep, setTodaySleep] = useState(null);
  const [sleepWeekData, setSleepWeekData] = useState(
    Array(7).fill({ hours: 0, score: 0, quality: null }),
  );
  const [profileInBedTime, setProfileInBedTime] = useState("");
  const [profileOutOfBedTime, setProfileOutOfBedTime] = useState("");
  const [profileSleepQuality, setProfileSleepQuality] = useState(null);
  const EMPTYSLEEPWEEK = [0, 0, 0, 0, 0, 0, 0];
  const [sleepWeekMinutes, setSleepWeekMinutes] = useState(EMPTYSLEEPWEEK);
  const [weightWeekData, setWeightWeekData] = useState([]);

  const fetchWeightData = useCallback(async () => {
    if (!token) return;
    try {
      const statsResponse = await api.get("/weight/stats");
      if (statsResponse.data.status === "success") {
        const { weekly } = statsResponse.data.data;
        setWeightWeekData(weekly);
      }
    } catch (error) {
      console.error("Error fetching weight data:", error);
    }
  }, [token]);

  const getWeightComparison = useCallback(() => {
    if (!weightWeekData || weightWeekData.length < 2) return null;

    const daysWithData = weightWeekData.filter((day) => day.weight > 0);
    if (daysWithData.length < 2) return null;

    const sorted = [...daysWithData].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    const today = sorted[0];
    const yesterday = sorted[1];

    const diffWeight = today.weight - yesterday.weight;
    const percentChange =
      yesterday.weight > 0
        ? ((diffWeight / yesterday.weight) * 100).toFixed(1)
        : 0;

    return {
      todayWeight: today.weight,
      yesterdayWeight: yesterday.weight,
      diffWeight,
      percentChange: parseFloat(percentChange),
      isIncrease: diffWeight > 0,
    };
  }, [weightWeekData]);

  const fetchSleepData = useCallback(async () => {
    if (!token) return;

    try {
      const today = getLocalDateString();

      const statsResponse = await api.get("/sleep/stats");
      if (statsResponse.data.status === "success") {
        const { today: todayData, weekly } = statsResponse.data.data;

        setTodaySleep(todayData);
        setSleepWeekData(weekly);

        if (todayData) {
          setProfileInBedTime(todayData.in_bed_time);
          setProfileOutOfBedTime(todayData.out_of_bed_time);
          setInBedTime(todayData.in_bed_time || "");
          setOutOfBedTime(todayData.out_of_bed_time || "");
          setProfileSleepQuality(todayData.sleep_quality);
          setSleepQuality(todayData.sleep_quality || "");
          setScore(todayData.sleep_score || 0);
          setLastNightSleep([
            Math.floor(todayData.duration_hours || 0),
            Math.round(((todayData.duration_hours || 0) % 1) * 60),
          ]);
        }

        const weekMinutes = weekly.map((day) => (day.hours || 0) * 60);
        setSleepWeekMinutes(weekMinutes);
      }
    } catch (error) {
      console.error("Error fetching sleep data:", error);
    }
  }, [token]);

  const logSleep = useCallback(async () => {
    if (!inBedTime || !outOfBedTime || !sleepQuality) {
      console.error("All fields are required");
      return { success: false, message: "All fields are required" };
    }

    try {
      const payload = {
        in_bed_time: inBedTime,
        out_of_bed_time: outOfBedTime,
        sleep_quality: sleepQuality,
        date: getLocalDateString(),
      };

      const response = await api.post("/sleep", payload);

      if (response.data.status === "success") {
        await fetchSleepData();
        return { success: true };
      }
    } catch (error) {
      console.error("Error logging sleep:", error);
      return { success: false, error };
    }
  }, [inBedTime, outOfBedTime, sleepQuality, fetchSleepData]);

  const getSleepComparison = useCallback(() => {
    if (!sleepWeekData || sleepWeekData.length < 2) {
      return null;
    }

    const daysWithData = sleepWeekData.filter((day) => day.hours > 0);

    if (daysWithData.length < 2) {
      return null;
    }

    const sorted = [...daysWithData].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    const today = sorted[0];
    const yesterday = sorted[1];

    const todayMinutes = (today.hours || 0) * 60;
    const yesterdayMinutes = (yesterday.hours || 0) * 60;

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
  }, [sleepWeekData]);

  //workout

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
    },
    [],
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

  const logWorkout = useCallback(
    async (workoutData) => {
      try {
        const payload = {
          activity_type: workoutData.type || "strength_training",
          activity_name: workoutData.name || currentWorkout?.name || "Workout", // ← zmiana
          duration_minutes: workoutData.time || Math.floor(seconds / 60),
          calories_burned: workoutData.calories || 0,
          date: getLocalDateString(),
        };

        const response = await api.post("/workouts", payload);

        if (response.data.status === "success") {
          await fetchWorkoutData();
          return { success: true };
        }
      } catch (error) {
        console.error("Error logging workout:", error);
        return { success: false };
      }
    },
    [seconds, fetchWorkoutData],
  );

  const addCalories = useCallback(
    (calories) => {
      setAllCalories((prev) => {
        const newTotal = (prev || 0) + Number(calories);
        saveWithWeeklyReset("totalCalories", newTotal.toString());
        return newTotal;
      });
    },
    [saveWithWeeklyReset],
  );

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
    [addWorkoutMinutes],
  );

  useEffect(() => {
    const loadWithWeeklyReset = (key, setter, parser, defaultValue = null) => {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const data = JSON.parse(saved);
          const now = new Date().getTime();
          if (data.nextReset && now >= data.nextReset) {
            localStorage.removeItem(key);
            setter(defaultValue);
            return;
          }
          setter(parser(data.value));
        } else {
          setter(defaultValue);
        }
      } catch (e) {
        setter(defaultValue);
      }
    };

    loadWithWeeklyReset(
      "totalCalories",
      setAllCalories,
      (v) => parseInt(v) || 0,
      0,
    );

    loadWithWeeklyReset(
      "workoutsDone",
      setWorkoutsDone,
      (v) => parseInt(v) || 0,
      0,
    );

    loadWithWeeklyReset(
      "allSeconds",
      setAllSeconds,
      (v) => parseInt(v) || 0,
      0,
    );

    loadWithWeeklyReset(
      "quickActivities",
      setQuickActivities,
      (data) => (Array.isArray(data?.value) ? data.value : []),
      [],
    );

    const savedHistory = localStorage.getItem("fitnessWorkouts");
    if (savedHistory) setActivityHistory(JSON.parse(savedHistory));

    const savedChallenge = localStorage.getItem("fitnessChallenge");
    if (savedChallenge) setActivityHistory(JSON.parse(savedChallenge));

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
    }
  }, [allSeconds, saveWithWeeklyReset]);

  useEffect(() => {
    saveWithWeeklyReset("weekMinutes", weekMinutes);
  }, [weekMinutes, saveWithWeeklyReset]);

  useEffect(() => {
    if (!token) return;
    const loadDailyWorkout = async () => {
      const today = getLocalDateString();

      try {
        const res = await api.get(`/daily-workout?date=${today}`);
        console.log("daily-workout GET response:", res.data);

        if (res.data.status === "success" && res.data.data) {
          setCurrentWorkout(res.data.data.workout);
        } else {
          const randomWorkout =
            allWorkouts[Math.floor(Math.random() * allWorkouts.length)];

          await api.post("/daily-workout", {
            workout: randomWorkout,
            date: today,
          });
          setCurrentWorkout(randomWorkout);
        }
      } catch (error) {
        console.error("Error loading daily workout:", error);
        const saved = localStorage.getItem("dailyWorkout");
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed?.date === today) {
          setCurrentWorkout(parsed.workout);
        } else {
          const randomWorkout =
            allWorkouts[Math.floor(Math.random() * allWorkouts.length)];
          localStorage.setItem(
            "dailyWorkout",
            JSON.stringify({ workout: randomWorkout, date: today }),
          );
          setCurrentWorkout(randomWorkout);
        }
      }

      setTodayKey(today);

      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const timeout = midnight.getTime() - Date.now();
      return setTimeout(loadDailyWorkout, timeout);
    };

    let timer;
    loadDailyWorkout().then((t) => {
      timer = t;
    });
    return () => clearTimeout(timer);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const loadDailyChallenge = async () => {
      const today = getLocalDateString();

      try {
        const res = await api.get(`/daily-challenge?date=${today}`);

        if (res.data.status === "success" && res.data.data) {
          // Zachowaj completed z bazy, dodaj false jeśli brakuje pola
          const challenge = res.data.data.challenge.map((item) => ({
            ...item,
            completed: item.completed ?? false,
          }));
          setCurrentChallenge(challenge);
        } else {
          const randomChallenge =
            dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];
          const challengeWithCompletion = randomChallenge.map((item) => ({
            ...item,
            completed: false,
          }));
          await api.post("/daily-challenge", {
            challenge: challengeWithCompletion,
            date: today,
          });
          setCurrentChallenge(challengeWithCompletion);
        }
      } catch (error) {
        console.error("Error loading daily challenge:", error);
        const saved = localStorage.getItem("dailyChallengeData");
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed?.date === today) {
          setCurrentChallenge(parsed.challenge);
        } else {
          const randomChallenge =
            dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];
          const challengeWithCompletion = randomChallenge.map((item) => ({
            ...item,
            completed: false,
          }));
          localStorage.setItem(
            "dailyChallengeData",
            JSON.stringify({ challenge: challengeWithCompletion, date: today }),
          );
          setCurrentChallenge(challengeWithCompletion);
        }
      }

      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const timeout = midnight.getTime() - Date.now();
      return setTimeout(loadDailyChallenge, timeout);
    };

    let timer;
    loadDailyChallenge().then((t) => {
      timer = t;
    });
    return () => clearTimeout(timer);
  }, [token]);

  const toggleChallengeItem = useCallback(async (itemId) => {
    const today = getLocalDateString();

    // Optimistic update
    let previousChallenge;
    setCurrentChallenge((prev) => {
      previousChallenge = prev;
      return prev.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
    });

    const targetItem = previousChallenge?.find((item) => item.id === itemId);
    const newCompleted = !(targetItem?.completed ?? false);

    try {
      await api.patch(`/daily-challenge/${itemId}`, {
        date: today,
        completed: newCompleted,
      });
    } catch (error) {
      console.error("Error toggling challenge item:", error);
      // Rollback przy błędzie
      setCurrentChallenge(previousChallenge);
    }
  }, []);

  const workoutProgressWidth = ((workoutsDone / weeklyWorkouts) * 100).toFixed(
    1,
  );

  //daily weight update
  const getWeightUpdated = () => {
    try {
      const saved = localStorage.getItem("dailyWeightUpdate");
      if (!saved) return false;
      const data = JSON.parse(saved);
      const today = getLocalDateString();
      if (typeof data === "boolean") {
        localStorage.removeItem("dailyWeightUpdate");
        return false;
      }
      if (data.date !== today) {
        localStorage.removeItem("dailyWeightUpdate");
        return false;
      }
      return data.updated;
    } catch {
      return false;
    }
  };

  const [weightUpdated, setWeightUpdated] = useState(getWeightUpdated);

  useEffect(() => {
    const today = getLocalDateString();
    localStorage.setItem(
      "dailyWeightUpdate",
      JSON.stringify({ updated: weightUpdated, date: today }),
    );
  }, [weightUpdated]);

  //food
  const [breakfastList, setBreakfastList] = useState([]);
  const [lunchList, setLunchList] = useState([]);
  const [snacksList, setSnacksList] = useState([]);
  const [dinnerList, setDinnerList] = useState([]);
  const [caloriesCount, setCaloriesCount] = useState(0);
  const [fatsCount, setFatsCount] = useState(0);
  const [proteinCount, setProteinCount] = useState(0);
  const [carbsCount, setCarbsCount] = useState(0);
  const EMPTYFOODWEEK = [0, 0, 0, 0, 0, 0, 0];
  const [weekFood, setWeekFood] = useState(EMPTYFOODWEEK);

  const fetchMealsData = async () => {
    if (!token) return;

    try {
      const today = getLocalDateString();

      const response = await api.get(`/meals?date=${today}&limit=1000`);

      if (response.data.status === "success") {
        const meals = response.data.data;

        setBreakfastList(meals.filter((m) => m.meal_type === "breakfast"));
        setLunchList(meals.filter((m) => m.meal_type === "lunch"));
        setDinnerList(meals.filter((m) => m.meal_type === "dinner"));
        setSnacksList(meals.filter((m) => m.meal_type === "snacks"));
      }

      const statsResponse = await api.get("/meals/stats");
      if (statsResponse.data.status === "success") {
        const { weekly } = statsResponse.data.data;
        setWeekFood(weekly.map((d) => d.calories));
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

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

  const addMeal = async (meal_type, meal) => {
    try {
      const payload = {
        meal_type,
        food_name: meal.food_name || meal.name,
        calories: Number(meal.calories) || 0,
        protein: Number(meal.protein) || 0,
        carbs: Number(meal.carbs) || 0,
        fats: Number(meal.fats) || 0,
        grammage: Number(meal.grammage) || 0,
        date: getLocalDateString(),
      };

      console.log("Sending meal payload:", payload);

      const response = await api.post("/meals", payload);

      if (response.data.status === "success") {
        await fetchMealsData();
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      console.error("Error response:", error.response?.data);
    }
  };

  const updateMeal = async (mealId, updatedData) => {
    try {
      await api.put(`/meals/${mealId}`, updatedData);
      await fetchMealsData();
    } catch (error) {
      console.error("Error updating meal:", error);
    }
  };

  const deleteMeal = async (mealId) => {
    try {
      await api.delete(`/meals/${mealId}`);
      await fetchMealsData();
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };
  //profile
  const [profileImage, setProfileImage] = useState(profilePic);

  const saveNewProfileImage = (newImageFile) => {
    if (!newImageFile) return;
    setProfileImage(URL.createObjectURL(newImageFile));
  };

  useEffect(() => {
    if (!token) return;
    const fetchProfileImage = async () => {
      try {
        const response = await api.get("/profile/image", {
          responseType: "blob",
        });
        setProfileImage(URL.createObjectURL(response.data));
      } catch {
        // nothing happens, app will use the base profilePic
      }
    };
    fetchProfileImage();
  }, [token]);

  const saveMetrics = async (height, weight) => {
    try {
      await api.put("/profile", {
        current_height: height,
        current_weight: weight,
      });
      setCurrentHeight(height);
      setCurrentWeight(weight);
    } catch (error) {
      console.error("Error saving metrics:", error);
    }
  };

  const saveGoals = async (goalWeight, hydrationGoal, dailyActivity) => {
    try {
      await api.put("/profile/goals", {
        goal_weight: goalWeight,
        hydration_goal: hydrationGoal,
        daily_activity: dailyActivity,
      });
      setGoalWeight(goalWeight);
      setHydrationGoal(hydrationGoal);
      setDailyActivity(dailyActivity);
    } catch (error) {
      console.error("Error saving goals:", error);
    }
  };
  //new token, data update
  useEffect(() => {
    if (token) {
      const currentWeekKey = getCurrentWeekKey();
      if (!localStorage.getItem("lastCheckedWeek")) {
        localStorage.setItem("lastCheckedWeek", currentWeekKey);
      }

      const currentDate = getLocalDateString();
      if (!localStorage.getItem("lastCheckedDate")) {
        localStorage.setItem("lastCheckedDate", currentDate);
      }

      fetchMealsData();
      fetchWaterData();
      fetchSleepData();
      fetchWorkoutData();
      fetchWeightData();
    }
  }, [token]);

  //new data, data update
  useEffect(() => {
    const checkDateAndWeekChange = setInterval(() => {
      const currentDate = getLocalDateString();
      const savedDate = localStorage.getItem("lastCheckedDate");

      const currentWeekKey = getCurrentWeekKey();
      const savedWeekKey = localStorage.getItem("lastCheckedWeek");

      if (savedDate !== currentDate) {
        localStorage.setItem("lastCheckedDate", currentDate);
        if (token) {
          fetchMealsData();
          fetchWaterData();
          fetchWorkoutData();
          fetchSleepData();
        }
      }

      if (savedWeekKey !== currentWeekKey) {
        localStorage.setItem("lastCheckedWeek", currentWeekKey);
        if (token) {
          setWeekFood(EMPTYFOODWEEK);
          setWeekMinutes(EMPTYWORKOUTWEEK);
          setSleepWeekMinutes(EMPTYSLEEPWEEK);
          setWaterWeek(Array(7).fill(0));
          setWeightWeekData([]);
          fetchMealsData();
          fetchWaterData();
          fetchWorkoutData();
          fetchWeightData();
        }
      }
    }, 60000);

    return () => clearInterval(checkDateAndWeekChange);
  }, [token]);

  const translatedCurrentWorkout = useMemo(() => {
    if (!currentWorkout || !t.allWorkouts) return currentWorkout;
    const firstExId = currentWorkout.exercises?.[0]?.id;
    if (firstExId) {
      const match = t.allWorkouts.find(w => w.exercises?.some(e => e.id === firstExId));
      if (match) {
        return {
          ...currentWorkout,
          name: match.name,
          exercises: currentWorkout.exercises.map(ex => {
            const translatedEx = match.exercises.find(e => e.id === ex.id);
            return { ...ex, name: translatedEx ? translatedEx.name : ex.name };
          })
        };
      }
    }
    return currentWorkout;
  }, [currentWorkout, t.allWorkouts]);

  const translatedCurrentChallenge = useMemo(() => {
    if (!currentChallenge || !t.challenges) return currentChallenge;
    return currentChallenge.map(item => {
      let translatedName = item.name;
      for (const group of t.challenges) {
        const match = group.find(c => c.id === item.id);
        if (match) {
           translatedName = match.name;
           break;
        }
      }
      return { ...item, name: translatedName };
    });
  }, [currentChallenge, t.challenges]);

  return (
    <DashboardContext.Provider
      value={{
        cycleStart,
        saveProfileData,
        deleteWaterEntry,
        saveMetrics,
        saveGoals,
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
        currentChallenge: translatedCurrentChallenge,
        setCurrentChallenge,
        toggleChallengeItem,
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
        goToHelp,
        //workout
        fetchWorkoutData,
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
        currentWorkout: translatedCurrentWorkout,
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
        water12Day,
        setWater12Day,
        addWater,
        waterWeek,
        setWaterWeek,
        //food
        breakfastList,
        setBreakfastList,
        lunchList,
        setLunchList,
        snacksList,
        setSnacksList,
        dinnerList,
        setDinnerList,
        addMeal,
        updateMeal,
        deleteMeal,
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
        getSleepComparison,
        getWeightComparison,
        showWelcomePopup,
        setShowWelcomePopup,
        profileImage,
        saveNewProfileImage,
        weightUpdated,
        setWeightUpdated,
        weightWeekData,
        fetchWeightData,
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
