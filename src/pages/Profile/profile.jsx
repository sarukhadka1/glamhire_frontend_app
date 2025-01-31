// import React, { useState, useEffect } from 'react';
// import { getUserProfileApi, updateUserProfileApi } from '../../apis/Api';
// import { toast } from 'react-toastify';
// import './Profile.css'; // Ensure you have this file for custom styles
// import { Navbar } from 'react-bootstrap';
 
 
// const Profile = () => {
//   const [user, setUser] = useState({});
//   const [editMode, setEditMode] = useState(false);
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
 
//   useEffect(() => {
//     getUserProfileApi()
//       .then((res) => {
//         setUser(res.data);
//         setFirstName(res.data.firstName);
//         setLastName(res.data.lastName);
//         setPhone(res.data.phone);
//       })
//       .catch((error) => {
//         toast.error('Error fetching user data');
//       });
//   }, []);
 
//   const handleUpdateProfile = (e) => {
//     e.preventDefault();
//     updateUserProfileApi({ firstName, lastName, phone, password })
//       .then((res) => {
//         toast.success('Profile updated successfully');
//         setUser(res.data);
//         setEditMode(false);
//       })
//       .catch((error) => {
//         toast.error('Error updating profile');
//       });
//   };
 
//   return (
    
    
//     <div className="profile-container">
//       <div className="profile-card">
//         <div className="profile-header">
//           <img
//             src="../../assets/images/logo.png"
//             alt="Company Logo"
//           />
//           <h1>User Profile</h1>
//         </div>
//         {!editMode ? (
//           <div className="profile-info">
//             <div className="profile-row">
//               <label>First Name:</label>
//               <p>{user.firstName}</p>
//             </div>
//             <div className="profile-row">
//               <label>Last Name:</label>
//               <p>{user.lastName}</p>
//             </div>
//             <div className="profile-row">
//               <label>Email:</label>
//               <p>{user.email}</p>
//             </div>
//             <div className="profile-row">
//               <label>Phone:</label>
//               <p>{user.phone}</p>
//             </div>
//             <button
//               onClick={() => setEditMode(true)}
//               className="bg-purple-500 text-white py-2 px-4 rounded"
//             >
//               Edit Profile
//             </button>
//           </div>
//         ) : (
//           <form onSubmit={handleUpdateProfile} className="edit-profile-form">
//             <div className="form-group mb-4">
//               <label>First Name</label>
//               <input
//                 type="text"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//               />
//             </div>
//             <div className="form-group mb-4">
//               <label>Last Name</label>
//               <input
//                 type="text"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//               />
//             </div>
//             <div className="form-group mb-4">
//               <label>Phone</label>
//               <input
//                 type="text"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//               />
//             </div>
//             <div className="form-group mb-4">
//               <label>Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <div className="flex justify-between mt-6">
//               <button
//                 type="button"
//                 onClick={() => setEditMode(false)}
//                 className="bg-purple-500 text-white py-2 px-4 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="bg-green-500 text-white py-2 px-4 rounded"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
     
//     </div>
//   );
// };
 
// export default Profile;


import React, { useState, useEffect } from 'react';
import { getUserProfileApi, updateUserProfileApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import './Profile.css'; // Ensure you have this file for custom styles
import { Navbar } from 'react-bootstrap';

const Profile = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState(''); // New Password Field
  const [passwordStrength, setPasswordStrength] = useState(0); // Password Strength State

  useEffect(() => {
    getUserProfileApi()
      .then((res) => {
        setUser(res.data);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setPhone(res.data.phone);
      })
      .catch((error) => {
        toast.error('Error fetching user data');
      });
  }, []);

  // Function to calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    const regexes = [
      /.{8,}/, // Minimum 8 characters
      /[A-Z]/, // Contains uppercase letters
      /[0-9]/, // Contains numbers
      /[!@#$%^&*(),.?":{}|<>]/, // Contains special characters
    ];

    regexes.forEach((regex) => {
      if (regex.test(password)) {
        strength += 25;
      }
    });

    // Additional points for mixed character types
    if (regexes[0].test(password) && regexes[1].test(password)) strength += 10;
    if (regexes[2].test(password) && regexes[3].test(password)) strength += 10;

    // Cap the strength at 100%
    if (strength > 100) strength = 100;

    return strength;
  };

  // Handle new password input change
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    const strength = calculatePasswordStrength(pwd);
    setPasswordStrength(strength);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    // Validation: Ensure new password is not the same as the existing password
    // Note: Client-side cannot verify existing password; this should be handled server-side
    // Here, we ensure that the new password is provided and meets strength criteria
    if (password && passwordStrength < 50) {
      toast.error('Password strength must be at least 50%');
      return;
    }

    // Prepare the payload
    const payload = {
      firstName,
      lastName,
      phone,
    };

    // Include password if it's provided
    if (password) {
      payload.password = password;
    }

    updateUserProfileApi(payload)
      .then((res) => {
        toast.success('Profile updated successfully');
        setUser(res.data);
        setEditMode(false);
        // Reset password fields
        setPassword('');
        setPasswordStrength(0);
      })
      .catch((error) => {
        // Handle specific error messages from the server
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Error updating profile');
        }
      });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src="../../assets/images/logo.png"
            alt="Company Logo"
          />
          <h1>User Profile</h1>
        </div>
        {!editMode ? (
          <div className="profile-info">
            <div className="profile-row">
              <label>First Name:</label>
              <p>{user.firstName}</p>
            </div>
            <div className="profile-row">
              <label>Last Name:</label>
              <p>{user.lastName}</p>
            </div>
            <div className="profile-row">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>
            <div className="profile-row">
              <label>Phone:</label>
              <p>{user.phone}</p>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="bg-purple-500 text-white py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="edit-profile-form">
            <div className="form-group mb-4">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label>Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* New Password Field */}
            <div className="form-group mb-4">
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
              {/* Password Strength Bar */}
              {password && (
                <div className="password-strength">
                  <div
                    className="strength-bar"
                    style={{
                      width: `${passwordStrength}%`,
                      backgroundColor:
                        passwordStrength < 50
                          ? '#ff4d4d' // Red for weak
                          : passwordStrength < 75
                          ? '#ffa500' // Orange for medium
                          : '#76c7c0', // Green for strong
                    }}
                  ></div>
                  <span className="strength-text">{passwordStrength}% Strength</span>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  // Reset password fields when cancelling
                  setPassword('');
                  setPasswordStrength(0);
                }}
                className="bg-purple-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
