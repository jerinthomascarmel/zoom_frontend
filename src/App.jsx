import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WrapperNavBar from "./pages/WrapperNavBar";
import ProtectedRoute from "./pages/ProtectRoomRoute";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import { ClientProvider } from "./contexts/clientProvider";

const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});

function App() {
  return (
    <AuthProvider store={store}>
      <ClientProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthOutlet fallbackPath="/auth" />}>
              <Route path="/room/:roomid" element={<ProtectedRoute />} />
            </Route>
            <Route path="/*" element={<WrapperNavBar />} />
          </Routes>
        </BrowserRouter>
      </ClientProvider>
    </AuthProvider>
  );
}

export default App;
