import React, { useState } from 'react';
import "./Popups.css"
import { Meal } from './DashboardContext';

const MealPopup = ({setPopupMealType, addMeal, setList}) => {
    const [name, setName] = useState("")
    const [grammage, setGrammage] = useState(0)
    const [calories, setCalories] = useState(0)
    const [protein, setProtein] = useState(0)
    const [fats, setFats] = useState(0)
    const [carbs, setCarbs] = useState(0)

    return(
        <div className="popupBackground">
            <div className="popupContainer mealPopup">
                <form onSubmit={(e)=>{
                    e.preventDefault()
                    addMeal(setList, new Meal(name, grammage, calories, protein, fats, carbs))
                    setPopupMealType("")
                }}>
                    <p className="popupTitle">Add meal</p>
                    <div className="popupSection">
                        <div className="inputContainer">
                            <label htmlFor="mealName">Name:</label>
                            <input type="text" id='mealName' value={name} onChange={(e) => setName(e.target.value)} required/>
                        </div>
                        <div className="inputContainer">
                            <label htmlFor="mealGrammage">Grammage {"(g)"}</label>
                            <input type="number" id='mealGrammage' value={grammage} onChange={(e) => setGrammage(parseInt(e.target.value))} required/>
                        </div>
                        <div className="inputContainer">
                            <label htmlFor="mealCalories">Calories {"(kcal)"}</label>
                            <input type="number" id='mealCalories' value={calories} onChange={(e) => setCalories(parseInt(e.target.value))} required/>
                        </div>
                        <div className="inputContainer">
                            <label htmlFor="mealProtein">Protein {"(g)"}</label>
                            <input type="number" id='mealProtein' value={protein} onChange={(e) => setProtein(parseInt(e.target.value))} required/>
                        </div>
                        <div className="inputContainer">
                            <label htmlFor="mealFats">Fats {"(g)"}</label>
                            <input type="number" id='mealFats' value={fats} onChange={(e) => setFats(parseInt(e.target.value))} required/>
                        </div>
                        <div className="inputContainer">
                            <label htmlFor="mealCarbs">Carbs {"(g)"}</label>
                            <input type="number" id='mealCarbs' value={carbs} onChange={(e) => setCarbs(parseInt(e.target.value))} required/>
                        </div>
                    </div>
                    <div className="popupButtonContainer">
                        <button
                            type="button"
                            className="transparentBtn"
                            onClick={() => setPopupMealType("")}
                            >Cancel</button>
                        <button type="submit" className="coloredBtn">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MealPopup