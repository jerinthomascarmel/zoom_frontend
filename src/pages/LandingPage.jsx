import { Link } from "react-router-dom";


function LandingPage() {
    return (
      <>
        <Link to="/auth">
          <button>Get Started</button>
        </Link>
      </>
    );
}

export default LandingPage;