import React, { useState, useEffect, useRef } from 'react'; 
import DOMPurify from 'dompurify';
import './ArtistModel.css';
import BookingForm from '../pages/book/BookingForm'; // Import the BookingForm component
import { addReviewApi, getReviewsApi } from '../apis/Api';
import { toast } from 'react-toastify'; // Import toast for notifications
import Rating from 'react-rating-stars-component';

const ArtistModal = ({ artist, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(1);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const modalRef = useRef(null);

    useEffect(() => {
        if (artist) {
            fetchReviews();
        }
    }, [artist]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalRef, onClose]);

    const fetchReviews = async () => {
        try {
            const res = await getReviewsApi(artist._id);
            const sanitizedReviews = res.data.reviews.map((review) => ({
                ...review,
                comment: DOMPurify.sanitize(review.comment) // Sanitize stored reviews
            }));
            setReviews(sanitizedReviews);
            calculateAverageRating(sanitizedReviews);
        } catch (err) {
            toast.error("Failed to fetch reviews");
        }
    };

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) {
            setAverageRating(0);
            return;
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating(totalRating / reviews.length);
    };

    const handleBookNowClick = () => {
        setShowBookingForm(true);
    };

    const submitReview = async () => {
        if (!rating || !newReview) {
            toast.error("Please provide both rating and comment");
            return;
        }

        try {
            const sanitizedReview = DOMPurify.sanitize(newReview); // Sanitize before submitting
            const res = await addReviewApi({ artistId: artist._id, rating, comment: sanitizedReview });
            toast.success(res.data.message);
            fetchReviews(); // Refresh reviews after submitting a new one
            setRating(1); // Reset rating
            setNewReview(""); // Reset comment
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Failed to submit review");
            }
        }
    };

    if (!artist) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <img
                    src={`https://localhost:5000/artists/${artist.artistImage}`}
                    alt={artist.artistName}
                    className="modal-image"
                />
                <div className="modal-info">
                    <h2>{artist.artistName}</h2>
                    <p className="genre">{artist.artistGenre}</p>
                    <p>{artist.artistDescription}</p>
                    <p>Rate: {artist.artistRate}</p>
                    <div className="average-rating">
                        <Rating
                            value={averageRating}
                            edit={false}
                            size={24}
                            activeColor="#ffd700"
                        />
                        <p>{averageRating.toFixed(1)} out of 5</p>
                    </div>
                </div>
                <div className="review-section">
                    <h3>Write a Review</h3>
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(DOMPurify.sanitize(e.target.value))}
                        placeholder="Write your review here..."
                        rows="4"
                        className="review-textarea form-control"
                    />
                    <div className="rating-input mt-2 d-flex align-items-center">
                        <label className='me-2'>Rating:</label>
                        <Rating
                            value={rating}
                            onChange={setRating}
                            size={24}
                            activeColor="#ffd700"
                        />
                    </div>
                    <button className="btn btn-purple" onClick={submitReview}>Submit Review</button>
                    <div className="reviews-list">
                        <h3>Reviews:</h3>
                        {reviews.length === 0 ? (
                            <p>No reviews yet.</p>
                        ) : (
                            reviews.map((rev, index) => (
                                <div key={index} className="review-item border">
                                    <p><strong>{rev.userId.firstName} {rev.userId.lastName}</strong></p>
                                    <Rating
                                        value={rev.rating}
                                        edit={false}
                                        size={24}
                                        activeColor="#ffd700"
                                    />
                                    <p>{rev.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {showBookingForm && (
                    <div className="booking-form-modal">
                        <BookingForm />
                        <button className="btn btn-secondary mt-2" onClick={() => setShowBookingForm(false)}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtistModal;


// import React, { useState, useEffect, useRef } from 'react';
// import './ArtistModel.css';
// import BookingForm from '../pages/book/BookingForm'; // Import the BookingForm component
// import { addReviewApi, getReviewsApi } from '../apis/Api';
// import { toast } from 'react-toastify'; // Import toast for notifications
// import Rating from 'react-rating-stars-component';

// const ArtistModal = ({ artist, onClose }) => {
//     const [reviews, setReviews] = useState([]);
//     const [newReview, setNewReview] = useState('');
//     const [rating, setRating] = useState(1);
//     const [showBookingForm, setShowBookingForm] = useState(false);
//     const [averageRating, setAverageRating] = useState(0);
//     const modalRef = useRef(null);

//     useEffect(() => {
//         if (artist) {
//             fetchReviews();
//         }
//     }, [artist]);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (modalRef.current && !modalRef.current.contains(event.target)) {
//                 onClose();
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);

//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [modalRef, onClose]);

//     const fetchReviews = async () => {
//         try {
//             const res = await getReviewsApi(artist._id);
//             setReviews(res.data.reviews);
//             calculateAverageRating(res.data.reviews);
//         } catch (err) {
//             toast.error("Failed to fetch reviews");
//         }
//     };

//     const calculateAverageRating = (reviews) => {
//         if (reviews.length === 0) {
//             setAverageRating(0);
//             return;
//         }
//         const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//         setAverageRating(totalRating / reviews.length);
//     };

//     const handleBookNowClick = () => {
//         setShowBookingForm(true);
//     };

//     const submitReview = async () => {
//         if (!rating || !newReview) {
//             toast.error("Please provide both rating and comment");
//             return;
//         }

//         try {
//             const res = await addReviewApi({ artistId: artist._id, rating, comment: newReview });
//             toast.success(res.data.message);
//             fetchReviews(); // Refresh reviews after submitting a new one
//             setRating(1); // Reset rating
//             setNewReview(""); // Reset comment
//         } catch (err) {
//             if (err.response && err.response.data && err.response.data.message) {
//                 toast.error(err.response.data.message);
//             } else {
//                 toast.error("Failed to submit review");
//             }
//         }
//     };

//     if (!artist) return null;

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content" ref={modalRef}>
//                 <img
//                     src={`https://localhost:5000/artists/${artist.artistImage}`}
//                     alt={artist.artistName}
//                     className="modal-image"
//                 />
//                 <div className="modal-info">
//                     <h2>{artist.artistName}</h2>
//                     <p className="genre">{artist.artistGenre}</p>
//                     <p>{artist.artistDescription}</p>
//                     <p>Rate: {artist.artistRate}</p>
//                     <div className="average-rating">
//                         <Rating
//                             value={averageRating}
//                             edit={false}
//                             size={24}
//                             activeColor="#ffd700"
//                         />
//                         <p>{averageRating.toFixed(1)} out of 5</p>
//                     </div>
//                 </div>
//                 <div className="review-section">
//                     <h3>Write a Review</h3>
//                     <textarea
//                         value={newReview}
//                         onChange={(e) => setNewReview(e.target.value)}
//                         placeholder="Write your review here..."
//                         rows="4"
//                         className="review-textarea form-control"
//                     />
//                     <div className="rating-input mt-2 d-flex align-items-center">
//                         <label className='me-2'>Rating:</label>
//                         <Rating
//                             value={rating}
//                             onChange={setRating}
//                             size={24}
//                             activeColor="#ffd700"
//                         />
//                     </div>
//                     <button className="btn btn-purple" onClick={submitReview}>Submit Review</button>
//                     <div className="reviews-list">
//                         <h3>Reviews:</h3>
//                         {reviews.length === 0 ? (
//                             <p>No reviews yet.</p>
//                         ) : (
//                             reviews.map((rev, index) => (
//                                 <div key={index} className="review-item border">
//                                     <p><strong>{rev.userId.firstName} {rev.userId.lastName}</strong></p>
//                                     <Rating
//                                         value={rev.rating}
//                                         edit={false}
//                                         size={24}
//                                         activeColor="#ffd700"
//                                     />
//                                     <p>{rev.comment}</p>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//                 {showBookingForm && (
//                     <div className="booking-form-modal">
//                         <BookingForm />
//                         <button className="btn btn-secondary mt-2" onClick={() => setShowBookingForm(false)}>Close</button>
//                     </div>
//                 )}
//             </div>
//         </div>

//     );
// };

// export default ArtistModal;
