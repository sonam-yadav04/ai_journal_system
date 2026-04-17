import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Doughnut ,Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip,Legend,CategoryScale,LinearScale,PointElement ,LineElement} from "chart.js";
import "../style.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,LinearScale,PointElement,LineElement);

const EMO_COLORS  = ["#7c5cfc", "#40c0a0", "#e07060", "#ffc658", "#a78bfa"];
const SENT_COLORS = ["#40c0a0", "#888888", "#e07060"];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}` },
    },
  },
};

const CustomLegend = ({ labels, colors, data }) => {
  const total = data.reduce((a, b) => a + b, 0);
  return (
    <div className="insights-legend">
      {labels.map((label, i) => (
        <span key={i} className="insights-legend-item">
          <span className="insights-legend-dot" style={{ background: colors[i] }} />
          {label} {total ? Math.round((data[i] / total) * 100) : 0}%
        </span>
      ))}
    </div>
  );
};

const Insights = ({ refresh }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const[trendData , setTrendData] =useState([]);
  
  const token = localStorage.getItem("token");  
  useEffect(() => { fetchTrends();
                  fetchInsights(); }, [refresh]);

   const fetchTrends = async ()=>{
    try{
      const res = await axios.get(`http://localhost:4000/api/journal/trend`,
         {
          headers: {
            Authorization:`Bearer ${token}`
        }
      }
      );
      setTrendData(res.data.data);
    }catch(err){
      console.error("Trend fetch error:", err.message);
    }}
                  
  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/api/journal/insights`,
        {
          headers: {
            Authorization:`Bearer ${token}`
        }
      }
      );
      setData(res.data);
    } catch (err) {
      console.error("Insights fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };
   const trendLabels = trendData.map(d => d.date);
 const trendValues = trendData.map(d => d.avgSentiment);
const lineData = {
  labels: trendLabels,
  datasets: [
    {
      label: "Mood Trend",
      data: trendValues,
      borderColor: "#7c5cfc",
      backgroundColor: "rgba(124,92,252,0.2)",
      tension: 0.3
    }
  ]
};

  if (loading) return <p className="loading">Loading insights...</p>;
  if (!data)   return <p className="empty">No insights yet. Start writing!</p>;

  const emoLabels  = data.emotionStats.map((d) => d.emotion);
  const emoCounts  = data.emotionStats.map((d) => d.count);
  const sentLabels = data.sentimentStats.map((d) => d.sentiment);
  const sentCounts = data.sentimentStats.map((d) => d.count);
 

  return (
    <div className="insights">

  
      <div className="insights-header">
        <h2 className="insights-title">Insights</h2>
        <p className="insights-sub">A snapshot of your journaling patterns</p>
      </div>
      
      <div className="insights-stats">
        <div className="insights-stat-card">
          <div className="insights-stat-icon purple">📓</div>
          <span className="stat-label">Total Entries</span>
          <span className="stat-value purple">{data.totalEntries}</span>
        </div>
        <div className="insights-stat-card">
          <div className="insights-stat-icon rose">✨</div>
          <span className="stat-label">Top Emotion</span>
          <span className="stat-value rose">{data.topEmotion}</span>
        </div>
        <div className="insights-stat-card">
          <div className="insights-stat-icon teal">🌿</div>
          <span className="stat-label">Top Ambience</span>
          <span className="stat-value teal">{data.topAmbience}</span>
        </div>
      </div>

   
      <div className="insights-charts">
        <div className="insights-chart-card">
          <span className="chart-card-label">Emotion distribution</span>
          <CustomLegend labels={emoLabels} colors={EMO_COLORS} data={emoCounts} />
          <div className="chart-wrap">
            <Doughnut
              data={{ labels: emoLabels, datasets: [{ data: emoCounts, backgroundColor: EMO_COLORS, borderWidth: 2, borderColor: "#0d0d12", hoverOffset: 6 }] }}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="insights-chart-card">
          <span className="chart-card-label">Sentiment breakdown</span>
          <CustomLegend labels={sentLabels} colors={SENT_COLORS} data={sentCounts} />
          <div className="chart-wrap">
            <Doughnut
              data={{ labels: sentLabels, datasets: [{ data: sentCounts, backgroundColor: SENT_COLORS, borderWidth: 2, borderColor: "#0d0d12", hoverOffset: 6 }] }}
              options={chartOptions}
            />
          </div>
        </div>
      </div>

    
      <div className="insights-keywords-card">
        <span className="chart-card-label">Recent keywords</span>
        <div className="pills">
          {data.recentKeywords.map((kw, i) => (
            <span key={i} className="pill">{kw}</span>
          ))}
        </div>
      </div>
      <div className="insights-chart-card">
  <span className="chart-card-label">Mood Trend Over Time</span>
  <div className="chart-wrap" style={{ height: "250px" }}>
    <Line data={lineData} />
  </div>
</div>

    </div>
  );
};

export default Insights;