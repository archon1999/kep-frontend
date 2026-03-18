import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DuelInvitation } from '../../domain/index.ts';
import DuelInvitationCard from './DuelInvitationCard.tsx';

type Props = {
  title: string;
  invitations: DuelInvitation[];
  loading?: boolean;
  emptyText: string;
  actionLoadingKey?: string | null;
  onAccept?: (invitation: DuelInvitation) => void;
  onReject?: (invitation: DuelInvitation) => void;
  onCounter?: (invitation: DuelInvitation) => void;
  onOpen?: (invitation: DuelInvitation) => void;
};

const DuelInvitationsSection = ({
  title,
  invitations,
  loading,
  emptyText,
  actionLoadingKey,
  onAccept,
  onReject,
  onCounter,
  onOpen,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={800}>
        {title}
        {!!invitations.length ? (
          <Typography component="span" variant="subtitle2" color="text.secondary" ml={1}>
            ({invitations.length})
          </Typography>
        ) : null}
      </Typography>

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
          <DuelInvitationCard
            key={invitation.id}
            invitation={invitation}
            actionLoadingKey={actionLoadingKey}
            onAccept={onAccept ? () => onAccept(invitation) : undefined}
            onReject={onReject ? () => onReject(invitation) : undefined}
            onCounter={onCounter ? () => onCounter(invitation) : undefined}
            onOpen={onOpen ? () => onOpen(invitation) : undefined}
          />
        ))}
    </Stack>
  );
};

export default DuelInvitationsSection;
