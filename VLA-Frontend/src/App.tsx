import './styles/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import LoggerComponent from './components/logger/LoggerComponent';

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<CalendarPage/>}/>
        </Routes>
      </div>
      <LoggerComponent></LoggerComponent>
    </BrowserRouter>
  );
}

export default App;
