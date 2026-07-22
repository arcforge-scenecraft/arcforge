import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/projects/ProjectDetail";
import CreateProject from "./pages/projects/CreateProject";
import EditProject from "./pages/projects/EditProject";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
      <Route path="/projects/new" element={<CreateProject />} />
      <Route path="/projects/:projectId/edit" element={<EditProject />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
