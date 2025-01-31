
import axios from 'axios';

const Api = axios.create({
    baseURL: 'https://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const getToken = () => localStorage.getItem('token');
const getConfig = () => ({
    headers: {
        'Authorization': `Bearer ${getToken()}`
    }
});

const config = {
    headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }

  
// Register API
export const registerUserApi = (data) => Api.post('/api/user/create', data);

// Login API
// export const loginUserApi = (data) => Api.post('/api/user/login', data);
export const loginUserApi = (data) => {
    return axios.post("https://localhost:5000/api/user/login", data, {
      // or your actual endpoint
      validateStatus: () => true,
    });
  };

// Create artist API
export const createArtistApi = (formData) => Api.post('/api/artist/create', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

// Add the following function to fetch all users
export const getAllUsersApi = () => Api.get('/api/user/all', getConfig());
 
// New logout API function
export const logoutUserApi = () => Api.post('/api/user/logout', null, getConfig());

// Get user details API
export const getUserDetails = (userId) => Api.get(`/api/user/${userId}`, getConfig());

// Get all artists API
export const getAllArtists = () => Api.get('/api/artist/get_all_artists', getConfig());

// Get single artist API
export const getSingleArtist = (id) => Api.get(`/api/artist/get_single_artist/${id}`, getConfig());

// Delete artist API
export const deleteArtist = (id) => Api.delete(`/api/artist/delete_artist/${id}`, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

// Update artist API
export const updateArtist = (id, data) => Api.put(`/api/artist/update_artist/${id}`, data, getConfig());

export const artistPagination = (page, limit, searchQuery = "", sortOrder = "asc") => {
    const query = `?page=${page}&limit=${limit}&q=${searchQuery}&sort=${sortOrder}`;
    return Api.get(`/api/artist/pagination${query}`);
  };

  export const getArtistCount = () => Api.get("/api/artist/get_artists_count");
  

  // Get user profile API
export const getUserProfileApi = () => Api.get('/api/user/profile', getConfig());
 
// Update user profile API
export const updateUserProfileApi = (data) => Api.put('/api/user/profile', data, getConfig());

export const forgotPasswordApi = (data) => Api.post('/api/user/forgot_password', data);
export const verifyOtpApi = (data) => Api.post('/api/user/verify_otp', data);


// Review APIs

export const addReviewApi = (data) => Api.post('/api/rating/add', data);
export const getReviewsApi = (artistId) => Api.get(`/api/rating/artist/${artistId}`);

// wishlist

export const getUserWishlistApi = () => Api.get('api/wishlist/all', config);
 
export const addToWishlistApi = (artistId) => {
  return Api.post(`/api/wishlist/add`, { artistId }, config);
};
 
export const removeFromWishlistApi = (artistId) => Api.delete( `api/wishlist/remove/${artistId}`, config);


//bookings
 
export const getAllBookings = () => Api.get('/api/booking/all_bookings', config)
 
export const createBooking = (bookingData) => Api.post('/api/booking/bookings', bookingData, config);
 
export const updateBookingStatus = (updateData) => Api.put('/api/booking/bookings/status', updateData, config)
 
export const getUserBookings = () => Api.get('/api/booking/mybookings', config);
 
export const updatePaymentMethod = (paymentData) => Api.put('/api/booking/bookings/payment', paymentData, config)
 



export const getAllContacts = () => Api.get('/api/contact/all', config);