import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RouteChangeSpinner from "./components/RouteChangeSpinner.jsx";
import AppRoutes from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      <RouteChangeSpinner />
        <Navbar />
        <div className="pt-[105px] px-2"> {/* 👈 Push content below fixed navbar */}
          <AppRoutes />
        </div>
        <Footer />
        <ToastContainer position="top-center" />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
