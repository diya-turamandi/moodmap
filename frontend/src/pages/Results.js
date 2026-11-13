
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/main.css";
import "./Results.css";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className="results-empty-page">
        <div className="empty-state">
          <span>💭</span>
          <h2>No MoodMap found!</h2>
          <p>Let's start by telling us how you're feeling.</p>
          <button className="results-primary-btn" onClick={() => navigate("/form")}>
            Create My MoodMap →
          </button>
        </div>
      </div>
    );
  }

  const places = Array.isArray(data.places) ? data.places : [];

  const getEmoji = (mood) => {
    switch (mood?.toLowerCase()) {
      case "happy": return "😊";
      case "sad": return "😔";
      case "stressed": return "😫";
      case "bored": return "😐";
      default: return "✨";
    }
  };

  const getMoodMessage = (mood) => {
    switch (mood?.toLowerCase()) {
      case "happy": return "Let's make your happy day even better!";
      case "sad": return "A little change of scenery can help.";
      case "stressed": return "It's time to slow down and breathe.";
      case "bored": return "Let's find something exciting to do!";
      default: return "Your next experience starts here.";
    }
  };

  const openMaps = (place) => {
    const query = place.address
      ? `${place.name}, ${place.address}`
      : place.name;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const formatMood = (mood) =>
    mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : "Not specified";

  return (
    <div className="results-page">

      {/* HERO */}
      <section className="results-hero">

        <div className="results-hero-content">
          <span className="results-tag">✦ YOUR PERSONALIZED MOODMAP</span>

          <h1>
            Your Mood,
            <br />
            Your <span>Adventure.</span>
          </h1>

          <p className="results-subtitle">
            {getEmoji(data.mood)} {getMoodMessage(data.mood)}
          </p>
        </div>

        <div className="results-hero-decoration">
          <span>✨</span>
          <div className="hero-orbit">📍</div>
          <div className="hero-orbit-small">💜</div>
        </div>

      </section>

      {/* PREFERENCE SUMMARY */}
      <section className="results-summary">

        <div className="summary-card">
          <span className="summary-icon">{getEmoji(data.mood)}</span>
          <div>
            <small>YOUR MOOD</small>
            <h3>{formatMood(data.mood)}</h3>
          </div>
        </div>

        <div className="summary-card">
          <span className="summary-icon">💰</span>
          <div>
            <small>YOUR BUDGET</small>
            <h3>₹{Number(data.budget).toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="summary-card">
          <span className="summary-icon">⏰</span>
          <div>
            <small>AVAILABLE TIME</small>
            <h3>{data.availableTime ?? data.time} Hours</h3>
          </div>
        </div>

        <div className="summary-card location-summary">
          <span className="summary-icon">📍</span>
          <div>
            <small>YOUR LOCATION</small>
            <h3>{data.location || "Not specified"}</h3>
          </div>
        </div>

      </section>

      {/* AI SUGGESTION */}
      <section className="ai-section">

        <div className="ai-card">
          <div className="ai-card-header">
            <span className="ai-icon">✦</span>
            <div>
              <small>YOUR MOODMAP INSIGHT</small>
              <h2>A little inspiration for your day</h2>
            </div>
          </div>

          <p className="ai-message">
            {data.suggestion || "Let's discover something wonderful today!"}
          </p>
        </div>

      </section>

      {/* PLACES */}
      <section className="places-section">

        <div className="places-heading">
          <div>
            <span className="results-tag">CURATED FOR YOUR MOOD</span>
            <h2>Places to explore <span>📍</span></h2>
            <p>Experiences that match your mood and preferences.</p>
          </div>

          <span className="places-count">
            {places.length} {places.length === 1 ? "Place" : "Places"} found
          </span>
        </div>

        {places.length === 0 ? (

          <div className="no-places">
            <span>🌍</span>
            <h3>No places found just yet</h3>
            <p>
              Try changing your location, budget or available time
              to discover more experiences.
            </p>
            <button
              className="results-primary-btn"
              onClick={() => navigate("/form")}
            >
              Change Preferences →
            </button>
          </div>

        ) : (

          <div className="results-cards">

            {places.map((place, index) => (

              <motion.div
                className="place-card"
                key={place.id || `${place.name}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                whileHover={{ y: -7 }}
              >

                <div className="place-card-top">
                  <span className="place-number">
                    0{index + 1}
                  </span>
                  <span className="place-pin">📍</span>
                </div>

                <div className="place-card-content">

                  <h3>{place.name || "Unknown Place"}</h3>

                  <p className="place-address">
                    <span>⌖</span>
                    {place.address || "Address unavailable"}
                  </p>

                  <div className="place-rating">
                    <span>⭐</span>
                    <strong>
                      {place.rating ? Number(place.rating).toFixed(1) : "N/A"}
                    </strong>
                    <small>Google rating</small>
                  </div>

                  <button
                    className="map-button"
                    onClick={() => openMaps(place)}
                    disabled={!place.name}
                  >
                    View on Google Maps <span>↗</span>
                  </button>

                </div>

              </motion.div>

            ))}

          </div>
        )}

      </section>

      {/* BOTTOM CTA */}
      <section className="results-bottom">

        <span>💜</span>
        <h2>There's always somewhere new to explore.</h2>
        <p>Your next adventure could feel completely different.</p>

        <button
          className="results-primary-btn"
          onClick={() => navigate("/form")}
        >
          Create Another MoodMap →
        </button>

      </section>

      {/* FOOTER */}
      <footer className="results-footer">
        <h3>✦ MoodMap</h3>
        <p>Turn your feelings into unforgettable experiences.</p>
        <span>© 2026 MoodMap</span>
      </footer>

    </div>
  );
}

export default Results;
