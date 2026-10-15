import { Alert, Snackbar } from "@mui/material";
import { CheckCircleOutlined } from "@mui/icons-material";
import type { Severity } from "../../core/providers/toast-provider";

interface ToastProps {
  open: boolean;
  message: string;
  severity: Severity;
  onClose: () => void;
}

export function Toast({ open, message, severity, onClose }: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        elevation={3}
        severity={severity}
        onClose={onClose}
        sx={{ bgcolor: "background.paper" }}
        iconMapping={{
          success: <CheckCircleOutlined />,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
