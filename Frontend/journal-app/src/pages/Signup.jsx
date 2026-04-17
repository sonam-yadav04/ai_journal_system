import React, {useState} from "react";
import {useNavigate,Link} from "react-router-dom";
import axios from 'axios';
function Signup() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const { name, email, password } = Object.fromEntries(formdata);


    if (!name || !email || !password) {
      alert("All fields are required!");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/signup",
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.success) {
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  return (
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
  );
}
export default Signup;