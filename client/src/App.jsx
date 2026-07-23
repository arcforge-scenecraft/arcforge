import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
<<<<<<< Updated upstream
import ProjectDetail from "./pages/projects/ProjectDetail";
import CreateProject from "./pages/projects/CreateProject";
import EditProject from "./pages/projects/EditProject";
=======
import ProjectDetail from "./pages/ProjectDetail";
import CharacterFormPage from "./pages/CharacterFormPage";
>>>>>>> Stashed changes
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
<<<<<<< Updated upstream
      <Route path="/projects/new" element={<CreateProject />} />
      <Route path="/projects/:projectId/edit" element={<EditProject />} />
=======
      <Route
        path="/projects/:projectId/characters/new"
        element={<CharacterFormPage />}
      />
      <Route
        path="/projects/:projectId/characters/:characterId/edit"
        element={<CharacterFormPage />}
      />
>>>>>>> Stashed changes
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
