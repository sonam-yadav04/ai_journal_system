import React, {useState} from "react";
import {useNavigate,Link} from "react-router-dom";
import axios from 'axios';
import {toast} from 'react-toastify';
function Signup() {
  const navigate = useNavigate();
const API_BASE = import.meta.env.VITE_API_BASE ;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const { name, email, password } = Object.fromEntries(formdata);
     

    if (!name || !email || !password) {
      toast.warning("All fields are required!");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/auth/signup`,
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.success) {
        navigate("/");
      } else {
         toast.success(res.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.log(err);
    }
  };

  return (
    <>
    <h2 className="journalheading"> What's In Your MoOd? write here</h2>
   
    <div className="signup-container">
      <div className="auth-card">
        <div className="auth-badge">
          <span className="badge-dot"></span> Create account
        </div>
        <h2 className="form-title">Join us today.</h2>
        <p className="form-subtitle">Set up your account in seconds</p>

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Full name</label>
            <input name="name" type="text" placeholder="Your name" required />
          </div>
          <div className="field-group">
            <label>Email address</label>
            <input name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="field-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn">Create account →</button>
        </form>

        <p className="auth-footer">
          Already have one? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
     </>
  );
}
export default Signup;