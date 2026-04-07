import React, { useState } from "react";
import { useDashboard } from "./DashboardContext.jsx";
import { api } from "./AuthContext.jsx";

const WeightUpdatePopup = ({ setDailyWeightUpdated }) => {
  const { currentWeight, setCurrentWeight, fetchWeightData } = useDashboard();
  const [newWeight, setNewWeight] = useState(currentWeight);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="popupBackground">
      <div className="popupContainer weightUpdate">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);

            try {
              const parsed = parseFloat(newWeight);

              // 1. zapisz do weight_logs → historia do % porównania
              await api.post("/weight", {
                weight: parsed,
                date: new Date().toISOString().split("T")[0],
              });

              // 2. zapisz do user_profiles → naprawa resetu po userProfile refresh
              await api.put("/profile", { current_weight: parsed });

              // 3. lokalny stan od razu
              setCurrentWeight(parsed);

              // 4. odśwież weightWeekData
              await fetchWeightData();
            } catch (error) {
              console.error("Error saving weight:", error);
            } finally {
              setIsLoading(false);
              setDailyWeightUpdated(true);
            }
          }}
        >
          <p className="popupTitle">Daily weight update</p>
          <div className="popupSection">
            <div className="inputContainer">
              <label htmlFor="mealName">Today's weight in kg:</label>
              <input
                type="number"
                id="mealName"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="popupButtonContainer">
            <button type="submit" className="coloredBtn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeightUpdatePopup;
