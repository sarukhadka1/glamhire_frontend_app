import React, { useState } from 'react';
import { registerUserApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';  // Import ReCAPTCHA
import './Registerpage.css'; // Make sure to create and import this CSS file

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);  // State for CAPTCHA token

  // Error States
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [captchaError, setCaptchaError] = useState('');  // CAPTCHA error state

  const [passwordStrength, setPasswordStrength] = useState({ percentage: 0, label: '' });

  // ---------- HANDLERS FOR FIELD CHANGES ----------
  const handleFirstName = (e) => setFirstName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePhone = (e) => setPhone(e.target.value);

  const handlePassword = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    const strength = evaluatePasswordStrength(pwd);
    setPasswordStrength(strength);
  };

  const handleConfirmPassword = (e) => setConfirmPassword(e.target.value);

  // ---------- PASSWORD STRENGTH EVALUATION ----------
  const evaluatePasswordStrength = (pwd) => {
    let strength = { percentage: 0, label: 'Weak' };

    // Base checks for length, uppercase, lowercase, digits, special chars
    if (pwd.length >= 8)         strength.percentage += 25;
    if (/[A-Z]/.test(pwd))       strength.percentage += 25;  // Uppercase
    if (/[a-z]/.test(pwd))       strength.percentage += 20;  // Lowercase
    if (/\d/.test(pwd))          strength.percentage += 15;  // Number
    if (/[@$!%*?&]/.test(pwd))   strength.percentage += 15;  // Special character

    // Label by final percentage
    if (strength.percentage <= 40) {
      strength.label = 'Weak';
    } else if (strength.percentage <= 75) {
      strength.label = 'Strong';
    } else if (strength.percentage === 100) {
      strength.label = 'Very Strong';
    }

    return strength;
  };

  // ---------- CAPTCHA HANDLER ----------
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaError(''); // Clear CAPTCHA errors
  };

  // ---------- VALIDATION ----------
  const validate = () => {
    let isValid = true;

    // Clear previous errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setPhoneError('');
    setCaptchaError('');

    // Regex for robust password checks
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // First Name
    if (!firstName.trim()) {
      setFirstNameError('First name is required!');
      isValid = false;
    }
    // Last Name
    if (!lastName.trim()) {
      setLastNameError('Last name is required!');
      isValid = false;
    }
    // Email: Must contain "@" and ".com"
    if (!email.trim() || !email.includes('@') || !email.includes('.com')) {
      setEmailError('A valid email is required!');
      isValid = false;
    }
    // Phone: Must be at least 10 characters
    if (!phone.trim() || phone.length < 10) {
      setPhoneError('A valid phone number is required!');
      isValid = false;
    }
    // Password
    if (!password.trim()) {
      setPasswordError('Password is required!');
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 8 chars long, include uppercase, lowercase, number, and special char!');
      isValid = false;
    }
    // Confirm Password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm password is required!');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match!');
      isValid = false;
    }
    // CAPTCHA
    if (!captchaToken) {
      setCaptchaError('Captcha validation is required!');
      isValid = false;
    }

    return isValid;
  };

  // ---------- FORM SUBMIT ----------
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    if (!validate()) {
      return;
    }

    const data = {
      firstName,
      lastName,
      email,
      password,
      phone,
      captchaToken
    };

    // API Call
    registerUserApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred. Please try again.');
        }
      });
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-image">
          <img src="/assets/images/front.jpg" alt="Register" />
        </div>
        <div className="register-form-container">
          <h2>Welcome to Glam Hire</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input onChange={handleFirstName} value={firstName} type="text" className={`form-control ${firstNameError ? 'is-invalid' : ''}`} placeholder="First name" />
              {firstNameError && <p className="text-danger">{firstNameError}</p>}
            </div>

            <div className="input-group">
              <input onChange={handleLastName} value={lastName} type="text" className={`form-control ${lastNameError ? 'is-invalid' : ''}`} placeholder="Last name" />
              {lastNameError && <p className="text-danger">{lastNameError}</p>}
            </div>

            <div className="input-group">
              <input onChange={handleEmail} value={email} type="email" className={`form-control ${emailError ? 'is-invalid' : ''}`} placeholder="Email" />
              {emailError && <p className="text-danger">{emailError}</p>}
            </div>
            <div className="input-group">
              <input onChange={handlePhone} value={phone} type="number" className={`form-control ${phoneError ? 'is-invalid' : ''}`} placeholder="Phone number" />
              {phoneError && <p className="text-danger">{phoneError}</p>}
            </div>

            <div className="input-group">
              <input onChange={handlePassword} value={password} type="password" className={`form-control ${passwordError ? 'is-invalid' : ''}`} placeholder="Create password" />
              {passwordError && <p className="text-danger">{passwordError}</p>}
            </div>

            <div className="input-group">
              <input onChange={handleConfirmPassword} value={confirmPassword} type="password" className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`} placeholder="Confirm password" />
              {confirmPasswordError && <p className="text-danger">{confirmPasswordError}</p>}
            </div>

            {/* Password Strength Bar */}
            <div className="password-strength-bar">
              <div
                className={`password-strength-fill ${passwordStrength.label.toLowerCase()}`}
                style={{ width: `${passwordStrength.percentage}%` }}
              >
                <span>{passwordStrength.percentage}% {passwordStrength.label}</span>
              </div>
            </div>

            <div className="captcha-container">
              <ReCAPTCHA
                sitekey="6LcZbb8qAAAAAK1Ik3xs59Lny8erLjrEzgeBttrd"
                onChange={handleCaptchaChange}
              />
              {captchaError && <p className="text-danger">{captchaError}</p>}
            </div>

            <button type="submit" className="btn-submit">Sign Up</button>
          </form>

          <div className="social-login">
            <p>Or sign up with:</p>
            <div className="social-icons">
              <a href="/auth/facebook" className="social-icon"><img src="/assets/images/facebook.png" alt="Facebook" /></a>
              <a href="/auth/google" className="social-icon"><img src="/assets/images/google.png" alt="Google" /></a>
              <a href="/auth/twitter" className="social-icon"><img src="/assets/images/twitter.png" alt="Twitter" /></a>
            </div>
          </div>
          <p>Already have an account? <a href="/login">Sign in Now!</a></p>
        </div>
      </div>
    </div>
  );
}

export default Register;


// import React, { useState } from 'react';
// import { registerUserApi } from '../../apis/Api';
// import { toast } from 'react-toastify';
// import './Registerpage.css'; // Make sure to create and import this CSS file

// const Register = () => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [phone, setPhone] = useState('');

//   const [firstNameError, setFirstNameError] = useState('');
//   const [lastNameError, setLastNameError] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [confirmPasswordError, setConfirmPasswordError] = useState('');
//   const [phoneError, setPhoneError] = useState('');

//   const handleFirstName = (e) => {
//     setFirstName(e.target.value);
//   }

//   const handleLastName = (e) => {
//     setLastName(e.target.value);
//   }

//   const handleEmail = (e) => {
//     setEmail(e.target.value);
//   }

//   const handlePassword = (e) => {
//     setPassword(e.target.value);
//   }

//   const handleConfirmPassword = (e) => {
//     setConfirmPassword(e.target.value);
//   }

//   const handlePhone = (e) => {
//     setPhone(e.target.value);
//   }

//   const validate = () => {
//     let isValid = true;

//     setFirstNameError('');
//     setLastNameError('');
//     setEmailError('');
//     setPasswordError('');
//     setConfirmPasswordError('');
//     setPhoneError('');

//     if (firstName.trim() === '') {
//       setFirstNameError("First name is required!");
//       isValid = false;
//     }

//     if (lastName.trim() === '') {
//       setLastNameError("Last name is required!");
//       isValid = false;
//     }

//     if (email.trim() === '') {
//       setEmailError("Email is required!");
//       isValid = false;
//     }

//     if (password.trim() === '') {
//       setPasswordError("Password is required!");
//       isValid = false;
//     }

//     if (confirmPassword.trim() === '') {
//       setConfirmPasswordError("Confirm password is required!");
//       isValid = false;
//     }

//     if (confirmPassword.trim() !== password.trim()) {
//       setConfirmPasswordError("Password and confirm password do not match");
//       isValid = false;
//     }

//     if (phone.trim() === '') {
//       setPhoneError("Phone number is required!");
//       isValid = false;
//     }

//     return isValid;
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted');

//     if (!validate()) {
//       return;
//     }

//     const data = {
//       firstName,
//       lastName,
//       email,
//       password,
//       phone
//     };

//     console.log('Data to be sent:', data);

//     registerUserApi(data).then((res) => {
//       if (res.data.success === false) {
//         toast.error(res.data.message);
//       } else {
//         toast.success(res.data.message);
//       }
//     }).catch((error) => {
//       toast.error("An error occurred. Please try again.");
//       console.error("Error during API call:", error);
//     }).catch((error) => {
//       if (error.response.status === 400) {
//           toast.error(error.response.data.message);
//       }
//   })
//   }

//   return (
//     <div className="register-container">
//       <div className="register-box">
//         <div className="register-image">
//           <img src="/assets/images/front.jpg" alt="Register" />
//         </div>
//         <div className="register-form-container">
//           <h2>Welcome to Glam Hire</h2>
//           {/* <p>Create your account by filling the form below</p> */}
//           <form className="register-form" onSubmit={handleSubmit}>
//             <div className="input-group">
//               <input onChange={handleFirstName} value={firstName} type="text" className={`form-control ${firstNameError ? 'is-invalid' : ''}`} placeholder="First name" />
//               {firstNameError && <p className="text-danger">{firstNameError}</p>}
//             </div>

//             <div className="input-group">
//               <input onChange={handleLastName} value={lastName} type="text" className={`form-control ${lastNameError ? 'is-invalid' : ''}`} placeholder="Last name" />
//               {lastNameError && <p className="text-danger">{lastNameError}</p>}
//             </div>

//             <div className="input-group">
//               <input onChange={handleEmail} value={email} type="email" className={`form-control ${emailError ? 'is-invalid' : ''}`} placeholder="Email" />
//               {emailError && <p className="text-danger">{emailError}</p>}
//             </div>
//             <div className="input-group">
//               <input onChange={handlePhone} value={phone} type="number" className={`form-control ${phoneError ? 'is-invalid' : ''}`} placeholder="Phone number" />
//               {phoneError && <p className="text-danger">{phoneError}</p>}
//             </div>

//             <div className="input-group">
//               <input onChange={handlePassword} value={password} type="password" className={`form-control ${passwordError ? 'is-invalid' : ''}`} placeholder="Create password" />
//               {passwordError && <p className="text-danger">{passwordError}</p>}
//             </div>

//             <div className="input-group">
//               <input onChange={handleConfirmPassword} value={confirmPassword} type="password" className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`} placeholder="Confirm password" />
//               {confirmPasswordError && <p className="text-danger">{confirmPasswordError}</p>}
//             </div>

//             <button type="submit" className="btn-submit">Sign Up</button>
//           </form>

//           <div className="social-login">
//             <p>Or sign up with:</p>
//             <div className="social-icons">
//               <a href="/auth/facebook" className="social-icon"><img src="/assets/images/facebook.png" alt="Facebook" /></a>
//               <a href="/auth/google" className="social-icon"><img src="/assets/images/google.png" alt="Google" /></a>
//               <a href="/auth/twitter" className="social-icon"><img src="/assets/images/twitter.png" alt="Twitter" /></a>
//             </div>
//           </div>
//           <p>Already have an account? <a href="/login">Sign in Now!</a></p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;
