import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  Stethoscope,
  Save,
  LoaderCircle,
  Mail,
  LockKeyhole,
  Phone,
  GraduationCap,
  BriefcaseBusiness,
  FileText,
  Activity,
  Eye,
  EyeOff,
  ImagePlus,
  X,
} from "lucide-react";

import toast from "react-hot-toast";
import dentistService from "../../../services/dentistService";
import pageTitle from "../../../hooks/usePageTitle";

// Initial form values
const initialFormData = {
  name: "",
  username: "",
  email: "",
  password: "",
  specialization: "",
  qualification: "",
  experience: 0,
  phone: "",
  bio: "",
  profileImage: "",
  status: "active",
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

const Required = () => (
  <span className="ml-1 text-red-500">*</span>
);

const FieldError = ({ message }) =>
  message ? (
    <p className="mt-1 text-xs text-red-500">{message}</p>
  ) : null;

const FormField = ({
  label,
  required,
  error,
  children,
  className = "",
}) => (
  <div className={className}>
    <label className={labelClass}>
      {label}
      {required && <Required />}
    </label>

    {children}

    <FieldError message={error} />
  </div>
);

const getResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? response;
};

const DentistsForm = ({ id: propId }) => {
  const { id: routeId } = useParams();
  const id = propId ?? routeId;
  pageTitle(id ? "Update Dentist" : "Register New Dentist");

  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch dentist details when ID exists
  useEffect(() => {
    if (!id) {
      setFormData(initialFormData);
      setErrors({});
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchDentist = async () => {
      try {
        setLoading(true);
        const response = await dentistService.getDentistById(id);
        const dentist = getResponseData(response);
        if (!dentist) {
          toast.error("Dentist details not found.");
        }

        if (isMounted) {
          setFormData({
            ...initialFormData,
            name:
              dentist.name ??
              dentist.fullName ??
              dentist.fullname ??
              "",
            username: dentist.username ?? "",
            email: dentist.email ?? "",
            specialization: dentist.specialization ?? "",
            qualification: dentist.qualification ?? "",
            experience: dentist.experience ?? 0,
            phone:
              dentist.phone ??
              dentist.phoneNumber ??
              dentist.PhoneNumber ??
              "",
            bio: dentist.bio ?? "",
            profileImage:
              dentist.profileImage ??
              dentist.ProfileImage ??
              "",
            status:
              dentist.status === true ||
              dentist.status === "active" ||
              dentist.status === "Active"
                ? "active"
                : "inactive",
          });
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Unable to load dentist details."
        );

        if (isMounted) {
          navigate("/admin/dentists");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDentist();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  // Handle normal input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Handle profile image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Profile image must be smaller than 2 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    console.log("Selected file:", reader.result);
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

    reader.onerror = () => {
      toast.error("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);

    // Allow selecting the same image again
    e.target.value = "";
  };

  // Remove profile image
  const removeProfileImage = () => {
    setFormData((prev) => ({
      ...prev,
      profileImage: "",
    }));
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!isEdit && !formData.password.trim()) {
      newErrors.password = "Temporary password is required.";
    } else if (
      formData.password &&
      formData.password.length < 8
    ) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (
      formData.experience === "" ||
      Number(formData.experience) < 0 ||
      Number(formData.experience) > 70
    ) {
      newErrors.experience = "Experience must be between 0 and 70.";
    }

    if (
      formData.phone.trim() &&
      !/^[+]?[0-9\s()-]{7,20}$/.test(formData.phone.trim())
    ) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!["active", "inactive"].includes(formData.status)) {
      newErrors.status = "Please select a valid status.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the validation errors.");
      return false;
    }

    return true;
  };

  // Create / Update Dentist
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = {
        FullName: formData.name.trim(),
        Username: formData.username.trim(),
        Email: formData.email.trim(),
        role: "Dentist",

        PhoneNumber: formData.phone.trim(),
        Qualification: formData.qualification.trim(),
        Specialization: formData.specialization.trim(),
        Experience: String(formData.experience),

        ProfileImage: formData.profileImage,

        Bio: formData.bio.trim(),
        Status: formData.status === "active",
      };
      console.log("Payload before sending:", payload);
      // Password is required only during registration
      if (!isEdit) {
        payload.Password = formData.password;
      }

      if (isEdit) {
        await dentistService.updateDentist(id, payload);

        toast.success("Dentist updated successfully!");
      } else {
        await dentistService.createDentist(payload);

        toast.success("Dentist registered successfully!");
      }

      navigate("/admin/dentists");
    } catch (error) {
      const responseData = error?.response?.data;

      // Handle ASP.NET validation response
      if (responseData?.errors) {
        const serverErrors = {};

        Object.entries(responseData.errors).forEach(
          ([key, messages]) => {
            const fieldName =
              key.charAt(0).toLowerCase() + key.slice(1);

            serverErrors[fieldName] = Array.isArray(messages)
              ? messages[0]
              : messages;
          }
        );

        setErrors(serverErrors);
      }

      toast.error(
        responseData?.message ||
          responseData?.title ||
          error.message ||
          `Failed to ${isEdit ? "update" : "register"} dentist.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Full-page loading
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <LoaderCircle className="mb-3 h-10 w-10 animate-spin text-indigo-600" />

        <p className="text-sm font-medium text-gray-600">
          Loading dentist details...
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">

      {/* Full-page submitting overlay */}
      {submitting && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <LoaderCircle className="mb-3 h-12 w-12 animate-spin text-indigo-600" />

          <p className="text-sm font-semibold text-gray-700">
            {isEdit ? "Updating dentist..." : "Registering dentist..."}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Please wait. Do not close this page.
          </p>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Dentists</span>
            <span>/</span>

            <span className="text-indigo-600">
              {isEdit ? "Update" : "Register"}
            </span>
          </div>

          <h2 className="mt-1 text-xl font-bold text-gray-800">
            {isEdit ? "Update Dentist" : "Register New Dentist"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {isEdit
              ? "Update dentist account and professional information."
              : "Create a new dentist account and add professional details."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/dentists")}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Dentists
        </button>
      </div>

      {/* Dentist Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="max-w-4xl space-y-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

          {/* Profile Image */}
          <section className="border-b border-gray-100 pb-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                <ImagePlus size={19} />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                  Profile Image
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  Upload dentist profile photo
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 shrink-0">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Dentist profile preview"
                    className="h-28 w-28 rounded-xl border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400">
                    <UserRound size={42} />
                  </div>
                )}

                {formData.profileImage && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    disabled={submitting}
                    aria-label="Remove profile image"
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow transition hover:bg-red-600 disabled:opacity-50 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 ${
                    submitting ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <ImagePlus size={17} />
                  Choose Profile Image

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    disabled={submitting}
                    className="hidden"
                  />
                </label>

                <p className="text-xs text-gray-500">
                  JPG, PNG or WEBP. Maximum file size: 2 MB.
                </p>

                {formData.profileImage && (
                  <p className="text-xs font-medium text-green-600">
                    Profile image selected.
                  </p>
                )}

                <FieldError message={errors.profileImage} />
              </div>
            </div>
          </section>

          {/* Account Credentials */}
          <section className="border-b border-gray-100 pb-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                <UserRound size={19} />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                  Account Credentials
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  Dentist login and account information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Full Name */}
              <FormField
                label="Full Name"
                required
                error={errors.name}
              >
                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
                    className={`${inputClass} pl-10 ${
                      errors.name ? "border-red-400" : ""
                    }`}
                  />
                </div>
              </FormField>

              {/* Username */}
              <FormField
                label="Username"
                required
                error={errors.username}
              >
                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. sarah"
                    className={`${inputClass} pl-10 ${
                      errors.username ? "border-red-400" : ""
                    }`}
                  />
                </div>
              </FormField>

              {/* Email */}
              <FormField
                label="Email Address"
                required
                error={errors.email}
              >
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="dentist@dentalcare.com"
                    className={`${inputClass} pl-10 ${
                      errors.email ? "border-red-400" : ""
                    }`}
                  />
                </div>
              </FormField>

              {/* Password - Create only */}
              {!isEdit && (
                <FormField
                  label="Temporary Password"
                  required
                  error={errors.password}
                >
                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 characters"
                      className={`${inputClass} pl-10 pr-11 ${
                        errors.password ? "border-red-400" : ""
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    The dentist can change this password after login.
                  </p>
                </FormField>
              )}

            </div>
          </section>

          {/* Professional Details */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600">
                <Stethoscope size={19} />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                  Professional Details
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  Dentist qualifications and professional background
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Specialization */}
              <FormField
                label="Specialization"
                error={errors.specialization}
              >
                <div className="relative">
                  <Stethoscope
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Orthodontics, Oral Surgery"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </FormField>

              {/* Qualification */}
              <FormField
                label="Qualification / Degrees"
                error={errors.qualification}
              >
                <div className="relative">
                  <GraduationCap
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g. BDS, MDS"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </FormField>

              {/* Experience */}
              <FormField
                label="Years of Experience"
                error={errors.experience}
              >
                <div className="relative">
                  <BriefcaseBusiness
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    max="70"
                    placeholder="0"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </FormField>

              {/* Phone */}
              <FormField
                label="Phone Number"
                error={errors.phone}
              >
                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </FormField>

              {/* Bio */}
              <FormField
                label="Bio / Profile Summary"
                error={errors.bio}
                className="sm:col-span-2"
              >
                <div className="relative">
                  <FileText
                    size={17}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Professional background and expertise..."
                    className={`${inputClass} resize-none pl-10`}
                  />
                </div>
              </FormField>

              {/* Status */}
              <FormField
                label="Status"
                required
                error={errors.status}
                className="sm:col-span-2"
              >
                <div className="relative">
                  <Activity
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none pl-10`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </FormField>

            </div>
          </section>

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => navigate("/admin/dentists")}
              disabled={submitting}
              className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  {isEdit ? "Updating..." : "Registering..."}
                </>
              ) : (
                <>
                  <Save size={17} />
                  {isEdit ? "Update Dentist" : "Register Dentist"}
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default DentistsForm;