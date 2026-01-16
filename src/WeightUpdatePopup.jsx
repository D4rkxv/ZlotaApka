import React, { useState } from 'react';
import { useDashboard } from "./DashboardContext.jsx";

const WeightUpdatePopup = ({setDailyWeightUpdated}) => {
    const {
        currentWeight, 
        setCurrentWeight
    } = useDashboard()
    const [newWeight, setNewWeight] = useState(currentWeight)

    return(
        <div className="popupBackground">
            <div className="popupContainer weightUpdate">
                <form onSubmit={(e)=>{
                    e.preventDefault()
                    setCurrentWeight(newWeight)
                    setDailyWeightUpdated(true)
                }}>
                    <p className="popupTitle">Daily weight update</p>
                    <div className="popupSection">
                        <div className="inputContainer">
                            <label htmlFor="mealName">Today's weight in kg:</label>
                            <input type="number" id='mealName' value={newWeight} onChange={(e) => setNewWeight(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="popupButtonContainer">
                        <button type="submit" className="coloredBtn">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default WeightUpdatePopup