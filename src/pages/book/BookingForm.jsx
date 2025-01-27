// import React, { useState } from 'react';
// import './BookingForm.css';
// import { createBookingApi } from '../../apis/Api'; // Adjust the path to your api.js file

// const BookingForm = ({ artist }) => {
//     const [service, setService] = useState('');
//     const [date, setDate] = useState('');
//     const [time, setTime] = useState('');
//     const [contact, setContact] = useState('');
//     const [message, setMessage] = useState('');

//     const validServices = ['engagement', 'bridal', 'reception', 'mehendi', 'party'];

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!service || !date || !time || !contact || !artist) {
//             setMessage('Booking Unsuccessful. Please fill in all fields.');
//             return;
//         }

//         if (!validServices.includes(service.toLowerCase())) {
//             setMessage('Booking Unsuccessful. Invalid service.');
//             return;
//         }

//         if (!/^\d{10}$/.test(contact)) {
//             setMessage('Booking Unsuccessful. Contact number must be 10 digits.');
//             return;
//         }

//         const bookingData = {
//             service,
//             appointmentDate: date,
//             appointmentTime: time,
//             contactNumber: contact,
//             artistId: artist._id // Use artist._id directly
//         };

//         try {
//             const response = await createBookingApi(bookingData);
//             if (response.data.success) {
//                 setMessage('Booked Successfully!');
//                 setTimeout(() => {
//                     setMessage('');
//                     // Assuming you have some method to close the modal or booking form
//                 }, 2000);
//             } else {
//                 setMessage('Booking Unsuccessful. Please try again.');
//             }
//         } catch (error) {
//             setMessage(`Booking Unsuccessful. Error: ${error.response ? error.response.data.message : error.message}`);
//         }
//     };

//     return (
//         <div>
//             <form onSubmit={handleSubmit} className="booking-form">
//                 <label>Choose Service:</label>
//                 <select
//                     value={service}
//                     onChange={(e) => setService(e.target.value)}
//                     className="form-select"
//                 >
//                     <option value="" disabled>Select a service</option>
//                     {validServices.map((service, index) => (
//                         <option key={index} value={service}>{service.charAt(0).toUpperCase() + service.slice(1)}</option>
//                     ))}
//                 </select>

//                 <label>Appointment Date:</label>
//                 <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                 />

//                 <label>Appointment Time:</label>
//                 <input
//                     type="time"
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                 />

//                 <label>Contact Number:</label>
//                 <input
//                     type="text"
//                     value={contact}
//                     onChange={(e) => setContact(e.target.value)}
//                 />

//                 <button type="submit" className="btn btn-primary mt-2 w-100">Submit</button>
//             </form>

//             {message && <p className="message">{message}</p>}
//         </div>
//     );
// };

// export default BookingForm;

