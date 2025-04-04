import AppRouter from "./AppRouter";
import { AppProvider } from "./AppContext";

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
