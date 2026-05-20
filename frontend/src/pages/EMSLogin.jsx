"use client";

import React, { useState, useEffect } from "react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { demoCredentials } from "../lib/demoCredentials";
import api from "../services/api";

export default function AuthSwitch() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Login State
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const authContainer = document.querySelector(".auth-container");
    if (!authContainer) return;
    if (isSignUp) authContainer.classList.add("sign-up-mode");
    else authContainer.classList.remove("sign-up-mode");
  }, [isSignUp]);

  const handleLoginChange = e => {
    setLoginForm({ ...loginForm, [e.target.type === 'email' ? 'email' : 'password']: e.target.value });
    setLoginError('');
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    const { email, password } = loginForm;
    if (!email || !password) { setLoginError('Please fill in all fields.'); return; }
    setIsLoggingIn(true);
    try {
      // Demo credential fallback
      const demoMatch = (email === demoCredentials.admin.email && password === demoCredentials.admin.password) || (email === demoCredentials.employee.email && password === demoCredentials.employee.password);
      if (demoMatch) {
        const role = email === demoCredentials.admin.email ? 'admin' : 'employee';
        localStorage.setItem('ems_token', 'demo-token');
        localStorage.setItem('ems_user', JSON.stringify({ role }));
        navigate(role === 'admin' ? '/dashboard/admin' : '/dashboard/employee');
        setIsLoggingIn(false);
        return;
      }

      // Proceed with real API call
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, user } = res.data;
      localStorage.setItem('ems_token', accessToken);
      localStorage.setItem('ems_user', JSON.stringify(user));
      if (user.role === 'super_admin' || user.role === 'admin' || user.role === 'hr') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/employee');
      }
    } catch (err) {
      setLoginError(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <style>{`

        .auth-container {
          position: relative;
          width: 100%;
          max-width: 900px;
          height: 550px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          margin: 0 auto;
          margin-top: 5vh;
        }

        .forms-auth-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 3;
        }

        form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 5rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        form.sign-up-form {
          opacity: 0;
          z-index: 1;
        }

        form.sign-in-form {
          z-index: 2;
        }

        .title {
          font-size: 2.2rem;
          color: #444;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .input-field {
          max-width: 380px;
          width: 100%;
          background-color: #f0f0f0;
          margin: 10px 0;
          height: 55px;
          border-radius: 55px;
          display: grid;
          grid-template-columns: 15% 85%;
          padding: 0 0.4rem;
          position: relative;
          transition: 0.3s;
        }

        .input-field:focus-within {
          background-color: #e8e8e8;
          box-shadow: 0 0 0 2px #3B82F6;
        }

        .input-field i {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
          transition: 0.5s;
        }

        .input-field input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 500;
          font-size: 1rem;
          color: #333;
          width: 100%;
        }

        .input-field input::placeholder {
          color: #aaa;
          font-weight: 400;
        }

        .btn {
          width: 150px;
          background-color: #3B82F6;
          border: none;
          outline: none;
          height: 49px;
          border-radius: 49px;
          color: #fff;
          text-transform: uppercase;
          font-weight: 600;
          margin: 10px 0;
          cursor: pointer;
          transition: 0.5s;
          font-size: 0.9rem;
        }

        .btn:hover {
          background-color: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .panels-auth-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 4;
        }

        .left-panel {
          pointer-events: all;
          padding: 3rem 17% 2rem 12%;
        }

        .right-panel {
          pointer-events: none;
          padding: 3rem 12% 2rem 17%;
        }

        .panel .content {
          color: #fff;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
        }

        .panel h3 {
          font-weight: 600;
          line-height: 1;
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .panel p {
          font-size: 0.95rem;
          padding: 0.7rem 0;
        }

        .btn.transparent {
          margin: 0;
          background: none;
          border: 2px solid #fff;
          width: 130px;
          height: 41px;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .btn.transparent:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .right-panel .content {
          transform: translateX(800px);
        }

        .auth-container.sign-up-mode:before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .auth-container.sign-up-mode .left-panel .content {
          transform: translateX(-800px);
        }

        .auth-container.sign-up-mode .signin-signup {
          left: 25%;
        }

        .auth-container.sign-up-mode form.sign-up-form {
          opacity: 1;
          z-index: 2;
        }

        .auth-container.sign-up-mode form.sign-in-form {
          opacity: 0;
          z-index: 1;
        }

        .auth-container.sign-up-mode .right-panel .content {
          transform: translateX(0%);
        }

        .auth-container.sign-up-mode .left-panel {
          pointer-events: none;
        }

        .auth-container.sign-up-mode .right-panel {
          pointer-events: all;
        }

        .auth-container:before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: linear-gradient(-45deg, #3B82F6 0%, #1E3A8A 100%);
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 1;
        }

        .social-text {
          padding: 0.7rem 0;
          font-size: 1rem;
          color: #666;
        }

        .social-media {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .social-icon {
          height: 46px;
          width: 46px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 50%;
          color: #3B82F6;
          font-size: 1.2rem;
          transition: 0.3s;
          cursor: pointer;
        }

        .social-icon:hover {
          border-color: #1E3A8A;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .social-icon svg {
          transition: 0.3s;
        }

        .error-message {
          color: #e53e3e;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        @media (max-width: 870px) {
          .auth-container {
            min-height: 800px;
            height: 100vh;
          }
          .signin-signup {
            width: 100%;
            top: 95%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }
          .signin-signup,
          .auth-container.sign-up-mode .signin-signup {
            left: 50%;
          }
          .panels-auth-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }
          .panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2.5rem 8%;
            grid-column: 1 / 2;
          }
          .right-panel {
            grid-row: 3 / 4;
          }
          .left-panel {
            grid-row: 1 / 2;
          }
          .panel .content {
            padding-right: 15%;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.8s;
          }
          .panel h3 {
            font-size: 1.2rem;
          }
          .panel p {
            font-size: 0.7rem;
            padding: 0.5rem 0;
          }
          .btn.transparent {
            width: 110px;
            height: 35px;
            font-size: 0.7rem;
          }
          .auth-container:before {
            width: 1500px;
            height: 1500px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }
          .auth-container.sign-up-mode:before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }
          .auth-container.sign-up-mode .left-panel .content {
            transform: translateY(-300px);
          }
          .auth-container.sign-up-mode .right-panel .content {
            transform: translateY(0px);
          }
          .right-panel .content {
            transform: translateY(300px);
          }
          .auth-container.sign-up-mode .signin-signup {
            top: 5%;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 570px) {
          form {
            padding: 0 1.5rem;
          }
          .panel .content {
            padding: 0.5rem 1rem;
          }
        }
      `}</style>

      <div className="w-full min-h-screen bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex justify-center items-center p-5">
        <div className="auth-container">
          <div className="forms-auth-container">
            <div className="signin-signup">
              {/* Sign In Form */}
              <form className="sign-in-form" onSubmit={handleLoginSubmit}>
                <h2 className="title">Sign in</h2>
                <div className="input-field">
                  <i><Mail size={18} /></i>
                  <input type="email" placeholder="Email" value={loginForm.email} onChange={handleLoginChange} required />
                </div>
                <div className="input-field">
                  <i><Lock size={18} /></i>
                  <input type="password" placeholder="Password" value={loginForm.password} onChange={handleLoginChange} required />
                </div>
                {loginError && <p className="error-message">{loginError}</p>}
                <input type="submit" value={isLoggingIn ? "Logging in..." : "Login"} className="btn solid" disabled={isLoggingIn} />
                <p className="social-text">Or sign in with social platforms</p>
                {/* Social Icons */}
                <div className="social-media">
                  <SocialIcons />
                </div>
              </form>

              {/* Sign Up Form */}
              <form className="sign-up-form">
                <h2 className="title">Sign up</h2>
                <div className="input-field">
                  <i><User size={18} /></i>
                  <input type="text" placeholder="Username" />
                </div>
                <div className="input-field">
                  <i><Mail size={18} /></i>
                  <input type="email" placeholder="Email" />
                </div>
                <div className="input-field">
                  <i><Lock size={18} /></i>
                  <input type="password" placeholder="Password" />
                </div>
                <input type="submit" value="Sign up" className="btn" />
                <p className="social-text">Or sign up with social platforms</p>
                {/* Social Icons */}
                <div className="social-media">
                  <SocialIcons />
                </div>
              </form>
            </div>
          </div>

          <div className="panels-auth-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>New here?</h3>
                <p>Join us today and discover a world of possibilities. Create your account in seconds!</p>
                <button className="btn transparent" onClick={() => setIsSignUp(true)}>
                  Sign up
                </button>
              </div>
            </div>

            <div className="panel right-panel">
              <div className="content">
                <h3>One of us?</h3>
                <p>Welcome back! Sign in to continue your journey with us.</p>
                <button className="btn transparent" onClick={() => setIsSignUp(false)}>
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SocialIcons() {
  return (
    <>
      <a href="#" className="social-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      </a>
      <a href="#" className="social-icon">
        <FaFacebook size={20} color="#1877F2" />
      </a>
      <a href="#" className="social-icon">
        <FaTwitter size={20} color="#1DA1F2" />
      </a>
      <a href="#" className="social-icon">
        <FaLinkedin size={20} color="#0A66C2" />
      </a>
    </>
  );
}
