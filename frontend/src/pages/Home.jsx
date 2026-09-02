import { Link } from "react-router-dom";
function Home() {
    return (
        <div>
            <h1>Home</h1>
            <Link to="/input-resume">Go to Data Input</Link>
        </div>
    );
}

export default Home;