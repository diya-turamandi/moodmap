
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const moods = [
    { emoji: "😊", name: "Happy", description: "Find places to celebrate your vibe" },
    { emoji: "😌", name: "Relaxed", description: "Discover peaceful escapes" },
    { emoji: "😔", name: "Sad", description: "Find little reasons to smile" },
    { emoji: "🤩", name: "Adventurous", description: "Explore something exciting" }
  ];

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="home-navbar">
        <div className="brand">
          <span className="brand-icon">✦</span>
          MoodMap
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <button
          className="nav-button"
          onClick={() => navigate("/form")}
        >
          Explore Now ↗
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section" id="home">

        <div className="hero-content">

          <div className="hero-tag">
            ✨ YOUR MOOD, YOUR NEXT ADVENTURE
          </div>

          <h1>
            Because Your Mood
            <br />
            Deserves a <span>Plan.</span>
          </h1>

          <p className="hero-description">
            Every mood tells a story. Let yours decide where you go next.
            Discover personalized places, food and experiences that match
            your feelings, budget and available time.
          </p>

          <div className="hero-actions">
            <button
              className="hero-button"
              onClick={() => navigate("/form")}
            >
              Find My Experience <span>→</span>
            </button>

            <a href="#how-it-works" className="secondary-link">
              Discover how it works ↓
            </a>
          </div>

          <div className="hero-note">
            <span>✦</span> Made around how you feel, not just where you are.
          </div>

        </div>

        {/* DECORATIVE MOOD CARD */}
        <div className="hero-visual">
          <div className="floating-circle circle-one"></div>
          <div className="floating-circle circle-two"></div>

          <div className="mood-preview-card">

            <div className="preview-top">
              <span>YOUR DAY, REIMAGINED</span>
              <span className="live-dot">●</span>
            </div>

            <div className="preview-emoji">🌸</div>

            <h2>How are you feeling today?</h2>
            <p>Let your mood lead the way.</p>

            <div className="preview-moods">
              <span>😊</span>
              <span>😌</span>
              <span>🥰</span>
              <span>🤩</span>
            </div>

            <div className="preview-divider"></div>

            <div className="preview-bottom">
              <span>✦</span>
              Your next experience awaits
            </div>

          </div>
        </div>

      </section>

      {/* MOOD SECTION */}
      <section className="mood-section" id="features">

        <div className="section-heading">
          <span className="section-tag">EXPLORE BY FEELING</span>
          <h2>What's your mood today?</h2>
          <p>
            Whatever you're feeling, there's an experience waiting for you.
          </p>
        </div>

        <div className="mood-grid">
          {moods.map((mood) => (
            <div className="mood-card" key={mood.name}>
              <span className="mood-emoji">{mood.emoji}</span>
              <h3>{mood.name}</h3>
              <p>{mood.description}</p>
            </div>
          ))}
        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">

        <div className="section-heading">
          <span className="section-tag">SIMPLE & PERSONALIZED</span>
          <h2>Your mood. Your map. Your moment.</h2>
        </div>

        <div className="steps-grid">

          <div className="step-card">
            <span className="step-number">01</span>
            <div className="step-icon">💭</div>
            <h3>Share Your Mood</h3>
            <p>Tell MoodMap how you're feeling right now.</p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>
            <div className="step-icon">📍</div>
            <h3>Set Your Preferences</h3>
            <p>Add your location, budget and available time.</p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>
            <div className="step-icon">✨</div>
            <h3>Explore Your Plan</h3>
            <p>Discover places and activities for your day.</p>
          </div>

        </div>

        <button
          className="hero-button bottom-button"
          onClick={() => navigate("/form")}
        >
          Let's Find Your MoodMap →
        </button>

      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="brand">
          <span className="brand-icon">✦</span>
          MoodMap
        </div>
        <p>Turn your feelings into unforgettable experiences. 💜</p>
        <span>© 2026 MoodMap. Made with curiosity.</span>
      </footer>

    </div>
  );
}

export default Home;
