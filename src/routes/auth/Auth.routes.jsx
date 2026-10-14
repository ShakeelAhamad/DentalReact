import { lazy, Suspense } from "react";
import Loader from "../../components/ui/Loader";
const Login       = lazy(() => import("../../pages/auth/Login"));
const Signup      = lazy(() => import("../../pages/auth/SignUp"));

const AuthRoutes = [
  {
    path: "/login",
    element: <Suspense fallback={<Loader />}><Login /></Suspense>,
  },
  {
    path: "/signup",
    element: <Suspense fallback={<Loader />}><Signup /></Suspense>,
  },
];

export default AuthRoutes;