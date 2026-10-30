import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router";
import SignupPage from "./presentation/pages/signup-page";
import PublicRoute from "./presentation/guards/public-route";
import PrivateRoute from "./presentation/guards/private-route";
import HomePage from "./presentation/pages/home-page";
import LoginPage from "./presentation/pages/login-page";
import ForgotPasswordPage from "./presentation/pages/forgot-password-page";
import ResetPasswordPage from "./presentation/pages/reset-password-page";
import BagsPage from "./presentation/pages/bags-page";
import ProductsPage from "./presentation/pages/products-page";
import PickupPresetsPage from "./presentation/pages/pickup-presets-page";
import OrdersPage from "./presentation/pages/orders-page";
import ProfilePage from "./presentation/pages/profile-page";
import VerifyEmailPage from "./presentation/pages/verify-email-page";

function App() {
  return (
    <>
      <CssBaseline />

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/bags" element={<BagsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/pickup-presets" element={<PickupPresetsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
