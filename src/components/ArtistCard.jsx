import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import ArtistModal from '../components/artistModel'; 
import BookingForm from '../pages/book/BookingForm'; 
import {addToWishlistApi, getUserWishlistApi, removeFromWishlistApi } from '../apis/Api'; 
import { Link } from 'react-router-dom';
import './ArtistCard.css'; 

const ArtistCard = ({ artistInformation, color, updateWishlist }) => {
    const [showModal, setShowModal] = useState(false);
    const [artist, setArtist] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch initial favorite status
        const checkWishlistStatus = async () => {
            try {
                const res = await getUserWishlistApi();
                const wishlist = res.data.data;
                const isArtistInWishlist = wishlist.some(artist => artist._id === artistInformation._id);
                setIsInWishlist(isArtistInWishlist);
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching wishlist');
            }
        };

        checkWishlistStatus();
    }, [artistInformation._id]);

    const handleViewMoreClick = () => {
        axios.get(`https://localhost:5000/api/artist/get_single_artist/${artistInformation._id}`)
            .then(response => {
                setArtist(response.data.artist);
                setShowModal(true);  
            })
            .catch(error => console.error('Error fetching artist data:', error));
    };

    const handleBookNowClick = () => {
        setShowBookingForm(true);
    };

    const handleWishlistToggle = async () => {
        setError(null);
        try {
          if (isInWishlist) {
            await removeFromWishlistApi(artistInformation._id);
            toast.success("Artist removed from wishlist");
          } else {
            await addToWishlistApi(artistInformation._id);
            toast.success("Artist added to wishlist");
          }
     
          setIsInWishlist(!isInWishlist);
          updateWishlist();
        } catch (err) {
          //console.log("Error updating wishlist:", err);
          setError(err.response?.data?.message || 'Error updating wishlist');
        }
      };

    return (
        <>
        <div className='container '>
            <div className="card" style={{ width: '18rem', height: '100%' }}>
                <span
                    style={{ backgroundColor: color }}
                    className='badge position-absolute top-0'
                >
                    {artistInformation.artistGenre}
                </span>
                <img
                    src={`https://localhost:5000/artists/${artistInformation.artistImage}`}
                    className="card-img-top"
                    alt="artist"
                    style={{ height: '12rem', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 end-0 p-2">
                    <FontAwesomeIcon 
                        icon={faHeart} 
                        size="1x" 
                        color={isInWishlist ? 'red' : 'white'} 
                        onClick={handleWishlistToggle} 
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100% - 12rem)' }}>
                    <div className='d-flex justify-content-between'>
                        <h5 className="card-title">{artistInformation.artistName}</h5>
                        <h5 className="card-title text-danger">NPR.{artistInformation.artistRate}</h5>
                    </div>
                    <p className="card-text">{artistInformation.artistDescription.slice(0, 30)}</p>
                    <button className="btn btn-pink w-100" onClick={handleViewMoreClick}>Review and Rating</button>
                    <Link to={`/view/${artistInformation._id}`} className="btn btn-purple w-100 mt-2" onClick={handleBookNowClick}>Get Details</Link>
                    <ToastContainer />
                </div>
            </div>

            {showModal && <ArtistModal artist={artist} onClose={() => setShowModal(false)} />}
            {showBookingForm && artist && (
                <div className="booking-form-modal">
                    <BookingForm artist={artist} />
                    <button className="btn btn-secondary mt-2" onClick={() => setShowBookingForm(false)}>Close</button>
                </div>
            )}
            </div>
        </>
    );
};

export default ArtistCard;
