
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Heart,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";

import { loginUser } from "../../services/authService";
import { getApiErrorMessage } from "../../utils/apiError";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";


const Login = () => {
  const navigate = useNavigate();
  usePageTitle("Login");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {};
    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setFormError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = await loginUser(formData);
     // Adapt this to your actual API response and role names.
      toast.success("Login successful! Welcome back.");
      const role = data.details?.role ?? data.details?.role.toLowerCase();
      if (role === "Admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "Dentist") {
        navigate("/dentist/dashboard", { replace: true });
      } else if (role === "Patient") {
        navigate("/patient/dashboard", { replace: true });
      } else {
        toast.error("Your account role is not recognized.");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Map server validation errors to their respective fields.
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        const fieldErrors = {};
        Object.entries(serverErrors).forEach(([key, messages]) => {
          const field = key.toLowerCase();
          if (field.includes("email")) {
            fieldErrors.email = Array.isArray(messages)
              ? messages[0]
              : messages;
              toast.error(fieldErrors.email);
          } else if (field.includes("password")) {
            fieldErrors.password = Array.isArray(messages)
              ? messages[0]
              : messages;
              toast.error(fieldErrors.password);
          }
        });
        
        setErrors((previous) => ({
          ...previous,
          ...fieldErrors,
        }));
      }

      if (
        error.message ===
        "The server did not return an access token."
      ) {
        setFormError(error.message);
        toast.error(error.message);
      } else {
        setFormError(getApiErrorMessage(error));
        toast.error(getApiErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-gray-50 py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
        : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  return (
    <section className="relative z-0 flex min-h-screen items-center justify-center bg-gray-100 px-4 py-25 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        {/* Left Welcome Panel */}
        <div className="relative flex min-h-[350px] flex-col justify-between overflow-hidden bg-indigo-600 p-8 text-white sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/10" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="rounded-xl bg-white p-2.5 text-indigo-600 shadow-md">
                <Heart size={28} />
              </div>
              <span className="text-2xl font-bold tracking-wide">
                Dental<span className="text-indigo-300">Care</span>
              </span>
            </Link>
          </div>

          <div className="relative z-10 my-10">
            <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">
              Welcome back
            </h1>

            <p className="max-w-md text-base leading-7 text-indigo-100">
              Book your dental appointments with ease and take
              the next step toward a healthier, brighter smile.
              Manage your appointments and enjoy personalized
              dental care with DentalCare.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <ShieldCheck size={21} />
              </div>
              <p className="text-sm text-indigo-100">
                Your account security matters to us.
              </p>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/20 pt-5">
            <p className="text-sm text-indigo-100">
              Your smile deserves the best care.
            </p>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Sign In
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Enter your details to access your account.
              </p>
            </div>

            {formError && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {formError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      errors.email ? "text-red-500" : "text-gray-400"
                    }`}
                  />

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "email-error" : undefined
                    }
                    className={inputClass("email")}
                  />
                </div>

                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      errors.password
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className={`${inputClass("password")} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-indigo-600"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 accent-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-indigo-600 transition hover:text-indigo-800"
              >
                Create account
              </Link>
            </p>

            <div className="mt-8 border-t border-gray-100 pt-6 text-center">
              <Link
                to="/"
                className="text-sm font-medium text-gray-500 transition hover:text-indigo-600"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
