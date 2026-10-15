import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router";
import SignupPage from "./presentation/pages/signup-page";
import PublicRoute from "./presentation/guards/public-route";
import PrivateRoute from "./presentation/guards/private-route";
import HomePage from "./presentation/pages/home-page";

function App() {
  return (
    <>
      <CssBaseline />

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
