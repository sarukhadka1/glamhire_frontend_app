import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserBookings, updatePaymentMethod } from '../../apis/Api';
import KhaltiCheckout from "khalti-checkout-web";
import config from '../../components/KhaltiConfig';

const UserBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getUserBookings();
                console.log(response.data);
                setBookings(response.data.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                toast.error('Error fetching bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleProceedToPayment = (booking) => {
        setSelectedBooking(booking);
        setShowPaymentModal(true);
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
        setSelectedBooking(null);
    };

    const handlePaymentMethod = async (method) => {
        try {
            if (method === 'Cash on arrival') {
                toast.success('You have selected to pay upon arrival. Please wait for your booking approval.');
            }

            await updatePaymentMethod({ bookingId: selectedBooking._id, paymentMethod: method });
            setShowPaymentModal(false);

            const updatedBookings = bookings.map((booking) =>
                booking._id === selectedBooking._id ? { ...booking, paymentMethod: method } : booking
            );
            setBookings(updatedBookings);
        } catch (error) {
            console.error('Error updating payment method:', error);
        }
    };

    const handleKhaltiPayment = () => {
        let checkout = new KhaltiCheckout(config);
        checkout.show({ amount: 200 });
        handlePaymentMethod('Khalti');
    };

    return (
        <div className="container mt-5">
            <h1>My Bookings</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Artist</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.artist.artistName}</td>
                                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                                    <td>{booking.time}</td>
                                    <td>{booking.status}</td>
                                    <td>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ backgroundColor: 'purple', borderColor: 'purple' }}
                                            onClick={() => handleProceedToPayment(booking)}
                                        >
                                            Proceed to Payment
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No bookings available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            {showPaymentModal && (
                <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg"> {/* Made the modal wider by adding 'modal-lg' */}
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select a payment method:</h5>
                            </div>
                            <div className="modal-body text-center">
                                <div className="d-flex justify-content-center">
                                    <button
                                        className="btn btn-secondary me-2"
                                        style={{ backgroundColor: 'pink', borderColor: 'pink' }}
                                        onClick={() => handlePaymentMethod('Cash on arrival')}
                                    >
                                        Pay upon Arrival
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ backgroundColor: 'purple', borderColor: 'purple' }}
                                        onClick={handleKhaltiPayment}
                                    >
                                        Khalti Payment
                                    </button>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{ backgroundColor: 'purple', borderColor: 'purple' }}
                                    onClick={handleClosePaymentModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserBooking;
