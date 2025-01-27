import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus } from '../../apis/Api';
import { toast } from 'react-toastify';
import './BookingList.css';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAllBookings();
        console.log(response.data);
        setBookings(response.data.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Error fetching bookings');
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const handleApprove = async (bookingId) => {
    try {
      await updateBookingStatus({bookingId, status: 'approved'});
      const updateBookings = bookings.map((booking) =>
        booking._id === bookingId ? { ...booking, status: 'approved' } : booking
      )
      setBookings(updateBookings);
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error('Error updating booking status');
    }
  };

  return (
    <div className="booking-list-container mt-5">
      <h1 className="booking-list-header">Booking List</h1>
      <div className="booking-table-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="booking-styled-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Artist</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <tr key={booking._id} className={index === 0 ? "first-row" : ""}>
                    <td>{booking.user?.firstName}</td>
                    <td>{booking.artist?.artistName}</td>
                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                    <td>{booking.time}</td>
                    <td>{booking.status}</td>
                    <td>{booking.paymentMethod}</td>
                    <td>
                      {booking.status === 'pending' && (
                        <button
                          className="btn btn-success"
                          onClick={() => handleApprove(booking._id)}
                          style={{ backgroundColor: 'pink', borderColor: 'purple', color: '#800080', padding: '10px 20px', borderRadius: '25px', fontFamily: 'Arial, sans-serif', fontSize: '1em', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No bookings available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* <button onClick={() => navigate('/admin/dashboard')} className="booking-back-button">Back to Dashboard</button> */}
    </div>
  );
};

export default BookingList;
