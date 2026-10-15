import { Box, Container, type Breakpoint } from "@mui/material";
import type { ReactNode } from "react";
import Navbar from "./navbar";

interface AppLayoutProps {
  children: ReactNode;
  maxWidth?: Breakpoint;
}

function AppLayout({ children, maxWidth = "lg" }: AppLayoutProps) {
  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Box component="main" sx={{ flex: 1, overflowY: "auto" }}>
        <Container maxWidth={maxWidth} sx={{ flex: 1, py: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export default AppLayout;
