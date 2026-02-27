import { useEffect } from "react";
import { SigninForm } from "../components/auth/SigninForm";
import { Link, useNavigate } from "react-router-dom";
import { useStoreState } from "../store/easy-peasy/hooks";

export default function Login() {
  const isAuthenticated = useStoreState((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/5 border border-slate-200/60 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
            <p className="text-slate-500 mt-1">Sign in to your account</p>
          </div>
          <SigninForm />
          <p className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
