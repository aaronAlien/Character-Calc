import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import CharacterPage from "./characters/CharacterPage";
import AllCharacters from "./characters/AllCharacters";
import TodoPage from "./todo/ToDoPage";
import CalculatorPage from "./calculator/CalculatorPage";
import Footer from '../components/Footer'
import '../styles/index.css'

export default function App() {
  return (
    <div className="flex main min-h-screen flex-col bg-black">
      {/* main content */}
      <div className="flex-1">
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/characters/:id' element={<CharacterPage />} />
      <Route path='*' element={<Navigate to='/' replace />} />
      <Route path='/characters' element={<AllCharacters />} />
      <Route path='/todo' element={<TodoPage />} />
      <Route path='/calculator' element={<CalculatorPage />} />
    </Routes>
    </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
