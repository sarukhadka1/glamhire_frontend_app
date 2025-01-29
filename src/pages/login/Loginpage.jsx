// // import React, { useState } from "react";
// // import { toast } from 'react-toastify';
// // import { loginUserApi } from "../../apis/Api";
// // import ReCAPTCHA from "react-google-recaptcha";
// // import './Loginpage.css';  // Make sure to create and import this CSS file
// // import { useNavigate } from "react-router-dom"; // Make sure to create and import this CSS file

// // const Login = () => {
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [captchaToken, setCaptchaToken] = useState(null);

// //     const [emailError, setEmailError] = useState('');
// //     const [passwordError, setPasswordError] = useState('');
// //     const [captchaError, setCaptchaError] = useState('');

// //     // Track lockout & attempts
// //     const [lockTime, setLockTime] = useState(null);
// //     const [remainingAttempts, setRemainingAttempts] = useState(3); // Start with 3 attempts
// //     const [timer, setTimer] = useState(null); // Countdown timer for lockout
// //     const [notification, setNotification] = useState('');

// //     const navigate = useNavigate();

// //     // ---------- PASSWORD STRENGTH CHECK ----------
// //     const checkPasswordStrength = (password) => {
// //         if (password.length < 8) return "Password is too short (min 8 characters)";
// //         if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
// //         if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
// //         if (!/[0-9]/.test(password)) return "Password must contain at least one number";
// //         if (!/[@$!%*?&]/.test(password)) return "Password must contain at least one special character (@$!%*?&)";

// //         return "Password is strong";
// //     };

// //     // ---------- VALIDATION FUNCTION ----------
// //     const validation = () => {
// //         let isValid = true;
// //         setEmailError('');
// //         setPasswordError('');
// //         setCaptchaError('');

// //         if (email.trim() === '' || !/\S+@\S+\.\S+/.test(email)) {
// //             setEmailError("Email is empty or invalid");
// //             isValid = false;
// //             toast.error("Email is empty or invalid");
// //         }

// //         if (password.trim() === '') {
// //             setPasswordError("Password is empty");
// //             isValid = false;
// //             toast.error("Password is empty");
// //         } else {
// //             // Check password strength
// //             const passwordStrength = checkPasswordStrength(password);
// //             if (passwordStrength !== "Password is strong") {
// //                 setPasswordError(passwordStrength);
// //                 isValid = false;
// //                 toast.error(passwordStrength);
// //             }
// //         }

// //         if (!captchaToken) {
// //             setCaptchaError("Please complete the CAPTCHA");
// //             isValid = false;
// //             toast.error("Please complete the CAPTCHA");
// //         }

// //         return isValid;
// //     };

// //     // ---------- LOCKOUT TIMER FUNCTION ----------
// //     const startCountdown = (lockDuration) => {
// //         let remainingTime = lockDuration; // in seconds
// //         setTimer(remainingTime);

// //         // Clear any existing intervals before setting a new one
// //         const interval = setInterval(() => {
// //             remainingTime -= 1;
// //             setTimer(remainingTime);

// //             if (remainingTime <= 0) {
// //                 clearInterval(interval);
// //                 setTimer(null);
// //                 setLockTime(null);
// //                 setNotification("");
// //                 setRemainingAttempts(3); // Reset attempts after lockout time
// //             }
// //         }, 1000);
// //     };

// //     // ---------- LOGIN HANDLER ----------
// //     const handleLogin = async (e) => {
// //         e.preventDefault();

// //         if (!validation()) {
// //             return;
// //         }

// //         const data = {
// //             "email": email,
// //             "password": password,
// //             "captchaToken": captchaToken, // Include CAPTCHA token
// //         };

// //         try {
// //             const res = await loginUserApi(data);

