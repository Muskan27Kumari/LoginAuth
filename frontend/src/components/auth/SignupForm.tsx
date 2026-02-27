import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateField, validateForm } from "../../utils";
import { useAppMutation } from "../../api/useAppMutation";
import { toast } from "react-toastify";

const validationRules = {
  full_name: [{ required: true, message: "Please enter fullname" }],
  contact: [{ required: true, message: "Please enter contact number" }],
  company_name: [{ required: true, message: "Please enter company name" }],
  designation: [{ required: true, message: "Please enter designation" }],
  department: [{ required: true, message: "Please enter department" }],
  email: [
    { required: true, message: "Please enter your email" },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
  ],
  password: [
    { required: true },
    {
      pattern: /^(?=.*\d)(?=.*[a-z]).{6,}$/,
      message: "Password must be at least 6 characters and include at least one number and one letter",
    },
  ],
};

export interface SignupFormProps {
  setAuthPage?: (page: string) => void;
}

export function SignupForm({ setAuthPage }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    contact: "",
    designation: "",
    department: "",
    company_name: "",
  });
  const [isHide, setIsHide] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: signup } = useAppMutation({
    onSuccess: (data: { data?: { token?: string } }) => {
        if (data?.data?.token) {
          toast.success("Account created! Please sign in.");
          setTimeout(() => (setAuthPage ? setAuthPage("login") : navigate("/login")), 1500);
        }
      setIsLoading(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      setIsLoading(false);
      toast.error(error?.response?.data?.message || "Registration failed. Please try again.");
    },
  });

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
      signup({
        endPoint: "/client/auth/signup",
        payload: {
          full_name: formData.full_name,
          email: formData.email,
          contact: formData.contact,
          roles: ["ADMIN"],
          company_name: formData.company_name,
          department: formData.department,
          password: formData.password,
          designation: formData.designation,
        },
      } as { endPoint: string; payload: unknown });
    } else {
      setErrors(validationErrors);
    }
  };

  const inputClasses = "bg-white border-2 border-gray-300 text-gray-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600 focus:ring-opacity-50 rounded-lg placeholder-gray-400 h-10 px-3 w-full focus:outline-none";

  return (
    <form className="w-full space-y-4" onSubmit={onSubmitHandler}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="full_name" className="text-sm font-medium mb-1 block text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => onChangeHandler(e.target.value, "full_name")}
            required
            className={`${inputClasses} ${errors.full_name ? "border-red-500" : ""}`}
            placeholder="Enter your full name"
            id="full_name"
            name="full_name"
          />
          {errors.full_name && <p className="text-xs text-red-600 mt-1">{errors.full_name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium mb-1 block text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChangeHandler(e.target.value, "email")}
            required
            className={`${inputClasses} ${errors.email ? "border-red-500" : ""}`}
            placeholder="Enter your email"
            id="email"
            name="email"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="contact" className="text-sm font-medium mb-1 block text-gray-700">
            Contact
          </label>
          <input
            type="tel"
            value={formData.contact}
            onChange={(e) => onChangeHandler(e.target.value, "contact")}
            required
            className={`${inputClasses} ${errors.contact ? "border-red-500" : ""}`}
            placeholder="Enter your contact number"
            id="contact"
            name="contact"
          />
          {errors.contact && <p className="text-xs text-red-600 mt-1">{errors.contact}</p>}
        </div>

        <div>
          <label htmlFor="company_name" className="text-sm font-medium mb-1 block text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            value={formData.company_name}
            onChange={(e) => onChangeHandler(e.target.value, "company_name")}
            required
            className={`${inputClasses} ${errors.company_name ? "border-red-500" : ""}`}
            placeholder="Enter your company name"
            id="company_name"
            name="company_name"
          />
          {errors.company_name && <p className="text-xs text-red-600 mt-1">{errors.company_name}</p>}
        </div>

        <div>
          <label htmlFor="designation" className="text-sm font-medium mb-1 block text-gray-700">
            Designation
          </label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => onChangeHandler(e.target.value, "designation")}
            required
            className={`${inputClasses} ${errors.designation ? "border-red-500" : ""}`}
            placeholder="Enter your designation"
            id="designation"
            name="designation"
          />
          {errors.designation && <p className="text-xs text-red-600 mt-1">{errors.designation}</p>}
        </div>

        <div>
          <label htmlFor="department" className="text-sm font-medium mb-1 block text-gray-700">
            Department
          </label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => onChangeHandler(e.target.value, "department")}
            required
            className={`${inputClasses} ${errors.department ? "border-red-500" : ""}`}
            placeholder="Enter your department"
            id="department"
            name="department"
          />
          {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <button
            type="button"
            onClick={() => setIsHide(!isHide)}
            className="text-xs text-emerald-600 hover:text-emerald-700"
          >
            {isHide ? "Show" : "Hide"}
          </button>
        </div>
        <input
          type={isHide ? "password" : "text"}
          value={formData.password}
          onChange={(e) => onChangeHandler(e.target.value, "password")}
          required
          className={`${inputClasses} ${errors.password ? "border-red-500" : ""}`}
          placeholder="Create a strong password"
          id="password"
          name="password"
        />
        {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 rounded border-gray-300 bg-white text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the Terms and Privacy Policy
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full p-3 rounded-lg text-white font-medium bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 transition-all"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating Account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        {setAuthPage ? (
          <button type="button" onClick={() => setAuthPage("login")} className="text-emerald-600 hover:text-emerald-700 font-medium">
            Sign In
          </button>
        ) : (
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Sign In
          </Link>
        )}
      </p>
    </form>
  );
}
