import React, { useState } from "react";
import { useDashboard } from "./DashboardContext.jsx";
import { api } from "./AuthContext.jsx";
import "./Popups.css";
import { useLanguage } from "./LanguageContext.jsx";

const WeightUpdatePopup = ({ setDailyWeightUpdated }) => {
  const { currentWeight, setCurrentWeight, fetchWeightData } = useDashboard();
  const { t } = useLanguage();
  const w = t.weightUpdate;
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
              await api.post("/weight", {
                weight: parsed,
                date: new Date().toISOString().split("T")[0],
              });
              await api.put("/profile", { current_weight: parsed });
              setCurrentWeight(parsed);
              await fetchWeightData();
            } catch (error) {
              console.error("Error saving weight:", error);
            } finally {
              setIsLoading(false);
              setDailyWeightUpdated(true);
            }
          }}
        >
          <p className="popupTitle">{w.title}</p>
          <div className="popupSection">
            <div className="inputContainer">
              <label htmlFor="weightInput">{w.label}</label>
              <input
                type="number"
                id="weightInput"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="popupButtonContainer">
            <button type="submit" className="coloredBtn" disabled={isLoading}>
              {isLoading ? w.saving : w.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeightUpdatePopup;
