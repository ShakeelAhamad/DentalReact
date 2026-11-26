import { lazy, Suspense } from "react";
import Loader from "../../components/ui/Loader";
import FrontLayout from "../../layout/front/FrontLayout";
const Home = lazy(() => import("../../pages/front/Home"));
const Services = lazy(() => import("../../pages/front/Services"));
const OurDoctors = lazy(() => import("../../pages/front/OurDoctors"));
const WhyChooseUs = lazy(() => import("../../pages/front/WhyChooseUs"));
const Contact = lazy(() => import("../../pages/front/Contact"));
 
const Login       = lazy(() => import("../../pages/auth/Login"));
const Signup      = lazy(() => import("../../pages/auth/SignUp"));
const ForgotPassword = lazy(() => import("../../pages/auth/ForgotPassword"));
const Appointment = lazy(() => import("../../pages/front/Appointment"));
const PatientDashboard = lazy(() => import("../../pages/front/patient/PatientDashboard"));
const PatientAppointment = lazy(() => import("../../pages/front/patient/PatientAppointments"));
const AppointmentDetails = lazy(() => import("../../pages/front/patient/AppointmentDetails")); 
const AccessDenied = lazy(() => import("../../pages/errors/AccessDenied"));
import ProtectedRoute from "../ProtectedRoute";
const user = JSON.parse(localStorage.getItem("dentalcare_user") || null);
const patientName = user?.fullName || "Patient";
const AuthRoutes = [
    {
        element: <FrontLayout />,
        children: [
            {
                path: "/",
                element: <Suspense fallback={<Loader />}><Home /></Suspense>,
            },
            {
                path: "/services",
                element: <Suspense fallback={<Loader />}><Services /></Suspense>,
            },
            {
                path: "/our-doctor",
                element: <Suspense fallback={<Loader />}><OurDoctors /></Suspense>,
            },
            {
                path: "/features",
                element: <Suspense fallback={<Loader />}><WhyChooseUs /></Suspense>,
            },
            {
                path: "/contact",
                element: <Suspense fallback={<Loader />}><Contact /></Suspense>,
            },
            {
                path: "/login",
                element: <Suspense fallback={<Loader />}><Login /></Suspense>,
            },
            {
                path: "/access-denied",
                element: <Suspense fallback={<Loader />}><AccessDenied /></Suspense>,
            },
            {
                path: "/signup",
                element: <Suspense fallback={<Loader />}><Signup /></Suspense>,
            },
            {
                path: "/forgot-password",
                element: <Suspense fallback={<Loader />}><ForgotPassword /></Suspense>,
            },
            // Patient Protected Routes
            {
                element: <ProtectedRoute allowedRoles={["patient"]} />,
                children: [
                    {
                        path: "/patient/book/appointments",
                        element: <Suspense fallback={<Loader />}><Appointment /></Suspense>,
                    },
                    {
                        path: "/patient/dashboard",
                        element: <Suspense fallback={<Loader />}><PatientDashboard patientName={patientName} /></Suspense>,
                    },
                    {
                        path: "/patient/appointments",
                        element: <Suspense fallback={<Loader />}><PatientAppointment /></Suspense>,
                    },
                    {
                        path: "/patient/appointments/:id",
                        element: <Suspense fallback={<Loader />}><AppointmentDetails /></Suspense>,
                    },
                ]
            },
            
        ]
    }
];

export default AuthRoutes;