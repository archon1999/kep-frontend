import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { DuelInvitation } from 'modules/duels/domain/index.ts';
import DuelsListPageInvitationCard from './components/DuelsListPageInvitationCard.tsx';

type Props = {
  title: string;
  description: string;
  invitations: DuelInvitation[];
  loading?: boolean;
  emptyText: string;
  actionLoadingKey?: string | null;
  onAccept: (invitation: DuelInvitation) => void;
  onConfirm: (invitation: DuelInvitation) => void;
  onReject: (invitation: DuelInvitation) => void;
  onCancel: (invitation: DuelInvitation) => void;
  onCounter: (invitation: DuelInvitation) => void;
  onOpen: (invitation: DuelInvitation) => void;
};

const DuelsListPageCallsTab = ({
  title,
  description,
  invitations,
  loading,
  emptyText,
  actionLoadingKey,
  onAccept,
  onConfirm,
  onReject,
  onCancel,
  onCounter,
  onOpen,
}: Props) => (
  <Stack spacing={2}>
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={2}
      flexWrap="wrap"
      useFlexGap
    >
      <Stack spacing={0.4}>
        <Typography variant="h6" fontWeight={800}>
          {title}
          {invitations.length > 0 ? (
            <Typography component="span" variant="subtitle2" color="text.secondary" ml={1}>
              ({invitations.length})
            </Typography>
          ) : null}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Stack>

    {loading
      ? Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Skeleton width="50%" />
                <Skeleton width="80%" />
                <Skeleton width="40%" />
              </Stack>
            </CardContent>
          </Card>
        ))
      : null}

    {!loading && !invitations.length ? (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {emptyText}
          </Typography>
        </CardContent>
      </Card>
    ) : null}

    {!loading &&
      invitations.map((invitation) => (
        <DuelsListPageInvitationCard
          key={invitation.id}
          invitation={invitation}
          actionLoadingKey={actionLoadingKey}
          onAccept={() => onAccept(invitation)}
          onConfirm={() => onConfirm(invitation)}
          onReject={() => onReject(invitation)}
          onCancel={() => onCancel(invitation)}
          onCounter={() => onCounter(invitation)}
          onOpen={() => onOpen(invitation)}
        />
      ))}
  </Stack>
);

export default DuelsListPageCallsTab;
