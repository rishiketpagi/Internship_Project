import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
    return (
        <div className="home-page">
            <h1>Home</h1>
            <Link to="/input-resume">Go to Data Input</Link><br />
            <Link to="/templates">Go to Templates</Link>
        </div>
    );
}

export default Home;