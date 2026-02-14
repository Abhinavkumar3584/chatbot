
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MindMapEditor from "./pages/MindMapEditor";
import MindMapViewer from "./pages/MindMapViewer";
import ExamCatalog from "./pages/ExamCatalog";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<MindMapEditor />} />
        <Route path="/explore" element={<ExamCatalog />} />
        <Route path="/view" element={<MindMapViewer />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
