import './styles/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<CalendarPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
