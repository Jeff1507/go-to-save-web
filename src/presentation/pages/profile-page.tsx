import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  EditOutlined,
  InfoOutlined,
  LockOutlined,
  LogoutOutlined,
  MailOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import AppLayout from "../components/app-layout";
import ExpandableText from "../components/expandable-text";
import { useRequireUser } from "../../core/hooks/use-user";
import type { User } from "../../data/models/user";
import { formatCep, formatCnpj } from "../../utils/format-document";
import EditableAvatar from "../components/editable-avatar";
import EditProfileForm from "../components/edit-profile-form";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

type TabValue =
  | "account"
  | "profile"
  | "address"
  | "email"
  | "password"
  | "sessions";

const TABS: { value: TabValue; label: string; icon: React.ReactElement }[] = [
  { value: "account", label: "Informações da conta", icon: <InfoOutlined /> },
  { value: "profile", label: "Editar perfil", icon: <EditOutlined /> },
  { value: "address", label: "Editar endereço", icon: <PlaceOutlined /> },
  { value: "email", label: "Mudar e-mail", icon: <MailOutlined /> },
  { value: "password", label: "Mudar senha", icon: <LockOutlined /> },
  {
    value: "sessions",
    label: "Encerrar todas as sessões",
    icon: <LogoutOutlined />,
  },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 2, sm: 3 }, width: "100%", height: "min-content" }}
    >
      <Stack spacing={2}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {children}
      </Stack>
    </Paper>
  );
}

function InfoRow({
  label,
  children,
  fullWidth = false,
}: {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <Stack spacing={0.25} sx={{ gridColumn: fullWidth ? "1 / -1" : undefined }}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body2" component="div">
        {children}
      </Typography>
    </Stack>
  );
}

function AccountSection({ user }: { user: User }) {
  const { address } = user;

  return (
    <Section title="Informações da conta">
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        }}
      >
        <InfoRow label="E-mail">{user.email}</InfoRow>
        <InfoRow label="CNPJ">{formatCnpj(user.cnpj)}</InfoRow>
        <InfoRow label="Cadastrada em">
          {dateFormatter.format(new Date(user.createdAt))}
        </InfoRow>

        <InfoRow label="Endereço">
          <Stack spacing={0.25}>
            <Typography variant="body2">
              {`${address.street}, ${address.number} — ${address.neighborhood}, ${address.city}/${address.state}`}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              CEP {formatCep(address.postalCode)}
            </Typography>
            <Link
              variant="body2"
              href={`https://www.openstreetmap.org/?mlat=${address.latitude}&mlon=${address.longitude}#map=17/${address.latitude}/${address.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver no mapa
            </Link>
          </Stack>
        </InfoRow>
      </Box>
    </Section>
  );
}

function ProfilePage() {
  const user = useRequireUser();
  const { rating } = user;
  const [tab, setTab] = useState<TabValue>("account");

  const activeTab = TABS.find((item) => item.value === tab) ?? TABS[0];

  return (
    <AppLayout>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "stretch", md: "flex-start" } }}
      >
        <Stack
          spacing={2}
          component={Paper}
          variant="outlined"
          sx={{
            width: { xs: "100%", md: 360 },
            flexShrink: 0,
            py: { xs: 2, sm: 3 },
          }}
        >
          <Stack spacing={2} sx={{ px: { xs: 2, sm: 3 } }}>
            <EditableAvatar avatarUrl={user.avatarUrl} />

            <Stack spacing={0.5}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>

              {rating.count > 0 ? (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <Rating
                    readOnly
                    precision={0.1}
                    size="small"
                    value={rating.average}
                  />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {rating.average.toFixed(1)} ({rating.count}{" "}
                    {rating.count === 1 ? "avaliação" : "avaliações"})
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Ainda sem avaliações
                </Typography>
              )}
            </Stack>

            <ExpandableText
              text={user.description ?? "Nenhuma descrição informada."}
              maxLines={3}
            />
          </Stack>

          {!user.verifiedAt ? (
            <Alert
              severity="warning"
              action={<Button size="small">Verificar</Button>}
            >
              Email não verificado.
            </Alert>
          ) : null}

          <Tabs
            orientation="vertical"
            value={tab}
            onChange={(_event, value: TabValue) => setTab(value)}
            aria-label="Seções do perfil"
          >
            {TABS.map(({ value, label, icon }) => (
              <Tab
                key={value}
                value={value}
                label={label}
                icon={icon}
                iconPosition="start"
                id={`profile-tab-${value}`}
                aria-controls={`profile-panel-${value}`}
                sx={{
                  justifyContent: "flex-start",
                  minHeight: 44,
                  textAlign: "left",
                  ...(value === "sessions" && {
                    color: "error.main",
                    "&.Mui-selected": { color: "error.main" },
                  }),
                }}
              />
            ))}
          </Tabs>
        </Stack>

        <Box
          role="tabpanel"
          id={`profile-panel-${tab}`}
          aria-labelledby={`profile-tab-${tab}`}
          sx={{ flex: 1, minWidth: 0, width: "100%" }}
        >
          {tab === "account" ? (
            <AccountSection user={user} />
          ) : tab === "profile" ? (
            <Section title="Editar perfil">
              <EditProfileForm user={user} />
            </Section>
          ) : (
            <Section title={activeTab.label}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                O conteúdo desta seção ainda será implementado.
              </Typography>
            </Section>
          )}
        </Box>
      </Stack>
    </AppLayout>
  );
}

export default ProfilePage;
