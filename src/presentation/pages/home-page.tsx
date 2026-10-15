import { useRequireUser } from "../../core/hooks/use-user";
import AppLayout from "../components/app-layout";

function HomePage() {
  const user = useRequireUser();
  return <AppLayout>{JSON.stringify(user)}</AppLayout>;
}

export default HomePage;
