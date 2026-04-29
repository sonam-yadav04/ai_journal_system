import React, {useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import "../style.css"
import {toast} from 'react-toastify';
function Logins() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
     const API_BASE = import.meta.env.VITE_API_BASE ;
    if (!email || !password) {
      toast.warning("Please fill all required fields");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
       console.log("Login response:", data);
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem('user_name', data.data.name);
        toast.success("login successfull")
        navigate("/dashboard");
      } else {
        toast.error(data.message);
         navigate("/");
      }
    } catch (err) {
      toast.error("Something went wrong!",err);
      console.log(err)
    }
  };

  return (
     <>
         <h2 className="journalheading"> What's In Your MoOd? write here</h2>
    <div className="login-container">
      <div className="auth-card">
    
        <div className="auth-badge">
          <span className="badge-dot"></span> Secure login
        </div>
        <h2 className="form-title">Welcome back.</h2>
        <p className="form-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Email address</label>
            <input name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="field-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn">Sign in →</button>
        </form>

        <p className="auth-footer">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
    </>
  );
}
export default Logins;