import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Make sure to create and import this CSS file

const LandingPage = () => {
    return (
        <div className="landing-container">
            <div className="landing-header">
                <div className="logo">Glam Hire</div>
                <div className="landing-buttons">
                   
                </div>
            </div>
            <div className="landing-content">
                <div className="text-container">
                    <h2>Glam Hire</h2>
                    <h1>Beauty & Makeup</h1>
                    <p>
                    Transform your look effortlessly with Glam Hire, the ultimate website for booking professional makeup artists. Whether it's for a wedding, a photoshoot, or a night out, Glam Hire connects you with top-rated makeup artists in your area. Browse portfolios, read reviews, and book appointments with ease. GlamUp ensures you get the perfect look, every time. Register now and get glam on the go!
                    </p>
                    <button className="appointment-btn">Make an Appointment</button>
                </div>
                <div className="image-container">
                    <img src="/assets/images/landing.png" alt="Beauty and Spa" className="landing-image" />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
