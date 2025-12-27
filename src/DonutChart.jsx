import React, { useState } from 'react';
import './DonutChart.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({current, goal, size}) => {
    const percent = ((current / goal) * 100).toFixed(0);
    return (
        <div className='donutChart' style={{"--percent": `${percent * 3.6}deg`,
         width: size, height: size}}>
            <div className="donutHole">
                <div className="percent">{percent}%</div>
            </div>
            
        </div>
    );
}

export default DonutChart;