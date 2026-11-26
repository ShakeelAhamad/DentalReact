import { lazy, Suspense } from "react"
import AdminLayout from "../../layout/admin/AdminLayout";
import Loader from "../../components/ui/Loader";
import { Navigate } from "react-router-dom";
const DentistDashboard   = lazy(() => import("../../pages/dentist/DentistDashboard"));
const AppointmentsList   = lazy(() => import("../../pages/dentist/appointments/AppointmentsList"));
const AppointmentsDetails = lazy(() => import("../../pages/dentist/appointments/AppointmentDetails"));
const Schedule            = lazy(() => import("../../pages/dentist/schedule/Schedule"));
const TreatmentsList      = lazy(() => import("../../pages/dentist/treatments/TreatmentsList"));
const TreatmentsForm      = lazy(() => import("../../pages/dentist/treatments/TreatmentsForm"));
const TreatmentsDetails   = lazy(() => import("../../pages/dentist/treatments/TreatmentsDetails"));
const Profile             = lazy(() => import("../../pages/dentist/settings/Profile"));
const Settings            = lazy(() => import("../../pages/dentist/settings/Settings"));
import ProtectedRoute from "../ProtectedRoute";

const DentistRoutes = [
    {
        element : <AdminLayout />,
        children : [
            {
                element: <ProtectedRoute allowedRoles={["dentist"]} />,
                children: [
                    {
                        path:"/dentist",
                        element: <Navigate to="/dentist/dashboard" replace />,
                    },
                    {
                        path: "/dentist",
                        children: [
                            {
                                path: "dashboard",
                                element: <Suspense fallback={<Loader />}><DentistDashboard /></Suspense>,
                            },
                            {
                                path: "appointments",
                                element: <Suspense fallback={<Loader />}><AppointmentsList /></Suspense>,
                            },
                            {
                                path: "appointments/:id?",
                                element: <Suspense fallback={<Loader />}><AppointmentsDetails /></Suspense>,
                            },
                            {
                                path : "schedule",
                                element: <Suspense fallback={<Loader />}><Schedule /></Suspense>,
                            },
                            {
                                path : "treatments",
                                element: <Suspense fallback={<Loader />}><TreatmentsList /></Suspense>,
                            },
                            {
                                path : "treatments/:id?",
                                element: <Suspense fallback={<Loader />}><TreatmentsDetails /></Suspense>,
                            },
                            {
                                path : "treatments/create/:id",
                                element: <Suspense fallback={<Loader />}><TreatmentsForm /></Suspense>,
                            },
                            {
                                path : "profile",
                                element: <Suspense fallback={<Loader />}><Profile /></Suspense>,
                            },
                            {
                                path : "settings",
                                element: <Suspense fallback={<Loader />}><Settings /></Suspense>,
                            }
                        ],
                    },
                ],
            },
        ],
    },
];

export default DentistRoutes;