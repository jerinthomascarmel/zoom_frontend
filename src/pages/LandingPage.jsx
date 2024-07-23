import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <>
      <Link to="/auth">
        <button>Get Started</button>
      </Link>
      <Link to="/videocall">
        <button>videocall!</button>
      </Link>
    </>
  );
}

export default LandingPage;
