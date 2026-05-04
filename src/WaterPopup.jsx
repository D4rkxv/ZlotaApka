import React, { useState } from "react";
import "./Popups.css";

const WaterPopup = ({ setShowWaterCustomAddPopup, addCustomAmount }) => {
  const [customAmount, setCustomAmount] = useState(100);

  return (
    <div className="popupBackground">
      <div className="popupContainer waterPopup">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addCustomAmount(customAmount);
            setShowWaterCustomAddPopup(false);
          }}
        >
          <p className="popupTitle">Add a custom amount of water</p>
          <div className="popupSection">
            <div className="inputContainer">
              <label htmlFor="customAmount">Custom amount (ml)</label>
              <input
                type="number"
                id="customAmount"
                value={customAmount}
                onChange={(e) => setCustomAmount(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="popupButtonContainer">
              <button
                type="button"
                className="transparentBtn"
                onClick={() => setShowWaterCustomAddPopup(false)}
              >
                Cancel
              </button>
              <button type="submit" className="coloredBtn">
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WaterPopup;
