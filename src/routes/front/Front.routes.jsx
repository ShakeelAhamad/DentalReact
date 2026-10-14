import { lazy, Suspense } from "react";
import Loader from "../../components/ui/Loader";
import FrontLayout from "../../layout/front/FrontLayout";
const Home = lazy(() => import("../../pages/front/Home"));
const Services = lazy(() => import("../../pages/front/Services"));
const OurDoctors = lazy(() => import("../../pages/front/OurDoctors"));
const WhyChooseUs = lazy(() => import("../../pages/front/WhyChooseUs"));
const Contact = lazy(() => import("../../pages/front/Contact"));

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
        ]
    }
];

export default AuthRoutes;