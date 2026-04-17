import React, { useEffect, useState } from "react";
import { PenLine, BookOpen, BarChart2, LogOut } from "lucide-react";
import JournalForm from "./components/JournalForm";
import JournalList from "./components/Journallist";
import Insights from "./components/Insights";
import "./style.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [view, setView] = useState("write");
  const [refresh, setRefresh] = useState(0);

  const navigate = useNavigate();
  const [user , setUser] = useState("");
  const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "dark";
});
  const token =  localStorage.getItem('token');

 
  const getGreeting = ()=>{
    const hour = new Date().getHours();
    if(hour >= 5 && hour < 12) return "Good Morning";
    if(hour >= 12 && hour < 17) return "Good Afternoon";
    if(hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  };

  useEffect(() => {
  const name = localStorage.getItem("user_name");
  if (name) {
    setUser(name);
  }
}, []);
 
  const handleLogout = ()=>{
    localStorage.removeItem('token');
    alert("logout successfull");
    navigate("/") 
 }
 useEffect(()=>{
      document.body.className = theme
 },[theme]);
  
 const toggleTheme = () => {
  setTheme(prev => {
    const newTheme = prev === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    return newTheme;
  });
};
  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="topbar-logo">YOUR AI JOURNAL</span>
        <div className="topbar-user">
         
          <div className="avatar">{user?.charAt(0).toUpperCase()}</div>
          <button className="theme-btn" onClick={toggleTheme}>
         {theme === "light" ? "🌙" : "☀️ "}
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          
          <span className="sidebar-section">Menu</span>

          <button className={`nav-item ${view === "write" ? "active" : ""}`} onClick={() => setView("write")}>
            <PenLine size={15} /> Write
          </button>
          <button className={`nav-item ${view === "entries" ? "active" : ""}`} onClick={() => setView("entries")}>
            <BookOpen size={15} /> Entries
          </button>
          <button className={`nav-item ${view === "insights" ? "active" : ""}`} onClick={() => setView("insights")}>
            <BarChart2 size={15} /> Insights
          </button>

          <div className="sidebar-footer">
            <button className="nav-item" 
                onClick={handleLogout}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="welcome-section">
            <h1 className="welcome-greeting">{getGreeting()}, <span className="welcome-name">{user ? user : "User"}</span></h1>
          </div>
          {view === "write" && (
            <div className="dashboard-grid">
              
              <JournalForm onSuccess={() => setRefresh(r => r + 1)} />
              <JournalList refresh={refresh} />
            </div>
          )}
          {view === "entries" && <JournalList refresh={refresh} />}
          {view === "insights" && <Insights refresh={refresh} />}
        </main>
      </div>
      
    </div>
  );
};

export default Dashboard;