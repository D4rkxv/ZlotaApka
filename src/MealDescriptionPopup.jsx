import React, { useState } from 'react';
import "./Popups.css"

const MealDescriptionPopup = ({meal, setPopupVisibility}) => {
    
    return(
        <div className="popupBackground">
            <div className="popupContainer mealDescription">
                <p className="popupTitle">{meal.name} description:</p>
                <div className="popupSection">
                    <p>Grammage: {meal.grammage}g</p>
                    <p>Calories: {meal.calories}kcal</p>
                    <p>Protein: {meal.protein}g</p>
                    <p>Fats: {meal.fats}g</p>
                    <p>Carbs: {meal.carbs}g</p>
                </div>
                <div className="popupButtonContainer">
                    <button className='transparentBtn' onClick={()=>setPopupVisibility(false)}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default MealDescriptionPopup