import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "easy-peasy";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./store/easy-peasy";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    if (userId) {
      store.getActions().setUserId(userId);
      const url = new URL(window.location.href);
      url.searchParams.delete("userId");
      window.history.replaceState({}, "", url.pathname + (url.search || "") + url.hash);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
