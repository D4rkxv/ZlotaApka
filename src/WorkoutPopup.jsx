import React, { useState } from 'react';
import Running1 from "./assets/Running1.svg";
import Running2 from "./assets/Running2.svg";
import Meditation from "./assets/Meditation.svg";
import Threadmill from "./assets/Threadmill.svg";
import "./Popups.css"

const WorkoutPopup = ({setPopupVisibility}) => {
    const [selectedIcon, setSelectedIcon] = useState(1)
    
    return(
        <div className="popupBackground">
            <div className="popupContainer workoutPopup">
                <form onSubmit={(e) =>{
                    e.preventDefault()
                    setPopupVisibility(false)
                }}>
                    <p className="popupTitle">Add new activity</p>
                    <div className="popupSection">
                        <p className="popupSectionTitle workoutInputs">Activity type</p>
                        <input type="text" placeholder='Activity name' required />
                        <input type="text" placeholder='Time' required />
                        <input type="text" placeholder='Calories lost' required />
                    </div>
                    <div className="popupSection">
                        <p className="popupSectionTitle">Activity icon</p>
                        <div className="iconSelection">
                            <button type='button' className={selectedIcon==1 ? "selected":null} onClick={() => (setSelectedIcon(1))}><img src={Running1} alt="Jogging"/></button>
                            <button type='button' className={selectedIcon==2 ? "selected":null} onClick={() => (setSelectedIcon(2))}><img src={Meditation} alt="Meditation"/></button>
                            <button type='button' className={selectedIcon==3 ? "selected":null} onClick={() => (setSelectedIcon(3))}><img src={Threadmill} alt="Threadmill" /></button>
                            <button type='button' className={selectedIcon==4 ? "selected":null} onClick={() => (setSelectedIcon(4))}><img src={Running2} alt="Sprint"/></button>
                        </div>
                    </div>
                    <div className="popupButtonContainer">
                        <button className='transparentBtn' onClick={() => {setPopupVisibility(false)}}>Cancel</button>
                        <button type='submit' className='coloredBtn'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default WorkoutPopup