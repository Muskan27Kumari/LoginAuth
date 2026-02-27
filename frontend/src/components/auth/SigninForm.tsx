import { useState } from "react";
import { validateField, validateForm } from "../../utils";
import { useAppMutation } from "../../api/useAppMutation";
import { useStoreActions } from "../../store/easy-peasy/hooks";
import { setGlobalToken } from "../../services/storageService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { encryptToken } from "../../lib/encryptAuth";

const validationRules = {
  email: [
    { required: true, message: "Please enter your email" },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
  ],
};

export interface SigninFormProps {
  setAuthPage?: (page: string) => void;
}

export function SigninForm({ setAuthPage }: SigninFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isHide, setIsHide] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addUser = useStoreActions((store) => store.addUser);
  const setAuthenticated = useStoreActions((store) => store.setAuthenticated);

  const { mutate: signin } = useAppMutation(
    {
      onSuccess: async (data: { data?: { token?: string; email?: string; username?: string; id?: string; roles?: string[]; settings?: string[] } }) => {
        if (data?.data?.token) {
          const signinResponseData = data.data;
          const token = signinResponseData.token ?? "";
          addUser({
            token,
            setting: "profile",
            roles: signinResponseData.roles || [],
            settings: signinResponseData.settings || [],
            user: {
              email: signinResponseData.email || "",
              name: signinResponseData.username || "",
              id: signinResponseData.id || "",
            },
          });
          setGlobalToken(token);
          toast.success("Signed in successfully!");
          setIsLoading(false);
          setAuthenticated(true);

          const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL;
          if (dashboardUrl) {
            const secret = import.meta.env.VITE_AUTH_SECRET || "";
            const encrypted = secret ? await encryptToken(token, secret) : token;
            const base = dashboardUrl.replace(/\/$/, "");
            const params = new URLSearchParams();
            params.set("auth", encrypted);
            if (signinResponseData.id) params.set("userId", signinResponseData.id);
            window.location.href = `${base}?${params.toString()}`;
          } else {
            navigate("/", { replace: true });
          }
        }
      },
      onError: (error: { response?: { data?: { message?: string } } }) => {
        setIsLoading(false);
        const msg = error?.response?.data?.message;
        if (msg === "Your are already registered. Wait we are approving you as admin or contact with us.") {
          toast.error(msg);
        } else {
          toast.error(msg || "Sign in failed. Please try again.");
        }
      },
    }
  );

  const onChangeHandler = (value: string | boolean, name: string) => {
    setFormData({ ...formData, [name]: value });
    const fieldErrors = validateField(name, value, validationRules);
    setErrors((prev) => ({ ...prev, [name]: fieldErrors?.[0] || "" }));
  };

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData, validationRules);
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      signin({
        endPoint: "/client/auth/signin",
        payload: { email: formData.email, password: formData.password },
      } as { endPoint: string; payload: unknown });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form className="w-full space-y-4" onSubmit={onSubmitHandler}>
      <div className="mb-1">
        <label htmlFor="email" className="text-sm font-medium mb-1 block text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChangeHandler(e.target.value, "email")}
          required
          className={`w-full h-10 px-3 rounded-lg border-2 bg-white border-gray-300 text-gray-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600 focus:ring-opacity-50 focus:outline-none placeholder-gray-400 ${
            errors.email ? "border-red-500" : ""
          }`}
          placeholder="Enter your email"
          id="email"
          name="email"
        />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div className="mb-1">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <button
            type="button"
            onClick={() => setIsHide(!isHide)}
            className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {isHide ? "Show" : "Hide"}
          </button>
        </div>
        <input
          type={isHide ? "password" : "text"}
          value={formData.password}
          onChange={(e) => onChangeHandler(e.target.value, "password")}
          required
          className={`w-full h-10 px-3 rounded-lg border-2 bg-white border-gray-300 text-gray-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600 focus:ring-opacity-50 focus:outline-none placeholder-gray-400 ${
            errors.password ? "border-red-500" : ""
          }`}
          placeholder="Enter your password"
          id="password"
          name="password"
        />
        {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
      </div>

      <div className="flex items-center mb-1">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-3 w-3 rounded border-gray-300 bg-white text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="remember-me" className="ml-1 block text-xs text-gray-700">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-3 rounded-lg text-white font-medium transition-all duration-200 bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>

      {setAuthPage && (
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button type="button" onClick={() => setAuthPage("register")} className="text-emerald-600 hover:text-emerald-700 font-medium">
            Register
          </button>
        </p>
      )}
    </form>
  );
}
