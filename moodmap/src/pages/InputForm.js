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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 SEND DATA TO BACKEND
    fetch("http://localhost:5000/api/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        // 👉 send BOTH form + result to results page
        navigate("/results", {
          state: {
            ...form,
            suggestion: data.suggestion,
          },
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="inputbox" style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Tell Us Your Mood 💭</h2>

      <form onSubmit={handleSubmit}>
        <div className="glass-box" style={{ marginBottom: "20px" }}>

          <select name="mood" onChange={handleChange} required>
            <option value="">Select Mood</option>
            <option>Happy 😊</option>
            <option>Sad 😔</option>
            <option>Stressed 😫</option>
            <option>Bored 😐</option>
          </select>

          <div style={{ height: "20px" }}></div>

          <input
            type="number"
            name="budget"
            placeholder="Budget ₹"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="time"
            placeholder="Time (e.g. 2 hours / 1 day)"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Enter location"
            onChange={handleChange}
          />
        </div>

        <button className="btn">Find Suggestions 🔍</button>
      </form>
    </div>
  );
}

export default InputForm;