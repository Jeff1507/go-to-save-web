import { useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  AddPhotoAlternateOutlined,
  DeleteOutlined,
  PhotoCameraOutlined,
} from "@mui/icons-material";
import { useRemoveAvatar, useUpdateAvatar } from "../../core/hooks/use-user";
import { useToast } from "../../core/hooks/use-toast";
import UserAvatar from "./user-avatar";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_MB = 5;

interface EditableAvatarProps {
  avatarUrl: string | null;
}

function EditableAvatar({ avatarUrl }: EditableAvatarProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const { mutate: update, isPending: isUpdating } = useUpdateAvatar();
  const { mutate: remove, isPending: isRemoving } = useRemoveAvatar();
  const isPending = isUpdating || isRemoving;

  const closeMenu = () => setAnchor(null);

  const chooseFile = () => {
    closeMenu();
    inputRef.current?.click();
  };

  const removePhoto = () => {
    closeMenu();
    remove();
  };

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.show("Formato não suportado. Use PNG, JPG ou WEBP.", "error");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.show(`A imagem deve ter no máximo ${MAX_SIZE_MB} MB.`, "error");
      return;
    }

    update(file);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignSelf: "flex-start",
      }}
    >
      <UserAvatar avatarUrl={avatarUrl} size="lg" />

      {isPending && (
        <Box
          sx={(theme) => ({
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette.background.paper, 0.7),
          })}
        >
          <CircularProgress size={28} />
        </Box>
      )}

      <IconButton
        aria-label="Alterar foto do perfil"
        aria-haspopup="menu"
        disabled={isPending}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{
          position: "absolute",
          right: 0,
          bottom: 0,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          boxShadow: 1,
          "&:hover": { bgcolor: "background.paper" },
        }}
      >
        <PhotoCameraOutlined fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={closeMenu}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <MenuItem onClick={chooseFile}>
          <ListItemIcon>
            <AddPhotoAlternateOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Escolher foto" />
        </MenuItem>
        <MenuItem disabled={!avatarUrl} onClick={removePhoto}>
          <ListItemIcon>
            <DeleteOutlined
              fontSize="small"
              color={avatarUrl ? "error" : "disabled"}
            />
          </ListItemIcon>
          <ListItemText
            primary="Remover foto"
            sx={{ color: avatarUrl ? "error.main" : undefined }}
          />
        </MenuItem>
      </Menu>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        hidden
        onChange={handleSelect}
      />
    </Box>
  );
}

export default EditableAvatar;
