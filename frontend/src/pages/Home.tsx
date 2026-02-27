import { useStoreState, useStoreActions } from "../store/easy-peasy/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setGlobalToken } from "../services/storageService";

export default function Home() {
  const isAuthenticated = useStoreState((state) => state.isAuthenticated);
  const user = useStoreState((state) => state.user);
  const logout = useStoreActions((actions) => actions.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    setGlobalToken(null);
    logout();
    navigate("/login", { replace: true });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/5 border border-slate-200/60 p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-slate-800">You&apos;re signed in</h1>
        <p className="text-slate-500 mt-2">Welcome, {user.name || user.email}</p>
        <button
          onClick={handleLogout}
          className="mt-6 px-6 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
