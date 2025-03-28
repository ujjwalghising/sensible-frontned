import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    <Footer />
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
