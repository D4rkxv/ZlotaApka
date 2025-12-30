import React, { useState } from 'react';
import "./Settings.css";
import Sidebar from './Sidebar';

const Settings = () => {
    
    return (
        <div className="settingsContainer siteContainer">
            <Sidebar />
            <div className="widgetContainer">
                <p className="siteTitle">Settings</p>
                <div className="resetDataContainer">
                    <div className="descriptionContainer">
                        <p className="sectionTitle">Reset your data</p>
                        <p className='sectionDescription'>Delete all of your data, and start fresh!</p>
                    </div>
                    <div className="buttonContainer">
                        <button className="resetDataButton">Reset Data</button>
                    </div>
                </div>
                <div className="deleteAccountContainer">
                    <div className="descriptionContainer">
                        <p className="sectionTitle">Delete your account</p>
                        <p className='sectionDescription'>Delete your account and all of your data permanently.</p>
                    </div>
                    <div className="buttonContainer">
                        <button className="deleteAccountButton">Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;