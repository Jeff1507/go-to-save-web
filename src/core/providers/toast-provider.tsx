import { createContext, useState, type ReactNode } from "react";
import { Toast } from "../../presentation/components/toast";

export type Severity = "success" | "error" | "warning" | "info";

type ToastContextType = {
  show: (message: string, severity?: Severity) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>("success");

  const show = (msg: string, sev: Severity = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const hide = () => setOpen(false);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      <Toast open={open} message={message} severity={severity} onClose={hide} />
    </ToastContext.Provider>
  );
}
