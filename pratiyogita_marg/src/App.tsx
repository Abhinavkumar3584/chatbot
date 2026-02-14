
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MindMapEditor from "./pages/MindMapEditor";
import MindMapViewer from "./pages/MindMapViewer";
import ExamCatalog from "./pages/ExamCatalog";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedEditorRoute = () => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/?auth=login" replace />;
  }
  return <MindMapEditor />;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="animated-background">
        <div className="line-grid"></div>
        <div className="diagonal-lines"></div>
      </div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/editor" element={<ProtectedEditorRoute />} />
        <Route path="/explore" element={<ExamCatalog />} />
        <Route path="/view" element={<MindMapViewer />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;

