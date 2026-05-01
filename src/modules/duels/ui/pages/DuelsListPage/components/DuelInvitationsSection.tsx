import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { DuelInvitation } from 'modules/duels/domain/index.ts';
import DuelInvitationCard from './DuelInvitationCard.tsx';

type Props = {
  title?: string;
  description?: string;
  actionSlot?: ReactNode;
  invitations: DuelInvitation[];
  loading?: boolean;
  emptyText: string;
  actionLoadingKey?: string | null;
  onAccept?: (invitation: DuelInvitation) => void;
  onConfirm?: (invitation: DuelInvitation) => void;
  onReject?: (invitation: DuelInvitation) => void;
  onCancel?: (invitation: DuelInvitation) => void;
  onCounter?: (invitation: DuelInvitation) => void;
  onOpen?: (invitation: DuelInvitation) => void;
};

const DuelInvitationsSection = ({
  title,
  description,
  actionSlot,
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
}: Props) => {
  return (
    <Stack spacing={2}>
      {title || description || actionSlot ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          flexWrap="wrap"
          useFlexGap
        >
          <Stack spacing={0.4}>
            {title ? (
              <Typography variant="h6" fontWeight={800}>
                {title}
                {invitations.length > 0 ? (
                  <Typography component="span" variant="subtitle2" color="text.secondary" ml={1}>
                    ({invitations.length})
                  </Typography>
                ) : null}
              </Typography>
            ) : null}
            {description ? (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            ) : null}
          </Stack>

          {actionSlot}
        </Stack>
      ) : null}

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
            onConfirm={onConfirm ? () => onConfirm(invitation) : undefined}
            onReject={onReject ? () => onReject(invitation) : undefined}
            onCancel={onCancel ? () => onCancel(invitation) : undefined}
            onCounter={onCounter ? () => onCounter(invitation) : undefined}
            onOpen={onOpen ? () => onOpen(invitation) : undefined}
          />
        ))}
    </Stack>
  );
};

export default DuelInvitationsSection;
