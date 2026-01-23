import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import profilePic from "./assets/BigProfilePic.png";
import { AuthContext, api } from "./AuthContext.jsx";

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

  const getCurrentWeekKey = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    monday.setDate(now.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split("T")[0];
  };

  //Welcome popup
  const [isChecked2, setIsChecked2] = useState(Array(6).fill(false));
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [currentHeight, setCurrentHeight] = useState(null);
  const [currentAge, setCurrentAge] = useState(null);
  const [sleepTimeInput, setSleepTimeInput] = useState(240);
  const [sleepTime, setSleepTime] = useState([0, 0]);
  const [caloriesGoal, setCaloriesGoal] = useState(1000);
  const [dailyActivity, setDailyActivity] = useState(10);
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
      const today = new Date().toISOString().split("T")[0];

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

  const dailyChallenges = [
    [
      { id: "c1-1", name: "No caffeine after 2 PM" },
      { id: "c1-2", name: "Read book 15 min" },
      { id: "c1-3", name: "Walk 5000 steps" },
      { id: "c1-4", name: "No sweets today" },
    ],
    [
      { id: "c2-1", name: "Deep work 90 min" },
      { id: "c2-2", name: "Bed before 11:00 PM" },
      { id: "c2-3", name: "Eat 3 meals only" },
      { id: "c2-4", name: "Plank 2 min total" },
    ],
    [
      { id: "c3-1", name: "Cold shower" },
      { id: "c3-2", name: "No social media morning" },
      { id: "c3-3", name: "Outdoor walk 45 min" },
      { id: "c3-4", name: "Protein 25g per meal" },
    ],
    [
      { id: "c4-1", name: "Stretch 15 min" },
      { id: "c4-2", name: "Drink 3L Water" },
      { id: "c4-3", name: "Call family/friend" },
      { id: "c4-4", name: "No fast food" },
    ],
    [
      { id: "c5-1", name: "Run or Jog 20 min" },
      { id: "c5-2", name: "Journal 5 min" },
      { id: "c5-3", name: "Sunlight exposure 15 min" },
      { id: "c5-4", name: "Screen time under 3h" },
    ],
    [
      { id: "c6-1", name: "Learn new skill 30 min" },
      { id: "c6-2", name: "Clean room/desk 10 min" },
      { id: "c6-3", name: "100 Push-ups total" },
      { id: "c6-4", name: "Eat 2 pieces of fruit" },
    ],
    [
      { id: "c7-1", name: "Zero alcohol today" },
      { id: "c7-2", name: "Meditate 10 min" },
      { id: "c7-3", name: "Bike or Swim 30 min" },
      { id: "c7-4", name: "Track all calories" },
    ],
    [
      { id: "c8-1", name: "Walk 10 min after dinner" },
      { id: "c8-2", name: "No phone in bed" },
      { id: "c8-3", name: "Stand while working 1h" },
      { id: "c8-4", name: "Listen to edu podcast" },
    ],
    [
      { id: "c9-1", name: "Squats 50 reps total" },
      { id: "c9-2", name: "Write 3 gratitude things" },
      { id: "c9-3", name: "Water before coffee" },
      { id: "c9-4", name: "Sleep 7h 30m" },
    ],
    [
      { id: "c10-1", name: "Power nap 20 min" },
      { id: "c10-2", name: "No bread/pasta today" },
      { id: "c10-3", name: "Visualize goals 5 min" },
      { id: "c10-4", name: "Walk 8000 steps" },
    ],
  ];

  //water Section backend
  const [currentHydration, setCurrentHydration] = useState(0);
  const [waterLog, setWaterLog] = useState([]);
  const [water12Day, setWater12Day] = useState(Array(12).fill(0));
  const [waterWeek, setWaterWeek] = useState(Array(7).fill(0));

  const [cycleStart, setCycleStart] = useState(null);

  const fetchWaterData = async () => {
    if (!token) return;

    try {
      const currentDate = new Date().toISOString().split("T")[0];

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

      const today = new Date().toISOString().split("T")[0];
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
        date: new Date().toISOString().split("T")[0],
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
  const [sleepWeekData, setSleepWeekData] = useState(Array(7).fill({ hours: 0, score: 0, quality: null }));
  const [profileInBedTime, setProfileInBedTime] = useState("");
  const [profileOutOfBedTime, setProfileOutOfBedTime] = useState("");
  const [profileSleepQuality, setProfileSleepQuality] = useState(null);
  const EMPTYSLEEPWEEK = [0, 0, 0, 0, 0, 0, 0];
  const [sleepWeekMinutes, setSleepWeekMinutes] = useState(EMPTYSLEEPWEEK);

  const fetchSleepData = useCallback(async () => {
  if (!token) return;

  try {
    const today = new Date().toISOString().split("T")[0];

    const statsResponse = await api.get("/sleep/stats");
    if (statsResponse.data.status === "success") {
      const { today: todayData, weekly } = statsResponse.data.data;
      
      setTodaySleep(todayData);
      setSleepWeekData(weekly);
      
      if (todayData) {
        setProfileInBedTime(todayData.in_bed_time);
        setProfileOutOfBedTime(todayData.out_of_bed_time);
        setInBedTime(todayData.in_bed_time || "")
        setOutOfBedTime(todayData.out_of_bed_time || "")
        setProfileSleepQuality(todayData.sleep_quality);
        setSleepQuality(todayData.sleep_quality || "")
        setScore(todayData.sleep_score || 0);
        setLastNightSleep([
          Math.floor(todayData.duration_hours || 0),
          Math.round(((todayData.duration_hours || 0) % 1) * 60)
        ]);
      }
      
      const weekMinutes = weekly.map(day => (day.hours || 0) * 60);
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
      date: new Date().toISOString().split("T")[0],
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
  
  const daysWithData = sleepWeekData.filter(day => day.hours > 0);
  
  if (daysWithData.length < 2) {
    return null;
  }
  
  const sorted = [...daysWithData].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  
  const today = sorted[0];
  const yesterday = sorted[1];

  const todayMinutes = (today.hours || 0) * 60;
  const yesterdayMinutes = (yesterday.hours || 0) * 60;

  const diffMinutes = todayMinutes - yesterdayMinutes;

  const percentChange = yesterdayMinutes > 0
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
          activity_name: workoutData.name || "Workout",
          duration_minutes: workoutData.time || Math.floor(seconds / 60),
          calories_burned: workoutData.calories || 0,
          date: new Date().toISOString().split("T")[0],
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
        } catch (e) {}
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
    const loadDailyChallenge = () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      const saved = localStorage.getItem("dailyChallengeData");
      const parsed = saved ? JSON.parse(saved) : null;

      if (parsed?.date !== today) {
        const randomChallenge =
          dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];

        const toSave = { challenge: randomChallenge, date: today };

        localStorage.setItem("dailyChallengeData", JSON.stringify(toSave));
        setCurrentChallenge(randomChallenge);
      } else {
        setCurrentChallenge(parsed.challenge);
      }
    };

    loadDailyChallenge();

    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const timeout = midnight.getTime() - Date.now();
    const timer = setTimeout(loadDailyChallenge, timeout);

    return () => clearTimeout(timer);
  }, []);

  const workoutProgressWidth = ((workoutsDone / weeklyWorkouts) * 100).toFixed(
    1,
  );
  //daily weight update
  const getWeightUpdated = () => {
    const value = localStorage.getItem("dailyWeightUpdate");
    return value ? JSON.parse(value) : false;
  };

  const [weightUpdated, setWeightUpdated] = useState(getWeightUpdated);

  useEffect(() => {
    localStorage.setItem("dailyWeightUpdate", JSON.stringify(weightUpdated));
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
      const today = new Date().toISOString().split("T")[0];

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
        date: new Date().toISOString().split("T")[0],
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
  //profile picture
  const [profileImage, setProfileImage] = useState(profilePic);

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");

    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const saveNewProfileImage = (newImageFile) => {
    const reader = new FileReader();

    reader.onload = () => {
      localStorage.setItem("profileImage", reader.result);
      setProfileImage(reader.result);
    };

    reader.readAsDataURL(newImageFile);
  };
  //new token, data update
  useEffect(() => {
    if (token) {
      const currentWeekKey = getCurrentWeekKey();
      if (!localStorage.getItem("lastCheckedWeek")) {
        localStorage.setItem("lastCheckedWeek", currentWeekKey);
      }

      const currentDate = new Date().toISOString().split("T")[0];
      if (!localStorage.getItem("lastCheckedDate")) {
        localStorage.setItem("lastCheckedDate", currentDate);
      }

      fetchMealsData();
      fetchWaterData();
      fetchSleepData();
      fetchWorkoutData();
    }
  }, [token]);

  //new data, data update
  useEffect(() => {
    const checkDateAndWeekChange = setInterval(() => {
      const currentDate = new Date().toISOString().split("T")[0];
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
          fetchMealsData();
          fetchWaterData();
          fetchWorkoutData();
        }
      }
    }, 60000);

    return () => clearInterval(checkDateAndWeekChange);
  }, [token]);

  return (
    <DashboardContext.Provider
      value={{
        cycleStart,
        saveProfileData,
        deleteWaterEntry,
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
        currentChallenge,
        setCurrentChallenge,
        isChecked2,
        setIsChecked2,
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
        showWelcomePopup,
        setShowWelcomePopup,
        profileImage,
        saveNewProfileImage,
        weightUpdated,
        setWeightUpdated,
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
