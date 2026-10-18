import { useEffect, useState } from "react";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import {
  DeleteOutlined,
  ImageOutlined,
  UploadOutlined,
} from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import { ACCEPTED_FILES, FILE_MAX_SIZE_MB } from "../payloads/product-payloads";

interface ImageFieldProps {
  file: File | null | undefined;
  onFileChange: (file: File | null) => void;
  currentUrl?: string | null;
  removeCurrent?: boolean;
  onRemoveCurrentChange?: (remove: boolean) => void;
  error?: string;
}

function ImageField({
  file,
  onFileChange,
  currentUrl,
  removeCurrent = false,
  onRemoveCurrentChange,
  error,
}: ImageFieldProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const keptUrl = currentUrl && !removeCurrent ? currentUrl : null;
  const preview = objectUrl ?? keptUrl;
  const willRemove = !!currentUrl && removeCurrent && !file;

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!selected) return;

    onFileChange(selected);
    onRemoveCurrentChange?.(false);
  };

  const handleRemove = () => {
    if (file) onFileChange(null);
    else onRemoveCurrentChange?.(true);
  };

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Avatar
        variant="rounded"
        src={preview ?? undefined}
        sx={{ width: 96, height: 96 }}
      >
        <ImageOutlined fontSize="large" />
      </Avatar>

      <Stack spacing={1} sx={{ alignItems: "flex-start", minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{ color: error ? "error.main" : "text.secondary" }}
        >
          {error ??
            (willRemove
              ? "A imagem atual será removida ao salvar."
              : `PNG, JPG ou WEBP, até ${FILE_MAX_SIZE_MB} MB.`)}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          <Button
            component="label"
            role={undefined}
            tabIndex={-1}
            size="small"
            variant="outlined"
            startIcon={<UploadOutlined />}
          >
            {preview ? "Trocar imagem" : "Escolher imagem"}
            <Box
              component="input"
              type="file"
              accept={ACCEPTED_FILES.join(",")}
              onChange={handleSelect}
              sx={visuallyHidden}
            />
          </Button>

          {preview && (
            <Button
              size="small"
              color="error"
              startIcon={<DeleteOutlined />}
              onClick={handleRemove}
            >
              Remover
            </Button>
          )}

          {willRemove && (
            <Button size="small" onClick={() => onRemoveCurrentChange?.(false)}>
              Desfazer
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ImageField;
