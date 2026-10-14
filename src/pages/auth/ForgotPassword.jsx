import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Heart,
    Mail,
    ArrowLeft,
    Send,
    ShieldCheck,
} from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        // Connect your forgot-password API here.
        console.log("Forgot password email:", email);

        setMessage(
            "If an account exists with this email, you will receive password reset instructions."
        );
    };

    return (
        <section className="relative z-0 flex min-h-screen items-center justify-center bg-gray-100 px-4 py-25 sm:px-6">
            <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

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
                                Dental<span className="text-indigo-400">Care</span>
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 my-10">
                        <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">
                            Forgot Your Password?
                        </h1>

                        <p className="max-w-md text-base leading-7 text-indigo-100">
                            Don't worry! It happens to everyone. Enter your registered email
                            address and we'll help you get back to your DentalCare account.
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

                {/* Right Form Panel */}
                <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
                    <div className="w-full max-w-md">
                        <Link
                            to="/login"
                            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
                        >
                            <ArrowLeft size={18} />
                            Back to Login
                        </Link>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Reset Password
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Enter the email address associated with your account. We'll
                                send you instructions to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Enter your registered email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            {message && (
                                <p role="status" className="rounded-lg bg-green-50 p-3 text-sm leading-6 text-green-700">
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Send Reset Link
                                <Send size={18} />
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-gray-500">
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                            >
                                Sign in
                            </Link>
                        </p>

                        <div className="mt-5 border-t border-gray-100 pt-5 text-center">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
                            >
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

export default ForgotPassword;