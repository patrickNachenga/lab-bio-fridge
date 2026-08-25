import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./page-auth.css";
import "./LoginPage.css";
import { AuthWrapper } from "./AuthWrapper";
import { connect } from "react-redux";
import { login } from "../../redux/actions";

const LoginPage = ({
  isLoading,
  success,
  error,
  status,
  state,
  login,
  authUser,
}) => {
  const [formData, setFormData] = useState({
    password: "",
    username: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData, navigate);
  };

  const handleFingerprintLogin = () => {
    // Connect your biometric authentication here.
    // For example, WebAuthn can be implemented later.
    console.log("Fingerprint authentication requested");
  };

  return (
    <AuthWrapper>
      {/* =====================================================
          LOGIN HEADER
      ===================================================== */}
      <div className="bio-login-header">

        <h2 className="bio-login-title">
          Welcome Back
        </h2>

        <p className="bio-login-subtitle">
          Sign in to access the Bio-Fridge System
        </p>
      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error?.message ||
            "An error occurred. Please try again."}
        </div>
      )}


      {/* =====================================================
          LOGIN FORM
      ===================================================== */}
      <form
        id="formAuthentication"
        onSubmit={handleSubmit}
      >

        {/* USERNAME */}
        <div className="mb-3">

          <label
            htmlFor="username"
            className="form-label-login"
          >
            Username
          </label>

          <input
            type="text"
            className="form-control form-control-login"
            id="username"
            required
            value={formData.username}
            onChange={handleChange}
            name="username"
            placeholder="Enter your username"
            autoFocus
            autoComplete="username"
          />

        </div>


        {/* PASSWORD */}
        <div className="mb-3 form-password-toggle">

          <div className="password-label-row">

            <label
              className="form-label-login"
              htmlFor="password"
            >
              Password
            </label>

          </div>


          <div className="input-group input-group-merge input-group-login">

            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="form-control form-control-login"
              name="password"
              placeholder="Enter your password"
              aria-describedby="password"
            />

            <span
              className="input-group-text cursor-pointer input-group-text-login"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              role="button"
              tabIndex="0"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              <i
                className={
                  showPassword
                    ? "bx bx-show"
                    : "bx bx-hide"
                }
              ></i>
            </span>

          </div>

        </div>


        {/* ERROR FEEDBACK */}
        {error?.message && (
          <div className="invalid-feedback">
            {error.message}
          </div>
        )}


        {/* =====================================================
            REMEMBER + FORGOT PASSWORD
        ===================================================== */}
        <div className="bio-login-options">

          <div className="form-check bio-remember">

            <input
              className="form-check-input"
              type="checkbox"
              id="remember-me"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />

            <label
              className="form-check-label"
              htmlFor="remember-me"
            >
              Remember Me
            </label>

          </div>


          <Link
            aria-label="Go to Forgot Password Page"
            to="/auth/forgot-password"
            className="bio-forgot-password"
          >
            Forgot Password?
          </Link>

        </div>


        {/* =====================================================
            SIGN IN
        ===================================================== */}
        <div className="bio-login-actions">

          <button
            type="submit"
            aria-label="Sign in"
            className="btn btn-primary bio-signin-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>

                Signing in...
              </>
            ) : (
              <>
                <i className="bx bx-log-in-circle me-1"></i>

                Sign In
              </>
            )}
          </button>


          {/* =================================================
              FINGERPRINT
          ================================================= */}
          <button
            type="button"
            className="bio-fingerprint-button"
            onClick={handleFingerprintLogin}
            aria-label="Sign in with fingerprint"
          >
            <span className="bio-fingerprint-icon">
              <i className="bx bx-fingerprint"></i>
            </span>

            <span>
              Sign in with fingerprint
            </span>
          </button>

        </div>

      </form>

    </AuthWrapper>
  );
};


const mapStateToProps = (state) => ({
  isLoading: state.loginReducer.isLoading,
  success: state.loginReducer.success,
  error: state.loginReducer.error,
  status: state.loginReducer.status,
  authUser: state.userReducer,
});


const mapDispatchToProps = {
  login: login,
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);