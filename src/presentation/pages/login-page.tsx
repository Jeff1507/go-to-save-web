import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginPayload } from "../payloads/auth-payloads";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "../components/logo";
import { useLogin } from "../../core/hooks/use-auth";

function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: LoginPayload) => login(data);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        spacing={6}
        component={Paper}
        elevation={3}
        sx={{ width: 400, p: 4 }}
      >
        <Stack spacing={1}>
          <Logo />
          <Typography align="center" sx={{ color: "text.secondary" }}>
            Entre com suas credenciais e acesse sua conta.
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <TextField
            {...register("email")}
            label="Email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isPending}
          />
          <TextField
            {...register("password")}
            label="Senha"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isPending}
          />

          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Link
              underline="hover"
              component="button"
              onClick={() => navigate("/forgot-password")}
            >
              Esqueci a senha
            </Link>
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            sx={{ height: 56 }}
          >
            {isPending ? <CircularProgress size={18} /> : "Entrar"}
          </Button>
        </Stack>

        <Typography align="center">
          Não tem uma conta?{" "}
          <Link
            underline="hover"
            component="button"
            onClick={() => navigate("/signup")}
          >
            Cadastre-se
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}

export default LoginPage;
