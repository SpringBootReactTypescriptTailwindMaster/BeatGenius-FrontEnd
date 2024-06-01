import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import SideMenu from "./components/SideMenu";
import ApiCatalogue from "./components/ApiCatalogue";
import ApiTest from "./components/ApiTest";
import { Authentification } from "./view/Authentification";
import { Logout } from "./components/Logout";
import { ApiUserInstrumentale } from "./components/ApiUserInstrumentale";
import { ModifierProfile } from "./components/ModifierProfile";
import { Inscription } from "./components/Inscription";
import { SidemenuProvider } from "./components/SidemenuContext";
function App() {
  return (
    <div>
      <SidemenuProvider>
        <SideMenu />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogue" element={<ApiCatalogue />} />
            <Route path="/api-test" element={<ApiTest />} />
            <Route path="/login" element={<Authentification />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/instrumentales" element={<ApiUserInstrumentale />} />
            <Route path="/modifier-profile" element={<ModifierProfile />} />
            <Route path="/inscription" element={<Inscription />} />
          </Routes>
        </Router>
      </SidemenuProvider>
    </div>
  );
}
export default App;
