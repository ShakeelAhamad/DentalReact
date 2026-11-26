import React, { useState } from "react";
import { Link } from "react-router-dom";
import pageTitle from "../../hooks/usePageTitle";
import {
  Heart,
  User,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Phone,
  CalendarDays,
  MapPin,
  ImagePlus,
  UserPlus,
  ArrowLeft,
} from "lucide-react";

// Change this import path if your authService.js is stored elsewhere.
import signupService from "../../services/signupService";

const initialFormData = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  phoneNumber: "",
  profileImage: "",
  dateOfBirth: "",
  gender: "",
  status: "",
  address: "",
};

const SignUp = () => {
  pageTitle("Sign Up");
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const labelClass = "mb-1.5 block text-sm font-semibold text-gray-700";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";

  const getInputClass = (field, extraClass = "") =>
    `w-full rounded-lg border ${
      errors[field] ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"
    } py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 ${
      errors[field]
        ? "focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
    } ${extraClass}`;

  const getSelectClass = (field) =>
    `w-full rounded-lg border ${
      errors[field] ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"
    } px-3 py-2.5 text-sm text-gray-700 outline-none transition ${
      errors[field]
        ? "focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
    }`;

  const ErrorMessage = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs font-medium text-red-600" role="alert">
        {errors[field]}
      </p>
    ) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
    setSuccessMessage("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Please select a valid image file.",
      }));
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));

      setErrors((prev) => ({
        ...prev,
        profileImage: "",
      }));
    };
    setImagePreview(URL.createObjectURL(file));
    reader.onerror = () => {
      toast.error("Unable to read the selected image.");
    };
    reader.readAsDataURL(file);

    // Allow selecting the same image again
    e.target.value = "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid phone number.";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    } else if (new Date(formData.dateOfBirth) >= new Date()) {
      newErrors.dateOfBirth = "Date of birth must be in the past.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
    }
    if (!formData.status) {
      newErrors.status = "Please select your status.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Convert ASP.NET validation keys into the React form field names.
  const mapServerErrors = (serverErrors = {}) => {
    const fieldMap = {
      fullName: "fullName",
      username: "username",
      email: "email",
      password: "password",
      phonenumber: "phoneNumber",
      phoneNumber: "phoneNumber",
      profileimage: "profileImage",
      dateofbirth: "dateOfBirth",
      gender: "gender",
      status: "status",
      address: "address",
    };

    const mappedErrors = {};

    Object.entries(serverErrors).forEach(([key, messages]) => {
      const field = fieldMap[key] || fieldMap[key.toLowerCase()];
      if (!field) return;

      mappedErrors[field] = Array.isArray(messages)
        ? messages[0]
        : String(messages);
    });

    return mappedErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        FullName: formData.fullName.trim(),
        Username: formData.username.trim(),
        Email: formData.email.trim(),
        role: "Patient",

        PhoneNumber: formData.phoneNumber.trim(),
        ProfileImage: formData.profileImage,
        DateOfBirth: formData.dateOfBirth,
        Password: formData.password,
        Gender: formData.gender,
        Address: formData.address.trim(),
        Status: formData.status === "active",
      };
      const response = await signupService.registerPatient(payload);
      setSuccessMessage(response?.message || "Account created successfully!");
      toast.success(response?.message || "Account created successfully!");
      setFormData(initialFormData);
      setImagePreview("");
      setErrors({});
      e.target.reset();
    } catch (error) {
      const data = error.response?.data;
      const apiErrors = data?.errors || data?.Errors;

      if (apiErrors) {
        const mappedErrors = mapServerErrors(apiErrors);
        setErrors((prev) => ({ ...prev, ...mappedErrors }));

        if (Object.keys(mappedErrors).length === 0) {
          setServerError(
            data?.message || data?.title || "Please check the submitted details."
          );
        }
      } else {
        setServerError(
          data?.message ||
            data?.title ||
            error.message ||
            "Unable to create account. Please try again."
        );
        toast.error(
          data?.message ||
          data?.title ||
          error.message ||
          "Unable to create account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-0 flex min-h-screen items-center justify-center bg-gray-100 px-4 py-25 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        {/* Left Welcome Section */}
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
              Join DentalCare
            </h1>
            <p className="max-w-md text-base leading-7 text-indigo-100">
              Create your account to book dental appointments, manage your
              visits, and take the next step toward a healthier, brighter
              smile with DentalCare.
            </p>
            <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-5 text-left">
              <h2 className="font-semibold">Your smile matters to us!</h2>
              <p className="mt-2 text-sm leading-6 text-indigo-100">
                Get convenient access to your dental care journey in one place.
              </p>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/20 pt-5">
            <p className="text-sm text-indigo-100">
              Your smile, our priority. Every day.
            </p>
          </div>
        </div>

        {/* Right SignUp Form */}
        <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
          <div className="w-full max-w-xl">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
              <p className="mt-2 text-sm text-gray-500">
                Fill in your details to get started.
              </p>
            </div>

            {serverError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600" role="alert">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700" role="status">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Profile Image */}
              <div>
                <label className={labelClass}>Profile Image</label>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <UserRound size={28} className="text-gray-400" />
                    )}
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-indigo-500 hover:text-indigo-600">
                    <ImagePlus size={18} />
                    Choose Image
                    <input
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <ErrorMessage field="profileImage" />
                {formData.profileImage && (
                  <p className="mt-1 text-xs text-gray-500">{formData.profileImage.name}</p>
                )}
              </div>

              {/* Full Name + Username */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className={labelClass}>Full Name</label>
                  <div className="relative">
                    <User size={18} className={iconClass} />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full name"
                      autoComplete="name"
                      className={getInputClass("fullName")}
                    />
                  </div>
                  <ErrorMessage field="fullName" />
                </div>

                <div>
                  <label htmlFor="username" className={labelClass}>Username</label>
                  <div className="relative">
                    <UserRound size={18} className={iconClass} />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      autoComplete="username"
                      className={getInputClass("username")}
                    />
                  </div>
                  <ErrorMessage field="username" />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className={labelClass}>Email Address</label>
                  <div className="relative">
                    <Mail size={18} className={iconClass} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={getInputClass("email")}
                    />
                  </div>
                  <ErrorMessage field="email" />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className={iconClass} />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone number"
                      autoComplete="tel"
                      className={getInputClass("phoneNumber")}
                    />
                  </div>
                  <ErrorMessage field="phoneNumber" />
                </div>
              </div>

              {/* Password + Date of Birth */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className={labelClass}>Password</label>
                  <div className="relative">
                    <LockKeyhole size={18} className={iconClass} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      autoComplete="new-password"
                      className={getInputClass("password", "pr-10")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-indigo-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage field="password" />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</label>
                  <div className="relative">
                    <CalendarDays size={18} className={iconClass} />
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      autoComplete="bday"
                      className={getInputClass("dateOfBirth")}
                    />
                  </div>
                  <ErrorMessage field="dateOfBirth" />
                </div>
              </div>
   
              {/* Gender */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="gender" className={labelClass}>Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={getSelectClass("gender")}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <ErrorMessage field="gender" />
                </div>
                <div>
                  <label htmlFor="status" className={labelClass}>Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={getSelectClass("status")}
                  >
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ErrorMessage field="status" />
                </div>
              </div>
              

              {/* Address */}
              <div>
                <label htmlFor="address" className={labelClass}>Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    autoComplete="street-address"
                    className={`w-full resize-y rounded-lg border ${
                      errors.address ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100" : "border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-100"
                    } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:bg-white focus:ring-2`}
                  />
                </div>
                <ErrorMessage field="address" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-indigo-600 transition hover:text-indigo-800">
                Sign In
              </Link>
            </p>

            <div className="mt-5 border-t border-gray-100 pt-5 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600">
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;