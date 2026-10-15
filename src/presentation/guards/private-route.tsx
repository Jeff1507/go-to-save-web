import { Navigate, Outlet } from "react-router";
import { useUser } from "../../core/hooks/use-user";
import LoadingProgress from "../components/loading-progress";

function PrivateRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) return <LoadingProgress />;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default PrivateRoute;
