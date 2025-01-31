import React, { useEffect, useState } from 'react';
import { FaBook, FaPhoneAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { createBooking, getSingleArtist } from '../../apis/Api'; // Replace with your actual API call
import { toast } from 'react-toastify';
import './ViewArtist.css'; // Import the CSS file

const ViewArtist = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: ''
  });
  const [minDate, setMinDate] = useState('');
  const [minTime, setMinTime] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await getSingleArtist(id);
        setArtist(res.data.artist);
      } catch (error) {
        console.log('Error fetching artist:', error);
      }
    };

    fetchArtist();

    const now = new Date();
    setMinDate(now.toISOString().split('T')[0]);
    setMinTime(now.toTimeString().slice(0, 5));
  }, [id]);

  const handleCallClick = () => setShowCallModal(true);
  const handleBookClick = () => setShowBookingModal(true);
  const handleCloseCallModal = () => setShowCallModal(false);
  const handleCloseBookingModal = () => setShowBookingModal(false);

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));

    if (name === 'date') {
      const selectedDate = new Date(value);
      const currentDate = new Date(minDate);

      setMinTime(selectedDate.toDateString() === currentDate.toDateString()
        ? currentDate.toTimeString().slice(0, 5)
        : '00:00'
      );

      setBookingForm(prevForm => ({
        ...prevForm,
        time: ''
      }));
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      userId: user._id,
      artistId: id,
      date: bookingForm.date,
      time: bookingForm.time
    };

    try {
      const res = await createBooking(bookingData);
      console.log('Booking created:', res.data);
      setBookingForm({ name: '', email: '', phone: '', date: '', time: '' });
      setShowBookingModal(false);
      toast.success('Booking created successfully!');
    } catch (error) {
      console.error('Booking creation error:', error.response ? error.response.data : error.message);
      toast.error('Booking creation failed!');
    }
  };

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mt-5 artist-container">
        <div className="row align-items-center">
          <div className="col-md-5 image-container">
            <img
              src={`https://localhost:5000/artists/${artist.artistImage}`}
              alt={artist.artistName}
              className="img-fluid artist-image"
            />
          </div>
          <div className="col-md-7 text-container">
            <h1 className="artist-name">{artist.artistName}</h1>
            <h3 className="artist-genre">Genre: {artist.artistGenre}</h3>
            <p className="artist-description">{artist.artistDescription}</p>
            <h4 className="artist-rate text-danger">Rs {artist.artistRate}</h4>
            <button onClick={handleBookClick} className="btn btn-purple me-2"><FaBook /> Book</button>
            <button onClick={handleCallClick} className="btn btn-pink"><FaPhoneAlt /> Call</button>
          </div>
        </div>
      </div>

      {showCallModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contact Information</h5>
                <button type="button" className="btn-close" onClick={handleCloseCallModal}></button>
              </div>
              <div className="modal-body text-center">
                <h1>+977 9840720919</h1>
                <p>Make a call, get booked.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-purple" onClick={handleCloseCallModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-purple">Book Artist</h5>
                <button type="button" className="btn-close" onClick={handleCloseBookingModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleBookingSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={bookingForm.name} onChange={handleBookingFormChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={bookingForm.email} onChange={handleBookingFormChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="tel" className="form-control" id="phone" name="phone" value={bookingForm.phone} onChange={handleBookingFormChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">Preferred Date</label>
                    <input type="date" className="form-control" id="date" name="date" value={bookingForm.date} onChange={handleBookingFormChange} min={minDate} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="time" className="form-label">Preferred Time</label>
                    <input type="time" className="form-control" id="time" name="time" value={bookingForm.time} onChange={handleBookingFormChange} min={minTime} required />
                  </div>
                  <button type="submit" className="btn btn-purple">Submit Booking</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewArtist;














// import React, { useEffect, useState } from 'react';
// import { FaBook, FaPhoneAlt } from 'react-icons/fa';
// import { useParams } from 'react-router-dom';
// import { createBooking, getSingleArtist } from '../../apis/Api'; // Replace with your actual API call
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications
// import './ViewArtist.css'; // Import the CSS file

// const ViewArtist = () => {
//   const { id } = useParams();
//   const [artist, setArtist] = useState(null);
//   const [showCallModal, setShowCallModal] = useState(false);
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [bookingForm, setBookingForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     date: '',
//     time: ''
//   });
//   const [minDate, setMinDate] = useState('');
//   const [minTime, setMinTime] = useState('');
//   const user = JSON.parse(localStorage.getItem('user'));

//   useEffect(() => {
//     const fetchArtist = async () => {
//       try {
//         const res = await getSingleArtist(id);
//         setArtist(res.data.artist);
//       } catch (error) {
//         console.log('Error fetching artist:', error);
//       }
//     };

//     fetchArtist();

//     const now = new Date();
//     setMinDate(now.toISOString().split('T')[0]);
//     setMinTime(now.toTimeString().slice(0, 5));
//   }, [id]);

//   const handleCallClick = () => setShowCallModal(true);
//   const handleBookClick = () => setShowBookingModal(true);
//   const handleCloseCallModal = () => setShowCallModal(false);
//   const handleCloseBookingModal = () => setShowBookingModal(false);

//   const handleBookingFormChange = (e) => {
//     const { name, value } = e.target;
//     setBookingForm(prevForm => ({
//       ...prevForm,
//       [name]: value
//     }));

//     if (name === 'date') {
//       const selectedDate = new Date(value);
//       const currentDate = new Date(minDate);

//       setMinTime(selectedDate.toDateString() === currentDate.toDateString()
//         ? currentDate.toTimeString().slice(0, 5)
//         : '00:00'
//       );

//       setBookingForm(prevForm => ({
//         ...prevForm,
//         time: ''
//       }));
//     }
//   };

//   const handleBookingSubmit = async (e) => {
//     e.preventDefault();
//     const bookingData = {
//       userId: user._id,
//       artistId: id,
//       date: bookingForm.date,
//       time: bookingForm.time
//     };

//     try {
//       const res = await createBooking(bookingData);
//       console.log('Booking created:', res.data);
//       setBookingForm({ name: '', email: '', phone: '', date: '', time: '' });
//       setShowBookingModal(false);
//       toast.success('Artist booked successfully!');  // Success toast
//     } catch (error) {
//       console.error('Booking creation error:', error.response ? error.response.data : error.message);
//       toast.error('Booking creation failed!');  // Error toast
//     }
//   };

//   if (!artist) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <div className="container mt-5 artist-container">
//         <div className="row align-items-center">
//           <div className="col-md-5 image-container">
//             <img
//               src={`https://localhost:5000/artists/${artist.artistImage}`}
//               alt={artist.artistName}
//               className="img-fluid artist-image"
//             />
//           </div>
//           <div className="col-md-7 text-container">
//             <h1 className="artist-name">{artist.artistName}</h1>
//             <h3 className="artist-genre">Genre: {artist.artistGenre}</h3>
//             <p className="artist-description">{artist.artistDescription}</p>
//             <h4 className="artist-rate text-danger">Rs {artist.artistRate}</h4>
//             <button onClick={handleBookClick} className="btn btn-purple me-2"><FaBook /> Book</button>
//             <button onClick={handleCallClick} className="btn btn-pink"><FaPhoneAlt /> Call</button>
//           </div>
//         </div>
//       </div>

//       {showCallModal && (
//         <div className="modal fade show" style={{ display: 'block' }}>
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Contact Information</h5>
//                 <button type="button" className="btn-close" onClick={handleCloseCallModal}></button>
//               </div>
//               <div className="modal-body text-center">
//                 <h1>+977 9840720919</h1>
//                 <p>Make a call, get booked.</p>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-purple" onClick={handleCloseCallModal}>Close</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showBookingModal && (
//         <div className="modal fade show" style={{ display: 'block' }}>
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title text-purple">Book Artist</h5>
//                 <button type="button" className="btn-close" onClick={handleCloseBookingModal}></button>
//               </div>
//               <div className="modal-body">
//                 <form onSubmit={handleBookingSubmit}>
//                   <div className="mb-3">
//                     <label htmlFor="name" className="form-label">Name</label>
//                     <input type="text" className="form-control" id="name" name="name" value={bookingForm.name} onChange={handleBookingFormChange} required />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="email" className="form-label">Email</label>
//                     <input type="email" className="form-control" id="email" name="email" value={bookingForm.email} onChange={handleBookingFormChange} required />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="phone" className="form-label">Phone</label>
//                     <input type="tel" className="form-control" id="phone" name="phone" value={bookingForm.phone} onChange={handleBookingFormChange} required />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="date" className="form-label">Preferred Date</label>
//                     <input type="date" className="form-control" id="date" name="date" value={bookingForm.date} onChange={handleBookingFormChange} min={minDate} required />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="time" className="form-label">Preferred Time</label>
//                     <input type="time" className="form-control" id="time" name="time" value={bookingForm.time} onChange={handleBookingFormChange} min={minTime} required />
//                   </div>
//                   <button type="submit" className="btn btn-purple">Submit Booking</button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <ToastContainer /> {/* Add ToastContainer to render toasts */}
//     </>
//   );
// };

// export default ViewArtist;

// import React, { useEffect, useState } from 'react';
// import { FaBook, FaPhoneAlt } from 'react-icons/fa';
// import { useParams } from 'react-router-dom';
// import { createBooking, getSingleArtist, getUserProfileApi } from '../../apis/Api'; // Replace with your actual API call
// import { toast } from 'react-toastify';
// import './ViewArtist.css'; // Import the CSS file

// const ViewArtist = () => {
//   const { id } = useParams();
//   const [artist, setArtist] = useState(null);
//   const [showCallModal, setShowCallModal] = useState(false);
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [bookingForm, setBookingForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     date: '',
//     time: ''
//   });
//   const [minDate, setMinDate] = useState('');
//   const [minTime, setMinTime] = useState('');
//   const user = JSON.parse(localStorage.getItem('user'));

//   useEffect(() => {
//     const fetchArtist = async () => {
//       try {
//         const res = await getSingleArtist(id);
//         setArtist(res.data.artist);
//       } catch (error) {
//         console.log('Error fetching artist:', error);
//       }
//     };
//     fetchArtist();

//     const now = new Date();
//     setMinDate(now.toISOString().split('T')[0]);
//     setMinTime(now.toTimeString().slice(0, 5));
//   }, [id]);

//   const handleCallClick = () => setShowCallModal(true);
//   const handleBookClick = () => setShowBookingModal(true);
//   const handleCloseCallModal = () => setShowCallModal(false);
//   const handleCloseBookingModal = () => setShowBookingModal(false);

//   const handleBookingFormChange = (e) => {
//     const { name, value } = e.target;
//     setBookingForm(prevForm => ({
//       ...prevForm,
//       [name]: value
//     }));

//     if (name === 'date') {
//       const selectedDate = new Date(value);
//       const currentDate = new Date(minDate);

//       setMinTime(selectedDate.toDateString() === currentDate.toDateString()
//         ? currentDate.toTimeString().slice(0, 5)
//         : '00:00'
//       );

//       setBookingForm(prevForm => ({
//         ...prevForm,
//         time: ''
//       }));
//     }
//   };

//   const handleBookingSubmit = async (e) => {
//     e.preventDefault();

//     // Check if all fields are filled before submitting
//     // if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.date || !bookingForm.time) {
//     //   toast.error('Please fill in all fields!');
//     //   return;
//     // }

//     const bookingData = {
//       userId: user._id,
//       artistId: id,
//       date: bookingForm.date,
//       time: bookingForm.time
//     };

//     try {
//       const res = await createBooking(bookingData);
//       console.log('Booking created:', res.data);
//       setBookingForm({ name: '', email: '', phone: '', date: '', time: '' });
//       setShowBookingModal(false);
//       toast.success('Booking created successfully!');
//     } catch (error) {
//       console.error('Booking creation error:', error.response ? error.response.data : error.message);
//       toast.error('Booking creation failed!');
//     }
//   };

//   if (!artist) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <div className="container mt-5 artist-container">
//         <div className="row align-items-center">
//           <div className="col-md-5 image-container">
//             <img
//               src={`https://localhost:5000/artists/${artist.artistImage}`}
//               alt={artist.artistName}
//               className="img-fluid artist-image"
//             />
//           </div>
//           <div className="col-md-7 text-container">
//             <h1 className="artist-name">{artist.artistName}</h1>
//             <h3 className="artist-genre">Genre: {artist.artistGenre}</h3>
//             <p className="artist-description">{artist.artistDescription}</p>
//             <h4 className="artist-rate text-danger">Rs {artist.artistRate}</h4>
//             <button onClick={handleBookClick} className="btn btn-purple me-2"><FaBook /> Book</button>
//             <button onClick={handleCallClick} className="btn btn-pink"><FaPhoneAlt /> Call</button>
//           </div>
//         </div>
//       </div>

//       {showCallModal && (
//         <div className="modal fade show" style={{ display: 'block' }}>
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Contact Information</h5>
//                 <button type="button" className="btn-close" onClick={handleCloseCallModal}></button>
//               </div>
//               <div className="modal-body text-center">
//                 <h1>+977 9840720919</h1>
//                 <p>Make a call, get booked.</p>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-purple" onClick={handleCloseCallModal}>Close</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showBookingModal && (
//         <div className="modal fade show" style={{ display: 'block' }}>
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title text-purple">Book Artist</h5>
//                 <button type="button" className="btn-close" onClick={handleCloseBookingModal}></button>
//               </div>
//               <div className="modal-body">
//                 <form onSubmit={handleBookingSubmit}>
//                   <div className="mb-3">
//                     <label htmlFor="name" className="form-label">Name</label>
//                     <input type="text" className="form-control" id="name" name="name" value={bookingForm.name} onChange={handleBookingFormChange} required />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="email" className="form-label">Email</label>
//                     <input type="email" className="form-control" id="email" name="email" value={bookingForm.email} onChange={handleBookingFormChange} required />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="phone" className="form-label">Phone</label>
//                     <input type="tel" className="form-control" id="phone" name="phone" value={bookingForm.phone} onChange={handleBookingFormChange} required />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="date" className="form-label">Preferred Date</label>
//                     <input type="date" className="form-control" id="date" name="date" value={bookingForm.date} onChange={handleBookingFormChange} min={minDate} required />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="time" className="form-label">Preferred Time</label>
//                     <input type="time" className="form-control" id="time" name="time" value={bookingForm.time} onChange={handleBookingFormChange} min={minTime} required />
//                   </div>
//                   <button type="submit" className="btn btn-purple">Submit Booking</button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ViewArtist;
