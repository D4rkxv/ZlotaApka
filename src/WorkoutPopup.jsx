import React, { useState } from "react";
import { useDashboard } from "./DashboardContext.jsx";
import Running1 from "./assets/Running1.svg";
import Running2 from "./assets/Running2.svg";
import Meditation from "./assets/Meditation.svg";
import Threadmill from "./assets/Threadmill.svg";
import "./Popups.css";

const WorkoutPopup = ({ setPopupVisibility }) => {
  const { logWorkout, logCustomActivity, addCalories, addTime } =
    useDashboard();

  const [formData, setFormData] = useState({
    name: "",
    time: "",
    calories: "",
  });
  const [selectedIcon, setSelectedIcon] = useState(1);

  const icons = [Running1, Meditation, Threadmill, Running2];

  const handleSave = (e) => {
    e.preventDefault();
    const activityData = {
      name: formData.name,
      time: Number(formData.time),
      calories: Number(formData.calories),
      icon: icons[selectedIcon - 1],
    };

    logCustomActivity(activityData);
    logWorkout(activityData);
    addCalories(activityData.calories);
    addTime(activityData.time);

    setPopupVisibility(false);
    setFormData({ name: "", time: "", calories: "" });
    setSelectedIcon(1);
  };

  return (
    <div className="popupBackground">
      <div className="popupContainer workoutPopup">
        <form onSubmit={handleSave}>
          <p className="popupTitle">Add new activity</p>
          <div className="popupSection">
            <p className="popupSectionTitle workoutInputs">Activity type</p>
            <input
              type="text"
              placeholder="Activity name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Time (min)"
              value={formData.time}
              min={1}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Calories lost"
              min={1}
              value={formData.calories}
              onChange={(e) =>
                setFormData({ ...formData, calories: e.target.value })
              }
              required
            />
          </div>
          <div className="popupSection">
            <p className="popupSectionTitle">Activity icon</p>
            <div className="iconSelection">
              {[1, 2, 3, 4].map((id) => (
                <button
                  key={id}
                  type="button"
                  className={selectedIcon === id ? "selected" : null}
                  onClick={() => setSelectedIcon(id)}
                >
                  <img src={icons[id - 1]} alt={`Icon ${id}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="popupButtonContainer">
            <button
              type="button"
              className="transparentBtn"
              onClick={() => setPopupVisibility(false)}
            >
              Cancel
            </button>
            <button type="submit" className="coloredBtn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutPopup;
