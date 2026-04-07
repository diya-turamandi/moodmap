import { useLocation } from "react-router-dom";

function Results() {
  const location = useLocation();
  const data = location.state;

  return (
    <div style={{ padding: "20px" }}>
      <div className="glass">
        <p><b>Mood:</b> {data?.mood}</p>
        <p><b>Budget:</b> ₹{data?.budget}</p>
        <p><b>Time:</b> {data?.time}</p>
        <p><b>Location:</b> {data?.location}</p>
      </div>

      <h2> Suggestions for a {data?.mood} day </h2>

      {/* 🔥 REAL RESULT FROM BACKEND */}
      <div style={{ marginTop: "20px" }}>
        <div className="glass">
          {data?.suggestion}
        </div>
      </div>
    </div>
  );
}

export default Results;