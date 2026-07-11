import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { resources } from 'app/routes/resources.ts';
import { useCreateDuelCall } from 'modules/duels/application/mutations.ts';
import {
  isDuelsCollectionCacheKey,
  useDuelPresets,
  useDuelTypes,
} from 'modules/duels/application/queries.ts';
import { DuelsRatingRow } from 'modules/duels/domain/index.ts';
import { getDuelErrorMessage } from 'modules/duels/ui/shared/helpers/getDuelErrorMessage.ts';
import KepIcon from 'shared/components/base/KepIcon';
import Logo from 'shared/components/common/Logo';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { enumParam } from 'shared/lib/queryParams';
import { cssVarRgba } from 'shared/lib/utils';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import DuelCreateCallDialog from './dialogs/DuelCreateCallDialog.tsx';

type HeroQueryState = {
  activeTab: 'my_duels' | 'waiting_room' | 'history' | '';
};

type Props = {
  userRating?: DuelsRatingRow;
};

const DuelsListPageHeroCard = ({ userRating }: Props) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const navigate = useNavigate();
  const { mutate: mutateCache } = useSWRConfig();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: presets = [] } = useDuelPresets(Boolean(currentUser && isCreateDialogOpen));
  const { data: duelTypes = [] } = useDuelTypes(Boolean(currentUser && isCreateDialogOpen));
  const { trigger: createDuelCall, isMutating: isCreatingCall } = useCreateDuelCall();
  const { setField } = useRouteQueryState<HeroQueryState>({
    defaults: {
      activeTab: '',
    },
    schema: {
      activeTab: {
        ...enumParam(['my_duels', 'waiting_room', 'history'] as const),
        param: 'tab',
      },
    },
    historyByKey: {
      activeTab: 'push',
    },
  });

  return (
    <>
      <Card
        sx={(theme) => ({
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          bgcolor: 'background.paper',
          background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.06)})`,
        })}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Stack spacing={1.5} direction="column">
              <Stack direction="row" spacing={1} alignItems="center">
                <KepIcon name="duels" fontSize={30} color="primary.main" />
                <Typography variant="h4" fontWeight={800}>
                  {t('duels.title')}
                </Typography>
              </Stack>

              <Typography variant="body1" color="text.secondary" maxWidth={720}>
                {t('duels.queueHeroDescription')}
              </Typography>
            </Stack>

            <Stack spacing={1.5} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  variant="text"
                  startIcon={<KepIcon name="duel" fontSize={18} />}
                  onClick={() => {
                    if (!currentUser) {
                      redirectToLogin();
                      return;
                    }
                    setIsCreateDialogOpen(true);
                  }}
                >
                  {t('duels.createDuel')}
                </Button>
                <Button
                  variant="text"
                  startIcon={<KepIcon name="ranking" fontSize={18} />}
                  onClick={() => navigate(resources.DuelsRating)}
                >
                  {t('duels.viewRating')}
                </Button>
              </Stack>

              {userRating ? (
                <Stack
                  direction="row"
                  spacing={1.25}
                  alignItems="center"
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Typography variant="h3" fontWeight={800}>
                    {userRating.duels ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('duels.table.duels')}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Typography color="success.main" fontWeight={700}>
                      {userRating.wins ?? 0}W
                    </Typography>
                    <Typography color="text.secondary" fontWeight={700}>
                      {userRating.draws ?? 0}D
                    </Typography>
                    <Typography color="error.main" fontWeight={700}>
                      {userRating.losses ?? 0}L
                    </Typography>
                  </Stack>
                </Stack>
              ) : null}
            </Stack>
          </Stack>
        </CardContent>

        <Box
          sx={{
            position: 'absolute',
            display: { xs: 'none', sm: 'block' },
            right: { sm: -48, md: 24 },
            bottom: { sm: -48, md: 8 },
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        >
          <Logo sx={{ width: { sm: 220, md: 280 }, height: { sm: 220, md: 280 } }} />
        </Box>
      </Card>

      <DuelCreateCallDialog
        open={isCreateDialogOpen}
        presets={presets}
        duelTypes={duelTypes}
        disabled={isCreatingCall}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (payload) => {
          try {
            await createDuelCall(payload);
            toast.success(t('duels.callCreatedToast'));
            setField('activeTab', 'my_duels');
            await mutateCache(isDuelsCollectionCacheKey, undefined, { revalidate: true });
            setIsCreateDialogOpen(false);
          } catch (error) {
            toast.error(getDuelErrorMessage(error, t('duels.error')));
          }
        }}
      />
    </>
  );
};

export default DuelsListPageHeroCard;
