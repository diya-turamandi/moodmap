import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Because Your Mood Deserves a Plan 💭</h1>
<p>
    Not sure what to do with your day? Just tell us how you feel.
Discover personalized travel spots, food, and activities powered by AI — 
all tailored to how you feel in the moment. Whether you're stressed, bored, 
or excited, MoodMap helps you turn emotions into meaningful experiences designed around your emotions.
</p>

      <button className="btn" onClick={() => navigate("/form")}>
        Get Started 🚀
      </button>
    </div>
  );
}

export default Home;