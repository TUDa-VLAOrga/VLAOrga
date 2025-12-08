import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CalendarPage from "./pages/CalendarPage";
import SSEComponent from './components/sse/SseComponent';

function App() {

  return (
      <BrowserRouter>
          <div className="App">
              <Routes>
                  <Route path="/" element={<LoginPage/>}/>
                  <Route path="/calendar" element={<CalendarPage/>}/>
              </Routes>
          </div>
        <SSEComponent></SSEComponent>
    </BrowserRouter>
  );
}

export default App
