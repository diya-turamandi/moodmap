
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

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Send data to backend
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

      // Read backend response
      const data = await res.json();

      // Handle API errors
      if (!res.ok) {
        console.error("Backend error:", data);
        throw new Error(
          data.error || "Failed to fetch suggestions"
        );
      }

      console.log("API DATA:", data);

      // Navigate to results page
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

          {/* Available Time (in hours) */}
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

        </div>

        <button
          className="btn"
          type="submit"
          disabled={loading}
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
