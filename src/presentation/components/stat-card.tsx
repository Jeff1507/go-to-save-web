import { Avatar, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface StatCardProps {
  label: string;
  icon: React.ReactElement;
  value?: number | string | null;
  hint?: string;
}

function StatCard({ label, icon, value, hint }: StatCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "start" }}>
        <Avatar
          variant="rounded"
          sx={(theme) => ({
            width: 48,
            height: 48,
            color: "primary.main",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          })}
        >
          {icon}
        </Avatar>

        <Stack sx={{ minWidth: 0 }}>
          <Typography variant="body2" noWrap sx={{ color: "text.secondary" }}>
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {value ?? "—"}
          </Typography>
          {hint && (
            <Typography
              variant="caption"
              noWrap
              sx={{ color: "text.secondary" }}
            >
              {hint}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

export default StatCard;
