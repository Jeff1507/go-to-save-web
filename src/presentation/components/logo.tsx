import "@fontsource/cherry-bomb-one";
import { Typography } from "@mui/material";

type LogoSize = "sm" | "md" | "lg";

const fontSizes = {
  sm: "1.5rem",
  md: "2rem",
  lg: "3rem",
} as const;

function Logo({ size }: { size?: LogoSize }) {
  return (
    <Typography
      component="h1"
      align="center"
      color="primary"
      sx={{
        fontFamily: "Cherry Bomb One",
        fontSize: size ? fontSizes[size] : fontSizes.md,
      }}
    >
      Go To Save
    </Typography>
  );
}

export default Logo;
