import {
  AppBar,
  Container,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { useRequireUser, userQueryKey } from "../../core/hooks/use-user";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../../data/repositories/auth-repository";
import { useNavigate } from "react-router";
import UserAvatar from "./user-avatar";
import Logo from "./logo";

function Navbar() {
  const user = useRequireUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      navigate("/login", { replace: true });
      queryClient.removeQueries({ queryKey: userQueryKey });
    },
  });

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "background.paper",
      }}
    >
      <Container>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Logo size="sm" />

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Tooltip title="Configurações da conta">
              <IconButton onClick={handleOpen} sx={{ p: 0 }}>
                <UserAvatar avatarUrl={user.avatarUrl} />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchor}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{ paper: { sx: { mt: 1, width: 300 } } }}
            >
              <ListItem
                component={MenuItem}
                onClick={() => {
                  navigate("/profile");
                  handleClose();
                }}
                sx={{ gap: 2 }}
              >
                <ListItemAvatar>
                  <UserAvatar avatarUrl={user.avatarUrl} size="md" />
                </ListItemAvatar>
                <ListItemText
                  sx={{ minWidth: 0 }}
                  primary={
                    <Typography noWrap sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                  }
                  secondary={user.email}
                />
              </ListItem>

              <Divider />

              <MenuItem
                onClick={() => {
                  logout();
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <LogoutOutlined fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary="Sair" sx={{ color: "error.main" }} />
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
