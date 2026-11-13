
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InputForm.css";

function InputForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mood: "",
    budget: "",
    time: "",
    location: ""
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const moods = [
    { value: "happy", emoji: "😊", label: "Happy", description: "Feeling good" },
    { value: "sad", emoji: "😔", label: "Sad", description: "Need a little joy" },
    { value: "stressed", emoji: "😫", label: "Stressed", description: "Need to unwind" },
    { value: "bored", emoji: "😐", label: "Bored", description: "Need some excitement" }
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // CURRENT LOCATION
  const handleCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const response = await fetch(
            "http://localhost:5000/api/reverse-geocode",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ latitude, longitude })
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Unable to detect location");
          }

          setForm((prev) => ({
            ...prev,
            location: data.location
          }));

        } catch (error) {
          console.error("Location error:", error);
          setLocationError(error.message);
        } finally {
          setLocationLoading(false);
        }
      },

      (error) => {
        console.error("Geolocation error:", error);

        if (error.code === 1) {
          setLocationError("Location permission denied. Please allow location access.");
        } else if (error.code === 2) {
          setLocationError("Your location is currently unavailable.");
        } else if (error.code === 3) {
          setLocationError("Location request timed out. Please try again.");
        } else {
          setLocationError("Unable to get your current location.");
        }

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/analyze-mood",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            mood: form.mood,
            location: form.location,
            budget: Number(form.budget),
            availableTime: Number(form.time)
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch suggestions");
      }

      navigate("/results", {
        state: {
          ...form,
          availableTime: Number(form.time),
          suggestion: data?.suggestion || "No suggestion found",
          places: data?.places || []
        }
      });

    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "Server error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">

      <div className="form-wrapper">

        {/* HEADER */}
        <div className="form-header">
          <span className="form-tag">✦ YOUR PERSONAL EXPERIENCE PLANNER</span>

          <h1>
            Let's Find Your <span>MoodMap.</span>
          </h1>

          <p>
            A little about how you feel is all we need
            to plan something wonderful.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mood-form">

          {/* MOOD SELECTION */}
          <div className="form-section">
            <div className="field-heading">
              <div>
                <span className="field-step">01 / YOUR FEELINGS</span>
                <h2>How are you feeling today?</h2>
              </div>
              <span className="field-icon">💭</span>
            </div>

            <div className="mood-options">
              {moods.map((mood) => (
                <button
                  type="button"
                  key={mood.value}
                  className={`mood-option ${
                    form.mood === mood.value ? "selected" : ""
                  }`}
                  onClick={() =>
                    setForm({ ...form, mood: mood.value })
                  }
                  aria-pressed={form.mood === mood.value}
                >
                  <span className="option-emoji">{mood.emoji}</span>
                  <span className="option-label">{mood.label}</span>
                  <span className="option-description">
                    {mood.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* BUDGET AND TIME */}
          <div className="form-section">
            <div className="field-heading">
              <div>
                <span className="field-step">02 / YOUR PLAN</span>
                <h2>Let's work with your preferences.</h2>
              </div>
              <span className="field-icon">✨</span>
            </div>

            <div className="preferences-grid">

              <div className="input-group">
                <label htmlFor="budget">Your budget</label>
                <div className="input-with-icon">
                  <span>₹</span>
                  <input
                    id="budget"
                    type="number"
                    name="budget"
                    value={form.budget}
                    placeholder="e.g. 500"
                    min="1"
                    onChange={handleChange}
                    required
                  />
                </div>
                <small>How much would you like to spend?</small>
              </div>

              <div className="input-group">
                <label htmlFor="time">Available time</label>
                <div className="input-with-icon">
                  <span>◷</span>
                  <input
                    id="time"
                    type="number"
                    name="time"
                    value={form.time}
                    placeholder="e.g. 2"
                    min="0.5"
                    step="0.5"
                    onChange={handleChange}
                    required
                  />
                </div>
                <small>Time available in hours</small>
              </div>

            </div>
          </div>

          {/* LOCATION */}
          <div className="form-section">
            <div className="field-heading">
              <div>
                <span className="field-step">03 / YOUR LOCATION</span>
                <h2>Where should we take you?</h2>
              </div>
              <span className="field-icon">📍</span>
            </div>

            <div className="input-group">
              <label htmlFor="location">Your location</label>

              <input
                id="location"
                className="location-input"
                type="text"
                name="location"
                value={form.location}
                placeholder="Enter city or area..."
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="location-button"
                onClick={handleCurrentLocation}
                disabled={locationLoading}
              >
                {locationLoading
                  ? "◌ Detecting your location..."
                  : "📍 Use My Current Location"}
              </button>

              {locationError && (
                <p className="location-error" role="alert">
                  {locationError}
                </p>
              )}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            className="find-button"
            type="submit"
            disabled={loading || locationLoading}
          >
            {loading ? (
              "Finding your experiences..."
            ) : (
              <>Find My MoodMap <span>→</span></>
            )}
          </button>

          <p className="form-footer-note">
            ✦ Your next memorable experience is just a click away.
          </p>

        </form>
      </div>
    </div>
  );
}

export default InputForm;
