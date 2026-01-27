import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CharacterPage from './pages/CharacterPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/characters/:id" element={<CharacterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