// //             if (res.data.success === false) {
// //                 // If the response indicates a lockout (403 status + remainingTime)
// //                 if (res.status === 403) {
// //                     // If there's a remainingTime field => user is locked out
// //                     if (res.data.remainingTime) {
// //                         setLockTime(res.data.remainingTime);
// //                         setNotification("Your account is locked. Please wait to try again.");
// //                         toast.error(`Account is locked. Try again in ${res.data.remainingTime} seconds.`);
// //                         startCountdown(res.data.remainingTime);
// //                     } else {
// //                         // fallback if locked but no remainingTime
// //                         toast.error(res.data.message || "Account is locked!");
// //                     }
// //                 } else if (res.data.message === "Password not matched!") {
// //                     // Handle incorrect password attempts and show remaining attempts
// //                     if (remainingAttempts > 1) {
// //                         setRemainingAttempts(prev => prev - 1);
// //                         toast.error(`Password not matched! ${remainingAttempts - 1} attempt(s) left.`);
// //                     } else {
// //                         // If no remaining attempts, lock the account
// //                         setLockTime(300); // Lock account for 5 minutes (300 seconds)
// //                         setRemainingAttempts(0);
// //                         toast.error("Account is locked due to too many failed attempts. Please try again later.");
// //                         startCountdown(300); // Start lockout timer
// //                     }
// //                 } else {
// //                     toast.error(res.data.message);
// //                 }
// //             } else {
// //                 // ---------- SUCCESSFUL LOGIN ----------
// //                 toast.success(res.data.message);
// //                 localStorage.setItem("token", res.data.token);
// //                 localStorage.setItem("user", JSON.stringify(res.data.userData));

// //                 if (res.data.userData.isAdmin) {
// //                     window.location.href = "/admin/dashboard";
// //                 } else {
// //                     window.location.href = "/";
// //                 }
// //             }
// //         } catch (error) {
// //             toast.error("Login failed");
// //         }
// //     };

// //     // ---------- CAPTCHA HANDLER ----------
// //     const handleCaptchaChange = (token) => {
// //         setCaptchaToken(token);
// //         setCaptchaError(""); // Clear CAPTCHA errors
// //     };

// //     return (
// //         <div className="login-container">
// //             <div className="login-box">
// //                 <div className="login-image">
// //                     <img src="/assets/images/front.jpg" alt="Login" />
// //                 </div>
// //                 <div className="login-form-container">
// //                     <h1>Login to your Account!</h1>

// //                     {/* Notification or Lockout message */}
// //                     {notification && (
// //                         <div className="notification" style={{ color: "red" }}>
// //                             {notification}
// //                         </div>
// //                     )}

// //                     {/* Display lockout timer if lockTime is active */}
// //                     {lockTime && timer && (
// //                         <div className="lock-message" style={{ color: "red" }}>
// //                             Your account is locked. Try again in {timer} seconds.
// //                         </div>
// //                     )}

// //                     {/* Attempt limit message */}
// //                     {remainingAttempts !== null && remainingAttempts > 0 && (
// //                         <div className="attempts-message" style={{ color: "orange" }}>
// //                             {remainingAttempts} attempt(s) left.
// //                         </div>
// //                     )}

// //                     <form className="login-form">
// //                         <label>Email Address</label>
// //                         <input
// //                             onChange={(e) => setEmail(e.target.value)}
// //                             value={email}
// //                             type="text"
// //                             className={`form-control ${emailError ? 'is-invalid' : ''}`}
// //                             placeholder="Enter your email address"
// //                         />
// //                         {emailError && <p className="text-danger">{emailError}</p>}

// //                         <label>Password</label>
// //                         <input
// //                             onChange={(e) => setPassword(e.target.value)}
// //                             value={password}
// //                             type="password"
// //                             className={`form-control ${passwordError ? 'is-invalid' : ''}`}
// //                             placeholder="Enter your password"
// //                         />
// //                         {passwordError && <p className="text-danger">{passwordError}</p>}

// //                         {/* CAPTCHA */}
// //                         <div className="captcha-container">
// //                             <ReCAPTCHA
// //                                 sitekey="6LcZbb8qAAAAAK1Ik3xs59Lny8erLjrEzgeBttrd" // Replace with your actual site key
// //                                 onChange={handleCaptchaChange}
// //                             />
// //                             {captchaError && <p className="text-danger">{captchaError}</p>}
// //                         </div>

