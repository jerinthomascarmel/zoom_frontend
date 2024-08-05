import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container p-5">
      <div className="row text-center p-5">
        <h1 className="mt-5">404 Not Found!</h1>
        <p>
          Kiaan couldn’t find that page .We couldn’t find the page you were
          looking for.
        </p>
        <p>
          <Link class="link-opacity-100" to="/">
            Redirects to Home page!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
