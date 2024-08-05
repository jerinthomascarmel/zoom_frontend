import { Route, Routes } from "react-router-dom";

import AuthPage from "./AuthPage";
import HomePage from "./HomePage";
import NavBar from "./components/Navbar";
import NotFound from "./NotFound";
import GetRoomPage from "./GetRoomPage";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";


function WrapperNavBar() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route element={<AuthOutlet fallbackPath="/auth" />}>
          <Route path="/get-rooms" element={<GetRoomPage />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default WrapperNavBar;
