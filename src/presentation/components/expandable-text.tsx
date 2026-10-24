import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
}

function ExpandableText({ text, maxLines = 3 }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = textRef.current;

    if (!element) return;

    const checkOverflow = () => {
      if (expanded) return;

      setIsOverflowing(element.scrollHeight > element.clientHeight);
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);

    return () => observer.disconnect();
  }, [text, maxLines, expanded]);

  return (
    <Box>
      <Typography
        ref={textRef}
        variant="body2"
        sx={{
          lineHeight: 1.5,
          overflowWrap: "anywhere",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? "unset" : maxLines,
          overflow: "hidden",
        }}
      >
        {text}
      </Typography>

      {isOverflowing && (
        <Button
          size="small"
          onClick={() => setExpanded((prev) => !prev)}
          sx={{ px: 0, mt: 0.5 }}
        >
          {expanded ? "Mostrar menos" : "Mostrar mais"}
        </Button>
      )}
    </Box>
  );
}

export default ExpandableText;
