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
                        <input type="text" placeholder='Name...' value={name} onChange={(e) => setName(e.target.value)}/>
                        <input type="number" placeholder='Grammage (g)...' value={grammage} onChange={(e) => setGrammage(parseInt(e.target.value))}/>
                        <input type="number" placeholder='Calories (kcal)...' value={calories} onChange={(e) => setCalories(parseInt(e.target.value))}/>
                        <input type="number" placeholder='Protein (g)...' value={protein} onChange={(e) => setProtein(parseInt(e.target.value))}/>
                        <input type="number" placeholder='Fats (g)...' value={fats} onChange={(e) => setFats(parseInt(e.target.value))}/>
                        <input type="number" placeholder='Carbs (g)...' value={carbs} onChange={(e) => setCarbs(parseInt(e.target.value))}/>
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