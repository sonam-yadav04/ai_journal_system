import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import "../style.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

 const JournalForm = ({ onSuccess }) => {
  const [text, setText] = useState("");
  const [ambience, setAmbience] = useState("forest");

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api/journal";
  const token = localStorage.getItem("token");
  if(!token){
    return alert("User not authenticaated! Please login to write a journal.");
  }
  const submitHandler = async () => {
    try {
      await axios.post(
        `${API_BASE}`,
        { text, ambience },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Journal saved!");
      setText("");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save journal. Please try again.");
    }
  };

  const chartData = {
    labels: ["Happy", "Calm", "Neutral", "Sad", "Anxious"],
    datasets: [
      {
        label: "Mood histogram",
        data: [12, 9, 14, 7, 5],
        backgroundColor: ["#7c5cfc", "#40c0a0", "#888888", "#e07060", "#ffc658"],
        borderRadius: 8,
        maxBarThickness: 28,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed.y ?? context.parsed}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "var(--muted)" } },
      y: { beginAtZero: true, ticks: { color: "var(--muted)" } },
    },
  };

  return (
    <div className="journal-form">
      <h2 className="journal-form-title">Write Journal</h2>
      <div className="field">
        <label className="field-label">Ambience</label>
        <div className="select-wrap">
          <select className="select" onChange={(e) => setAmbience(e.target.value)}>
            <option value="forest">🌲 Forest</option>
            <option value="ocean">🌊 Ocean</option>
            <option value="mountain">⛰️ Mountain</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label className="field-label">Your Thoughts</label>
        <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Write your thoughts..." rows="5" />
      </div>
      <button className="btn" onClick={submitHandler}>Save Entry</button>

      <div className="journal-form-chart">
        <div className="chart-card-header">
          <span className="chart-card-title">Mood histogram</span>
          <span className="chart-card-note">Static insight preview</span>
        </div>
        <div className="chart-box">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default JournalForm;