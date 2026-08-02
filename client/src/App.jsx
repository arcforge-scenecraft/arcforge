import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/projects/ProjectDetail";
import CreateProject from "./pages/projects/CreateProject";
import EditProject from "./pages/projects/EditProject";
import LocationLibrary from "./pages/locations/LocationLibrary";
import LocationDetail from "./pages/locations/LocationDetail";
import CreateLocation from "./pages/locations/CreateLocation";
import EditLocation from "./pages/locations/EditLocation";

import CharacterRoster from "./pages/characters/CharacterRoster";
import CharacterDetail from "./pages/characters/CharacterDetail";
import CreateCharacter from "./pages/characters/CreateCharacter";
import EditCharacter from "./pages/characters/EditCharacter";
import SceneLibrary from "./pages/scenes/SceneLibrary";
import SceneDetail from "./pages/scenes/SceneDetail";
import CreateScene from "./pages/scenes/CreateScene";
import EditScene from "./pages/scenes/EditScene";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-shell__content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/projects/:projectId/edit" element={<EditProject />} />
          <Route
            path="/projects/:projectId/scenes/"
            element={<SceneLibrary />}
          />
          <Route
            path="/projects/:projectId/scenes/new/"
            element={<CreateScene />}
          />
          <Route
            path="/projects/:projectId/scenes/:sceneId/"
            element={<SceneDetail />}
          />
          <Route
            path="/projects/:projectId/scenes/:sceneId/edit/"
            element={<EditScene />}
          />
          <Route
            path="/projects/:projectId/locations"
            element={<LocationLibrary />}
          />
          <Route
            path="/projects/:projectId/locations/:locationId"
            element={<LocationDetail />}
          />
          <Route
            path="/projects/:projectId/locations/new"
            element={<CreateLocation />}
          />
          <Route
            path="/projects/:projectId/locations/:locationId/edit"
            element={<EditLocation />}
          />
          <Route
            path="/projects/:projectId/characters"
            element={<CharacterRoster />}
          />
          <Route
            path="/projects/:projectId/characters/new"
            element={<CreateCharacter />}
          />
          <Route
            path="/projects/:projectId/characters/:characterId"
            element={<CharacterDetail />}
          />
          <Route
            path="/projects/:projectId/characters/:characterId/edit"
            element={<EditCharacter />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