// //                         <button
// //                             onClick={handleLogin}
// //                             className="btn btn-danger mt-2 w-100"
// //                             disabled={!!lockTime}  // Disable login button if locked
// //                         >
// //                             Login
// //                         </button>
// //                     </form>

// //                     <div className="mt-3">
// //                         <p>
// //                             Forgot your password?{" "}
// //                             <span
// //                                 className="text-primary cursor-pointer"
// //                                 onClick={() => navigate('/forgot_password')}
// //                             >
// //                                 Click here
// //                             </span>
// //                         </p>
// //                         <p>
// //                             Don't have an account?{" "}
// //                             <span
// //                                 className="text-primary cursor-pointer"
// //                                 onClick={() => navigate('/register')}
// //                             >
// //                                 Register here
// //                             </span>
// //                         </p>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Login;























// import React, { useState } from "react";
// import { toast } from 'react-toastify';
// import { loginUserApi } from "../../apis/Api";
// import ReCAPTCHA from "react-google-recaptcha";
// import './Loginpage.css';  // Make sure to create and import this CSS file
// import { useNavigate } from "react-router-dom"; // Make sure to create and import this CSS file

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [captchaToken, setCaptchaToken] = useState(null);

//     const [emailError, setEmailError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const [captchaError, setCaptchaError] = useState('');

//     // Track lockout & attempts
//     const [lockTime, setLockTime] = useState(null);
//     const [timer, setTimer] = useState(null); // Countdown timer for lockout
//     const [notification, setNotification] = useState('');

//     const navigate = useNavigate();

//     // ---------- VALIDATION FUNCTION ----------
//     const validation = () => {
//         let isValid = true;
//         setEmailError('');
//         setPasswordError('');
//         setCaptchaError('');

//         if (email.trim() === '' || !/\S+@\S+\.\S+/.test(email)) {
//             setEmailError("Email is empty or invalid");
//             isValid = false;
//             toast.error("Email is empty or invalid");
//         }

//         if (password.trim() === '') {
//             setPasswordError("Password is empty");
//             isValid = false;
//             toast.error("Password is empty");
//         }

//         if (!captchaToken) {
//             setCaptchaError("Please complete the CAPTCHA");
//             isValid = false;
//             toast.error("Please complete the CAPTCHA");
//         }

//         return isValid;
//     };

//     // ---------- LOCKOUT TIMER FUNCTION ----------
//     const startCountdown = (lockDuration) => {
//         let remainingTime = lockDuration; // in seconds
//         setTimer(remainingTime);

//         // Clear any existing intervals before setting a new one
//         const interval = setInterval(() => {
//             remainingTime -= 1;
//             setTimer(remainingTime);

//             if (remainingTime <= 0) {
//                 clearInterval(interval);
//                 setTimer(null);
//                 setLockTime(null);
//                 setNotification(""); // Clear lockout notification
//             }
//         }, 1000);
//     };

//     // ---------- LOGIN HANDLER ----------
//     const handleLogin = async (e) => {
//         e.preventDefault();

//         if (!validation()) {
//             return;
//         }

//         const data = {
//             "email": email,
//             "password": password,
//             "captchaToken": captchaToken, // Include CAPTCHA token
//         };

//         try {
//             const res = await loginUserApi(data);

//             if (res.data.success === false) {
//                 // Check for lockout response (status 403)
//                 if (res.status === 403) {
//                     if (res.data.remainingTime) {
//                         // Account is locked
//                         setLockTime(res.data.remainingTime);
//                         setNotification("Your account is locked for 5 minutes due to multiple failed login attempts.");
//                         toast.error(`Account is locked. Try again in ${res.data.remainingTime} seconds.`);
//                         startCountdown(res.data.remainingTime); // Start countdown
//                     } else {
//                         // Account locked without remaining time (fallback)
//                         toast.error(res.data.message || "Account is locked!");
//                     }
//                 } else if (res.data.message === "Password not matched!") {
//                     // Incorrect password
//                     toast.error("Incorrect password. Please try again.");
//                 } else {
//                     toast.error(res.data.message || "Login failed.");
//                 }
//             } else {
//                 // ---------- SUCCESSFUL LOGIN ----------
//                 setNotification("");
//                 localStorage.setItem("token", res.data.token);
//                 localStorage.setItem("user", JSON.stringify(res.data.userData));

