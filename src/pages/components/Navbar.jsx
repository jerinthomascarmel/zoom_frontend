import "./Navbar.jsx";
import VideocamIcon from "@mui/icons-material/Videocam";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard.jsx";
import { Link } from "react-router-dom";

function NavBar() {
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const navigate = useNavigate();
  return (
    <div className="mx-5">
      <nav className="navbar navbar-expand-lg bg-body-tertiary ">
        <div className="container-fluid">
          <Link className="navbar-brand fs-3" to="/">
            <VideocamIcon className="me-2" style={{ height: "3.5rem" }} />
            PEER VIDEO
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item  mx-2">
                <a className="nav-link" href="#">
                  {isAuthenticated && (
                    <button
                      type="button"
                      className="btn btn-dark mx-4"
                      onClick={() => navigate("/get-rooms")}
                    >
                      Your Rooms
                    </button>
                  )}
                  {!isAuthenticated && (
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => navigate("/auth")}
                    >
                      Sign in
                    </button>
                  )}
                  {isAuthenticated && (
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => signOut()}
                    >
                      Logout
                    </button>
                  )}
                </a>
              </li>
              <li className="nav-item  mx-2">
                <a className="nav-link" href="#">
                  {!isAuthenticated && (
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => navigate("/auth")}
                    >
                      Log in
                    </button>
                  )}
                </a>
              </li>
              {isAuthenticated && (
                <li className="nav-item  mx-2">
                  <ProfileCard username={auth.username} />
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
