import { Avatar } from "@mui/material";
import { resolveMediaUrl } from "../../utils/resolve-media-url";

type AvatarSize = "md" | "lg";

const sizes = {
  md: 56,
  lg: 96,
} as const;

interface UserAvatarProps {
  avatarUrl: string | null;
  size?: AvatarSize;
}

function UserAvatar({ avatarUrl, size }: UserAvatarProps) {
  return (
    <Avatar
      alt="Profile Picture"
      src={resolveMediaUrl(avatarUrl) ?? "/doro.jpg"}
      sx={{
        width: size ? sizes[size] : undefined,
        height: size ? sizes[size] : undefined,
      }}
    />
  );
}

export default UserAvatar;
