
import React, { useState } from "react";
import {
    LockKeyhole,
    Eye,
    EyeOff,
    ShieldCheck,
    KeyRound,
    Save,
    RotateCcw,
    Settings as SettingsIcon,
    CheckCircle,
    CircleX,
} from "lucide-react";
import toast from "react-hot-toast";
import { updatePassword } from "../../../services/authService";

// =====================================
// Reusable Password Field
// Keep OUTSIDE Settings component
// =====================================
const PasswordField = ({
    label,
    name,
    placeholder,
    field,
    autoComplete,
    value,
    error,
    success,
    onChange,
    showPassword,
    togglePassword,
}) => {
    const isVisible = showPassword[field];

    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                {label}
                <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="relative">
                <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    id={name}
                    name={name}
                    type={isVisible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`w-full h-11 pl-10 pr-11 border rounded-lg text-sm outline-none transition ${
                        error
                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                            : success
                            ? "border-green-400 focus:ring-2 focus:ring-green-100"
                            : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    }`}
                />

                <button
                    type="button"
                    onClick={() => togglePassword(field)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                    aria-label={isVisible ? "Hide password" : "Show password"}
                >
                    {isVisible ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>
            </div>

            {error && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <CircleX size={13} />
                    {error}
                </p>
            )}

            {!error && success && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle size={13} />
                    {success}
                </p>
            )}
        </div>
    );
};

