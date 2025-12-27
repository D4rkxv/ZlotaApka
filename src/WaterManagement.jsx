import React, { useState } from 'react';
import DonutChart from './DonutChart';
import './WaterManagement.css';
import Edit from './assets/Edit.svg';


const WaterManagement = () => {
    const [hydrationGoal, setHydrationGoal] = useState(3.0); 
    const [currentHydration, setCurrentHydration] = useState(1.7);

    const handleHydrationChange = (amount) => {
        setCurrentHydration(prev => Math.max(0, prev + amount));
    };

    return (
        <div className="waterManagementContainer">
            <div className="sidebar">okok</div>
            <div className="widgetContainer">
                <p className="siteTitle">Water Management</p>
                <div className="widgetDivider">
                    <div className="leftSide">
                        <div className="hydrationTrackerContainer">
                            <p className='sectionTitle'>Hydration Tracker</p>
                            <div className="centeredContainer">
                                <div className="donutChartContainer">
                                    <DonutChart current={currentHydration} goal={hydrationGoal} size={278} />
                                </div>
                                <p className="completion">{currentHydration.toFixed(1)} / {hydrationGoal.toFixed(1)} l</p>
                                <div className="buttonsContainer">
                                    <button className='wideBtn transparentBtn' onClick={() =>{handleHydrationChange(-0.1)}}>-100ml</button>
                                    <button className='wideBtn coloredBtn' onClick={() => {handleHydrationChange(0.1)}}>+100ml</button>
                                    <button className='boxBtn coloredBtn'>
                                        <img src={Edit} alt="editGoals" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="hydrationSummaryContainer">
                            <p className="sectionTitle">Hydration summary</p>
                            
                        </div>
                    </div>
                    <div className="rightSide">
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WaterManagement;