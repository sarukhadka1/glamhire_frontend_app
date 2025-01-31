import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import BookingForm from '../pages/book/BookingForm'; // Ensure this path is correct for your project

const AdminNavbar = () => {
  // Get user data from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  return (
    <div className='container-fluid p-0'>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Glam <font color='purple'>Hire</font></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/admin/dashboard" style={{ color: 'purple' }}>Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/contactus" style={{ color: 'purple' }}>ViewContact</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/artist" style={{ color: 'purple' }}>Artist</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/admin/bookingList" style={{ color: 'purple' }}>Bookings</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/admin/users" style={{ color: 'purple' }}>Users</Link>
              </li>
              
              
            </ul>
            <form className="d-flex" role="search">
              {
                user ? (
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: 'purple', borderColor: 'purple' }}>
                      Welcome, {user.firstName}!
                    </button>
                     <ul className="dropdown-menu">
                      <li>
                        <Link to="/profile" className="dropdown-item">
                          Profile
                        </Link>
                      </li>
                      <li><a className="dropdown-item" href="#">Settings</a></li>
                      <li><button onClick={handleLogout} className="dropdown-item">Log Out</button></li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <Link to={'/login'} className="btn btn-primary" type="button">Login</Link>
                    <Link to={'/register'} className="btn btn-success ms-2" type="button">Register</Link>
                  </>
                )
              }
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
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
