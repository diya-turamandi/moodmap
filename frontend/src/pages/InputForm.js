
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Get current location
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

          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);

          // Convert coordinates into readable location
          const response = await fetch(
            "http://localhost:5000/api/reverse-geocode",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                latitude,
                longitude
              })
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.error || "Unable to detect location"
            );
          }

          // Automatically fill location field
          setForm((prev) => ({
            ...prev,
            location: data.location
          }));

          console.log("Detected location:", data.location);

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
          setLocationError(
            "Location permission denied. Please allow location access."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Your location is currently unavailable."
          );
        } else if (error.code === 3) {
          setLocationError(
            "Location request timed out. Please try again."
          );
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

  // Submit form
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
        console.error("Backend error:", data);
        throw new Error(
          data.error || "Failed to fetch suggestions"
        );
      }

      console.log("API DATA:", data);

      navigate("/results", {
        state: {
          ...form,
          availableTime: Number(form.time),
          suggestion:
            data?.suggestion || "No suggestion found",
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
    <div
      className="inputbox"
      style={{
        maxWidth: "420px",
        margin: "60px auto"
      }}
    >
      <h2>Tell Us Your Mood 💭</h2>

      <form onSubmit={handleSubmit}>

        <div
          className="glass-box"
          style={{ marginBottom: "20px" }}
        >

          {/* Mood */}
          <select
            name="mood"
            value={form.mood}
            onChange={handleChange}
            required
          >
            <option value="">Select Mood</option>
            <option value="happy">Happy 😊</option>
            <option value="sad">Sad 😔</option>
            <option value="stressed">Stressed 😫</option>
            <option value="bored">Bored 😐</option>
          </select>

          <div style={{ height: "20px" }}></div>

          {/* Budget */}
          <input
            type="number"
            name="budget"
            value={form.budget}
            placeholder="Budget ₹"
            min="0"
            onChange={handleChange}
            required
          />

          {/* Available Time */}
          <input
            type="number"
            name="time"
            value={form.time}
            placeholder="Available time (in hours)"
            min="0.5"
            step="0.5"
            onChange={handleChange}
            required
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            value={form.location}
            placeholder="Enter location"
            onChange={handleChange}
            required
          />

          {/* Current Location Button */}
          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={locationLoading}
            style={{
              marginTop: "12px",
              padding: "12px",
              width: "100%",
              cursor: locationLoading ? "wait" : "pointer",
              borderRadius: "8px"
            }}
          >
            {locationLoading
              ? "Detecting location..."
              : "📍 Use My Current Location"}
          </button>

          {/* Location Error */}
          {locationError && (
            <p
              style={{
                color: "red",
                fontSize: "13px",
                marginTop: "10px"
              }}
            >
              {locationError}
            </p>
          )}

        </div>

        {/* Submit */}
        <button
          className="btn"
          type="submit"
          disabled={loading || locationLoading}
        >
          {loading
            ? "Finding places..."
            : "Find Suggestions 🔍"}
        </button>

      </form>
    </div>
  );
}

export default InputForm;
