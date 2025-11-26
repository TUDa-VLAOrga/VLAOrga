import './App.css'
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from './components/mode-toggle';
import SSEHandler from './SSEHandler';

function App() {

  return (
    <div className="App">
    <ThemeProvider storageKey="vite-ui-theme">
      <ModeToggle></ModeToggle>
      <SSEHandler></SSEHandler>
    </ThemeProvider>
    </div>
  );
}

export default App
