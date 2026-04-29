import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";
import { useNavigate } from "react-router-dom";
import  {Trash2Icon,Edit2} from "lucide-react";
import {toast} from 'react-toastify';

const JournalList = ({ refresh }) => {
const [journals, setJournals] = useState([]);
const [emotionFilter, setEmotionFilter] = useState("");
const [sentimentFilter, setSentimentFilter] = useState("");
const [search, setSearch] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [sortBy, setSortBy] = useState("latest");
const [editingId, setEditingId] = useState(null);
const [editText, setEditText] = useState("");
const [editAmbience, setEditAmbience] = useState("");
const limit = 5;

const API_BASE = import.meta.env.VITE_API_BASE ;
useEffect(() => {
  setCurrentPage(1);
}, [refresh, emotionFilter, sentimentFilter, search]);

 useEffect(() => {
   fetchJournals();
  }, [currentPage, sortBy, emotionFilter, sentimentFilter]);

  const navigate = useNavigate();

  const emojiMap = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  calm: "😌",
  anxious: "😰",
  neutral: "😐"
};

const sentimentColor = {
  positive: "green",
  negative: "red",
  neutral: "gray"
};
 
const token = localStorage.getItem("token"); 
 if (!token) {
      toast.warning("User not authenticated!");
      return navigate("/login");
    }
const fetchJournals = async () => {
  try {

    const params = {
      page: currentPage,
      limit,
      sortBy,
      search,
      emotion: emotionFilter,
      sentiment: sentimentFilter
    };

    const res = await axios.get(
      `${API_BASE}/journal`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setJournals(res.data.data);
    setTotalPages(res.data.totalPages || 1);

  } catch (err) {
    console.log("Fetch error:", err.message);
  }
};
  
      
  const handleDelete = async(id)=>{
    try{
        
      const confiremDelete = window.confirm("are you sure you  want to delete?");
      if(!confiremDelete){
        return
      }
       console.log("journal id:",id);
    const res =  await axios.delete(`${API_BASE}/journal/${id}`
        ,{
         headers: {
         Authorization: `Bearer ${token}`
      }
   }
    )
   
     if(res.data.success){
      toast.success("journal entry deleted successfully");
      fetchJournals();

     }else{
      toast.error("something went wrong ! try again")
      console.log(err.message)
     }
    }catch(err){
      console.log("failed to delete journal", err.message);
    }
  };
     const handleUpdate = async () => {
        try {
          const res = await axios.put(
            `${API_BASE}/journal/${editingId}`,
            {
              text: editText,
              ambience: editAmbience,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.data.success) {
            setEditingId(null);
            fetchJournals();
          }
        } catch (err) {
          console.error(err);
        }
      };

      const searchJournals = journals;

      const highlightText = (text, search) => {
      if (!text) return "";
      if (!search) return text;

      const regex = new RegExp(`(${search})`, "gi");

      return text.split(regex).map((part, i) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <span key={i} className="highlight">
            {part}
          </span>
        ) : (
          part
        )
      );
    };

      return (
      <div className="journal-list">
        <input
          type="text"
          placeholder=" Search journals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
       {journals.length === 0 && (
        <p className="empty">No journal entries found. Start writing your first entry!</p>
          )}
      <div className="filters">
          <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="latest">🆕 Latest First</option>
          <option value="oldest">📜 Oldest First</option>
        </select>
          <select onChange={(e) => setEmotionFilter(e.target.value)}>
            <option value="">All Emotions</option>
            <option value="happy">😊 Happy</option>
            <option value="sad">😢 Sad</option>
            <option value="angry">😠 Angry</option>
            <option value="calm">😌 Calm</option>
            <option value="anxious">😰 Anxious</option>
            <option value="neutral">😐 Neutral</option>
          </select>

          <select onChange={(e) => setSentimentFilter(e.target.value)}>
            <option value="">All Sentiment</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
     <h2 className="journal-list__title">Journal Entries</h2>
      {searchJournals.length === 0 ? (  
      <p className="empty">No matching entries</p>
    ) : (
    <div className="journal-list__entries">
      {searchJournals.map((j) => (
        <div key={j._id} className="journal-entry">
          <div className="deleteIcon"  onClick={()=>{
             console.log("Clicked", j);
            handleDelete(j._id)
            
          }}>
          <Trash2Icon/>
          </div>
          <div className="updateIcon"
              
              onClick={() => {
                setEditingId(j._id);
                setEditText(j.text);
               setEditAmbience(j.ambience);
             }}>
          <Edit2/>
          </div>
          
          {editingId === j._id ? (
          <div className="edit-mode">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="textarea"
            />

            <select
              value={editAmbience}
              onChange={(e) => setEditAmbience(e.target.value)}
              className="select"
            >
              <option value="forest">🌲 Forest</option>
              <option value="ocean">🌊 Ocean</option>
              <option value="mountain">⛰️ Mountain</option>
            </select>

            <div className="edit-actions">
              <button className="btn save" onClick={handleUpdate}>
                Save
              </button>
              <button
                className="btn cancel"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="journal__entry__text">
            {highlightText(j.text, search)}
          </p>
        )}
            <p className="summary">{j.summary}</p>
          <div className="journal-entry__meta"  >
            <span className="badge orange">
              {emojiMap[j.emotion]} {j.emotion}
            </span>
            <span className="badge green">{j.ambience}</span>
          <span className={`badge ${sentimentColor[j.sentiment]}`}>
            {j.sentiment}
          </span>
          </div>
        </div>
      ))}
    </div>
    
     )}
    <div className="pagination">
      <button onClick={()=>setCurrentPage(prev => prev-1)}
      disabled = {currentPage === 1}>
        Prev
      </button>
      <span>{currentPage}/{totalPages}</span>
    <button onClick={()=>setCurrentPage(prev => prev+1)}
      disabled = {currentPage === totalPages}>
        Next
      </button>
    </div>
  </div>
    );
  };

export default JournalList;