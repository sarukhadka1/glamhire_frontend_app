import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"

import Homepage from './pages/homepage/Homepage';
import Login from './pages/login/Loginpage';
import Register from './pages/register/Registerpage';
import Navbar from './components/Navbar';
import ArtistPanel from './pages/artist/ArtistPanel';
import ArtistDescription from './pages/artistdescription/ArtistDescription';
import Services from './pages/services/Services';
//Toast Config
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './pages/landing/LandingPage';
import BookingForm from './pages/book/BookingForm';
import AdminDashboard from './admin/admin_dashboard/AdminDashboard';
import UpdateArtist from './admin/update_artist/UpdateArtist';
import AdminRoutes from './pages/protected_routes/AdminRoutes';
import ArtistCard from './components/ArtistCard';
import Profile from './pages/Profile/profile';
import ForgotPassword from './pages/forgot_password/Forgot_password';
import Footer from './components/Footer';
import Favourites from './pages/favourites/Favourites';
import SwitchNavbar from './components/SwitchNavbar';
import ViewContact from './admin/view_contact/ViewContact';
import Contact from './pages/contactus/ContactUs';
import ViewArtist from './pages/viewartist/ViewArtist';
import UserBooking from './pages/book/UserBooking';
import BookingList from './admin/booking list/BookingList';
import Users from './admin/users/Users';




function App() {
  return (
    <Router>
      <SwitchNavbar />
      <ToastContainer />
      <Routes>
        <Route path='/homepage' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        

        <Route path='/artist' element={<ArtistPanel />} />
        <Route path='/artist/saru-khadka' element={<ArtistDescription />} />
        <Route path='/services' element={<Services />} />
        <Route path='/' element={<LandingPage />} />
        <Route path='/book' element={<BookingForm />} />
        <Route path='/atrists/:id' element={< ArtistCard/>} />
        <Route path='/view_artist/:id' element={<ArtistDescription />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/forgot_password' element={<ForgotPassword />} />
        <Route path='/fav' element={<Favourites />} />
        {/* <Route path='/mybooking' element={<BookingList />} /> */}

        <Route path="/contactus" element={<ViewContact />} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/view/:id' element={<ViewArtist/>} />
        <Route path='/my_bookings' element={<UserBooking/>} />

        
        

        {/* admin route */}
        {/* <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/update/:id' element={<UpdateArtist />} /> */}

       
<Route element={<AdminRoutes/>}>
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/update/:id' element={<UpdateArtist />} />
          <Route path='/admin/bookingList' element={<BookingList />} />
          <Route path='/admin/users' element={<Users />} />
          
          

        </Route>
 

        
        
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
