import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

const JournalList = ({ refresh }) => {
  const [journals, setJournals] = useState([]);

  useEffect(() => { fetchData(); }, [refresh]);

  const fetchData = async () => {
    try{
    const res = await axios.get("http://localhost:4000/api/journal/123");
    const result = Array.isArray(res.data)
        ? res.data
        : res.data?.journals || res.data?.entries || res.data?.data || [];
      setJournals(result);
      } catch (err) {
      console.error("Failed to fetch journals:", err);
      setJournals([]);
    }
  };

  return (
    <div className="journal-list">
  <h2 className="journal-list__title">Journal Entries</h2>

  {journals.length === 0 ? (
    <p className="empty">No entries yet. Start writing!</p>
  ) : (
    <div className="journal-list__entries">
      {journals.map((j, i) => (
        <div key={i} className="journal-entry">
          <p className="journal__entry__text">{j.text}</p>
          <div className="journal-entry__meta">
            <span className="badge orange">{j.emotion}</span>
            <span className="badge green">{j.ambience}</span>
          </div>
        </div>
      ))}
    </div>
    
  )}
</div>
  );
};

export default JournalList;