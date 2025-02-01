import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserBookings, updatePaymentMethod } from '../../apis/Api';
import KhaltiCheckout from 'khalti-checkout-web';
import config from '../../components/KhaltiConfig'; // existing config import

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

    // --------------------------------------------------------------------------------
    // KHALTI CONFIG & PAYMENT HANDLER
    // --------------------------------------------------------------------------------
    const khaltiConfig = {
        publicKey: 'test_public_key_0e1cf205988d4124b151e7a0288cefa4', // same as your sample
        productIdentity: '1234567890',
        productName: 'Doctor Payment',
        productUrl: 'http://localhost:3000',
        paymentPreference: [
            'KHALTI',
            'EBANKING',
            'MOBILE_BANKING',
            'CONNECT_IPS',
            'SCT',
        ],
        eventHandler: {
            onSuccess(payload) {
                console.log('Khalti payment success payload:', payload);
                toast.success('Khalti Payment Successful!');
                // If you want to update DB only after successful payment,
                // move handlePaymentMethod('Khalti') here.
            },
            onError(error) {
                console.error('Khalti payment error:', error);
                toast.error('Khalti Payment Failed!');
            },
            onClose() {
                console.log('Khalti widget is closing');
            },
        },
    };


    const handleKhaltiPayment = () => {
        // Create a local config that overrides/extends your imported config
        const localKhaltiConfig = {
            ...config,
            eventHandler: {
                onSuccess(payload) {
                    console.log('Khalti payment success payload:', payload);
                    toast.success('Khalti Payment Successful!');
                    // Update DB only after successful payment
                    handlePaymentMethod('Khalti');
                },
                onError(error) {
                    console.error('Khalti payment error:', error);
                    toast.error('Khalti Payment Failed!');
                },
                onClose() {
                    console.log('Khalti widget is closing');
                },
            },
        };

        let checkout = new KhaltiCheckout(localKhaltiConfig);
        // We'll pass 1000 paisa => Rs. 10 to avoid the "Amount should be less than 200" error
        checkout.show({ amount: 1000 });
    };
    // --------------------------------------------------------------------------------

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
                            <th>Payment Method</th>
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

                                    {/* Show Payment Method Here */}
                                    <td>
                                        {booking?.paymentMethod === 'Khalti'
                                            ? 'Paid by Khalti'
                                            : booking?.paymentMethod === 'Cash on arrival'
                                                ? 'Cash on Arrival'
                                                : 'Not Paid'}
                                    </td>

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
                    <div className="modal-dialog modal-dialog-centered modal-lg">
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
