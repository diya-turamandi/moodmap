import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/main.css";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  // 🔥 If user refreshes page → prevent crash
  if (!data) {
    return (
      <div className="results-container">
        <h2>No data found 😢</h2>
        <button className="btn" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  const getEmoji = (mood) => {
    switch (mood) {
      case "happy":
        return "😄";
      case "sad":
        return "😔";
      case "stressed":
        return "😫";
      case "bored":
        return "😐";
      default:
        return "✨";
    }
  };

  return (
    <div className="results-container">

      {/* USER INFO */}
      <div className="glass info-box">
        <p><b>Mood:</b> {data.mood}</p>
        <p><b>Budget:</b> ₹{data.budget}</p>
        <p><b>Time:</b> {data.time}</p>
        <p><b>Location:</b> {data.location || "Not specified"}</p>
      </div>

      {/* HEADER */}
      <h2 className="heading">
        {getEmoji(data.mood)} Suggestions for a {data.mood} day
      </h2>

      {/* AI SUGGESTION */}
      <div className="glass suggestion-box">
        {data.suggestion}
      </div>

      {/* PLACES SECTION */}
      <h3 style={{ marginTop: "30px" }}>Recommended Places 📍</h3>

      {data.places.length === 0 ? (
        <p>No places found 😕</p>
      ) : (
        <div className="cards">
          {data.places.map((place, index) => (
            <motion.div
              className="card"
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3>{place.name || "Unknown Place"}</h3>

              <p className="address">
                {place.address || "No address available"}
              </p>

              {/* ⭐ Rating */}
              <div className="rating">
                {"⭐".repeat(Math.round(place.rating || 0))}
                <span className="rating-number">
                  {place.rating ? ` (${place.rating})` : " (N/A)"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🔙 BACK BUTTON */}
      <div style={{ marginTop: "30px" }}>
        <button className="btn" onClick={() => navigate("/")}>
          Try Again 🔄
        </button>
      </div>
    </div>
  );
}

export default Results;