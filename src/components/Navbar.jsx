// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
// //import BookingForm from '../pages/book/BookingForm'; // Ensure this path is correct for your project

// const Navbar = () => {
//   // Get user data from local storage
//   const user = JSON.parse(localStorage.getItem('user'));
//   const navigate = useNavigate();

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     navigate("/login");
//     window.dispatchEvent(new Event('storage'));

//   }

//   return (
//     <div className='container-fluid p-0'>
//       <nav className="navbar navbar-expand-lg bg-body-tertiary">
//         <div className="container-fluid">
//           <a className="navbar-brand" href="#">Glam <font color='purple'>Hire</font></a>
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarSupportedContent">
//             <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
//             <li className="nav-item">
//                 <Link className="nav-link" aria-current="page" to="/homepage" style={{ color: 'purple' }}>Dashboard</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" aria-current="page" to="/fav" style={{ color: 'purple' }}>My Wishlist</Link>
//               </li>
//               <li className="nav-item">
//                 <Link to="/my_bookings" className="nav-link" aria-current="page" style={{ color: 'purple' }}>My booking</Link>
//               </li>
              
              
//             </ul>
//             <form className="d-flex" role="search">
//               {
//                 user ? (
//                   <div className="dropdown">
//                     <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: 'purple', borderColor: 'purple' }}>
//                       Welcome, {user.firstName}!
//                     </button>
//                     <ul className="dropdown-menu">
//                       <li>
//                         <Link to="/profile" className="dropdown-item">
//                           Profile
//                         </Link>
//                       </li>
                      
//                       <li><button onClick={handleLogout} className="dropdown-item">Log Out</button></li>
//                     </ul>
//                   </div>
//                 ) : (
//                   <>
//                     <Link to={'/login'} className="btn btn-pink" type="button">Login</Link>
//                     <Link to={'/register'} className="btn btn-purple ms-2" type="button">Register</Link>
//                   </>
//                 )
//               }
//             </form>
//           </div>
//         </div>
//       </nav>

//       {/* Modal for Booking Form */}
//       <div className="modal fade" id="bookingModal" tabIndex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="bookingModalLabel">Book an Appointment</h5>
//               <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeBookingModal"></button>
//             </div>
//             <div className="modal-body">
//               {/* <BookingForm /> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Navbar;

// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUserApi, getUserDetails } from '../apis/Api'; // Ensure these are named exports
import { ToastContainer, toast } from 'react-toastify'; // Correct import for ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // React Toastify CSS
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome CSS
import './Navbar.css'; // Your custom CSS (if any)

const Navbar = () => {
  const navigate = useNavigate();

  // Retrieve user and token from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // State for welcome message
  const [welcomeMessage, setWelcomeMessage] = useState('');

  // Effect to fetch user details and set welcome message
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.id) { // Ensure user ID exists
        console.log("Fetching data for user ID:", user.id);
        try {
          const response = await getUserDetails(user.id);
          console.log("User details response:", response);
          if (response.status === 200 && response.data.success) {
            setWelcomeMessage(`Welcome back, ${response.data.user.firstName}!`);
          } else {
            throw new Error(response.data.message || 'Failed to fetch user data');
          }
        } catch (error) {
          console.error('Failed to fetch user data', error);
          setWelcomeMessage('');
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Logout handler
  const handleLogout = async () => {
    if (!token) {
      // If no token is present, simply remove user and navigate to login
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    try {
      const response = await logoutUserApi(); // Call your logout API
      console.log("Logout response:", response);

      if (response.status === 200 && response.data.success) {
        // Remove user and token from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Show success toast notification
        toast.success(response.data.message || 'Logged out successfully!');

        // Navigate to login page after a short delay to allow toast to show
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Logout failed');
      }
    } catch (error) {
      console.error("Logout error:", error);

      // Show error toast notification
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <div className='container-fluid p-0'>
      {/* Initialize Toast Container */}
      <ToastContainer />

      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Glam <span style={{ color: 'purple' }}>Hire</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* Left Side Links */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/homepage" style={{ color: 'purple' }}>Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/fav" style={{ color: 'purple' }}>My Wishlist</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/my_bookings" style={{ color: 'purple' }}>My Booking</Link>
              </li>
            </ul>

            {/* Right Side: User Info or Login/Register */}
            <form className="d-flex" role="search">
              {user ? (
                <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false" style={{ backgroundColor: 'purple', borderColor: 'purple' }}>
                    <i className="fas fa-user mr-2"></i> {user.firstName}
                  </button>
                  <ul className="dropdown-menu">
                    {welcomeMessage && (
                      <li className="dropdown-item-text">
                        {welcomeMessage}
                      </li>
                    )}
                    <li>
                      <Link to="/profile" className="dropdown-item">
                        <i className="fas fa-user-circle mr-2"></i> Profile
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item">
                        <i className="fas fa-sign-out-alt mr-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <Link to='/login' className="btn btn-pink" type="button">Login</Link>
                  <Link to='/register' className="btn btn-purple ms-2" type="button">Register</Link>
                </>
              )}
            </form>
          </div>
        </div>
      </nav>

      {/* Modal for Booking Form */}
      <div className="modal fade" id="bookingModal" tabIndex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="bookingModalLabel">Book an Appointment</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeBookingModal"></button>
            </div>
            <div className="modal-body">
              {/* <BookingForm /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the Navbar component
export default Navbar;

