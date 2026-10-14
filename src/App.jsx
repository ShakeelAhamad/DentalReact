import { Navigate, Route, Routes,useRoutes } from 'react-router-dom';
import AuthRoutes from './routes/auth/Auth.routes';
import FrontRoutes from "./routes/front/Front.routes";
function App() {
const allRoutes = [
    // ...AuthRoutes,
    ...FrontRoutes
  ];
  console.log(allRoutes);
  const routes = useRoutes(allRoutes);
  
  return (
    <>
      {routes}
    </>
  )
}

export default App
