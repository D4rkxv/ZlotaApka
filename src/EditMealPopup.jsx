import React, { useState } from 'react';
import "./Popups.css"
import { Meal } from './DashboardContext';

const EditMealPopup = ({setPopupMealType, modifyMeal, meal, index, list, setList}) => {
    const [name, setName] = useState(meal.name)
    const [grammage, setGrammage] = useState(meal.grammage)
    const [calories, setCalories] = useState(meal.calories)
    const [protein, setProtein] = useState(meal.protein)
    const [fats, setFats] = useState(meal.fats)
    const [carbs, setCarbs] = useState(meal.carbs)

    return(
        <div className="popupBackground">
            <div className="popupContainer mealPopup">
                <form onSubmit={(e)=>{
                    e.preventDefault()
                    modifyMeal(new Meal(name, grammage, calories, protein, fats, carbs), index, list, setList)
                    setPopupMealType("")
                }}>
                    <p className="popupTitle">Modify a previous meal</p>
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

export default EditMealPopup