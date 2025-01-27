import React from 'react';
import './Services.css'; // Ensure you create this CSS file for styling

const services = [
    {
        name: "Indian Engagement Look",
        rating: "5.0",
        image: "/assets/images/indian.jpg" // Replace with the correct path
    },
    {
        name: "Western Engagement Look",
        rating: "4.9",
        image: "/assets/images/western.jpg" // Replace with the correct path
    },
    {
        name: "Simple Engagement Look",
        rating: "4.8",
        image: "/assets/images/simple.jpg" // Replace with the correct path
    },
    {
        name: "Natural Engagement Look",
        rating: "4.7",
        image: "/assets/images/natural.jpg" // Replace with the correct path
    },
    {
        name: "Simple Engagement Look",
        rating: "5.0",
        image: "/assets/images/simple.jpg" // Replace with the correct path
    },
    {
        name: "Natural Engagement Look",
        rating: "4.7",
        image: "/assets/images/natural.jpg" // Replace with the correct path
    },
    {
        name: "Western Engagement Look",
        rating: "4.9",
        image: "/assets/images/western.jpg" // Replace with the correct path
    },
    {
        name: "Indian Engagement Look",
        rating: "5.0",
        image: "/assets/images/indian.jpg" // Replace with the correct path
    }
];

const Services = () => {
    return (
        <div className="services-container">
            <h2>Our Services</h2>
            <div className="services-categories">
                <span>BRIDAL</span>
                <span className="active">ENGAGEMENT</span>
                <span>RECEPTION</span>
                <span>PARTY</span>
            </div>
            <div className="services-grid">
                <div className="services-row close-gap">
                    {services.slice(0, 4).map((service, index) => (
                        <div key={index} className="service-card">
                            <img src={service.image} alt={service.name} />
                            <h3>{service.name}</h3>
                            <p>Rating: {service.rating} ★</p>
                        </div>
                    ))}
                </div>
                <div className="services-row">
                    {services.slice(4, 8).map((service, index) => (
                        <div key={index} className="service-card">
                            <img src={service.image} alt={service.name} />
                            <h3>{service.name}</h3>
                            <p>Rating: {service.rating} ★</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