// =====================================
// Password Requirements
// Keep OUTSIDE Settings component
// =====================================
const PasswordRequirements = ({ password }) => {
    const rules = [
        {
            key: "minLength",
            label: "At least 8 characters",
            valid: password.length >= 8,
        },
        {
            key: "uppercase",
            label: "One uppercase letter (A-Z)",
            valid: /[A-Z]/.test(password),
        },
        {
            key: "lowercase",
            label: "One lowercase letter (a-z)",
            valid: /[a-z]/.test(password),
        },
        {
            key: "number",
            label: "One number (0-9)",
            valid: /[0-9]/.test(password),
        },
        {
            key: "special",
            label: "One special character (!@#$)",
            valid: /[^A-Za-z0-9]/.test(password),
        },
    ];

    const strengthScore = rules.filter((rule) => rule.valid).length;

    const getStrength = () => {
        if (strengthScore <= 2) {
            return {
                label: "Weak",
                color: "text-red-500",
                bar: "bg-red-500",
                width: "20%",
            };
        }

        if (strengthScore === 3) {
            return {
                label: "Medium",
                color: "text-orange-500",
                bar: "bg-orange-500",
                width: "50%",
            };
        }

        if (strengthScore === 4) {
            return {
                label: "Strong",
                color: "text-green-500",
                bar: "bg-green-500",
                width: "75%",
            };
        }

        return {
            label: "Very Strong",
            color: "text-green-600",
            bar: "bg-green-600",
            width: "100%",
        };
    };

    const strength = getStrength();

    return (
        <div className="space-y-3 -mt-2">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-500">
                        Password Strength
                    </span>

                    <span className={`text-xs font-semibold ${strength.color}`}>
                        {strength.label}
                    </span>
                </div>

                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.bar}`}
                        style={{ width: strength.width }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rules.map((rule) => (
                    <div
                        key={rule.key}
                        className={`flex items-center gap-2 text-xs ${
                            rule.valid ? "text-green-600" : "text-red-500"
                        }`}
                    >
                        {rule.valid ? (
                            <CheckCircle size={14} />
                        ) : (
                            <CircleX size={14} />
                        )}

                        {rule.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

// =====================================
// Main Settings Component
// =====================================
function Settings() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [loading, setLoading] = useState(false);

    const passwordRules = {
        minLength: formData.newPassword.length >= 8,
        uppercase: /[A-Z]/.test(formData.newPassword),
        lowercase: /[a-z]/.test(formData.newPassword),
        number: /[0-9]/.test(formData.newPassword),
        special: /[^A-Za-z0-9]/.test(formData.newPassword),
    };

    const strengthScore = Object.values(passwordRules).filter(Boolean).length;

    const isPasswordDifferent =
        formData.newPassword !== formData.currentPassword;

    const isConfirmPasswordValid =
        formData.confirmPassword.length > 0 &&
        formData.confirmPassword === formData.newPassword;

    // =====================================
    // Handle Input Change
    // =====================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => {
            const updated = { ...prev };

            if (name === "currentPassword") {
                updated.currentPassword = value
                    ? ""
                    : "Current password is required.";

                if (formData.newPassword) {
                    updated.newPassword =
                        formData.newPassword === value
                            ? "New password must be different from current password."
                            : "";
                }
            }

            if (name === "newPassword") {
                if (!value) {
                    updated.newPassword = "New password is required.";
                } else if (value.length < 8) {
                    updated.newPassword = "Minimum 8 characters required.";
                } else if (value === formData.currentPassword) {
                    updated.newPassword =
                        "New password must be different from current password.";
                } else {
                    updated.newPassword = "";
                }

                if (formData.confirmPassword) {
                    updated.confirmPassword =
                        value === formData.confirmPassword
                            ? ""
                            : "Passwords do not match.";
                }
            }

            if (name === "confirmPassword") {
                if (!value) {
                    updated.confirmPassword =
                        "Confirm password is required.";
                } else if (value !== formData.newPassword) {
                    updated.confirmPassword = "Passwords do not match.";
                } else {
                    updated.confirmPassword = "";
                }
            }

            return updated;
        });
    };

    // =====================================
    // Toggle Password
    // =====================================
    const togglePassword = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // =====================================
    // Reset Form
    // =====================================
    const resetForm = () => {
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setErrors({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setShowPassword({
            current: false,
            new: false,
            confirm: false,
        });
    };

    // =====================================
    // Validate Form
    // =====================================
    const validateForm = () => {
        const newErrors = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        };

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Current password is required.";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required.";
        } else if (strengthScore !== 5) {
            newErrors.newPassword =
                "Please enter a strong password with all requirements.";
        } else if (!isPasswordDifferent) {
            newErrors.newPassword =
                "New password must be different from current password.";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required.";
        } else if (!isConfirmPasswordValid) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    };

    // =====================================
    // Submit Form
    // =====================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the validation errors.");
            return;
        }

        try {
            setLoading(true);

            const response = await updatePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });

            toast.success(
                response.message || "Password updated successfully!"
            );

            resetForm();
        } catch (error) {
            toast.error(
                error.message || "Failed to update password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <SettingsIcon size={26} className="text-primary" />

                    <div>
                        <h1 className="text-2xl font-semibold text-text-primary">
                            Settings
                        </h1>

                        <p className="text-sm text-gray-400 mt-1">
                            Manage your account security settings
                        </p>
                    </div>
                </div>

                <p className="text-sm text-gray-400">
                    Dashboard / <span className="text-primary">Settings</span>
                </p>
            </div>

            {/* Settings Card */}
            <div className="max-w-3xl bg-white border border-gray-200 rounded-xl shadow-sm">

                {/* Card Header */}
                <div className="flex items-center gap-3 p-6 border-b border-gray-100">
                    <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                        <KeyRound size={22} />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">
                            Change Password
                        </h2>

                        <p className="text-sm text-gray-400">
                            Update your account password regularly.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="p-6 space-y-5"
                >
                    {/* Current Password */}
                    <PasswordField
                        label="Current Password"
                        name="currentPassword"
                        placeholder="Enter current password"
                        field="current"
                        autoComplete="current-password"
                        value={formData.currentPassword}
                        error={errors.currentPassword}
                        onChange={handleChange}
                        showPassword={showPassword}
                        togglePassword={togglePassword}
                    />

                    {/* New Password */}
                    <PasswordField
                        label="New Password"
                        name="newPassword"
                        placeholder="Enter new password"
                        field="new"
                        autoComplete="new-password"
                        value={formData.newPassword}
                        error={errors.newPassword}
                        onChange={handleChange}
                        showPassword={showPassword}
                        togglePassword={togglePassword}
                    />

                    {/* Password Strength */}
                    {formData.newPassword && (
                        <PasswordRequirements
                            password={formData.newPassword}
                        />
                    )}

                    {/* Confirm Password */}
                    <PasswordField
                        label="Confirm New Password"
                        name="confirmPassword"
                        placeholder="Confirm your new password"
                        field="confirm"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        error={errors.confirmPassword}
                        success={
                            isConfirmPasswordValid
                                ? "Passwords match successfully."
                                : ""
                        }
                        onChange={handleChange}
                        showPassword={showPassword}
                        togglePassword={togglePassword}
                    />

                    {/* Password Information */}
                    <div className="flex gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                        <ShieldCheck
                            size={20}
                            className="text-primary shrink-0 mt-0.5"
                        />

                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                Password security tips
                            </p>

                            <ul className="text-xs text-gray-500 mt-2 space-y-1">
                                <li>• Use at least 8 characters.</li>
                                <li>• Use uppercase and lowercase letters.</li>
                                <li>• Include numbers and special characters.</li>
                                <li>• Do not reuse your old password.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !formData.currentPassword ||
                                !formData.newPassword ||
                                strengthScore !== 5 ||
                                !isPasswordDifferent ||
                                !isConfirmPasswordValid
                            }
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={17} />

                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;
