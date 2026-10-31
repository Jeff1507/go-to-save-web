import { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { useLogoutAll } from "../../core/hooks/use-auth";

function EndSessionsPanel() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate: logoutAll, isPending } = useLogoutAll();

  return (
    <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Desconecte a sua conta de todos os dispositivos em que ela está aberta,
        inclusive deste. Use se perdeu um aparelho ou desconfia de um acesso
        indevido.
      </Typography>

      <Button
        variant="outlined"
        color="error"
        startIcon={<LogoutOutlined />}
        onClick={() => setConfirmOpen(true)}
      >
        Encerrar todas as sessões
      </Button>

      <Dialog
        open={confirmOpen}
        onClose={isPending ? undefined : () => setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Encerrar todas as sessões?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Você será desconectado de todos os dispositivos, inclusive deste, e
            precisará entrar novamente com o seu e-mail e senha.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={isPending}
            onClick={() => logoutAll()}
          >
            {isPending ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Encerrar sessões"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default EndSessionsPanel;
