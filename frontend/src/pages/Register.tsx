import { useEffect } from "react";
import { SignupForm } from "../components/auth/SignupForm";
import { Link, useNavigate } from "react-router-dom";
import { useStoreState } from "../store/easy-peasy/hooks";

export default function Register() {
  const isAuthenticated = useStoreState((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/5 border border-slate-200/60 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Create account</h1>
            <p className="text-slate-500 mt-1">Register for a new account</p>
          </div>
          <SignupForm />
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