//                 if (res.data.userData.isAdmin) {
//                     window.location.href = "/admindashboard";
//                 } else {
//                     window.location.href = "/";
//                 }
//             }
//         } catch (error) {
//             toast.error("Login failed");
//         }
//     };

//     // ---------- CAPTCHA HANDLER ----------
//     const handleCaptchaChange = (token) => {
//         setCaptchaToken(token);
//         setCaptchaError(""); // Clear CAPTCHA errors
//     };

//     return (
//         <div className="login-container">
//             <div className="login-box">
//                 <div className="login-image">
//                     <img src="/assets/images/front.jpg" alt="Login" />
//                 </div>
//                 <div className="login-form-container">
//                     <h1>Login to your Account!</h1>

//                     {/* Notification or Lockout message */}
//                     {notification && (
//                         <div className="notification" style={{ color: "red" }}>
//                             {notification}
//                         </div>
//                     )}

//                     {/* Display lockout timer if lockTime is active */}
//                     {lockTime && timer && (
//                         <div className="lock-message" style={{ color: "red" }}>
//                             Your account is locked. Try again in {timer} seconds.
//                         </div>
//                     )}

//                     <form className="login-form">
//                         <label>Email Address</label>
//                         <input
//                             onChange={(e) => setEmail(e.target.value)}
//                             value={email}
//                             type="text"
//                             className={`form-control ${emailError ? 'is-invalid' : ''}`}
//                             placeholder="Enter your email address"
//                         />
//                         {emailError && <p className="text-danger">{emailError}</p>}

//                         <label>Password</label>
//                         <input
//                             onChange={(e) => setPassword(e.target.value)}
//                             value={password}
//                             type="password"
//                             className={`form-control ${passwordError ? 'is-invalid' : ''}`}
//                             placeholder="Enter your password"
//                         />
//                         {passwordError && <p className="text-danger">{passwordError}</p>}

//                         {/* CAPTCHA */}
//                         <div className="captcha-container">
//                             <ReCAPTCHA
//                                 sitekey="6LcZbb8qAAAAAK1Ik3xs59Lny8erLjrEzgeBttrd" // Replace with your actual site key
//                                 onChange={handleCaptchaChange}
//                             />
//                             {captchaError && <p className="text-danger">{captchaError}</p>}
//                         </div>

//                         <button
//                             onClick={handleLogin}
//                             className="btn btn-danger mt-2 w-100"
//                             disabled={!!lockTime}  // Disable login button if locked
//                         >
//                             Login
//                         </button>
//                     </form>

//                     <div className="mt-3">
//                         <p>
//                             Forgot your password?{" "}
//                             <span
//                                 className="text-primary cursor-pointer"
//                                 onClick={() => navigate('/forgot_password')}
//                             >
//                                 Click here
//                             </span>
//                         </p>
//                         <p>
//                             Don't have an account?{" "}
//                             <span
//                                 className="text-primary cursor-pointer"
//                                 onClick={() => navigate('/register')}
//                             >
//                                 Register here
//                             </span>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;








