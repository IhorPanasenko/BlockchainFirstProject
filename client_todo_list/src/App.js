import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainPage/MainPage";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Routes>
          <Route path="/" Component={MainPage}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
