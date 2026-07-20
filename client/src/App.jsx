import { Link, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
