import { Navigate, Route, Routes,useRoutes } from 'react-router-dom';
import AuthRoutes from './routes/auth/Auth.routes';
import FrontRoutes from "./routes/front/Front.routes";
import AdminRoutes from "./routes/admin/Admin.routes";
import DentistRoutes from "./routes/dentists/Dentists.routes";
function App() {
const allRoutes = [
    // ...AuthRoutes,
    ...FrontRoutes,
    ...AdminRoutes,
    ...DentistRoutes
  ];
  const routes = useRoutes(allRoutes);
  
  return (
    <>
      {routes}
    </>
  )
}

export default App
