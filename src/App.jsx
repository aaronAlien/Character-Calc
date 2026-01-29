import { Routes, Route, Navigate } from "react-router-dom";
import AllCharacters from "./pages/AllCharacters";
import Dashboard from "./pages/Dashboard";
import CharacterPage from "./pages/CharacterPage";
import Footer from "./components/ui/Footer";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Main content */}
      <div className="flex-1">
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/characters/:id' element={<CharacterPage />} />
      <Route path='*' element={<Navigate to='/' replace />} />
      <Route path='/characters' element={<AllCharacters />} />
    </Routes>
    </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
