import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

const Insights = ({ refresh }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, [refresh]);

  const fetchInsights = async () => {
    const res = await axios.get(`http://localhost:4000/api/journal/insights/123`);
    setData(res.data);
  };

  if (!data) return <p className="loading">Loading insights...</p>;

  return (
    <div className="insights">
      <h2 className="journal-list__title">Insights</h2>

      <div className="grid">

        <div className="card">
          <span className="label">Total Entries</span>
          <span className="value">{data.totalEntries}</span>
        </div>

        <div className="card">
          <span className="label">Top Emotion</span>
          <span className="value accent-orange">{data.topEmotion}</span>
        </div>

        <div className="card">
          <span className="label">Most Used Ambience</span>
          <span className="value accent-green">{data.topAmbience}</span>
        </div>

        <div className="card wide">
          <span className="label">Recent Keywords</span>
          <div className="pills">
            {data.recentKeywords.map((kw, i) => (
              <span key={i} className="pill">{kw}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Insights;