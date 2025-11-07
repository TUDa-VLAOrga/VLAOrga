import './App.css'
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from './components/mode-toggle';

function App() {

  return (
    <div className="App">
    <ThemeProvider storageKey="vite-ui-theme">
      <ModeToggle></ModeToggle>
    </ThemeProvider>
    </div>
  );
}

export default App
