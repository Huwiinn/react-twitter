import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>메인 페이지</h1>} />
    </Routes>
  );
}

export default App;
