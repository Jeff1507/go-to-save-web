import { Navigate, Outlet } from "react-router";
import { useUser } from "../../core/hooks/use-user";
import LoadingProgress from "../components/loading-progress";

function PublicRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) return <LoadingProgress />;

  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}

export default PublicRoute;
