
import { Link } from "react-router-dom";
import { ShieldX, Home, ArrowLeft } from "lucide-react";

const AccessDenied = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">

                <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                    <ShieldX size={42} className="text-red-600" />
                </div>

                <h1 className="text-6xl font-bold text-gray-800 mt-6">
                    403
                </h1>

                <h2 className="text-2xl font-bold text-gray-900 mt-3">
                    Access Denied!
                </h2>

                <p className="text-gray-500 mt-3 leading-6">
                    Sorry! You don't have permission to access this page.
                    This page is available only to authorized patients.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Link
                        to="/"
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AccessDenied;
