import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useUpdateAddress } from "../../core/hooks/use-user";
import type { User } from "../../data/models/user";
import AddressLocationForm from "./address-location-form";

function EditAddressForm({ user }: { user: User }) {
  const { mutate: updateAddress, isPending } = useUpdateAddress();

  return (
    <Stack spacing={2}>
      <AddressLocationForm
        defaultValues={user.address}
        onSubmit={(address) => updateAddress(address)}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          form="address-form"
          variant="contained"
          disabled={isPending}
        >
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </Box>
    </Stack>
  );
}

export default EditAddressForm;
