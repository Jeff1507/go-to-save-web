import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  HomeOutlined,
  Inventory2Outlined,
  LogoutOutlined,
  MenuOutlined,
  ReceiptLongOutlined,
  ScheduleOutlined,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import { useRequireUser, userQueryKey } from "../../core/hooks/use-user";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router";
import UserAvatar from "./user-avatar";
import Logo from "./logo";
import { useLogout } from "../../core/hooks/use-auth";

const tabs = [
  { label: "Início", to: "/", icon: <HomeOutlined />, end: true },
  { label: "Sacolas", to: "/bags", icon: <ShoppingBagOutlined /> },
  { label: "Produtos", to: "/products", icon: <Inventory2Outlined /> },
  {
    label: "Janelas de retirada",
    to: "/pickup-presets",
    icon: <ScheduleOutlined />,
  },
  { label: "Pedidos", to: "/orders", icon: <ReceiptLongOutlined /> },
];

function NavTabs() {
  return (
    <Stack component="nav" direction="row" spacing={0.5}>
      {tabs.map(({ label, to, icon, end }) => (
        <Button
          key={to}
          component={NavLink}
          to={to}
          end={end}
          startIcon={icon}
          color="inherit"
          sx={(theme) => ({
            px: 2,
            py: 1,
            borderRadius: 3,
            whiteSpace: "nowrap",
            fontWeight: 500,
            color: "text.secondary",
            "&:hover": { bgcolor: "action.hover" },
            '&[aria-current="page"]': {
              color: "primary.main",
              fontWeight: 600,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          })}
        >
          {label}
        </Button>
      ))}
    </Stack>
  );
}

function NavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 280 } } }}
    >
      <Box sx={{ p: 2 }}>
        <Logo size="sm" />
      </Box>

      <Divider />

      <List component="nav" sx={{ p: 1.5 }}>
        {tabs.map(({ label, to, icon, end }) => (
          <ListItemButton
            key={to}
            component={NavLink}
            to={to}
            end={end}
            onClick={onClose}
            sx={(theme) => ({
              mb: 0.5,
              borderRadius: 3,
              color: "text.secondary",
              "& .MuiListItemIcon-root": { color: "inherit", minWidth: 40 },
              "&:hover": { bgcolor: "action.hover" },
              '&[aria-current="page"]': {
                color: "primary.main",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                "& .MuiListItemText-primary": { fontWeight: 600 },
              },
            })}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

function Navbar() {
  const user = useRequireUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"), {
    noSsr: true,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // const { mutate: logout } = useMutation({
  //   mutationFn: logoutUser,
  //   onSuccess: () => {
  //     navigate("/login", { replace: true });
  //     queryClient.removeQueries({ queryKey: userQueryKey });
  //   },
  // });

  const { mutate: logout } = useLogout();

  const onLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/login", { replace: true });
        queryClient.removeQueries({ queryKey: userQueryKey });
      },
    });
  };

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchor(event.currentTarget);

  const handleClose = () => setAnchor(null);

  return (
    <AppBar
      position="sticky"
      variant="outlined"
      sx={{
        bgcolor: "background.paper",
      }}
    >
      <Container>
        <Toolbar
          disableGutters
          sx={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: "1fr auto 1fr",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {isMobile && (
              <IconButton
                edge="start"
                aria-label="Abrir menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuOutlined />
              </IconButton>
            )}
            <Logo size="sm" />
          </Stack>

          {!isMobile && <NavTabs />}

          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", justifySelf: "end" }}
          >
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
                  onLogout();
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

      {isMobile && (
        <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}
    </AppBar>
  );
}

export default Navbar;
