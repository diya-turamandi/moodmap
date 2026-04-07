import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "15px", display: "flex", justifyContent: "space-between" }}>
      <h1>MoodMap </h1>
      <div>
        <Link to="/" style={{ margin: "10px", color: "white", textDecoration: "none", fontWeight: "bold", fontFamily: "Poppins, sans-serif" }}>Home</Link>
        <Link to="/form" style={{ margin: "10px", color: "white", textDecoration: "none", fontWeight: "bold", fontFamily: "Poppins, sans-serif" }}>Start</Link>
      </div>
    </nav>
  );
}

export default Navbar;