import React, { useState } from "react";
import { toast } from "react-toastify";
import { loginUserApi } from "../../apis/Api";
import ReCAPTCHA from "react-google-recaptcha";
import "./Loginpage.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // Track lockout & attempts
  const [lockTime, setLockTime] = useState(null);
  const [timer, setTimer] = useState(null); // Countdown timer for lockout
  const [notification, setNotification] = useState("");
  // NEW: Track remaining attempts
  const [remainingAttempts, setRemainingAttempts] = useState(null);

  const navigate = useNavigate();

  // ---------- VALIDATION FUNCTION ----------
  const validation = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setCaptchaError("");

    if (email.trim() === "" || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is empty or invalid");
      isValid = false;
      toast.error("Email is empty or invalid");
    }

    if (password.trim() === "") {
      setPasswordError("Password is empty");
      isValid = false;
      toast.error("Password is empty");
    }

    if (!captchaToken) {
      setCaptchaError("Please complete the CAPTCHA");
      isValid = false;
      toast.error("Please complete the CAPTCHA");
    }

    return isValid;
  };

  // ---------- LOCKOUT TIMER FUNCTION ----------
  const startCountdown = (lockDuration) => {
    let remainingTime = lockDuration; // in seconds
    setTimer(remainingTime);

    // Clear any existing intervals before setting a new one
    const interval = setInterval(() => {
      remainingTime -= 1;
      setTimer(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(interval);
        setTimer(null);
        setLockTime(null);
        setNotification(""); // Clear lockout notification
      }
    }, 1000);
  };

  // ---------- LOGIN HANDLER ----------
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    const data = {
      email,
      password,
      captchaToken, // Include CAPTCHA token
    };

    try {
      const res = await loginUserApi(data);

      if (res.data.success === false) {
        // Check for lockout response (status 403)
        if (res.status === 403) {
          if (res.data.remainingTime) {
            // Account is locked
            setLockTime(res.data.remainingTime);
            setNotification(
              "Your account is locked for multiple failed login attempts."
            );
            toast.error(`Account is locked. Try again in ${res.data.remainingTime} seconds.`);
            startCountdown(res.data.remainingTime); // Start countdown
          } else {
            // Account locked without remaining time (fallback)
            toast.error(res.data.message || "Account is locked!");
          }
        }
        // Check if password mismatch or other 400-level error
        else if (res.status === 400 || res.data.message === "Password not matched!") {
          // If the backend returns remainingAttempts
          if (res.data.remainingAttempts !== undefined) {
            setRemainingAttempts(res.data.remainingAttempts);
            toast.error(
              `Password not matched! ${res.data.remainingAttempts} attempt(s) left.`
            );
          } else {
            toast.error(res.data.message || "Incorrect password. Please try again.");
          }
        } else {
          // Catch-all for other fail responses
          toast.error(res.data.message || "Login failed.");
        }
      } else {
        // ---------- SUCCESSFUL LOGIN ----------
        setNotification("");
        setRemainingAttempts(null); // Clear attempts if any
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.userData));

        if (res.data.userData.isAdmin) {
          window.location.href = "/admindashboard";
        } else {
          window.location.href = "/";
        }
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };

  // ---------- CAPTCHA HANDLER ----------
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaError(""); // Clear CAPTCHA errors
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-image">
          <img src="/assets/images/front.jpg" alt="Login" />
        </div>
        <div className="login-form-container">
          <h1>Login to your Account!</h1>

          {/* Notification or Lockout message */}
          {notification && (
            <div className="notification" style={{ color: "red" }}>
              {notification}
            </div>
          )}

          {/* Display attempts left if not locked */}
          {remainingAttempts !== null && !lockTime && (
            <div className="attempts-left" style={{ color: "red", marginBottom: "8px" }}>
              You have {remainingAttempts} attempt(s) left before the account locks.
            </div>
          )}

          {/* Display lockout timer if lockTime is active */}
          {lockTime && timer && (
            <div className="lock-message" style={{ color: "red" }}>
              Your account is locked. Try again in {timer} seconds.
            </div>
          )}

          <form className="login-form">
            <label>Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              placeholder="Enter your email address"
            />
            {emailError && <p className="text-danger">{emailError}</p>}

            <label>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              placeholder="Enter your password"
            />
            {passwordError && <p className="text-danger">{passwordError}</p>}

            {/* CAPTCHA */}
            <div className="captcha-container">
              <ReCAPTCHA
                sitekey="6LcZbb8qAAAAAK1Ik3xs59Lny8erLjrEzgeBttrd" // Replace with your actual site key
                onChange={handleCaptchaChange}
              />
              {captchaError && <p className="text-danger">{captchaError}</p>}
            </div>

            <button
              onClick={handleLogin}
              className="btn btn-danger mt-2 w-100"
              disabled={!!lockTime} // Disable login button if locked
            >
              Login
            </button>
          </form>

          <div className="mt-3">
            <p>
              Forgot your password?{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => navigate("/forgot_password")}
              >
                Click here
              </span>
            </p>
            <p>
              Don't have an account?{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Register here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;




