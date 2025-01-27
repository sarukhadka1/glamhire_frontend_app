import React from 'react';
import { Link } from 'react-router-dom';
import './ArtistPanel.css'; // Ensure you create this CSS file for styling


const artists = [
    {
        name: "Binita",
        rating: "5.0",
        image: "/assets/images/saru.png", // Replace with the correct path
        link: "/artist/saru-khadka"
    },
    {
        name: "Slesha Dahal",
        rating: "4.9",
        image: "/assets/images/Slesha.jpg", // Replace with the correct path
        link: "/artist/slesha-dahal"
    },
    {
        name: "Simran Bista",
        rating: "5.0",
        image: "/assets/images/simraan.jpg", // Replace with the correct path
        link: "/artist/simran-bista"
    },
    {
        name: "Shrawani KC",
        rating: "5.0",
        image: "/assets/images/shrawani.png", // Replace with the correct path
        link: "/artist/shrawani-kc"
    }
];

const ArtistPanel = () => {
    return (
        <div>
            
        
        <div className="artist-panel-container mt-2">
            <h2>Popular Artists</h2>
            <p>Get in on the trend with our best makeup artists.</p>
            <div className="artist-grid">
                {artists.map((artist, index) => (
                    <div key={index} className="artist-card">
                        <Link to={artist.link}>
                            <img src={artist.image} alt={artist.name} />
                            <h3>{artist.name}</h3>
                            <p>Makeup Artist {artist.rating} ★</p>
                        </Link>
                    </div>
                ))}
            </div>
            <button className="see-all-button">See all</button>
        </div>
        </div>
    );
};

export default ArtistPanel;
