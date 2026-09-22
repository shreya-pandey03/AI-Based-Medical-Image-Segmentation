import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import useAuthStore from "./stores/authStore";
import { Toaster } from "react-hot-toast";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <AppRoutes />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  );
}

export default App;
