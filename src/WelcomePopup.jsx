import React, { useEffect, useState } from 'react';
import "./Popups.css"

const WelcomePopup = ({setPopupVisibility}) => {
    const [sleepTimeInput, setSleepTimeInput] = useState(495)
    const [sleepTime, setSleepTime] = useState([8, 15])
    useEffect(() =>{
        setSleepTime([(sleepTimeInput/60).toFixed(0), sleepTimeInput%60])
    }, [sleepTimeInput])
    const [caloriesGoal, setCaloriesGoal] = useState(3200)
    const [dailyActivity, setDailyActivity] = useState(45) 
    const [weeklyWorkouts, setWeeklyWorkouts] = useState(4)

    

    return(
        <div className="popupBackground">
            <div className="welcomePopup popupContainer">
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    setPopupVisibility(false)
                }}>
                <p className="popupTitle">Welcome to VitaTrack!</p>
                <p className="popupDescription">Before we start, we need to ask you a few important questions about your current weight, age, gender, and your goals for sleep, calories, and exercise.</p>
                <div className="popupSection">
                    <p className="popupSectionTitle">Your details</p>
                    <input type="number" id='weightInput' placeholder='Current Weight' required/>
                    <input type='date' id='birthdayInput' placeholder='Date of birth' required/>
                    <div className="popupSubSection">
                        <p>Gender</p>
                        <div className="divider">
                            <div className="radioButtonContainer">
                                <input type="radio" name="gender" id="maleGender" required />
                                <label htmlFor="maleGender">Male</label>
                            </div>
                            <div className="radioButtonContainer">
                                <input type="radio" name="gender" id="femaleGender" required />
                                <label htmlFor="maleGender">Female</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="popupSection">
                    <p className="popupSectionTitle">Your Goals</p>
                    <input type="number" id='goalWeightInput' placeholder='Goal Weight' required/>
                    <p className="popupSubSection">Daily sleep goal • {sleepTime[0]}h {sleepTime[1]>0 ? `${sleepTime[1]}min`:null}</p>
                    <div className="sliderContainer">
                        <p>4h</p>
                        <input type="range" name="sleepTimeInput" id="sleepTimeInput" min={240} max={600} value={sleepTimeInput} onChange={(e)=>{setSleepTimeInput(e.target.value)}} required/>
                        <p>10h</p>
                    </div>
                    <p className="popupSubSection">Daily calories goal • {caloriesGoal}kcal</p>
                    <div className="sliderContainer">
                        <p>1000kcal</p>
                        <input type="range" name="caloriesGoalInput" id="caloriesGoalInput" min={1000} max={5000} value={caloriesGoal} onChange={(e)=>{setCaloriesGoal(e.target.value)}} required/>
                        <p>5000kcal</p>
                    </div>
                    <p className="popupSubSection">Daily activity • {dailyActivity}min</p>
                    <div className="sliderContainer">
                        <p>10min</p>
                        <input type="range" name="activityInput" id="activityInput" min={10} max={120} value={dailyActivity} onChange={(e)=>{setDailyActivity(e.target.value)}} required/>
                        <p>120min</p>
                    </div>
                    <p className="popupSubSection">Weekly workouts • {weeklyWorkouts}</p>
                    <div className="sliderContainer">
                        <p>1</p>
                        <input type="range" name="activityInput" id="activityInput" min={1} max={7} value={weeklyWorkouts} onChange={(e)=>{setWeeklyWorkouts(e.target.value)}} required/>
                        <p>7</p>
                    </div>
                </div>
                <div className="popupButtonContainer">
                    <button type='submit'>Save</button>
                </div>
                </form>
            </div>
        </div>
    )
    
}

export default WelcomePopup