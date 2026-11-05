import { Avatar, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface StatCardProps {
  label: string;
  icon: React.ReactElement;
  value?: number | string | null;
  loading?: boolean;
  hint?: string;
}

function StatCard({
  label,
  icon,
  value,
  loading = false,
  hint,
}: StatCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
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
          <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
            {loading ? <Skeleton width={72} /> : (value ?? "—")}
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
