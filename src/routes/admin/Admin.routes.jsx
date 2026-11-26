import { lazy, Suspense } from "react"
import AdminLayout from "../../layout/admin/AdminLayout";
import Loader from "../../components/ui/Loader";
import { Navigate } from "react-router-dom";
const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));
const Appointments   = lazy( () => import("../../pages/admin/appointments/Appointments"));
const AppointmentDetails = lazy (() => import("../../pages/admin/appointments/AppointmentDetails"));
const DentistsForm = lazy(() => import("../../pages/admin/dentists/DentistsForm"));
const DentistsList = lazy(() => import("../../pages/admin/dentists/DentistsList"));
const PatientsList = lazy(() => import("../../pages/admin/patient/PatientsList"));
const PatientsDetails = lazy(() => import("../../pages/admin/patient/PatientsDetails"));
const ServicesForm = lazy(() => import("../../pages/admin/services/ServicesForm"));
const ServicesList = lazy(() => import("../../pages/admin/services/ServicesList"));
const Settings = lazy(() => import("../../pages/admin/settings/Settings"));
const Profile = lazy(() => import("../../pages/admin/settings/Profile"));

import ProtectedRoute from "../ProtectedRoute";

const AdminRoutes = [
    {
        element : <AdminLayout />,
        children : [
            {
                element: <ProtectedRoute allowedRoles={["admin"]} />,
                children: [
                    {
                        path:"/admin",
                        element: <Navigate to="/admin/dashboard" replace />,
                    },
                    {
                        path: "/admin",
                        children: [
                            {
                                path: "dashboard",
                                element: <Suspense fallback={<Loader />}><AdminDashboard /></Suspense>,
                            },
                            {
                                path: "appointments",
                                element: <Suspense fallback={<Loader />}><Appointments /></Suspense>,
                            },
                            {
                                path: "appointments/:id?",
                                element: <Suspense fallback={<Loader />}><AppointmentDetails /></Suspense>,
                            },
                            {
                                path : "dentists",
                                element: <Suspense fallback={<Loader />}><DentistsList /></Suspense>,
                            },
                            {
                                path : "dentists/create",
                                element: <Suspense fallback={<Loader />}><DentistsForm /></Suspense>,
                            },
                            {
                                path : "dentists/:id?/edit",
                                element: <Suspense fallback={<Loader />}><DentistsForm /></Suspense>,
                            },
                            {
                                path : "patients",
                                element: <Suspense fallback={<Loader />}><PatientsList /></Suspense>,
                            },
                            {
                                path : "patients/:id?",
                                element: <Suspense fallback={<Loader />}><PatientsDetails /></Suspense>,
                            },
                            {
                                path : "services",
                                element: <Suspense fallback={<Loader />}><ServicesList /></Suspense>,
                            },
                            {
                                path : "services/create",
                                element: <Suspense fallback={<Loader />}><ServicesForm /></Suspense>,
                            },
                            {
                                path : "services/:id?/edit",
                                element: <Suspense fallback={<Loader />}><ServicesForm /></Suspense>,
                            },
                            {
                                path : "settings",
                                element: <Suspense fallback={<Loader />}><Settings /></Suspense>,
                            },
                            {
                                path : "profile",
                                element: <Suspense fallback={<Loader />}><Profile /></Suspense>,    
                            }
                        ],
                    },
                ]
            }
        ],
    },
];

export default AdminRoutes;