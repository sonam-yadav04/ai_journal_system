import React, { useState } from "react";
import axios from "axios";
import "../style.css";

const JournalForm = ({ onSuccess }) => {
  const [text, setText] = useState("");
  const [ambience, setAmbience] = useState("forest");

  const submitHandler = async () => {
    try {
      await axios.post("http://localhost:4000/api/journal", {
        userId: "123", text, ambience,
      });
      alert("Journal saved!");
      setText("");
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="journal-form">
  <h2 className="section-title">Write Journal</h2>
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
</div>
  );
};

export default JournalForm;